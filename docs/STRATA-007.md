# STRATA-007 · Evidence Reconciliation

The Evidence Frontier now links to `/frontier/reconciliation`, a pair of Narragansett Bay case files. They follow published records through acquisition, editing, correction and archival release, with an explicit next record to look for in each case.

## Baseline

`origin/main` and the new worktree started at `554f404356653ccccf8a1c3efc098d8f9743942d`, the merged STRATA-006 change. Vercel marked its production deployment READY for the same SHA. The original checkout's changes to `package.json` and `tsconfig.json`, plus its untracked files, were preserved in place. Existing worktrees and scientific calculations were left intact. [Production baseline deployment](https://vercel.com/daniel-barlettas-projects/strata-builds_v1.0/HpjtR6kE6aDqVBWcy82jzkbKDZ3B)

## Findings

| Case | Current outcome | Smallest next evidence |
| --- | --- | --- |
| [Bullock Reach B4-S, July 10, 2012](reconciliation/BULLOCK_REACH_2012.md) | **Partially resolved.** Edited F5230 and F5231 are blank. Both matching cells in the corrected workbook are explicitly marked calculated. Neither reviewed surface raw export contains a matching row for those slots. | The two field-listed deployment downloads and the correction worksheet for F5230 and F5231. |
| [Station II, BCO-DMO 874956 v1](reconciliation/STATION_II_HISTORY.md) | **Unresolved source conflict.** Published numeric counts are 16, 0, 42 and 0 in 1997, 1998, 1999 and 2012 respectively. Fifteen numeric 1997 weeks agree with the older workbook, with two week-level discrepancies. URI's separate workbook documents later dated temperature entries through January 13, 2025. | The original field or compilation crosswalk for legacy 1997 weeks 7–8 and the populated 1999 weeks, with the preferred post-2019 citation and QA. |

Bullock Reach's documented field event and the corrected product establish different pieces of the trace. Station II's file presence and collection statements remain separately inspectable. No archive temperatures were interpolated or promoted to independently verified field measurements in this audit.

## Implementation and verification

The feature contains typed evidence records, source receipts, match logic, claims and outcomes. Its static route uses native disclosures, semantic source links, and individually traceable archive weeks. All science comparisons use pinned local captures. The two calculated Bullock Reach values display to two decimals, with each exact cell value and the workbook fingerprint available in a native disclosure. [Method, data rights and extraction commands](RECONCILIATION_METHOD.md)

The verification covers hashes, source versions, raw versus edited/corrected cells, time alignment, duplicate and missing timestamps, inaccessible records, unresolved conflicts, year/week counts, sentinels and rendered source locators. The source and derivation fixtures keep the full quality suite offline. The curator inquiry is drafted in the Station II case file for human review.

Local verification passed on Node 24.22.3 and npm 11.19.1. Clean install, lint, typecheck, 39 unit tests, production build and 17 route smoke tests passed. Chromium at 375 and 1440 px verified the Frontier link, case navigation, all ten keyboard disclosures, focus outlines and no page overflow with disclosures open or closed. [Desktop screenshot](review/strata-007-desktop.png) · [Mobile screenshot](review/strata-007-mobile.png)
