# STRATA-016: Stage A Design Specification and Recommendation

**Status:** Design Phase Complete — Ready for Fleet Command Review  
**Date:** 2026-11-23  
**Mission:** Complete STRATA-016 Stage A (Design and Visual Concept)  
**Next Gate:** Fleet Command approval before Stage B implementation

---

## Executive Summary

**Task:** Transform NOAA Signals Lab into a premium "Listening Station" experience through improved visual design and observation-centric interaction.

**Deliverables Completed:**
1. ✅ Current state visual audit (STRATA-016-DESIGN-AUDIT.md)
2. ✅ Data lineage and validation flows (data-lineage.md)
3. ✅ Interaction state model (interaction-states.md)
4. ✅ Observation selection specification (selection-flow.md)
5. ✅ Concept A: Panoramic Signal Observatory (STRATA-016-CONCEPT-A.md)
6. ✅ Concept B: Coastal Monitoring Array (STRATA-016-CONCEPT-B.md)

**Design Recommendation:** **Concept A (Panoramic Signal Observatory)** with integrated observation selection and auto-expanding inspector. See rationale below.

---

## Concept Comparison Matrix

### Visual Hierarchy and Emphasis

| Aspect | Concept A | Concept B |
| --- | --- | --- |
| **Primary focus** | Temperature trace (chart-centric) | Operational workflow (panel-centric) |
| **Secondary focus** | Selected observation inspector | Coverage and stats panels |
| **Tertiary focus** | Evidence gaps and table | Fine-grained evidence details |
| **Metaphor** | Astronomical observatory tuning to a signal | Coastal monitoring station scanning readouts |

### Interaction Model

| Aspect | Concept A | Concept B |
| --- | --- | --- |
| **Primary interaction** | Click/tap chart point to select & inspect | Scan four panels; click table row for details |
| **Inspector behavior** | Auto-expands on selection; scrolls into view | Always expanded; no selection highlights |
| **Selection visual** | Ring on chart point + highlight table row | Optional row highlight (secondary feature) |
| **Keyboard navigation** | Arrow keys through observations on chart | Tab through panels; arrow down in table |
| **Mobile experience** | Chart-first; inspector scrolls into view | Stacked panels; full scroll-down access |

### Operational Characteristics

| Aspect | Concept A | Concept B |
| --- | --- | --- |
| **Quick scan** | "What's the latest value?" — Chart shows immediately | "What's the status?" — Four panels answer fast |
| **Deep inspection** | Click to focus; inspector expands | Scroll to see evidence; always visible |
| **Comparison** | Switch selection to compare two hours | Requires visual inspection of chart + table |
| **Data access** | Table scrollable; evidence hidden until inspector | Evidence expanded; table searchable |
| **Page length** | Shorter (inspector collapses after selection) | Longer (evidence always expanded) |
| **Touch friendly** | Requires precise tap on points; scroll-to-inspector | Stacked panels; large scroll targets |

### Accessibility Considerations

| Aspect | Concept A | Concept B |
| --- | --- | --- |
| **Keyboard users** | Strong: Arrow keys through chart; Enter to select | Strong: Full tab order through panels |
| **Screen readers** | Good: aria-current on selection; live announcements | Excellent: No hidden sections; linear reading order |
| **Mobile users** | Good: Tap points with expanded hit area; scroll inspector | Excellent: No deep nesting; full content visible |
| **Zoom/magnify** | Good: Content reflows; selection ring visible at 200% | Excellent: Panel layout adapts smoothly |
| **Cognitive load** | Medium: Selection flow to understand | Low: Straightforward panel scanning |

### Visual Distinctiveness

| Aspect | Concept A | Concept B |
| --- | --- | --- |
| **Chart prominence** | ★★★★★ (Primary) | ★★★ (Supporting) |
| **Panel organization** | Implicit (vertical stack) | Explicit (four-panel grid) |
| **Evidence visibility** | Hidden in inspector (expanded on selection) | Always visible (operational transparency) |
| **Scientific credibility** | High (emphasis on exact measurements) | High (emphasis on quality and gaps) |
| **Premium feel** | High (immersive chart; focused inspection) | High (clean grid; professional layout) |

