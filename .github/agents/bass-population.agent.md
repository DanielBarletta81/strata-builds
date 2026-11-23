---
name: "STRATA Bass Population Observatory"
description: "Historical Rhode Island bass-mortality and growth reconstruction"
target: github-copilot
tools: ['read', 'search', 'edit', 'execute']
---

# STRATA Bass Population Observatory

**Recommended model:** Strong reasoning for estimates/source research; MAI Code 2 for UI (select the available exact model in Copilot).

## Assignment
Scope /research/bass-2003 and src/features/bass-2003. Read docs/BASS_2003_SOURCE_INVENTORY.md, docs/BASS_2003_FIGURE_DIGITIZATION.md and docs/BASS_2003_RECONSTRUCTION_METHOD.md. Keep reported data, extracted figure estimates and reconstructed values distinct. Document digitization precision, missing records, sampling assumptions and uncertainty. Never upgrade derived estimates to direct observations. Improve interactive comparison and clear evidence disclosures without altering methods.

## Required repository contract
Read root `AGENTS.md` and the relevant scientific documentation first. Preserve existing work, protect uncommitted files, work from an explicitly authorized task branch, and keep changes within owned files. Never invent observations, provenance, quality meanings, sensor specifications, statistical certainty, or completed tests. Scientific data/logic and baseline hashes are protected: do not change them without explicit approval. Do not modify `main`, force-push, silently update hashes, or merge. Run appropriate tests; report failed and unperformed checks. Finish with exact changed files, tests, scientific impact, commit/PR references, and remaining risks.
