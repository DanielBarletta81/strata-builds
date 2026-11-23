# STRATA-016: Listening Station — Current State Visual Audit

**Audit Date:** 2026-11-23  
**Review Baseline:** Checkpoint B (production)  
**Components Audited:** Signals instrument, temperature chart, evidence inspector, observation table

---

## Current Layout and Visual Hierarchy

### Desktop (1440px) Structure

```
┌──────────────────────────────────────────────────────────────────┐
│ HEADER (AppShell)                                                │
├──────────────────────────────────────────────────────────────────┤
│ Controls: [Time window selector] [Refresh button] [Cache status] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────┐  ┌──────────────────────┐  │
│  │ INSTRUMENT (Dark background)    │  │ Coverage Panel       │  │
│  │                                 │  │ (Light background)   │  │
│  │ Water temperature               │  │                      │  │
│  │ NOAA hourly observations · °C   │  │ Latest stat          │  │
│  │                                 │  │ Details grid         │  │
│  │ Latest: XX.X °C (time)          │  │ Sources links        │  │
│  │                                 │  │                      │  │
│  │ [Stats grid: Min/Max/Mean/Count]│  │                      │  │
│  │                                 │  │                      │  │
│  │ [Temperature chart - SVG]       │  │                      │  │
│  │                                 │  │                      │  │
│  └─────────────────────────────────┘  └──────────────────────┘  │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│ Evidence Inspector Section (collapsed/expandable)               │
├──────────────────────────────────────────────────────────────────┤
│ Observation Table                                                │
├──────────────────────────────────────────────────────────────────┤
│ Method and Limitations                                           │
├──────────────────────────────────────────────────────────────────┤
│ FOOTER (AppShell)                                                │
└──────────────────────────────────────────────────────────────────┘
```

### Mobile (375px) Structure

```
┌────────────────────────────┐
│ HEADER (AppShell)          │
├────────────────────────────┤
│ Controls: [Time selector]  │
│           [Refresh button] │
│ [Cache status]             │
├────────────────────────────┤
│ INSTRUMENT (Dark)          │
│                            │
│ Water temperature          │
│ Latest: XX.X °C            │
│ [Stats - stacked]          │
│                            │
│ [Chart - full width]       │
│                            │
├────────────────────────────┤
│ Coverage Panel             │
│ [Details - stacked]        │
│ [Links]                    │
│                            │
├────────────────────────────┤
│ Evidence Inspector         │
│ [Expandable sections]      │
│                            │
├────────────────────────────┤
│ Observation Table          │
│ [Scrollable, stacked]      │
│                            │
├────────────────────────────┤
│ Method and Limitations     │
├────────────────────────────┤
│ FOOTER (AppShell)          │
└────────────────────────────┘
```

---

## Color Palette Analysis

