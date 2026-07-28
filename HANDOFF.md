# Projected Growth Consulting — build handoff

Astro 5 + Tailwind v4, built from Figma `m9rsqbLlGpyArT5B7oHqUh` ("Mega Projected
Growth Consultancy — CF"). **23 routes** — the 14 designed pages, 8 blog
article shells, and a 404.

```
npm install && npm run dev      # localhost:4321
npm run build && npm run preview
npm run verify                  # build + the pre-deploy gate (see below)
```

- `figma-map.json` — every route → Figma desktop/mobile node ids + per-section
  pixel heights. The design↔code trace; section roots carry `data-node-id`.
- `BREAKPOINTS.md` — the doctrine for 768/1024/1280, which Figma never drew.
  Read it before adding a section.

## Launch readiness — what is done

A production pass ran on 2026-07-28. Everything in this section is **shipped and
verified**; the client blockers that follow are what is left.

| Area | State |
|---|---|
| **Images** | 27.5 MB → **7.1 MB (−74%)**. Photographs exported as PNG were converted to JPEG, everything capped at 1920px, all references rewritten. The home LCP image went 1.9 MB → 94 KB; the homepage now ships 1.1 MB of images across 21 files. Re-run with `npm run optimize-images` **only after restoring originals from git** — it re-encodes in place. |
| **robots.txt** | `public/robots.txt`, allow-all, absolute `Sitemap:` line. |
| **XML sitemap** | `@astrojs/sitemap`. Emits the 14 real routes and **excludes the 8 noindex shells** via `publishedSlugs` in `src/lib/posts.ts` — the same constant `blog/[slug].astro` uses, so the two cannot drift. |
| **404** | `src/pages/404.astro` — noindex, routes into the four money pages plus phone/contact. |
| **Structured data** | `Organization` + `WebSite` on every route from `Base.astro`, built only from facts already published on the site. `sameAs` is **omitted** rather than guessed. Article + BreadcrumbList remain on the one written post. |
| **Meta** | `og:site_name`, `og:locale`, `og:image:alt`, `theme-color`, and an explicit `max-image-preview:large` robots tag. All 9 over-long descriptions trimmed under the ~160-char SERP cut (claims unchanged, cuts only). |
| **Favicons** | Generated from the real brand mark on navy: `favicon-32.png`, `apple-touch-icon.png`, `icon-192/512.png`, `site.webmanifest`. The placeholder `favicon.svg` is gone. |
| **Header on light heroes** | `Header` now takes `theme="light"`. This **replaced two copies** of a `body:has(section[data-node-id=…]) > header` repaint — both of which named this prop as the real fix — and prevented a third on /404. |
| **Header dropdown a11y** | `aria-expanded` (set from script, so it can't lie with JS off), Escape to dismiss, and tap-to-open where there is no hover. |
| **Security / caching** | `public/_headers` (Netlify / Cloudflare Pages): nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy, HSTS; immutable caching for `/_astro/*`. **No CSP** — writing one blind would break Calendly, which is the primary conversion. Add it after launch from a real request log. |
| **Analytics** | GA4 + GSC meta verification, both env-gated. Unset means zero requests and no consent surface. |

### Environment variables

All optional, all `PUBLIC_` (inlined at build — never put a secret here). See
`.env.example`. Each unset value degrades to something that still works:

| Variable | Unset behaviour |
|---|---|
| `PUBLIC_FORM_ENDPOINT` | /contact-us hides the form and shows an email/phone panel |
| `PUBLIC_CALENDLY_URL` | /book-a-call shows a "Request A Time" CTA |
| `PUBLIC_NEWSLETTER_ENDPOINT` | the blog subscribe box is not rendered |
| `PUBLIC_GA4_ID` | no analytics script at all |
| `PUBLIC_GSC_VERIFICATION` | no verification meta tag (prefer DNS verification anyway) |

### The pre-deploy gate

`node scripts/verify-build.mjs` (or `npm run verify`) runs over `dist/` and
**exits non-zero** on: a missing title/description/canonical/og:image, a
duplicate `<title>`, an `<h1>` count that isn't 1, a broken image `src`, a dead
internal link, invalid JSON-LD, a **visible form with no `action`**, a social
link pointing at a network homepage, a missing robots.txt/sitemap/404/favicon,
or a sitemap entry that is noindex or wasn't built. Run it before every deploy.

Last run: **23 pages, 8.5 MB, all checks passed.** Browser sweep: **128/128**
(16 representative routes × 8 widths 320→1536) — no horizontal overflow, exactly
one `<h1>` per route, zero broken images, zero console errors.

## Blocked on the client — do not launch without these

| # | What | Where |
|---|------|-------|
| 1 | **⚠️ The "92% Members Renew Annually" claim is unverified and appears on TEN pages, not one.** `/about`, `/book-a-call`, `/consulting`, `/contact-us`, `/courses`, `/growth-hub`, `/pgc-proof`, `/press`, `/resources`, `/testimonials` — plus it is restated inside an `/about` FAQ answer. This is a retention statistic about a medical-business membership; it must be confirmed by the client or replaced everywhere. Grep `92%`. | 10 × `src/pages/*.astro` |
| 2 | **FAQ answers 2..N were written to fill the layout, not taken from Figma.** Every Figma FAQ frame expands only its first item. Affects 9 pages. FAQPage JSON-LD is **off** until sign-off — pass `approved` to `<FAQ>` per page once real answers land. | `src/components/FAQ.astro` |
| 3 | **Contact form endpoint.** *No longer loses data* — with `PUBLIC_FORM_ENDPOINT` unset the form is hidden and an email/phone panel shows instead. Set the variable to ship the real form: it POSTs plainly without JS, and with JS adds inline success/error states plus a honeypot field the endpoint should reject on. | `src/components/sections/contact-us/ContactForm.astro` |
| 4 | **Calendly not connected.** Set `PUBLIC_CALENDLY_URL`. Until then a working "Request A Time" fallback shows — not a blank box. | `src/components/sections/book-a-call/Calendly.astro` |
| 5 | **Real social profile URLs.** `site.social` previously pointed at `instagram.com` and `linkedin.com` themselves — every click landed on a login wall. Both are now empty strings: no icon renders and no schema `sameAs` is emitted. Fill them in and both return. | `src/lib/site.ts` |
| 6 | **Email/domain mismatch.** The site is `projectedgrowthconsultancy.com`; the contact address is `info@projectedgrowthconsulting.com` (**consult*ing*, not consult*ancy***). The blog article also links out to `projectedgrowthconsulting.com`, suggesting that is the existing live site. Confirm which domain is canonical — and whether those article links should become internal after migration. | `src/lib/site.ts`, `src/components/sections/blog-post/Article.astro` |
| 7 | **Three photos are low-resolution in the Figma file itself** — `/book-a-call` hero, `/growth-hub` hero, growth-hub "Who It's For". These are the original uploads; re-exporting cannot recover detail. Needs real photography. | `public/images/heroes/`, `public/images/growth-hub/` |
| 8 | **Footer "Quick Links" column missing.** Figma has a 4-column footer variant (MGA Login / Course Login / App Login). Needs the real login URLs. | `src/lib/site.ts` → `footerNav` |
| 9 | **8 blog articles are unwritten shells.** They are `noindex`, emit **no Article schema**, and are **excluded from the sitemap**, so nothing fabricated can be indexed. To publish one: write the body, add it as its own `src/pages/blog/<slug>.astro`, and add its slug to `publishedSlugs` — the shell, the sitemap and the index all follow from that one edit. | `src/pages/blog/[slug].astro`, `src/lib/posts.ts` |
| 10 | **/growth-hub stats need real numbers.** Desktop and mobile Figma frames disagree (see below). Desktop values ship as placeholder. | `src/pages/growth-hub.astro` |
| 11 | **Verify GSC + GA4 at launch**, then replace Charter §2 with measured standing and submit the sitemap. | `seo/CHARTER.md` |

## Figma frames that contradict each other

Desktop and mobile frames disagree in five places. Resolution per case:

| Conflict | Decision |
|---|---|
| **/growth-hub hero CTAs** — desktop "Join The Growth Hub"/"Book A Strategy Call", mobile "Join Growth Hub"/"Browse Courses" (different destination) | **Swapped by breakpoint.** Genuine responsive intent; both render, one hidden per width. `PageHero` takes `primaryCta.mobile` / `secondaryCta.mobile`. |
| **/growth-hub stats** — desktop "15+ Years / 92% Renew", mobile "24+ Lessons / 15+ Scale" | **Not swapped.** Awaiting real numbers (blocker #7). |
| **/press About heading** — mobile frame says "An Operator First. A Consultant Second." | **Not swapped — suspected Figma error.** That string is byte-identical to the /about page's heading, i.e. a copy-paste between frames. Propagating it would ship the mistake. |
| **/contact-us hero photo** — mobile frame uses a different photograph | **Not swapped — wrong asset.** The mobile frame's image is an unrelated stock photo of a church youth event, with a third party's branding visible on the screens. Shipping it would be worse than the desktop photo. Needs a designer fix. |
| **/blog featured card excerpts** — frames carry different excerpt strings | **Not swapped.** Two maintained strings per card for text no user sees twice; desktop copy ships. |

Also noted: Figma's mobile Home frame labels the "How It Works" eyebrow **"WHAT YOU GET"** — a copy-paste from the preceding frame. Shipped as "How It Works".

## Fidelity: what matches and what deliberately doesn't

**Matched exactly:** spacing, padding, gaps, column widths and ratios, colours,
border radii, image crops and aspect, button metrics, grid structure, section
order, and per-section heights (all within ~3% at 1440 except the cases below).

**Deliberately not matched — the display font.** Figma uses **Test Tiempos
Headline VF** (Klim, licensed); the site renders **Newsreader**. Heading glyph
widths and line-wrap points differ by ~3%, which is the entire residual height
delta on most sections. Nothing is hand-tuned to fake a match — that would
silently break on licensing. **To fix properly:** drop the `.woff2` files into
`public/fonts/`, add an `@font-face`, and change one line —
`--font-display` in `src/styles/global.css`. Nothing else references the family.

Two pre-existing compensations exist for the substitution and should be removed
when the real font ships: `md:gap-[82px]` in home `WhatYouGet` and `md:mt-[18px]`
in home `Blogs`.

**Other known, explained deltas:** `/book-a-call` Calendly section is short
because the external widget doesn't load offline (blocker #3). `/growth-hub`
and `/press` "Choose Your Path" are ~4–7% short because those Figma frames carry
104–136px of empty bottom padding that no sibling section uses — read as frame
slack, not spec.

## Known quality debt (cosmetic, not blocking)

- `#111827`, `#6b7280` and `#f6f3ec` are used ~270 times with no `@theme` token;
  `--color-ink-800` is dead. Worth a token sweep.
- `StatsBar` distributes 4 stats on an equal grid; Figma uses space-between, so
  columns 2–4 sit 40–120px left of the design (section height is exact).
- The white check-row pill is duplicated across 4 files with drifting radius and
  padding — one `CheckList.astro` would do.
- Home "Blogs" hardcodes its own post data instead of reading `featuredPosts`.
- `pgc-proof/Webinars.astro` duplicates its featured card instead of mapping with
  a conditional class, the way `courses/CourseLibrary.astro` does correctly.
- Header dropdown opens on CSS `:hover`/`:focus-within` only — no `aria-expanded`,
  no Escape, not operable by touch or keyboard activation. **Worth fixing.**
- `/courses` mobile: Figma clamps card descriptions to 2 lines with an ellipsis;
  we render full text (+5.8% section height).

## Verified

Run these after any change:

```
npx astro check   # 0 errors, 0 warnings, 0 hints
npm run verify    # build (23 routes) + the pre-deploy gate over dist/
```

Last full run, 2026-07-28:

- `astro check` — **0 errors, 0 warnings, 0 hints** (76 files).
- `npm run verify` — **23 pages, 8.5 MB, all checks passed.** Warnings are the
  9 intentional `noindex` pages (8 shells + /404) and two shell titles that run
  long; every indexable page is clean.
- Browser sweep, 16 representative routes × 8 widths (320/393/640/768/1024/
  1280/1440/1536): **128/128 pass — no horizontal overflow.**
  `overflow-x-hidden` is deliberately NOT on `<body>`; the overflow is fixed at
  source, not clipped. This is the regression gate — the fixed-pixel-column bug
  it catches is easy to reintroduce with `w-[Npx] shrink-0` inside a flex row.
  Use `basis-[Npx] min-w-0`.
- Exactly one `<h1>` per route; zero broken images; zero missing `alt`; zero
  console errors.
- Both env-gated paths exercised: with `PUBLIC_FORM_ENDPOINT` /
  `PUBLIC_NEWSLETTER_ENDPOINT` / `PUBLIC_CALENDLY_URL` / `PUBLIC_GA4_ID` set the
  real form, subscribe box, Calendly widget and gtag snippet render; with them
  unset each falls back and no gtag request is emitted.

`scripts/verify-build.mjs` is the only automated test. It is regex over built
HTML — no framework, no fixtures — and it is what catches the class of bug that
actually ships: a dead link, a lost `<h1>`, a form with nowhere to post. A
Playwright port of the width sweep is the next thing worth adding if you want
the 128-check gate running in CI rather than by hand.

### Known non-blocking debt

- `npm audit` reports a high-severity advisory in **sharp/libvips**. It is a
  build-time-only dependency for a static site — it never runs in production and
  never touches untrusted input here. The only fix npm offers is `astro@7`, a
  major upgrade. Left alone deliberately; revisit with the Astro upgrade.
- Fonts still load from the Google CDN, render-blocking. Self-hosting the
  `.woff2` files and preloading them is the remaining Core Web Vitals lever —
  and it is the same edit that swaps Newsreader for the licensed Tiempos
  Headline (one line: `--font-display` in `src/styles/global.css`).
- `.env.tmptest` sits in the repo root. Gitignored, so it never shipped, but it
  is a leftover — delete it.
- The cosmetic debt listed above (token sweep, `StatsBar` distribution,
  duplicated check-row pill, hardcoded home Blogs data) is unchanged.
