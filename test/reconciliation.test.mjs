import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { URL } from 'node:url';
import { bullockClaim, bullockClassification, bullockRows, legacyEqual, legacyRows, stationClaim, stationYears } from '../src/features/evidence/reconciliation/cases.ts';
import { comparisonOutcome, matchClock, summarizeWeeks, temperaturePresence } from '../src/features/evidence/reconciliation/matching.ts';
import { sources } from '../src/features/evidence/reconciliation/sources.ts';
import primary from '../src/features/evidence/reconciliation/data/primary.json' with { type: 'json' };

const fixture = new URL('../src/features/evidence/reconciliation/data/primary.json', import.meta.url);
const sameClock = { kind: 'same_time_convention' };
const b4Offset = { kind: 'scoped_clock_alignment', offsetSeconds: 64 };
const target = { date: '2012-07-10', clock: '09:15:00' };
const adjacent = primary.bullock.rawText[1];

test('the derived capture and original archive/version pins are stable', () => {
  assert.equal(primary.schemaVersion, 1);
  assert.equal(createHash('sha256').update(readFileSync(fixture)).digest('hex'), '4ef410e37c41ef1186e31dfb61e20013d9beddc7b68526d5ee1d533dea430122');
  assert.equal(primary.files.ridem.sha256, 'faa31c9b5bc784cd1971807fa873d4f7242f87bb662798374bbc837e1a48e8e4');
  assert.equal(sources.stationCsv.sha256, '4b3a66d2e6aeead290bbd148d03aee727112b6be461366196fc32360cdf2f252');
  assert.match(sources.stationCsv.version, /874956 v1.*10\.26008\/1912\/bco-dmo\.874956\.1/);
  assert.equal(sources.edited.retrievedAt, '2026-11-21T00:28:32Z');
  assert.equal(sources.stationCsv.retrievedAt, '2026-11-21T00:26:51Z');
});

test('exact, scoped-offset, duplicate and unavailable records remain distinct', () => {
  assert.equal(matchClock(target, [target], sameClock).status, 'matched');
  assert.equal(matchClock(target, [adjacent], sameClock).status, 'missing');
  assert.deepEqual(matchClock(target, [adjacent], b4Offset), { status: 'matched', record: adjacent, offsetSeconds: 64 });
  assert.deepEqual(matchClock(target, [adjacent, adjacent], b4Offset), { status: 'ambiguous', reason: 'duplicate_time' });
  assert.deepEqual(matchClock(target, [adjacent], { kind: 'unverified' }), { status: 'ambiguous', reason: 'time_convention' });
  assert.deepEqual(matchClock({ ...target, clock: null }, [adjacent], b4Offset), { status: 'ambiguous', reason: 'target_time_missing' });
  assert.deepEqual(matchClock(target, [{ ...adjacent, clock: '??' }], b4Offset), { status: 'ambiguous', reason: 'candidate_time_missing' });
  assert.equal(matchClock(target, [], b4Offset).status, 'missing');
  assert.equal(matchClock(target, null, b4Offset).status, 'unavailable');
  assert.deepEqual(matchClock({ ...target, clock: '23:59:00' }, [adjacent], b4Offset), { status: 'ambiguous', reason: 'scope_boundary' });
});

