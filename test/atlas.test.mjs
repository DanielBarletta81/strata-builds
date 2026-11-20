import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { createDemoDataset, DEMO_SOURCE } from '../src/features/atlas/demo.ts';
import { findNeighborhoodFlags, fitMap, project } from '../src/features/atlas/geography.ts';
import { createAtlasModel } from '../src/features/atlas/model.ts';
import { mapPointIndex } from '../src/features/atlas/map-keyboard.ts';
import { summarizeAssignments, validateSamples } from '../src/features/atlas/records.ts';
import pinned from './fixtures/atlas-pinned-demo.json' with { type: 'json' };

test('synthetic records match the pinned generator across independent runs', () => {
  const dataset = createDemoDataset();
  assert.deepEqual(createDemoDataset(), dataset);
  assert.equal(dataset.provenance.revision, pinned.revision);
  assert.equal(dataset.provenance.classification, 'synthetic');
  assert.equal(dataset.samples.length, pinned.recordCount);
  assert.deepEqual(dataset.rejected, []);

  const coreRecords = dataset.samples.map(({ id, lat, lon, assignment, site }) => ({
    id, lat, lon, assignment, site,
  }));
  assert.equal(createHash('sha256').update(JSON.stringify(coreRecords)).digest('hex'), pinned.recordsSha256);
  assert.deepEqual(coreRecords[0], pinned.firstRecord);
  assert.deepEqual(coreRecords.at(-1), pinned.lastRecord);
  assert.ok(dataset.samples.every(sample =>
    sample.classification === 'synthetic' && sample.datasetId === dataset.provenance.datasetId));
});

test('validation accepts finite in-range coordinates and known assignments with an optional site', () => {
  const baseline = { id: 'origin', lat: 0, lon: 0, assignment: 'Hudson' };
  const rows = [
    baseline,
    { ...baseline, id: 'seam', lat: -90, lon: 180, site: ' Example site ' },
    { ...baseline, id: 'origin' },
    { ...baseline, id: 'bad-latitude', lat: 90.0001 },
    { ...baseline, id: 'bad-longitude', lon: -180.0001 },
    { ...baseline, id: 'blank-coordinate', lat: '' },
    { ...baseline, id: 'partial-coordinate', lon: '10 degrees' },
    { ...baseline, id: 'nonfinite', lat: Infinity },
    { ...baseline, id: 'unknown-assignment', assignment: 'Unknown' },
    { ...baseline, id: 'blank-site', site: ' ' },
    { ...baseline, id: ' ' },
    null,
  ];

  const dataset = validateSamples(rows, DEMO_SOURCE);
  assert.deepEqual(dataset.samples.map(({ id, lat, lon, site }) => ({ id, lat, lon, site })), [
    { id: 'origin', lat: 0, lon: 0, site: null },
    { id: 'seam', lat: -90, lon: 180, site: 'Example site' },
  ]);
  assert.deepEqual(dataset.rejected, [
    { row: 3, id: 'origin', reason: 'duplicate_id' },
    { row: 4, id: 'bad-latitude', reason: 'invalid_latitude' },
    { row: 5, id: 'bad-longitude', reason: 'invalid_longitude' },
    { row: 6, id: 'blank-coordinate', reason: 'invalid_latitude' },
    { row: 7, id: 'partial-coordinate', reason: 'invalid_longitude' },
    { row: 8, id: 'nonfinite', reason: 'invalid_latitude' },
    { row: 9, id: 'unknown-assignment', reason: 'invalid_assignment' },
    { row: 10, id: 'blank-site', reason: 'invalid_site' },
    { row: 11, id: null, reason: 'invalid_id' },
    { row: 12, id: null, reason: 'invalid_record' },
  ]);
});

test('site composition matches the pinned counts and north-to-south order', () => {
  const { samples } = createDemoDataset();
  const { sites, totals } = summarizeAssignments(samples);
  assert.deepEqual(sites.map(({ site, total, counts }) => ({ site, total, counts })), pinned.sites);
  assert.equal(Object.values(totals).reduce((sum, count) => sum + count, 0), pinned.recordCount);
  assert.equal(sites.reduce((sum, site) => sum + site.total, 0), pinned.recordCount);
});

test('map model attaches coordinates and the same neighborhood flags to every plotted record', () => {
  const { samples } = createDemoDataset();
  const model = createAtlasModel();
  assert.deepEqual(model.points.map(point => point.id), samples.map(sample => sample.id));
  assert.ok(model.points.every(point => Number.isFinite(point.x) && Number.isFinite(point.y)));
  assert.ok(model.points.every(point => point.x > 0 && point.x < 920 && point.y > 0 && point.y < 660));
  assert.deepEqual(Object.fromEntries(model.points
    .filter(point => point.neighborAssignment)
    .map(point => [point.id, point.neighborAssignment])), pinned.flags);
  assert.equal(model.flaggedCount, Object.keys(pinned.flags).length);
  assert.equal(model.legend.reduce((total, item) => total + item.count, 0), pinned.recordCount);

  const empty = createAtlasModel(validateSamples([], DEMO_SOURCE));
  assert.deepEqual(empty.points, []);
  assert.equal(empty.flaggedCount, 0);
  assert.ok(empty.coastline.length > 0);
  assert.ok(empty.coastline.every(path => path.startsWith('M') && !path.includes('NaN')));
});

test('the map projection keeps north above south and east to the right', () => {
  const points = [{ lat: 37, lon: -76 }, { lat: 42, lon: -70 }];
  const view = fitMap(points, 920, 660);
  const [west, south] = project(-76, 37, view);
  const [east, north] = project(-70, 42, view);
  assert.ok(west < east && north < south);
  const center = fitMap([{ lat: 41, lon: -72 }], 920, 660);
  assert.deepEqual(project(-72, 41, center).map(Math.round), [460, 330]);
});

test('neighborhood flags require three of the five closest to share one different assignment', () => {
  function line(assignments) {
    return validateSamples(assignments.map((assignment, i) => ({
      id: `sample-${i}`, lat: 40 + i * 0.01, lon: -72, assignment,
    })), DEMO_SOURCE).samples;
  }
  const majority = line(['Hudson', 'Chesapeake', 'Chesapeake', 'Chesapeake', 'Hudson',
    'Delaware', 'Hudson', 'Hudson']);
  assert.equal(findNeighborhoodFlags(majority).get('sample-0'), 'Chesapeake');
  assert.equal(findNeighborhoodFlags(majority.slice(0, 7)).size, 0);

  const split = line(['Hudson', 'Chesapeake', 'Delaware', 'Chesapeake', 'Hudson',
    'Delaware', 'Chesapeake', 'Chesapeake']);
  assert.equal(findNeighborhoodFlags(split).has('sample-0'), false);
  assert.equal(findNeighborhoodFlags(line(Array(8).fill('Hudson'))).size, 0);
});

test('map keyboard movement wraps and only handles movement keys', () => {
  assert.equal(mapPointIndex('ArrowLeft', 0, 3), 2);
  assert.equal(mapPointIndex('ArrowUp', 0, 3), 2);
  assert.equal(mapPointIndex('ArrowRight', 2, 3), 0);
  assert.equal(mapPointIndex('ArrowDown', 0, 3), 1);
  assert.equal(mapPointIndex('Home', 2, 3), 0);
  assert.equal(mapPointIndex('End', 0, 3), 2);
  assert.equal(mapPointIndex('ArrowRight', 0, 0), null);
  for (const key of ['Tab', 'Enter', ' ']) assert.equal(mapPointIndex(key, 0, 3), null);
});
