# STRATA-015 — Design audit · Checkpoint A

Baseline: `7690b59f4525516bff95c7bb633b41272739f76a` (production Phase 4 squash). Branch: `strata-015/brand-design-system`. Audit date: 2026-11-23 UTC. This is a design proposal, not an implemented redesign. Owner review precedes Checkpoint B.

## What actually exists

The root layout in `src/app/layout.tsx` owns the only application layout. Route files delegate to feature components; there are no scientific route-specific `layout.tsx` files and no `src/components` shared component library. Shared global styling is 72 lines in `src/app/globals.css`. UI is primarily owned by feature CSS Modules.

| Route | Actual interface | Surface and ownership |
| --- | --- | --- |
| `/` | Seven project cards, introduction | Global white page, inline spacing and muted text |
| `/studio` | Portfolio placeholder and Bass research link | Same global white page/card |
| `/atlas` | Synthetic population assignments, map and records | Light page, warm synthetic badge, dark map; `features/atlas` |
| `/signals` | Providence NOAA hourly observations and quality/gaps | Light page, dark instrument and source inspection; `features/signals` |
| `/orbital` | Ceres saved modeled state vectors | Light page, dark orbital instrument; `features/orbital` |
| `/frontier` | Narragansett Bay coverage and monitoring gaps | Light page, dark feature surface; `features/frontier` |
| `/oceanography` | Narragansett Bay nutrient and water-column records | Light page, dark hero and inspection panels; `features/oceanography` |
| `/deep-time` | Chronology, origins, oxygenation, Ancient Seaway Laboratory | Full dark page with warm text; nested Tethys, seaway and transect modules |

Also present: `/frontier/reconciliation`, `/orbital/voyager`, `/oceanography/pawtuxet`, `/research/bass-2003`. These must join shell regression coverage in B. `/collections` and `/methods` have no route files and must not be offered as working destinations. Studio must remain labeled as a portfolio in development.

## Five highest-impact experience problems

### 1. The global shell breaks the visual continuity of the instruments

Evidence: `globals.css:15` sets white/black body colors; `layout.tsx:18` renders an unthemed navigation strip. `deep-time.module.css:1` then establishes its own dark surface and warm ink. The [Deep Time desktop baseline](strata-015/baseline/deep-time-1440.jpg) visibly crosses from a white navigation bar into the dark observatory. Other routes mix white pages and dark instruments intentionally.

Consequence: visitors lack a persistent organizational identity. A one-line dark-body replacement is unsafe: Atlas, Signals, Oceanography, Orbital and Frontier set dark foreground colors without an opaque page background, relying on the current white body.

Proposal: dark shared shell and homepage, with explicit **light instrument canvas boundaries** around existing light modules. Preserve local feature colors and chart palettes. Migrate instrument themes only in later, individually reviewed slices. Accept by comparing all route canvases before/after and checking computed foreground/background contrast, not merely the body color.

### 2. The primary navigation omits two implemented instruments

Evidence: `layout.tsx:18–28` offers Studio, Atlas, Signals, Orbital and Frontier. Oceanography and Deep Time are implemented and linked from the homepage but absent from persistent navigation. The nav has no accessible label or current-page indication; no global skip link is provided. [Navigation at 375 px](strata-015/baseline/navigation-375.jpg).

Consequence: moving between newer instruments requires returning to the homepage or knowing URLs. The wrapping list does not communicate where the visitor is.

Proposal: named Primary navigation, home brand link, complete Instruments disclosure with all seven scientific/portfolio destinations, Studio as a clear separate destination, `aria-current="page"`, a skip link, and visible keyboard focus. Mobile uses a native disclosure with normal links; no hover-only menu or custom menu role. Accept with keyboard and screen reader review at 320 px and 200% zoom.

### 3. The homepage does not explain how the instruments differ

Evidence: `src/app/page.tsx` puts seven similarly weighted cards beneath a short introduction. Labels distinguishing synthetic, modeled, observed and source-coverage material are absent from the card headings, although the descriptions do correctly call Atlas synthetic and Orbital modeled. [Homepage at 1440 px](strata-015/baseline/home-1440.jpg).

Consequence: visitors must read each paragraph to understand the evidence class or find a useful starting point. The header remains plain text with no visual identifier.

Proposal: original symbol/wordmark, explicit brand statement, a featured Deep Time entry, instrument index, persistent textual evidence labels, and short source-oriented explanations. All project descriptions derive from `src/app/page.tsx` and README. No metrics, achievements, or research values are invented. The proposed 111 Ma readout is explicitly a modeled age already in the application.

### 4. Each feature solves typography, focus and controls independently