test('all four July anchors match all products and both targets remain absent from reviewed raw products', () => {
  assert.deepEqual(bullockRows.filter(({ raw }) => raw).map(({ clock, raw, worksheet, edited, corrected }) => [
    clock, raw.locator, worksheet.locator, edited.originalValue, corrected.originalValue,
  ]), [
    ['09:00:00', 'Line 20147', 'BullocksReach_Surface!C5181', '23.27', '23.27'],
    ['09:15:00', 'Line 20148', 'BullocksReach_Surface!C5182', '23.49', '23.49'],
    ['10:00:00', 'Line 20149', 'BullocksReach_Surface!C5183', '23.37', '23.37'],
    ['10:15:00', 'Line 20150', 'BullocksReach_Surface!C5184', '23.35', '23.35'],
  ]);
  assert.deepEqual(bullockRows.filter(({ raw }) => !raw).map(({ edited, corrected, worksheet, finding }) => [
    edited.locator, edited.status, worksheet, corrected.originalValue, corrected.status, finding,
  ]), [
    ['BR!F5230', 'excluded', null, '23.473333333333333', 'derived', 'No corresponding raw value found in the reviewed files'],
    ['BR!F5231', 'excluded', null, '23.509999999999998', 'derived', 'No corresponding raw value found in the reviewed files'],
  ]);
  assert.deepEqual(primary.bullock.corrected.filter(({ bold }) => bold).map(({ formula }) => formula), [null, null]);
  assert.equal(bullockClaim.outcome, 'partially_resolved');
  for (const record of primary.bullock.clockChecks.edited) {
    const match = matchClock(record, primary.bullock.clockChecks.rawText, b4Offset);
    assert.equal(match.status, 'matched');
    assert.equal(match.record.clock, '07:31:04');
    assert.equal(record.value, null);
  }
});

test('record disagreements and access limitations never become agreement or removal', () => {
  assert.equal(comparisonOutcome('5', '5.0', 'verified'), 'direct_record_match');
  assert.equal(comparisonOutcome('5', '5.25', 'verified'), 'unresolved_source_conflict');
  assert.equal(comparisonOutcome('5', '5', 'ambiguous'), 'not_comparable');
  assert.equal(comparisonOutcome('', '0', 'verified'), 'not_comparable');
  assert.equal(comparisonOutcome('5', null, 'source_unavailable'), 'unresolved_missing_records');
  const row = bullockRows[2];
  const a = matchClock(target, [adjacent], b4Offset);
  const b = matchClock(target, [{ ...adjacent, value: '0' }], b4Offset);
  assert.equal(bullockClassification(a, b, row.edited, row.corrected), 'Correspondence ambiguous');
  assert.equal(bullockClassification({ status: 'unavailable' }, b, row.edited, row.corrected), 'Source records unavailable or incomplete');
});

test('archive weeks use documented nd only and preserve zero and negative numeric values', () => {
  assert.equal(temperaturePresence('nd'), 'missing');
  for (const value of ['0', '-0.40', '5.25']) assert.equal(temperaturePresence(value), 'numeric');
  for (const value of ['', '   ', 'NA', 'Infinity', '1e400', '0x10']) assert.equal(temperaturePresence(value), 'unrecognized');
  assert.throws(() => summarizeWeeks([primary.station[0], primary.station[0]]), /Duplicate/);
  assert.throws(() => summarizeWeeks([{ year: 1998, week: 1, field: '' }]), /Unrecognized/);
  assert.deepEqual(stationYears.map(({ year, total, populated, missing, records }) => [
    year, total, populated, missing, records[0].row, records.at(-1).row,
  ]), [
    [1997, 52, 16, 36, 1978, 2029], [1998, 52, 0, 52, 2030, 2081],
    [1999, 52, 42, 10, 2082, 2133], [2012, 52, 0, 52, 2758, 2809],
  ]);
});

test('legacy 1997 matches and disagreements retain distinct source locators', () => {
  assert.equal(legacyEqual, 15);
  assert.deepEqual(legacyRows.filter((row) => row.relation === 'different').map(({ row, week }) => [row, week]), [[1984, 7], [1985, 8]]);
  assert.equal(stationClaim.outcome, 'unresolved_source_conflict');
  assert.equal(stationClaim.compared[0].source.url, 'https://www.bco-dmo.org/dataset/874956');
  assert.equal(stationClaim.compared[0].status, 'published_statement');
  assert.match(stationClaim.compared[0].originalValue, /1997-1999; 2012/);
  assert.equal(stationClaim.compared[1].locator, 'CSV line 1978, Temperature_SURF');
  assert.equal(stationClaim.compared[1].status, 'present_unverified');
  assert.equal(stationClaim.compared.find((row) => row.time === '1997, archive week 7').originalValue, 'nd');
});
