import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { URL } from 'node:url';
import registry from '../src/features/bass-2003/photo-registry.json' with { type: 'json' };
import { catchCurveSourceStates, evidenceLayerForKey, evidenceLayers } from '../src/features/bass-2003/catch-curve-evidence.ts';
import { catchCurveAudit, catchCurveTableRecord, catchCurves, photoReceipts, printedFitAges, selectedCatchCurve } from '../src/features/bass-2003/catch-curves.ts';
import { figure4AuditFor } from '../src/features/bass-2003/figure4-audit.ts';
import { comparisonSeries, growth, growthUnits, mortality, mortalityMetrics, mortalityRecord, mortalityRowId, periodsFor, recordsForPeriod, report } from '../src/features/bass-2003/report.ts';

test('evidence tabs use wrapping arrow navigation and support Home and End', () => {
  assert.deepEqual(evidenceLayers.map(({ id }) => id), ['published', 'source-quality', 'open-questions']);
  assert.equal(evidenceLayerForKey('published', 'ArrowLeft'), 'open-questions');
  assert.equal(evidenceLayerForKey('published', 'ArrowRight'), 'source-quality');
  assert.equal(evidenceLayerForKey('source-quality', 'ArrowRight'), 'open-questions');
  assert.equal(evidenceLayerForKey('open-questions', 'ArrowRight'), 'published');
  assert.equal(evidenceLayerForKey('source-quality', 'Home'), 'published');
  assert.equal(evidenceLayerForKey('published', 'End'), 'open-questions');
  assert.equal(evidenceLayerForKey('published', 'Tab'), undefined);
});

test('source-quality rows distinguish verified records, readable ticks, and withheld reconstruction', () => {
  const figure4 = selectedCatchCurve(catchCurves, 'figure-4');
  assert.deepEqual(catchCurveSourceStates(figure4), [
    { label: 'Printed metadata', status: 'Verified' },
    { label: 'Source photograph', status: 'Verified' },
    { label: 'Axis tick labels', status: 'Readable' },
    { label: 'Pixel calibration', status: 'Unresolved' },
    { label: 'Independent reading', status: 'Unresolved' },
    { label: 'Digitized observations', status: 'Withheld' },
    { label: 'Regression reconstruction', status: 'Withheld' },
  ]);
  assert.equal(figure4AuditFor(figure4).points, null);
  assert.equal(figure4AuditFor(figure4).tracedRegression, null);
  for (const figure of catchCurves.filter(({ id }) => id !== 'figure-4')) {
    assert.deepEqual(catchCurveSourceStates(figure).map(({ status }) => status), ['Verified', 'Verified', 'Withheld', 'Withheld']);
  }
});

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

