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