Evidence: `globals.css:26–38` specifies fixed heading sizes; Signals overrides H1 with `clamp(2rem,4vw,3.25rem)`, Orbital with `clamp(2.5rem,5vw,3.75rem)`, Atlas with `clamp(2rem,5vw,2.75rem)`. Signals metadata includes `.77rem` and `.78rem` declarations. Global focus is a 2 px blue ring; Deep Time uses 3 px warm amber, Oceanography 3 px blue, and other dark panels override again. Feature radii span `.15rem` through `1rem` with no shared semantic role.

Consequence: reading hierarchy, control shape and focus cues change between modules. This is an inconsistency finding, not a blanket accessibility-failure claim: the existing interfaces already include many good focus, touch and reduced-motion rules.

Proposal: a semantic type scale, 16–18 px body, 14–15 px citations/metadata, tabular numbers, 44–48 px primary controls, shared focus and state tokens. Keep chart-label exceptions documented. Do not globally enlarge all SVG labels or change data scales. Introduce components in the shell/homepage first.

### 5. Local variables duplicate roles and collide in meaning

Evidence: Signals, Orbital, Frontier, Oceanography and Deep Time all define `--ink` and `--muted`, but the former ranges from dark ink on light pages to pale ink on dark pages. Atlas uses `--secondary` for the same text role. `--line`, `--border`, `--paper`, `--surface`, `--dark` and `--panel` recur with different values and roles. These are scoped, so not currently cross-module bugs. They are a migration hazard: replacing a generic `--ink` at root would not unify the interfaces and could break inherited descendants.

Consequence: component reuse and safe theme changes require per-module knowledge. Scientific status colors and controls have no central contract.

Proposal: namespace shared tokens `--strata-*`, preserve local variables, and map them only at reviewed boundaries. Separate action state from evidence classification. Observed / interpretation / unresolved / synthetic each get a visible text label and a non-color border/shape treatment. Scientific classification remains data-owned.

## Cascade and component findings

- Global universal margin/padding reset and global `h1/h2/h3/p` margins remain inherited unless a module overrides them. Changing these would affect every instrument; B should preserve them for legacy canvases.
- Global links suppress underlines. Modules usually restore them; root project cards and navigation use different conventions. Shared text links should be underlined, navigation should have a current marker, and cards should keep a clear action label.
- No externally loaded fonts or existing `next/font` imports were found. Current system stacks are inexpensive but OS-dependent.
- Nested Deep Time modules inherit the parent dark tokens and have their own layout/focus conventions. Do not apply a global reset to these modules.
- Existing feature components (e.g. `SignalsInstrument`, `OrbitalInstrument`, `FrontierInstrument`, Oceanography `Observatory`, Deep Time `TimeEngine`) own scientific behavior. Proposed shared components own framing, not loading, classification, computation or source text.
- Existing homepage and Studio use inline styles. These are suitable first consumers of a dedicated shell/home CSS Module after approval.

## Captured evidence and limits

[Baseline gallery](strata-015/comparison.html): eight routes plus navigation, each at 375, 768 and 1440 px (27 images). [Machine observations](strata-015/baseline/results.json) record HTTP 200, no page-wide overflow and no uncaught page errors in these captures. Source build tree `5658614075ef1fbaf625a01f4f9b07230d285549` equals the production baseline tree.

These are local production-build screenshots, not fresh production or authenticated-preview evidence. Signals is captured in its default state; this does not certify live NOAA availability or every dynamic state. No screen-reader or physical-device test was performed. No before/after application claim is made: Checkpoint A changes documentation only.

[Homepage proposal](strata-015/home.html) and [laboratory proposal](strata-015/laboratory.html) are separate review specimens. Their screenshots show the proposed hierarchy, evidence treatments and source-inspection layout. The laboratory is a representative partial composition, not a functional replacement for all four instruments. Existing scientific UI strings are sourced from `features/deep-time/tethys/transect/evidence.ts`, `model.ts` and `explorer.ts`; the source files are unchanged.

## Concrete comparison targets

| Baseline observation | Proposal to review | Proof required in B |
| --- | --- | --- |
| Plain text brand, white nav beside dark Deep Time | Path-based mark and consistent dark shell | Real route screenshots, focus and all surface contrasts |
| Five instrument links; two missing | Full instrument discovery and current location | All destinations reachable without pointer, no dead routes |
| Seven equal cards with prose-only classification | Featured entry plus labeled instrument index | Labels remain correct and all descriptions retained |
| Source text competes within nested panels | Distinct observed/interpretation/unresolved rules | Same scientific strings and sources, no hidden uncertainty |
| Unrelated sizes, radii and variables | Explicit type/space/state contract | Scoped adoption; untouched chart layout/geometry |

Do not generate altered “after” screenshots of scientific routes before approval. Capture corresponding actual after-states at 375/768/1440 when B is implemented, and perform additional overflow/reflow checks at 320/1024. The original route captures are retained for that comparison.
