# Bass 2003 catch-curve figure digitization

## Source intake

Store the supplied ZIP, its manifest and the untouched photograph bytes under the gitignored `.research-local/bass-2003/` directory. Identify the manifest's digest and filename fields, then verify each original against the supplied SHA-256. Inventory missing, unexpected and mismatched entries separately. Only passing files qualify for a verified figure record. Keep rotated, rectified and cropped images in a separate derivatives directory. For each derivative retain the original filename and digest, crop bounds, transform parameters, tool and version.

Audit the printed figure number, title, sampling period and gear from the verified photograph. Capture both displayed axis bounds in their labeled units and transcribe the exact printed Z string, including its decimal places. Attribute the regression fitting interval to the figure annotation or the specific report passage that supports it. Unreadable text remains unresolved. Match the corresponding Table 1 row by scope, period and gear and keep the two printed estimates separate.

## Figure audit

Verify the private intake from the repository root after transferring the original ZIP to the ignored directory. The archive can be checked in place. The optional extracted path checks each local copy as well.

```sh
source_dir=.research-local/bass-2003
python3 scripts/verify-bass-photos.py "$source_dir/STRATA009_bass_2003_source_photos.zip" --extracted "$source_dir/STRATA009_bass_2003_source_photos"
```

Pass `--source-manifest` with the path to the separately supplied `SOURCE_PHOTOS_MANIFEST.md` to check it as well. The supplied ZIP and its bundled manifest are pinned in [photo-registry.json](../src/features/bass-2003/photo-registry.json). The [source inventory](BASS_2003_SOURCE_INVENTORY.md) records the matching SHA-256 for each photograph. Figures were read directly from intact or rotated local views. ImageMagick 7.1.2-12 rotated the sideways views by −90°, with unrotated source files preserved. Caption detail crops were used for the curved lower margins. Coordinate extraction is pending.

The ranges below describe the outer **labeled ticks**. The upper plot border extends past the highest labeled log-frequency tick. All seven figure annotations print ages 3–10 and the Results in `IMG_3948.jpg` confirms that analysis interval.

| Source | Printed title and scope | Figure locator | Age ticks (yr) | ln frequency ticks | Printed Z | Digitization limit |
| --- | --- | --- | --- | --- | --- | --- |
| `IMG_3954.jpg` | 1995 Catch Curve (Electrofishing) · Annual | 1995–1998 annual electrofishing series, Figures 1–4 in Results. Caption number cropped. | 0–12 | 0.00–5.00 | `0.604` | A baseline diamond and a diamond close to the fit require independent classification. |
| `IMG_3955.jpg` | 1996 Catch Curve (Electrofishing) · Annual | Figure 2. Caption number visible. | 0–12 | 0.00–5.00 | `0.573` | Shadow at upper left. A diamond at the zero axis and a mark touching the fit need verification. |
| `IMG_3956.jpg` | 1998 Catch Curve (Electrofishing) · Annual | Figure 4. Caption number visible. | 0–12 | 0.00–5.00 | `0.472` | Several diamonds lie on the zero axis, including one at the corner. |
| `IMG_3957.jpg` | 1995-1998 Catch Curve (Electrofishing) · Pooled | Results explicitly identifies this pooled series as Figure 5. Caption number unreadable. | 0–12 | 0.00–5.00 | `0.638` | Curved page and cropped upper right. A diamond touches the fit and another lies at the baseline corner. |
| `IMG_3960.jpg` | 2000 Catch Curve (Angling) · Annual | 1999–2002 angling series, Figures 6, 8, 10 and 12 in Results. Caption number unreadable. | 0–12 | 0–5 | `0.660` | Curved baseline with several zero-axis diamonds and a diamond on the fitted line. |
| `IMG_3962.jpg` | 2001 Catch Curve (Electrofishing) · Annual | 1999–2002 electrofishing series, Figures 7, 9, 11 and 13 in Results. Caption number partly obscured. | 0–10 visible. Upper bound cropped. | 0–5 | `0.487` | Right-hand axis end cropped beyond the last readable tick at age 10. Page curvature and line/axis overlaps prevent full calibration. |
| `IMG_3966.jpg` | 1999-2002 Pooled Catch Curve (Electrofishing) · Pooled | Results explicitly identifies this pooled series as Figure 15. Caption outside crop. | 0–12 | 0–5 | `0.573` | Curved page. Diamonds touch the axis and fit, and faint background marks need independent classification. |

Catch-curve Results references above come from `IMG_3947.jpg`. Two figure numbers are readable in the captions. The Results directly identifies the two pooled figures. Annual series references provide context where the caption is cropped or unreadable. The individual number remains unresolved for those entries. The photograph titles, periods and gear are legible for all seven figures. Several marks overlap a fitted line or the zero axis. The points and line are held pending independent coordinate review. A zero on the logarithmic axis may reflect the authors’ plotting convention. Absent counts, retain the printed coordinate and its ambiguity.

## Rectification and calibration

1. On the original photograph mark the plot boundaries and at least two labeled ticks per axis. Use four well-separated, coplanar anchors to rectify the photographed plot with a projective transform. Keep these anchors in original pixel coordinates. When the geometry is too weak to estimate a stable transform, flag the plot for rephotography.
2. Use visible interior ticks as independent check points. Record their residuals in the plot units. Repeat the calibration independently and retain both readings. Rectification may leave residual error from page curvature, blur or lens distortion.
3. Fit pixel-to-axis mappings to the *printed* tick values. Record x as age in years and y on the printed log-frequency scale after verifying the axis label. Check axis direction and spacing before exporting. The approximate ages and log frequencies stay in those units.
4. Mark the center and estimated footprint of each visible observation symbol on the rectified plot. Trace any printed fit as its own layer. Keep the original source pixel locator and the transformed coordinates for each reading.
5. Report a coordinate uncertainty for each retained point from mark footprint, calibration residuals and disagreement between independent readings. Use an uncertainty interval in each axis's units and round displayed approximations to a precision it supports. These intervals describe extraction uncertainty.

## Evidence states

| State | Treatment |
| --- | --- |
| Verified, readable symbol | Retain approximate age, log-frequency, uncertainty and source locator after the independent check. |
| Explicit plotted zero | Retain a zero coordinate only when a symbol is verified on the zero tick. On an ln axis this is a log-coordinate value. |
| Missing or obscured | Record the marker location or affected interval when known and leave the unavailable coordinate null. |
| Overlapping or ambiguous | Record the cause, candidate extent and source locator. Keep unresolved points out of plotted observations. |
| Printed regression | Record separately from symbols. Label any trace as an approximate reconstruction of the printed line. |

Keep raw individual fish counts, regression standard errors, significance and goodness-of-fit outside the digitized evidence. The archive photographs show a published plot. Actual catch counts require original counts and their sampling records.

## Release check

Select only figures whose identity and reported metadata pass the source audit. Publish a scatterplot only when a second extraction reproduces the coordinates within the documented per-axis uncertainties and the source review confirms the points and line are distinct. A metadata-only figure can still show its exact Z, source locator, corresponding Table 1 row and digitization status.

The Figure 4 pilot documents the blocked coordinate state and exposes the source-quality assessment in the laboratory. [Phase 3 pilot](STRATA-009-PHASE3.md)
