# STRATA-015 — Checkpoint B implementation review

**Implemented for Fleet Command review. Not merged or deployed to production.**

Branch: `strata-015/checkpoint-b`, stacked on approved Checkpoint A `223e22ecc3baaf49d2279591bc6115261cd0c9f3`. Production/scientific baseline: `7690b59f4525516bff95c7bb633b41272739f76a`. PR #18 remains the separate documentation proposal. The implementation PR targets `strata-015/brand-design-system`, not main, so its diff contains B only. After a separately authorized A release, reconcile/retarget B and reverify its exact diff before any release decision.

[Before/after and responsive gallery](strata-015/implementation/index.html) · [Complete file list](strata-015/implementation/files.json) · [Token/component inventory](strata-015/implementation/inventory.json) · [Screenshot hashes](strata-015/implementation/screenshots.json)

## What changed

- Approved **Concept E / Refined Fractured Strata**, unframed header lockup, accessible home link, monochrome light/dark symbols and generated SVG/ICO/Apple/app icons. D remains historical documentation only; it is not a production alternate.
- 45 namespaced tokens for primitives, surfaces, type, spacing, actions, focus, selection, evidence and UI status. Observed, interpreted, modeled, synthetic and unresolved evidence retain explicit text labels, independently of success/warning/error status.
- A server-rendered shell, footer and homepage. Primary navigation is the small pathname-aware client boundary. Native disclosure supports Enter/Space, Escape with focus return, current-page links and focus-out dismissal. All twelve existing pages are reachable, including nested research routes.
- Fourteen shared components: `BrandLockup`; `AppShell`, `PrimaryNavigation`, `Footer`, `LegacyLightCanvas`; `PageHeader`, `ProjectCard`, `Button`, `ScientificPanel`, `DataReadout`, `EvidenceCard`, `SourceDisclosure`, `StatusNotice`, `SegmentedControl`.
- Homepage instrument cards describe actual capabilities and retain observed/modeled/synthetic distinctions. No new readings, claimed research achievements or decorative scientific data.
- `/design-system` demonstrates the shared components, units/uncertainty and unavailable/empty states with explicit illustrative labeling. It has `noindex, nofollow` metadata, is omitted from the unchanged sitemap, and is deliberately linked from the footer.
- Seven route-layout wrappers preserve existing white/light instrument canvases, inherited system typography and native-control scheme. Deep Time retains its own dark canvas. The only global CSS change is the token import; every prior global rule remains intact.

System UI and system mono implement the approved initial font fallback. No runtime font download, new dependency, analytics, data collection, configuration change or source-data change was introduced. The SVG wordmark retains the licensed Source Sans 3 Semibold outlines pinned to Adobe commit `87b37a2daaed80fcb8e8ccb0085c4d72ddade12e`. OFL licensing and asset hashes ship in `public/brand/`. Symbol geometry is the unchanged approved original drawing.

## Scientific integrity

The baseline fixture pins **123 source, data, fixture, public-asset and instrument-page files**. All hashes pass. No `src/features/**` file, scientific route page, API implementation, existing domain test or source fixture changed. Existing unit tests continue to protect Phase 2–3 reconstruction/evidence bytes, published ages and interpretations.

Browser comparisons cover **66 scientific canvas/width combinations**. Text, source-link targets, computed foreground/background colors, typography and element widths/heights match the baseline exactly, independently of the new shell. Full canvas captures at 375 and 1440 px support visual review; this is not a claim that screenshot PNG bytes are identical. NOAA regression screenshots use the existing deterministic fetch stub and fixed November 14, 2026 clock; they are not live observations.

**Preserved entry behavior:** `/deep-time#tethys` scrolls to the chapter but initially leaves the geological timeline on `liquid-water`, just as the baseline does. The existing **Select 111 Ma in the timeline** control opens the laboratory. B does not change scientific initialization. At 111 Ma, all four views and nine transect observations work; the fossil label reads **“111 Ma within published age bracket.”** The inspector exposes both **±0.203 kyr** and **±0.203 Ma**. Leenhardt alternatives, source rights/locators and unsupported-age handling remain accessible. Do not describe the URL fragment alone as automatic 111 Ma selection.

## Actual verification

Runtime: Node 24.22.3, npm 11.19.1 for clean install; Chromium 158.0.8127.37 via installed Playwright Core. No retry of the TOOLING-014-01 browser adapter was used.

