# STRATA-013 · One Light-Day / One Changing Earth

`/orbital/voyager` compares Voyager 1 milestones with documented Earth events on one calendar. The experiment visualizes an idealized signal at the one-light-day separation. Both experiences depend on frozen evidence and run without live spacecraft or JPL requests.

## Baseline

The worktree starts from `origin/main` at `886de0d4de17df3ebe06812f2a3f5050d95e9783`. No STRATA-012 branch, pull request or matching commit was visible in the checked local and remote Strata history. The Voyager route adds an Orbital Observatory entry point and sitemap entry. The Ceres source and ephemeris, Pawtuxet datasets, and other feature trees are outside the change.

## Mission chronology

| Date | Event | Evidence |
| --- | --- | --- |
| September 5, 1977 | Launch at 12:56:01 UT | [NASA Voyager 1 mission history](https://science.nasa.gov/mission/voyager/voyager-1/) |
| March 5, 1979 | Jupiter closest approach | [NASA Voyager fact sheet](https://science.nasa.gov/mission/voyager/fact-sheet/) |
| November 12, 1980 | Saturn encounter | [NASA Voyager fact sheet](https://science.nasa.gov/mission/voyager/fact-sheet/) |
| February 14, 1990 | Voyager photographs Earth at 04:48 GMT for the Family Portrait | [NASA Pale Blue Dot history](https://science.nasa.gov/mission/voyager/voyager-1s-pale-blue-dot/) |
| February 17, 1998 | Voyager 1 overtakes Pioneer 10 | [NASA Voyager 1 mission history](https://science.nasa.gov/mission/voyager/voyager-1/) |
| August 16, 2006 | 100 AU from the Sun | [NASA Voyager 1 mission history](https://science.nasa.gov/mission/voyager/voyager-1/) |
| August 25, 2012 | Heliopause crossing | [NASA Voyager 1 mission history](https://science.nasa.gov/mission/voyager/voyager-1/) |
| November 18, 2026 | One light-day from Earth around 10:16 UTC, confirmed November 19 | [NASA confirmation, release 26-098](https://www.nasa.gov/news-release/nasas-voyager-1-makes-history-reaching-one-light-day-from-earth/) |

NASA reported that on November 14 the team had received a carrier without usable science or engineering data. The team confirmed the milestone on November 19 using the carrier signal and trajectory calculations. This is a historical status at the documented milestone. The application makes no assertion about a subsequent recovery or contemporary mission health. [NASA engineering update](https://science.nasa.gov/blogs/voyager/2026/11/18/voyager-1-engineers-analyze-data-issue-ready-to-confirm-light-day/) · [NASA confirmation](https://www.nasa.gov/news-release/nasas-voyager-1-makes-history-reaching-one-light-day-from-earth/)

## Scientific data contract

| Field | Meaning |
| --- | --- |
| Identity | NASA/JPL Horizons target `-31`, Voyager 1. Source identifier `Voyager_1_ST+refit2022_m`. |
| Geometry | Geometric ICRF Cartesian states in km and km/s, with Earth body center `500@399` and Sun body center `500@10` in separate requests. Light-time and aberration corrections are disabled for the vectors. |
| Epoch | Eight paired rows at explicit calendar and Julian TDB epochs. The launch-date sample is 18:00 TDB because the returned fit starts after launch; the other seven are 12:00 TDB. These are sample instants on the same calendar dates, distinct from historical event times. TDB is Barycentric Dynamical Time. No UTC conversion is applied to the vectors. |
| Model | Horizons' header describes a patched-conic mission-design reconstruction through 1980 and a 2022 refit and prediction using tracking from 1981–1992. The capture has no per-state range uncertainty or covariance. A fit date, sample epoch, and receipt timestamp carry different meanings. |
| Receipt | Original API JSON bytes, full request URLs, signature version 1.2 and SHA-256 hashes are stored in [the capture folder](../src/features/orbital/voyager/data). Earth retrieval was 2026-11-22T15:27:40.374Z and Sun retrieval was 2026-11-22T15:27:40.734Z. |
| Validation | Check target, exact source model identifier, center, body center, frame, units, calendar/JD agreement, numeric finiteness and all epochs. Match the two captures by epoch and check that the implied Earth–Sun separation is within 0.98–1.02 AU. Check vector norm versus returned range and range ÷ c versus returned light time. These are data consistency checks. |
| Range and conversion | The readout reports Horizons geometric range, rounded in km and AU. One AU is 149,597,870.7 km. The one-way time uses Earth-centered geometric range divided by 299,792.458 km/s. The exact one-light-day distance in vacuum is 25,902,068,371.2 km. |
| Distance evidence | At 12:00:00 TDB on November 18, the saved model returns about 173.146 AU from Earth and 172.390 AU from the Sun. Its Earth-centered light time is about 86,400.522 s. This is the stored model sample, distinct from the crossing NASA confirmed. |
| Display | Equal-scale X and Y display the Sun-centered model samples in ICRF and omit Z. The scale bar represents 50 AU. The numerical table gives all three coordinates. Marker sizes support readability and convey no physical size. Earth-only dates show unavailable ranges with no selected plot marker. |
| Signal experiment | An idealized fixed Earth–Voyager separation in vacuum gives 24 h one-way and 48 h for an immediate reply. A flight calculation for a real round trip would require the transmitter and receiver positions at separate transmission and reception times. |

The Horizons text includes a narrative chronology. Its old launch line says September 6, and its Pale Blue Dot line describes image return. The historical labels use NASA’s primary mission and image histories. The capture parser reads the vector headers and table only. No interpolation, extrapolation or continuous path is computed in Strata. [Horizons API](https://ssd-api.jpl.nasa.gov/doc/horizons.html) · [Horizons manual](https://ssd.jpl.nasa.gov/horizons/manual.html) · [JPL constants](https://ssd.jpl.nasa.gov/astro_par.html) · [NIST speed of light](https://physics.nist.gov/cgi-bin/cuu/Value?c)

## Parallel Earth timeline

The [source register](../src/features/orbital/voyager/events.ts) carries original summaries and a primary source for each of 12 Earth events in science, computing, environment and human history. Sources were reviewed November 22, 2026. Each selected date shows a matching recorded event or the nearest event within the chosen Earth lens, with the offset shown in calendar days. COP31 uses its documented November 9–20 interval, which contains November 18. The overlap compares dates and supplies historical context. The set is curated and makes no claim of complete coverage. Earth-system quantitative trends and causal comparisons require separate data and analysis. [UNFCCC COP31](https://unfccc.int/cop31)

## Attribution and rights

- The photo is NASA/JPL-Caltech’s PIA23645 2020 reprocessing of the 1990 Pale Blue Dot. It was retrieved November 22, 2026 at about 15:28 UTC. The 5230 × 5175 JPEG has SHA-256 `b783a29a134377ba41ffe8f644fd1f066b591b77b316daac3d32b315cc265c34`. The local WebP is resized to 1500 × 1484 and visually cropped by the hero depending on viewport. Credit appears next to the photo. No agency mark or endorsement is used. [NASA image page](https://science.nasa.gov/resource/voyager-pale-blue-dot-download/) · [Original JPEG](https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia23/pia23645/PIA23645.jpg) · [JPL image policy](https://www.jpl.nasa.gov/jpl-image-use-policy/)
- The JPL API fair-use policy is addressed by frozen snapshots, with sequential requests during the manual capture and no remote query on render or interaction. Data and original source metadata retain attribution. The Earth timelines summarize historical facts and link to publishers. The underlying third-party texts and images remain with their publishers. [JPL SSD API fair use](https://ssd-api.jpl.nasa.gov/doc/)

## Verification

Five fixture-backed tests cover calendar selection, comparison offsets and lens persistence, missing samples, position and signal units, source URLs and original-byte hashes, and invalid frame, origin and records. Route smoke covers the default selected date, corresponding plot marker, Earth event, Earth/Sun readouts, interruption notice, source receipts and planned gateway.

Node 24.22.3 and npm 11.19.1 passed clean install, lint, typecheck, 70 unit tests, production build, and 21 route smoke tests. The new route prerenders from its frozen capture.

Chromium 158 verified synchronized selection, event and model tables, all four Earth categories, the missing-position state, source receipts, the 0/24/36/48-hour signal states, keyboard focus and operation, sampled text contrast, reduced-motion behavior and zero horizontal overflow at 375, 768 and 1440 px. The 375 px run used touch emulation. Browser interactions made no upstream data requests and surfaced no runtime errors. Screen readers and physical devices remain untested.

[375 px](review/strata-013-mobile.png) · [768 px](review/strata-013-tablet.png) · [1440 px](review/strata-013-desktop.png) · [Mobile missing ephemeris and Computing lens](review/strata-013-mobile-missing.png) · [Desktop signal at hour 36](review/strata-013-desktop-signal.png)

See the separate [Deep Time globe proposal](STRATA-013-DEEP-TIME-PROPOSAL.md).
