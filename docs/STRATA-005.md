# STRATA-005 Orbital Observatory

The first instrument lets visitors inspect 1 Ceres at 262 tabulated epochs. It uses a saved NASA/JPL Horizons ephemeris, with solution metadata corroborated by the JPL Small-Body Database. It runs from a fixed capture and does not call JPL when visitors load the page or inspect a time.

## Baseline and source discovery

STRATA-004 merged in PR #3 at `737b31c48e0e85e6dda61280509b22aaad9fa9c5`. Vercel production reported Ready at that commit, and the public /signals route returned the NOAA Signals Lab page. STRATA-005 began in an isolated worktree from that exact commit. [STRATA-004 merge](https://github.com/DanielBarletta81/strata-builds/pull/3) · [Production deployment](https://vercel.com/daniel-barlettas-projects/strata-builds_v1.0/65QSmoUwguNbMMU7GmVNiPBPw739)

The audit searched the accessible portfolio workspace, the GitHub owner’s visible repository list, and candidate repository trees and manifests for ephemeris data, asteroid or satellite propagators, TLEs, SPICE products, and Kepler or SGP4 code. The strongest candidates were existing scientific interfaces, with no reusable orbital data or validated orbital model found in the inspected sources.

| Source checked | Assets, provenance, and limits | Reuse decision |
| --- | --- | --- |
| [Strata Builds baseline](https://github.com/DanielBarletta81/strata-builds/tree/737b31c48e0e85e6dda61280509b22aaad9fa9c5) | Next.js/React layout, Atlas SVG idioms, NOAA evidence contracts, and fixture-driven tests. The orbital instrument was planned. | Reuse shared layout and source-scoped evidence conventions. |
| [Strata Works](https://github.com/DanielBarletta81/strata-works/tree/8bb29e6f518db948eb86d59c22283a828e5ed488) | Next.js/React portfolio, SVG brand system, and repository catalog. No orbital fixture, propagator, or numerical tests found. | Portfolio listing only. |
| [Microsat Atlas](https://github.com/DanielBarletta81/microsat-atlas/tree/591b3b8afd1650028a5fbc68c08576e9c2a92a96) | Next.js/React SVG plots geodetic sample locations with a Census-derived coastline, synthetic demo, local distance calculations, and nearest-neighbor flags. Microsatellite markers are genetic records. The pinned standalone tree had no orbital tests. | The interaction pattern is already in Strata. Its geographic coordinates and methods do not describe orbital states. |
| [NOAA Signals Lab](https://github.com/DanielBarletta81/noaa-signals-lab/tree/9314e286f3ac13500b9f30e1ff1c866709ea6e41) | Vite/React, Express and Recharts, with NOAA CO-OPS station data. The verified STRATA-004 upstream pin is `037ad9ac03a8e7d1366e42c81b57eea7aa75fbe4`, which has NOAA GMT/UTC, ingestion and quality fixtures. The local `noaa-signal-explorer` checkout at `f4969ed7fcf4e309e8a78391b3b733873aba5dc7` has later snapshot work. | Reuse Strata’s evidence principles. NOAA timestamps and classifications are specific to station observations. |
| [Estuary Signal Lab](https://github.com/DanielBarletta81/estuary-signal-lab/tree/3d958ad1763d8bb7e909befcf7f3ebde32405a27) | Simulated estuary monitoring and event-driven presentation. Local revision `bb39aa0599421a000d4c779b726af889676fbdf6` includes time playback. It does not establish orbital coordinates, time standards, or numerical validation. | Defer playback. A synthetic environmental simulation provides no basis for orbital data. |

No standalone orbital source or registration was found in the audited scope. The inspected standalone repository trees provided no repository-root license grants for copying code or assets. This slice imports no code or artwork from them. It uses attributed public JPL numeric data, retains the response signatures, and keeps the API outside the website runtime in accordance with JPL’s fair-use policy. [JPL SSD API fair use](https://ssd-api.jpl.nasa.gov/doc/)

## Scientific contract

| Field | Contract |
| --- | --- |
| Object | Dwarf planet **1 Ceres**, designation A801 AA, numbered object 1. The Small-Body Database response identifies SPK ID 20000001. [NASA Ceres facts](https://science.nasa.gov/dwarf-planets/ceres/facts/) |
| Orbit fit | Both sources identify JPL solution **#48** and osculating element reference epoch **JD 2458849.5 TDB**, 2020-01-01 00:00 TDB. The SBDB orbit determination is 2021-04-13 11:04:44 Pacific local time. It reports 1,075 observations used, spanning 1995-01-05 through 2021-01-28. These are source-reported fit metadata. |
| Capture | Horizons was retrieved 2026-11-20 23:53:46.724 UTC and SBDB 2026-11-20 23:53:47.086 UTC. The capture receipt lists complete request URLs, signatures, and SHA-256 hashes of the original response bytes. [Capture receipt](../src/features/orbital/data/ceres-receipt.json) |
| Position and velocity | Native Horizons geometric Cartesian vectors **km and km/s**, Sun body center `500@10`, fixed ecliptic of J2000.0 derived from ICRF, and no light-time or aberration correction. The output identifies DE441 as the center ephemeris. SBDB supplies metadata for inspection. |
| Time | Horizons supplies calendar and Julian dates in TDB, checked for agreement using Gregorian calendar arithmetic. The UI displays TDB at each selection and UTC only for retrieval. The J2000 reference plane and the 2020 solution epoch identify different properties. |
| Supported interval | 262 midnight TDB samples spaced seven days apart from 2024-01-01 through 2029-01-01 inclusive. This is the complete inspection window for the frozen capture. Accuracy beyond or within that window is governed by the upstream model and available uncertainty evidence. |
| Calculated values | Distance and speed are the Euclidean position and velocity norms. Radial speed is the dot product of position and velocity divided by distance. Convert km to au using the exact 149,597,870.7 km per au. Display rounding leaves capture precision intact. |
| 2D depiction | Plot X and Y in equal units with positive Y up. Lines connect consecutive points as visual guides. The plot drops the Z component, marks the selected epoch, and uses readable symbols without physical size scaling. The controls select exact stored states. |
| Evidence class | JPL’s published vectors are **modeled** values. Fit history and source parameters are published metadata. Distance and speed are Strata calculations. Line segments between samples and marker sizes are illustrative display choices. |

[Horizons API request and vector output](https://ssd-api.jpl.nasa.gov/doc/horizons.html) · [Horizons reference frames and times](https://ssd.jpl.nasa.gov/horizons/manual.html) · [SBDB orbit metadata](https://ssd-api.jpl.nasa.gov/doc/sbdb.html) · [JPL astronomical unit](https://ssd.jpl.nasa.gov/faq.html)

## Evidence Frontier

The inspector puts the direct evidence, unresolved question, and next evidence-gathering action together for each finding.

- **Epoch and tracking.** The capture establishes the element epoch and the reported fit observation span. Comparing a newer solution and its observation arc could establish whether additional observations changed the fit. Epoch age alone does not establish an orbital anomaly or quantify model degradation.
- **Coverage.** A complete grid establishes coverage of the requested sample epochs. A new matched Horizons query is needed for denser sampling or times outside the capture. No interpolation or extrapolation runs in the application.
- **Differing source metadata.** Horizons reports small perturbers `SB441-N16` and residual RMS `.24563`. SBDB reports small-body ephemeris `SB441-N373` and RMS `.43153`. Their field roles and fit conventions may differ. Verify them with JPL before comparing RMS or combining outputs. The trajectory reads only the Horizons vectors.
- **Uncertainty.** The requested output includes no per-state covariance, prediction uncertainty envelope, or individual astrometric records. Obtain matching covariance and observation records before quantifying uncertainty or drawing conclusions about coverage between observations.

Required identity, epoch, source frame, time scale, units, columns, and sample cadence are checked when loading the fixture. Missing or incompatible inputs fail validation. The actual Horizons signature was 1.2 although its current reference page describes 1.3. The parser accepts the verified capture signature and checks its returned headers and row schema. Refreshes require a deliberate capture and compatibility review.

## Architecture and verification

`/orbital` is prerendered. The server component parses the frozen JSON responses in `src/features/orbital/data/` and sends validated states and provenance to a client component. The SVG marker, native time slider and step buttons, and numerical table share one sample index. The data hashes and geometry are checked without network access. Navigation, home, and sitemap expose the route. Atlas and NOAA Signals retain their existing pipelines.

Node tests cover data hashes, exact request metadata, both source identities, all calendar/JD pairs, leap-aware calendar rejection, 7-day cadence, invalid frame and time scale rejection, and evidence classifications. Distance and radial speed agree with the returned Horizons range and range rate for all 262 records. Their comparison tolerances of 0.000002 km and 0.00000000001 km/s check numerical consistency with the saved records. They do not describe physical accuracy. Route tests check provenance, selected marker/table agreement, and semantic controls in production HTML.

Local verification passed clean install, lint, typecheck, 27 unit tests, production build, and 14 route smoke tests on Node.js 24.22.3 and npm 11.19.1. The Orbital route made no JPL requests during browser inspection.

Chromium 158 verified the slider and step buttons at 375, 768, and 1440 px. Home and End selected the exact first and last states, and arrow keys stopped at the boundaries. The table and marker stayed synchronized. TDB selections agreed in Honolulu, Tokyo, and UTC browser contexts. The page and table fit without horizontal overflow, the slider and buttons were 44 CSS px high, and evidence disclosures worked by keyboard and mobile touch emulation. Physical-device and screen-reader checks remain unverified.

Full-page captures show the saved source metadata and one open evidence finding. [Desktop 1440 px](review/strata-005-desktop.png) · [Tablet 768 px](review/strata-005-tablet.png) · [Mobile 375 px](review/strata-005-mobile.png)

## Deferred work

Finer temporal sampling, a repeatable operator refresh process, additional objects, other frames, state covariance propagation, and comparisons with independent astrometric observations require separate source validation. Mission navigation, sky-position predictions, between-sample interpolation, and 3D rendering are outside the initial instrument. The next scientific slice should validate an in-window set of finer Horizons samples and associated uncertainty before introducing a continuous time control.
