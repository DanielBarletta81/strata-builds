# STRATA-016 — Concept B: Coastal Monitoring Array

**Visual Direction:** An instrument-style dashboard where multiple coordinated panels work together to present a monitoring operation. Emphasizes clarity and operational hierarchy: time window → signal quality → specific measurements.

**Metaphor:** A coastal monitoring station with dedicated readout panels (time window, coverage status, latest temperature, detailed data) arranged for quick operational scanning and decision-making.

---

## Design Principles

1. **Operational Hierarchy:** What matters first (time window) → What we're checking (signal quality) → What we found (specific values)
2. **Coordinated Readouts:** Each panel is self-contained and scannable; no data hidden in collapsed sections by default
3. **Compact Efficiency:** Dense but readable; no wasted space; every element serves a function
4. **Instrument Aesthetic:** Clean grid, clear labels, monospace-where-appropriate data, restrained color (no fake hardware UI)
5. **Quality Transparency:** Evidence gaps and quality flags visible at a glance; not buried in inspector

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
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  OPERATION GRID (Four-panel layout):                                   │
│                                                                        │
│  ┌────────────────────────────┐  ┌──────────────────────────────┐  │
│  │ WINDOW PANEL               │  │ COVERAGE PANEL               │  │
│  ├────────────────────────────┤  ├──────────────────────────────┤  │
│  │ Observation window         │  │ Signal quality               │  │
│  │                            │  │                              │  │
│  │ [24 hours ▾] [Refresh]     │  │ 23/24 hours accepted ✓       │  │
│  │                            │  │                              │  │
│  │ Cache status:              │  │ 1 gap · 2 flags             │  │
│  │ Complete ✓                 │  │                              │  │
│  │ 2 min ago                  │  │ Next check: 15:28 UTC        │  │
│  │                            │  │ Reuse slot: ◇ ◇ ◇           │  │
│  │ NOAA API: OK ✓             │  │ 12 min remaining             │  │
│  │ Cache: Hit                 │  │                              │  │
│  │                            │  │ [View gaps] [Download CSV]   │  │
│  └────────────────────────────┘  └──────────────────────────────┘  │
│                                                                        │
│  ┌────────────────────────────┐  ┌──────────────────────────────┐  │
│  │ LATEST TEMPERATURE PANEL   │  │ QUICK STATS                  │  │
│  ├────────────────────────────┤  ├──────────────────────────────┤  │
│  │ Current reading:           │  │ Window: 06 Nov 00:00 → 23:59│  │
│  │                            │  │ Retrieved: 06 Nov 15:02 UTC │  │
│  │        15.3 °C              │  │                              │  │
│  │                            │  │ Latest:    15.3 °C (15:00)   │  │
│  │  06 Nov 15:00 UTC           │  │ Minimum:   12.1 °C (04:30)   │  │
│  │                            │  │ Maximum:   18.2 °C (09:15)   │  │
│  │  Quality: None ✓           │  │ Mean:      15.4 °C           │  │
│  │  Evidence: Observed        │  │ Count:     23 observations   │  │
│  │                            │  │                              │  │
│  │  NOAA f flags: None        │  │ Quality:                     │  │
│  │  NOAA q flags: None        │  │  With flags: 2               │  │
│  │                            │  │  Clean:      21              │  │
│  │  [Station metadata] [Raw]  │  │                              │  │
│  │                            │  │                              │  │
│  └────────────────────────────┘  └──────────────────────────────┘  │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ PANORAMIC CHART PANEL                                          │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │                                                                │  │
│  │  ┌────────────────────────────────────────────────────────┐   │  │
│  │  │  18.2°C  ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄    │   │  │
│  │  │          ◦─────◦─────◦─────◦─────○─────◦──────         │   │  │
│  │  │  15.4°C  ┄─────────────────────────────────────┄         │   │  │
│  │  │          ◦─────◦─────◦─────◦─────◦─────◦──────         │   │  │
│  │  │  12.1°C  ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄ ┄    │   │  │
│  │  │          00:00  06:00  12:00  18:00  00:00             │   │  │
│  │  │          [◦ = observation] [○ = selectable]            │   │  │
│  │  │          [░░ = gap intervals]                          │   │  │
│  │  └────────────────────────────────────────────────────────┘   │  │
│  │                                                                │  │
│  │  Chart legend and interactions:                               │  │
│  │  ◆ Observed data  ◆ Quality flag  ◆ Missing interval         │  │
│  │  Click points to compare or export; shift-click for range    │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ EVIDENCE AND QUALITY DETAIL                                   │  │
│  ├────────────────────────────────────────────────────────────────┤  │
│  │                                                                │  │
│  │ ▶ Expected hours without an accepted value (1)                │  │
│  │   • 06 Nov 11:00 — No matching row in NOAA response           │  │
│  │     Apparent: Yes  |  Confidence: High                        │  │
│  │     What to check: NOAA station schedule, outage history      │  │
│  │                                                                │  │
│  │ ▶ Accepted with quality flags (2)                             │  │
│  │   • 06 Nov 16:00 — f:1,0 (consult NOAA schema)               │  │
│  │   • 06 Nov 19:30 — q:Q (quality uncertain)                   │  │
│  │                                                                │  │
│  │ ▶ Excluded raw rows (8)                                       │  │
│  │   • Row 42: Malformed timestamp                               │  │
│  │   • Row 51: Off-hour by 15 minutes                            │  │
│  │   • [Show all 8]                                              │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ OBSERVATION TABLE (Scrollable, with integrated actions)       │  │
│  │                                                                │  │
│  │ ┌─────────────────┬────────┬────────┬─────────────────────┐  │  │
│  │ │ Time (UTC)      │ Temp   │ Raw    │ Quality flags       │  │  │
│  │ ├─────────────────┼────────┼────────┼─────────────────────┤  │  │
│  │ │ 06 Nov 00:00 ◆  │ 14.2   │ 14.18  │ ✓ None              │  │  │
│  │ │ 06 Nov 01:00 ◆  │ 14.0   │ 14.02  │ ✓ None              │  │  │
│  │ │ ... [rows]      │        │        │                     │  │  │
│  │ │ 06 Nov 11:00 ✗  │ —      │ —      │ ✗ No data           │  │  │
│  │ │ ... [rows]      │        │        │                     │  │  │
│  │ │ 06 Nov 15:00 ◆  │ 15.3   │ 15.32  │ ✓ None              │  │  │
│  │ │ 06 Nov 16:00 ◆  │ 14.9   │ 14.88  │ ⚠ f:1,0             │  │  │
│  │ │ ...                                                      │  │  │
│  │ └─────────────────┴────────┴────────┴─────────────────────┘  │  │
│  │ [Download this window as CSV] [Permalink]                    │  │
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
- Four-panel "operation grid" at top: Window, Coverage, Latest Temp, Quick Stats
- Each panel is self-contained and scannable; no nested disclosure required
- Chart spans below panels, showing full-window trace
- Evidence and quality detail below chart (always expanded, not hidden)
- Observation table shows all data with inline quality indicators
- Color palette same as Concept A, but layout emphasizes operational flow

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
├──────────────────────────────┤
│                              │
│ WINDOW PANEL                 │
│ ┌──────────────────────────┐ │
│ │ [24 hours ▾]             │ │
│ │ [Refresh data]           │ │
│ │                          │ │
│ │ Status: Complete ✓       │ │
│ │ 2 min ago · Hit cache    │ │
│ │                          │ │
│ │ Next check: 15:28 UTC    │ │
│ │ 12 min remaining         │ │
│ └──────────────────────────┘ │
│                              │
│ COVERAGE PANEL               │
│ ┌──────────────────────────┐ │
│ │ 23/24 hours accepted ✓   │ │
│ │                          │ │
│ │ 1 gap · 2 quality flags  │ │
│ │                          │ │
│ │ [View gaps]              │ │
│ └──────────────────────────┘ │
│                              │
│ LATEST TEMP                  │
│ ┌──────────────────────────┐ │
│ │ 15.3 °C                  │ │
│ │ 06 Nov 15:00 UTC         │ │
│ │                          │ │
│ │ Quality: ✓ None          │ │
│ │ Evidence: Observed       │ │
│ │                          │ │
│ │ NOAA flags:              │ │
│ │ f: None  |  q: None      │ │
│ │                          │ │
│ │ [Station metadata]       │ │
│ │ [Raw value]              │ │
│ └──────────────────────────┘ │
│                              │
│ QUICK STATS                  │
│ ┌──────────────────────────┐ │
│ │ Latest:   15.3 °C        │ │
│ │ Min:      12.1 °C        │ │
│ │ Max:      18.2 °C        │ │
│ │ Mean:     15.4 °C        │ │
│ │ Count:    23             │ │
│ │                          │ │
│ │ Retrieved:               │ │
│ │ 06 Nov 15:02 UTC         │ │
│ │                          │ │
│ │ [Download CSV]           │ │
│ └──────────────────────────┘ │
│                              │
├──────────────────────────────┤
│                              │
│ CHART                        │
│ ┌──────────────────────────┐ │
│ │  18.2°C  ┄ ┄ ┄ ┄ ┄ ┄    │ │
│ │          ◦ ◦ ◦ ◦ ◦ ◦   │ │
│ │  15.4°C  ┄─────────────┄ │ │
│ │          ◦ ◦ ◦ ◦ ◦ ◦   │ │
│ │  12.1°C  ┄ ┄ ┄ ┄ ┄ ┄    │ │
│ │                          │ │
│ │  00:00    12:00    00:00 │ │
│ │                          │ │
│ │ 23 obs | 1 gap | 2 flags │ │
│ │ [Click points to inspect]│ │
│ └──────────────────────────┘ │
│                              │
├──────────────────────────────┤
│                              │
│ EVIDENCE & QUALITY           │
│ ┌──────────────────────────┐ │
│ │ ▼ Missing: 1 hour        │ │
│ │   • 11:00 — No data      │ │
│ │                          │ │
│ │ ▼ Quality flags: 2       │ │
│ │   • 16:00 — f:1,0        │ │
│ │   • 19:30 — q:Q          │ │
│ │                          │ │
│ │ ▼ Excluded: 8 rows       │ │
│ │   [Show all]             │ │
│ └──────────────────────────┘ │
│                              │
│ TABLE (scrollable)           │
│ ┌──────────────────────────┐ │
│ │ Time  │ Temp │ Quality  │ │
│ │ 00:00 │ 14.2 │ ✓        │ │
│ │ 01:00 │ 14.0 │ ✓        │ │
│ │ ...   │      │          │ │
│ │ 11:00 │  —   │ ✗ Gap    │ │
│ │ ...   │      │          │ │
│ │ 15:00 │ 15.3 │ ✓        │ │
│ │ 16:00 │ 14.9 │ ⚠ Flag   │ │
│ │ ...   │      │          │ │
│ └──────────────────────────┘ │
│ [Download CSV]               │
│                              │
├──────────────────────────────┤
│ METHODS & LIMITATIONS        │
│ [Standard text]              │
├──────────────────────────────┤
│ FOOTER                       │
└──────────────────────────────┘
```

**Key visual features (mobile):**
- Stacked panels: Window → Coverage → Latest Temp → Stats
- Each panel is complete (no disclosure needed to see key info)
- Chart below panels
- Evidence section with expandable subsections
- Full table with inline quality indicators
- Full-width, no side panels; vertical scrolling only

---

## Responsive Transitions (Concept B)

### Breakpoint Behavior

**320px (Small phone):**
- Four panels stack vertically, each ~100% width
- Chart: `clamp(9rem, 25vw, 14rem)` height
- Stats grid within panel: `grid-template-columns: 1fr 1fr`
- Evidence subsections: collapsed by default (expand on tap)
- Touch targets: 44px minimum

**375px (Standard phone) — DESIGN TARGET:**
- Four panels maintain stack
- Chart: `clamp(9rem, 25vw, 14rem)` height
- Evidence subsections expanded (always visible)
- Table: Scrollable, narrow but complete columns
- No horizontal scroll needed

**768px (Tablet portrait):**
- Consider 2×2 grid for panels? (Window | Coverage) / (Latest | Stats)
- Or maintain 1-column for clarity?
- Chart: Full width below panels
- Evidence: Expanded, full details visible
- Table: Optimal column widths

**1024px (Tablet landscape / Desktop compact):**
- 2×2 grid for panels (Window | Coverage) / (Latest | Stats)
- Each panel ~50% width, balanced
- Chart: Full width below
- Evidence: Expanded sections side-by-side (optional: 2 col)
- Table: Full-width, good readability

**1440px (Desktop full) — DESIGN TARGET:**
- 2×2 grid for panels (Window | Coverage) / (Latest | Stats)
- Panels sized for scanability; no cramping
- Chart: Spans full width, adequate height
- Evidence: Expandable subsections (or stay expanded for clarity)
- Table: Full-width with generous column sizing
- **Optional:** Evidence sidebar on right? (Concept B+ variant)

---

## Interaction Patterns (Concept B)

### Primary Scan Flow

```
1. Quick check: Look at top-left panel (Window status)
2. Health check: Look at top-right panel (Coverage)
3. Find latest: Look at bottom-left panel (Latest Temp value)
4. Statistics: Look at bottom-right panel (Min/Max/Mean)
5. Visual confirmation: Scan chart
6. Deep dive: Expand evidence sections or table
```

### Selection Behavior (Optional for Concept B)

Concept B does **not** emphasize point selection like Concept A. Instead:
- Chart is read-only, informational trace
- Table rows are clickable if needed, but not highlighted on chart
- Evidence section always expanded; no need to select to see gaps
- Less interactive; more "reporting dashboard" aesthetic

**Alternative:** Could add optional selection (chart point → expand relevant table row + evidence section) for users who want to inspect specific observations.

---

## Color Palette Specifications (Concept B)

Same as Concept A:

| Element | Color | CSS Variable | Usage |
| --- | --- | --- | --- |
| **Background** | #07131A | `--strata-bg` | Full page canvas |
| **Surface** | #0D2029 | `--strata-surface` | Panel backgrounds |
| **Chart trace** | #55D6C2 | `--strata-action` | Temperature line |
| **Text primary** | #EAF5F3 | `--strata-text` | Labels, values |
| **Text secondary** | #9DB5BD | `--strata-text-subdued` | Metadata, timestamps |
| **Status success** | #9ED9B0 | `--strata-success` | ✓ indicators |
| **Status warning** | #E8B778 | `--strata-warning` | ⚠ attention indicators |
| **Border** | #405B65 | `--strata-border` | Panel dividers |

**Panel dividers:**
- Light borders between panels (1px solid `--strata-border`)
- Separates visual "stations" in the monitoring array
- Creates implicit scanning rhythm

---

## Component and CSS Strategy (Concept B)

**New components (if implemented):**
- `OperationGrid.tsx` — Four-panel layout container (Window, Coverage, Latest, Stats)
- `WindowPanel.tsx` — Time window selection and status
- `CoveragePanel.tsx` — Signal quality and cache status
- `LatestTempPanel.tsx` — Current reading and quality metadata
- `StatsPanel.tsx` — Min/Max/Mean/Count and retrieve time
- `EvidenceDetail.tsx` — Always-expanded evidence sections

**CSS modifications:**
- Extend `signals.module.css` with:
  - `.operationGrid` — `grid-template-columns: 1fr 1fr` (desktop) or `1fr` (mobile)
  - `.panel` — unified panel styling with border and padding
  - `.panelStats` — grid for min/max/mean/count
  - `.statusIndicator` — compact status badges (✓, ✗, ⚠)
  - `@media (max-width: 768px)` — single-column stacking
  - `@media (min-width: 1024px)` — two-column grid
  - `@media (prefers-reduced-motion)` — no animations

**Shared components reused:**
- `AppShell`, `PageHeader`, `Button`, `SourceDisclosure` (from STRATA-015)
- `ScientificPanel` for grouped data display

**Typography adjustments:**
- Panel labels: `.875rem`, semibold (operational efficiency)
- Values: Monospace, slightly larger for scanability
- Evidence text: `.875rem`, readable line-height

---

## Accessibility Specifications (Concept B)

**WCAG 2.2 AA Compliance:**
- Same as Concept A: 4.5:1 contrast, 44px targets, full keyboard nav, focus visible, semantic HTML
- **Additional:** No disclosure/expansion needed for core data (evidence is expanded by default)
- **Benefit:** Faster access to all information; no "hidden" content behind collapsible sections

**ARIA annotations:**
```tsx
<div role="region" aria-label="Water temperature monitoring operation">
  <div role="region" aria-label="Observation window and cache status">
    {/* Window panel */}
  </div>
  <div role="region" aria-label="Coverage and signal quality">
    {/* Coverage panel */}
  </div>
  {/* etc. */}
