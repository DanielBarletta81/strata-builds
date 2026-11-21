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

The second worktree started at Phase 1 squash merge `0349df77c50519a58da78b6dd5921acb6c3d345d` on `strata-009/phase-2-catch-curves`. All 16 recovered photographs matched the supplied manifest and the local extracted copies. The laboratory lets visitors inspect five annual and two pooled figure annotations, compare their printed Z with the corresponding Table 1 row, and review each source receipt.

Printed captions and Results references have separate provenance. Unreadable captions and the cropped 2001 age axis remain visible in the audit. Plotted coordinates and a traced regression await independent extraction. The recovered Table 2 and Results show the unresolved 2002 versus pooled 1999–2002 scope discrepancy. The recovered Methods names the growth fit procedure, and the complete fitted equation and t₀ convention remain unresolved. [Figure audit](BASS_2003_FIGURE_DIGITIZATION.md)

- Local source verification passed for the pinned archive, manifest and all 16 originals. The verifier rejected a deliberately modified copy of the ZIP.
- Clean install, lint, typecheck, 54 unit tests, production build and 20 route smoke tests passed on Node.js 24.22.3 and npm 11.19.1.
- Chromium at 375, 768 and 1440 px verified Studio navigation, keyboard operation, all figure–table pairs, the focused Table 1 link and the disclosure controls. No horizontal overflow, browser errors or requests for original photographs occurred.
- Laboratory captures with the source inspector and methods expanded. [375 px viewport](review/strata-009-phase-2-mobile.png) · [1440 px viewport](review/strata-009-phase-2-desktop.png)
