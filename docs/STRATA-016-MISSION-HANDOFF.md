# STRATA-016: The Living Observatory — Mission Handoff

**Handoff Date:** 2026-11-23  
**Mission Status:** Checkpoint B (STRATA-015) complete and merged to production  
**Current Phase:** STRATA-016 Phase 1, Stage A (Design Audit and Visual Concept) — Ready for new session  
**Production Baseline:** `5e7365e9a812b424f3c09e482d005c690f06b66d` (Checkpoint B merge commit)

---

## Mission Brief

Transform NOAA Signals Lab into a premium "Listening Station" experience. Stage A is **design and visual concept only** — no implementation authorization.

### Visual Goals

- **Scientific observatory aesthetic:** Dark, restrained, precise typography, meaningful accent colors
- **Premium presentation:** Elevated data inspection experience, transparent source/quality disclosure
- **Active listening metaphor:** Station tuning controls, signal detection states, responsive real-time feedback
- **Responsive and accessible:** 320–1440 px viewports, keyboard navigation, screen readers, touch targets 44px min

### Scientific Integrity Contract

**Preserve entirely:**
- NOAA station metadata, coordinates, source attribution
- UTC time interpretation and timezone handling
- Hourly observation values and quality flags
- Excluded/missing record intervals (do NOT silently coerce to zero)
- Evidence classification (Observed/Modeled/Synthetic/Illustrative)
- Source linking and provenance transparency
- Cache invalidation logic and data freshness policy

**Never fabricate:**
- Readings, timestamps, coordinates
- Model confidence or uncertainty ranges without validated source
- Simulated values labeled as observed
- API behavior or fallback data

---

## Current Audit Status

✅ **Inspected:**
- `src/app/signals/page.tsx` — Page structure, metadata, header layout

⏳ **Pending (for new session):**
- `src/features/signals/signals-instrument.tsx` — Main instrument component and state
- `src/features/signals/signals.module.css` — Current styling and responsive behavior
- `src/features/signals/temperature-chart.tsx` — Chart component and interaction
- `src/features/signals/evidence-inspector.tsx` — Inspector panel and disclosure states
- `src/features/signals/observations.ts` — Data model, source constants, quality flags
- `src/features/signals/display.ts` — Display logic, formatting, unit handling
- Shared design-system components and tokens (45 tokens, 14 components from STRATA-015)

---

## File Inventory — NOAA Signals Feature

```
src/
├── app/signals/
│   └── page.tsx                    # Page shell, metadata, header
├── features/signals/
│   ├── signals-instrument.tsx      # Main instrument component
│   ├── signals-instrument.test.tsx # Unit tests
│   ├── signals.module.css          # Feature stylesheet
│   ├── temperature-chart.tsx       # Chart component
│   ├── evidence-inspector.tsx      # Inspector panel
│   ├── observations.ts             # Data model and constants
│   ├── display.ts                  # Display logic
│   └── __fixtures__/               # Test fixtures and mocks
└── components/shell/
    └── AppShell.tsx                # Shared app shell from STRATA-015
```

---

## Responsive Breakpoints & Testing Grid

Signals page must be tested and functional at:
- **320px** (small phone)
- **375px** (standard phone)
- **649px** (tablet portrait)
- **768px** (tablet landscape)
- **1024px** (desktop compact)
- **1440px** (desktop full)

Stage A deliverable: mockups at desktop (1440px) and mobile (375px) minimum; desktop/mobile pair for each interaction state.

---

## Interaction States & Specifications

**Stage A must define:**

1. **Observation selection** — How does user inspect specific data point? Click? Hover? Keyboard focus?
2. **Source disclosure** — Where/how are NOAA station, collection time, quality flags displayed?
3. **Evidence presentation** — How visually distinguish Observed vs Modeled data?
4. **Inspector panel** — Does it slide, overlay, expand inline? Responsive behavior?
5. **Chart responsiveness** — Tooltip placement at 320/1440px? Touch vs click interaction?
6. **Loading/stale/error states** — Visual treatment for data refresh, failures, missing intervals
7. **Keyboard navigation** — Tab order, Enter/Space activation, Escape behavior

Stage A outputs: sketch/mockup for each state, interaction model flowchart, accessibility notes.

---

## Accessibility & Performance Budgets

### Accessibility (WCAG 2.2 AA minimum)