---

## Concept A Rationale

### Strengths

1. **Signal-First Aesthetic:** The large temperature trace is the visual anchor; every other element supports inspection of that signal. This aligns with the "Listening Station" metaphor—you're tuning to a moment and listening closely.

2. **Observation-Centric Interaction:** Clicking a data point is intuitive and powerful. The inspector expands to show that observation's full context (quality, exclusions, related evidence). This creates a coherent inspection flow.

3. **Responsive and Accessible:** Keyboard navigation through chart points (arrow keys) is natural. Selection state (aria-current) is clear to screen readers. Touch interaction (44px hit targets) is feasible.

4. **Listening Station Metaphor Embodied:** The concept evokes active monitoring. You're not passively reading a report; you're tuning to specific moments and discovering their story.

5. **Aligns with Fleet Command Decisions:**
   - ✓ Prominent calibrated teal/cyan trace
   - ✓ Linked, accessible observation selection
   - ✓ Persistent desktop inspector; stacked inline mobile inspector
   - ✓ Explore desktop and mobile compositions together
   - ✓ Manual refresh with truthful NOAA cache

6. **Bounded Implementation Scope:** New components are focused (SelectionInspector, SourceBadge, ChartCaption). Reuses existing signals-module.css infrastructure.

### Considerations

1. **Touch Precision on Mobile:** Tapping small chart points on 375px screen is challenging. Mitigation: Expand hit targets to 44px; allow swipe/arrow navigation as alternatives.

2. **Page Length:** Inspector sections + table + evidence creates vertical scroll. Mitigation: Mobile layout keeps page manageable with strategic scrolling; desktop can use side-panel variant if needed.

3. **Selection State Persistence:** Changing time window clears selection (by design). Users must re-select after window change. Mitigation: Clear intent in UI; selection is local to current window.

---

## Concept B Rationale

### Strengths

1. **Operational Dashboard Aesthetic:** Four panels organized in a grid (Window, Coverage, Latest, Stats) create an efficient scanning layout. No disclosure needed; all key data visible.

2. **Lower Cognitive Load:** No complex interaction needed. Scan panels top-to-bottom; evidence sections expanded for thoroughness. Suitable for quick checks and operations monitoring.

3. **Screen Reader Friendly:** No hidden sections; linear reading order is obvious. All evidence visible from the start (no need to trigger inspector).

4. **Dense but Readable:** Packs a lot of information without feeling cramped. Each panel is self-contained.

5. **Scalable to Multiple Stations:** If NOAA Signals Lab expands to show multiple stations, Concept B's panel layout is easier to replicate (one grid per station).

### Considerations

1. **Less "Premium" Feel:** More functional than immersive. If the goal is to emphasize the signal as the focal point, Concept B de-emphasizes the trace.

2. **Longer Initial Scroll:** Evidence sections are expanded by default, increasing page length. Users must scroll to see the full context.

3. **Weaker Point Selection:** Concept B doesn't emphasize point selection, making it harder for users to compare observations or inspect specific moments.

4. **Operational Hierarchy May Confuse New Users:** The four-panel layout assumes a specific scanning order (Window → Coverage → Latest → Stats). Some users may expect chart-first.

---

## Recommendation: Concept A with Enhancements

**Primary Recommendation:** Proceed with **Concept A (Panoramic Signal Observatory)** for Stage B implementation.

**Rationale:**
- Aligns most closely with Fleet Command's design decisions (listening metaphor, observation-centric selection, integrated inspector)
- Provides a distinctive, premium user experience that elevates the data inspection ritual
- Keyboard and touch interaction patterns are well-defined and accessible
- Responsive design handles both desktop and mobile naturally
- Bounded implementation scope makes Stage B achievable without scope creep

