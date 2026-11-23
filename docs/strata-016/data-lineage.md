# STRATA-016: Data Lineage and Validation Pipeline

**Purpose:** Trace actual NOAA observations through the signals request, validation, coverage analysis, and visualization paths. Distinguish implemented behavior from proposed enhancements.

---

## End-to-End Data Flow

```mermaid
graph TD
    A["User selects hours<br/>1-72 hour window<br/>via form control"] -->|Submit form| B["SignalsInstrument<br/>setRequest action<br/>requestId incremented"]
    B -->|fetch abort timer<br/>12s timeout| C["GET /api/signals<br/>?range=hours<br/>cache: no-store"]
    C -->|200 OK| D["SignalsResponse JSON<br/>window, observations,<br/>exclusions, gaps"]
    C -->|Error| E["SignalsApiError<br/>+ failedDelivery<br/>+ REUSE_MINUTES"]
    
    D -->|Parse| F["SignalsSnapshot<br/>with coverage calc"]
    E -->|Parse| G["Set error state<br/>+ failedDelivery info"]
    
    F -->|Render if complete| H["SnapshotView<br/>summary != null"]
    F -->|Render if empty| I["No accepted temps<br/>inspect coverage"]
    
    H -->|Extract| J["Latest observation<br/>+ Min/Max/Mean/Count"]
    H -->|Extract| K["Contiguous segments<br/>for polyline"]
    H -->|Extract| L["Gaps + Exclusions<br/>for inspector"]
    
    J -->|Format| M["Latest readout<br/>formatTemperature<br/>formatUtc"]
    K -->|Render SVG| N["TemperatureChart<br/>720px wide SVG<br/>Data-driven coordinates"]
    L -->|Render disclosure| O["EvidenceInspector<br/>details/summary"]
    
    H -->|Render table| P["Observation table<br/>snapshot.observations<br/>with formatters"]
    
    H -->|Calculate| Q["Window coverage<br/>expectedHours vs<br/>acceptedHours"]
    Q -->|Display| R["Coverage panel<br/>+ source links"]
    
    style A fill:#e1f5ff
    style C fill:#fff3e0
    style D fill:#f3e5f5
    style H fill:#e8f5e9
    style N fill:#fce4ec
    style O fill:#ede7f6
```

**Key transitions:**
- **Request initiation:** `setRequest()` increments `requestId`, triggering `useEffect` fetch
- **Response caching:** `cache: 'no-store'` prevents browser cache; server respects `REUSE_MINUTES` UTC slot bucketing
- **Error handling:** Preserves `failedDelivery.nextCheckAt` to show when cache slot expires
- **Snapshot branching:** `summary` existence determines empty vs. complete render
- **Formatting boundary:** Data model (UTC, raw values, quality flags) → Display (localized time, rounded temps, label text)

---

## Observation Validation and Exclusion Pipeline

```mermaid
graph TD
    A["Raw CSV from NOAA<br/>variable column count<br/>UTC time, value,<br/>f/q flags"]
    
    A -->|Parse each row| B["Identify<br/>- rowIndex<br/>- rawTimestamp<br/>- rawValue<br/>- flags"]
    
    B -->|Structural checks| C{Valid format<br/>and type?}
    C -->|No| D["EXCLUSIONS:<br/>malformed_row<br/>malformed_timestamp<br/>malformed_value"]
    C -->|Yes| E{Timestamp<br/>parseable?}
    
    E -->|No| F["EXCLUSIONS:<br/>malformed_timestamp"]
    E -->|Yes| G{Within window<br/>+ on the hour?}
    
    G -->|No| H["EXCLUSIONS:<br/>outside_window<br/>off_hour"]
    G -->|Yes| I{Value present<br/>and finite?}
    
    I -->|No| J["EXCLUSIONS:<br/>missing_value<br/>blank_value<br/>non_finite_value"]
    I -->|Yes| K{Duplicate<br/>timestamp?}
    
    K -->|Yes| L["EXCLUSIONS:<br/>duplicate_timestamp<br/>keep first"]
    K -->|No| M["✓ Accepted<br/>Observation"]
    
    M -->|Store| N["observations array<br/>with observedAt,<br/>value, flags"]
    D -->|Store| O["exclusions array<br/>with reason,<br/>raw data"]
    
    N -->|Analyze| P["Contiguous segments<br/>for chart rendering"]
    N -->|Analyze| Q["Coverage calculation<br/>expected vs. accepted"]
    O -->|Categorize| R["Evidence gaps<br/>- excluded_observation<br/>- uninterpreted_quality"]
    
    style M fill:#c8e6c9
    style D fill:#ffccbc
    style N fill:#bbdefb
    style R fill:#f8bbd0
```

