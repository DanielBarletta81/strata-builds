# Proposal · Deep Time Observatory

The planned `/deep-time` experience follows Earth's changing continents, oceans, atmosphere, and biosphere. A first chapter could examine the Tethys Ocean around **111 Ma**, or 111 million years ago. Place the reconstructed continents and modeled ocean basins in their geological context. Later environmental and biosphere layers would each require their own data, uncertainty and rights review.

## Plate-model candidates

| Candidate | Role at approximately 111 Ma | Rights and source |
| --- | --- | --- |
| GPlates 2.3 GeoData with the `Muller2019-Young2019-Cao2020` rotation model and matching topologies | First candidate. Use the packaged plate rotations, continental polygons and dynamic topologies together. The underlying Müller et al. (2019) model describes the last 250 Ma and uses a mantle reference frame. The GPlates bundle incorporates further regional revisions. | EarthByte identifies its data as CC BY 3.0 Unported and requests citations for the layers used. Confirm each bundled file’s attribution and any third-party exceptions before export. [GPlates 2.3 data and terms](https://www.earthbyte.org/gplates-2-3-software-and-data-sets/) · [Müller et al. (2019)](https://doi.org/10.1029/2018TC005462) |
| GPlates 2.0 sample data with Matthews et al. (2016) rotations and matching polygons | Independent model comparison for this chapter. The documented 410 Ma compilation covers the interval. Reconstruct with its own rotation circuit and layer set. Differences between bundles can flag unresolved geometry and reference-frame assumptions. | EarthByte identifies its data as CC BY 3.0 Unported. Attribute the supplied rotation and polygon sources and check the origin of any third-party data. [GPlates 2.0 package and terms](https://www.earthbyte.org/gplates-2-0-software-and-data-sets/) · [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) |

## Smallest verifiable slice

1. Pin exact archives, model version, cited files, published geological timescale, licensing and hashes. Record GPlates version, plate IDs, rotation anchors and export settings with the derived asset.
2. Export a static approximately 111 Ma reconstruction with a legible 2D alternative. Verify a set of reconstructed checkpoints against an independent GPlates export. Document each plate's coverage, projection choices and model discrepancies before deciding whether a globe adds value.
3. Label tectonic features and ocean boundaries as reconstructed. State which parts depend on a selected model or on fragmentary remnants of oceanic crust. Separate plate geometry from proposed coastlines, bathymetry, paleo-atmosphere and biosphere proxies. These layers have distinct data requirements.
4. Use temporal inspection only after matching checkpoints and nearby epochs have been validated. The published dating precision and reconstruction uncertainty govern what the time controls communicate.

This proposed chapter concerns modeled paleogeography on real Earth. The fictional **World of Tethys** is a separate creative setting. STRATA-013 includes a gateway and this source proposal only.
