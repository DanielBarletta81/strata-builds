# STRATA-006 Evidence Frontier

## Investigation

**Where does the 2012 Narragansett Bay surface temperature record break, and which breaks are explained by the sampling schedule?**

This first instrument inspects two independently collected records: Bullock Reach's fixed near-surface sonde and Station II's weekly surface bucket samples. They overlap in year and report °C. Their sites, depths, devices and temporal supports differ. The route presents an inventory of coverage within each source. [Source inventory, data access, and reuse terms](EVIDENCE_FRONTIER_SOURCE_INVENTORY.md)

STRATA-006 starts from merged STRATA-005 at `9a722fe6d8c8a05758406d31e358c3ddc6344459`. Vercel production reported Ready at that SHA and the public Orbital Observatory route served 1 Ceres. An isolated worktree preserved existing local work. [STRATA-005 merge](https://github.com/DanielBarletta81/strata-builds/pull/4) · [Baseline deployment](https://vercel.com/daniel-barlettas-projects/strata-builds_v1.0/23CS8NERbtCvaTsqRRWABDqh9iQq)

## Coverage and evidence rules

1. Use the station-specific NBC deployment window of May 17–November 26, 2012 for Bullock Reach B4-S. Keep May 17 and November 26 as partial boundary dates. The 172 calendar days outside that schedule are planned seasonal non-sampling for this deployment. Other stations or instruments may have sampled then.
2. Expect 96 quarter-hour worksheet cells for each of the 192 full interior days (May 18–November 25). A finite numeric near-surface temperature cell counts as reported. Inspect the edited release rather than the corrected and potentially filled product. Confirm a blank only when its source grid row exists. A missing day in an incomplete capture is unknown, with 96 unresolved slots. A complete interior grid yielded **18,421 reported of 18,432 expected**, with **11 blanks on 10 dates**. The matching dates have provider out-of-water notes. Two note times differ from the workbook slots by one minute. The classification describes the release and leaves the cause of each individual cell open.
3. For Station II, count populated `Temperature_SURF` fields by distinct published year/week key. Preserve real zero-valued temperatures. Group only by source labels and never create ISO weeks or exact dates. The 2012 file gives **0 of 52** temperature entries. The provider explicitly documents a collection gap for that variable that year. The adjacent 2011 and 2013 figures (32 of 52 and 46 of 52) describe archive presence and leave exact weekly scheduling unresolved.
4. Inspect method, location, nominal depth, units, cadence and time support before considering any data join. Keep differences visible. The B4 report and worksheet coordinates differ, so the locator uses the explicitly identified workbook position with the alternate reported in the finding. An unresolved coordinate does not establish station movement.
5. Relate incomplete records to a particular provider, product, site and reviewed period. An accessible index or report can document a dataset without providing rows. An endpoint error, a restricted workbook, or an archived release ending does not establish a collection gap. A conclusion about pollution, equipment failure, loss of funding or ecological decline requires affirmative evidence.

### Classification contract

`CoverageFinding` extends the shared evidence contract with date- or year-scoped findings. It retains verification, detection rule, coverage basis, direct source records, assumptions, alternatives, limitation and next evidence-gathering action. It leaves the earlier UTC source-gap contracts intact.

| Classification | Required basis |
| --- | --- |
| Confirmed missing observation | Audited expected source grid with a blank at a traceable row, or independent support from a provider-confirmed variable-specific collection exception. |
| Planned seasonal non-sampling | Explicit time-bounded station or program plan and fewer expected observations outside it. |
| Source not yet inspected | Candidate source identified, with records pending inspection. |
| Known dataset but inaccessible records | Documented dataset and a scoped download, authorization or availability barrier. |
| Uncertain monitoring continuation | Records stop or publication changes and later collection cannot be determined. |
| Incompatible sampling methods | Documented method, units, station, depth, cadence or temporal support differences that prevent the proposed join. |
| Conflicting records | Traceable records give different assertions about the same scoped fact, with interpretation pending. |
| Potentially outdated findings | Documented change in method, conditions or coverage relevant to a prior result, warranting replication assessment. Age alone is insufficient. |

## Reproducible captures

`src/features/frontier/data/bullock-2012.json` retains civil dates, grid counts, nonblank counts and one-based row references for blank cells. `station-ii-weeks.json` retains original archive years and week keys plus temperature presence for 2011–2013 and the secondary 1997–1999 metadata check. The application ships no temperature values. These are derived source records, with no illustrative or synthetic inputs shown on the route.

| Input | Original SHA-256 |
| --- | --- |
| [RIDEM 2012 ZIP](https://datadem.ri.gov/documents/bart/nbfsmn12.zip) | `faa31c9b5bc784cd1971807fa873d4f7242f87bb662798374bbc837e1a48e8e4` |
| Nested `B4.nbcBR2012.editted.xls` | `b801a00f9c73810a90fcae3830194133dfda4a9cc044e936fe390cdad3b4d0be` |
| [BCO-DMO 874956 v1 CSV](https://datadocs.bco-dmo.org/dataset/874956/file/5AAMkwXSglPxE4/nbpts_data_1959-2019_final.csv) | `4b3a66d2e6aeead290bbd148d03aee727112b6be461366196fc32360cdf2f252` |

For a deliberate offline reproduction, supply those two downloaded files to `python scripts/extract-frontier.py nbfsmn12.zip nbpts_data_1959-2019_final.csv` with `xlrd==2.0.2` in an isolated Python environment. Python and xlrd are audit-only. The script checks the exact hashes, field names, worksheet times and uniqueness. It rejects temperature cells marked as calculated and leaves blank cells distinct. BCO-DMO data are CC BY 4.0. See the source inventory for attribution and limits.

## Interface and next investigation

The prerendered `/frontier` route shows a source timeline, exact monthly counts, site locator, source links, auditable blank-cell rows and native disclosure controls. No visitor-time source calls, external chart assets, or application dependencies are added. The code calculates coverage from two frozen inputs and leaves interpretation to the reader.

The smallest next check is to match **July 10 at 09:30 and 09:45**, B4-S, with the sonde log, original logger rows and the edit history. For Station II, locate a dated 2012 field record and a post-2019 temperature accession with explicit QA and sampling metadata. Paired depth and time observations would be needed before using one site to replace the other.

## Verification

Node.js 24.22.3 and npm 11.19.1 passed clean install, lint, typecheck, 33 unit tests, production build, and 16 route smoke tests. Fixtures cover schema validation, civil dates, archived week keys, exact coverage counts, off-season and boundary handling, unknown coverage, compatibility, and evidence classifications. The extraction reproduced both versioned projections from the pinned source bytes.

Chromium 158 at 375, 768 and 1440 px verified the timetable, both locator points, source links, visible keyboard focus, exact July rows, and evidence and inventory disclosures. Open tables fit without horizontal overflow. Disclosure targets measured at least 46 CSS px high. Touch emulation at 375 px verified the timeline and evidence disclosures. Screen-reader and physical-device testing remain unverified.

Full-page captures show the historical coverage and the first finding’s traceable worksheet rows. [Desktop 1440 px](review/strata-006-desktop.png) · [Tablet 768 px](review/strata-006-tablet.png) · [Mobile 375 px](review/strata-006-mobile.png)
