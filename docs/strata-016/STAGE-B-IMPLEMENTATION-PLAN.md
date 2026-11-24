# STRATA-016 Stage B Implementation Plan

**Status:** Ready for authorization after documentation corrections  
**Baseline commit:** 7d99bfd (Charter corrections complete)  
**Branch:** `strata-016/noaa-listening-station`

---

## Stage B Scope: Concept A Implementation

**Approved Creative Direction:** Panoramic Signal Observatory (Concept A)

**Visual & Interaction Changes:**
- SelectionInspector component (new): Renders selected observation details with auto-expanding quality/evidence sections
- Chart point selection (new): Click/tap points to highlight; keyboard navigation with arrow keys
- Table row selection (new): Click rows to sync with chart; aria-selected state
- Evidence Trail component (new): Compact provenance visualizer (future stage can integrate)
- Responsive inspector behavior: Desktop persistent option; mobile scroll-to-inspect

**Unchanged (Must Not Modify):**
- NOAA data ingestion (noaa.ts)
- Validation and exclusion rules (normalizeRows function)
- Cache behavior (5-minute slots, 15-minute freshness)
- Scientific calculations (summarize, evidenceGaps)
- Evidence classification semantics ('observed' only)
- Quality flag preservation (never interpreted)
- Source attribution and documentation

---

## Affected Source Files

**Modified Files (Visual + Interaction):**
1. `src/features/signals/signals-instrument.tsx`
   - Add selection state management
   - Selection event handler for chart/table clicks
   - Manage inspector auto-scroll

2. `src/features/signals/temperature-chart.tsx`
   - Add click handler on data points
   - aria-current attribute on selected point
   - Ring/glow visual on selection (CSS class swap)

3. `src/features/signals/signals.module.css`
   - `.pointSelected` - ring/highlight styling
   - `.rowSelected` - table row selection state
   - Responsive inspector panel sizing
   - Touch target expansion (44px minimum)
   - `@media (prefers-reduced-motion)` - no animations

4. `src/features/signals/evidence-inspector.tsx`
   - Auto-expand details sections based on selected observation
   - Scroll-into-view on selection (mobile)

**New Files (Components):**
1. `src/features/signals/selection-inspector.tsx`
   - Props: selectedObservation, snapshot
   - Auto-expand relevant sections
   - Source disclosure for selected obs

2. `src/features/signals/source-badge.tsx`
   - Compact display of station, timestamp, raw value, flags

3. `src/features/signals/chart-caption.tsx`
   - Interactive legend
   - Selection instructions ("Click to inspect", etc.)

**Test Files (New):**
1. `src/features/signals/selection-inspector.test.tsx`
2. `src/features/signals/source-badge.test.tsx`

**NOT Modified:**
- `src/features/signals/observations.ts` (data model)
- `src/features/signals/noaa.ts` (ingestion)
- `src/features/signals/delivery.ts` (cache)
- `src/features/signals/snapshot-cache.ts` (cache)
- `src/features/signals/display.ts` (formatting)
- `src/app/signals/page.tsx` (shell)

---

## Scientific Regression Tests

**Before merge to main, verify:**

1. **Data Integrity:**
   - [ ] All observations preserved (no silent filtering)
   - [ ] Raw values and timestamps unchanged
   - [ ] Quality flags preserved exactly
   - [ ] Exclusion records complete

2. **Calculation Accuracy:**
   - [ ] Min/max/mean calculations identical to baseline
   - [ ] Coverage counts match baseline
   - [ ] Gap identification unchanged

3. **Evidence Classification:**
   - [ ] `classification: 'observed'` on all snapshots
   - [ ] No unverified model/synthetic classifications
   - [ ] Evidence gaps structure unchanged

4. **Cache Behavior:**
   - [ ] 5-minute reuse interval (REUSE_MINUTES = 5)
   - [ ] 15-minute freshness threshold (FRESHNESS_MS)
   - [ ] Cache revalidation logic intact

5. **API Contract:**
   - [ ] NOAA station (8454000) unchanged
   - [ ] Product (water_temperature) unchanged
   - [ ] Units (°C) unchanged
   - [ ] Window hours (1-72) unchanged

**Test Command (run before PR):**
```bash
npm run test  # All existing tests must pass
npm run test:routes  # /signals smoke test
```

---

## Accessibility Testing (Stage B)

**WCAG 2.2 AA specifications (verify on real devices/screen readers):**

- [ ] Keyboard navigation: Tab through chart points, arrow keys select
- [ ] Focus visible: 3px ring on all interactive elements
- [ ] Screen reader: VoiceOver/NVDA announce selection state
- [ ] Touch: 44px minimum hit targets
- [ ] Zoom: Content usable at 200% and 400%
- [ ] Reduced motion: No animations, immediate state changes
- [ ] Color contrast: 4.5:1 all text
- [ ] No color-only encoding (selection also uses outline/border)

---

## Implementation Checklist

**Code Quality:**
- [ ] TypeScript: No `any` types in new code
- [ ] Lint: `npm run lint` passes
- [ ] Type check: `npm run typecheck` passes
- [ ] Tests: All new components have unit tests
- [ ] No new dependencies

**Integration:**
- [ ] Selection state does not affect data model
- [ ] Evidence gaps unchanged by selection
- [ ] Chart and table remain responsive
- [ ] Mobile inspector scroll behavior works
- [ ] Focus management follows WCAG patterns

**Documentation:**
- [ ] Component propTypes documented
- [ ] CSS classes named clearly (BEM convention)
- [ ] Inline comments on selection logic
- [ ] README updated with new components (optional)

---

## Draft PR Checklist (After Implementation)

Before creating PR:

1. Run full test suite: `npm test`
2. Run build: `npm run build`  
3. Run accessibility checks (Lighthouse, manual WCAG audit)
4. Manual testing: Desktop (1440px) and mobile (375px)
5. Visual diff: Compare chart/table interaction to Concept A mockup
6. Performance: Check bundle size impact (+5–8KB expected)

---

## Key Design Decisions (Locked)

1. **Selection model:** Click/tap = select; keyboard arrows/Enter = navigate
2. **Chart highlight:** Ring on point (not glow/pulse)
3. **Inspector auto-expand:** Only sections relevant to selected observation
4. **Mobile scroll:** Smooth scroll on desktop; instant on mobile with prefers-reduced-motion
5. **Evidence Trail:** Deferred to Stage C (design only in Stage B)

---

## Blockers / Open Questions

None identified. Stage B can proceed with approved Concept A.

**Future decisions (Stage C+):**
- Evidence Trail integration
- Desktop side-panel inspector variant
- Search/filter on table
- Export functionality
- Keyboard shortcuts (spacebar to latest, etc.)

---

## Commit Timeline

**Expected commits:**
1. Selection state management
2. Chart interaction (click detection)
3. Table interaction (row selection)
4. Inspector auto-expand
5. CSS and responsive layout
6. Component tests
7. Integration and polish

**Estimated duration:** 3–5 days

---

**Ready for Stage B authorization from Fleet Command.**

Production merge blocked until:
1. ✅ Documentation corrections verified (this commit: 7d99bfd)
2. ✅ Implementation complete
3. ✅ All tests passing
4. ✅ Accessibility verified on real devices
5. ✅ Scientific regression tests passing
6. ✅ Code review approved
7. ✅ Scientific reviewer approval
