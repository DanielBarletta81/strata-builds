import assert from 'node:assert/strict';
import test from 'node:test';
import { comparisonSeries, figureArchive, growth, growthUnits, mortality, mortalityMetrics, mortalityRecord, periodsFor, recordsForPeriod, report } from '../src/features/bass-2003/report.ts';

test('Table 1 preserves every printed estimate, period, method and season', () => {
  assert.equal(mortality.locator, 'Table 1');
  assert.deepEqual(mortality.rows.map(({ period, season, method, group, scope, z, s, a }) => [
    period, season, method, group, scope, z, s, a,
  ]), [
    ['1995', 'Spring', 'Electrofishing', 'Unstocked', 'Annual', '0.60', '0.55', '0.45'],
    ['1996', 'Spring', 'Electrofishing', 'Unstocked', 'Annual', '0.57', '0.56', '0.44'],
    ['1997', 'Spring', 'Electrofishing', 'Unstocked', 'Annual', '0.55', '0.58', '0.42'],
    ['1998', 'Spring', 'Electrofishing', 'Unstocked', 'Annual', '0.47', '0.62', '0.38'],
    ['1995–1998 pooled', 'Spring', 'Electrofishing', 'Unstocked', 'Pooled', '0.64', '0.53', '0.47'],
    ['1999', 'Fall', 'Angling', 'Stocked', 'Annual', '0.58', '0.56', '0.44'],
    ['1999', 'Fall', 'Electrofishing', 'Stocked', 'Annual', '0.39', '0.68', '0.32'],
    ['2000', 'Fall', 'Angling', 'Stocked', 'Annual', '0.66', '0.52', '0.48'],
    ['2000', 'Fall', 'Electrofishing', 'Stocked', 'Annual', '0.55', '0.57', '0.43'],
    ['2001', 'Fall', 'Angling', 'Stocked', 'Annual', '0.60', '0.55', '0.45'],
    ['2001', 'Fall', 'Electrofishing', 'Stocked', 'Annual', '0.49', '0.61', '0.39'],
    ['2002', 'Fall', 'Angling', 'Stocked', 'Annual', '0.49', '0.61', '0.39'],
    ['2002', 'Fall', 'Electrofishing', 'Stocked', 'Annual', '0.52', '0.60', '0.40'],
    ['1999–2002 pooled', 'Fall', 'Angling', 'Stocked', 'Pooled', '0.64', '0.53', '0.47'],
    ['1999–2002 pooled', 'Fall', 'Electrofishing', 'Stocked', 'Pooled', '0.57', '0.56', '0.44'],
  ]);
  assert.equal(mortalityMetrics.z.scale, 'Rate per year for annual age steps');
  assert.equal(mortalityMetrics.s.scale, 'Fraction surviving one year');
  assert.equal(mortalityMetrics.a.scale, 'Fraction dying within one year');
});

test('comparison series contain four annual rows and one separate published pooled estimate', () => {
  const baseline = comparisonSeries(mortalityRecord('1995', 'Electrofishing'));
  assert.deepEqual(baseline.map(({ period }) => period), periodsFor('Unstocked'));
  for (const method of ['Electrofishing', 'Angling']) {
    const series = comparisonSeries(mortalityRecord('1999', method));
    assert.deepEqual(series.map(({ period }) => period), periodsFor('Stocked'));
    assert.ok(series.every((row) => row.method === method && row.season === 'Fall' && row.group === 'Stocked'));
    assert.deepEqual(series.map(({ scope }) => scope), ['Annual', 'Annual', 'Annual', 'Annual', 'Pooled']);
  }
  assert.equal(baseline.at(-1).z, '0.64');
  assert.notEqual(Number(baseline.at(-1).z), baseline.slice(0, 4).reduce((sum, row) => sum + Number(row.z), 0) / 4);
});

test('rounded survival and mortality are printed as supplied while comparable checks stay in tests', () => {
  for (const { z, s, a } of mortality.rows) {
    assert.ok(Math.abs(Number(s) + Number(a) - 1) < 1e-12);
    assert.ok(Math.abs(Math.exp(-Number(z)) - Number(s)) < 0.01);
  }
  assert.equal(mortalityRecord('2002', 'Electrofishing').s, '0.60');
});

test('Table 2 preserves exact parameter values and keeps the trajectory convention unresolved', () => {
  assert.equal(growth.locator, 'Table 2');
  assert.equal(growth.t0Convention, 'unverified');
  assert.deepEqual(growth.rows, [
    { group: 'Unstocked systems', period: '1995–1998 pooled', asymptoteMm: '573.84', t0Years: '0.14', k: '0.21' },
    { group: 'Stocked systems', period: '2002', asymptoteMm: '491.80', t0Years: '0.58', k: '0.24' },
  ]);
  assert.deepEqual(growthUnits, { asymptoteMm: 'mm', t0Years: 'years', k: 'Unit not supplied in the transcription' });
});

test('unavailable methods, source files and figure values stay missing', () => {
  assert.deepEqual(recordsForPeriod('1995').map(({ method }) => method), ['Electrofishing']);
  assert.equal(mortalityRecord('1995', 'Angling'), undefined);
  assert.deepEqual(recordsForPeriod('2003'), []);
  assert.equal(report.sourceType, 'researcher_supplied_transcription');
  assert.equal(report.sourceFileVerification, 'pending');
  assert.equal(report.sourceFile, null);
  assert.equal(report.sourceSha256, null);
  assert.equal(figureArchive.sourceFileVerification, 'pending');
  assert.equal(figureArchive.annotationDecimalPlacesReportedByResearcher, 3);
  assert.deepEqual(figureArchive.records, []);
});
