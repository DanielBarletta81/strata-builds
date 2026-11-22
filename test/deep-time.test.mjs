import assert from 'node:assert/strict';
import test from 'node:test';
import { URL } from 'node:url';
import { chronology } from '../src/features/deep-time/chronology.ts';
import { originHypotheses, oxygenPhases, settings } from '../src/features/deep-time/chapters.ts';
import { evidenceClasses, sources } from '../src/features/deep-time/sources.ts';
import { ageRange, axisLabel, initialSelection, position, scales, selectEvent, setZoom, timeWindow, visibleEvents } from '../src/features/deep-time/time.ts';

const event = (id) => chronology.find((entry) => entry.id === id);

test('chronology ages descend and dated ranges retain both boundaries', () => {
  assert.equal(chronology.length, 18);
  assert.equal(new Set(chronology.map(({ id }) => id)).size, 18);
  const ranges = chronology.map(ageRange).filter(Boolean);
  assert.equal(ranges[0].older, 4_540_000_000);
  assert.equal(ranges[ranges.length - 1].younger, 0);
  assert.ok(ranges.every((range, index) => range.older >= range.younger &&
    (index === 0 || ranges[index - 1].younger >= range.older)));
  assert.deepEqual(ageRange(event('cryogenian')), { older: 720_000_000, younger: 635_000_000 });
  assert.deepEqual(ageRange(event('glacial-maximum')), { older: 26_500, younger: 19_000 });
  assert.deepEqual(ageRange(event('voyager-launch')), { older: 49, younger: 49 });
});

test('uncertain origin dates have no age or plotted marker', () => {
  for (const id of ['origins', 'oxygen-production']) {
    assert.equal(event(id).when.kind, 'unresolved');
    assert.equal(ageRange(event(id)), null);
    assert.ok(!visibleEvents(timeWindow(initialSelection)).some(({ event }) => event.id === id));
  }
  const selected = setZoom(initialSelection, 2);
  const undated = selectEvent(selected, event('origins'));
  assert.equal(undated.id, 'origins');
  assert.equal(undated.anchorAge, selected.anchorAge);
  assert.deepEqual(timeWindow(undated), timeWindow(selected));
});

test('zoom windows nest around the dated selection and stop at the supported scales', () => {
  const present = selectEvent(initialSelection, event('modern-earth'));
  let parent = timeWindow(present);
  for (const [level, { span }] of scales.entries()) {
    const zoomed = setZoom(present, level);
    const window = timeWindow(zoomed);
    assert.equal(zoomed.id, present.id);
    assert.equal(window.older - window.younger, span);
    assert.ok(window.older <= parent.older && window.younger >= parent.younger);
    assert.ok(visibleEvents(window).some(({ event }) => event.id === present.id));
    parent = window;
  }
  assert.equal(setZoom(initialSelection, 4).level, 2);
  const holocene = selectEvent(present, event('holocene'));
  assert.equal(setZoom(holocene, 4).level, 3);
  assert.equal(axisLabel(200, 4), '1826 CE');
  assert.equal(axisLabel(0, 4), '2026 CE');
});

test('selection persists on zoom and choosing an event recenters with a supported scale', () => {
  const historical = setZoom(selectEvent(initialSelection, event('modern-earth')), 4);
  const launch = selectEvent(historical, event('voyager-launch'));
  assert.equal(launch.level, 4);
  assert.equal(launch.id, 'voyager-launch');
  const tethys = selectEvent(launch, event('tethys'));
  assert.equal(tethys.level, 2);
  const window = timeWindow(tethys);
  assert.equal(position(111_000_000, window), 50);
  assert.equal(position(window.older, window), 0);
  assert.equal(position(window.younger, window), 100);
  const ice = selectEvent(tethys, event('cryogenian'));
  assert.equal(visibleEvents(timeWindow(ice)).find(({ event }) => event.id === ice.id).range.older, 720_000_000);
});

test('every event, chapter claim and qualitative oxygen concept has named source references', () => {
  for (const entry of [...chronology, ...settings, ...originHypotheses, ...oxygenPhases]) {
    if ('classification' in entry) assert.ok(evidenceClasses[entry.classification]);
    assert.ok(entry.sources.length > 0);
    for (const id of entry.sources) {
      assert.ok(sources[id].label);
      assert.equal(new URL(sources[id].url).protocol, 'https:');
    }
  }
  assert.ok(originHypotheses.every(({ classification }) => classification === 'hypothesis'));
  assert.equal(oxygenPhases.length, 4);
  assert.ok(oxygenPhases.every(({ atmosphere, oceans, proxies }) => atmosphere && oceans && proxies));
});
