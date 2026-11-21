# STRATA-009 · Bass Population Observatory

The first slice at `/research/bass-2003` presents the 2003 Rhode Island largemouth bass study as a research instrument. Studio links to the report, historical study scope, mortality comparison, growth parameters, figure register and open questions.

## Baseline and changes

The branch started in an isolated worktree at `dadf9ab3e9301a6364f89230968fab0c540fda80`, the STRATA-008 squash merge on `origin/main`. Existing STRATA-008 audit edits and the original checkout’s uncommitted files were preserved in their own worktrees.

The route reads a frozen transcription under `src/features/bass-2003/`. Mortality selection and plotted series share the same Table 1 records. Table 2 uses exact decimal strings. Studio and the sitemap expose the new route. No application dependency was added.

## Evidence scope

Phase 1 used the researcher-supplied transcription of 15 Table 1 estimates and two Table 2 fits. Its figure register tracked reported availability. The mortality comparison preserves differences in period, season, gear and pond grouping. The historical stocking objective requires its own legal-size abundance evidence. [Source inventory](BASS_2003_SOURCE_INVENTORY.md) · [Reconstruction and intake method](BASS_2003_RECONSTRUCTION_METHOD.md)

## Phase 1 verification

- Node.js 24.22.3 and npm 11.19.1. Clean install, lint, typecheck, 52 unit tests, production build and 20 route smoke tests passed.
- Chromium at 375, 768 and 1440 px verified Studio navigation, all 15 mortality rows, period and gear changes, metric changes, keyboard selection with visible focus, and both provenance disclosures. The page had no horizontal overflow or browser errors at these widths.
- Full-page captures from the local production build are available for [375 px mobile](review/strata-009-mobile.png) and [1440 px desktop](review/strata-009-desktop.png).

## Phase 2 · Catch Curve Laboratory

The laboratory adds seven source-verified figure annotations with their linked Table 1 rows. Source coverage, verification and browser captures are documented in the [Phase 2 closeout](STRATA-009-PHASE2.md).