**Recommended Enhancements to Concept A:**
1. **Evidence Trail (Compact Provenance Visualizer):** Show the path from NOAA source collection → retrieval → validation → transformation → presentation → limitations. Expandable section below chart or in inspector. Reusable model for all STRATA instruments (Deep Time, Orbital, Atlas). See `STRATA-016-EVIDENCE-TRAIL.md` for full design and Mermaid diagram.
2. **Desktop Side Panel Option:** At 1024px and above, consider a persistent right-side inspector panel (togglable). This reduces scroll burden while maintaining the chart focus.
3. **Search/Filter on Table:** Allow users to jump to a specific observation without scrolling through all rows.
4. **Export Integration:** Add "Export selected range" or "Copy observation as JSON" for research use. Evidence Trail enables "Download provenance as JSON" for archival.
5. **Keyboard Shortcut for Latest:** Spacebar to jump to the most recent observation.

**Concept B as Alternative:** If Fleet Command prefers an operational dashboard aesthetic or if user research indicates the four-panel layout resonates more strongly, Concept B is a viable alternate. No major code impact; primary difference is CSS layout and removal of point selection logic.

---

## Specification Summary: Concept A Implementation

### Responsive Breakpoints (Finalized)

```
Mobile-first design with these explicit breakpoints:

320px  (small phone)   → 1 col, chart 25vw height, stats 2-col grid
375px  (target mobile)  → 1 col, chart 25vw height, inspector scrolls into view
768px  (tablet)        → 1 col or 2-col grid (tbd), chart 30vw, inspector inline
1024px (desktop compact) → 2-col option (chart || inspector), chart 35vw
1440px (desktop full)   → 2-col or full-width stack, chart 19vw, persistent inspector option
```

### Core User Flows

**Desktop (1440px):**
```
Load → Form visible & enabled
  → User selects hours & clicks Refresh
  → Spinner appears (new pending UI)
  → Data loads → Chart + Inspector visible
  → User clicks chart point
  → Point highlights, inspector expands relevant sections, table row highlights
  → User can inspect quality, source, evidence
  → User clicks different point → selection switches
  → User changes hours → selection clears, form enabled
```

**Mobile (375px):**
```
Load → Form visible & enabled
  → User selects hours & taps Refresh
  → Brief skeleton/loading state
  → Data loads → Chart visible in viewport
  → User taps chart point (expanded 44px hit area)
  → Point highlights; page scrolls to inspector (smooth on desktop, instant on mobile)
  → Inspector expanded, relevant sections open
  → User can scroll down to table
  → User taps different point → selection switches
  → User changes hours → selection clears
```

### New Components (Concept A)

**SelectionInspector.tsx**
- Props: `selectedObservation: Observation | null`, `snapshot: SignalsSnapshot`
- Renders: Source disclosure, quality detail, related evidence sections
- Auto-expands relevant details sections based on selected observation
- Handles auto-scroll into view on mobile

**SourceBadge.tsx**
- Props: `observation: Observation`, `station: Station`
- Renders: Compact source metadata badge (timestamp UTC, raw value, quality flags)
- Reusable in inspector and hover tooltips

**ChartCaption.tsx**
- Props: `snapshot: SignalsSnapshot`, `selectedObservation: Observation | null`
- Renders: Interactive legend and instruction text below chart
- Updates text based on selection state

### CSS Modifications (signals.module.css)

```css
/* New selection states */
.pointSelected {
  stroke: var(--strata-action);
  stroke-width: 2;
  r: 5;
}

.rowSelected {
  background: var(--strata-selected);
  border-left: 3px solid var(--strata-action);
}

/* Inspector auto-expansion */
.inspectorAutoExpanded {
  transition: none; /* or brief 120ms on desktop, none on mobile */
  max-height: auto;
}

/* Mobile layout adjustments */
@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
  
  .inspector {
    margin-top: 1.5rem;
    scroll-margin-top: 60px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .pointSelected,
  .rowSelected,
  .inspectorAutoExpanded {
    transition: none;
    animation: none;
  }
  
  .inspector {
    scroll-behavior: auto;
  }
}
```

### Integration Checklist (Concept A)

**Visual & Interaction:**
- [ ] Desktop mockup at 1440px (chart + inspector, table below)
- [ ] Mobile mockup at 375px (stacked, responsive scroll)
- [ ] Tablet mockup at 768px and 1024px (responsive transitions)
- [ ] All interaction states: default, hover, focus, selected
- [ ] Loading spinner design and placement
- [ ] Keyboard navigation flow diagram
- [ ] Touch interaction guidelines (44px targets)

