# STRATA-009 Phase 4 · Immersive Evidence Observatory

Baseline `541280f55b58be814cdc3f363f23256811e65b12`. Branch `strata-009/phase-4-evidence-observatory`. Route `/research/bass-2003`.

## Experience

The redesign brings the Catch Curve Laboratory directly beneath the 2003 report header. A dark, route-scoped palette and strong numeric hierarchy emphasize what readers can inspect. Desktop places the figure register beside the readout and context. Tablet moves the register above the workspace. Mobile stacks the register, tabs, readout, and context.

- **Published evidence** presents the selected figure’s exact printed Z, its matching Table 1 Z, and the printed fit ages. The original locator, report citation, units, and table jump remain available.
- **Source quality** presents explicit audit states. Figure 4 adds its printed ticks, geometry, mark visibility, and independent-reading limits. Its full audit table remains in a native disclosure.
- **Open questions** separates unresolved questions from printed findings and names the records that could address them.

The native figure selector stays available across all three layers. `catch-curve-evidence.ts` defines the tab order, arrow and Home/End behavior, and explicit quality states. `catch-curve-laboratory.tsx` exposes the three panels and preserves the selected figure across tab switches. The existing Figure 4 detail table is reused. `bass-observatory.tsx` adds the Fish Scale Laboratory entry point. `bass.module.css` scopes the dark surfaces, spacing, focus, and responsive rules to this route.

## Evidence contract

`Verified` applies to the published metadata and hashed photograph receipts. `Readable` applies to Figure 4’s printed tick labels and uses a separate accent. `Unresolved` covers pixel calibration and the independent reading. `Withheld` covers digitized observations and the reconstructed line. Text carries every state.

The transcription, seven-figure registry, and Phase 3 Figure 4 audit match the baseline byte for byte. That preserves all 15 Table 1 rows, both Table 2 rows, exact figure annotations, fitted ages, source identities, and photograph hashes. The Table 2–Figure 17 sampling discrepancy and the growth equation’s t₀ convention remain unresolved. Figure 4 still has no validated coordinates, transform, or trace. The original photographs remain private.

The Fish Scale Laboratory preview describes age estimation from annuli and the need for verified specimen micrographs and individual fish records. [NOAA Fisheries age-determination methods](https://www.fisheries.noaa.gov/new-england-mid-atlantic/science-data/equipment-and-techniques-age-determination-methods-northwest)

## Verification

- Node.js 24.22.3 and npm 11.19.1. Clean install, lint, typecheck, 60 unit tests, production build, and 20 route smoke tests passed locally.
- Chromium at 375, 768, and 1440 px verified all seven exact Z pairs, keyboard figure selection, tab focus and wrapping, preservation of selection, the matching Table 1 anchor, native disclosures, the Figure 4 audit table, and the conceptual Fish Scale preview. Reduced-motion emulation disabled the tab transition. No horizontal overflow, clipped text, browser errors, or private source-image requests were observed. Physical devices and screen-reader output remain untested. [WAI-ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)

| Layer | Desktop | Mobile |
| --- | --- | --- |
| Published evidence | [1440 px](review/strata-009-phase4-desktop-published.png) | [375 px](review/strata-009-phase4-mobile-published.png) |
| Source quality | [1440 px](review/strata-009-phase4-desktop-source-quality.png) | [375 px](review/strata-009-phase4-mobile-source-quality.png) |
| Open questions | [1440 px](review/strata-009-phase4-desktop-open-questions.png) | [375 px](review/strata-009-phase4-mobile-open-questions.png) |

## Next review

Review the layer hierarchy and mobile reading order before release. A flat, uncropped Figure 4 scan with both axes, every symbol, the regression line, and the caption is the next evidence request for reconstruction. The Fish Scale Laboratory can move beyond its preview once provenance and rights are documented for suitable micrographs and individual age records.
