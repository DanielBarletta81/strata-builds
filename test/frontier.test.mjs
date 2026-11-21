import assert from 'node:assert/strict';
import test from 'node:test';
import bullock from '../src/features/frontier/data/bullock-2012.json' with { type: 'json' };
import weeks from '../src/features/frontier/data/station-ii-weeks.json' with { type: 'json' };
import { bullockCoverage, civilDate, classifyDay, DEPLOYMENT, parseBullock, parseWeeks, planktonCoverage, samplingDifferences } from '../src/features/frontier/coverage.ts';
import { loadInvestigation } from '../src/features/frontier/investigation.ts';

test('validates workbook civil dates without imposing a timezone or accepting rollovers', () => {
  assert.equal(civilDate('2012-02-29'), '2012-02-29');
  for (const date of ['2011-02-29', '2012-06-31', '2012-05-17T05:00:00Z', '5/17/2012']) {
    assert.throws(() => civilDate(date), /Invalid civil date/);
  }
});

test('reads the archived B4 grid and excludes partial endpoints from confirmed blanks', () => {
  const days = parseBullock(bullock);
  assert.equal(days.length, 194);
  assert.equal(days[0].date, '2012-05-17');
  assert.equal(days.at(-1).date, '2012-11-26');
  assert.equal(days.reduce((sum, day) => sum + day.slots, 0), 18624);
  assert.equal(days.reduce((sum, day) => sum + day.reported, 0), 18517);
  const result = loadInvestigation();
  assert.equal(result.expected, 18432);
  assert.equal(result.reported, 18421);
  assert.equal(result.blanks.length, 11);
  assert.equal(result.blankDates, 10);
  assert.deepEqual(result.blanks.filter(({ date }) => date === '2012-07-10'), [
    { date: '2012-07-10', time: '09:30', row: 5230 },
    { date: '2012-07-10', time: '09:45', row: 5231 },
  ]);
  assert.equal(result.outsideDays, 172);
  assert.equal(result.months.reduce((sum, month) => sum + month.boundaryDays, 0), 2);
});

test('planned absence, unverified coverage and confirmed workbook blanks remain distinct', () => {
  const days = parseBullock(bullock);
  const july10 = days.find(({ date }) => date === '2012-07-10');
  assert.equal(classifyDay('2012-01-01', undefined, DEPLOYMENT), 'outside_plan');
  assert.equal(classifyDay('2012-05-17', days[0], DEPLOYMENT), 'boundary');
  assert.equal(classifyDay('2012-07-10', july10, DEPLOYMENT), 'blank_grid_slots');
  assert.equal(classifyDay('2012-07-10', undefined, DEPLOYMENT), 'unknown');
  assert.equal(classifyDay('2012-07-10', undefined), 'unknown');
  const july = bullockCoverage(days.filter(({ date }) => date !== '2012-07-10'))[6];
  assert.equal(july.unknownSlots, 96);
  assert.equal(july.blanks.length, 0);
  assert.throws(() => parseBullock([july10, july10]), /duplicate daily grid/);
  assert.throws(() => parseBullock([{ ...july10, reported: 0 }]), /daily grid/);
});

test('uses BCO-DMO week labels and preserves a verified zero count separately from unavailable coverage', () => {
  const parsed = parseWeeks(weeks);
  assert.deepEqual([2011, 2012, 2013].map((year) => planktonCoverage(parsed, year).reported), [32, 0, 46]);
  assert.equal(planktonCoverage(parsed, 2020).reported, null);
  assert.equal(planktonCoverage(parsed.slice(1), 1997).reported, null);
  assert.throws(() => parseWeeks([{ year: 2012, week: 0, temperaturePresent: false }]), /Invalid archive week/);
  assert.throws(() => parseWeeks([{ year: 2012, week: 1, temperaturePresent: 'nd' }]), /Invalid archive week/);
  assert.throws(() => parseWeeks([weeks[0], weeks[0]]), /Duplicate archive week/);
});

test('equal units do not establish compatibility across different sampling designs', () => {
  const first = { station: 'B4-S', depth: '0.5–1 m', units: '°C', device: 'sonde', cadence: '15 minutes', timeSupport: 'civil times' };
  assert.deepEqual(samplingDifferences(first, first), []);
  assert.deepEqual(loadInvestigation().incompatibleFields, ['station', 'depth', 'device', 'cadence', 'timeSupport']);
});

test('findings carry rules, source evidence and next actions with scoped verification', () => {
  const { findings } = loadInvestigation();
  assert.deepEqual(findings.map(({ type }) => type), [
    'confirmed_missing_observation', 'planned_seasonal_non_sampling', 'confirmed_missing_observation',
    'incompatible_sampling_methods', 'conflicting_records', 'uncertain_monitoring_continuation',
  ]);
  const conflict = findings.find(({ id }) => id === 'location-conflict');
  assert.equal(conflict.verification, 'apparent_requires_investigation');
  assert.equal(findings.find(({ id }) => id === 'post-2019').verification, 'cannot_determine');
  assert.ok(findings.every(({ sources, scope, detection, directEvidence, assumptions, nextAction }) =>
    sources.length && scope.location && scope.period.start && detection && directEvidence && assumptions && nextAction));
});
