/**
 * One-shot production image pass over public/images.
 *
 * Astro does not process files in public/ — whatever ships there ships raw, so
 * the Figma exports (27 MB, photographs saved as PNG) were the site's largest
 * production problem. This does three things and nothing else:
 *
 *   1. downscale to MAX_EDGE (never upscales)
 *   2. opaque PNG  -> JPEG   (a photo has no business being a PNG)
 *      transparent -> stays PNG, just recompressed
 *   3. re-encode JPEG with mozjpeg
 *
 * Renamed files are rewritten across src/ so no reference dangles.
 *
 * ponytail: run-once, in place. Re-running re-encodes already-encoded JPEGs and
 * loses a little more each time — originals live in git, restore before a rerun.
 *
 *   node scripts/optimize-images.mjs [--dry]
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'public/images';
const SRC = 'src';
const MAX_EDGE = 1920;
const JPEG = { quality: 80, mozjpeg: true, progressive: true, chromaSubsampling: '4:2:0' };
const DRY = process.argv.includes('--dry');

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });

const kb = (n) => Math.round(n / 1024);
const renames = [];
let before = 0;
let after = 0;

for (const file of walk(ROOT).filter((f) => /\.(png|jpe?g)$/i.test(f))) {
  const size = fs.statSync(file).size;
  before += size;

  const img = sharp(file);
  const meta = await img.metadata();
  // stats() decodes the alpha channel — a PNG can carry one and never use it.
  const opaque = meta.hasAlpha ? (await sharp(file).stats()).isOpaque : true;

  const resize =
    Math.max(meta.width, meta.height) > MAX_EDGE
      ? { width: meta.width >= meta.height ? MAX_EDGE : null, height: meta.height > meta.width ? MAX_EDGE : null, withoutEnlargement: true }
      : null;

  const toJpeg = opaque;
  const out = toJpeg ? file.replace(/\.png$/i, '.jpg') : file;
  const tmp = `${out}.tmp`;

  let pipe = sharp(file);
  if (resize) pipe = pipe.resize(resize);
  pipe = toJpeg
    ? pipe.flatten({ background: '#ffffff' }).jpeg(JPEG)
    : pipe.png({ compressionLevel: 9, effort: 10 });

  if (DRY) {
    const buf = await pipe.toBuffer();
    after += buf.length;
    console.log(`${kb(size)}KB -> ${kb(buf.length)}KB  ${file}${out !== file ? ` => ${path.basename(out)}` : ''}`);
    continue;
  }

  await pipe.toFile(tmp);
  const newSize = fs.statSync(tmp).size;

  // Never make a file bigger. A well-compressed source stays untouched.
  if (newSize >= size && !resize && out === file) {
    fs.unlinkSync(tmp);
    after += size;
    continue;
  }

  fs.renameSync(tmp, out);
  if (out !== file) {
    fs.unlinkSync(file);
    renames.push([file.replace(/^public/, ''), out.replace(/^public/, '')]);
  }
  after += newSize;
  console.log(`${String(kb(size)).padStart(5)}KB -> ${String(kb(newSize)).padStart(5)}KB  ${out.replace('public/images/', '')}`);
}

if (renames.length && !DRY) {
  const sources = walk(SRC).filter((f) => /\.(astro|ts|tsx|js|mjs|md)$/.test(f));
  let touched = 0;
  for (const f of sources) {
    const orig = fs.readFileSync(f, 'utf8');
    let next = orig;
    for (const [from, to] of renames) next = next.split(from).join(to);
    if (next !== orig) {
      fs.writeFileSync(f, next);
      touched++;
    }
  }
  console.log(`\nrenamed ${renames.length} png -> jpg, rewrote refs in ${touched} source files`);
}

console.log(`\ntotal ${kb(before)}KB -> ${kb(after)}KB  (-${Math.round((1 - after / before) * 100)}%)`);
