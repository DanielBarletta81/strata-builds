import assert from 'node:assert/strict';
import test from 'node:test';
import { ReadableStream } from 'node:stream/web';
import { URL, URLSearchParams } from 'node:url';
import captured from './fixtures/noaa/providence-hourly.json' with { type: 'json' };
import ambiguous from './fixtures/noaa/ambiguous-no-data.json' with { type: 'json' };
import invalidStation from './fixtures/noaa/invalid-station.json' with { type: 'json' };
import {
  fetchNoaa, normalizeNoaa, noaaSourceUrl, observationWindow, parseNoaaGmtTimestamp, parseSignalsParams,
} from '../src/features/signals/noaa.ts';
import { contiguousObservations } from '../src/features/signals/observations.ts';

const { Response } = globalThis;
const now = new Date('2026-11-14T01:12:00Z');
const window = observationWindow(24, now);
const url = noaaSourceUrl(window);
const normalize = (payload) => normalizeNoaa(payload, window, url, now.toISOString());

test('NOAA query uses explicit completed UTC-hour boundaries and fixed station, product, interval and units', () => {
  assert.deepEqual(window, {
    hours: 24, startUtc: '2026-11-13T01:00:00.000Z', endUtcExclusive: '2026-11-14T01:00:00.000Z',
  });
  const query = new URL(url).searchParams;
  assert.deepEqual(Object.fromEntries(query), {
    station: '8454000', product: 'water_temperature', begin_date: '20261113 01:00', end_date: '20261114 00:59',
    interval: 'h', units: 'metric', time_zone: 'gmt', format: 'json', application: 'strata_builds',
  });
  assert.equal(new URL(noaaSourceUrl(observationWindow(1, now))).searchParams.get('begin_date'), '20261114 00:00');
});

test('NOAA parameters are bounded and reject duplicate, unsupported and malformed input before fetching', () => {
  assert.equal(parseSignalsParams(new URLSearchParams()), 24);
  assert.equal(parseSignalsParams(new URLSearchParams('station=8454000&product=water_temperature&range=1')), 1);
  assert.equal(parseSignalsParams(new URLSearchParams('range=72')), 72);
  for (const query of [
    'station=0000000', 'product=water_level', 'units=english', 'time_zone=lst', 'range=', 'range=0',
    'range=73', 'range=1.5', 'range=24&range=24', 'range=3e1', 'range=+1',
  ]) {
    assert.throws(() => parseSignalsParams(new URLSearchParams(query)), { code: 'invalid_request' }, query);
  }
});

test('pinned NOAA rows produce source-linked statistics, exact timestamps and conserved flags', () => {
  const snapshot = normalize(captured);
  assert.equal(snapshot.classification, 'observed');
  assert.equal(snapshot.station.id, captured.metadata.id);
  assert.equal(snapshot.sourceUrl, url);
  assert.equal(snapshot.retrievedAt, now.toISOString());
  assert.equal(snapshot.status, 'complete');
  assert.deepEqual(snapshot.coverage, { applicable: true, expectedHours: 24, acceptedHours: 24, missingHours: 0 });
  assert.equal(snapshot.exclusions.length, 0);
  assert.equal(snapshot.gaps.length, 0);
  const values = captured.data.map(({ v }) => Number(v));
  assert.equal(snapshot.summary.latest.rawTimestamp, captured.data.at(-1).t);
  assert.equal(snapshot.summary.latest.observedAt, '2026-11-14T00:00:00.000Z');
  assert.equal(snapshot.summary.latest.rawValue, captured.data.at(-1).v);
  assert.deepEqual(snapshot.summary.latest.flags, { f: captured.data.at(-1).f, q: null });
  assert.equal(snapshot.summary.min, Math.min(...values));
  assert.equal(snapshot.summary.max, Math.max(...values));
  assert.equal(snapshot.summary.mean, Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)));
  assert.equal(snapshot.summary.count, captured.data.length);
  assert.equal(contiguousObservations(snapshot.observations)[0].length, 24);
});

test('GMT wall times normalize to UTC and impossible or non-contract timestamps are rejected', () => {
  assert.equal(parseNoaaGmtTimestamp('2024-02-29 23:00'), '2024-02-29T23:00:00.000Z');
  for (const input of [
    '2026-02-29 23:00', '2026-11-31 23:00', '2026-11-13 24:00', '2026-11-13 00:60',
    '2026-11-13 00:00Z', '2026-11-13T00:00', null,
  ]) assert.equal(parseNoaaGmtTimestamp(input), null);
});

