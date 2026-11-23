# STRATA-015 — Identity and design specification

**Checkpoint A · design-system direction accepted; final identity and Checkpoint B approval pending.** Baseline `7690b59f4525516bff95c7bb633b41272739f76a`. [Audit](STRATA-015-DESIGN-AUDIT.md) · [Interactive review board](strata-015/index.html) · [Homepage](strata-015/home.html) · [Laboratory](strata-015/laboratory.html).

## Brand architecture

STRATA is the organizing identity; Builds names the engineering platform. Instruments retain their descriptive names (Deep Time Observatory, NOAA Signals Lab, Microsat Atlas, Orbital Observatory, Estuarine Gradient Observatory, Evidence Frontier). Studio remains the portfolio in development. Avoid creating separate logos for every instrument. Use the same compact mark, shared navigation and source/evidence vocabulary, with instrument-specific layouts.

**Evidence first. Questions next. Conclusions earned.** The promise is inspectability, not completeness or certainty. The visual signature is a measured offset: separated layers, aligned reading edges, restrained teal actions, and explicit reference labels. Reuse the offset sparingly in the mark and selected-rule treatment; do not decorate scientific plots with fake strata or fabricated geography.

## Original identity options · revised after owner feedback

| Concept | Construction | Strength | Tradeoff | Recommendation |
| --- | --- | --- | --- | --- |
| A · Offset strata | Three filled layers on a 32-unit grid; stepped negative-space seam | Compact monogram-like silhouette and clear one-color reproduction | Small seams require raster review | Earlier direction retained |
| B · Reference section | Layer core with two opposing registration corners | Communicates inspection and alignment | Could read as scanner/crop; more small detail | Keep as alternate |
| C · Layered signal | Three staggered bands with measured breaks | Simple, easy to reproduce | Most generic; familiar stack/database vocabulary | Do not advance first |

| D · Rocket-bolt S | One angular zigzag, ascending nose and cut tail on a 48-unit grid | More energetic; uninterrupted silhouette without fragile detail | Arrow/lightning reading is stronger than literal S at 16 px | Current owner-requested exploration; not final |

| E · Fractured strata | Two equal-area, rotationally matched slab paths separated by an open angular S-shaped gap | The negative-space letter directly connects to geological layers; survives in monochrome | Interlocking slabs are symbolic, not a measured geological cross-section | Leading candidate; refined unframed lockup recommended |

Assets in `strata-015/assets/`: `concept-a.svg`, `concept-b.svg`, `concept-c.svg`, `concept-d.svg`, `concept-e.svg`, `stone-lockup.svg`, `stone-mono-light.svg`, `stone-mono-dark.svg`, `symbol.svg`, `mono-light.svg`, `mono-dark.svg`, `horizontal-lockup.svg`. All symbol geometry is original. Following the owner’s request for sharper lettering and a thunderbolt-shaped rocket S, the working header now previews refined Concept E and Source Sans 3 Semibold letters converted to paths from the pinned licensed font below. Those letterforms are Adobe’s, not claimed as original. There are no raster traces, gradients, filters, external references or runtime font dependencies in the SVG. `horizontal-lockup-v1.svg` preserves the earlier custom block lettering. `horizontal-lockup-framed.svg` offers an optional perimeter border; letter strokes are not outlined, to keep counters open. Kerning and recognition still require owner review.

A was initially recommended; D explores the rocket-bolt direction and E explores the newer stone-slab suggestion. None is approved or a proven legally unique trademark. No comprehensive trademark/confusability search or owner recognition test has been completed. Before final adoption, compare the chosen silhouette against relevant science/software brands and test unaided recognition; geometric stacked marks are a crowded category. Do not claim market uniqueness from an original drawing alone.

### Usage rules proposed for approval

- A–C use a 32-unit grid; D and E use 48 units. Clear space outside the asset: ¼ symbol width (12 units for D). Do not stretch the geometry or close the interior turns.
- Symbol sizes: 16, 24, 32, 48 px. Use the standalone symbol below a 192 px lockup width. Review both 1× and 2× displays; header captures now cover both 1× and 2× pixel density. Header lockup is 248 px desktop and 232 px mobile; the prior header was 192 px.
- Dark: teal symbol with pale wordmark. Light: dark monochrome symbol/wordmark. Single-color print: dark or reversed white. Never use teal body text on a pale background without measured contrast.
- Do not stretch, rotate, add bevels/glow, put inside decorative badges or recolor individual layers as scientific categories.
- Accessible home link name: “STRATA Builds — Home.” Hide inline logo graphics from assistive technology if the link already has that name. A standalone image uses an informative alt; decorative repetition uses empty alt.
- B integration, after approval: `src/app/icon.svg` (adaptive monochrome or fixed high-contrast backing); app icon PNGs at 180/192/512 with safe padding; metadata and manifest only as needed. Test favicon at actual 16 px; app tiles at native sizes. The review site's favicon is only a specimen. No application icon was installed in A.

