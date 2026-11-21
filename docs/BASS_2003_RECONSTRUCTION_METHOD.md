# Bass 2003 reconstruction method

## Table 1

Preserve the printed strings from the supplied transcription. The key is period plus method, with season, pond group, and annual or pooled scope retained. The mortality plot allocates bar length from the selected printed cell. It shows four annual estimates and a separately reported pooled estimate within a single group, season and method. Table 1 remains visible in its source order regardless of the plot selection. Missing methods yield no record. A native period change keeps the chosen gear if a Table 1 row exists for it, otherwise it selects the period’s available gear and updates the displayed context.

Reported Z is instantaneous mortality estimated from catch curves for ages 3–10. The plot describes the rate on an annual age-step basis. S and A are unitless fractions over one year. Tests compare rounded S to the general constant-rate exponential relationship and check that S and A complement each other. The interface uses only the printed cells. It leaves catch-curve estimates in scope of the sampled gear and ages. Recruitment, sample selectivity, effort and the different sampling seasons can affect interpretation. [FAO background on mortality and survival](https://www.fao.org/4/x5685e/x5685e05.htm)

## Table 2

The instrument compares the two reported fits as parameters. L∞ is the model asymptote in mm, K describes the approach to that asymptote, and t₀ is printed in years. The transcription gives no unit for K. The complete report method must establish its t₀ sign, model equation and implementation before a numerical prediction is appropriate. The two groups and periods also differ in design, so the fitted contrast alone leaves stocking effects unresolved. [FAO general growth model and Ford–Walford method](https://www.fao.org/4/w5449e/w5449e04.pdf)

## Keep four evidence classes distinct

| Class | Meaning | Current availability |
| --- | --- | --- |
| Transcribed source value | The printed text or number supplied by the researcher, with table or figure locator and original precision. | Tables 1 and 2. |
| Reconstructed model output | A value calculated by a documented model replica with verified inputs, units and equation. | Pending original growth equation and methods. |
| Digitized approximate figure value | A coordinate estimated from pixels, with calibrated axes, procedure and extraction uncertainty. | Pending legible, reusable images. |
| Original individual fish measurement | A field or laboratory record tied to a fish, gear, pond, date, effort and age determination. | Pending recovery and validation. |

A printed figure annotation belongs to the first class. Record its figure identifier, page, sampling scope and decimal string independently from Table 1. Fitted catch-curve slopes, digitized line points and individual fish counts retain their own provenance.

## Original-file intake

1. Save the original report scan or photograph locally and compute SHA-256 before processing. Record document ID, page order, visible table or figure labels, scan date if provided, and reuse rights. Preserve the received original and any transformations as separate files.
2. Compare each Table 1 and Table 2 cell against the image, including units, punctuation, zero padding, sign and row context. Record mismatches as evidence conflicts. Replace the provisional status only for verified rows, and keep the earlier transcription in history.
3. Verify the method pages, figure legends and actual-versus-predicted notation before constructing or digitizing plots. If digitization is approved, document the image crop and axis transform, assess legibility and repeatability, and retain a locator and uncertainty for each estimate.
4. If fish-level records are recovered, preserve row IDs, original units and age and gear codes. Validate duplicates, rejected records, effort and pond context before any model reproduction. Reports of length-at-age and legal-size abundance require their own evidence contracts.

Routine tests build and check the route from the tracked transcription. They require no external files or data service.