**Implemented validation steps** (in `observations.ts` and server adapter):
- Row-by-row structural validation
- Timestamp parsing and window/hour checking
- Value type and range (non-finite) validation
- Duplicate timestamp de-duplication (first wins)
- Quality flag preservation (not interpreted, only flagged for review)

**Coverage semantics:**
- `expectedHours`: Span of window in complete UTC hours
- `acceptedHours`: Count of observations with valid values
- `missingHours`: Expected hours with no accepted row (None, some, or all)
- `gaps`: Detailed evidence for each missing hour (why the gap, what to check next)

---

## Proposed Observation Selection and Inspector Update Flow

```mermaid
graph TD
    A["User clicks chart point<br/>or table row<br/>or uses keyboard<br/>arrow to focus"]
    
    A -->|Interaction| B["Emit observation<br/>selection event<br/>selectedObservation =<br/>{ observedAt, value,<br/>flags, rowIndex }"]
    
    B -->|Update state| C["SignalsInstrument<br/>setSelectedObservation"]
    
    C -->|Re-render chart| D["TemperatureChart<br/>- Highlight selected point<br/>- Ring or glow effect<br/>- aria-current"]
    
    C -->|Scroll table| E["Observation table<br/>- Scroll to row<br/>- Set aria-selected<br/>- Highlight row"]
    
    C -->|Update inspector| F["EvidenceInspector<br/>auto-expand relevant<br/>details sections:<br/>- Quality flags<br/>- Any exclusions<br/>for this hour"]
    
    C -->|Source disclosure| G["SourceDisclosure<br/>- Station metadata<br/>- Timestamp UTC<br/>- Raw value<br/>- NOAA flags"]
    
    B -->|Announce| H["aria-live update<br/>Latest: XX.X°C<br/>at HH:MM UTC"]
    
    style A fill:#e1f5ff
    style B fill:#fff3e0
    style D fill:#fce4ec
    style E fill:#f3e5f5
    style G fill:#c8e6c9
    style H fill:#bbdefb
```

**Proposed behavior** (not yet implemented):
- Selection initiates coordinated highlight across chart, table, and inspector
- Chart point gets visual ring or glow; aria-current="true" on SVG element
- Table row scrolls into view; aria-selected="true" set
- Inspector auto-expands details relevant to selected observation
- Source metadata always displayed for selected observation
- Announcement updates reading order for screen readers
- Keyboard navigation: Arrow keys move focus through observations; Enter/Space selects

**Current gap:** No coordinated selection state; chart and table are read-only.

---

## Cache Policy and Freshness Model

```mermaid
graph TD
    A["User refreshes<br/>same window hours"]
    
    A -->|Fetch with<br/>?range=hours| B["Server checks<br/>cache slot<br/>UTC minute / REUSE_MINUTES"]
    
    B -->|Slot not expired| C["Return cached response<br/>+ nextCheckAt"]
    
    B -->|Slot expired| D["Fetch from NOAA API<br/>tidesandcurrents.noaa.gov"]
    
    D -->|Success| E["Store in cache<br/>set new<br/>nextCheckAt"]
    
    D -->|NOAA error| F["Return error<br/>+ failedDelivery<br/>+ nextCheckAt"]
    
    C -->|Response| G["SignalsResponse<br/>{ delivery: {<br/>retrievedAt,<br/>nextCheckAt<br/>} }"]
    
    E -->|Response| G
    F -->|Response| G
    
    G -->|Parse| H["SignalsInstrument<br/>setClock to now"]
    
    H -->|If result.error| I["Show error message<br/>+ REUSE_MINUTES explanation<br/>+ nextCheckAt link"]
    
    H -->|If stale| J["Show 'Stale response'<br/>badge + cache info"]
    
    H -->|If fresh| K["Show green status<br/>+ next check time"]
    
    L["Background tick<br/>every 15s<br/>updates clock"]
    
    L -->|clock > 15m<br/>or time passes| M["Recalculate stale<br/>status"]
    
    style B fill:#fff3e0
    style C fill:#f3e5f5
    style D fill:#ffebee
    style I fill:#ffccbc
    style K fill:#c8e6c9
```

