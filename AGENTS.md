# AGENTS.md — Strata Builds Engineering Charter

> Repository-wide guidance for Codex and other compatible coding agents. Read `README.md` for project context and the active mission before changing code. More specific nested instructions, if present, take precedence within their scope.

## Mission

Build **Strata Builds** (`strata-builds.tech`) as a scientifically credible, user-centered interactive research platform. Scientific integrity underneath; exceptional human experience on top. Prioritize data provenance, validated scientific reasoning, accessibility, performance, and pixel-level UI quality.

## Founding scientific directive

> Strata doesn't exist to make completed science look impressive. It exists to make evidence inspectable, uncertainty visible, and the next unanswered question easier to investigate.

Make existing, excluded, inaccessible, and undiscovered evidence distinguishable. State what a source supports, what remains unresolved, and what evidence would distinguish plausible explanations. Assess replication in light of changes in conditions, methods, or sampling coverage. Never transform an absence of evidence into evidence of a particular cause. See [Research Philosophy](docs/RESEARCH_PHILOSOPHY.md).

## Project map

- `/` — Strata hub (existing).
- `/studio` — engineering and studio portfolio placeholder (existing route).
- `/atlas` — Microsat Atlas with an **explicitly synthetic demo**. Published Chesapeake Bay genetic research data is separately scoped.
- `/signals` — NOAA Signals Lab with Providence hourly water temperature and source-scoped evidence gaps (implemented).
- `/orbital` — Orbital Observatory with bounded, modeled JPL states for 1 Ceres (implemented).
- `/frontier` — Evidence Frontier, source coverage and gaps in Narragansett Bay (implemented).
- `/collections` — Smithsonian collections and research context (planned).
- `/deep-time` — Earth systems across geological history (planned).
- `/methods` — source provenance, assumptions, models, and limitations (planned).

**Do not assume planned routes or integrations already exist.** Verify repository state and deployment before making claims.

## Priority order

1. Preserve the user's work and existing behavior.
2. Scientific validity, provenance, and honest data labeling.
3. Security, reliability, reproducibility, and accessibility.
4. Clear interaction, visual precision, and responsive design.
5. Performance, maintainability, and bounded scope.

## Start every mission

1. Inspect `git status --short`, branch, HEAD, remote, and relevant source/test files.
2. Confirm mission ID, goal, file ownership, and acceptance criteria.
3. Protect all modified/untracked files; do not overwrite or silently stage unrelated changes.
4. Use a task branch or isolated worktree where possible.
5. Identify external repositories and pin the exact source commit before reuse.
6. State blockers and unknowns rather than guessing or performing unrelated work.

## Operations requiring explicit captain approval

- Merge or push to `main`, force-push, destructive reset/clean, or branch deletion.
- Deploy to production, alter DNS/Bluehost/Cloudflare/Vercel settings, modify secrets, or change production data.
- Add billable services, tracking, accounts, user data collection, or significant dependencies.
- Rewrite shared architecture or unrelated modules outside the mission.
- Publish scientific assertions without validated source records.

A branch push or PR authorization is **not** merge/deploy authorization.

## Scientific data contract

At an ingestion boundary capture, where applicable:

- `source`: provider, product, dataset identifier, original URL, attribution/license.
- `retrievedAt`: UTC time fetched; distinguish from `observedAt` and orbital/model `epoch`.
- `units`, coordinate frame/CRS, timezone and time basis.
- `quality`: raw flags, excluded records, missing intervals, coverage.
- `transformation`: parser, filters, calculations, version, assumptions.
- `limitations`: uncertainty, method validity, sampling and representativeness.

Use a clear three-way distinction throughout the UI:

- **Observed:** actual recorded measurements or documented observations.
- **Modeled:** calculated, forecast, propagated, interpolated, or reconstructed.
- **Illustrative:** synthetic/demo values or artistic explanatory presentation.

Never fabricate readings, coordinates, timestamps, schema fields, model confidence, or API behavior. Never silently coerce empty/invalid data to zero. Test adapters against real, verified schemas with deterministic fixtures. Keep data ingestion, normalization, scientific algorithms, and rendering separate.

### Module safeguards

