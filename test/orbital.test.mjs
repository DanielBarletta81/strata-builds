import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { URL } from 'node:url';
import { loadCeres } from '../src/features/orbital/ceres.ts';
import { closestSampleIndex, KM_PER_AU, parseCeresHorizons, sampleMetrics } from '../src/features/orbital/ephemeris.ts';
import horizons from '../src/features/orbital/data/ceres-horizons.json' with { type: 'json' };

const capture = loadCeres();
const dataUrl = new URL('../src/features/orbital/data/', import.meta.url);

test('Ceres source identities, receipts and request settings match the pinned JPL responses', async () => {
  assert.equal(capture.name, '1 Ceres');
  assert.equal(capture.designation, 'A801 AA');
  assert.equal(capture.solutionId, '48');
  assert.equal(capture.epochJdTdb, 2458849.5);
  assert.equal(capture.epochCalendarTdb, '2020-Jan-01.0');
  assert.equal(capture.observationCount, 1075);
  assert.equal(capture.lastObservation, '2021-01-28');
  for (const source of ['horizons', 'sbdb']) {
    const bytes = await readFile(new URL('ceres-' + source + '.json', dataUrl));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), capture[source].sha256);
    assert.match(capture[source].retrievedAt, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  }
  const url = new URL(capture.horizons.url);
  assert.equal(url.origin, 'https://ssd.jpl.nasa.gov');
  for (const [key, value] of Object.entries({
    COMMAND: '1;', CENTER: '500@10', REF_SYSTEM: 'ICRF', REF_PLANE: 'ECLIPTIC',
    TIME_TYPE: 'TDB', OUT_UNITS: 'KM-S', VEC_TABLE: '3', VEC_CORR: 'NONE', STEP_SIZE: '7 d',
  })) assert.equal(url.searchParams.get(key), "'" + value + "'", key);
});

test('TDB dates agree with Julian dates and preserve the full inclusive sampling window', () => {
  const { samples, initialIndex } = capture;
  assert.equal(samples.length, 262);
  assert.equal(samples[0].dateTdb, '2024-01-01');
  assert.equal(samples[0].jdTdb, 2460310.5);
  assert.equal(samples.at(-1).dateTdb, '2029-01-01');
  assert.equal(samples.at(-1).jdTdb, 2462137.5);
  for (const [index, sample] of samples.entries()) {
    assert.equal(sample.jdTdb, 2460310.5 + index * 7);
    assert.match(sample.dateTdb, /^\d{4}-\d{2}-\d{2}$/);
  }
  assert.equal(samples[initialIndex].dateTdb, '2026-06-29');
  assert.equal(closestSampleIndex(samples, samples[0].jdTdb - 7), 0);
  assert.equal(closestSampleIndex(samples, samples.at(-1).jdTdb + 7), samples.length - 1);
});

test('vector norms and radial speeds agree with JPL range and range rate on all 262 samples', () => {
  assert.equal(KM_PER_AU, 149597870.7);
  const first = capture.samples[0];
  assert.deepEqual(first.positionKm, [-163946184.6529322, -378547570.2116277, 18223726.62871115]);
  assert.deepEqual(first.velocityKmS, [15.53770993728705, -8.425614211705865, -3.128943892470462]);
  for (const sample of capture.samples) {
    const values = sampleMetrics(sample);
    assert.ok(Math.abs(values.distanceKm - sample.rangeKm) < 0.000002, sample.dateTdb);
    assert.ok(Math.abs(values.radialKmS - sample.rangeRateKmS) < 0.00000000001, sample.dateTdb);
    assert.ok(Math.abs(values.distanceAu * KM_PER_AU - sample.rangeKm) < 0.000002, sample.dateTdb);
  }
  const known = sampleMetrics({
    positionKm: [KM_PER_AU, 0, 0], velocityKmS: [-3, 4, 0],
  });
  assert.equal(known.distanceAu, 1);
  assert.equal(known.speedKmS, 5);
  assert.equal(known.radialKmS, -3);
});

test('the frozen parser rejects incompatible frames, units, time scales and incomplete data', () => {
  for (const [from, to, reason] of [
    ['Ecliptic of J2000.0', 'Equatorial J2000', /frame/],
    ['Sun (10)', 'Earth (399)', /frame/],
    ['Output units    : KM-S', 'Output units    : AU-D', /frame/],
    ['Calendar Date (TDB)', 'Calendar Date (UTC)', /time scale/],
    ['$$EOE', '$$BROKEN', /complete Horizons/],
    ['2024-Jan-08 00:00:', '2024-Jan-09 00:00:', /calendar and Julian date/],
    ['2024-Jan-08 00:00:', '2024-Feb-30 00:00:', /Invalid Horizons calendar date/],
    ['-1.639461846529322E+08', 'NaN', /numeric/],
  ]) {
    assert.throws(() => parseCeresHorizons({ ...horizons, result: horizons.result.replace(from, to) }), reason);
  }
  assert.throws(() => parseCeresHorizons({ ...horizons, result: horizons.result.replace(/EPOCH=/g, 'EPOCX=') }), /solution epoch/);
  assert.throws(() => parseCeresHorizons({ ...horizons, signature: { ...horizons.signature, version: '1.3' } }), /signature/);
  const skipped = horizons.result.replace(/^2460317\.5.*\n/m, '');
  assert.throws(() => parseCeresHorizons({ ...horizons, result: skipped }), /complete seven-day grid/);
});

test('orbital evidence keeps source differences and uncertainty within the capture scope', () => {
  assert.equal(capture.findings.length, 4);
  const model = capture.findings.find(({ id }) => id.endsWith('-model'));
  assert.deepEqual(model.sources, ['Horizons', 'Small-Body Database']);
  assert.match(model.directEvidence, /SB441-N16 .* SB441-N373/);
  assert.equal(model.verification, 'Cannot determine from available records');
  const coverage = capture.findings.find(({ id }) => id.endsWith('-interval'));
  assert.equal(coverage.verification, 'Confirmed within source scope');
  assert.match(coverage.limitation, /between samples or beyond its endpoints/);
  assert.ok(capture.findings.every(({ limitation, nextAction }) => limitation && nextAction));
});
