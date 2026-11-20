import assert from 'node:assert/strict';
import test from 'node:test';
import { reuseSlot, signalsStatus } from '../src/features/signals/delivery.ts';

const retrievedAt = '2026-11-14T01:02:00.000Z';
const nextCheckAt = '2026-11-14T01:05:00.000Z';
const delivery = (source) => ({ source, nextCheckAt });
const response = {
  status: 'partial',
  window: { hours: 24, endUtcExclusive: '2026-11-14T01:00:00.000Z' },
  retrievedAt,
  delivery: delivery('noaa'),
};

function describe(overrides = {}) {
  return signalsStatus({ response, nowMs: Date.parse(retrievedAt), pending: false, error: null, ...overrides });
}

test('five-minute slots end at both expiry and the completed UTC-hour boundary', () => {
  assert.deepEqual(reuseSlot(Date.parse('2026-11-14T01:04:59.999Z')), {
    startMs: Date.parse('2026-11-14T01:00:00Z'), nextCheckAt,
  });
  assert.equal(reuseSlot(Date.parse(nextCheckAt)).nextCheckAt, '2026-11-14T01:10:00.000Z');
  assert.equal(reuseSlot(Date.parse('2026-11-14T01:59:59.999Z')).nextCheckAt, '2026-11-14T02:00:00.000Z');
  assert.equal(reuseSlot(Date.parse('2026-11-14T02:00:00Z')).startMs, Date.parse('2026-11-14T02:00:00Z'));
});

test('refresh labels distinguish new, cached, pending, and shared in-progress responses', () => {
  assert.match(describe().text, /^New response from NOAA\. Partial response/);
  assert.match(describe({ response: { ...response, delivery: delivery('cache') } }).text, /^Reused a cached NOAA response/);
  assert.match(describe({ response: { ...response, delivery: delivery('in_flight') } }).text, /^Shared a NOAA request/);
  assert.match(describe({ pending: true }).text, /^Checking for an update/);
});

test('cached ambiguous no-data keeps its meaning and never implies a new retrieval', () => {
  const empty = { ...response, delivery: delivery('cache'), status: 'empty', emptyReason: 'noaa_no_data' };
  assert.match(describe({ response: empty }).text, /^Reused a cached NOAA response\. NOAA returned an ambiguous no-data response/);
});

test('failure, timeout, aging, and rollover label retained observations as stale', () => {
  const failure = describe({ error: 'The NOAA request timed out. Try again.', failedDelivery: delivery('cache') });
  assert.equal(failure.stale, true);
  assert.match(failure.text, /Reused the last failed NOAA check.*timed out.*Showing the previous response/);
  assert.equal(describe({ response: null, error: 'The NOAA request timed out.' }).stale, false);
  assert.equal(describe({ nowMs: Date.parse('2026-11-14T01:16:59.999Z') }).stale, false);
  assert.equal(describe({ nowMs: Date.parse('2026-11-14T01:17:00Z') }).stale, true);
  const beforeRollover = { ...response, retrievedAt: '2026-11-14T01:59:59.000Z' };
  const rollover = describe({ response: beforeRollover, nowMs: Date.parse('2026-11-14T02:00:00Z') });
  assert.equal(rollover.stale, true);
  assert.match(rollover.text, /displayed response is stale/);
});