- **Color contrast:** 4.5:1 for text, 3:1 for UI boundaries
- **Touch targets:** 44px min height/width
- **Keyboard navigation:** All interactive elements in tab order
- **Focus indication:** Visible at all zoom levels
- **Screen reader:** Semantic labels, hidden decorative SVG, table structure for data
- **Motion:** Reduced-motion preference respected

### Performance Targets

- **Initial load:** < 3s at 4G (Lighthouse target)
- **Chart interaction:** 60 fps on point hover/selection
- **Bundle impact:** Avoid new large dependencies (D3, Three.js)
- **Font:** System fonts or existing Source Sans 3 subset only
- **CSS:** Extend existing signals.module.css; prefer CSS Grid/Flexbox over Canvas

---

## Design System Integration (STRATA-015)

**Approved 45 tokens (CSS custom properties):**
- Primitives: neutral-50 through neutral-900, semantic colors (success, warning, error)
- Surfaces: backgrounds, borders, overlays
- Typography: font-family (Source Sans 3), font-size (12–32px), line-height, font-weight
- Spacing: 4px base unit (4, 8, 12, 16, 20, 24, 32, 48px)
- Actions: button/control colors, hover/active/disabled states
- Focus: outline color and width
- Evidence: observed (blue), modeled (purple), synthetic (orange), illustrative (gray)
- Status: success (green), warning (amber), error (red), info (cyan)

**14 shared components available:**
- BrandLockup, AppShell, PrimaryNavigation, Footer, PageHeader
- ProjectCard, Button, ScientificPanel, DataReadout, EvidenceCard
- SourceDisclosure, StatusNotice, SegmentedControl, LegacyLightCanvas

**Use:** Signals must integrate within AppShell (header, footer, navigation preserved). Do NOT recreate or fork shared components.

---

## Stage A Deliverables (Next Session)

### 1. Current-State Visual Audit

- Screenshot grid at 375px (mobile) and 1440px (desktop)
- Identify strengths and gaps in:
  - Chart readability and interaction
  - Source/quality disclosure clarity
  - Evidence classification visibility
  - Touch/keyboard accessibility
  - Responsive layout behavior
  - Loading/error state treatment

### 2. Listening Station Visual Direction

- Mood/tone: observatory, real-time awareness, signal detection
- Accent color palette (1–3 new accent hues)
- Typography emphasis and hierarchy
- Icon/indicator system for data states
- Spatial layout and visual rhythm

### 3. Desktop & Mobile Mockups

Minimum coverage:
- **Desktop (1440px):** Chart + inspector full view, source panel
- **Mobile (375px):** Chart stacked, inspector collapsed/overlay, bottom sheet disclosure
- **Interaction states:** Default, hovering observation, inspector open, error/loading, no-data

### 4. Interaction & Accessibility Specification

- **Observation selection model:** Sketch the interaction flow (click/focus → highlight → inspector opens)
- **Source presentation:** Where/how do NOAA metadata, UTC time, quality flags appear?
- **Quality evidence model:** Visual treatment of Observed/Modeled/gaps/missing intervals
- **Keyboard navigation:** Tab order diagram, focus management plan
- **Screen reader annotations:** Key ARIA labels and semantic structure

### 5. Exact Scoped File-Change Plan

List files to create/modify/delete in Checkpoint B implementation:
- Existing files modified: `signals-instrument.tsx`, `temperature-chart.tsx`, `evidence-inspector.tsx`, `signals.module.css`, `observations.ts`, `display.ts`
- New component files: (e.g., `signal-inspector-panel.tsx`, `observation-selector.tsx`, `quality-badge.tsx`)
- New test files: Corresponding `*.test.tsx` for new components
- CSS changes: Extend `signals.module.css` with responsive layouts, interaction states
- No changes to: `src/app/signals/page.tsx` (shell integration only), scientific data model, source attribution, cache logic

### 6. Visual Concept Document

- Written summary of design direction
- Rationale for interaction patterns
- Responsive design strategy
- Performance/accessibility decisions and trade-offs

---

## Next Session Checklist

**Before starting Stage A design work:**

1. ✅ Read this handoff file completely
2. ⏳ Verify production baseline: `git rev-parse HEAD` should be `5e7365e9a812b424f3c09e482d005c690f06b66d`
3. ⏳ Verify branch: `git branch --show-current` should be `strata-016/noaa-listening-station`
4. ⏳ Run `npm ci && npm run lint && npm run typecheck` — confirm no errors
5. ⏳ Run the dev server and visit `http://localhost:3000/signals` — baseline behavior

