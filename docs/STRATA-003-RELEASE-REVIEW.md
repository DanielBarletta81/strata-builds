# STRATA-003 release review

## Release candidate

| Item | Verified value |
| --- | --- |
| Repository | `DanielBarletta81/strata-builds` |
| Branch | `strata-003/microsat-atlas` |
| Reviewed application HEAD | `94a86cc818aabf30fcb37d6a0132c1fdedd36426` |
| Pull request | [#2](https://github.com/DanielBarletta81/strata-builds/pull/2), open and draft |
| Preview | [Atlas branch preview](https://strata-buildsv10-git-strata-00-7b1b0a-daniel-barlettas-projects.vercel.app/atlas) |
| Reviewed deployment | [Vercel inspection](https://vercel.com/daniel-barlettas-projects/strata-builds_v1.0/EiJZQrxHEcb7G6FZtAHvYn1ZzFsZ), Ready, with source SHA matching the reviewed application HEAD |

The feature worktree was clean at the expected SHA, and the remote branch matched it. This report records the application revision used for the checks and images.

## Verification

GitHub Actions passed clean dependency installation, lint, TypeScript, all 9 unit tests, production build, and all 6 route smoke tests for the reviewed HEAD. A local production build and the same 9 unit tests and 6 route smoke tests also passed. [GitHub Actions quality run](https://github.com/DanielBarletta81/strata-builds/actions/runs/44802473236)

Browser checks used that local production build in Chromium 158.0.8127.37 at 1× scale, with initial viewports of 1440 × 960, 768 × 960, and 375 × 960 CSS px and reduced motion enabled. The full-page captures include the methodology and attribution. The table captures preserve keyboard focus and selection on flagged synthetic record `MSX-003`. Touch emulation used a 375 × 812 viewport.

| Width | Visual and interaction findings |
| --- | --- |
| 1440 px | The map leads with legible labels and symbols. The inspector follows the map, the composition panel aligns beside it, and the selected marker, site, and table row are visually distinct. |
| 768 px | The map, inspector, and composition stack in reading order. Controls and composition counts stay readable, and the single column uses the available width. |
| 375 px | The site and sample selectors each measure 309 × 44 CSS px. The table selection button measures 64 × 44 CSS px and the map shortcut measures 184 × 44 CSS px. The page and table fit without horizontal overflow. Map labels remain separate, the selection is visible, and the synthetic-data warning and methodology remain readable. |

Keyboard checks covered Tab and Shift+Tab, directional arrows, Home and End, and activation with Enter and Space. Visible focus and selection were verified. The table and site-first picker synchronized the selected record across the map, inspector, and composition panel. The browser touch replay exercised the shortcut, picker, and table at 375 px. Screen-reader output and physical-device behavior remain unverified.

## Scientific integrity

The production build displayed **SYNTHETIC DEMONSTRATION DATA**, explained that the records represent no measured genotypes, and showed 108 validated synthetic records, 13 sites, 21 neighborhood flags, and zero rejected records. The build credited the [U.S. Census Bureau cartographic boundaries](https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html) for the coastline and linked the [pinned Microsat Atlas source](https://github.com/DanielBarletta81/microsat-atlas/tree/591b3b8afd1650028a5fbc68c08576e9c2a92a96) for the generator and method.

A sample is flagged when at least three of its five nearest neighbors share the same assignment that differs from its own. The page presents the comparison as descriptive and calls for independent evidence for any claims about population boundaries, migration, or statistical significance. The review found no genuine genetic research claims. The report leaves the generator, calculations, and fixture data untouched.

## Screenshot inventory

The six earlier files were present in `/Users/dbarletta_mb_pro/Desktop/GH_Portfolio_Projects/strata-003-design-review.BAGv2a/`. This package uses the fresh production-build captures throughout. Four PNGs matched the earlier files byte-for-byte.

| Capture | PNG dimensions | Absolute path |
| --- | --- | --- |
| Desktop full page | 1440 × 2373 | `/Users/dbarletta_mb_pro/Downloads/strata-builds-techv1.0/STRATA-003-release-review.EAyvaL/atlas-1440.png` |
| Desktop records | 1224 × 481 | `/Users/dbarletta_mb_pro/Downloads/strata-builds-techv1.0/STRATA-003-release-review.EAyvaL/atlas-1440-records.png` |
| Tablet full page | 768 × 3383 | `/Users/dbarletta_mb_pro/Downloads/strata-builds-techv1.0/STRATA-003-release-review.EAyvaL/atlas-768.png` |
| Tablet records | 708 × 481 | `/Users/dbarletta_mb_pro/Downloads/strata-builds-techv1.0/STRATA-003-release-review.EAyvaL/atlas-768-records.png` |
| Mobile full page | 375 × 3658 | `/Users/dbarletta_mb_pro/Downloads/strata-builds-techv1.0/STRATA-003-release-review.EAyvaL/atlas-375.png` |
| Mobile records | 343 × 481 | `/Users/dbarletta_mb_pro/Downloads/strata-builds-techv1.0/STRATA-003-release-review.EAyvaL/atlas-375-records.png` |

## Release decision

- **P0** None found.
- **P1** None found.
- **P2** The coordinate labels at 375 px render at roughly 11 CSS px and some symbols cluster. A future mobile polish pass could improve map legibility. The site-first picker and table already support precise sample selection.

**READY** for Fleet Command’s release decision.