**Accessibility:**
- [ ] WCAG 2.2 AA contrast verification (all text, focus indicators)
- [ ] Screen reader test: VoiceOver + Safari, NVDA + Firefox
- [ ] Keyboard-only navigation: tab order, arrow keys, Enter/Space, Escape
- [ ] Zoom test: 200% and 400% magnification
- [ ] Reduced motion preference respected (no animations)
- [ ] Color blindness check: all data conveyed without color alone

**Code Quality:**
- [ ] TypeScript types for new components (Observation, SignalsSnapshot, etc.)
- [ ] Unit tests for selection state management
- [ ] Chart point click detection (hit testing)
- [ ] Table row selection with keyboard support
- [ ] Inspector auto-expand logic (which sections open for which flags)
- [ ] Accessibility tree verification (ARIA annotations)

**Performance:**
- [ ] Selection highlight: <100ms update
- [ ] Inspector auto-expand: <300ms scroll-into-view
- [ ] Chart re-render on selection: <100ms (SVG class swap, no recalc)
- [ ] Bundle size impact: +5–8KB (measure before/after build)
- [ ] No new large dependencies (keep SVG-only, no D3/Recharts)

**Documentation:**
- [ ] Component API (props, events, usage examples)
- [ ] CSS module structure (new classes, media queries)
- [ ] Selection state machine (flow diagram)
- [ ] Mobile design guidelines (hit targets, scroll behavior)
- [ ] Keyboard navigation reference (all shortcuts)

---

## File-Change Implementation Plan (Stage B)

**Scope:** Implement Concept A visual design and observation selection interaction.

### New Files to Create

```
src/features/signals/
├── selection-inspector.tsx         # Selected observation inspector panel
├── selection-inspector.test.tsx    # Unit tests for inspector
├── source-badge.tsx                # Compact source metadata badge
├── chart-caption.tsx               # Interactive legend below chart
└── types/selection.ts              # Selection state type definitions

docs/strata-016/
├── STRATA-016-DESIGN-SPEC.md       # This document
├── STRATA-016-CONCEPT-A.md         # Concept A detailed spec
├── STRATA-016-CONCEPT-B.md         # Concept B detailed spec
├── STRATA-016-DESIGN-AUDIT.md      # Current state audit
├── data-lineage.md                 # Data flow diagrams
├── interaction-states.md           # State model and visual treatment
├── selection-flow.md               # Observation selection flow
└── implementation-checklist.md     # Verification checklist
```

### Modified Files

```
src/features/signals/
├── signals-instrument.tsx          # Add selection state management
├── signals-instrument.test.tsx     # Add selection state tests
├── temperature-chart.tsx           # Add point click handler; aria-current
├── signals.module.css              # Add .pointSelected, .rowSelected, responsive tweaks
└── observations.ts                 # No changes (preserve scientific model)

src/app/signals/
└── page.tsx                        # No changes (shell integration only)

src/styles/
└── tokens.css                      # Verify all tokens available; no changes needed
```

### Deleted Files

**None.** No existing code is deleted; only extended and enhanced.

---

## Scientific Data Preservation (Stage B)

**Critical — Do Not Change:**
- `observations.ts`: STATION constant, exclusion logic, quality flags
- Data model: UTC time, raw values, complete exclusion records
- Chart rendering: Existing SVG structure preserved; selection is CSS-only
- Table structure: All columns intact; selection is row highlighting only
- Evidence gaps: Categorization and content unchanged

**What We're Adding (Non-Breaking):**
- Selection state (client-side only, no data model change)
- aria-current and aria-selected attributes (semantic, no data change)
- CSS classes for highlight (visual only, no functionality change)
- Auto-expand logic for inspector sections (UX only, no data change)

**Verification:**
- Run existing unit tests: `npm test` (all pass with no changes to signals model)
- Verify test fixtures remain unchanged
- Spot-check: PNG baseline comparisons for chart rendering (should be identical)
- Route smoke tests: `/signals` loads without errors

