# Breakpoint doctrine

Figma drew exactly two frames: **1440** (desktop) and **393** (mobile). Everything
between them is ours. This file is the spec for that middle ground so fourteen
sections don't each invent their own answer.

Two frames are contracts, three are decisions:

| Width | Status | Rule |
|-------|--------|------|
| **1440+** | Contract | Pixel-exact to the Figma desktop frame. Content rail 1280, gutter 80. |
| **1280** | Decision | Same structure as 1440. Columns scale by ratio, never reflow. |
| **1024** | Decision | First reflow: 4-up → 2-up. Side-by-side splits survive. |
| **768** | Decision | Second reflow: everything two-column becomes one. |
| **393** | Contract | Pixel-exact to the Figma mobile frame. |

Between 768 and 1440 the rail gutter ramps `clamp(1.25rem, 5.556vw, 5rem)` — it
must never step, or content gets narrower as the viewport grows.

## Per-archetype degradation

Column figures are the Figma 1440 values; express them as flex bases that compress,
never `w-[Npx] shrink-0`.

| Archetype | 1440 | 1280 | 1024 | 768 | 393 |
|---|---|---|---|---|---|
| **Section header** (`SectionHead`) 659 + 561 | as drawn | same ratio | same ratio, compressed | stack: title over body, CTA below | stacked, per Figma mobile |
| **Hero** (home) title 624 + stats 414 | as drawn | same | stats column drops under the CTA row | single column, stats become a 2×2 grid | per Figma mobile |
| **Page hero** (`PageHero`) | as drawn | same | same | copy stacks, image becomes a 16:9 band | per Figma mobile |
| **Stats bar** 4-up | as drawn | same | 2×2 | 2×2 | per Figma mobile |
| **4-up card grid** | 4 cols | 4 cols | 2 cols | 2 cols | 1 col |
| **3-up card grid** | 3 cols | 3 cols | 2 cols (last spans full) | 1 col | 1 col |
| **2-up split** (image + list) | as drawn | same | same, image min 40% | stack, image first | per Figma mobile |
| **FAQ** 578 + 662 | as drawn | same ratio | same ratio | stack: copy, then accordion | per Figma mobile |
| **Testimonial rows** video 656 + quote + stats | as drawn | same | stats panel wraps under quote | stack, video 16:9 on top | carousel, per Figma mobile |
| **Footer** 444 + 730 menus | as drawn | same | menus 3-up under the brand block | menus 2-up | 1 col |
| **Process stepper** | as drawn | same | same | stack, connector becomes vertical | per Figma mobile |

## Invariants at every width

- `documentElement.scrollWidth <= innerWidth` — no horizontal overflow, ever. This
  is the regression gate; it is measured, not eyeballed.
- No text smaller than 14px, no tap target under 44×44.
- Type scale steps at `lg:` (1024), not `md:` — a display H2 dropping from 4rem to
  2.5rem at 768 leaves a dead zone between 768 and 1024.
- Images keep their Figma aspect ratio; crops change via `object-position`, not by
  restating dimensions.
- A section's reading order in the DOM is its visual order at every width. Never
  reorder with `order-*` unless Figma's mobile frame demands it.

## Deliberately not matched

Heading glyph widths and line-wrap points. Figma uses **Test Tiempos Headline VF**
(Klim, licensed); we render **Newsreader**. Do not hand-tune font-size, tracking or
column width to force a wrap to match — it silently breaks the day the real font is
licensed. Swap `--font-display` in `global.css` and the headings snap into place.
