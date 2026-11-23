# STRATA custom Copilot agents

Workspace agent definitions live in `.github/agents/*.agent.md`; they appear in compatible VS Code GitHub Copilot agent pickers after the branch is checked out (and eventually merged). Existing root `AGENTS.md` remains the shared engineering contract.

## Cost-aware model routing

| Agent | Preferred model |
|---|---|
| STRATA Fleet Command | High reasoning / GPT-6 or strongest available |
| STRATA Visual Instrument Designer | MAI Code 2 |
| STRATA Evidence Trail Curator | MAI Code 2 for implementation; strong reasoning for provenance contract |
| STRATA Scientific QA Guardian | Strong reasoning for high-risk reviews; economical model for deterministic checks |
| STRATA NOAA Listening Station | MAI Code 2 |
| STRATA Oceanography Water Column | MAI Code 2 UI; strong reasoning if scientific interpretation changes |
| STRATA Evidence Frontier & Reconciliation | Strong reasoning for research; MAI Code 2 for presentation |
| STRATA Microsat Atlas | MAI Code 2 UI; strong reasoning for genetic inference |
| STRATA Deep Time Chronoscope | Strong reasoning for geology/models; MAI Code 2 for UI |
| STRATA Orbital Navigation | MAI Code 2 UI; strong reasoning for orbital reference-frame changes |
| STRATA Bass Population Observatory | Strong reasoning for estimates/source research; MAI Code 2 for UI |
| STRATA Studio Portfolio | MAI Code 2 Flash for simple work; MAI Code 2 for interaction |

**Model identifiers are intentionally not pinned in frontmatter.** Select the precise available MAI Code 2 / Flash or stronger model in your VS Code picker or use **Customize Agent** after opening a file; preview availability and exact model IDs vary. Verify that the selected agent actually uses that model; custom agents cannot enforce pricing or solve a lack of model access.

## Recommended activation
Start with Fleet Command, Visual Instrument Designer, NOAA Listening Station and Scientific QA. Other agents are installed but should only be invoked on an explicitly active instrument mission. These are **roles**, not twelve simultaneous agent sessions.

## Usage
Open the STRATA repository in VS Code → Copilot Chat → Agent dropdown → select custom agent → choose available model if necessary → supply a bounded goal. Example: “NOAA Listening Station: inspect PR #20 at its current remote HEAD. Implement just the selected-observation inspector in owned UI files, tests required, no scientific changes, no merge.”

## Safety / branches
This agent-definition PR is independent of the existing STRATA-016 development PR. Do not merge this PR until its instructions and model choices have been reviewed. Do not merge or update PR #20 as part of this setup. An agent name does not grant a reviewer or human scientific expertise: scientific sign-off and release authorization remain with the owner/relevant qualified reviewers.

## Implementation notes
Agent guidance uses `target: github-copilot` and descriptions; no unknown or unavailable tool names are hardcoded. The `model` property can be set through VS Code’s supported model-picker/autocomplete after confirming model availability.

Official docs: https://code.visualstudio.com/docs/agent-customization/custom-agents
