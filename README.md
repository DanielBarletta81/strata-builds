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
| NOAA Signals | `/signals` | Water and environmental signals, flags, coverage, and provenance | Planned integration |
| Orbital Observatory | `/observatory` | Small-body dynamics, time navigation, and validated 3D exploration | Planned |
| Collections Lab | `/collections` | Smithsonian collections, records, and research context | Planned |
| Deep Time | `/deep-time` | Earth's evolving atmosphere, oceans, continents, and life | Planned |
| Methods | `/methods` | Data source, model, quality, and uncertainty documentation | Planned |

This table describes the checked-out code. The running site reflects the current production deployment.

## Research and data strategy

### Microsat Atlas

The first Strata version adapts the existing [Microsat Atlas](https://github.com/DanielBarletta81/microsat-atlas) SVG map and site-composition panel. The clearly labeled synthetic demo includes coastal attribution and a keyboard-accessible records table. [STRATA-003 methodology and source pin](docs/STRATA-003.md)

A separate future milestone, **STRATA-003B**, will seek suitable **published Chesapeake Bay microsatellite or genotype datasets**. Documented water-quality observations may provide environmental context alongside genetic measurements. Establish the dataset, species and markers, site metadata, licensing, and statistical methods before displaying research conclusions.

### NOAA Signals Lab

The [NOAA Signals Lab](https://github.com/DanielBarletta81/noaa-signals-lab) has feature-branch work on stricter request validation, UTC timestamps, quality flags, coverage, caching, and test fixtures. Strata should adapt these validated data boundaries rather than copy hardcoded readings or assume the older default branch is production-grade.

### Orbital Observatory

A future React Three Fiber instrument will present a scientifically supported asteroid orbit, controllable time, labeled coordinate/epoch assumptions, source records, and numerical-validation methodology. Three-dimensional design should reveal dynamics, not conceal approximations.

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

`npm run test:routes` serves the production build on a temporary loopback port and checks the pages, shared layout, robots response, and sitemap. Run `npm start` to serve the build locally. The same command sequence runs in the [PR quality workflow](.github/workflows/quality.yml). Browser checks cover rendering, keyboard navigation, and responsive layouts. See the [closeout report](docs/STRATA-002.md) for the hosting and verification evidence.

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
4. **STRATA-004 — NOAA:** validated source adapters and quality-aware time-series analysis.
5. **STRATA-005 — Orbital Observatory:** a single validated, fully documented 3D orbital instrument.
6. **Later modules:** Deep Time, Smithsonian Collections, and cross-module research storytelling.

## Related work

- [Microsat Atlas](https://github.com/DanielBarletta81/microsat-atlas)
- [NOAA Signals Lab](https://github.com/DanielBarletta81/noaa-signals-lab)
- [Strata Works](https://github.com/DanielBarletta81/strata-works)

Third-party scientific records, datasets, images, and reused code require appropriate source attribution and license review.

---

**Strata Builds — Design. Data. Structure.**
