# Bullock Reach B4-S · July 10, 2012

**Partially resolved.** The two edited temperature blanks match bold calculated numbers in the corrected workbook. Neither corresponding raw value was found in the reviewed surface logger text or raw workbook. The calculation recipe and the original deployment downloads are outstanding.

## Pinned records

The RIDEM 2012 archive was originally fetched at **2026-11-21T00:28:32Z**. This investigation reused that byte-verified copy on November 21, 2026 UTC. Nested files inherit the archive retrieval timestamp. Attribution goes to the Narragansett Bay Fixed-Site Monitoring Network, RIDEM Office of Water Resources, and Narragansett Bay Commission (NBC). The six-slot comparison uses only the relevant factual fields. The source products remain in the provider's archive. [RIDEM release](https://datadem.ri.gov/documents/bart/nbfsmn12.zip)

| File or member | SHA-256 |
| --- | --- |
| `nbfsmn12.zip` | `faa31c9b5bc784cd1971807fa873d4f7242f87bb662798374bbc837e1a48e8e4` |
| `B4.nbc.Bullock Reach 2012 Raw Files.zip` | `ebf0c24f61233114a9fa2a1b201af1d7e7eb2e2f5d11bb5564a438e2fd091fc0` |
| `BullocksReach_Surface.txt` | `84103ccb372e3d89dbc8fec632d3db0737196627c09aaaf73984b53046caca35` |
| `BR_2012_Surface.xls` | `66930d8a0ac5ec25d4c05d1204f9cfb951845279d3fe221522f4e2ad312d580c` |
| `B4.nbcBR2012.editted.zip` | `7db9af65c133b831e7298f1865959f5a05729df32e7eeb36641c9700a39f3cd1` |
| `B4.nbcBR2012.editted.xls` | `b801a00f9c73810a90fcae3830194133dfda4a9cc044e936fe390cdad3b4d0be` |
| `B4.nbcBR2012.corrected.zip` | `6bcd5641605745bf4633699fbf78002f7ebd33142649de9bfba7b2aef19663fa` |
| `B4.nbcBR2012.corrected..xlsx` | `b670816f7d53de5f783edb4db0f0de1bf490283afc04948b8865fb3f6e68fd83` |
| `Bullock's Reach Surface  Metadata 2012.doc` | `983522956961d44658e3c977b1605f27f7eb05ec4db16bdd4a66f67dacd408f2` |
| `MetadataIntro2012.doc` | `205292321f8f80f8c4c3cfda684a16d87e953a16bde0fb4c77b4f134658a994e` |
| `2012_EMDA_Data_Report.pdf`, fetched 2026-11-21T01:15:07Z | `e8308afe30480e83ae69b5be340f814d8e8b8799c69161f9d45a130c7cf341c9` |

