import assert from 'node:assert/strict';
import test from 'node:test';
import {
  moveObservationSelection,
  normalizeObservationSelection,
  toggleObservationSelection,
} from '../src/features/signals/selection.ts';

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
