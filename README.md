# Strata Builds

**Scientific data, made explorable.**

**Strata Builds** is an evolving platform for scientific visualization, research software, and carefully designed digital experiences by **D. C. Barletta**.

- **Running site:** [strata-buildsv10.vercel.app](https://strata-buildsv10.vercel.app)
- **Intended custom domain:** `strata-builds.tech`, pending DNS cutover
- **Source:** [DanielBarletta81/strata-builds](https://github.com/DanielBarletta81/strata-builds)

> **Scientific integrity underneath. Exceptional human experience on top.**

We build research instruments rather than decorative dashboards: interfaces that let visitors explore spatial and temporal patterns, inspect underlying evidence, understand assumptions, and ask better questions. Our visual direction is a restrained, dark scientific observatory, with precision typography, responsive interaction, and meaningful color.

## Experiences

| Module | Route | Purpose | Implementation status |
| --- | --- | --- | --- |
| Strata Hub | `/` | Introduction and scientific product showcase | Existing landing page |
| Studio | `/studio` | Design and engineering portfolio | Existing placeholder route |
| Microsat Atlas | `/atlas` | Population genetics, geography, and sampling interpretation | Synthetic demo implemented in STRATA-003 |
| NOAA Signals | `/signals` | Providence hourly water temperature, quality flags, coverage, and evidence gaps | Implemented in STRATA-004 |
| Orbital Observatory | `/orbital` | Bounded time inspection of 1 Ceres with saved JPL model states and evidence limits | First instrument implemented in STRATA-005 |
| Evidence Frontier | `/frontier` | Narragansett Bay source coverage, monitoring schedules, and research questions | First investigation implemented in STRATA-006 |
| Evidence Reconciliation | `/frontier/reconciliation` | Record-level Bullock Reach and Station II temperature investigations | Case files implemented in STRATA-007 |
| Estuarine Gradient Observatory | `/oceanography` | Narragansett Bay nutrient pairs and water-column observations | First slice implemented in STRATA-008 |
| Bass Population Observatory | `/research/bass-2003` | Historical Rhode Island largemouth bass mortality and growth estimates | Table-based reconstruction in STRATA-009 |
| Collections Lab | `/collections` | Smithsonian collections, records, and research context | Planned |
| Deep Time | `/deep-time` | Earth's evolving atmosphere, oceans, continents, and life | Planned |
| Methods | `/methods` | Data source, model, quality, and uncertainty documentation | Planned |

This table describes the checked-out code. The running site reflects the current production deployment.

## Research and data strategy

### Microsat Atlas

The first Strata version adapts the existing [Microsat Atlas](https://github.com/DanielBarletta81/microsat-atlas) SVG map and site-composition panel. The clearly labeled synthetic demo includes coastal attribution and a keyboard-accessible records table. [STRATA-003 methodology and source pin](docs/STRATA-003.md)

A separate future milestone, **STRATA-003B**, will seek suitable **published Chesapeake Bay microsatellite or genotype datasets**. Documented water-quality observations may provide environmental context alongside genetic measurements. Establish the dataset, species and markers, site metadata, licensing, and statistical methods before displaying research conclusions.

### NOAA Signals Lab

The NOAA Signals Lab retrieves hourly NOAA CO-OPS water temperature observations for Providence, Rhode Island (station 8454000). Review a window of 1–72 completed UTC hours, follow the original source request, and inspect quality fields, exclusions, and missing intervals. An ambiguous NOAA response leaves coverage unknown. [STRATA-004 data contract and source pin](docs/STRATA-004.md)

The Evidence Frontier contract distinguishes station-level findings from research gaps that require cross-source investigation. See the [research philosophy](docs/RESEARCH_PHILOSOPHY.md) and [Evidence Frontier roadmap](docs/EVIDENCE_FRONTIER_ROADMAP.md).

### Orbital Observatory

Inspect 1 Ceres in a saved NASA/JPL Horizons ephemeris. The first instrument provides a 2D J2000 ecliptic projection and a numerical state table across 262 sampled TDB epochs. It exposes the orbit solution epoch, retrieval timestamps, and open evidence questions. [STRATA-005 source audit and method](docs/STRATA-005.md)

### Deep Time Observatory

**STRATA — DEEP TIME**: *The Planet Was Never Still.* A future inspectable globe will explore major Earth-system changes and geological events. Geographic reconstructions, modeled climate/atmosphere, geological evidence, and artistic illustration must remain distinguishable.

### Smithsonian Collections

The Collections Lab will explore collection metadata and research context using source identifiers, source links, rights attribution, and accessible inspection tools. Links to environmental and deep-time modules should be grounded in actual records rather than invented relationships.

## Data integrity

Every experience should expose, where relevant:

- Provider, original product/record, URL, attribution, usage terms.
- Observation or model **epoch** distinct from data **retrieval time**.
- Units, time zone, coordinate frame, quality flags, and coverage.
- Filters, transformations, modeling assumptions, and exclusions.
- Uncertainty, limits, and whether content is **observed**, **modeled**, or **illustrative/synthetic**.

These are user-facing product features, not merely internal notes.

## Technology and architecture

The core application uses **Next.js App Router, React, and TypeScript**. Select renderers per scientific need: accessible HTML/SVG and tables for precise reading; D3 or equivalent for analytical displays; Three.js / React Three Fiber for genuinely spatial simulation; deck.gl / MapLibre when a larger geographic module warrants them.

Integrations should separate upstream API adapters, schema validation, normalized domain data, calculations, visualization models, and presentation. Avoid collecting dependencies before a feature needs them. Never expose provider keys in the browser.

**Runtime:** The STRATA-002 baseline uses Node.js 24.22.3, bundled npm 11.19.1, Next.js 16.4.6, React and React DOM 19.3.1, TypeScript 5.9.3, and ESLint 10.15.0. [PR #1](https://github.com/DanielBarletta81/strata-builds/pull/1) tracks the migration and its quality checks. The stabilization baseline is merged into `main`.

## Local development

Use the Node version in `.nvmrc` and its bundled npm. The current routes require no environment variables or API credentials. With nvm installed, run:

```bash
nvm install
nvm use
npm ci
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

`npm ci` uses the tracked lockfile. Use the approved baseline for the mission you are working on.

### Quality checks

From a fresh checkout of the stabilized baseline, run:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:routes
```

`npm run test:routes` serves the production build on a temporary loopback port and checks the pages, shared layout, robots response, sitemap, and the Signals API with deterministic NOAA fixtures. Automated checks run independently of NOAA uptime. Run `npm start` to serve the build locally. The same command sequence runs in the [PR quality workflow](.github/workflows/quality.yml). Browser checks cover rendering, keyboard navigation, and responsive layouts. See the [closeout report](docs/STRATA-002.md) for the hosting and verification evidence.

## Design and engineering standards

1. **Data-first:** truthful, documented source data and reproducible transformations.
2. **User-first:** understandable interaction, clear status, powerful inspection, and polished details.
3. **Accessible by design:** keyboard controls, labels, contrast, reduced motion, mobile layout, meaningful tables and alternatives to WebGL.
4. **Performance with purpose:** bound data requests and GPU work; choose the simplest correct rendering tool.
5. **Release discipline:** feature branches, isolated missions, tests, PR reviews, previews, and explicit approval for production changes.

Agent contributors must follow [`AGENTS.md`](./AGENTS.md), the shared engineering charter.

## Roadmap

1. **STRATA-002 — Stabilize:** runtime, lockfile, quality workflow, tests, and closeout in [PR #1](https://github.com/DanielBarletta81/strata-builds/pull/1). Check the PR for current review and CI status.
2. **STRATA-003 — Integrate Atlas:** the demo slice adds the pinned standalone map and composition view, synthetic labeling, and accessible inspection.
3. **STRATA-003B — Chesapeake Bay:** published research-genetic data, reviewed methods and environmental context (future requirement).
4. **STRATA-004 — NOAA:** Providence water temperature, a source-scoped Gap Inspector, and the Evidence Frontier contract. Cross-source research discovery remains planned.
5. **STRATA-005 — Orbital Observatory:** a validated Ceres ephemeris instrument with accessible time inspection.
6. **Later modules:** Deep Time, Smithsonian Collections, and cross-module research storytelling.

## Related work

- [Microsat Atlas](https://github.com/DanielBarletta81/microsat-atlas)
- [NOAA Signals Lab](https://github.com/DanielBarletta81/noaa-signals-lab)
- [Strata Works](https://github.com/DanielBarletta81/strata-works)

Third-party scientific records, datasets, images, and reused code require appropriate source attribution and license review.

---

**Strata Builds — Design. Data. Structure.**
