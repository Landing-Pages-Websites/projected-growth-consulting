# SEO Journal — Projected Growth Consulting

Append-only. Newest entries at the bottom.

---

## 2026-07-22 — Charter created (provisional) + /testimonials implemented

**Operation**: Figma design-to-code implementation of `/testimonials`
(desktop 159:15140 / mobile 159:25642), run under the content write-gate.

**Ran**: `seo-orchestrator` (Charter build, Phase 0 intake only — Phases 1–3
not possible, see below), `seo-content-protocol` (Content Brief for the page),
Figma MCP `get_design_context` per section node.

**Findings**
- FACT: no `seo/` artifacts existed; `seo/CHARTER.md` + this journal created.
- FACT: no GSC/GA4/backlink access from this session → Charter §2 is provisional
  and carries no numbers. Phases 1–3 (baseline, eligibility, market/SERP) are
  deferred to launch.
- INFERENCE (high confidence): commercial/transactional site; constraint is
  money-page credibility + conversion paths, not content volume. Recorded as the
  §3 verdict.
- FACT: `/testimonials` is a proof surface, not a keyword target. All copy on it
  is transcribed from the approved Figma design; nothing was authored.
- FACT: Figma node 159:16436 contains six FAQ questions but only one answer
  (159:16445). The other five answers do not exist in the design.

**Changed**
- `seo/CHARTER.md`, `seo/JOURNAL.md` created.
- `src/pages/testimonials.astro` written — PageHero + StatsBar + Testimonials
  (rows) + Testimonials (grid) + FAQ, all shared components, no new sections.
- `public/images/heroes/testimonials.jpg` added (Figma export, resized
  4096→1920px wide, 5.8 MB → 347 KB, for LCP).
- Internal links out of the page: `/book-a-call` (hero primary + FAQ CTA),
  `/courses` (hero secondary), `/growth-hub` (footer CTA) — all money pages,
  per Charter §5.

**Pending**
- Client must supply the five missing FAQ answers; the interim answers in
  `src/pages/testimonials.astro` are marked in a frontmatter comment and feed
  the FAQPage JSON-LD, so they are a launch blocker.
- Figma MCP rate limit hit before the page's footer node (159:16486) could be
  read — the default Footer CTA copy is in use and unverified for this route.
- Site-wide: robots.txt, sitemap, Organization schema still missing.

**Next review**: at launch, when GSC is verified (replace Charter §2).

---

## 2026-07-28 — Production-readiness pass (Charter §6 roadmap item 2 + item 3 scaffolding)

**Operation**: pre-launch technical hardening of the whole site. No page copy
was authored; the only new reader-facing strings are a /404 nav-recovery page.

**Ran**: `seo-orchestrator` (recall gate — Charter + Journal read in full and
reconciled before any change), `seo-content-protocol` (Content Brief for /404;
every other change is infra with zero prose). No narrow SEO skill was needed —
this executed the roadmap the Charter already carries.

**Charter reconciliation**: §6 roadmap item 2 reads *"Add robots.txt, XML
sitemap, Organization/Service schema"* — this pass IS that item. §3's verdict
(commercial/transactional; constraint is money-page credibility and conversion
paths, not blog volume) was respected: nothing informational was added, and the
one genuinely new fix on the conversion path — the contact form — was treated as
the highest-priority item because §5 names /book-a-call and /contact-us as the
money paths.

**Findings**

- FACT: `public/images` was 27.5 MB. Astro does not process `public/`, so all of
  it shipped raw; photographs had been exported as PNG. The home LCP image was a
  1.9 MB PNG. Now 7.1 MB total, LCP image 94 KB.
- FACT: the site had no robots.txt, no sitemap, no 404, and no Organization or
  WebSite schema — exactly the §2 "open gap" line, now closed.
- FACT (**escalated**): the unverified *"92% Members Renew Annually"* claim is on
  **ten pages**, not the one page HANDOFF.md recorded, and is restated inside an
  `/about` FAQ answer. Charter §6 "Do NOT invent statistics" makes confirming or
  removing this a launch blocker. Not changed by this session — it is the
  client's number to confirm.
- FACT: `site.social` pointed at `instagram.com` and `linkedin.com` themselves.
  Every social click hit a login wall, and putting those in schema `sameAs`
  would have asserted the brand owns those homepages. Both set to empty; the
  icons and the `sameAs` array now render only when real URLs exist.
- FACT: `/contact-us` shipped `<form method="post">` with no `action`. On a
  static host that re-requests the page — the visitor sees a reload that looks
  like success and the enquiry is gone. Same defect in the blog newsletter box.
- FACT: the contact email is `@projectedgrowthconsulting.com` while the site is
  `projectedgrowthconsultancy.com`, and the one written article links out to
  `projectedgrowthconsulting.com`. INFERENCE (medium confidence): that is the
  existing live site and this is a migration. Flagged, not changed — if true it
  affects canonical choice, redirects, and whether those links stay external.
- FACT: nine indexable pages had meta descriptions over the ~160-char cut (the
  worst 256 chars). Trimmed by cutting only; no claim added or altered.
- FACT: the shared Header renders cream-on-cream — invisible — on any light
  hero. Two pages already carried a copy of the same `:has()` repaint, each
  commented "the real fix is a `theme` prop on Header". Added the prop, deleted
  both copies.

**Changed**

- `astro.config.mjs` — `@astrojs/sitemap`, filtered by `publishedSlugs` so the
  8 noindex shells are never advertised.
- `public/robots.txt`, `public/_headers`, `public/site.webmanifest`, favicon set
  generated from the real brand mark.
- `src/pages/404.astro` (new, noindex, links only to money pages + contact).
- `src/layouts/Base.astro` — Organization + WebSite JSON-LD, `og:site_name` /
  `og:locale` / `og:image:alt` / `theme-color`, explicit
  `max-image-preview:large`, env-gated GA4 + GSC verification, `headerTheme`.
- `src/lib/site.ts` — contact block as the single source for the page and the
  schema; social URLs emptied with an `[OWNER]` note.
- `src/lib/posts.ts` — `publishedSlugs`, now the one source deciding shell vs.
  real page vs. sitemap inclusion.
- Contact form + newsletter — env-gated endpoints, honeypot, inline
  success/error via a polite live region, honest fallbacks when unset.
- `Header.astro` — `theme` prop; `aria-expanded`, Escape, tap-to-open.
- `scripts/optimize-images.mjs` (one-shot), `scripts/verify-build.mjs`
  (pre-deploy gate), `npm run verify`.
- 9 meta descriptions trimmed; `HANDOFF.md` rewritten with the launch checklist.

**Pending** (client-blocking, unchanged by this session)

- The 92% renewal claim across 10 pages — confirm or replace.
- FAQ answers 2..N on 9 pages; FAQPage JSON-LD stays off until signed off.
- Real social profile URLs; the consulting-vs-consultancy domain question.
- `PUBLIC_FORM_ENDPOINT`, `PUBLIC_CALENDLY_URL`, `PUBLIC_NEWSLETTER_ENDPOINT`.
- 8 unwritten articles (noindex, sitemap-excluded — safe to leave).

**Next review**: at launch. Verify GSC + GA4, submit the sitemap, then replace
Charter §2 with measured standing — §2 remains PROVISIONAL until then.