| Check | Result |
| --- | --- |
| `npx --yes npm@11.19.1 ci` | Passed; 182 packages installed, zero reported vulnerabilities. |
| `npm run lint` | Passed, zero warnings. |
| `npm run typecheck` | Passed. |
| `npm test` | **94 passed**, zero failed. Includes baseline hashes, navigation matching, approved logo geometry, asset hashes, icon dimensions, 64 semantic contrast pairings and all existing domain tests. |
| `npm run build` | Passed production build. |
| `npm run test:routes` | **24 passed**, zero failed. Existing API/source checks preserved; adds showcase/indexing and icon/manifest delivery checks. The isolated smoke server now copies `public/` so it exercises deployed asset paths. |
| `node scripts/check-design-system.mjs` | **78 route/width cases passed**, at **320, 375, 649, 768, 1024 and 1440 CSS px**. All 13 pages, including four nested research routes and showcase. No horizontal overflow, page/console errors, broken loaded assets or downloaded fonts in the implemented app. |
| Scientific browser interactions | Six widths: four views, nine observations, source inspector keyboard access, fossil bracket, both uncertainties, Leenhardt and unsupported ages passed. Real client navigation from Home to Pawtuxet via the menu passed. |
| `STRATA_A11Y_ONLY=1 node scripts/check-design-system.mjs` | Twelve homepage/showcase cases: 200% text enlargement, custom text spacing, forward keyboard traversal to the footer, cold/warm loading passed. |
| Reduced motion | Showcase selection is immediate under reduce; normal transitions remain available under no-preference. Instrument interactions run with reduce. No new scientific animation or number interpolation. |
| Icon generation | SVG master geometry matches approval; ICO contains actual 16/32/48 PNG entries; Apple 180, app 192/512 dimensions pass. Repeated export with the same Chromium renderer produces identical manifest hashes. Native 16/24/32/48 symbol and icon samples captured at 1× and 2× on light/dark backgrounds. |
| Visual inspection | Saved 320/1440 homepage, 649 Signals, native icons, showcase and scientific inspector/canvas comparisons inspected. Further owner visual acceptance remains pending. |

Browser scripts accept `STRATA_PLAYWRIGHT_MODULE`, `STRATA_CHROMIUM_EXECUTABLE`, `STRATA_APP_ORIGIN` (default `http://127.0.0.1:3260`) and `STRATA_BASELINE_ORIGIN` (default `http://127.0.0.1:3258`). Serve both production builds with the existing NOAA fetch stub and the same fixed clock for canvas comparisons. `STRATA_INTERACTIONS_ONLY=1` reruns the focused science/icon checks. Run the separate `STRATA_A11Y_ONLY=1` mode for the text/load checks. JSON records retain browser version and capture timestamps.

[Browser results](strata-015/implementation/browser-results.json) · [Scientific interactions](strata-015/implementation/interaction-results.json) · [Text and load checks](strata-015/implementation/accessibility-performance.json)

## Performance and assets

[Build measurements](strata-015/implementation/bundle-impact.json) compare all emitted `.next/static` JavaScript/CSS files, not per-route network cost:

| Asset type | Baseline | B | Delta |
| --- | ---: | ---: | ---: |
| JavaScript | 1,287,727 B | 1,262,865 B | −24,862 B |
| CSS | 94,359 B | 107,219 B | +12,860 B |
| Total JS + CSS | 1,382,086 B | 1,370,084 B | −12,002 B |

Per-file gzip estimates total 3,590 B less. Bundle partitioning can change between builds; these measurements do not establish a page-speed improvement. Local cold/warm homepage and showcase checks recorded **CLS 0** and zero downloaded fonts. Resource-level measurements are in the accessibility/performance JSON. No production field performance claim is made.

## Limitations and release gate

- No new application regression was observed in the performed checks. The baseline-only favicon 404 is excluded from before-state diagnostics; B's authorized icon routes are explicitly tested and return successfully.
- Human screen-reader testing, physical-device touch, actual browser chrome/favicon placement, browser zoom and cross-browser acceptance remain **unverified**. Automated text enlargement and spacing are distinct from those manual checks. No WCAG conformance certification is claimed.
- The pre-existing Deep Time fragment/selection behavior above is preserved and documented, not silently changed.
- Local production-build results do not establish authenticated Vercel-preview acceptance or production behavior. No deployment protection or access setting was changed.
- Review-only screenshots include deterministic NOAA fixtures. Do not publish them as current observations.
- The source/font pins and approved symbol construction are documented; trademark clearance is not claimed.

**Stop here for Fleet Command review. No merge, no production deployment, no subsequent phase.** Checkpoint A's original reviewed branch remains unchanged. Any future retargeting after A merges must recheck baseline, scientific hashes, implementation diff and exact-head CI. TOOLING-014-01 remains separate from this implementation.