## Semantic tokens

All future global tokens use `--strata-` prefixes; the prototype's short names are isolated to documentation. Do not replace existing scientific CSS variables. Three layers: primitives → semantic tokens → component styles. Avoid global selector overrides for feature internals.

| Semantic name (prefix omitted) | Value | Contract |
| --- | --- | --- |
| bg | `#07131A` | Application canvas |
| surface / surface-secondary / surface-raised | `#0D2029` / `#112A35` / `#19343E` | Distinct depth, not repeated cyan cards |
| border / control-border | `#405B65` / `#809DA7` | Decorative dividers / necessary control boundaries |
| text / text-secondary / text-subdued | `#EAF5F3` / `#BFD0D2` / `#9DB5BD` | Body / supporting text / readable metadata |
| action / action-hover / action-pressed | `#55D6C2` / `#83E4D5` / `#38BAA6` | Dark text on filled actions; underlined action-colored links on dark surfaces |
| selected | `#214E50` | Selection background plus explicit pressed state and solid rule |
| focus | `#F4CF94` | 3 px ring, 5 px offset; no clipping |
| success / warning / error / info | `#9ED9B0` / `#E8B778` / `#FFACAC` / `#ABCCE4` | Always text + icon/shape; no color-only status |
| evidence-observed | `#B7DED3` | “Observed in the source”; solid left rule |
| evidence-interpretation | `#ABCCE4` | “Scientific interpretation”; double left rule |
| evidence-unresolved | `#E8B778` | “Still unresolved”; dashed left rule |
| evidence-synthetic | `#D0BDE8` | “Synthetic demonstration”; dotted rule, persistent label |

Model-derived data also needs an explicit **Modeled** label; “interpretation” is not a substitute for this classification. Evidence types are not success/warning states. An observed record can have poor quality; a modeled estimate can be valid within limits. Data owners supply labels and quality/uncertainty text. Never infer them from colors.

Use a scoped `legacyLightCanvas` around existing light modules: background `#FFFFFF`, foreground inherited from that feature, existing link/focus rules intact. Do not apply dark color-scheme to its native controls. This is a compatibility boundary, not a scientific-theme redesign. The dark shell remains outside.

Spacing: 4/8/12/16/24/32/48/64 px. Page gutter `clamp(20px,5vw,64px)`; outer max width 1280 px. Reading measure 60–70ch. Control radius 4 px; panel radius 6 px. Border 1 px, selection rule 3 px. Default shadows none; floating menus may use a single low-opacity shadow paired with a border. Never use shadow alone to identify a control.

## Typography evaluation and recommendation

Evaluated from official sources and specimen needs:

| Pair | Assessment | Decision |
| --- | --- | --- |
| IBM Plex Sans + Plex Mono | Broad coordinated family, good instrument character; strong association with IBM | Viable alternate, not bundled |
| Inter + system mono | Readable UI emphasis, economical hierarchy; common in software interfaces | Viable fallback, not bundled |
| Source Sans 3 + Source Code Pro | Humanist body shapes, restrained headings, legible scientific prose, matching mono companion | Recommended for review |

