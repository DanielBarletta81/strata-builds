# Pawtuxet Water Column Explorer source audit

The explorer uses released Narragansett Bay Commission (NBC) profiler data from its Pawtuxet Cove station. It includes **49 published casts and 591 depth rows**, plus one visit documented in sampling metadata. All dates and clocks are source labels. The UTC offset is unverified.

## Verified sources

| Source | Retrieval UTC | SHA-256 |
| --- | --- | --- |
| [2014 Water Column Profile Data](https://www.narrabay.com/wp-content/uploads/2024/04/2014-Water-Column-Profile-Data.xlsx) | 2026-11-21T04:06:10Z | `7bdd16823a2d46199e6a4eb0939067b4b20d7a1d1a2858443779a10c20ddeaed` |
| [2016 Water Column Profile Data](https://www.narrabay.com/wp-content/uploads/2024/04/2016-Water-Column-Profile-Data.xlsx) | 2026-11-21T04:06:10Z | `9a6e14530f83ef7eece531a45ffc3a41053681cc5421d1db1157155dcdb51086` |

NBC describes profiling while lowering a Sea-Bird instrument, screening readings, and often averaging readings within a depth interval before plotting. Use workbook `E` (depth in m), `F` (temperature in °C, source header `Temperature (C)`), `J` (oxygen in mg/L), `L` (density in kg/m³), and `M` (salinity in psu). The source does not specify the density algorithm or reference pressure in these worksheets. The plot shows discrete published bins. [NBC profiler program and methods](https://www.narrabay.com/snapshot-of-the-bay/water-quality-initiatives/water-quality-profiles/)

The audited **2014 and 2016 nutrient workbooks** are a separate sampling product with their own sample IDs. Their Pawtuxet Cove surface rows contain salinity and temperature. The 2014 bottom label has one numeric set for salinity and temperature, on February 20 (row 53). 2016 bottom rows have those fields blank. Neither workbook contains a dissolved-oxygen column. Even the February 20 nutrient-workbook rows 52 and 53, which share a station stem and associated field blank, have source clocks 10:50 and 11:00 and no profiler cast key. The explorer leaves those measurements in their source inventory and derives its comparisons only within the profile workbooks. [2014 nutrient workbook](https://www.narrabay.com/wp-content/uploads/2024/04/2014-NBC-River-and-Bay-Nutrients-Data.xlsx) · [2016 nutrient workbook](https://www.narrabay.com/wp-content/uploads/2025/11/2016-NBC-River-and-Bay-Nutrient-Results.xlsx)

| Source tab | Pawtuxet Cove cast coverage | Depth rows | Metadata exception |
| --- | --- | ---: | --- |
| `2014 Data` | 22 casts, May 21–October 29, 2014 | 292 | January 15 marked in `2014 Metadata!J3`. NBC notes that YSI data are available upon request. The public data tab has no rows for that visit. June 19 is identified as outside the routine schedule. |
| `2016 Data` | 27 casts, April 20–November 23, 2016 | 299 | All 27 Pawtuxet metadata dates have a published cast. |

## Matching and quality rules

- A cast groups the exact source station label `Pawtuxet Cove`, date, and source clock within the year-named data tab. Each reading retains its original Excel row. Station-date metadata identifies visits but never substitutes for an observation. Pair a shallow and deep value only within the same cast.
- Endpoints are the shallowest and deepest **published bins** sorted by numeric depth. Water-surface and bed positions are unknown. A repeated endpoint has no unique comparison value. Five 2014 casts have seven repeated depth keys. Keep every row separately in the plot and inspector. On October 8 at 14:53:00, maximum depth 2.75 m is repeated in rows 3830 and 3832. On October 15 at 13:41:00, the maximum is 3.75 m in row 4001 even though the final row lists 3.25 m. Matching by row position would give a different result.
- The reviewed casts have numeric values in the five selected columns and no per-reading QA flags or comments in those columns. The capture preserves the metadata visit marks and notes. Missing fields remain missing and repeated depths remain ambiguous. Standard numeric formatting is not treated as a QA judgment.
- Salinity contrasts compare salt content. The distinct density field can support a statement about a published density difference between two observed bins. Its reference basis, conditions between sampling depths, and the shape or persistence of any stratification remain unresolved. Avoid inferring an intervening boundary or spatial salt wedge.

## Verified example and oxygen screen

**July 20, 2016 at 10:00:00** source clock, `2016 Data`, rows 2036–2046. These are observations from the same NBC cast.

| Published depth | Salinity | Temperature | Dissolved oxygen | Published density |
| --- | ---: | ---: | ---: | ---: |
| 1.25 m (`2036`) | 26.3142 psu | 25.2498 °C | 5.33 mg/L | 1016.7244 kg/m³ |
| 3.75 m (`2046`) | 29.0424 psu | 23.7477 °C | 2.69799 mg/L | 1019.2272 kg/m³ |

Deep minus shallow is **+2.7282 psu** salinity and **+2.5028 kg/m³** published density for this cast. There is no cross-date pairing.

The screen uses **strictly below 3 mg/L**, consistent with RIDEM’s Bay reporting threshold. Apply it to numeric observations with unique depth keys. Only the example cast crosses the screen. Readings are **2.79513 mg/L at 3.25 m** (`J2044`), **2.66952 mg/L at 3.50 m** (`J2045`), and **2.69799 mg/L at 3.75 m** (`J2046`). The three bins belong to one cast. They cannot establish continuous duration, the spatial footprint, exposure at the bridge, a species-specific response or regulatory compliance. [RIDEM Narragansett Bay Water Quality Report](https://dem.ri.gov/latest-bay-area-report)

NBC's cove station may sample different water from the oyster-bearing rocks beneath the bridge. The researcher’s 2016 retrospective oyster observation remains a separate case record with no verified sample-event crosswalk. No original personal sensor files were used.

## Reproduction and rights

Save the two linked workbooks in a directory under their original filenames. Use an isolated Python environment with `openpyxl==3.1.5`. The extractor verifies workbook hashes and the expected source columns. The repository retains a bounded, attributed set of facts and locators. Broader redistribution terms for the original workbooks remain unverified. The browser and CI run on the pinned extract.

```sh
python3 -m venv /tmp/strata-pawtuxet-env
/tmp/strata-pawtuxet-env/bin/pip install openpyxl==3.1.5
/tmp/strata-pawtuxet-env/bin/python scripts/extract-pawtuxet.py /path/to/workbooks > /tmp/pawtuxet-profiles.json
cmp /tmp/pawtuxet-profiles.json src/features/oceanography/pawtuxet/profiles.json
node --test test/pawtuxet.test.mjs
```

## Verification

The extract reproduced byte for byte. Lint, typecheck, 47 unit tests, production build and 19 route smoke tests passed. Chromium at 375 and 1440 px verified date and metric selection, source row inspection, repeated-depth and metadata-only states, visible keyboard focus and the disclosures. Both viewports fit with the disclosures open. [Desktop screenshot](review/pawtuxet-desktop.png) · [Mobile screenshot](review/pawtuxet-mobile.png)
