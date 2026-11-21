# STRATA-009 Phase 2 · Catch Curve Laboratory

The laboratory extends `/research/bass-2003#catch-curves` in draft [PR #9](https://github.com/DanielBarletta81/strata-builds/pull/9). It uses the isolated `strata-009/phase-2-catch-curves` worktree from the Phase 1 squash merge `0349df77c50519a58da78b6dd5921acb6c3d345d`. The original checkout and the earlier Phase 1 worktree retain their local work.

## Evidence reconciliation

All 16 original photographs matched the archive manifest and the separately supplied `SOURCE_PHOTOS_MANIFEST.md`. The local ZIP carries a different filename from the mission order. Its file-level hashes establish that the photographs are the ones listed by the researcher. The original photographs, derivatives and local reviewer log stay outside the public app and source control. Photograph reuse rights remain unresolved. [Source inventory](BASS_2003_SOURCE_INVENTORY.md)

| Sampling period and gear | Figure locator | Printed figure Z | Printed Table 1 Z |
| --- | --- | --- | --- |
| 1995 electrofishing | IMG_3954.jpg, caption cropped | 0.604 | 0.60 |
| 1996 electrofishing | Figure 2, IMG_3955.jpg | 0.573 | 0.57 |
| 1998 electrofishing | Figure 4, IMG_3956.jpg | 0.472 | 0.47 |
| 1995–1998 pooled electrofishing | Figure 5 in Results, IMG_3957.jpg | 0.638 | 0.64 |
| 2000 angling | IMG_3960.jpg, caption unreadable | 0.660 | 0.66 |
| 2001 electrofishing | IMG_3962.jpg, caption obscured | 0.487 | 0.49 |
| 1999–2002 pooled electrofishing | Figure 15 in Results, IMG_3966.jpg | 0.573 | 0.57 |

The seven figures report fitting ages 3–10. The laboratory requires a unique Table 1 match by period, gear, pond group, season, and scope. The 15 Table 1 rows and two Table 2 rows are byte-for-byte identical to the Phase 1 records. The figure annotations and table estimates retain their respective precision. Their agreement after rounding leaves the underlying fit relationship unverified.

Zero coordinates were digitized and all seven scatterplots and regression traces are withheld. Three individual caption numbers, the 2001 figure’s upper age-axis bound, and the growth photograph’s Figure 16 or 17 identity remain unresolved. Table 2 prints `Stocked Systems (2002)**` and the Results describes pooling post-stocking data from 1999–2002 for Figure 17. The Methods cites Ricker (1975) and Ford–Walford plots. The fitted equation and t₀ sign convention remain unresolved. [Figure audit and digitization protocol](BASS_2003_FIGURE_DIGITIZATION.md) · [Reconstruction method](BASS_2003_RECONSTRUCTION_METHOD.md)

The smallest source request for plot reconstruction is a flat, uncropped scan of Figure 4 with both axes and its caption. A second extraction can then measure repeatability. Recomputing historical mortality and its uncertainty would require the original age frequencies and sampling effort by pond, season, and gear.

## Verification

- Node.js 24.22.3 and npm 11.19.1. `npm ci`, `npm run lint`, `npm run typecheck`, `npm test` (56 tests), `npm run build`, and `npm run test:routes` (20 smoke tests) passed locally.
- The source verifier matched both manifests and rejected a copy with modified `IMG_3954.jpg` bytes.
- Local Chromium at 375, 768, and 1440 px verified keyboard selection, visible focus, both disclosures, and the linked Table 1 anchor for the pooled figure. The populated view showed all seven exact pairs without horizontal overflow or requests for original photos. A separate empty-registry build showed the unavailable state and all 15 Table 1 rows at each width. The browser run used reduced-motion emulation. Screen-reader output and physical devices remain untested.
- The captures show the laboratory with its source and methods disclosures expanded. [Mobile, 375 px](review/strata-009-phase2-mobile.png) · [Tablet, 768 px](review/strata-009-phase2-tablet.png) · [Desktop, 1440 px](review/strata-009-phase2-desktop.png)
