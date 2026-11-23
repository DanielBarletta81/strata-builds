# STRATA-015 — Checkpoint A handoff

**Ready for owner design review. Checkpoint B has not started.**

Branch: `strata-015/brand-design-system` from production `7690b59f4525516bff95c7bb633b41272739f76a`. Only new documentation/review assets are included. No application code, existing scientific asset, computation, classification, citation, uncertainty text, quality flag, deployment setting or production favicon has changed.

## Review in this order

1. [Five logo directions](strata-015/proposals/logo-concepts.jpg): **E / Fractured strata** explores the latest suggestion: two stone slabs with an S-shaped fracture. **D / Rocket-bolt S** remains available with clearer Source Sans 3 outline lettering and optional framing. A / Offset strata, B / Reference section and C / Layered signal remain available for comparison. No mark is final.
2. [Homepage proposal, desktop](strata-015/proposals/home-1440.jpg) · [mobile](strata-015/proposals/home-375.jpg).
3. [Laboratory specimen, desktop](strata-015/proposals/laboratory-1440.jpg) · [mobile](strata-015/proposals/laboratory-375.jpg). This preserves representative existing text; it is not a replacement scientific instrument.
4. [Design audit](STRATA-015-DESIGN-AUDIT.md) and [full specification](STRATA-015-DESIGN-SPEC.md), including proposed shared architecture, rollout and incomplete human accessibility checklist.
5. [Review board](strata-015/index.html), [baseline/proposal gallery](strata-015/comparison.html), and [320 px menu/focus specimen](strata-015/proposals/navigation-320.jpg).

To view the interactive documents locally, from the repository root:

```sh
python3 -m http.server 3257 --bind 127.0.0.1 --directory docs
```

Open `http://127.0.0.1:3257/strata-015/index.html`. This is a local documentation server, not a new Next route or public deployment. Existing project links intentionally open the current application; the review pages label this distinction. Markdown specifications can be read in the repository viewer.

## What is supplied

- Five prioritized audit findings, actual route inventory, cascade analysis and safe migration boundaries.
- Five original symbol concepts, revised outlined wordmark, proposed symbol, primary horizontal lockup and light/dark monochrome variants; 16/24/32/48 px specimens.
- Token, typography, evidence-state, motion and accessibility contracts.
- Standalone homepage and laboratory HTML/CSS specimens, native navigation/disclosures and a small illustrative four-view switch.
- 27 baseline images (eight routes plus navigation at 375/768/1440), 15 proposal page images at 320/375/768/1024/1440, five open-menu images, a logo comparison image, and ten revised-header captures at five widths and 1×/2× density.
- Locally served Source Sans 3 and Source Code Pro review fonts with pinned revisions, hashes and licenses.

No shared React components, application shell, public style-guide route or app icons were implemented: these are Checkpoint B deliverables gated by the brief. No scientific module was restyled.

## Actual verification

Runtime: Node 24.22.3 / npm 11.19.1. Browser: headless Chromium 158.0.8127.37, desktop viewport emulation, 1× device scale. Review results are in [proposals/results.json](strata-015/proposals/results.json); baseline results in [baseline/results.json](strata-015/baseline/results.json).

| Check | Result and scope |
| --- | --- |
| `npm ci` | Pass; 182 packages, zero reported vulnerabilities |
| `npm run lint` | Pass, including the review-check script |
| `npm run typecheck` | Pass |
| `npm test` | 88 passed |
| `npm run build` | Pass; existing application routes only |
| `npm run test:routes` | 22 passed, including deterministic NOAA fixture checks |
| Baseline Chromium | 24 route/width combinations; HTTP 200, no page-wide overflow or uncaught page errors |
| Proposal Chromium | 15 page/width combinations; no page-wide overflow, console errors or broken loaded assets |
| Keyboard | Skip link moves focus to main; native instrument disclosure opens/closes; all four specimen view controls update pressed state; source disclosure works with Space/Enter |
| Reduced motion | Emulated on all specimens; checked laboratory transitions zero under reduce and nonzero under no-preference |
| Contrast | 60 explicit token pairings pass: text 4.5:1, focus/control boundaries 3:1; [ratios](strata-015/contrast.json) |
| Visual review | Eight desktop baseline routes; homepage desktop/mobile, laboratory desktop/mobile, identity comparison and 320 px open-menu/focus screenshots inspected |
| Integrity | `git diff --exit-code 7690b59 -- src public test scripts package.json package-lock.json next.config.mjs` empty |

The initial proposed control-border token measured 2.65:1 against selected fill; it was strengthened to `#809DA7` and contrast rerun successfully. Lint found missing environment declarations in the new documentation browser script; those were corrected and lint rerun. These were proposal/tooling corrections, not scientific application failures.

The generic decorative divider is intentionally not a control boundary and is not used as the sole state indicator. Numeric token tests do not certify every pixel or WCAG conformance. Full screen-reader, physical touch-device, zoom/text-spacing and color-vision acceptance remain unchecked in the human checklist. Actual post-implementation route screenshots will be captured during B; none are represented as already complete.

Reproduce review checks with an available Playwright installation and Chromium executable (no application dependency added):

```sh
# Set STRATA_PLAYWRIGHT_MODULE to an installed playwright-core index.mjs,
# and STRATA_CHROMIUM_EXECUTABLE to your Chromium executable.
node docs/strata-015/check-review.mjs
python3 docs/strata-015/check-contrast.py
```

The script defaults to the local documentation server on 3257; override `STRATA_REVIEW_ORIGIN` for another origin. Screenshot files and JSON observations are regenerated by this command. It does not authenticate to Vercel or use the malfunctioning browser adapter.

## Bundle and font impact