Use `nbfsmn12/B4.NBC.Bullock Reach/` for station products and `nbfsmn12/MetadataIntro2012.doc` for the production conventions. In the nested raw ZIP, descend to `B4.nbc.Bullock Reach 2012 Raw Files/B4.nbc.Bullock Reach Surface Raw Files 2012/`. The archive also provides bottom and mid-depth products. The per-deployment filenames cited in the field notes do not appear as members of the reviewed B4 archives. [Archive](https://datadem.ri.gov/documents/bart/nbfsmn12.zip)

## Source comparison

The raw logger identifies itself as `TOACI1`, `BR BUOY`, `Sonde1Data`. Its `snd1Parms(1)` values match the raw workbook's `BullocksReach_Surface!C` `Surf_Temp` values in the window. The workbook units row specifies `C`. Both processed `BR` sheets use `Temp` in column F with unit `C`. All row and line numbers below are one-based. Logger lines and `RECNBR` are separate identifiers. Corrected numbers retain the XLSX cell tokens.

| Grid clock | Logger clock and locator | Raw sheet cell | Edited BR cell | Corrected BR cell | Relation to field notes and match basis |
| --- | --- | --- | --- | --- | --- |
| 09:00:00 | 09:01:04 · line 20147 · #20151 · 23.27 °C | C5181 · 23.27 | F5228 · 23.27 | F5228 · 23.27 | Before reported swap. Clock +64 seconds, exact numeric agreement. |
| 09:15:00 | 09:16:04 · line 20148 · #20152 · 23.49 °C | C5182 · 23.49 | F5229 · 23.49 | F5229 · 23.49 | Last raw row before the reviewed gap. Same match basis. |
| 09:30:00 | No row at 09:31:04 | No row | F5230 · blank, regular | F5230 · 23.473333333333333, bold · calculated | Field notes list out-of-water interval and retrieval at 09:30. Direct grid match to corrected. Raw correspondence unresolved. |
| 09:45:00 | No row at 09:46:04 | No row | F5231 · blank, regular | F5231 · 23.509999999999998, bold · calculated | Inside field-note interval. Direct grid match to corrected. Raw correspondence unresolved. |
| 10:00:00 | 10:01:04 · line 20149 · #20153 · 23.37 °C | C5183 · 23.37 | F5232 · 23.37 | F5232 · 23.37 | First raw row after the reported swap. Clock +64 seconds, exact numeric agreement. |
| 10:15:00 | 10:16:04 · line 20150 · #20154 · 23.35 °C | C5184 · 23.35 | F5233 · 23.35 | F5233 · 23.35 | After reported swap. Same match basis. |

Adjacent temperatures have no edited/corrected bold flag in either workbook. The logger export has no temperature-specific QA flag in the inspected field. The raw and edited row numbers differ, so matching by row index would produce false results. Both target cells receive **No corresponding raw value found in the reviewed files**. Notes!C7 describes blanks as deletions without calculation. That convention and the out-of-water note are evidence about the edits and field interval. The two consecutive logger counters across the gap leave the archive's underlying capture history unresolved. The bold font resolves that the *corrected release* treats the replacements as calculated. Neither corrected F cell contains an XLSX formula. No documented temperature recipe was found for these cells.

## Time and field evidence

- The network introduction's Parameter Code section specifies local standard time and quarter-hour normalization for processed `Date & Time`. The B4 workbooks use quarter-hour labels. The raw export and field-note clocks have no separately confirmed UTC offset, and the matching rule is limited to same-date source labels. Four paired rows with identical temperatures establish the usable **+64-second raw-minus-grid** offset in this window. They cannot distinguish truncation from nearest-quarter-hour treatment.
- The September 6 and October 31 field-note exceptions say 07:31. The logger says 07:31:04 at lines **25705** and **30983**, corresponding to edited grid blanks at **BR!F10790** and **BR!F16070** at 07:30:00. These rows support normalization as the explanation for the discrepancy between the note label and the edited grid. The choice of the minute in field notation and the underlying logger clock setting are undocumented. The July note uses grid-minute labels. No cross-source UTC instant was inferred.
- The surface deployment table lists **06B2620AA** ending July 10 at 09:30, `B4.nbcbrs062612`, and **07F10031** starting at 09:35, `B4.nbcbrs071012`. The anomalous-data section lists the sonde as out of water from 09:30 to 09:45. Its post-check table flags fouling on the recovered unit and the deployment narrative discusses effects on salinity and dissolved oxygen. This supplies maintenance context for the changeover. The source gives no independent temperature-failure assessment at these times. Section 5 of the NBC report describes near-surface placement, quarter-hour collection, and calibration and retrieval procedures. [NBC 2012 report, pp. 35–37](https://www.narrabay.com/wp-content/uploads/2022/08/2012_EMDA_Data_Report.pdf)

**Smallest next check.** Compare the two field-listed deployment downloads, if retained, with the logger lines before and after the gap. Request the correction worksheet or editing history for BR!F5230–F5231 to establish the input values and calculation. No files outside the public archive or original lab records were obtained.
