# STRATA-009 Phase 3 · Figure 4 reconstruction pilot

## Scope and source

The pilot starts at Phase 2 squash merge `e2c7cdb224102a37e7f24c2784c3f642504f7b3b` in an isolated `strata-009/phase-3-figure4` worktree. Selecting 1998 electrofishing in the Catch Curve Laboratory reveals the source-quality inspector. All seven historical figure annotations and both historical tables keep their existing printed values.

Figure 4, *1998 Catch Curve (Electrofishing)*, was inspected in the original 2048 × 1536 px photograph `IMG_3956.jpg`. Its recomputed SHA-256 is `0321094cbe674fc047ca1c3370513c360f7246aae219c1993161f20cc59e5b3c`, matching the Phase 2 registry. The original stays in the private research directory. The caption, printed `Z = 0.472`, and fitted ages 3–10 are readable. The matching Table 1 row reports `0.47`. [Source inventory](BASS_2003_SOURCE_INVENTORY.md)

## Source-quality gate

| Evidence | Direct inspection | Reconstruction decision |
| --- | --- | --- |
| Age and ln-frequency axes | Age ticks 0, 2, 4, 6, 8, 10, 12 years and ln-frequency ticks 0.00 through 5.00 in steps of 1.00 are legible. The frame extends above the highest y tick. | Printed ticks are verified metadata. Pixel anchors and numerical calibration remain unavailable. |
| Plot geometry | The camera is oblique and the right boundary visibly bows. The frame and baseline are visible. | A four-corner projective transform cannot account for curvature. No transform was fitted or tested against interior ticks. |
| Diamonds | Nine diamonds are visible above the baseline, some close to the printed line. Three diamond-shaped marks touch the baseline, including one at the lower-right corner. | Individual coordinates and meanings of baseline marks remain unresolved. The counts describe visible symbols on the page. |
| Printed fitted line | The descending segment and printed Z are legible. | The line was withheld. Its endpoints, coefficients, and slope remain unmeasured. |
| Repeatability | No flat, uncropped scan or independent reading was available in the supplied materials. | No coordinate registry, graphical uncertainty intervals, or reconstructed plot. |

The review used the original bytes in the orientation shown. No rotation, crop, rectification, or resampling entered a coordinate calculation. Both the printed annotations and the assessment of the photograph are available as text. The pilot leaves all point coordinates, calibration, independent reading, and traced-line fields empty.

## Procedure when a suitable scan is supplied

Preserve and hash the new source. Record any rotation, crop, or perspective correction separately. Calibrate the plot against labeled tick centers in years and natural-log-frequency units, and record residuals at interior ticks before reading marks. Run an independent calibration and rereading with recorded pixel positions. Compare both readings and retain disagreement, overlap, and graphical uncertainty in the evidence record. Trace the line independently from the diamonds if a trace can be validated. The published Z stays a separate printed value. A log-axis baseline mark alone cannot establish a zero catch count. Original counts and individual fish measurements require their own records. [Full digitization protocol](BASS_2003_FIGURE_DIGITIZATION.md)

The next source request is a flat, uncropped scan of Figure 4 including both axes, all plotted symbols, the regression line, and the caption. The Phase 2 Table 2/Figure 17 scope discrepancy and the growth model's t₀ convention remain unresolved.

## Verification

- The local photograph matched the pinned SHA-256. The Phase 2 transcription and registry are byte-for-byte unchanged. Tests check the source binding, printed tick precision, and the absence of a calibration transform, independent reading, points, or line trace.
- On Node.js 24.22.3 and npm 11.19.1, clean install, lint, typecheck, 58 unit tests, production build, and 20 route smoke tests passed.
- Chromium at 375, 768, and 1440 px verified the figure selector, keyboard focus, touch and pointer disclosures, the accessible source-quality table, the Table 1 jump, all seven source pairs, and reduced-motion emulation. The laboratory had no horizontal overflow, browser errors, or private-photo requests. Physical devices and screen-reader output remain untested.
- [Mobile](review/strata-009-phase3-mobile.png) · [Tablet](review/strata-009-phase3-tablet.png) · [Desktop](review/strata-009-phase3-desktop.png)