Official license/family sources: [IBM Plex](https://github.com/IBM/plex), [Inter](https://github.com/rsms/inter), [Source Sans](https://github.com/adobe-fonts/source-sans), [Source Code Pro](https://github.com/adobe-fonts/source-code-pro). All are open-font projects; the bundled Adobe files include their actual OFL-1.1 license texts. A third heading font is not justified: use Source Sans semibold with a distinct size/spacing hierarchy, and reserve the path-based wordmark for the brand.

Pinned unmodified review assets:

- Source Sans release `87b37a2daaed80fcb8e8ccb0085c4d72ddade12e`: Regular 153,800 bytes; Semibold 155,624 bytes.
- Source Code Pro release `803b7e23ec97ae58b6232ea76519a76d428ba268`: Regular 76,348 bytes.
- Total **385,772 bytes**; source URLs and SHA-256 in `strata-015/assets/fonts/manifest.json`. Full review fonts are local, not CDN requests. License files are adjacent. No renamed/subset derivatives were created in A. License wording is preserved; CRLF line endings and one trailing space are normalized for repository whitespace checks.

This is too large for the proposed initial production font budget of **100 KB compressed total** (budget, not a measured result). In B evaluate upstream Latin subsets or a reproducible subset including Greek, ±, degree, en/em dash, arrows and scientific symbols actually used. Respect reserved font names and preserve OFL licenses. If the budget cannot be met, use system body/mono for the first foundation rollout rather than ship the full review files. Do not remove required glyphs or silently use a different scientific symbol.

Load approved assets through `next/font/local`, expose CSS variables, preload only critical normal/semibold faces, and use measured fallback metrics. `font-display: swap` with metric adjustment is the starting plan. Test cold/warm cache and disabled-font fallback; target no observable text shift and CLS ≤0.1. Prototype uses plain local `@font-face`; it does not prove production loading/CLS performance. Numeric data uses `font-variant-numeric: tabular-nums`; reserve mono for values, units, coordinates and timestamps, not whole prose paragraphs.

| Role | Proposed size / weight / leading |
| --- | --- |
| Display | `clamp(2.5rem,6.8vw,6rem)` / 600 / 1.08 |
| Page heading | `clamp(2rem,5vw,4rem)` / 600 / 1.12 |
| Section heading | `clamp(1.8rem,3vw,2.8rem)` / 600 / 1.15 |
| Panel heading | 1.25–1.4rem / 600 / 1.25 |
| Body | 1–1.125rem / 400 / 1.55–1.65 |
| Label | .875–1rem / 600 / 1.4 |
| Metadata | .875rem / 400 / 1.5 |
| Numeric readout | `clamp(2rem,5vw,5rem)` / mono 400 / 1.1; units remain explicit |
| Captions and citations | .9375rem / 400 / 1.5; never hide access/rights/uncertainty |

Prototype eyebrow labels are 13 px and are supplementary, never the only data label. Reassess small caps at actual device size before adoption.

## Shared architecture (proposed, not implemented)

| Component | Ownership and API boundary |
| --- | --- |
| `AppShell`, `BrandLockup`, `PrimaryNavigation`, `Footer` | Root shell, skip link, known-route registry, active route; no scientific state |
| `PageHeader`, `SectionNavigation` | Eyebrow, H1, description and optional actions; preserve one page H1 |
| `ScientificPanel`, `DataReadout` | Semantic section/heading, label/value/unit and optional provenance; never format away uncertainty or precision |
| `EvidenceCard` | Explicit kind + existing text/source content; does not derive classifications |
| `SourceDisclosure` | Native details/summary; existing source links, license and locator passed intact |
| `StatusNotice`, `EmptyState` | State name, explanation and recovery action; distinguish absent, unavailable, unresolved and loading |
| `Button`, `SegmentedControl` | Native button or anchor; pressed state, keyboard behavior, visible focus; tab roles only when actual tab pattern is implemented |
| `Tooltip` | Optional supplement only, available on focus and hover, dismissible, never sole label or sole uncertainty disclosure |
| `ProjectCard` | Real route/description/status/evidence classification; no fabricated activity metrics |

Proposed files: `src/styles/tokens.css`, `src/components/brand/*`, `src/components/ui/*`, `src/components/shell/*`, homepage CSS Module. Keep components minimal: extract only where two real consumers or semantic consistency justifies it. No UI framework, icon package, state library or chart dependency.

Server components own shell and static framing; a small client boundary may handle pathname/current navigation. The review prototype's small view-switch script is illustrative and is not an application state manager.

## Interaction contract

| Action | Feedback | Motion and reduced motion |
| --- | --- | --- |
| Select record | Pressed/current state, rule and text; inspector updates without losing source focus | 120 ms background/border; immediate under reduce |
| Change observation | Preserve units, quality and timestamps, announce relevant change politely | No count-up/tween of scientific values |
| Open source | Native details, clear summary and stable reading order | Optional 180 ms opacity; no collapsing measurement animation; none under reduce |
| Switch view | Focus stays on initiating control; selected state explicit | Immediate data swap; short surface feedback only |
| Highlight map/time feature | Shape/outline plus textual selected record | No artificial geography, interpolated trajectory or pulsing confidence |
| Update numeric readout | Stable tabular column and actual new value | No numeric interpolation or celebratory animation |
| Navigate instrument | Current route and page heading | No parallax, shared fake data morph or continuous motion |

## Implementation order and review gate

1. Fleet Command accepted the semantic token architecture, typography hierarchy, evidence treatments, accessibility requirements and isolated legacy light canvases as implementation direction. Owner reviews the final E/D comparison and exact B manifest; identity and B authorization remain the current stopping point.
2. B: approved identity and icons; namespaced tokens; scope-preserving root shell and navigation; explicit legacy light canvas boundaries. Validate unchanged scientific text, source hashes and controls before homepage work.
3. B: minimal foundational components and approved homepage. Add a clearly scoped `/design-system` showcase with noindex and deliberate discoverability policy. The A review lives only under `docs/strata-015`, outside Next routes/public assets.
4. B: full quality suite, application screenshots corresponding to all baseline routes, 320/375/768/1024/1440 reflow, accessibility checks, cold-load font/bundle measurements, draft PR review. No merge without later authorization.
5. Later separately approved module rollout: per-instrument adapters and components. Do not restyle scientific modules broadly during B. Document every necessary compatibility adjustment.

## Human acceptance checklist (not yet completed)

- [ ] Owner selects/changes identity direction; recognizes mark at 16/24/32/48 px on light/dark and in grayscale.
- [ ] VoiceOver + Safari: landmarks, named navigation, skip link, one H1, disclosure expanded state, current view and reading order.
- [ ] NVDA + Firefox/Chrome: equivalent controls and source reading; no focus trap or missing label.
- [ ] Keyboard only: open/close instrument menu, each view, select a record, inspect sources, return to trigger; focus never obscured.
- [ ] Touch on real phone: target separation and no accidental neighboring control activation.
- [ ] 200% and 400% zoom, 320 px reflow, increased text spacing; no lost content, control overlap or page-wide scroll.
- [ ] Reduced motion on OS: state changes understandable with no animation or numeric tweening.
- [ ] Color-vision/grayscale inspection: all evidence classes and selections understandable from text and shape.
- [ ] Font-blocked and slow connection: readable fallback, correct scientific glyphs and stable layout.
- [ ] Real source inspectors retain uncertainties, provenance, license links and synthetic labels across all modules.

Automated checks support these tests but do not complete them. WCAG 2.2 AA is the target; no conformance certification is claimed.

## Owner feedback iteration · sharper identity

The owner commented on the header at a 649 px viewport: improve logo/text sharpness and explore a thunderbolt-shaped rocket S, with a border or another legibility treatment. The revised lockup uses a 32-unit cap height, wider open counters, six licensed outline glyphs and larger displayed dimensions. SVG remains resolution-independent; no `crispEdges` override is used because it would damage the diagonal silhouette. The optional frame surrounds the entire mark/name, not individual glyphs. A–C remain available so the new direction is a comparison, not an unreviewed final selection. All changes remain documentation-only.

## Second owner exploration · two fractured stone slabs

Concept E uses exactly two filled paths on a 48-unit grid. Their separation traces an angular S from the upper right to lower left; clipped external corners suggest stone without rock texture. The optional two-color treatment is warm stone `#D6D0C2` and cool slate `#AFB9B8`. Both single-color variants retain the gap, so color is not required to recognize the letter. `stone-lockup.svg` reuses the clearer licensed Source Sans 3 letter outlines. The primary review header now previews refined E; this is not final identity approval or an application identity replacement. These slab shapes are a brand abstraction, not a scientific field section.


## Final Checkpoint A refinement

[Single E/D comparison board](strata-015/identity-final.html) · [Exact Checkpoint B file manifest](STRATA-015-CHECKPOINT-B-MANIFEST.md).

Refined E has two original polygon paths related by a 180° rotation about (24,24). Each slab has area 502 square grid units. The shortest seam separation is 4.243 units on the 48-unit grid: about 1.414 CSS px at a 16 px symbol; the straight horizontal openings are 2 px at that size. The more even upper/lower mass and wider openings are intended to improve S recognition. This is a geometric and visual judgment, not a completed recognition study. `concept-e-v1.svg` preserves the prior drawing. No D geometry is incorporated into E.

True monochrome exports use the same two paths with the same fill, no masking, background-colored knockout, stroke or overlay. Color and single-color samples are shown on both backgrounds at native 16/24/32/48 CSS px. Six mark/background contrast checks pass; the two optional stone colors retain 12.23:1 and 9.36:1 on the dark background. Use the dark monochrome on light surfaces, not the pale stone colors.

Retain the reviewed larger Source Sans 3 Semibold wordmark outlines and spacing. Inspect the R/A enlargement and full lockups: open counters need no border or added stroke. Recommend **unframed E** as the default horizontal lockup. At equal letter height the frame adds 24 viewBox units of width and 20 of height; forcing it into a fixed-width slot reduces letter size. No demonstrated recognition improvement warrants a permanent frame. The frame remains an optional treatment for controlled placement, not part of the symbol or favicon.

The comparison board pairs E/D navigation captures at 320/375/649/768/1440 px with 1× and 2× captures available, plus homepage header specimens. The new 649 px open-menu check exposed a 7 px prototype overflow; a documentation-only breakpoint now places mobile navigation on its own row. Repeat checks pass. This does not modify application navigation.

The exact B manifest deliberately keeps the first implementation on system body/mono fonts while applying the accepted hierarchy; the path wordmark is unchanged. Shipping font subsets requires an amended asset manifest and the previously stated size/glyph/license/loading checks. No broad CSS migration has begun.
