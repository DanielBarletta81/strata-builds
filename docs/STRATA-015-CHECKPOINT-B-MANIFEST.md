# STRATA-015 — Checkpoint B implementation manifest

**Prepared only. Checkpoint B is not authorized or started.** Fleet Command accepts the semantic colors, typography hierarchy, evidence-state treatments, accessibility requirements and isolated light canvases as implementation direction. Final identity approval remains pending. Baseline application: `7690b59f4525516bff95c7bb633b41272739f76a`. This manifest defines the allowed implementation file set; additions outside it require a documented scope review.

## Identity decision

Recommend refined **E / Fractured strata**, unframed horizontal lockup. D / Rocket-bolt remains the alternative. Owner must select the mark before the files below are populated. Never mix the silhouettes. The optional frame is not part of the default header, favicon or app icon.

## Existing files to change

| Exact file | Intended change and boundary |
| --- | --- |
| `src/app/layout.tsx` | Replace inline navigation with `AppShell`. Preserve language, metadata title/description and server rendering. No scientific state. |
| `src/app/globals.css` | Import namespaced tokens only. Preserve existing resets, body foreground/background/font, heading, paragraph, link, focus and project-card rules for legacy consumers. New component styles override only inside their CSS Modules. No global dark color-scheme or type replacement. |
| `src/app/page.tsx` | Approved homepage composition, real instrument routes, explicit observed/modeled/synthetic classifications and existing accurate descriptions. No new scientific assertions or invented metrics. |
| `test/routes.smoke.mjs` | Update shell assertions; add showcase, icon, manifest, skip-target and complete navigation coverage without weakening existing page/API checks. |
| `test/metadata.test.mjs` | Add icon/manifest metadata expectations; keep existing canonical robots/sitemap expectations intact. |
| `docs/STRATA-015-CHECKPOINT-A.md` | Link the later B results and distinguish accepted proposal from implementation. |
| `docs/STRATA-015-DESIGN-SPEC.md` | Record the selected identity and actual implementation decisions. |

No package, lockfile, Next configuration, CI workflow, deployment setting or secret changes are planned.

## New shell and brand files

| Exact new files | Responsibility |
| --- | --- |
| `src/styles/tokens.css` | Prefix all primitive, semantic and component tokens with `--strata-`; preserve existing feature-local variables. Use accepted palette, spacing, hierarchy and motion values. |
| `src/components/brand/BrandLockup.tsx`, `src/components/brand/brand.module.css` | Named home link; selected static SVG; no duplicate accessible name. Default 248 px / mobile 232 px where space permits. |
| `public/brand/strata-lockup.svg`, `public/brand/strata-symbol.svg`, `public/brand/strata-symbol-dark.svg` | Exact approved geometry and licensed wordmark paths. No frame in default assets. |
| `public/brand/OFL-SourceSans.txt`, `public/brand/asset-manifest.json` | Retain outline-font license, pinned source revision, exported asset hashes and chosen mark version. |
| `src/components/shell/AppShell.tsx`, `src/components/shell/Footer.tsx`, `src/components/shell/shell.module.css` | Server shell, visible-on-focus skip link, content focus target and real footer links. Preserve each page's existing main landmark; do not nest main elements. Dark styling applies to header/footer only. |
| `src/components/shell/PrimaryNavigation.tsx`, `src/components/shell/navigation.ts` | Small pathname-aware client boundary and verified route registry. Home, six instruments, Studio. Nested instruments remain reachable through parent pages. Current route exposed semantically. Native disclosure, keyboard dismissal and focus return. |
| `src/components/shell/LegacyLightCanvas.tsx`, `src/components/shell/legacy-light-canvas.module.css` | White background, black inherited body text, light native controls, existing system font/1.6 line height. No overrides of feature internals, headings, links or scoped scientific colors. |

`AppShell` uses a focusable `div id="main-content"` around its children, not a second main landmark. Existing pages keep their main elements. Header, footer and new homepage typography are scoped; the body retains its baseline rules. Token declaration alone must not alter legacy appearance.

## Exact compatibility wrappers

Create these route layouts, each wrapping children with `LegacyLightCanvas` and nothing else:

- `src/app/atlas/layout.tsx`
- `src/app/signals/layout.tsx`
- `src/app/orbital/layout.tsx` (also protects `/orbital/voyager`)
- `src/app/oceanography/layout.tsx` (also protects `/oceanography/pawtuxet`)
- `src/app/frontier/layout.tsx` (also protects `/frontier/reconciliation`)
- `src/app/research/layout.tsx` (protects `/research/bass-2003`)
- `src/app/studio/layout.tsx` (preserves its light portfolio placeholder)

Deep Time keeps its existing dark feature canvas and styles. Do not add a light wrapper there. These wrappers introduce no padding, width cap or clipping. All original route page files except the homepage remain byte-for-byte unchanged. The wrapper must preserve sticky elements, full-width charts, portals and focus outlines; compare screenshots and computed styles before accepting it.

## Shared components and consumers

