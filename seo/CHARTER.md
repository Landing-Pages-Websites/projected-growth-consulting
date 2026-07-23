# SEO Charter — Projected Growth Consulting

> Status: **PROVISIONAL — pre-launch build.** No live URL, no GSC/GA4 property,
> no crawl data available to this session. Every line below is either a FACT
> read off the repo/Figma file or an INFERENCE labelled as such. §2 stays
> provisional until the site is live and Search Console is connected.
> As of 2026-07-22.

## ① Identity & business model

- **Entity** (fact, `src/lib/site.ts`): Projected Growth Consulting (PGC).
- **Domain** (fact): `https://projectedgrowthconsultancy.com`.
- **Positioning** (fact, site.ts): "The operator's business school for elective
  medical practices. Helping owners build more profitable, predictable
  businesses through coaching, courses, and proven growth systems."
- **Audience** (fact, Figma hero copy 159:15141): owners/operators of med spas,
  plastic surgery, dermatology and wellness practices.
- **Business model** (inference, high confidence): **commercial / transactional
  B2B services** — recurring membership (The Growth Hub), paid courses,
  1:1 consulting. Revenue is booked calls and memberships, not ad impressions.
- **Archetype**: expert-led service business with a productised membership.
- **Life-cycle stage**: pre-launch rebuild.

## ② Current SEO standing — as of 2026-07-22

**PROVISIONAL. Not measured.** No GSC/GA4/CRM access from this session; no
rankings, impressions, or backlink data were retrieved. Do not cite numbers for
this site until the property is verified. What is known:

- Site is being implemented from a locked Figma design (`figma-map.json`,
  14 routes).
- Technical base (fact, repo): Astro 5 static output, Tailwind v4, per-page
  `<title>`/description/canonical/OG via `src/layouts/Base.astro`, FAQPage
  JSON-LD emitted by `src/components/FAQ.astro`.
- No sitemap, robots.txt, or Organization/Service schema on disk yet — open gap.

## ③ Targeting: current vs. intended — THE VERDICT

- **Intended**: commercial and transactional queries around elective-medical-
  practice growth — med spa consulting, med spa business coaching, practice KPIs,
  practice profitability — plus branded ("Kelly Smith", "PGC") and
  proof/credibility queries.
- **Current**: n/a (pre-launch).
- **Verdict**: **this is a commercial/transactional site.** Its constraint is
  money-page credibility, conversion paths and internal structure — *not* blog
  volume. Informational content is only justified when it is a supporting
  cluster that funnels into a money page (/growth-hub, /courses, /consulting,
  /book-a-call).

## ④ Topical-authority state

Pre-launch: zero earned authority. The designed IA already forms a coherent
topical core (about → programs → proof → resources → blog), which is the right
shape. Authority work starts after launch.

## ⑤ Money pages & conversion paths

- **Money pages**: `/growth-hub` (membership), `/courses`, `/consulting`,
  `/book-a-call` (primary conversion).
- **Proof/trust surfaces**: `/testimonials`, `/pgc-proof`, `/press`, `/about`.
- **Conversion path**: proof surface → `/book-a-call` or `/growth-hub`. Every
  proof page must carry a CTA into one of those two.

## ⑥ The directive

**Fix-now constraint**: the site does not exist yet. The binding constraint is
*shipping the designed pages correctly* — crawlable, one H1, real copy, real
metadata, internal links pointing at money pages.

**Roadmap**
1. Ship all 14 designed routes with real Figma copy + per-page title/description.
2. Add robots.txt, XML sitemap, Organization/Service schema.
3. Verify GSC + GA4 at launch; replace §2 with measured standing.
4. Only then: keyword/cluster work and supporting content.

**Do NOT do**
- Do NOT invent statistics, testimonials, authors or case studies. Every number
  on this site must come from the design or the client.
- Do NOT pour informational blog content into this site ahead of the money pages.
- Do NOT quote rankings/traffic for this domain until GSC is connected.

## ⑦ Uncertainties / missing data

- No GSC, GA4, CRM, or backlink data (blocker for §2 and §4).
- FAQ answers on several designed pages exist as questions only in Figma —
  answers must be supplied by the client, not written by an agent.
- Footer CTA copy per page not verified for every route (Figma MCP rate limit
  hit 2026-07-22).