**Current implementation** (in `delivery.ts` and server):
- REUSE_MINUTES bucketing: Requests in same UTC minute slot reuse cached response
- `nextCheckAt`: ISO string when cache slot expires and new data is available
- 15s background clock tick updates stale badge visibility
- Never displays hardcoded/simulated values; always preserves `retrievedAt` and `nextCheckAt`
- Error state includes `failedDelivery` with next check time (even on failure)

**Transparency contract:**
- User always knows when data was retrieved
- User always knows when to check back for fresh data
- No spinning loader without timeout or clear "checking cache" message
- Manual refresh button respects cache slot (truthful, not forced fresh)

---

## Responsive Rendering and Layout Transitions

```mermaid
graph TD
    A["Snapshot received<br/>desktop/mobile<br/>viewport width"]
    
    A -->|Width ≥ 1024px| B["Dashboard grid<br/>2.25fr | 1fr<br/>Instrument || Coverage"]
    
    A -->|Width < 1024px| C["Dashboard single col<br/>Instrument full width<br/>Coverage stacked below"]
    
    B -->|Within instrument| D["Readout flex<br/>Latest | Stats<br/>horizontal on wide"]
    
    C -->|Within instrument| E["Readout flex<br/>Latest | Stats<br/>stacked on narrow"]
    
    B -->|Chart size| F["clamp(9rem,19vw,14rem)<br/>height<br/>Scales 320-1440px"]
    
    D -->|Stats grid| G["grid-template-columns:<br/>repeat4,1fr<br/>Min/Max/Mean/Count"]
    
    E -->|Stats grid| H["grid-template-columns:<br/>repeat2,1fr<br/>Min Max<br/>Mean Count"]
    
    F -->|SVG viewBox| I["720x224 intrinsic<br/>preserveAspectRatio=none<br/>stretches to width"]
    
    C -->|Below chart| J["xAxis labels<br/>margin-left adjusts<br/>for yAxis width"]
    
    B -->|Table| K["tableViewport<br/>scrollable region<br/>role region"]
    
    C -->|Table| L["Same: scrollable<br/>region, no change"]
    
    style B fill:#c8e6c9
    style C fill:#bbdefb
    style F fill:#fce4ec
    style I fill:#f8bbd0
```

**Current responsive behavior:**
- **Desktop (≥1024px):** Two-column dashboard with proportional grid
- **Tablet (768–1023px):** Implicit single column via minmax; dashboard collapses gracefully
- **Mobile (<768px):** Full single column; all sections stack
- **Chart:** Maintains aspect via viewBox + height clamp; SVG text/axis scale naturally
- **Table:** Scrollable viewport on all sizes; no forced horizontal scroll of page

**Proposed enhancement:** Explicit media queries at 375px, 768px, 1024px breakpoints for state-specific inspector placement (mobile: bottom sheet; tablet: inline; desktop: persistent right sidebar).

---

## Summary: Implementation Readiness

| Component | Implemented | Proposed | Handoff Note |
| --- | --- | --- | --- |
| **Request/Response** | ✓ Full pipeline with cache | ✓ Add loading spinner | No scientific data changes |
| **Validation** | ✓ Comprehensive exclusion logic | ✓ Categorize more explicitly | Preserve all flags |
| **Chart Rendering** | ✓ SVG with gaps | ✓ Add selection highlight | No new dependencies |
| **Table** | ✓ Semantic with all data | ✓ Row selection state | Use aria-selected |
| **Inspector** | ✓ Evidence gaps displayed | ✓ Coordinate with selection | Auto-expand relevant sections |
| **Cache Transparency** | ✓ nextCheckAt shown | ✓ Visual countdown | Never fabricate data |
| **Responsive** | ✓ Foundation solid | ✓ Explicit breakpoints | Test at 320/375/768/1024/1440 |

---

**Diagram set complete. Ready for Concept A and B interaction specifications.**