| Exact new files | Consumer and contract |
| --- | --- |
| `src/components/ui/PageHeader.tsx` | Homepage and showcase: explicit heading level, description and actions. |
| `src/components/ui/ProjectCard.tsx` | Homepage and showcase: actual route, description, explicit evidence classification. |
| `src/components/ui/Button.tsx` | Homepage and showcase: native button/anchor with correct disabled and focus behavior. |
| `src/components/ui/ScientificPanel.tsx`, `src/components/ui/DataReadout.tsx` | Showcase only initially. Semantic heading, supplied value/unit/provenance; no precision or uncertainty transformation. |
| `src/components/ui/EvidenceCard.tsx`, `src/components/ui/SourceDisclosure.tsx` | Showcase only initially. Explicit classification and native details; caller owns source text and rights. |
| `src/components/ui/StatusNotice.tsx`, `src/components/ui/SegmentedControl.tsx` | Showcase only initially. Named status; native pressed buttons and stable focus. Unavailable is distinct from zero or unresolved. |
| `src/components/ui/ui.module.css` | Scoped component appearance, shape/text evidence treatments, focus and reduced-motion rules. |
| `src/app/home.module.css` | Homepage-only layout and hierarchy; does not style feature descendants. |
| `src/app/design-system/page.tsx`, `src/app/design-system/SpecimenControls.tsx`, `src/app/design-system/showcase.module.css` | Noindex component showcase with explicitly illustrative examples. No copied scientific calculations or hidden production test routes. Link deliberately from the footer; omit from sitemap. |

Defer `Tooltip`, `SectionNavigation` and a separate `EmptyState` abstraction until a real consumer needs them; `StatusNotice` demonstrates empty/error/loading states. Do not wire the new components into scientific instruments in B.

## Approved logo → favicon and app icons

Create exactly `src/app/icon.svg`, `src/app/favicon.ico`, `src/app/apple-icon.png`, `src/app/manifest.ts`, `public/icons/strata-192.png`, and `public/icons/strata-512.png`. Add `scripts/generate-brand-icons.mjs` for reproducible SVG-to-raster export through a supplied Chromium executable; no new runtime dependency.

Use only the owner-approved standalone symbol, with safe padding and a fixed high-contrast backing. Favicon ICO contains actual 16/32/48 px rasters; SVG uses the same master geometry. Apple icon is 180 px; manifest icons are 192/512 px with purpose `any` (do not claim maskable coverage without a safe-zone check). No service worker or install prompt. Verify each returned MIME type, metadata URL, dark/light browser-tab rendering, and actual 16 px seam survival. This is the planned STRATA-015 icon integration after approval, not an unrelated Phase 4 repair.

## Font decision and source pin

The path-based wordmark keeps Source Sans 3 Semibold from Adobe revision `87b37a2daaed80fcb8e8ccb0085c4d72ddade12e`; the geometric symbols are original. The proposed review mono is Source Code Pro at `803b7e23ec97ae58b6232ea76519a76d428ba268`.

For this exact first B manifest, use system UI/body and system mono, with the accepted size/weight/leading hierarchy and numeric tabular figures. No new font downloads are included: the 385,772-byte review font set exceeds the 100 KB proposed production budget. Source Sans / Source Code remain the intended family direction; shipping subsets would require an amended exact asset manifest, preserved OFL/reserved-name compliance, scientific glyph coverage and measured load behavior before inclusion. The logo paths have no runtime font dependency. Legacy typography stays unchanged.

## Scientific files protected from modification

All `src/features/**`, existing scientific `src/app/**/page.tsx`, `src/app/api/**`, `public` source/data assets, deterministic fixtures and existing domain tests remain unchanged. This includes Atlas synthetic data, NOAA quality/gaps and timestamps, JPL Ceres/Voyager model states, oceanography/Pawtuxet sources, Frontier/reconciliation evidence, bass research, and all Deep Time/Tethys/transect assets.

Preserve the 111 Ma initialization, four Ancient Seaway views, nine observations, the exact fossil age-bracket label, both published uncertainty values, Leenhardt alternatives, unsupported-age handling, citations, licenses, source hashes and all Phase 2–3 scientific assets. No data reclassification or new interpretation is authorized.

## Regression and acceptance files

Create `scripts/check-design-system.mjs`, `test/design-system.test.mjs`, `test/fixtures/strata-015-source-hashes.json`, and `docs/STRATA-015-CHECKPOINT-B-RESULTS.md`. The source hash fixture is generated from the approved baseline, before editing, and cannot be regenerated merely to accept a change. Capture B browser artifacts under `docs/strata-015/implementation/` with an explicit screenshot index and results JSON.

1. Run `npm ci`, lint, typecheck, all domain unit tests, production build and deterministic route smoke tests. Test current-route behavior and native controls, not merely component markup snapshots.
2. Verify baseline hashes across scientific sources and protected files; review the actual diff for only this manifest. Navigation must reach all implemented main routes, including Oceanography and Deep Time.
3. Browser-check home, Studio, Atlas, Signals, Orbital/Voyager, Oceanography/Pawtuxet, Frontier/reconciliation, bass research and Deep Time at 320/375/649/768/1440 px. Compare each scientific content canvas to its baseline independently of the added shell; no clipping or horizontal overflow. Use deterministic NOAA fixtures for repeatable regression.
4. At `/deep-time#tethys`, check 111 Ma, all four views, nine transect observations, source inspectors, fossil bracket, both uncertainty values, Leenhardt and unsupported ages. Confirm existing source links and data classifications in the other instruments.
5. Keyboard: skip target, all nav links/menu, focus return/dismissal, source disclosures, view selection, no trap or lost focus. Reduced motion: no unnecessary transitions, numeric tweening or persistent movement. Check contrast on actual rendered backgrounds, zoom/text spacing, named landmarks and one page H1. Record human screen-reader checks separately.
6. Check native icon rasters, cold/warm loads, disabled-font fallback, scientific glyphs and bundle/transfer changes. Record actual results and limitations; HTTP success does not prove accessibility or appearance.
7. Draft PR review and owner authorization remain separate from merge/deployment. Do not alter protection, production configuration or TOOLING-014-01.

**Next safe action:** owner approves final identity and this B scope (including the bounded system-font fallback), then authorizes Checkpoint B. This document is a plan, not an implementation or a record of passed B tests.