test('both literal table row blocks match their SHA-256 digests from the Phase 1 squash merge', () => {
  const input = readFileSync(new URL('../src/features/bass-2003/transcription.json', import.meta.url), 'utf8');
  const rows = input.match(/^ {4}"rows": \[\n.*?^ {4}\]/gms);
  assert.deepEqual(rows?.map((block) => createHash('sha256').update(block).digest('hex')), [
    'aa526db0849deb342d5feefc976812eb649dfb85e5d648f6946c8d39cef4a6f7',
    'a223541adfb80b26295c183c59b23e69fc8cf2b00ffe0bd83fd2a8ec729c9909',
  ]);
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

test('unavailable methods and the complete original report file stay missing', () => {
  assert.deepEqual(recordsForPeriod('1995').map(({ method }) => method), ['Electrofishing']);
  assert.equal(mortalityRecord('1995', 'Angling'), undefined);
  assert.deepEqual(recordsForPeriod('2003'), []);
  assert.equal(report.sourceType, 'researcher_supplied_transcription');
  assert.equal(report.sourceFileVerification, 'pending');
  assert.equal(report.sourceFile, null);
  assert.equal(report.sourceSha256, null);
});

test('retains all seven exact figure annotations alongside the corresponding printed Table 1 record', () => {
  assert.deepEqual(catchCurves.map((figure) => {
    const table = catchCurveTableRecord(figure);
    assert.equal(table.period, figure.period);
    assert.equal(table.method, figure.method);
    assert.equal(table.scope, figure.scope);
    assert.equal(table.group, figure.group);
    assert.equal(table.season, figure.season);
    assert.match(figure.printedZ, /^0\.\d{3}$/);
    assert.match(table.z, /^0\.\d{2}$/);
    return [figure.sourceFile, figure.period, figure.method, figure.scope, figure.printedZ, table.z, table.season];
  }), [
    ['IMG_3954.jpg', '1995', 'Electrofishing', 'Annual', '0.604', '0.60', 'Spring'],
    ['IMG_3955.jpg', '1996', 'Electrofishing', 'Annual', '0.573', '0.57', 'Spring'],
    ['IMG_3956.jpg', '1998', 'Electrofishing', 'Annual', '0.472', '0.47', 'Spring'],
    ['IMG_3957.jpg', '1995–1998 pooled', 'Electrofishing', 'Pooled', '0.638', '0.64', 'Spring'],
    ['IMG_3960.jpg', '2000', 'Angling', 'Annual', '0.660', '0.66', 'Fall'],
    ['IMG_3962.jpg', '2001', 'Electrofishing', 'Annual', '0.487', '0.49', 'Fall'],
    ['IMG_3966.jpg', '1999–2002 pooled', 'Electrofishing', 'Pooled', '0.573', '0.57', 'Fall'],
  ]);
  assert.equal(catchCurveTableRecord({ ...catchCurves[0], scope: 'Pooled' }), undefined);
  assert.equal(catchCurveTableRecord({ ...catchCurves[0], group: 'Stocked' }), undefined);
  assert.equal(catchCurveTableRecord({ ...catchCurves[0], season: 'Fall' }), undefined);
  assert.equal(catchCurveTableRecord({ ...catchCurves[0], method: 'Angling' }), undefined);
  assert.equal(mortalityRowId(catchCurveTableRecord(catchCurves.at(-1))), 'table-1-1999-2002-pooled-electrofishing');
  assert.equal(new Set(mortality.rows.map(mortalityRowId)).size, 15);
});

test('selects verified figure identifiers and handles unavailable sources', () => {
  assert.deepEqual(catchCurves.map(({ id }) => id), ['img_3954', 'figure-2', 'figure-4', 'img_3957', 'img_3960', 'img_3962', 'img_3966']);
  assert.ok(catchCurves.every(({ pageNumber }) => pageNumber === null));
  assert.equal(catchCurveAudit.status, 'verified_metadata');
  assert.equal(selectedCatchCurve(catchCurves, 'figure-4').sourceFile, 'IMG_3956.jpg');
  assert.equal(selectedCatchCurve(catchCurves, 'missing').id, 'img_3954');
  assert.equal(selectedCatchCurve([], 'img_3954'), undefined);
});

test('Figure 4 binds the source-quality audit to the pinned photograph and printed estimates', () => {
  const figure = selectedCatchCurve(catchCurves, 'figure-4');
  const audit = figure4AuditFor(figure);
  assert.equal(audit.sourceFile, 'IMG_3956.jpg');
  assert.equal(audit.sha256, photoReceipts['IMG_3956.jpg'].sha256);
  assert.equal(audit.sourceType, 'photograph_of_printed_figure');
  assert.deepEqual(audit.dimensions, [2048, 1536]);
  assert.equal(figure.captionNumber, 'Figure 4');
  assert.equal(figure.printedZ, '0.472');
  assert.equal(catchCurveTableRecord(figure).z, '0.47');
  assert.deepEqual(printedFitAges, [3, 10]);
  assert.equal(figure4AuditFor({ ...figure, sourceFile: 'IMG_3955.jpg' }), undefined);
  assert.equal(catchCurves.filter(figure4AuditFor).length, 1);
});

test('readable Figure 4 ticks do not authorize any calibration, plotted coordinates or trace', () => {
  const audit = figure4AuditFor(selectedCatchCurve(catchCurves, 'figure-4'));
  assert.equal(audit.status, 'reconstruction_blocked');
  assert.deepEqual(audit.ageTickLabels, ['0', '2', '4', '6', '8', '10', '12']);
  assert.deepEqual(audit.lnFrequencyTickLabels, ['0.00', '1.00', '2.00', '3.00', '4.00', '5.00']);
  assert.equal(audit.calibration.pixelToDataTransform, null);
  assert.equal(audit.calibration.independentReading, null);
  assert.equal(audit.points, null);
  assert.equal(audit.tracedRegression, null);
  assert.match(audit.findings.find(({ label }) => label === 'Zero-axis marks').note, /meanings remain unresolved/);
});

test('pins photo receipts and preserves missing bounds, obscured captions and unvalidated coordinates', () => {
  assert.equal(Object.keys(photoReceipts).length, 16);
  assert.equal(new Set(Object.values(photoReceipts).map(({ sha256 }) => sha256)).size, 16);
  assert.equal(photoReceipts['IMG_3954.jpg'].sha256, 'ff5470607326715580300c37ef6d08dc00dfded287a75fe06ab55001a4597297');
  assert.equal(photoReceipts['IMG_3966.jpg'].sha256, 'b4acdb55deca2c35df6bc5ff88f4566961c8f4eadb3a9861bb03de81f7d0adad');
  for (const { sourceFile } of catchCurves) assert.match(photoReceipts[sourceFile].sha256, /^[0-9a-f]{64}$/);
  assert.deepEqual(printedFitAges, [3, 10]);
  assert.deepEqual(catchCurves.map(({ captionNumber }) => captionNumber), [null, 'Figure 2', 'Figure 4', null, null, null, null]);
  assert.match(catchCurves[3].locator, /Results.*Figure 5/);
  assert.match(catchCurves[6].locator, /Results.*Figure 15/);
  assert.deepEqual(catchCurves[5].ageTicks, ['0', '10']);
  assert.deepEqual(catchCurves.filter(({ ageUpperBoundCropped }) => ageUpperBoundCropped).map(({ period }) => period), ['2001']);
  assert.deepEqual(catchCurves[0].lnFrequencyTicks, ['0.00', '5.00']);
  assert.match(catchCurves[2].legibility, /zero axis/);
  assert.equal(registry.extractedCoordinates, null);
  assert.equal(registry.tracedRegression, null);
  for (const figure of catchCurves) assert.equal(Object.hasOwn(figure, 'rawCounts'), false);
});
