/**
 * Pre-deploy gate over dist/. Fails the process on anything that would be a
 * live bug, warns on things a human should look at.
 *
 * There is no test framework here and this needs none — it is regex over built
 * HTML, which is exactly the layer where a broken link or a lost <h1> shows up.
 *
 *   npm run build && node scripts/verify-build.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const fail = [];
const warn = [];

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

const all = walk(DIST);
const pages = all.filter((f) => f.endsWith('.html'));
const routeOf = (f) => '/' + path.relative(DIST, f).replace(/index\.html$/, '').replace(/\\/g, '/');

// A URL is servable if it maps to a built file or a built directory index.
const servable = new Set(all.map((f) => '/' + path.relative(DIST, f).replace(/\\/g, '/')));
const routes = new Set(pages.map(routeOf));

const titles = new Map();
const descs = new Map();

for (const file of pages) {
  const route = routeOf(file);
  const html = fs.readFileSync(file, 'utf8');
  const at = (msg) => `${route} — ${msg}`;

  // --- head -----------------------------------------------------------------
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!title) fail.push(at('no <title>'));
  if (!desc) fail.push(at('no meta description'));
  if (title) (titles.get(title) ?? titles.set(title, []).get(title)).push(route);
  if (desc) (descs.get(desc) ?? descs.set(desc, []).get(desc)).push(route);
  // Measure the page-specific half only. Every title carries a " | <brand>"
  // suffix that Google is expected to cut; what must survive the ~60-char
  // window is the distinctive part in front of it.
  const titleHead = title?.split(' | ')[0] ?? '';
  if (titleHead.length > 60) warn.push(at(`title ${titleHead.length} chars before the brand suffix (>60 truncates)`));
  if (desc && desc.length > 160) warn.push(at(`meta description ${desc.length} chars (>160 truncates)`));
  if (!/<link rel="canonical"/.test(html)) fail.push(at('no canonical'));
  if (!/property="og:image"/.test(html)) fail.push(at('no og:image'));

  // --- structure ------------------------------------------------------------
  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) fail.push(at(`${h1s.length} <h1> (must be exactly 1)`));

  // --- images ---------------------------------------------------------------
  for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
    // Astro serialises alt="" as a bare `alt`, which HTML treats as the empty
    // string — the correct marking for a decorative image. Match both forms.
    if (!/\salt(=|[\s>/])/.test(tag)) fail.push(at(`<img> with no alt: ${tag.slice(0, 90)}`));
    const src = tag.match(/\ssrc="([^"]+)"/)?.[1];
    if (src?.startsWith('/') && !servable.has(src)) fail.push(at(`broken image src ${src}`));
  }

  // --- internal links -------------------------------------------------------
  for (const m of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    const href = m[1];
    if (!href.startsWith('/')) continue; // external, mailto:, tel:, #anchor
    const clean = href.split('#')[0].split('?')[0];
    if (!clean || clean === '/') continue;
    const withSlash = clean.endsWith('/') ? clean : clean + '/';
    if (!routes.has(withSlash) && !servable.has(clean)) fail.push(at(`dead internal link ${href}`));
  }

  // --- structured data ------------------------------------------------------
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      fail.push(at(`invalid JSON-LD: ${e.message}`));
    }
  }

  // --- things that must never ship -----------------------------------------
  // A POST form with no action re-requests the page and drops the submission.
  for (const tag of html.match(/<form\b[^>]*>/g) ?? []) {
    if (!/\saction="/.test(tag) && !/\sclass="[^"]*\bhidden\b/.test(tag))
      fail.push(at('visible <form> with no action — submissions go nowhere'));
  }
  if (/href="https:\/\/www\.(instagram|linkedin|facebook)\.com\/?"/.test(html))
    fail.push(at('social link points at the network homepage, not a profile'));

  const noindex = /content="noindex/.test(html);
  if (noindex) warn.push(at('noindex'));
}

// --- cross-page -------------------------------------------------------------
for (const [t, rs] of titles) if (rs.length > 1) fail.push(`duplicate <title> "${t}" on ${rs.join(', ')}`);
for (const rs of descs.values()) if (rs.length > 1) warn.push(`duplicate meta description on ${rs.join(', ')}`);

// --- site-level files -------------------------------------------------------
for (const f of ['/robots.txt', '/sitemap-index.xml', '/404.html', '/apple-touch-icon.png', '/favicon-32.png'])
  if (!servable.has(f)) fail.push(`missing ${f}`);

const robots = fs.existsSync(`${DIST}/robots.txt`) ? fs.readFileSync(`${DIST}/robots.txt`, 'utf8') : '';
if (!/^Sitemap:\s*https?:\/\//m.test(robots)) fail.push('robots.txt has no absolute Sitemap: line');

// Every sitemap URL must be a real, indexable page.
const sitemapXml = all
  .filter((f) => /sitemap-\d+\.xml$/.test(f))
  .map((f) => fs.readFileSync(f, 'utf8'))
  .join('');
for (const m of sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const p = new URL(m[1]).pathname;
  if (!routes.has(p)) fail.push(`sitemap lists ${p} but no such page was built`);
  else {
    const html = fs.readFileSync(path.join(DIST, p, 'index.html'), 'utf8');
    if (/content="noindex/.test(html)) fail.push(`sitemap lists noindex page ${p}`);
  }
}

// --- payload ----------------------------------------------------------------
const bytes = all.reduce((s, f) => s + fs.statSync(f).size, 0);
const heaviest = all
  .map((f) => [f, fs.statSync(f).size])
  .sort((a, b) => b[1] - a[1])
  .slice(0, 3);

// --- report -----------------------------------------------------------------
console.log(`${pages.length} pages · ${(bytes / 1e6).toFixed(1)} MB total`);
console.log(`heaviest: ${heaviest.map(([f, s]) => `${path.relative(DIST, f)} ${Math.round(s / 1024)}KB`).join(', ')}`);
if (warn.length) console.log(`\nWARN (${warn.length})\n` + warn.map((w) => '  · ' + w).join('\n'));
if (fail.length) {
  console.error(`\nFAIL (${fail.length})\n` + fail.map((f) => '  ✗ ' + f).join('\n'));
  process.exit(1);
}
console.log('\nAll checks passed.');
