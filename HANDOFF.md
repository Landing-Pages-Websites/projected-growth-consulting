# Projected Growth Consulting — build handoff

Astro 5 + Tailwind v4, built from Figma `m9rsqbLlGpyArT5B7oHqUh` ("Mega Projected
Growth Consultancy — CF"). **22 routes** — the 14 designed pages, plus 8 blog
article shells.

```
npm install && npm run dev      # localhost:4321
npm run build && npm run preview
```

- `figma-map.json` — every route → Figma desktop/mobile node ids + per-section
  pixel heights. The design↔code trace; section roots carry `data-node-id`.
- `BREAKPOINTS.md` — the doctrine for 768/1024/1280, which Figma never drew.
  Read it before adding a section.

## Blocked on the client — do not launch without these

| # | What | Where |
|---|------|-------|
| 1 | **FAQ answers 2..N were written to fill the layout, not taken from Figma.** Every Figma FAQ frame expands only its first item. Affects 9 pages. FAQPage JSON-LD is **off** until sign-off — pass `approved` to `<FAQ>` per page once real answers land. | `src/components/FAQ.astro` |
| 2 | **Contact form has no endpoint.** `<form method="post">` with no `action` on a static site discards every enquiry. Needs Formspree / Netlify Forms / HubSpot, or an SSR adapter, plus success + error states. | `src/components/sections/contact-us/ContactForm.astro` |
| 3 | **Calendly not connected.** Set `PUBLIC_CALENDLY_URL` to the live event URL and the real inline widget switches on at build. Until then a working "Request A Time" fallback shows — not a blank box. | `src/components/sections/book-a-call/Calendly.astro` |
| 4 | **Three photos are low-resolution in the Figma file itself** — `/book-a-call` hero is a 434×485 source on a 1440×720 frame, `/growth-hub` hero 660×486, growth-hub "Who It's For" 364×589. These are the original uploads; re-exporting cannot recover detail. Needs real photography. | `public/images/heroes/`, `public/images/growth-hub/` |
| 5 | **Footer "Quick Links" column missing.** Figma has a 4-column footer variant (MGA Login / Course Login / App Login) on /contact-us, /pgc-proof, /blog, the blog post and /privacy-policy. Needs the real login URLs. | `src/lib/site.ts` → `footerNav` |
| 6 | **8 blog articles are unwritten shells.** Real titles/dates/images and the designed hero; body is an explicit "not written yet" notice + outline. They are `noindex` and emit **no Article schema**, so nothing fabricated can be indexed. To publish one: write the body, drop it in as its own `src/pages/blog/<slug>.astro` (it then overrides the shell), and it auto-links. | `src/pages/blog/[slug].astro` |
| 7 | **/growth-hub stats need real numbers.** Desktop and mobile Figma frames disagree (see below). Desktop values ship as placeholder — **the "92% Members Renew Annually" claim is unverified and must be confirmed or replaced before launch.** | `src/pages/growth-hub.astro` |

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
npm run build     # 22 routes
npx astro check   # 0 errors, 0 warnings, 0 hints
```

Browser-measured, all 22 routes × 8 widths (320/393/640/768/1024/1280/1440/1536):

- **176/176 pass — no horizontal overflow.** `overflow-x-hidden` is deliberately
  NOT on `<body>`; the overflow is fixed at source, not clipped. This is the
  regression gate — the fixed-pixel-column bug it caught is easy to reintroduce
  with `w-[Npx] shrink-0` inside a flex row. Use `basis-[Npx] min-w-0`.
- Exactly one `<h1>` per route; zero broken images; zero missing `alt`.

There is **no automated test suite** — `package.json` has only `dev`, `build`,
`preview`, `check`. The overflow sweep above is the highest-value thing to commit
as a Playwright spec if you want it running on every change.