**Then begin audit:**

6. ⏳ Read `src/features/signals/observations.ts` — understand data model, NOAA station metadata, quality flags
7. ⏳ Read `src/features/signals/temperature-chart.tsx` — understand chart component, interaction
8. ⏳ Read `src/features/signals/evidence-inspector.tsx` — understand inspector state and disclosure
9. ⏳ Read `src/features/signals/signals-instrument.tsx` — understand instrument component layout and state machine
10. ⏳ Read `src/features/signals/signals.module.css` — understand responsive breakpoints, current styling
11. ⏳ Read `src/features/signals/display.ts` — understand formatting logic and unit handling
12. ⏳ Capture baseline screenshots: 375px and 1440px desktop widths, default and inspector-open states
13. ⏳ Document audit findings in visual comparison document

**Then design Stage A:**

14. ⏳ Create visual direction brief with mood/tone and accent palette
15. ⏳ Sketch desktop and mobile mockups showing:
    - Chart redesign (if applicable)
    - Inspector panel layout
    - Source/quality disclosure treatment
    - Responsive stacking behavior
16. ⏳ Document interaction specification: selection model, focus management, keyboard navigation
17. ⏳ Create implementation file-change manifest
18. ⏳ Write comprehensive Stage A design document

**Stop for review:**

19. 🛑 **DO NOT IMPLEMENT** until Fleet Command approves Stage A visual concept
20. 🛑 **DO NOT MODIFY** `observations.ts`, scientific data model, source attribution, or cache logic
21. 🛑 **DO NOT CREATE** production PRs until Stage A design is approved

---

## Branch & Commit Management

**Current state:**
- Branch: `strata-016/noaa-listening-station`
- Baseline: `5e7365e9a812b424f3c09e482d005c690f06b66d`
- Worktree: `/Users/dbarletta_mb_pro/Downloads/strata-builds-techv1.0/STRATA-015-checkpoint-b`

**Stage A workflow:**
- Commit handoff and documentation only (this file)
- Push to `strata-016/noaa-listening-station` for visibility
- **NO application code changes in Stage A**
- If sketches/mockups needed, store in `docs/strata-016/` directory

**After Stage A approval:**
- Create implementation PRs with separate checkpoints (A: visual/accessibility layer, B: logic/interaction)
- Do not merge to main until full Stage A + design approval chain complete

---

## Critical Preservation Notes

**Scientific integrity — do NOT change:**
- STATION constant (id, name, coordinates) in `observations.ts`
- Quality flag logic and exclusion rules
- UTC time handling and timezone interpretation
- Source URLs and attribution text
- Evidence classification enum values

**UI/UX consistency — do NOT fork:**
- Do not create duplicate Button, SourceDisclosure, or ScientificPanel components
- Use design tokens from STRATA-015 token set
- Extend shared components, don't replace them

**Testing — maintain or improve:**
- All existing signals unit tests must continue to pass
- Scientific canvas comparisons (PNG baseline verification) must remain unchanged
- Route smoke tests at `/signals` must pass
- Keep fixture data deterministic and representative

---

## Production Route Verification

After Stage A, before Checkpoint B implementation:
```bash
curl https://strata-builds.tech/signals  # Should respond with NOAA Signals Lab header
curl https://strata-builds.tech/design-system | grep signals  # Should list signals in showcase
```

---

## References & Related Missions

- **STRATA-015:** Checkpoint B complete; design system, shell, icons deployed
- **STRATA-014:** NOAA Signals Lab baseline (pre-design-system)
- **Design system:** `docs/STRATA-015-DESIGN-SPEC.md`, token definitions in `src/styles/tokens.css`
- **Accessibility guide:** WCAG 2.2 AA standards, STRATA-015 checklist in `docs/STRATA-015-DESIGN-AUDIT.md`

---

## Questions for Fleet Command Before Starting

Before approving Stage A scope:
- Accent color preference for Listening Station? (Blue/cyan/teal for "signal"? Purple for detection?)
- Chart redesign scope: improve readability only, or introduce new interaction patterns?
- Inspector panel: modal overlay, side slide, or expanded inline?
- Priority: mobile-first design sprint, or desktop-first with responsive constraint?
- Real-time refresh UI: visible spinner/progress, silent cache update, or manual refresh button?

---

**Handoff complete. Ready for Stage A design work in next session. Do not implement. Stop for review.**
