import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { URL } from 'node:url';
import { chronology } from '../src/features/deep-time/chronology.ts';
import { initialSelection, selectEvent, setZoom, timeWindow } from '../src/features/deep-time/time.ts';
import { formatCoordinates, hasTethysReconstruction, tethysSources } from '../src/features/deep-time/tethys/model.ts';
import geometry from '../src/features/deep-time/tethys/data/reconstruction-111.json' with { type: 'json' };
import validation from '../src/features/deep-time/tethys/data/validation-111.json' with { type: 'json' };
import receipt from '../src/features/deep-time/tethys/data/receipt-111.json' with { type: 'json' };

const assetHash = async (name) => createHash('sha256').update(
  await readFile(new URL(`../src/features/deep-time/tethys/data/${name}`, import.meta.url)),
).digest('hex');

test('binds the reconstruction and comparison receipts to the reviewed sources and products', async () => {
  assert.equal(await assetHash('sources.json'), receipt.sourceManifestSha256);
  for (const [name, expected] of Object.entries(receipt.products)) assert.equal(await assetHash(name), expected);
  const [primary, comparison] = tethysSources.models;
  assert.equal(primary.id, 'Muller2019-Young2019-Cao2020');
  assert.equal(comparison.id, 'Matthews2016-GK07');
  assert.match(primary.referenceFrame, /plate 0.*mantle-frame/);
  assert.match(comparison.referenceFrame, /plate 0.*GK07/);
  assert.deepEqual(tethysSources.models.map((model) => model.license.url), [
    'https://creativecommons.org/licenses/by/3.0/', 'https://creativecommons.org/licenses/by/4.0/',
  ]);
  for (const model of tethysSources.models) {
    assert.equal(model.publisher, 'EarthByte Group');
    assert.equal(model.archives.length, 3);
    for (const archive of model.archives) {
      assert.equal(new URL(archive.url).hostname, 'www.earthbyte.org');
      assert.match(archive.sha256, /^[a-f0-9]{64}$/);
      assert.ok(archive.requiredFiles.length >= 1);
      assert.ok(archive.rightsAndProvenanceFiles.some((file) => file.path.endsWith('README.txt')));
      if (model.role === 'comparison') assert.ok(archive.rightsAndProvenanceFiles.some((file) => file.path === 'License.txt'));
      for (const file of [...archive.requiredFiles, ...archive.rightsAndProvenanceFiles]) assert.match(file.sha256, /^[a-f0-9]{64}$/);
      for (const id of archive.citations) assert.ok(tethysSources.citations[id].title);
    }
  }
});

test('all products agree on epoch and reference, with one supported chronology selection', () => {
  assert.equal(tethysSources.ageMa, 111);
  for (const item of [receipt, geometry, validation]) {
    assert.equal(item.ageMa, 111);
    assert.equal(item.anchorPlate, 0);
    assert.equal(item.modelId, tethysSources.models[0].id);
  }
  assert.equal(validation.comparisonAnchorPlate, 701);
  assert.deepEqual(chronology.filter((event) => hasTethysReconstruction(event.when)).map((event) => event.id), ['tethys']);
  assert.equal(hasTethysReconstruction({ kind: 'interval', older: 112e6, younger: 110e6, label: 'Interval' }), false);
  assert.equal(hasTethysReconstruction({ kind: 'approximate', years: 111e6 - 1, label: 'Adjacent age' }), false);
  const tethys = chronology.find(({ id }) => id === 'tethys');
  const origins = chronology.find(({ id }) => id === 'origins');
  const current = setZoom(selectEvent(initialSelection, tethys), 2);
  const undated = selectEvent(current, origins);
  assert.deepEqual(timeWindow(undated), timeWindow(current));
  assert.equal(hasTethysReconstruction(origins.when), false);
});

function checkLine(points, min) {
  assert.ok(points.length >= min);
  for (let index = 0; index < points.length; index++) {
    const point = points[index];
    assert.equal(point.length, 2);
    const [lon, lat] = point;
    assert.ok(Number.isFinite(lon) && Math.abs(lon) <= 180);
    assert.ok(Number.isFinite(lat) && Math.abs(lat) <= 90);
    if (index) assert.ok(Math.abs(lon - points[index - 1][0]) <= 180);
  }
}

test('exported polygons have closed nonzero rings with finite positions and traceable IDs', () => {
  assert.equal(geometry.continental.length, receipt.counts.lithosphereParts);
  assert.equal(geometry.rejectedPolygonParts.length, receipt.counts.rejectedPolygonParts);
  assert.equal(new Set(geometry.continental.map((feature) => feature.id)).size, geometry.continental.length);
  for (const part of geometry.continental) {
    assert.match(part.sourceId, /^GPlates-/);
    assert.ok(Number.isInteger(part.plateId));
    for (const ring of part.rings) {
      checkLine(ring, 4);
      assert.deepEqual(ring[0], ring[ring.length - 1]);
      const doubleArea = ring.slice(1).reduce((area, [x, y], index) =>
        area + ring[index][0] * y - x * ring[index][1], 0);
      assert.ok(Math.abs(doubleArea) > 0);
    }
  }
});

test('boundary types, neighbor plates and checkpoint coordinates survive export', () => {
  assert.equal(geometry.boundaries.length, receipt.counts.boundaryParts);
  assert.equal(validation.checkpoints.length, receipt.counts.checkpoints);
  assert.deepEqual([...new Set(geometry.boundaries.map((line) => line.type))].sort(), ['ridge', 'rift', 'subduction', 'transform']);
  for (const line of geometry.boundaries) {
    checkLine(line.coordinates, 2);
    assert.ok(line.adjacentPlateIds.length && line.adjacentPlateIds.every(Number.isInteger));
  }
  const adria = validation.checkpoints.find(({ id }) => id === 'adria');
  assert.deepEqual(adria.primary.position, [11.97197, 13.45356]);
  assert.equal(formatCoordinates(adria.primary.position), '13.5° N, 12.0° E');
  assert.equal(adria.africaFixedDifferenceDegrees, 0.52061);
  const ridge = validation.checkpoints.find(({ id }) => id === 'neotethys-ridge');
  assert.equal(ridge.comparison, null);
  assert.deepEqual(ridge.primary.adjacentPlateIds, [501, 53401]);
  for (const checkpoint of validation.checkpoints) {
    const [lon, lat] = checkpoint.primary.position;
    const { west, east, south, north } = geometry.region;
    assert.ok(lon >= west && lon <= east && lat >= south && lat <= north);
    const layer = checkpoint.kind === 'boundary' ? geometry.boundaries : geometry.continental;
    assert.ok(layer.some((part) => part.sourceId === checkpoint.primary.sourceId && part.plateId === checkpoint.primary.plateId));
  }
});
