import assert from 'node:assert/strict';
import test from 'node:test';
import { castEndpoints, castKey, casts, cellLocator, depthCounts, fields, isNumber, lowOxygenRows, station, workbookHashes } from '../src/features/oceanography/pawtuxet/casts.ts';

test('pins both NBC sources, the exact station labels and source cast keys', () => {
  assert.equal(workbookHashes[2014], '7bdd16823a2d46199e6a4eb0939067b4b20d7a1d1a2858443779a10c20ddeaed');
  assert.equal(workbookHashes[2016], '9a6e14530f83ef7eece531a45ffc3a41053681cc5421d1db1157155dcdb51086');
  assert.deepEqual([2014, 2016].map((year) => {
    const published = casts.filter((cast) => cast.year === year && cast.records.length);
    return [published.length, published.reduce((total, cast) => total + cast.records.length, 0)];
  }), [[22, 292], [27, 299]]);
  assert.equal(new Set(casts.map(castKey)).size, casts.length);
  assert.equal(station, 'Pawtuxet Cove');
  assert.equal(fields.salinity.units, 'psu');
});

test('metadata-only dates and schedule notes retain their source rows', () => {
  const missing = casts.find((cast) => castKey(cast) === '2014-01-15');
  assert.equal(missing.clock, null);
  assert.equal(missing.metadataRow, 3);
  assert.equal(missing.mark, 'X');
  assert.equal(missing.note, 'Data available upon request - YSI sonde used');
  assert.deepEqual(missing.records, []);
  assert.equal(casts.find(({ date }) => date === '2014-06-19').note, 'Special sampling day, out of routine schedule');
});

test('endpoint comparisons use the numeric depth and preserve repeated source rows', () => {
  const cast = casts.find((entry) => castKey(entry) === '2014-10-15 13:41:00');
  assert.equal(cast.records.at(-1).depth, 3.25);
  assert.equal(depthCounts(cast.records).get(3.5), 2);
  assert.equal(castEndpoints(cast.records).deep.row, 4001);
  assert.equal(castEndpoints(cast.records).deep.depth, 3.75);
  const ambiguous = casts.find((entry) => castKey(entry) === '2014-10-08 14:53:00');
  assert.equal(castEndpoints(ambiguous.records).deep, undefined);
  assert.equal(castEndpoints(cast.records).shallow.depth, 0.25);
  const verified = casts.find((entry) => castKey(entry) === '2016-07-20 10:00:00');
  const { shallow, deep } = castEndpoints(verified.records);
  assert.deepEqual([shallow.depth, shallow.temperature, shallow.oxygen, shallow.density, shallow.salinity], [1.25, 25.2498, 5.33, 1016.7244, 26.3142]);
  assert.deepEqual([deep.depth, deep.temperature, deep.oxygen, deep.density, deep.salinity], [3.75, 23.7477, 2.69799, 1019.2272, 29.0424]);
  assert.equal(cellLocator(2016, deep.row, 'density'), '2016 Data!L2046');
});

test('the strict oxygen threshold flags only the verified low-oxygen cast and numeric unique bins', () => {
  const lowCasts = casts.flatMap((cast) => {
    const low = lowOxygenRows(cast.records);
    return low.length > 0 ? [[castKey(cast), low.map(({ depth, row, oxygen }) => [depth, row, oxygen])]] : [];
  });
  assert.deepEqual(lowCasts, [['2016-07-20 10:00:00', [
    [3.25, 2044, 2.79513], [3.5, 2045, 2.66952], [3.75, 2046, 2.69799],
  ]]]);
  assert.deepEqual(lowOxygenRows([
    { depth: 1, oxygen: 3 },
    { depth: 2, oxygen: null },
    { depth: 3, oxygen: '' },
    { depth: 4, oxygen: '2.4' },
    { depth: 5, oxygen: 2.5 },
    { depth: 5, oxygen: 4 },
    { depth: 6, oxygen: 0 },
  ]), [{ depth: 6, oxygen: 0 }]);
  assert.equal(isNumber(Infinity), false);
});
