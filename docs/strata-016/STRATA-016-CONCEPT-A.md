# STRATA-016 — Concept A: Panoramic Signal Observatory

**Visual Direction:** A large, immersive display of the temperature signal with the selected observation as the focal point. Strong emphasis on the measurement itself; integrated quality and source disclosure below the chart.

**Metaphor:** An observatory where you're "listening" to a signal by tuning to a specific moment in time and inspecting its full context in real time.

---

## Design Principles

1. **Signal-First:** The temperature trace dominates the viewport; every other element supports inspection of that trace
2. **Observation-Centric:** Clicking or focusing a data point is the primary interaction; the inspector updates to show that observation's full story
3. **Transparency Throughout:** Quality flags, source metadata, and evidence gaps are visible at all times; no hidden layers
4. **Measured Hierarchy:** Latest temperature value is visually prominent but not overwhelming; supporting data is accessible but quiet

---

## Desktop (1440px) Mockup

```
┌────────────────────────────────────────────────────────────────────────┐
│ STRATA Builds — NOAA Signals Lab                                       │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ Water temperature · Providence, RI · NOAA hourly observations  │  │
│  │                                                                │  │
│  │  Observation window: [24 hours ▾]  [Refresh data]             │  │
│  │  Complete ✓ 2 min ago · Next cache check: 15:28 UTC           │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ PANORAMIC CHART PANEL (Dark background)                       │  │
│  │                                                                │  │
│  │  Instrument readout area (top of chart section):              │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │ Latest:  15.3 °C                                        │ │  │
│  │  │          06 Nov 15:00 UTC                               │ │  │
│  │  │                                                          │ │  │
│  │  │  Window: 06 Nov 00:00 → 06 Nov 23:59 UTC (24 hrs)      │ │  │
│  │  │  Coverage: 23/24 hours accepted                         │ │  │
│  │  │  Statistics: Min 12.1 · Max 18.2 · Mean 15.4 · Count 23│ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │                                                                │  │
│  │  Chart (large, with interactive points):                      │  │
│  │  ┌──────────────────────────────────────────────────────────┐ │  │
│  │  │  18.2°C  ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄    │ │  │
│  │  │          ◦─────◦─────◦─────◦─────⊕─────◦──────         │ │  │
│  │  │  15.4°C  ┄─────────────────────────────────────┄         │ │  │
│  │  │          ◦─────◦─────◦─────◦─────◦─────◦──────         │ │  │
│  │  │  12.1°C  ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄    │ │  │
│  │  │          00:00  06:00  12:00  18:00  00:00             │ │  │
│  │  │          [⊕ = selected point, with ring]               │ │  │
│  │  │          [░░ = gap intervals without data]             │ │  │
│  │  │          [◦ = other observations]                      │ │  │
│  │  └──────────────────────────────────────────────────────────┘ │  │
│  │                                                                │  │
│  │  Chart caption and interaction hint:                          │  │
│  │  "23 observations | Gaps: 1 hour | Quality: 2 with flags"    │  │
│  │  "Click a point to inspect quality and evidence" (desktop)   │  │
│  │  "Tap a point to inspect" (mobile)                           │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ SELECTED OBSERVATION INSPECTOR (auto-appears below chart)     │  │
│  │                                                                │  │
│  │ ┌──────────────────────────────────────────────────────────┐  │  │
│  │ │ Selected: 06 Nov 15:00 UTC                              │  │  │
│  │ │                                                          │  │  │
│  │ │ Value: 15.3 °C                                          │  │  │
│  │ │ Raw: 15.32  |  Quality: None                            │  │  │
│  │ │ Evidence: Observed (confirmed in source)                │  │  │
│  │ │                                                          │  │  │
│  │ │ [Open NOAA source response] [Station metadata]          │  │  │
│  │ └──────────────────────────────────────────────────────────┘  │  │
│  │                                                                │  │
│  │ ▼ Quality flags and evidence (auto-expanded if relevant)      │  │
│  │   This observation was accepted with no quality concerns.     │  │
│  │   NOAA flags: f=None, q=None                                  │  │
│  │                                                                │  │
│  │ ▼ Coverage analysis around this hour                          │  │
│  │   06 Nov 14:00 ✓ 15.1 °C (accepted, no flags)               │  │
│  │   06 Nov 15:00 ⊕ 15.3 °C (selected)                         │  │
│  │   06 Nov 16:00 ✓ 14.9 °C (accepted, f flag)                 │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ EVIDENCE GAPS (Expanded, with auto-highlighted section)       │  │
│  │                                                                │  │
│  │ ▼ Expected hours without an accepted value (1)                │  │
│  │   • 06 Nov 11:00 — No matching row (see source)              │  │
│  │     What we know: 0 rows returned for this hour              │  │
│  │     What to check: Outage? Data not yet published?           │  │
│  │                                                                │  │
│  │ ▼ Quality flags to review (2)                                 │  │
│  │   • 06 Nov 16:00 — f:1,0 ★                                   │  │
│  │     Consult NOAA schema for f flag meanings                   │  │
│  │   • 06 Nov 19:30 — q:Q (quality uncertain)                   │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ OBSERVATION TABLE (Scrollable, with row selection)            │  │
│  │                                                                │  │
│  │ ┌─────────────────┬────────┬────────┬─────────────────────┐  │  │
│  │ │ Observed (UTC)  │ Temp   │ Raw    │ Quality flags       │  │  │
│  │ ├─────────────────┼────────┼────────┼─────────────────────┤  │  │
│  │ │ 06 Nov 00:00    │ 14.2   │ 14.18  │ None                │  │  │
│  │ │ 06 Nov 01:00    │ 14.0   │ 14.02  │ None                │  │  │
│  │ │ ...                                                      │  │  │
│  │ │ 06 Nov 15:00    │ 15.3   │ 15.32  │ None           [🟦] │  │  │
│  │ │                                   (← Selected row)      │  │  │
│  │ │ 06 Nov 16:00    │ 14.9   │ 14.88  │ f:1,0               │  │  │
│  │ │ ...                                                      │  │  │
│  │ └─────────────────┴────────┴────────┴─────────────────────┘  │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ METHODS AND LIMITATIONS                                       │  │
│  │ [Standard text about UTC time, validation, source...]         │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ FOOTER                                                                 │
└────────────────────────────────────────────────────────────────────────┘
```

