import assert from 'node:assert/strict';
import test from 'node:test';
import {
  moveObservationSelection,
  normalizeObservationSelection,
  toggleObservationSelection,
} from '../src/features/signals/selection.ts';
import captured from './fixtures/noaa/providence-hourly.json' with { type: 'json' };
import { normalizeNoaa, observationWindow } from '../src/features/signals/noaa.ts';

const observations = [
  { observedAt: '2026-11-14T00:00:00.000Z' },
  { observedAt: '2026-11-14T01:00:00.000Z' },
  { observedAt: '2026-11-14T02:00:00.000Z' },
];

test('selection normalizes to null when a selected observation disappears', () => {
  assert.equal(normalizeObservationSelection(observations, observations[1].observedAt), observations[1].observedAt);
  assert.equal(normalizeObservationSelection(observations, '2026-11-14T09:00:00.000Z'), null);
  assert.equal(normalizeObservationSelection([], observations[0].observedAt), null);
});

test('chart keyboard selection moves across accepted observations and wraps', () => {
  assert.equal(moveObservationSelection(observations, null, 'next'), observations[0].observedAt);
  assert.equal(moveObservationSelection(observations, observations[2].observedAt, 'next'), observations[0].observedAt);
  assert.equal(moveObservationSelection(observations, null, 'previous'), observations[2].observedAt);
  assert.equal(moveObservationSelection(observations, observations[0].observedAt, 'previous'), observations[2].observedAt);
  assert.equal(moveObservationSelection([], observations[0].observedAt, 'next'), null);
});

test('chart and table toggles use the same selected-observation transition', () => {
  const target = observations[1].observedAt;
  assert.equal(toggleObservationSelection(null, target), target);
  assert.equal(toggleObservationSelection(observations[0].observedAt, target), target);
  assert.equal(toggleObservationSelection(target, target), null);
});

test('selection and navigation preserve every scientific snapshot field', () => {
  const now = new Date('2026-11-14T01:12:00Z');
  const window = observationWindow(24, now);
  const snapshot = normalizeNoaa(
    captured,
    window,
    'https://api.tidesandcurrents.noaa.gov/test',
    now.toISOString(),
  );
  const before = JSON.parse(JSON.stringify(snapshot));
  const target = snapshot.observations[1].observedAt;

  assert.equal(toggleObservationSelection(null, target), target);
  assert.equal(moveObservationSelection(snapshot.observations, target, 'next'), snapshot.observations[2].observedAt);
  assert.equal(moveObservationSelection(snapshot.observations, snapshot.observations.at(-1).observedAt, 'next'), snapshot.observations[0].observedAt);

  assert.deepEqual(snapshot, before);
  assert.deepEqual(snapshot.observations, before.observations);
  assert.deepEqual(snapshot.exclusions, before.exclusions);
  assert.deepEqual(snapshot.coverage, before.coverage);
  assert.deepEqual(snapshot.summary, before.summary);
  assert.deepEqual(snapshot.gaps, before.gaps);
});

test('accepted-only navigation cannot produce a missing-hour timestamp', () => {
  const now = new Date('2026-11-14T01:12:00Z');
  const snapshot = normalizeNoaa(
    {
      ...captured,
      data: [captured.data[0], captured.data[2]],
    },
    observationWindow(24, now),
    'https://api.tidesandcurrents.noaa.gov/test',
    now.toISOString(),
  );
  const missingTimestamps = new Set(
    snapshot.gaps
      .filter(({ type }) => type === 'observation_gap')
      .flatMap(({ interval }) => interval ? [interval.startUtc] : []),
  );
  const acceptedTimestamps = new Set(snapshot.observations.map(({ observedAt }) => observedAt));

  for (const observation of snapshot.observations) {
    assert.equal(missingTimestamps.has(moveObservationSelection(snapshot.observations, observation.observedAt, 'next')), false);
    assert.equal(missingTimestamps.has(moveObservationSelection(snapshot.observations, observation.observedAt, 'previous')), false);
    assert.equal(toggleObservationSelection(observation.observedAt, observation.observedAt), null);
  }
  assert.equal(acceptedTimestamps.size, snapshot.observations.length);
  const missingGaps = snapshot.gaps.filter(({ type }) => type === 'observation_gap');
  assert.ok(missingGaps.length > 0);
  for (const gap of missingGaps) {
    assert.ok(gap.interval);
    assert.ok(gap.directEvidence);
    assert.ok(gap.limitation);
    assert.equal(missingTimestamps.has(gap.interval.startUtc), true);
  }
});

test('window and observation refresh normalize stale selections', () => {
  assert.equal(normalizeObservationSelection(observations, observations[1].observedAt), observations[1].observedAt);
  assert.equal(normalizeObservationSelection(observations.slice(0, 1), observations[1].observedAt), null);
  assert.equal(normalizeObservationSelection([], observations[1].observedAt), null);

  const changedWindow = observations.map(({ observedAt }) => ({ observedAt })).slice(1);
  assert.equal(normalizeObservationSelection(changedWindow, observations[0].observedAt), null);
  assert.equal(normalizeObservationSelection(changedWindow, observations[1].observedAt), observations[1].observedAt);
});

test('missing-hour evidence and raw NOAA evidence remain unchanged through selection', () => {
  const now = new Date('2026-11-14T01:12:00Z');
  const snapshot = normalizeNoaa(
    captured,
    observationWindow(24, now),
    'https://api.tidesandcurrents.noaa.gov/test',
    now.toISOString(),
  );
  const beforeObservations = JSON.parse(JSON.stringify(snapshot.observations));
  const beforeGaps = JSON.parse(JSON.stringify(snapshot.gaps));
  const target = snapshot.observations[0].observedAt;

  assert.equal(toggleObservationSelection(null, target), target);
  assert.equal(toggleObservationSelection(target, target), null);
  assert.deepEqual(snapshot.observations, beforeObservations);
  assert.deepEqual(snapshot.gaps, beforeGaps);

  for (let index = 0; index < snapshot.observations.length; index++) {
    const row = snapshot.observations[index];
    const source = captured.data[index];
    assert.equal(row.rawTimestamp, source.t);
    assert.equal(row.rawValue, source.v);
    assert.deepEqual(row.flags, { f: source.f, q: null });
  }
  for (const gap of snapshot.gaps) {
    assert.ok(gap.type);
    assert.ok(gap.verification);
    assert.ok(gap.directEvidence);
    assert.ok(gap.limitation);
  }
});
