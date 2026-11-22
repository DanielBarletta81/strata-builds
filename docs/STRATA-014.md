# STRATA-014 · Deep Time geological time engine

`/deep-time` provides a sourced, editable 18-entry chronology, a Primordial Ocean chapter, a qualitative oxygenation explorer and a Tethys model review. Phase 1 starts at the approved STRATA-013 merge, `7e4c0fa72cb74bfc2d5b07009f0bd052fd882dc0`, in the isolated `strata-014/deep-time-foundation` worktree. The homepage and sitemap link to the new route.

## Scientific contract

[Chronology](../src/features/deep-time/chronology.ts) keeps the event ID, theme, date representation, claim classification, supported conclusion, unresolved question, evidence to seek, and source IDs together. The [source register](../src/features/deep-time/sources.ts) resolves IDs to primary research, publication records and agency references, reviewed November 22, 2026. The application renders the register and claim-specific links from the same data. Sources remain with their publishers. No figures, published map geometry or complete third-party texts ship with the route.

| Date representation | Meaning |
| --- | --- |
| Approximate age | A point represents a dated source or an approximate chapter age. It supplies no numerical confidence interval. Formation, water, microbial reefs, Ediacaran fossils and the Tethys chapter use approximate ages. |
| Interval | Both endpoints are retained. Cryogenian and Ordovician values mark periods and do not imply continuous glaciation or diversification. The Last Glacial Maximum interval follows the cited synthesis. |
| Undated | Origin-of-life hypotheses and the emergence of oxygen-producing photosynthesis have no numeric age field and no marker. Selecting either keeps the last dated viewport. |
| Historical date | Calendar dates are preserved in the event record. The historical axis uses whole years relative to the 2026 CE reference year. |