**Key visual features (desktop):**
- Large chart dominates; selection point highlighted with teal ring
- Latest temperature readout and stats integrated above chart
- Selected observation inspector panel appears directly below chart with auto-expanded quality sections
- Full observation table maintains access to all data for reference
- Color palette: deep navy background (#07131A), teal accents (#55D6C2), amber warnings (#E8B778)
- Two-column layout is implicit; chart section spans full width, inspector below

---

## Mobile (375px) Mockup

```
┌──────────────────────────────┐
│ STRATA Builds                │
│ NOAA Signals Lab             │
├──────────────────────────────┤
│ Water temperature            │
│ Providence, RI               │
│                              │
│ [24 hours ▾] [Refresh]       │
│ Complete ✓ 2 min ago         │
│                              │
├──────────────────────────────┤
│                              │
│ Chart section (tall):        │
│ Latest: 15.3 °C              │
│         06 Nov 15:00 UTC     │
│                              │
│ ┌──────────────────────────┐ │
│ │  18.2°C  ┄ ┄ ┄ ┄ ┄ ┄    │ │
│ │          ◦ ◦ ◦ ⊕ ◦ ◦   │ │
│ │  15.4°C  ┄─────────────┄ │ │
│ │          ◦ ◦ ◦ ◦ ◦ ◦   │ │
│ │  12.1°C  ┄ ┄ ┄ ┄ ┄ ┄    │ │
│ │                          │ │
│ │  00:00    12:00    00:00 │ │
│ │                          │ │
│ │ 23 obs | 1 gap | 2 flags │ │
│ │                          │ │
│ │ "Tap a point to inspect" │ │
│ └──────────────────────────┘ │
│                              │
│ Stats:                       │
│ Min: 12.1 °C                 │
│ Max: 18.2 °C                 │
│ Mean: 15.4 °C                │
│ Count: 23                    │
│                              │
├──────────────────────────────┤
│                              │
│ INSPECTOR PANEL              │
│ (Stacked, auto-scroll):      │
│                              │
│ Selected: 06 Nov 15:00 UTC   │
│                              │
│ Value: 15.3 °C               │
│ Raw: 15.32  |  Qual: None    │
│ Evidence: Observed           │
│                              │
│ [🔗 NOAA source]             │
│ [🔗 Station]                 │
│                              │
├──────────────────────────────┤
│                              │
│ ▼ Quality & Evidence         │
│   Accepted with no flags     │
│   NOAA f=None, q=None        │
│                              │
├──────────────────────────────┤
│                              │
│ OBSERVATION TABLE            │
│ (Scrollable vertical):       │
│                              │
│ Time      │ Temp │ Quality  │
│ ──────────┼──────┼──────────│
│ 00:00     │ 14.2 │ None     │
│ 01:00     │ 14.0 │ None     │
│ ...       │      │          │
│ 15:00 [🟦]│ 15.3 │ None     │
│ ← Selected                   │
│ 16:00     │ 14.9 │ f:1,0    │
│ ...       │      │          │
│                              │
├──────────────────────────────┤
│                              │
│ ▼ EVIDENCE GAPS              │
│   • 11:00 — No data          │
│     What we know: 0 rows     │
│   • 16:00 quality flag       │
│                              │
├──────────────────────────────┤
│ METHODS & LIMITATIONS        │
│ [Standard text]              │
├──────────────────────────────┤
│ FOOTER                       │
└──────────────────────────────┘
```

**Key visual features (mobile):**
- Chart takes ~40% of initial viewport (tappable, responsive height)
- Stats and latest readout stacked above/within chart
- Selected observation inspector auto-scrolls into view on tap
- Table stacked below, with row selection highlight
- Full-width layout; no side panels
- Smooth scroll to inspector on selection (respecting prefers-reduced-motion)

---

## Responsive Transitions (Concept A)

### Breakpoint Behavior

**320px (Small phone):**
- Chart: `clamp(9rem, 25vw, 14rem)` height
- Stats grid: `grid-template-columns: 1fr 1fr` (2 columns)
- Inspector: Stacked below chart
- Table: Scrollable, narrow column widths
- Touch targets: 44px minimum

**375px (Standard phone) — DESIGN TARGET:**
- Chart: `clamp(9rem, 25vw, 14rem)` height
- Stats grid: `grid-template-columns: 1fr 1fr` (2 columns, stacked)
- Inspector: Stacked, auto-scroll on selection
- Table: Scrollable, responsive columns
- Full readability without horizontal scroll

**768px (Tablet portrait):**
- Chart: `clamp(9rem, 30vw, 14rem)` height
- Considers side-by-side: chart + stats panel? (or stays stacked)
- Inspector: Stacked below chart
- Table: Full width with better column sizing
- Might introduce secondary panel if space allows

**1024px (Tablet landscape / Desktop compact):**
- Chart: `clamp(9rem, 35vw, 14rem)` height
- Could introduce **persistent desktop inspector** as side panel? Or keep below?
- Concept A keeps vertical flow; consider variant for side inspector
- Table: Full-width, improved line length

**1440px (Desktop full) — DESIGN TARGET:**
- Chart: `clamp(9rem, 19vw, 14rem)` height
- Two-column layout option: chart/inspector main area | side info panel
- Or: Full-width stacked (chart → inspector → table → evidence)
- Table: Optimal column widths, no truncation

**Current plan:** Concept A maintains vertical stacking throughout; strong emphasis on the signal trace. If side inspector desired at desktop, would be variant or Concept B territory.

---

## Interaction Patterns (Concept A)

### Selection Flow

```
User clicks/taps chart point
  ↓
Point highlights with teal ring (immediate)
  ↓
Inspector section auto-expands relevant details
  ↓
Page scrolls to inspector (smooth on desktop, instant on mobile)
  ↓
Screen reader announces: "Selected: 15.3°C at 15:00 UTC"
  ↓
User can click table row to switch selection
  ↓
OR press Escape to deselect
```

### Keyboard Navigation

- **Tab:** Form → Chart (or first point) → Table → Evidence → Links
- **Arrow Up/Down (in table):** Navigate rows; updates selection
- **Arrow Left/Right (on chart):** Move through observations in time
- **Space/Enter (on point or row):** Select/deselect
- **Escape:** Deselect all; focus returns to previous control

---

## Color Palette Specifications (Concept A)

| Element | Color | CSS Variable | Usage |
| --- | --- | --- | --- |
| **Background** | #07131A | `--strata-bg` | Full page canvas |
| **Surface** | #0D2029 | `--strata-surface` | Chart container, panels |
| **Chart trace** | #55D6C2 | `--strata-action` | Temperature line, points |
| **Selection ring** | #55D6C2 | `--strata-action` | 2–3px stroke on selected point |
| **Text primary** | #EAF5F3 | `--strata-text` | Labels, stats |
| **Text secondary** | #9DB5BD | `--strata-text-subdued` | Metadata, timestamps |
| **Status success** | #9ED9B0 | `--strata-success` | ✓ indicators |
| **Status warning** | #E8B778 | `--strata-warning` | Stale badge, attention |
| **Border** | #405B65 | `--strata-border` | Dividers |
| **Gap pattern** | #A79C7D | (custom) | Hatched pattern for missing data |

**Typography:**
- **Display (h1):** Source Sans 3 Semibold, `clamp(2rem, 5vw, 3.25rem)`
- **Heading (h2):** Source Sans 3 Semibold, `clamp(1.2rem, 2.4vw, 1.55rem)`
- **Value (readout):** Monospace, `clamp(2rem, 5vw, 3.75rem)`, semibold
- **Label:** Source Sans 3 500, 0.875–1rem
- **Body:** Source Sans 3 Regular, 1–1.125rem, line-height 1.55–1.65

---

## Accessibility Specifications (Concept A)

**WCAG 2.2 AA Compliance:**
- Color contrast: ≥4.5:1 all text on dark backgrounds
- Touch targets: ≥44px height/width (chart points expanded hit area)
- Keyboard navigation: Full tab order and arrow key support
- Focus indication: 3px solid ring, 3px offset, visible at all zoom levels
- Screen reader: Semantic landmarks, proper heading hierarchy, ARIA current/selected states
- Reduced motion: No animations; immediate state changes; prefers-reduced-motion respected
- Zoom: Content remains usable at 200% and 400% magnification

**ARIA annotations:**
```tsx
<svg aria-label="Water temperature trace, 24 hours" aria-describedby="chart-desc">
  <circle aria-current="true" data-observation="2024-11-06T15:00:00Z" />
</svg>

<section aria-live="polite" aria-atomic="true">
  Selected: 15.3°C at 06 Nov 15:00 UTC
</section>

<tr aria-selected={isSelected}>
  ...
</tr>
```

---

## Component and CSS Strategy (Concept A)

**New components (if implemented):**
- `SelectionInspector.tsx` — Selected observation details, auto-expands relevant sections
- `SourceBadge.tsx` — Compact source disclosure for selected observation
- `ChartCaption.tsx` — Interactive legend and instruction text

**CSS modifications:**
- Extend `signals.module.css` with:
  - `.pointSelected` — ring styling for highlighted chart point
  - `.rowSelected` — background and border for selected table row
  - `.inspectorAutoExpanded` — responsive sizing for inspector sections
  - `@media (prefers-reduced-motion)` — remove any transitions

**Shared components reused:**
- `AppShell`, `PageHeader`, `Button` (from STRATA-015)
- `SourceDisclosure` for NOAA links and station metadata
- `ScientificPanel` for grouped data display

**No new dependencies:**
- Keep SVG rendering (no D3, Recharts, etc.)
- Keep CSS Grid/Flexbox for layout
- Use native HTML details/summary for evidence disclosure

---

## Performance Specifications (Concept A)

- **Initial page load:** <3s at 4G (no new large dependencies)
- **Selection interaction:** <100ms highlight update (immediate, no animation)
- **Inspector auto-expand:** <300ms scroll-into-view (smooth on desktop, instant on mobile)
- **Chart re-render:** <100ms on point selection (SVG class change, no recalculation)
- **Bundle impact:** +5–8KB (new selection state, component CSS)

**Optimizations:**
- Chart SVG reuses existing 720×224 viewBox (no resize on selection)
- Selection state is client-only (no refetch)
- Inspector sections use native `<details>` (browser-optimized)

---

## Deliverables Summary (Concept A)

| Artifact | Format | Purpose |
| --- | --- | --- |
| This document | Markdown | Visual direction, mockups, specifications |
| Component hierarchy | ASCII + code hints | Integration points and CSS |
| State diagrams | Mermaid (see diagrams doc) | Selection flow, responsive transitions |
| Accessibility notes | Markdown + ARIA snippets | WCAG 2.2 AA compliance checklist |
| Performance budget | Table | Load times, interaction response |

---

**Concept A complete. Proceeding to Concept B: Coastal Monitoring Array.**