</div>

<div aria-label="Evidence gaps and quality issues">
  <h3>Missing hours (1)</h3>
  {/* Always expanded; no details/summary needed */}
</div>
```

---

## Performance Specifications (Concept B)

- **Initial page load:** <3s at 4G (same as Concept A)
- **Panel rendering:** <100ms (four panels render in parallel)
- **Chart re-render:** <100ms on tab selection (if selection implemented)
- **Evidence section:** Expanded by default, no animated collapse/expand
- **Bundle impact:** +3–5KB (smaller than Concept A due to no selection state)

**Optimizations:**
- Four panels can be rendered independently (server or client)
- No complex state management (read-only dashboard aesthetic)
- CSS Grid for panel layout (native browser optimization)

---

## Responsiveness Matrix (Concept B)

| Breakpoint | Layout | Chart Height | Panel Grid | Evidence |
| --- | --- | --- | --- | --- |
| **320px** | 1 col | 25vw | 1 col | Expanded |
| **375px** | 1 col | 25vw | 1 col | Expanded |
| **768px** | 1 col or 2×2 | 30vw | 1 col or 2 col | Expanded |
| **1024px** | 2×2 | 35vw | 2×2 | Expanded |
| **1440px** | 2×2 | 19vw | 2×2 | Expanded |

---

## Concept B Tradeoffs

| Aspect | Benefit | Consideration |
| --- | --- | --- |
| **Operational layout** | Quick scanning; no disclosure needed | Less emphasis on deep inspection |
| **Expanded evidence** | All gaps visible immediately | Longer initial page; more scrolling on mobile |
| **No point selection** | Simpler interaction model | Can't compare two observations quickly |
| **Dense panels** | Efficient use of space | May feel cramped on mobile if text is long |
| **Always-on stats** | Quick reference; min/max at a glance | Duplicates chart information (by design) |

---

## Deliverables Summary (Concept B)

| Artifact | Format | Purpose |
| --- | --- | --- |
| This document | Markdown | Visual direction, mockups, specifications |
| Component hierarchy | ASCII + code hints | Panel breakdown, responsive grid |
| Panel breakdown | Diagram | Visual flow, operational scanning order |
| Accessibility notes | Markdown + ARIA snippets | WCAG 2.2 AA compliance (always-expanded advantage) |
| Performance budget | Table | Load times, panel rendering |

---

**Concept B complete. Next: comparative analysis and recommendations.**