### Current Signals Module Colors
- **Backgrounds:** Dark navy (#14262b for instrument, #f4f7f6 for panels)
- **Text:** Light gray (#f7fafa on dark, #15282d on light)
- **Accents:** Teal (#005e68 primary, #8fe0dc signal line), Amber (#7c4519 for warnings)
- **Chart:** Teal line with light axis ticks, hatched grid for missing data

### STRATA-015 System Integration
- **Semantic:** `--strata-bg` (#07131A), `--strata-surface` (#0D2029), `--strata-text` (#EAF5F3)
- **Action:** `--strata-action` (#55D6C2 — calibrated teal), `--strata-action-hover` (#83E4D5)
- **Status:** `--strata-warning` (#E8B778 — restrained amber)
- **Evidence:** Observed (#B7DED3), Modeled (#ABCCE4), Synthetic (#D0BDE8), Unresolved (#E8B778)

**Observation:** Current signals uses a subset of the full palette; recoloring should align with STRATA-015 semantic system while maintaining instrument contrast.

---

## Typography Analysis

### Current Signals Type Hierarchy
- **H1 (Page):** `clamp(2rem, 4vw, 3.25rem)` — "NOAA Signals Lab"
- **H2 (Section):** `clamp(1.2rem, 2.4vw, 1.55rem)` — "Water temperature", "Coverage"
- **Data readout:** `clamp(2rem, 5vw, 3.75rem)` semibold — Latest temperature value
- **Labels:** .875–1rem, font-weight 650
- **Body/metadata:** .82–.89rem, gray

### STRATA-015 Alignment
- Font family: system fonts (no bundled fonts in current build)
- Numeric data: `font-variant-numeric: tabular-nums` ✓ (implemented)
- Hierarchy: Clear but could emphasize "latest observed" value more prominently on mobile

---

## Interaction and Accessibility Audit

### Time Window Selection
✅ **Strengths:**
- Select dropdown with 1–72 hour options
- Clear label: "Observation window"
- Button clearly labeled: "Refresh data" or "Apply window"
- Form submission prevents invalid state

⚠️ **Gaps:**
- No visual feedback while loading (spinner/skeleton)
- No clear affordance for real-time vs. cached state
- Keyboard navigation works but no focus trap; focus not managed after refresh

### Chart Interaction
✅ **Strengths:**
- SVG with accessible title/desc elements
- Clear axis labels and grid
- Gap visualization (hatched pattern)
- Contiguous segments rendered as polylines

⚠️ **Gaps:**
- No hover/click interaction on individual data points
- Cannot select a single observation to inspect details
- Touch targets on points are small (2px circles)
- No linked selection between chart and table

### Evidence Inspector
✅ **Strengths:**
- Native `<details>/<summary>` for progressive disclosure
- Clear categorization (missing hours, excluded rows, quality issues)
- Accessible keyboard navigation

⚠️ **Gaps:**
- Not visually linked to chart selection
- Cannot highlight a specific hour or row from inspector
- Requires scrolling on mobile to relate table row to gap details

### Observation Table
✅ **Strengths:**
- Semantic `<table>` with proper `<thead>`, `<tbody>`, `<th scope>`
- Timestamps in `<time>` elements
- Scrollable viewport on narrow screens
- Quality flags preserved and labeled

⚠️ **Gaps:**
- No row highlighting or selection state
- Cannot click a row to highlight on chart
- Comparison with excluded rows requires flipping back to inspector

### Accessibility Assessment (WCAG 2.2 AA)
✅ **Pass:**
- Color contrast: All text meets 4.5:1 on dark, 3:1 on light
- Touch targets: Controls are ≥44px
- Keyboard navigation: All interactive elements in tab order
- Focus indication: 3px blue outline, visible
- Screen reader: Semantic landmarks, proper heading hierarchy, table structure intact
- Responsive: Reflows cleanly to mobile without horizontal scroll

⚠️ **Review Items:**
- Chart selection state needs aria-current or aria-selected on points
- Table rows should respond to keyboard focus (space/enter to select)
- No keyboard shortcut for quick observation selection (tab through 24–72 rows is tedious)
- Reduced motion: No motion prefs detected; should verify on actual devices

---

## Responsive Behavior Analysis

### Breakpoint Transitions
- **320–374px:** Single column; chart full width; stats stack vertically; text scales well
- **375–648px:** Still single column; better side margins; chart readable
- **649–767px:** Considers two-column but falls back gracefully
- **768–1023px:** Grid tries two columns; side panel narrows but legible
- **1024–1439px:** Dashboard grid active; optimal proportions
- **1440px+:** Max-width constraint (82rem); balanced two-column layout

### CSS Grid Behavior
```css
.dashboard {
  display: grid;
  grid-template-columns: minmax(0, 2.25fr) minmax(15.5rem, 1fr);
  gap: 1rem;
}
```

**Analysis:** Grid switches to single column gracefully below ~800px, but transition point is implicit (via minmax behavior) rather than explicit media query. Clear at 768px breakpoint.

---

## Performance and Bundle Footprint

✅ **Current metrics:**
- Main instrument component: ~200 LOC
- Chart component: ~100 LOC (pure SVG, no D3/deck.gl)
- CSS module: ~400 LOC (no external dependencies)
- No animated transitions (immediate state changes)
- Font: System fonts only

---

## Design Gaps and Listening Station Opportunities

### 1. Observation-Centric Navigation (Not Yet Implemented)
- **Current:** Read-only display of latest and stats
- **Needed:** Ability to select a specific hour and inspect its quality, raw value, any exclusions
- **Listening metaphor:** "Tuning" to a specific frequency (timestamp) to inspect the signal (value)

### 2. Source and Quality Disclosure (Partial)
- **Current:** Quality flags shown in table; evidence gaps in separate section
- **Needed:** Visual link between a selected observation and its quality metadata
- **Example:** Click a chart point → highlight the row in table AND expand evidence details for that hour

### 3. Visual Distinction of Evidence States
- **Current:** All accepted observations rendered identically
- **Needed:** Subtle visual treatment for:
  - Observations with quality flags (but still accepted)
  - Observations at the edge of a gap
  - Modeled vs. observed (if applicable in future)

### 4. Mobile Inspector Behavior
- **Current:** Everything stacks; evidence inspector is collapsed
- **Needed:** Persistent but compact inspector on desktop; bottom-sheet or slide-in inspector on mobile that doesn't obscure the chart when inspecting

### 5. Real-Time Awareness and Refresh Feedback
- **Current:** "Refresh data" button; cache policy explained in prose; "Stale response" badge
- **Needed:** More visceral feedback:
  - Visible indication of when cache will refresh (countdown or next check time)
  - Brief loading state (spinner or skeleton) while fetching
  - Success/error animation or toast

### 6. Chart Interaction and Touch Accessibility
- **Current:** Read-only SVG; no hover/click behavior
- **Needed:** 
  - Tap/click a point to select and inspect
  - Keyboard navigation through points (arrow keys)
  - Touch-friendly hit targets (larger than 2px circles)

---

## Listening Station Design Direction

### Visual Metaphor: Active Signal Monitoring
The "Listening Station" concept should evoke:
- **Observatory:** Precise, calibrated instruments; restrained aesthetic
- **Active tuning:** Real-time awareness of signal presence/quality
- **Detection moment:** Highlighting a specific observation reveals its full context
- **Source transparency:** Clear attribution and quality metadata always accessible

### Color Direction
- **Deep marine navy** background (aligns with STRATA-015 `--strata-bg` / `--strata-surface`)
- **Calibrated teal/cyan** for primary actions and signal traces (`--strata-action`)
- **Restrained amber** for warnings and stale/attention states (`--strata-warning`)
- Avoid: Bright accents, unnecessary decoration, fake hardware UI

### Typography Emphasis
- **Latest value:** Very prominent, possibly animated entry when new data arrives
- **Selected observation:** Highlighted in table and chart simultaneously
- **Source metadata:** Always present, never hidden; smaller but clear

### Interactive Feedback
- **Selection state:** Distinct visual treatment (outline, background, emphasis line)
- **Hover/focus:** Subtle shadow or accent color shift; no decorative pulsing
- **State changes:** Immediate; no tweening of numeric values
- **Reduced motion:** Respect prefers-reduced-motion; use static states only

---

## Next Steps: Concept Development

**Concept A — Panoramic Signal Observatory**
- Large, prominent temperature trace
- Observation-centric navigation (click to select)
- Integrated source and quality inspector below chart
- Strong visual emphasis on selected measurement
- Desktop and mobile mockups at 1440px and 375px

**Concept B — Coastal Monitoring Array**
- Instrument-style readout layout (gauge-like presentation)
- Coordinated multi-panel coverage view
- Compact but detailed source/quality modules
- Strong operational hierarchy (what matters first: time window → signal quality → specific value)
- Desktop and mobile mockups at 1440px and 375px

Both concepts must:
- Use STRATA-015 tokens and components
- Support keyboard and touch navigation
- Handle loading, stale, error, empty, and partial states
- Preserve all scientific data and attribution
- Be responsive and accessible (WCAG 2.2 AA)

---

## Summary of Findings

| Category | Current Strength | Current Gap | Priority |
| --- | --- | --- | --- |
| **Layout & Hierarchy** | Clear grid on desktop; responsive foundation | No explicit observation selection | High |
| **Color & Typography** | Good contrast; readable hierarchy | Underutilizes calibrated teal accent | Medium |
| **Interaction** | Accessible form controls; native table | No linked selection/highlighting | High |
| **Accessibility** | Semantic HTML; keyboard-navigable | Needs aria-states for selection | Medium |
| **Performance** | Lightweight; no external deps | None identified | Low |
| **Scientific Integrity** | Preserves all data and attribution | Requires improvement in mobile inspector | Low |

---

**Design audit complete. Ready for Concept A and B development.**
