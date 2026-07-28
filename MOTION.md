# Motion spec — "refined & subtle"

The mechanics are already built and verified (global.css + Base.astro). Pages opt
IN declaratively — you add attributes, the global observers do the work. Do NOT
write your own IntersectionObserver, keyframes, or animation JS. Do NOT touch
global.css or Base.astro.

## What already exists (don't rebuild)

| Effect | How to opt in | Notes |
|---|---|---|
| **Scroll reveal** (fade + 16px rise on enter) | add `data-reveal` to the element | Anything above the fold on load reveals instantly; below-fold waits for scroll. |
| **Staggered reveal** | add `data-reveal-group` to a parent, `data-reveal` to each child | Children auto-stagger by 70ms (capped at 8). Use for card grids, stat rows, checklists. |
| **Count-up** on a number | wrap ONLY the number in `<span data-countup>6,000</span>` | Keep any coloured suffix (`+`, `%`, `M`) in a SEPARATE sibling span, or the count wipes it. StatsBar already does this. |
| **Card hover lift** | add `card-hover` class to a card root | Works on light and dark cards. Transform + shadow only, no layout shift. |
| **Page enter + cross-page fade** | automatic | Every page. Nothing to add. |
| **Button press + arrow nudge** | automatic in `Button.astro` | Nothing to add. |

All effects self-disable under `prefers-reduced-motion: reduce` and never hide
content when JS is off. That safety lives in the foundation — you don't re-implement it.

## Placement rules (taste — this is the whole point)

1. **Reveal at the SECTION level first, sparingly within.** A section's header block
   (`data-reveal`) then its content grid (`data-reveal-group`) is the usual pattern —
   two to four reveal targets per section, not thirty. Revealing every paragraph is noise.
2. **Group grids/lists** with `data-reveal-group` so cards cascade instead of popping
   together. This is where stagger earns its place: card decks, stat rows, checklists,
   logo rows, testimonial grids.
3. **Never reveal the first hero.** The hero is above the fold and must be visible
   instantly — no `data-reveal` on the hero section or its direct children. (The page-enter
   fade already covers it.)
4. **Count-up only on real metrics** — the big stat numbers (StatsBar has it; add it to
   the home hero's 4 stats and any other literal number-with-suffix stat block). Never on
   prices in a pricing table, dates, or list counts.
5. **card-hover only on cards that are, or contain, a link/action** — something the user
   can click. A static info card that goes nowhere should not lift on hover (it implies
   clickability). When in doubt, no lift.
6. **Respect DOM order = visual order.** Reveal never reorders; it only fades/rises in place.

## Anti-patterns (do NOT do these)

- No parallax, no scroll-jacking, no auto-playing marquees, no rotate/scale/flip on reveal.
- No motion on the header, footer, or legal text.
- No `data-reveal` on an element that is `position: absolute` inside the hero art.
- No transition longer than ~0.6s; no reveal travel larger than the built 16px.
- Don't add `data-reveal` to something already inside a `data-reveal` ancestor (double-hide).
