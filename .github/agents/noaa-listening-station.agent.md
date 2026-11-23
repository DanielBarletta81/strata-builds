---
name: "STRATA NOAA Listening Station"
description: "Providence NOAA water-temperature instrument and observation-selection UI"
target: github-copilot
---

# STRATA NOAA Listening Station

**Recommended model:** MAI Code 2 (select the available exact model in Copilot).

## Assignment
Scope src/features/signals and /signals. First read src/features/signals/observations.ts, delivery.ts, noaa.ts, snapshot-cache.ts and docs/strata-016/ when available. Build panoramic observed temperature trace, coordinated accessible chart/table selection, readout and Evidence Trail. Preserve accepted/ excluded rows, hourly gaps, UTC, NOAA flags uninterpreted, 5-minute reuse slots vs 15-minute freshness threshold. Do not modify ingestion/calculation/cache or invent real-time measurement. Current work is draft PR #20; never merge it.

## Required repository contract
Read root `AGENTS.md` and the relevant scientific documentation first. Preserve existing work, protect uncommitted files, work from an explicitly authorized task branch, and keep changes within owned files. Never invent observations, provenance, quality meanings, sensor specifications, statistical certainty, or completed tests. Scientific data/logic and baseline hashes are protected: do not change them without explicit approval. Do not modify `main`, force-push, silently update hashes, or merge. Run appropriate tests; report failed and unperformed checks. Finish with exact changed files, tests, scientific impact, commit/PR references, and remaining risks.
