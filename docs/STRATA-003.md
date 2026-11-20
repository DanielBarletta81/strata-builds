# STRATA-003 — Microsat Atlas integration

The Atlas route presents a geographic SVG, site composition, and an inspectable table for the same deterministic striped bass demonstration records. The prominent **SYNTHETIC DEMONSTRATION DATA** label applies to every sample. Coordinates, assignment labels, and demonstration site mixes are generated. They represent no measured genotypes or estimates of actual site composition.

## Source and attribution

- [Microsat Atlas at `591b3b8afd1650028a5fbc68c08576e9c2a92a96`](https://github.com/DanielBarletta81/microsat-atlas/tree/591b3b8afd1650028a5fbc68c08576e9c2a92a96) supplies the seed, site inputs, map projection, coast extract, and composition and neighborhood rules. This integration adapts the pinned project as requested. The source tree has no repository-level license file.
- The pinned coast extract is derived from [U.S. Census Bureau cartographic state boundaries](https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html) at 1:5,000,000. The upstream build script clipped the data to the coastal window, simplified it with a 0.012-degree tolerance, and rounded coordinates to four decimals. The Census file vintage was unrecorded upstream. The source is federal geographic data credited under [Census citation guidance](https://www.census.gov/about/policies/citation.html). This extract is schematic and can include state boundaries.
- The upstream tree bundles Space Grotesk and Spectral without the font license files. Atlas uses Strata’s existing system font stack. The integration includes no bundled fonts.

## Architecture and record contract

`src/app/atlas/page.tsx` prepares a static, validated view model at build time. The feature in `src/features/atlas/` owns the dataset, projection, neighborhood comparison, composition, and presentation. A single client controller synchronizes the map, sample picker, composition highlight, and records table. The plotted points and table rows come from the same ordered collection of accepted records. The route uses no external runtime requests or visualization dependencies.

| Field | Contract |
| --- | --- |
| `id` | Nonempty, trimmed, unique identifier. The generator preserves the upstream `MSX-001` through `MSX-108` sequence. |
| `lat`, `lon` | Finite numbers in decimal degrees. Latitude is within −90 to 90 and longitude within −180 to 180. |
| `assignment` | Hudson, Chesapeake, or Delaware, matching the pinned demonstration categories. |
| `site` | A trimmed site name or `null` for an unspecified site. |
| `classification`, `datasetId` | Each record is synthetic and refers to the same dataset provenance. The provenance includes the pinned revision, source URL, and seed `20261108`. |
| Validation | Rejections report the 1-based row, available ID, and first rejection reason. Rendering uses accepted records. The page reports rejected rows separately. |

The fixed-seed generator preserves the pinned RNG sequence, including the draws previously used for omitted illustrative fields. The pinned fixture checks the digest of all 108 normalized records. The demonstration has 13 sites, 21 neighborhood flags, and zero rejected records.

## Method and limitations

- **Map.** The adapted SVG uses the original local equirectangular projection with longitude scaled by the cosine of the map's mean latitude. The plot fits the demonstration extent and uses the upstream approximate 50 km scale. Locations are jittered around illustrative site centers. This plot is unsuitable for navigation.
- **Composition.** Count assignments within each site and sort sites from north to south by mean sample latitude. Bars show the counts proportionally, and text supplies the same counts. Each site contributes every accepted record with that site name.
- **Neighborhood flag.** Using the original latitude-adjusted local distance, find the five closest other records. Flag a sample when three or more neighbors share the same assignment different from the selected sample. A split of two Chesapeake, two Delaware, and one Hudson does not flag a Hudson sample. The original minimum of eight accepted records and original input order for distance ties are retained. These flags summarize local assignment differences in the generated data. Genotype-based inference, population boundaries, and migration require independent evidence. Pairwise comparison and per-sample sorting are bounded by the 108-record embedded demo.

The main map has one Tab stop. Arrow keys move the marker focus in record order, Home and End jump to its boundaries, and Enter or Space selects the focused marker. Touch and pointer users can select a marker or use the same native sample picker. Shapes and text supplement assignment colors. A separate dashed ring identifies flags. The labeled scrollable table provides all plotted records with row and column headings.

## Deferred work

CSV/TSV and pasted uploads, genotype or allele dataset ingestion, environmental integrations, authentication, persistence, and additional visualization engines are outside this slice. STRATA-003B requires separately approved published Chesapeake Bay genetic data, verified rights, methods, and uncertainty before presenting research findings.

## Verification

- **Local quality gate.** Node.js 24.22.3 and npm 11.19.1 passed `npm ci`, lint, typecheck, 9 unit tests, production build, and 6 route smoke tests. The Atlas smoke check compares every SVG marker ID with the table and checks the synthetic label, headings, accessible controls, and attribution.
- **Chromium production-build check.** At 375, 768, and 1440 px the page and records table fit horizontally, and each contained 108 matching records. Tab, Shift+Tab, arrow keys, End, Enter, Space, focus visibility, and keyboard table scrolling passed. Pointer selection and 375 px touch emulation synchronized the selected marker, picker, and table row. The map uses no motion transitions. Sampled text contrast was at least 6.25:1. These checks used Chromium 158 with an emulated touch viewport. Physical devices and screen readers remain unverified.
- **Payload.** The local build prerenders Atlas. Its HTML artifact is approximately 29 KiB after gzip and the separate route data artifact is approximately 12.5 KiB after gzip, excluding shared scripts and styles.