- **Microsat Atlas:** Synthetic sample data must remain unmistakably labeled. Future Chesapeake Bay integration requires suitable published **genotype or allele** datasets; NOAA/environmental observations are contextual, not substitutes for genetic data. Establish species, markers, site locations, permission/rights, methods, and uncertainty before inference. Show rejected rows, truncation, and sampling limits.
- **NOAA Signals:** Retain source station/product, UTC interpretation, units, retrieval time, flags, excluded/missing records, and visible gaps. Never display hardcoded or simulated values as observed.
- **Orbital Observatory:** Use documented MPC/NASA/JPL resources, per-object epoch, reference frame, and proper time propagation. Validate numerical methods against references. Label approximate orbits and nonphysical marker scales.
- **Deep Time:** Distinguish evidence, published paleogeographic/climate reconstructions, and illustration. Do not imply interpolated Earth history is directly observed.
- **Smithsonian Collections:** Preserve record identifiers, attribution, rights, and boundaries between collection metadata and interpretation.

## UX and accessibility

- Design: dark, restrained scientific-observatory aesthetic with precise typography and meaningful accent colors; no decorative fake telemetry.
- Every animation, interaction, or 3D element should serve inspection, comparison, understanding, or navigation.
- Keyboard and touch access, focus indication, contrast, semantic labels, responsive layouts, tables, and reduced-motion support are required.
- Design loading, stale, partial, empty, error, and no-data states intentionally.
- Check mobile widths for horizontal overflow and usable targets. Do not use microscopic typography to simulate an instrument panel.
- Use WebGL only where spatial information benefits; prefer native HTML/SVG or 2D charts for exact analytical reading. Bound GPU work and provide fallbacks when feasible.

## Implementation boundaries

- Respect Next.js App Router and server/client boundaries; use TypeScript for new features and runtime validation for untrusted inputs.
- Keep server adapters, domain logic, visualization models, and components independently testable.
- API requests require reasonable limits, timeouts, failure treatment, and documented freshness/caching policy.
- Never expose secrets in client code, logs, source control, or fixtures.
- Do not install Three.js, deck.gl, D3, or other libraries merely because they appear in the roadmap.
- Avoid broad dependency changes, speculative abstractions, and unrelated formatting changes.
- Inspect licensing and pin source commits when integrating Microsat Atlas, NOAA Signals Lab, or Strata Works.

## Verification

On the STRATA-002 stabilization baseline, use Node.js 24.22.3 with bundled npm 11.19.1. Verify the checked-out `.nvmrc` and `package.json`, then run:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:routes
```

The STRATA-002 stabilization baseline is merged into `main`. Record actual results. Use browser checks for visual rendering, keyboard usability, and responsive layout. Report screen-reader verification only when it was actually performed.

## Agent ownership and coordination

- **Quartermaster:** repository inventory and read-only audits.
- **Data Engineer:** validated ingestion, schemas, scientific calculations, provenance.
- **Visualization Engineer:** diagrams, maps, rendering, interaction/performance.
- **UX Engineer:** responsive design, accessibility, focus and visual consistency.
- **Integration/Release Engineer:** framework baseline, CI, preview, smoke tests.

Assign one bounded mission and file-ownership set per agent. Avoid concurrent edits to shared layout, root manifests, or deployment configuration. Prefer contracts and small PRs over overlapping agents.

## Mandatory handoff

Report mission ID, branch/HEAD/status, files changed, relevant pinned upstream revisions, scientific sources and data classification, commands and actual pass/fail results, browser/accessibility verification performed (or not), unresolved risks, and next safe action. Provide PR/preview URLs only when they exist. Stop at a safe checkpoint if blocked.

## Current sequence (verify before updating)

1. **STRATA-002** — stabilization and closeout submitted for review in [PR #1](https://github.com/DanielBarletta81/strata-builds/pull/1). See the current PR checks and [closeout report](docs/STRATA-002.md).
2. **STRATA-003** — the Atlas demo integration is documented in [STRATA-003](docs/STRATA-003.md). Verify the checked-out branch and deployment before reporting release status.
3. **STRATA-003B** — Chesapeake Bay research-genetics connection; future requirement, not authorized to implement yet.
4. **STRATA-004** — Providence NOAA observations, quality inspection, and the Evidence Frontier contract. See [STRATA-004](docs/STRATA-004.md).
5. **STRATA-005** — Orbital Observatory’s first instrument uses a frozen JPL ephemeris for 1 Ceres. See [STRATA-005](docs/STRATA-005.md).
6. **Deep Time and Collections** — subsequent separately scoped releases.

Keep status claims tied to verified commits and deployments.