The International Chronostratigraphic Chart version is **2026/06**. Formal period boundaries are distinguished from inferred events within a period. The Holocene label retains the ice-core boundary convention of 11,700 years before 2000 CE. The plotted location is rounded to 11.7 ka on the geological scale. Ancient plotted ages retain their published approximate values. [ICS chart](https://stratigraphy.org/ICSchart/ChronostratChart2026-06.pdf) · [Holocene boundary definition](https://stratigraphy.org/gssps/files/holocene.pdf)

| Classification | How the interface uses it |
| --- | --- |
| Observed or documented | A directly reported sample result or dated record, such as organics in returned Bennu material or the Voyager launch. A record may still depend on how a source defined its boundary or observation. |
| Geological interpretation | A claim inferred from measured minerals, fossils, sediment or isotope chemistry. The supporting observation and unresolved interpretation remain visible. |
| Modeled reconstruction | Published models are a basis for the future Tethys reconstruction. The current chapter shows a source review and validation status. |
| Hypothesis | Competing origin scenarios that are motivated by models and partial experimental results. Their historical sequence and setting remain unresolved. |
| Concept illustration | The early-ocean hero is AI-generated atmosphere. The rock forms, suspended material, water and lighting convey no reconstructed Hadean conditions. |

The figure is generated for this route and served as a local 1672 × 941 WebP. Its SHA-256 is `bbef2ed43aa7c853ad58ef933a6958fea9d9466f776e32730fdc228601b99f77`. The caption and image alternative identify it as illustration.

## Interaction and numerical semantics

The pure [time engine](../src/features/deep-time/time.ts) tracks the selected event, last dated anchor and zoom level. Nested windows span 4.6 Ga, 600 Ma, 30 Ma, 80 ka and 200 historical years. Each narrower window stays inside the parent. An interval uses its midpoint only to center the viewport and retains both ends on the ruler. Geological ages are selectable all the way back to formation. Thousands and historical levels are available around sufficiently recent dates. Switching from a recent event at a fine scale to a much older event opens the closest supported scale and keeps the newly selected event active.

The native selector, older/newer controls, chapter shortcuts and selectable chronology table all change the same event. The ruler, featured event, evidence inspector and selected chapter link follow it. The chronology table retains access to closely spaced, off-window and undated records. The ruler represents time only. Density of marks reflects curation and carries no scientific measure of activity.

## Primordial Ocean and oxygenation

Jack Hills zircons support an inference of early water–rock interaction around 4.4 Ga. This leaves local and global water extent and chemistry unresolved. The chapter identifies vents and hot springs as proposed environments, covers potential extraterrestrial organic contributions using Bennu samples, and distinguishes experimental support from the four origins hypotheses. It explains that candidate pathways can use energy sources other than free oxygen. No visualized organism or molecular pathway is inferred from the illustration. [Wilde et al.](https://pubmed.ncbi.nlm.nih.gov/11196637/) · [Lane and Martin](https://doi.org/10.1016/j.cell.2012.11.050) · [NASA Bennu analysis](https://www.nasa.gov/news-release/nasas-asteroid-bennu-sample-reveals-mix-of-lifes-ingredients/)

Four qualitative views cover low atmospheric oxygen, oxygen production versus sinks, the atmospheric transition, and uneven ocean oxygenation. Each view displays rock and sediment proxy evidence separately from its atmospheric and ocean interpretations. Sulfur isotope patterns constrain atmospheric conditions without measuring an oxygen concentration. Geographical variability, proxy calibration and the chronology of sustained oxygenation remain unresolved at this level. The phase selector illustrates overlapping processes and provides no continuous numerical oxygen history. [Farquhar et al.](https://pubmed.ncbi.nlm.nih.gov/10926533/) · [Lyons et al.](https://doi.org/10.1038/nature13068) · [Poulton et al.](https://doi.org/10.1038/s41586-021-03393-7)

## Tethys model selection

**Selected for future validation** is the GPlates 2.3 GeoData bundle with the `Muller2019-Young2019-Cao2020` rotation file and matching topologies and continental polygons. The underlying Müller et al. 2019 mantle-frame model spans 250 Ma and the documented GPlates package applies additional rotation revisions. Its temporal coverage includes the Albian chapter at approximately 111 Ma. [EarthByte GPlates 2.3 data and terms](https://www.earthbyte.org/gplates-2-3-software-and-data-sets/) · [Müller et al.](https://doi.org/10.1029/2018TC005462)

**Comparison** is the Matthews et al. 2016 rotation file and matching features in GPlates 2.0. EarthByte documents dynamic polygons covering 410 Ma. Use this combination to check sensitivity to the selected model. Some underlying evidence and source compilations are shared. EarthByte identifies its own data as CC BY 3.0 Unported and calls for the layer citations. Individual files and third-party layers still require redistribution review. [EarthByte GPlates 2.0 data and terms](https://www.earthbyte.org/gplates-2-0-software-and-data-sets/) · [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)

Package documentation, version, age coverage and published terms were reviewed. No archive bytes, exports or reconstruction checkpoints were ingested or validated in this phase. A subsequent export should pin archive hashes, plate IDs, layers, citation and license per file, software version, anchor plate, reference frame, geological age, export settings and a comparison model. Record independent checkpoints for coasts and plate positions and preserve unresolved differences, especially where old oceanic crust is missing. Plate geometry cannot supply paleobathymetry, atmospheric values or ecosystems on its own. The historical Tethys Ocean on Earth is separate from the fictional World of Tethys. [STRATA-013 Deep Time proposal](STRATA-013-DEEP-TIME-PROPOSAL.md)

## Contracts for future chapters

Extend the current claim and source IDs at the data boundary as evidence becomes available. Keep raw observations, transformations and interpretation traceable to one another.

| Future evidence | Minimum provenance and compatibility |
| --- | --- |
| Modern hydrothermal vents, methane seeps and tubeworm symbioses | Cruise, site and sample IDs, coordinates and frame, collection time and depth, measurement units and detection limits, organism or substrate identification, method, QA and source rights. Preserve observed associations and the evidence required to infer chemosynthetic symbiosis. |
| Origin analogs and early microbial fossils | Distinguish modern analog observations, experimental results and hypotheses. Retain specimen and layer IDs, calibrated age interval, stratigraphic method, instrumental checks, taphonomy and competing abiotic explanations. |
| Oxygenation and biogeochemical cycles | Store proxy measurement, calibrated age and uncertainty, basin and sediment context, analytical method and QA, then the interpretation and its domain. Keep local water chemistry separate from inferred atmosphere. |
| Marine larval dispersal and oyster connectivity | Require verified sources for genetic markers, sites, sampling times and units. Check coordinate and event compatibility for environmental observations and circulation estimates before linking them. Preserve the evidence needed to support dispersal or connectivity. |

The next geological milestone is a pinned and independently checked 111 Ma export. The next early-ocean milestone can compare dated rock and proxy records from multiple sites with their published uncertainties. Each milestone needs its own source review.

## Verification

Deterministic tests cover event order and date ranges, undated records, nested windows, supported scales, selection persistence and source references. Route smoke checks the start state, detailed chapter surfaces, source disclosure and sitemap.

Clean install, lint, typecheck, 75 unit tests, production build and 22 route smoke tests passed with Node 24.22.3 and npm 11.19.1. The route prerenders from the checked-in source register.

Chromium 158 verified 375, 768 and 1440 px on the local production build. Checks covered all five scales, event selection and focus, the 18-row chronology table, undated selection, evidence disclosures, four oxygenation views, source descriptions, sampled text contrast and reduced motion. Emulated touch passed at 375 px. All widths had zero horizontal page overflow, runtime errors or upstream data requests during the test. Physical devices and screen readers remain untested.

[Mobile full page](review/strata-014-mobile.png) · [Tablet full page](review/strata-014-tablet.png) · [Desktop full page](review/strata-014-desktop.png)

[Historical chronology on mobile](review/strata-014-chronology-mobile.png) · [Primordial Ocean with open hypotheses](review/strata-014-primordial-desktop.png) · [Atmospheric transition](review/strata-014-oxygenation-desktop.png) · [Tethys model gateway](review/strata-014-tethys-desktop.png)
