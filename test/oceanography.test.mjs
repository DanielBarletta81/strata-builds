import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { URL } from 'node:url';
import capture from '../src/features/oceanography/data/records.json' with { type: 'json' };
import water from '../src/features/oceanography/data/water.json' with { type: 'json' };
import { cellLocator, clocks, coverage, getNutrients, pairedSamples, pairStatus, profileAt, profiles, reading, sources, stations } from '../src/features/oceanography/observations.ts';

test('archive and workbook pins match the release and five station coordinates lie inside the map', () => {
  assert.equal(capture.schemaVersion, 1);
  assert.equal(sources.ridem.hash, 'faa31c9b5bc784cd1971807fa873d4f7242f87bb662798374bbc837e1a48e8e4');
  assert.equal(sources.nbc.hash, 'a9e35a8f558f1a8171f742c198f06b87512bde13e9f6ae96bcc9150709ac1de8');
  assert.equal(sources.tank.hash, 'b8df8b953715adf997295c258b6db6f26fd8c330e6cf3be69756edf7b2c83977');
  assert.deepEqual(stations.map(({ id }) => id), ['F4', 'B4', 'B3', 'F3', 'F7']);
  const [west, south, east, north] = water.bounds;
  for (const { latitude, longitude } of stations) {
    assert.ok(longitude > west && longitude < east && latitude > south && latitude < north);
  }
  assert.equal(stations.at(-1).latitude, 41.49225);
  const map = new URL('../src/features/oceanography/data/water.json', import.meta.url);
  assert.equal(createHash('sha256').update(readFileSync(map)).digest('hex'),
    'a3968d6f61391a5b04f4efc68720faf243d7e963bf5abf219bfece80f16da8ab');
});

test('only same-row numeric nutrient pairs enter the plots, with unique source keys', () => {
  assert.deepEqual(stations.map(({ id }) => [getNutrients(id).length, pairedSamples(getNutrients(id)).length]),
    [[14, 9], [14, 5], [0, 0], [0, 0], [21, 20]]);
  const phillipsdale = getNutrients('F4');
  const first = pairedSamples(phillipsdale)[0];
  assert.equal(first.row, 144);
  assert.equal(first.sample, 'CB85102');
  assert.equal(first.site, 'dock');
  assert.equal(first.salinity, 1.8);
  assert.equal(first.nutrient, 353);
  assert.equal(pairStatus(phillipsdale.find(({ row }) => row === 198)), 'Review flag');
  assert.equal(pairStatus(phillipsdale.find(({ row }) => row === 223)), 'Below reporting limit');
  assert.equal(phillipsdale.find(({ row }) => row === 223).nutrient, '<6.000');
  assert.equal(pairStatus(getNutrients('F7')[0]), 'Missing field');
  assert.deepEqual(pairedSamples([first, first]), []);
  assert.equal(pairStatus({ ...first, salinity: 0, nutrient: 0 }), 'Paired');
  assert.equal(pairStatus({ ...first, calculated: true }), 'Calculated field');
});

test('depth lookups preserve exact archival slots, independent variables and cell locators', () => {
  assert.equal(clocks.length, 17);
  const [surface, bottom] = profileAt('F4', '12:00');
  assert.equal(surface.record.depth[0], 0.532);
  assert.equal(reading(surface.record, 'salinity').value, 18.68);
  assert.equal(reading(bottom.record, 'oxygen').value, 1.97);
  assert.equal(cellLocator('F4', bottom.record, 'oxygen'), 'PD!Y11480');
  const b4 = profileAt('B4', '09:30');
  assert.deepEqual(reading(b4[0].record, 'temperature'), { value: null, status: 'blank' });
  assert.equal(reading(b4[1].record, 'oxygen').value, 4.13);
  assert.equal(cellLocator('B4', b4[1].record, 'oxygen'), 'BR!Y5230');
  assert.deepEqual(reading(profileAt('B4', '09:31')[0].record, 'salinity'), { value: null, status: 'no row' });
  assert.deepEqual(profileAt('F7', '12:00').map(({ layer }) => layer), ['Mid-depth']);
});

test('coverage distinguishes blanks and flags from missing or duplicate layer/time keys', () => {
  assert.deepEqual(coverage('B4').map(({ salinity, oxygen, temperature }) => [salinity, oxygen, temperature]),
    [[9, 9, 15], [0, 15, 15], [0, 7, 16]]);
  assert.equal(coverage('B3')[0].salinity, 0);
  assert.equal(coverage('F3')[1].salinity, 5);
  assert.equal(coverage('F7')[0].salinity, 17);
  assert.ok(stations.every(({ id }) => coverage(id).every(({ missingRows, duplicates }) => !missingRows && !duplicates)));
  assert.equal(profiles.B4.records.length, 51);
});
