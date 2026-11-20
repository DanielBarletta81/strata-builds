# STRATA-004 NOAA Signals Lab

The first Signals instrument exposes NOAA CO-OPS hourly water temperature at station `8454000`, Providence, Rhode Island. The review window is 1–72 completed UTC hours and defaults to 24. NOAA supplies the observations. Strata performs structural validation, computes descriptive statistics over accepted values, and reports source coverage and uncertainty.

## Source and baseline

- **Strata base** `70815b7a02857b450012d913074db80af867569f`.
- **NOAA Signals Lab pin** `037ad9ac03a8e7d1366e42c81b57eea7aa75fbe4` from `feature/noaa-data-integrity`. Strata adapts its strict GMT parser, missing-value and first-valid duplicate policies, flag handling, arithmetic summary, and no-data interpretation. The Vite/Express app and its assets stay in the standalone project. [Pinned sources and original fixture provenance](https://github.com/DanielBarletta81/noaa-signals-lab/tree/037ad9ac03a8e7d1366e42c81b57eea7aa75fbe4)
- **Product verification** NOAA lists water temperature at Providence. CO-OPS documents `water_temperature`, hourly `interval=h`, metric units, and GMT. The temperature response documents `t` (time), `v` (value), and `f` (X/N/R maximum, minimum, and rate-of-change checks). Strata also preserves `q` if present and applies no flag-based adjudication. [Providence station products](https://tidesandcurrents.noaa.gov/met.html?id=8454000) · [Data API request options](https://api.tidesandcurrents.noaa.gov/api/dev/) · [Water temperature response fields](https://api.tidesandcurrents.noaa.gov/api/prod/responseHelp.html)
- **Live smoke test** A single direct adapter call on 2026-11-20 at 21:54:42 UTC accepted 24 of 24 expected hours, with zero exclusions. Window start was 2026-11-19 21:00 UTC and the exclusive end was 2026-11-20 21:00 UTC. The latest accepted reading was 12.7 °C at 20:00 UTC, with original `f=0,0,0`. [Exact NOAA request](https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?station=8454000&product=water_temperature&begin_date=20261119+21%3A00&end_date=20261120+20%3A59&interval=h&units=metric&time_zone=gmt&format=json&application=strata_builds)

## Request and data contract

| Boundary | Contract |
| --- | --- |
| Route | `GET /api/signals?range=24` accepts optional `station=8454000` and `product=water_temperature`. Unknown fields, duplicate parameters, and invalid ranges return HTTP 400 before contacting NOAA. |
| Transport | One request to the fixed official HTTPS endpoint, with redirects disabled, an 8-second fetch and response-body deadline, a 256 KiB body limit, and a 150-row guard. Unusable or non-OK upstream responses return a sanitized HTTP 502. Deadline expiry returns HTTP 504. |
| Time and provenance | The window ends at the current UTC hour’s start, exclusive. The NOAA request covers the first expected hour through minute 59 of the last completed hour. The response carries the exact source URL, station, product, units, source row indexes, UTC observation times, raw GMT timestamps, and a separate UTC retrieval instant. |
| Row validation | The validator round-trips calendar timestamps, rejects off-hour/out-of-window timestamps, preserves finite decimals and genuine zero, and excludes missing, blank, malformed, and non-finite values. The first valid row in source order wins a duplicate hour. Excluded rows retain the reason, raw time/value/flags, and original zero-based row index. The UI displays row numbers starting at one. |
| Coverage and summary | A recognized NOAA no-data message leaves hourly coverage unknown. A valid empty list establishes no rows in that response. A populated response can still have no accepted observations. A partial result has accepted observations and missing expected hours or excluded rows. Minimum, maximum, and mean describe accepted readings, with the mean rounded to two decimals. |
| Freshness | The upstream fetch bypasses caching and all API responses use `Cache-Control: no-store`. The page retains a same-window response in memory during a refresh. It labels retained data stale at 15 minutes, after its selected window rolls forward, or after a same-window refresh fails. |
| Rendering | A native SVG uses contiguous segments, distinct hatched missing intervals, and an accessible title and description. The observation table uses the same accepted readings and exposes UTC, normalized and raw values, and flags. The controls and disclosure panels are native keyboard-operable elements. |

## Evidence Frontier contract

`src/features/evidence/model.ts` defines stable identifiers, scope, interval, expected coverage, detection method, assumptions, direct evidence, source URLs and retrievals, verification, alternatives, limitations, and a next evidence-gathering action. The adapter emits four source-scoped findings.

- **Observation gap.** An expected hour has no accepted value. A finding identifies an attributable excluded raw row when available.
- **Excluded observation.** A raw row failed a specific structural rule. A malformed timestamp may prevent linking that row to an expected hour.
- **Uninterpreted quality.** A non-baseline `f` field or a present `q` field is shown for further review. Quality fields are preserved on all accepted rows.
- **Source coverage unknown.** NOAA’s ambiguous no-data response supplies no basis to count missing hours as established facts.

The research-gap branch of the contract requires a documented cross-source review and multiple source records. This single station feed cannot establish whether an observation exists elsewhere, why a measurement is absent, or whether the accepted readings imply ecological health, a trend, or a research gap. The Gap Inspector identifies records that could help distinguish explanations, including original NOAA rows, station inventory, maintenance history, and documented alternate sources. [Research philosophy](RESEARCH_PHILOSOPHY.md) · [Evidence Frontier roadmap](EVIDENCE_FRONTIER_ROADMAP.md)

## Verification

Node.js 24.22.3 with npm 11.19.1 passed clean install, lint, TypeScript, 18 unit tests, production build, and 9 route smoke tests. The unit and production route tests use [pinned NOAA fixtures](../test/fixtures/noaa/README.md). Automated checks require no NOAA uptime.

Chromium 158 checked 375, 768, and 1440 px with reduced motion. All three widths had 22 matching SVG and table records, three chart segments separated by two missing hours, visible keyboard focus, and no horizontal page or table overflow. The select and submit controls measured 44 CSS px high. Mobile touch emulation exercised window selection, gap disclosure, ambiguous and error states, and stale data retained after a failed refresh. The screenshots carry a visible test fixture label because the replay derives test inputs from the pinned response. Screen-reader and physical-device checks remain unverified.
