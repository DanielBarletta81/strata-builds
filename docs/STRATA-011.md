# STRATA-011 — The Living Water Column

The observatory at `/oceanography/pawtuxet` lets visitors move through published depth bins from the Narragansett Bay Commission (NBC) Pawtuxet Cove station, compare readings within a cast, and trace each reading to its workbook. Implementation started from `origin/main` at `6deeb293135f52b2e4ff99f9dc981a255c679022`.

## Source contract

| Field | Published workbook columns | Captured range |
| --- | --- | --- |
| Depth | E · m | 0.25–5.5 |
| Temperature | F · °C (source header `Temperature (C)`) | 7.9681–27.279 |
| Dissolved oxygen | J · mg/L | 2.66952–13.87145 |
| Published density | L · kg/m³ | 1001.4571–1022.4368 |
| Salinity | M · psu | 4.0136–30.4785 |

- The 2014 workbook contributes 22 casts and 292 rows. The 2016 workbook contributes 27 casts and 299 rows. The January 15, 2014 visit has metadata at `2014 Metadata!J3` and no published depth rows. The workbook dates and clocks retain their source labels. The UTC offset remains unverified.
- At the fixed `Pawtuxet Cove` station, exact date and workbook clock select the cast. Workbook year, data sheet, and original Excel row locate a reading, with a field column for each cell. The source inspector exposes the selected row, published units, visit metadata, workbook URL and SHA-256. The released capture, extractor, workbook hashes and cast helpers are byte-identical to the baseline.
- All five reviewed columns are numeric in the 591 published rows. Per-reading QA flags are absent in those columns. The model retains numeric zero, exposes missing values and missing depths, and omits a point when either plotted field has no numeric value. Seven repeated depth groups retain separate rows. For example, October 8, 2014 at 14:53:00 lists 2.75 m in both rows 3830 and 3832.
- The plot displays each published bin at its numeric x/y position on fixed axes. NBC may average downcast readings within a depth interval. The water lighting is illustrative and conveys no measured property. No lines connect the samples. The numerical table retains source precision and enables selection of rows that overlap in the plot. [Original source audit](PAWTUXET_WATER_COLUMN_SOURCE_AUDIT.md) · [NBC profile methods](https://www.narrabay.com/snapshot-of-the-bay/water-quality-initiatives/water-quality-profiles/)

## Calculations and limits

Deep-minus-shallow comparisons use numeric readings at the unique shallowest and deepest published bins of one cast. The displayed difference is rounded to four decimal places. The published values retain their precision. The bins have unknown distances from the water surface and bed. Salinity compares salt content. The distinct published density field supports a difference between sampled bins and has an unspecified calculation and reference basis. Neither result establishes the shape or persistence of layering, the circulation pattern, or a continuous salt wedge.

The oxygen screen applies strictly below 3 mg/L to numeric observations at unique depths. July 20, 2016 at 10:00:00 is the only qualifying cast. The three readings are 2.79513, 2.66952 and 2.69799 mg/L at 3.25, 3.50 and 3.75 m (`2016 Data!J2044:J2046`). Those readings describe one cast. The reporting reference cannot establish duration, spatial extent, regulatory compliance, or a species-specific effect. [RIDEM Narragansett Bay reporting reference](https://dem.ri.gov/latest-bay-area-report)

The NBC station may sample different water from the oyster-bearing rocks beneath the bridge. The retrospective 2016 oyster observation is separate evidence. Oyster survival and restoration outcomes require their own evidence and a verified station and event crosswalk. The nutrient workbooks are a separate sampling program.

## Interaction

`explorer-model.ts` tracks cast, measurement lens, workbook row and evidence layer. Changing the cast chooses its unique deepest row when possible, otherwise the first row in depth and workbook order. Changing the lens or evidence layer keeps the same row. Native selects, previous and next buttons, plot markers and the numerical table share that selection. The readout and source inspector use the same record. Plot markers support arrow keys, Home and End. The evidence tabs support Left, Right, Home and End. The Source & Quality layer shows the row and visit metadata. Investigate pairs each lens with an unresolved question and the evidence needed to address it.

## Verification

- Node 24.22.3 and npm 11.19.1. Clean install, lint, typecheck, 65 unit tests, production build and 20 route smoke tests passed. Five new fixture-backed cases cover cast and row changes, lens and layer persistence, repeated rows, missing fields and numeric zero, plot coordinates, units and source-cell correspondence. The route smoke test checks the profile, evidence labels and source locators.
- Chromium at 375, 768 and 1440 px on a local production build. Verified the row and locator stayed synchronized through pointer and keyboard selection, checked a touch selection in the 375 px emulation, opened the numerical table and source disclosure, and exercised all four lenses and all three tabs. Visible focus, tested text contrast, reduced-motion suppression and zero page overflow passed. Physical devices and screen readers remain untested.

| Width | Observed Profile | Source & Quality | Investigate |
| --- | --- | --- | --- |
| 375 px | [Mobile](review/strata-011-mobile-observed.png) | [Mobile](review/strata-011-mobile-source-quality.png) | [Mobile](review/strata-011-mobile-investigate.png) |
| 768 px | [Tablet](review/strata-011-tablet-observed.png) | [Tablet](review/strata-011-tablet-source-quality.png) | [Tablet](review/strata-011-tablet-investigate.png) |
| 1440 px | [Desktop](review/strata-011-desktop-observed.png) | [Desktop](review/strata-011-desktop-source-quality.png) | [Desktop](review/strata-011-desktop-investigate.png) |

## Next scientific milestone

Request tide-stamped repeat oxygen casts or a time series at known depths near the NBC station to investigate whether low oxygen persists. Future microscopy evidence needs an independently verified sample register, timestamps, locations, depths and permissions. Any crosswalk to the NBC workbooks requires its own verification.
