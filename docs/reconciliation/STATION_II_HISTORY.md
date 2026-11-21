# Station II historical surface temperature

**Unresolved source conflict.** Numeric fields are present for 16 of 52 archive weeks in 1997 and 42 of 52 in 1999. The v1 methodology lists both years as collection gaps. An earlier Station II release corroborates 15 of the 1997 values at the same published year/week keys and disagrees on two weeks. Separate URI records show post-2019 measurements. They do not establish how the 1959–2019 archive was assembled.

## Release and curation

The reviewed release is **BCO-DMO 874956 v1**, version date July 28, 2022, DOI **10.26008/1912/bco-dmo.874956.1**, by Tatiana Rynearson and Patricia Thibodeau, URI Graduate School of Oceanography, CC BY 4.0. The study calls for attribution to **The Narragansett Bay Long-Term Plankton Time Series** and the date of accession. The pinned CSV was accessed November 21, 2026 UTC. The metadata describes weekly surface bucket sampling at Station II in the West Passage. It gives this variable-specific statement under Methods & Sampling, “No data were collected for the following parameters during the following years: Temperature: 1997-1999; 2012”. [Dataset and methodology](https://www.bco-dmo.org/dataset/874956) · [URI data and attribution guidance](https://web.uri.edu/gso/research/plankton/data/)

The archived description says processing used Excel 2202 and R 4.1.2. BCO-DMO standardized field names, mapped `NA` to `nd` and rounded numeric fields to two decimals. The description gives no temperature source, substitution rules or cell-level QA flags for these disputed weeks. The release is listed as final, with one archive and no updates expected. The file's provider-listed MD5 `b849b129b7325eadd2be788600885ae3` matches the reviewed bytes alongside the SHA-256 pin. [Captured description](https://www.bco-dmo.org/dataset/874956/Dataset_description.pdf) · [Project catalog](https://www.bco-dmo.org/project/877536)

| Captured artifact | Retrieval (UTC) | SHA-256 |
| --- | --- | --- |
| [`nbpts_data_1959-2019_final.csv`](https://datadocs.bco-dmo.org/dataset/874956/file/5AAMkwXSglPxE4/nbpts_data_1959-2019_final.csv) | 2026-11-21T00:26:51Z | `4b3a66d2e6aeead290bbd148d03aee727112b6be461366196fc32360cdf2f252` |
| [BCO-DMO description PDF](https://www.bco-dmo.org/dataset/874956/Dataset_description.pdf) | 2026-11-21T01:13:44Z | `169a3894a1fbd933dce19ea5e6123921211b48bed9732106506c641f8bce20fa` |
| [Legacy `Temperature.zip`](https://www.narrbay.org/d_projects/plankton-tsv/d_data/d_physical/Temperature.zip) | 2026-11-21T01:08:34Z | `18795da2d309b6efbaccf887525c272b3db59fce25dc497bdf4d2ceb75efec3a` |
| Legacy member `Temperature.xls` | Same ZIP | `d0130bb3b5951ca38ff2e28edac3d801f83a29e67d780fb37ec9643ff7a887a9` |
| [NABATS `nabats-water-temperature.xlsx`](https://www.nabats.org/download/nabats-water-temperature.xlsx) | 2026-11-21T01:13:40Z | `a8ec84a67e440c67b6ec9eb357580656666d29cd8f5a16bdca9a3c97594b5d15` |
| [URI `Physical-Data-Master-Data.xlsx`](https://web.uri.edu/gso/wp-content/uploads/sites/916/Physical-Data-Master-Data.xlsx) | 2026-11-21T01:05:42Z | `e73438ef6c32aa01c42c6aabca19a46104aee29f58f6c4735fb9050df3476992` |
| [Brown ERDDAP 1997–99 query](https://erddap.riddc.brown.edu/erddap/tabledap/plankton_time_series_7615_c513_ef8e.csv?time,WaterTempSurface&time%3E=1997-01-01T00%3A00%3A00Z&time%3C2000-01-01T00%3A00%3A00Z) | 2026-11-21T01:05:42Z | `927b472dde4b5b3c5e57b464f8f28bc7914f0dfeca8f10ca8a8b122a12f532a8` |
| [PNAS companion repository](https://github.com/psthibodeau/Thibodeau-et-al-2023/tree/61cb5e6aedc13a45b304739e3c4f01564790d6fd) · `NBPTS data 1959-2019 Final.csv` | 2026-11-21T01:06:03Z | `bb79fbcb4f381dd6e5157474f2aa829fab54660d8ff220f8a593a494d628f98f` |
| Same repository · `raw.data.dlm.csv` | 2026-11-21T01:06:03Z | `fe03b2af796c23d59dec07a67703ff2f7805ecddc92cf6dce196a02fac8f080f` |
| Same repository · `Thibodeau Code for PNAS_Final.R` | 2026-11-21T01:06:03Z | `2f64fe62e41b986e5e547d0bcb302471aee93375166e963a063d627a06a90015` |

## Published field audit

Each year contains week labels 1–52. Line locators include the header. `nd` means missing. Numeric fields, including zero, count as present. The archived values have unit °C. Year/week keys remain source labels. Calendar dates in the legacy and URI workbooks describe their own records.

| Archive year | Published numeric | `nd` | Numeric week labels | CSV lines |
| --- | ---: | ---: | --- | --- |
| 1997 | 16 | 36 | 1–6, 8–17 | 1978–2029 |
| 1998 | 0 | 52 | None | 2030–2081 |
| 1999 | 42 | 10 | 4–18, 20–22, 24–27, 29–32, 34, 38–52 | 2082–2133 |
| 2012 | 0 | 52 | None | 2758–2809 |

The 1998 and 2012 archive agrees with the gap statement within this release. The 1997 and 1999 archive establishes publication during the stated collection gap. The comparison leaves collection dates, methods and provenance of the individual cells unresolved.

## Earlier and later evidence

- **1997 legacy temperatures.** The NarrBay export contains 18 keys in `Temperature.xls`, sheet `1 column`, rows 1978–1995. It uses the 1904 workbook date system. Compare `Year`, `Week` and surface °C to the v1 archive. Fifteen numeric values agree, one week is missing in both products and two weeks differ. Week 7 is 5.50 °C at legacy E1984 (legacy date February 20) versus `nd` at v1 CSV line 1984. Week 8 is 5.00 °C at legacy E1985 (legacy date February 24) versus 5.25 °C at v1 line 1985. The current NABATS XLSX repeats those legacy week 7 and 8 numbers in `Sheet1!G1991:G1992`. Both publications end with keys from 1997. The evidence supports early-1997 temperatures in the legacy archive. The 15 agreements are consistent with common source material, without identifying the v1 import path or resolution of the differences. [NarrBay archive index](https://www.narrbay.org/d_projects/plankton-tsv/plankton-tsv.htm) · [NABATS physical data](https://www.nabats.org/nabats-physical-data.html)
- **1999 dated URI workbook.** Inspect `Sample` rows 3–55, columns C, D and G. There are 46 entries labeled `N. Bay sta. 2`, of which 45 have a numeric surface field, including nine zeros. Numeric values by multiset, keeping repeated values, overlap in 41 of the 42 BCO-DMO cells. The extra v1 value by multiplicity is a zero. Nearby workbook labels include other sites. Matching numeric values alone cannot assign 1999 archive weeks to URI dates or classify zeros as recorded measurements or missing-value placeholders. [The Narragansett Bay Long-Term Plankton Time Series, data accessed November 21, 2026 UTC](https://web.uri.edu/gso/research/plankton/data/)
- **2024 analysis.** Thibodeau et al. describe interpolating missing variables in a separate dynamic linear model workflow. At repository pin `61cb5e6aedc13a45b304739e3c4f01564790d6fd`, compare each target year and week in `NBPTS data 1959-2019 Final.csv` (`year,week`) and `raw.data.dlm.csv` (`Year,Week`) against v1. Map companion `NA` or empty values to missing and compare numeric `Temperature_SURF` values. All 208 keys agree in presence and value in both inputs. The R script reads `raw.data.dlm.csv` before fitting the models. This supports carry-through of the released inputs into analysis. The study's separate gap filling does not establish provenance for the disputed numeric input cells. Prior methods sources in the BCO-DMO description cover earlier nutrient or chlorophyll protocols and supply no identified temperature crosswalk. [Thibodeau et al. 2024, Materials and Methods](https://pmc.ncbi.nlm.nih.gov/articles/PMC11127012/#s7) · [Pinned companion repository](https://github.com/psthibodeau/Thibodeau-et-al-2023/tree/61cb5e6aedc13a45b304739e3c4f01564790d6fd)
- **Brown representation.** ERDDAP lists a local-file source and dataset-wide extent from 1959-01-21 08:00 UTC to 2019-03-11 08:00 UTC. The selected field query returns 17 numeric entries in 1997 and 45 in 1999 across the returned records. These query counts use Brown's time field and include repeated date rows and numeric zeros where served. There is no verified join from those time stamps to v1 year/week. Treat this as a related publication path, with an unverified relationship to either upstream file. [ERDDAP schema](https://erddap.riddc.brown.edu/erddap/tabledap/plankton_time_series_7615_c513_ef8e.html)
- **After 2019.** The URI Physical Data workbook contains dated Station II surface temperature values, including `Sample!C1023:G1023` on **2020-01-06** and `Sample!C1278:G1278` on **2025-01-13**, both labeled `N Bay sta. 2`. The latter is the latest dated entry in this captured copy. That verifies a later separate set of records. It does not establish uninterrupted weekly temperature sampling, the full program's current coverage or a successor DOI with equivalent QA and schema. The reviewed BCO-DMO project catalog lists v1 as final. BCO-DMO 906562 v2, March 2021 to September 2023, is a separate dock-based series with a different listed centroid and sampling method. [URI source workbook](https://web.uri.edu/gso/wp-content/uploads/sites/916/Physical-Data-Master-Data.xlsx) · [BCO-DMO project catalog](https://www.bco-dmo.org/project/877536) · [906562 sampling metadata](https://www.bco-dmo.org/dataset/906562)

No publicly reviewed release supplied the original 1997 and 1999 import crosswalk, complete Station II field logs, or numeric-cell QA notes for the disputed rows. Differences in collection scope, partial-year data, earlier or different measurement sources, and later compilation or reconstruction are possible explanations. There is insufficient documentation to select one.

## Draft curator inquiry · for review, unsent

**Subject** — Provenance of Station II surface temperature in BCO-DMO 874956 v1

Hello,

We are documenting the provenance of `Temperature_SURF` in The Narragansett Bay Long-Term Plankton Time Series (BCO-DMO 874956 v1, DOI 10.26008/1912/bco-dmo.874956.1). The methodology lists 1997–1999 and 2012 as temperature collection gaps. In the released CSV we found 16 populated weeks in 1997 and 42 in 1999, with all fields marked `nd` in 1998 and 2012.

Do you know whether the collection statement refers to a particular field program or source? Is there a source crosswalk, field log or compilation note for the populated 1997 and 1999 rows? Legacy 1997 weeks 7–8 differ from v1, and `Sample` in URI's Physical Data workbook includes dated 1999 temperatures and numeric zeros. Guidance on those specific rows and the meaning of the zeros would help us describe the archive accurately.

We would also appreciate the preferred citation or accession for temperature data after 2019 and any QA notes that accompany it. Thank you for helping us document the release accurately.