---

## Fleet Command Review Questions (Stage A)

Before approving Stage B, please confirm:

1. **Visual Direction:** Does Concept A's "Panoramic Signal Observatory" aesthetic match your vision for a "Listening Station"? Should we consider side-inspector variant for desktop, or keep vertical stack?

2. **Selection Interaction:** Is observation-centric selection (click point → inspector expands) the right interaction model, or would you prefer the operational scanning approach (Concept B)?

3. **Mobile Experience:** For mobile users, is the chart-first + scroll-to-inspector flow acceptable, or should inspector be a bottom sheet (more complex)?

4. **Desktop Side Panel:** At 1024px and above, would a persistent right-side inspector panel be valuable? (Tradeoff: adds complexity, reduces chart width slightly)

5. **Search/Filter on Table:** Should we add a search/filter feature so users can jump to specific observations without scrolling? (Nice-to-have; consider for Stage C)

6. **Cache Transparency:** Current UI shows "Complete ✓ 2 min ago" and "Next cache check: 15:28 UTC". Is this sufficient, or should there be a countdown timer or visual indicator?

7. **Stale Behavior:** When data is stale (>15 min), should we auto-fetch fresh data, or keep user in control (current approach)?

8. **Evidence Disclosure:** In Concept A, inspector sections auto-expand on selection. Should some sections stay collapsed by default for brevity (e.g., "Excluded raw rows")? Or always expand relevant sections?

---

## Next Steps (Checkpoint B)

Upon Fleet Command approval of Concept A:

1. **Finalize desktop/mobile mockups** at exact breakpoints (320, 375, 768, 1024, 1440px)
2. **Create Figma/design artifacts** (optional; can proceed directly to implementation with these specs)
3. **Assign Stage B implementation** (est. 3–5 days)
4. **Implement and test** in feature branch
5. **Accessibility review** (keyboard, screen reader, zoom, color)
6. **Create preview/demo** (optional; can go straight to PR)
7. **Stage B PR** with comprehensive testing results
8. **Stage C:** Enhancements (side panel option, search, export, etc.)

---

## Summary

STRATA-016 Stage A is complete. Two distinct visual concepts have been designed, analyzed, and documented. **Concept A (Panoramic Signal Observatory)** is recommended for Stage B implementation based on alignment with listening-station metaphor, accessibility, and user interaction patterns.

All design decisions preserve scientific data integrity, maintain accessibility standards (WCAG 2.2 AA), and respect responsive design principles (320–1440px).

Ready for Fleet Command review and approval.

---

## Document Version History

| Date | Version | Status | Notes |
| --- | --- | --- | --- |
| 2026-11-23 | 1.0 | Draft | Initial Stage A design completion |
| — | 1.1 | Pending | Fleet Command review and approval |
| — | 2.0 | Pending | Implementation in Stage B |

---

**Stage A Design Specification Complete.**  
**Awaiting Fleet Command approval for Stage B implementation.**

---

## Appendix: Reference Materials

**Included in this delivery:**
- STRATA-016-DESIGN-AUDIT.md — Current state visual audit
- STRATA-016-CONCEPT-A.md — Panoramic Signal Observatory (detailed)
- STRATA-016-CONCEPT-B.md — Coastal Monitoring Array (detailed)
- data-lineage.md — NOAA data flow and validation
- interaction-states.md — State model and visual treatment
- selection-flow.md — Observation selection interaction
- This document: Stage A Design Specification

**Existing project documentation:**
- STRATA-015-DESIGN-SPEC.md (Checkpoint A/B identity and tokens)
- STRATA-015-DESIGN-AUDIT.md (Design system accessibility)
- README.md (Project overview)
- AGENTS.md (Engineering charter)

**To view or reference:**
- `/signals` page (current production baseline)
- `src/features/signals/` (implementation baseline)
- `src/styles/tokens.css` (available tokens)
- `docs/strata-015/` (design system showcase)

---

**Prepared by:** Claude Haiku 4.5  
**For:** Fleet Command  
**Date:** 2026-11-23  
**Mission:** STRATA-016 Stage A: Listening Station Design
