# STRATA-014 Phase 2 · The Tethys reconstruction

The regional map on `/deep-time` uses continental-lithosphere polygons and resolved plate-boundary segments at **111 Ma**, an Albian time slice. Strata depicts the model’s tectonic geometry. Shorelines, dry land, ocean depth, and the locations of ancient habitats need independent evidence. This study concerns ancient Earth. The fictional World of Tethys belongs to a separate creative project. [ICS 2026/06 Geological Time Chart](https://stratigraphy.org/ICSchart/ChronostratChart2026-06.pdf)

The isolated branch `strata-014/phase-2-tethys-reconstruction` started at the Phase 1 squash merge, `93a13f9fb099174916d30520dceef2dffc1cd505`. The existing event IDs, age representations, classifications, five scales, and controls remain in use. The 111 Ma event opens the map and displays a chapter link to it. The chapter can also select 111 Ma through the same time engine. Other dated and undated selections show the unavailable state. No other epoch or animation is supported.

## Source, version, and rights manifest

The [pinned source manifest](../src/features/deep-time/tethys/data/sources.json) records six official EarthByte archive URLs, retrieval timestamps, archive SHA-256, exact required file paths and SHA-256, file revision dates, cited authors, rights notices, model identity, compatible layers, reference frames, anchor plates, and supported age ranges. Each archive’s README was opened to identify the specific files and authors. Archive filenames repeat between packages. Use their distinct directory keys and pinned hashes.

| Model | Required material | Rights and display use |
| --- | --- | --- |
| GPlates 2.3 GeoData, `Muller2019-Young2019-Cao2020` | Combined rotations dated August 3, 2021, continental lithosphere and dynamic plate-boundary inputs dated June 25, 2021. The individual rotations and dynamic topology READMEs identify the Müller, Young, Cao and Torsvik inputs. The continental layer credits Müller et al. | EarthByte’s grant covers its own data, and the three individually published EarthByte layers were identified from their archive READMEs. The adapted geometry credits the publisher and cited authors and links to **CC BY 3.0 Unported**. The separate island-arc features, present-day coastlines, unrelated third-party layers and original archives are excluded. [GPlates 2.3 package](https://www.earthbyte.org/gplates-2-3-software-and-data-sets/) · [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) |
| GPlates 2.0 Sample Data, `Matthews2016-GK07` | September 5, 2016 rotations and their matching continental polygons, Mesozoic–Cenozoic and Paleozoic topologies, and topology building blocks. The package uses the Gee and Kent 2007 timescale. | All three used archives contain a **CC BY 4.0 International** `License.txt`. We apply the archive-specific terms while recording the landing page’s general CC BY 3.0 notice. Only attributed comparison outputs are included in the repository. [GPlates 2.0 package](https://www.earthbyte.org/gplates-2-0-software-and-data-sets/) · [Matthews et al.](https://doi.org/10.1016/j.gloplacha.2016.10.002) · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |

Each model is solved with its own rotation and topology files. Primary model coordinates use plate **0**, with the Müller 2019 mantle-frame basis at 111 Ma. The primary analysis age is within the 0–250 Ma range of that basis. The composite distribution documents some older rotations and topology coverage out to 410 Ma. Matthews’ distribution spans 0–410 Ma. Its published plate-0 solution uses its own reconstruction circuit and absolute frame. A secondary calculation for both packages fixes plate **701**, southern Africa. This isolates relative position changes from the choice of absolute frame. License notices and source citations remain available in the instrument’s methods inspector. [Müller et al.](https://doi.org/10.1029/2018TC005462)

## Reproduce the export

Use a private input directory containing the six archives in the manifest’s `23/` and `20/` subdirectories. Download the exact URLs listed there. The exporter verifies the original ZIPs, the required geometry and rotation files, and the README and license bytes before extracting any geometry it will use.

```sh
python3.11 -m venv /tmp/strata-tethys-export
/tmp/strata-tethys-export/bin/pip install pygplates==1.0.0 shapely==2.1.2 numpy==2.2.6
/tmp/strata-tethys-export/bin/python scripts/reconstruct-tethys.py /path/to/earthbyte-archives /tmp/tethys-export
cmp /tmp/tethys-export/reconstruction-111.json src/features/deep-time/tethys/data/reconstruction-111.json
cmp /tmp/tethys-export/validation-111.json src/features/deep-time/tethys/data/validation-111.json
cmp /tmp/tethys-export/receipt-111.json src/features/deep-time/tethys/data/receipt-111.json
```

The recorded export used arm64 Python 3.11.11 and GEOS 3.13.1. It applies pyGPlates finite rotations to lithosphere polygons and resolves rigid plate topologies at exactly 111 Ma. Only shared subsegments of resolved rigid plate boundaries are considered. The map includes those classified as spreading ridge, subduction, transform or continental rift. It excludes other section types, stand-alone island arcs and deforming networks. An unmarked or unfilled area can reflect selection, coverage, or the limits of the reconstructed source layer.

Geographic output retains model longitude, latitude, original feature IDs, reconstruction plate IDs and relevant neighboring plate IDs. Great-circle arcs are tessellated at 0.35°, split at the antimeridian, then generalized with a 0.12° topology-preserving tolerance in longitude/latitude. Geometry is rounded to five decimal places for storage. These figures describe export settings rather than model precision. The SVG crops the regional plate-carrée projection to 65° W–110° E and 72° S–42° N. The blue background is illustrative. No paleoshoreline, elevation, or land-versus-ocean mask is implied.

The [export receipt](../src/features/deep-time/tethys/data/receipt-111.json) binds the manifest to the output bytes. The [frozen geometry](../src/features/deep-time/tethys/data/reconstruction-111.json) contains **193 lithosphere parts and 85 boundary parts**. All retained rings passed GEOS validity checks after generalization and rounding. No regional polygon parts were rejected, and every displayed plate ID has an explicit rotation at 111 Ma. The script validates that each primary checkpoint matches the corresponding exported geometry within the stated generalization tolerance. The topology API can vary subsegment order. Display lines receive IDs from the source feature ID, neighboring plates, and canonical coordinates. The line styles carry no directional or polarity information. Four native executions reproduced every frozen file byte for byte. [pyGPlates reconstruction API](https://www.gplates.org/docs/pygplates/generated/pygplates.reconstruct.html) · [Topology resolution](https://www.gplates.org/docs/pygplates/generated/pygplates.resolve_topologies.html)

## Geographic validation and comparison

The [validation record](../src/features/deep-time/tethys/data/validation-111.json) provides eleven reproducible checkpoints. Eight lithosphere checkpoints begin with representative present-day points whose source polygons, IDs, and 111 Ma validity were checked in both models. Rotating each point directly agreed with the pyGPlates feature reconstruction API within 0.000001° on this fixture. The three boundary checkpoints use a representative vertex from the longest shared subsegment with the named source feature ID and neighboring plate pair. The vertices need not be homologous between models. A separate x86-64 Python 3.9 execution with pyGPlates 1.0.0 reproduced the entire validation record byte for byte using `--verify-only`. It used the same numerical library, so this is a reproducibility check rather than an independent solver.

| Geographic check | Primary model plate IDs | Comparison at 111 Ma |
| --- | --- | --- |
| Adria and Apulia | 307 and 3307, respectively | Published-frame differences are 13.35° and 13.34°. In the common Africa-fixed frame they are 0.52° and 0.57°. The blocks remain distinct source features. |
| Northern Tethyan margins | Iberia 304 and AlCaPa 334 | Iberia’s point agrees to reporting precision in the Africa-fixed comparison. Plate 334 is named Pelso in Matthews and differs by 4.17° in that frame. These statements concern the selected points rather than the entire margins. |
| Gondwanan fragments and India | Madagascar 702, India 501 | Africa-fixed offsets are 0.62° for Madagascar and 0.12° for India. Their position constrains where to investigate Early Cretaceous basins around India. It supplies no seaway depths, widths or timings of connection. |
| Africa–South America | Southern Africa 701, South American craton 201 | The representative craton point agrees to reporting precision in the Africa-fixed frame. Both packages resolve a matching southern ridge segment shared by 201 and 701. They have different regional boundary segmentation. The independent regional synthesis dates breakup at roughly 113 Ma around Santos–Benguela and around 103 Ma in the equatorial domain. A single export cannot establish simultaneous separation along the entire margin. |
| Selected Tethyan boundaries | Lhasa back-arc 301/528 and Central NeoTethys 501/53401 | Both resolve the matching Lhasa back-arc feature, with subsegment arc lengths about 21.75° and 26.49°. Matthews resolves no matching Central NeoTethys feature ID with that plate pair at 111 Ma. This reflects the comparison criteria and model representation. |

The primary resolves 30 global rigid plate topologies and Matthews resolves 23 under the same numerical procedure. These are model outputs. The packages share some source evidence. First-order comparisons with regional reconstructions motivate the checkpoints and reveal where to seek stronger constraints. Residual differences can reflect frame, rotation history, block definitions and how boundaries were modeled where old oceanic crust survives poorly. The comparison does not quantify model uncertainty or establish the true position of a vanished margin. [Van Hinsbergen et al., Mediterranean reconstruction](https://research-portal.uu.nl/en/publications/orogenic-architecture-of-the-mediterranean-region-and-kinematic-r/) · [Heine et al., South Atlantic breakup](https://se.copernicus.org/articles/4/215/2013/) · [Gibbons et al., East Gondwana breakup](https://doi.org/10.1002/jgrb.50079)

## Evidence needed for future phases

| Question | Evidence required |
| --- | --- |
| Aptian–Albian anoxic events | Dated sediment sections spanning targeted events, carbon-isotope stratigraphy, organic carbon, facies, independent redox proxies and regional correlation. |
| Restricted Tethyan seaways | Independently dated paleoshorelines, basin geometry, sill-depth constraints and records of water exchange or connectivity. |
| Carbonate platforms and rudists | Georeferenced sections, depositional facies, independently checked fossil identifications, preservation context and calibrated ages. |
| Volcanic arcs and regional tectonics | Dated volcanic rocks, geochemistry, paleomagnetism, restored structural sections and compatible plate circuits. |
| Ocean circulation | Separately sourced paleobathymetry, boundary and forcing assumptions, reproducible ocean-model runs and independent proxy comparisons. |
| Ancient marine food webs | Fossil assemblages and preserved trophic evidence with habitat, taphonomic and stratigraphic context. |
| Climate and sea-level variability | Independently dated regional temperature and sea-level proxies, subsidence corrections, model forcing, and uncertainty across records. |

Fictional World of Tethys material can contribute questions to a separate research queue. Every geological claim needs an independently verified source.

Phase 3 should pin one independent regional reconstruction and add defensible paleoshoreline or bathymetry constraints for one Tethyan seaway. A globe can reuse the frozen coordinate format after projection, coastal uncertainty and adjacent-age validation are addressed.

## Verification

The repository tests cover product hashes, model and reference identity, attribution, geometric ranges and ring closure, plate IDs, checkpoint correspondence and unsupported-age behavior. Browser checks exercise the same timeline selection, focal checkpoint, accessible table, methods inspector and unavailable state.

Clean install, lint, typecheck, 79 unit tests, production build and 22 route smoke tests passed with Node 24.22.3 and npm 11.19.1. The prerendered route loads the frozen map geometry when the 111 Ma event is selected. The browser made no upstream model requests.

Chromium 158 at 375, 768 and 1440 px verified all five scales, the undated and Holocene unsupported states, chart labels, eleven checkpoint records, source disclosures, visible keyboard focus, reduced motion and text contrast spot checks. Emulated touch passed at 375 px. The tested states had no horizontal page overflow or runtime errors. Screen readers and physical devices remain untested.

[Desktop map](review/strata-014-tethys-map-desktop.png) · [Tablet map](review/strata-014-tethys-map-tablet.png) · [Mobile map](review/strata-014-tethys-map-mobile.png) · [Source inspector](review/strata-014-tethys-source-inspector.png) · [Unsupported age](review/strata-014-tethys-unsupported-age.png)