test('test-only perturbations preserve zero, reject invalid rows and break chart segments at gaps', () => {
  const [first, second, third, , fifth] = captured.data;
  // TEST-ONLY modifications to a NOAA-shaped response. These values are not displayed as observations.
  const data = [
    fifth, { ...first, v: '' }, { ...first, v: '0', f: '0,1,0', q: 'unknown' },
    { ...first, v: '10' }, second, { ...third, v: null }, { ...third, v: '12abc' },
    { ...third, v: false }, { ...third, v: Infinity }, null, { ...third, t: '2026-02-30 03:00' },
    { ...third, t: '2026-11-13 03:06' }, { ...third, t: '2026-11-13 00:00' },
  ];
  const snapshot = normalize({ ...captured, data });
  assert.equal(snapshot.status, 'partial');
  assert.equal(snapshot.receivedRows, data.length);
  assert.equal(snapshot.receivedRows, snapshot.exclusions.length + snapshot.observations.length);
  assert.deepEqual(snapshot.exclusions.map(({ reason }) => reason), [
    'blank_value', 'duplicate_timestamp', 'missing_value', 'malformed_value', 'malformed_value',
    'non_finite_value', 'malformed_row', 'malformed_timestamp', 'off_hour', 'outside_window',
  ]);
  assert.equal(snapshot.summary.min, 0);
  assert.equal(snapshot.observations[0].rawValue, '0');
  assert.deepEqual(snapshot.observations[0].flags, { f: '0,1,0', q: 'unknown' });
  const segments = contiguousObservations(snapshot.observations);
  assert.deepEqual(segments.map((segment) => segment.length), [2, 1]);
  assert.deepEqual(segments.flat(), snapshot.observations);
  assert.equal(snapshot.coverage.missingHours, 21);
  const missing = snapshot.gaps.filter(({ type }) => type === 'observation_gap');
  assert.equal(missing.length, 21);
  assert.equal(missing[0].interval.startUtc, '2026-11-13T03:00:00.000Z');
  assert.equal(missing[0].verification, 'confirmed_within_source_scope');
  assert.deepEqual(missing[0].sources[0].rowIndexes, [5, 6, 7, 8]);
  assert.deepEqual(missing[1].sources[0].rowIndexes, []);
  assert.match(missing[1].nextAction, /station inventory/);
  assert.equal(snapshot.gaps.filter(({ type }) => type === 'excluded_observation').length, 10);
  assert.equal(snapshot.gaps.find(({ type }) => type === 'uninterpreted_quality').verification, 'apparent_requires_investigation');
  assert.equal(snapshot.gaps.some(({ type }) => type === 'research_gap'), false);
  assert.equal(new Set(snapshot.gaps.map(({ id }) => id)).size, snapshot.gaps.length);
  assert.deepEqual(normalize({ ...captured, data }).gaps, snapshot.gaps);
});

test('a returned empty list, an all-excluded list, and an ambiguous no-data message remain distinct', () => {
  const empty = normalize({ metadata: captured.metadata, data: [] });
  assert.equal(empty.emptyReason, 'no_rows_returned');
  assert.equal(empty.coverage.missingHours, 24);
  assert.equal(empty.gaps.length, 24);
  const rejected = normalize({ ...captured, data: [{ ...captured.data[0], v: ' ' }] });
  assert.equal(rejected.emptyReason, 'all_rows_excluded');
  assert.equal(rejected.receivedRows, 1);
  assert.equal(rejected.coverage.missingHours, 24);
  assert.equal(rejected.summary, null);
  const unknown = normalize(ambiguous);
  assert.equal(unknown.emptyReason, 'noaa_no_data');
  assert.equal(unknown.coverage.applicable, false);
  assert.equal(unknown.coverage.missingHours, null);
  assert.deepEqual(unknown.gaps.map(({ type, verification }) => [type, verification]), [
    ['source_coverage_unknown', 'cannot_determine'],
  ]);
  assert.match(unknown.gaps[0].limitation, /cannot establish hourly coverage/);
});

test('malformed, wrong-station, and excessive NOAA responses fail closed', () => {
  for (const payload of [
    null, {}, invalidStation, { data: captured.data }, { ...captured, metadata: { id: '0000000' } },
    { ...captured, data: Array.from({ length: 151 }, () => captured.data[0]) },
    { error: { message: 'No data was found because of an unrelated error.' } },
  ]) assert.throws(() => normalize(payload), { code: 'upstream_unavailable' });
});

test('fetch preserves distinct observation and retrieval timestamps and applies transport bounds', async () => {
  let callCount = 0;
  const started = new Date('2026-11-14T01:12:00Z');
  const fetched = new Date('2026-11-14T01:12:01Z');
  const snapshot = await fetchNoaa(24, {
    now: () => callCount === 0 ? started : fetched,
    fetchImpl: async (actualUrl, options) => {
      callCount++;
      assert.equal(actualUrl, url);
      assert.equal(options.cache, 'no-store');
      assert.equal(options.redirect, 'error');
      assert.ok(options.signal);
      return Response.json(captured);
    },
  });
  assert.equal(callCount, 1);
  assert.equal(snapshot.retrievedAt, fetched.toISOString());
  assert.equal(snapshot.summary.latest.observedAt, '2026-11-14T00:00:00.000Z');
});

test('timeouts include a stalled response body and failures never expose upstream text', async () => {
  const keepAlive = setTimeout(() => {}, 250);
  try {
    const waitForAbort = (signal) => new Promise((_, reject) => {
      signal.addEventListener('abort', () => reject(signal.reason), { once: true });
    });
    await assert.rejects(fetchNoaa(24, {
      timeoutMs: 30, fetchImpl: async (_url, { signal }) => waitForAbort(signal),
    }), { code: 'upstream_timeout' });
    await assert.rejects(fetchNoaa(24, {
      timeoutMs: 30,
      fetchImpl: async (_url, { signal }) => new Response(new ReadableStream({
        async pull() { await waitForAbort(signal); },
      })),
    }), { code: 'upstream_timeout' });
  } finally {
    clearTimeout(keepAlive);
  }
  for (const fetchImpl of [
    async () => Response.json(invalidStation, { status: 400 }),
    async () => new Response('upstream debug page'),
    async () => new Response('x'.repeat(256 * 1024 + 1)),
    async () => { throw new Error('upstream debug log'); },
  ]) {
    await assert.rejects(fetchNoaa(24, { fetchImpl }), (error) => {
      assert.equal(error.code, 'upstream_unavailable');
      assert.doesNotMatch(error.message, /invalid station|debug/i);
      return true;
    });
  }
});