Two local builds have the same total `.next/static` byte count: **1,382,086 bytes**, delta **0**; paths/content are not asserted identical because build identifiers differ. [Measurement](strata-015/bundle-impact.json). Application source, imports and dependencies remain unchanged; documentation is outside `public` and the application route tree.

Review fonts total **385,772 bytes**, locally served to the review only. This exceeds the proposed 100 KB initial production font budget. Subset/glyph/license evaluation and metric-adjusted Next font loading are required before adoption; CLS and cold-load font performance have not been validated for B. No remote runtime font service is introduced.

## Decision requested

Review the new E stone-slab mark alongside D and the revised lettering, color/type direction, homepage hierarchy and laboratory evidence treatment. Approve or revise this design specification before any broad CSS change or Checkpoint B implementation. This stop is explicitly required by the supplied STRATA-015 brief: **“STOP for owner review before broad CSS changes.”**

The draft PR is a review vehicle only. No merge or production release is authorized by this checkpoint. TOOLING-014-01 remains separate; no retry of its failed adapter workflow was made. Future scientific work remains out of scope.

## Header revision after owner comment

[649 px / 1× header](strata-015/proposals/identity-649-1x.png) · [320 px / 2× header](strata-015/proposals/identity-320-2x.png) · [density check results](strata-015/proposals/identity-results.json). The primary wordmark now uses licensed Source Sans 3 Semibold outlines rather than the original block glyphs. No additional font request is required by the SVG. The prior block wordmark is archived and an optional bordered version appears on the review board. Application code remains unchanged. The header was checked at 320/375/649/768/1440 px with 1× and 2× density (10 captures); all loaded correctly without page-wide overflow. The 649 px 1× and 320 px 2× captures were visually inspected. The existing 15 prototype responsive/keyboard/reduced-motion checks, 60 token contrast pairs and lint were rerun successfully for this revision.

## Stone-slab alternative

[Concept E presentation](strata-015/proposals/stone-concept.png) shows the two-path symbol, wordmark and 16/24/32/48 px specimens. Single-color light/dark assets are on the review board. This remains a concept; the review header retains the previous D option.

Concept E validation: exactly two slab paths in color and both monochrome assets; stone/background contrast 12.23:1 and 9.36:1, monochrome 16.88:1. The 15 prototype responsive/keyboard/reduced-motion checks and lint passed again after adding E. The concept presentation was visually inspected; owner recognition/final selection is still pending. The screenshot index now contains 59 images.


## Final identity refinement and approval gate

Fleet Command accepts the semantic token architecture, typography hierarchy, evidence-state treatments, accessibility requirements and legacy light canvas strategy as implementation direction. Final identity approval and Checkpoint B authorization remain pending.

- **Recommendation:** refined E / Fractured strata with the unframed horizontal lockup. Equal-area slabs, a wider S seam and true monochrome geometry. D / Rocket-bolt remains an unchanged alternative. No hybrid.
- **Review first:** [single final comparison board](strata-015/identity-final.html), [comparison image](strata-015/proposals/final-identity-comparison.png), [full board](strata-015/proposals/final-board-1440.png), and [exact B implementation manifest](STRATA-015-CHECKPOINT-B-MANIFEST.md).
- The final board supersedes the earlier stone-concept and identity-density screenshots. Historical captures remain labeled by their earlier filenames; the `final-*` captures show this refinement.
- The B manifest lists exact shell/component/icon/compatibility/test files, protects every scientific feature and source, and retains global legacy rules. It proposes system-font fallback for the first B implementation to honor the font budget; shipping font subsets requires a revised asset manifest.
- No application, scientific data, evidence disclosure, source attribution, dependency or deployment configuration changed. PR #18 remains draft; no merge or B work is authorized by this refinement.

Validation and capture metadata are in `strata-015/proposals/final-identity-results.json`, `final-geometry-results.json`, `results.json`, and `strata-015/contrast.json`. Human recognition, screen-reader, physical-device and trademark checks remain unverified. TOOLING-014-01 is separate; no retry of that browser adapter was used.


### Final refinement verification performed

| Command / inspection | Actual result |
| --- | --- |
| `npm run lint` | Passed after adding the explicit Node URL import to the review runner. |
| `python3 docs/strata-015/check-contrast.py` | 60 token contrast pairings passed. |
| `python3 docs/strata-015/check-identity-geometry.py` | Equal 502-unit slab areas; 4.243-unit minimum seam; two matching single-color paths; six mark/background pairings passed. |
| `node docs/strata-015/check-identity-final.mjs` | 20 E/D navigation checks at 320/375/649/768/1440 px × 1×/2×; five full-board viewport checks passed. Native symbol widths, loaded images, keyboard focus/disclosure and overflow checked. |
| `node docs/strata-015/check-review.mjs` | 15 homepage/laboratory/identity combinations at 320/375/768/1024/1440 px passed, including keyboard and reduced-motion behavior. |
| Visual inspection of saved captures | Comparison symbols/wordmarks, mobile full board, 375 px header and 1440 px homepage inspected. Human unaided recognition is still pending. |
| `git diff --check` and application/source diff against baseline | Passed; only documentation paths changed. Scientific and application files remain unchanged. |

Browser scripts accept `STRATA_PLAYWRIGHT_MODULE`, `STRATA_CHROMIUM_EXECUTABLE`, and optional `STRATA_REVIEW_ORIGIN`; the local checks used installed Playwright Core and Chromium. Results JSON records exact browser version and capture time. The 649 px open-menu overflow was fixed only in the review stylesheet and the affected checks rerun. Full app unit/build/smoke results above are from the earlier A run, not a new full-suite run for this documentation refinement.

Stop for owner approval of the final identity and Checkpoint B manifest. PR stays draft. No merge.
