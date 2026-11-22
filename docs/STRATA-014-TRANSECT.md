# STRATA-014 Phase 4 · Platform-to-Basin Transect

The Ancient Seaway Laboratory at `/deep-time#tethys` adds a comparative facies transect. Select **111 Ma** in the shared chronology, then **Platform-to-Basin Transect**. The three columns represent the platform interior, its margin and an adjacent regional marine basin record. Their order explains how different settings can contribute to the geological record. The columns are individually sourced and schematic. Their spacing, texture and alignment carry no scales for time, distance, bed thickness, elevation or water depth.

## Baseline and Phase 3 closeout

At the release gate, `origin/main` was `482af7c55477348168ef6cf16a44576b9c5d96c1`, the Phase 2 squash commit. PR #16 was an open draft at `b59a16cd49ffc7975ec852ab4c4a760f5322c800`. The separate Phase 4 worktree starts at exactly that Phase 3 commit. The Phase 4 draft targets the Phase 3 branch so the review diff shows Phase 4 only. Fleet Command can revisit the base after Phase 3 release. [Phase 3 draft](https://github.com/DanielBarletta81/strata-builds/pull/16)

The nine Phase 3 screenshots were checked against the reviewed files and inspected at 375, 768 and 1440 px. The plate legend and selection, marine evidence and uncertainty, and source and process disclosures were legible. The 375 px detail crop confirmed the age comparison labels and unresolved-location disclosure. The existing screenshots remain in the Phase 3 report. [Phase 3 screenshots](STRATA-014-SEAWAY.md#verification-and-screenshots)

The Phase 3 archive comparison reproduced **0.98571°** on x86-64 pyGPlates 1.0.0, which shares the numerical core used in the ARM run. A separate dependency-free quaternion calculation verified **0.98571°** for Apulia Africa-fixed, **0.52061°** for Adria Africa-fixed and **13.35069°** for Adria in the published frames. It reads the pinned rotation files, finds the two poles bracketing 111 Ma for each relevant plate pair, interpolates unit quaternions along the shorter arc, composes each named circuit and compares the rotated points by great-circle angle. It needs the Phase 2 EarthByte archives in their manifest directories and the Phase 3 regional ZIP. Archive and rotation member hashes are checked. This independent calculation tests only the identified 111 Ma circuits and checkpoints. Polygon membership, geographic crosswalks and field locality restoration remain separate.

```sh
python3 scripts/check-transect-rotations.py PATH_TO_EARTHBYTE_ARCHIVE_ROOT PATH_TO_REGIONAL_ZIP
```

The Apulia separation remains a diagnostic. The four Phase 2 evidence files and the two Phase 3 data files are byte-identical to the reviewed baseline. The 193 lithosphere parts, 85 boundary segments and eleven model checkpoints retain their exact source records.

## Source review and rights

| Source | Material checked | Use in Phase 4 |
| --- | --- | --- |
| ISPRA Bari Sheet 438 | Full survey notes, §2.1, p. 33 and Fig. 10. Lithofacies B contains shell debris and benthic foraminifera. It recurs in the composite. | Descriptions and locators. Cartography stays at source. [Survey notes](https://www.isprambiente.gov.it/Media/carg/note_illustrative/438_Bari.pdf) |
| Spalluto & Caffau (2010), Spalluto (2012) | Publisher abstracts. Reassigned parts of the Calcare di Bari composite using biostratigraphy and characterized subtidal, peritidal and terrestrial facies. | Broad stratigraphic and facies context. Publication figures and logs have unverified reuse rights. [2010 stratigraphy](https://doi.org/10.3301/IJG.2010.18) · [2012 facies](https://doi.org/10.1007/s10347-011-0266-0) |
| Spalluto et al. (2025) | Full Giovinazzo study, §§4.2, 4.3.1–2, 5.3 and 6. Field logs and thin sections describe microbial laminae, drying features and brecciated paleosols. | Factual summaries only. Section and figures stay at source. Section §5.3 compares tentative correlations using differently dated charts. The paper calls the chronostratigraphic resolution limited. [Giovinazzo study](https://doi.org/10.1002/dep2.305) |
| Zunino et al. (2012), Graziano (1999, 2000) | Full Gargano field guide, p. 18, pp. 76 and 85–86 and Fig. 72. Publisher abstracts of the two Graziano studies. The guide describes massive lithic megabreccias, slope deposits and faults. The 1999 abstract addresses the earlier drowning surfaces. | Descriptions with source-level precision. No map, photograph or measured profile copied. [Field guide](https://doi.org/10.3301/GFT.2012.02) · [Drowning surfaces](https://doi.org/10.1046/j.1365-3121.1999.00256.x) · [Margin stratigraphy](https://doi.org/10.1006/cres.2000.0201) |
| Coccioni et al. (2012, 2014) | Full 2012 core report, pp. 42–44 and Figs. 2 and 5, and 2014 publisher abstract. These describe the lithologic succession, pelagic microfossils and organic-rich horizons. | Cited observations. The 2012 report is CC BY 3.0. Its broad regional bathyal interpretation on p. 42 supplies no water depth at a specific 111 Ma station. [Drilling report](https://doi.org/10.2204/iodp.sd.13.07.2011) · [Outcrop study](https://www.micropress.org/microaccess/stratigraphy/issue-312/article-1907) |
| Ramos et al. (2024, 2026) | Full versions of record. The 2024 study’s Table 3 differs from its conclusions for Leenhardt. The 2026 study’s Tables 1–2 report age and stratigraphic markers from the tuned Poggio le Guaine core. | Selected numeric facts and document locators. The 2024 paper is CC Attribution. The 2026 paper is CC BY-NC-ND 4.0. Its layout, tables, figures and supplement stay at source. [2024 study](https://doi.org/10.1029/2024PA004860) · [2026 study and license](https://pmc.ncbi.nlm.nih.gov/articles/PMC12894972/) |
| Van Hinsbergen et al. (2020) | Full version of record, §5.3.1 and Figs. 1, 4 and 23. Provides regional tectonic context and an independently published rotation circuit. | Paper CC BY 4.0. The separate package stays at source. No regional geometry added. [Regional tectonic study](https://doi.org/10.1016/j.gr.2019.07.009) |

Sources accessed November 22, 2026 UTC. The textures in the interface are original CSS and represent broad material categories.

## Evidence register and age coverage

The [typed register](../src/features/deep-time/tethys/transect/evidence.ts) links observations and interpretations to separate fields. It retains modern locality, stratigraphic unit and locator, age basis and uncertainty, placement and required restoration, reuse rights and outstanding evidence.

| Setting | Published observation | 111 Ma assessment | Limiting evidence |
| --- | --- | --- | --- |
| Platform interior | Shell-rich Calcare di Bari limestone, lithofacies B | Broadly age-compatible | Recurrent facies in an Albian composite with gaps between outcrops |
| Platform interior | Giovinazzo microbial laminae and cavities | Broadly age-compatible | Relative foraminiferal dating of the section, with no numeric date for an individual bed |
| Platform interior | Giovinazzo brecciated paleosols | Unresolved | Bracketing bioassemblages and a tentative sequence correlation leave 111 Ma exposure unverified |
| Platform margin | Massive Posta Manganaro megabreccias at the Stop 2 approach | Broadly age-compatible | The observed exposed unit is assigned to part of the Albian, without a numerical bracket for these beds |
| Platform margin | Mattinata channels, graded megabreccias and fault drapes | Broadly age-compatible | Broad Lower Cretaceous setting. The guide’s late Albian date for its Fig. 72 locality applies to that example |
| Platform margin | Younger of two drowning unconformities | Outside target interval | The published relative date is late early Aptian |
| Marine basin | Poggio le Guaine pelagic marl and limestone | Broadly age-compatible | Recurrent lithologies in the core with no selected marl bed tied to exactly 111 Ma |
| Marine basin | Poggio le Guaine planktonic-foraminiferal zone | 111 Ma within published age bracket | The published tuned model brackets 111 Ma between nominal boundaries at 112.80 and 110.70 Ma |
| Marine basin | Leenhardt organic-rich shale | Outside target interval | Both alternatives in the 2024 source put this bed before the snapshot |

The basin age gate uses the published *Microhedbergella rischi* marker at **60.20 m down-core, 112.80 Ma** and the *Ticinella primula* marker at **50.03 m down-core, 110.70 Ma**, in Ramos et al. (2026), Table 2. These are model-derived age bounds on a local stratigraphic interval. The Table 2 note lists **±0.203 kyr**. The discussion reports approximately **±0.203 Ma**. The lab shows the nominal bounds and discloses the unit discrepancy. It does not calculate a 111 Ma core depth, assign a bed at that age or extend the bracket to the platform and margin. [2026 source, Table 2 and discussion](https://pmc.ncbi.nlm.nih.gov/articles/PMC12894972/)

For Leenhardt, the 2024 conclusions report **111.28 ± 0.12 Ma** and Table 3 reports **111.40–111.44 Ma**. The 2026 Table 1 lists **111.40–111.44 Ma** for the interval at **52.97–53.26 m down-core**. Both 2024 alternatives fall on the older side of 111 Ma. The discrepancy remains open. None of these core depths describes water depth. [2024 source, Table 3 and conclusions](https://doi.org/10.1029/2024PA004860) · [2026 source, Table 1](https://pmc.ncbi.nlm.nih.gov/articles/PMC12894972/)

## Interaction and limits

The fourth layer uses the existing 111 Ma chronology gate. Visitors choose an environment, then one of its reported observations. The inspector identifies the observation, author interpretation, unresolved question, age status, source locator and restoration requirements. The reducer synchronizes source relationships with Marine Evidence and Open Questions. Apulia is a contextual checkpoint for platform and margin. The basin has no restored locator and selecting it retains the last map checkpoint. The source, model and reconstructed geography remain distinct.

A comparative facies transect supports reasoning about environments and physical processes. Coeval sections, continuity, spatial placement, seaway connectivity, bathymetry and ocean circulation remain open. No field coordinates, sample geometry, ecological occurrences or simulated values were added. Phase 5 should select one source-defined platform-to-margin correlation and seek a dated marker or independent calibration in both sections. Recover bed logs, source rights, landmark ties, and a structural restoration before testing geographical continuity. The basin age bracket is a benchmark to compare against, with the uncertainty-unit discrepancy still open.

## Verification

The deterministic tests cover references, source access and rights, age compatibility and conflicts, record and layer synchronization, unavailable placements and the frozen reconstruction and evidence hashes. The route smoke test also guards the unsupported initial chronology state.

With Node 24.22.3 and npm 11.19.1, `npm ci`, lint, typecheck, 88 unit tests, production build and 22 route smoke tests passed. Chromium 158 verified every observation at 375, 768 and 1440 px. Checks included keyboard and visible focus, emulated mobile touch, contrast samples, reduced motion, source disclosures, layer synchronization, supported and unsupported ages, and overflow. The Phase 2 and Phase 3 browser checks also passed at each width. The lab made no upstream requests and raised no runtime errors. The baseline’s implicit favicon request still returns 404.

The browser check is available in [test/browser/transect.mjs](../test/browser/transect.mjs). It runs against `http://127.0.0.1:3254` by default. After starting the production build, use an existing Playwright Core installation and Chromium binary. Providing a screenshot directory enables capture.

```sh
STRATA_PLAYWRIGHT_MODULE=/path/to/playwright-core/index.mjs \
STRATA_CHROMIUM_EXECUTABLE=/path/to/chromium \
STRATA_SCREENSHOT_DIR=/tmp/strata-transect-screens \
node test/browser/transect.mjs
```

### Review screenshots

All nine observation states are captured at desktop width. The mobile and tablet captures cover each environment, including the local 111 Ma age bracket.

| Observation | 375 px | 768 px | 1440 px |
| --- | --- | --- | --- |
| Shell-rich limestone | [Mobile](review/strata-014-transect-subtidal-limestone-mobile.webp) | [Tablet](review/strata-014-transect-subtidal-limestone-tablet.webp) | [Desktop](review/strata-014-transect-subtidal-limestone-desktop.webp) |
| Microbial tidal laminae | | | [Desktop](review/strata-014-transect-tidal-microbial-laminae-desktop.webp) |
| Brecciated paleosols | | | [Desktop](review/strata-014-transect-exposure-breccia-desktop.webp) |
| Posta Manganaro megabreccia | [Mobile](review/strata-014-transect-posta-megabreccia-mobile.webp) | [Tablet](review/strata-014-transect-posta-megabreccia-tablet.webp) | [Desktop](review/strata-014-transect-posta-megabreccia-desktop.webp) |
| Mattinata slope deposits | | | [Desktop](review/strata-014-transect-mattinata-slope-desktop.webp) |
| Aptian drowning surface | | | [Desktop](review/strata-014-transect-aptian-drowning-desktop.webp) |
| Pelagic marl and limestone | | | [Desktop](review/strata-014-transect-pelagic-marl-desktop.webp) |
| Planktonic fossil zone | [Mobile](review/strata-014-transect-rischi-biozone-mobile.webp) | [Tablet](review/strata-014-transect-rischi-biozone-tablet.webp) | [Desktop](review/strata-014-transect-rischi-biozone-desktop.webp) |
| Leenhardt organic-rich shale | | | [Desktop](review/strata-014-transect-leenhardt-shale-desktop.webp) |
