import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { URL } from 'node:url';
import { KM_PER_AU } from '../src/features/orbital/ephemeris.ts';
import { loadVoyager, parseVoyagerVectors, trajectorySources } from '../src/features/orbital/voyager/capture.ts';
import { earthEvents, milestone, nasaInterruption, nasaMilestone, voyagerEvents } from '../src/features/orbital/voyager/events.ts';
import { lightHours, LIGHT_DAY_KM, LIGHT_SPEED_KM_S, signalAt } from '../src/features/orbital/voyager/light.ts';
import { compareDate, formatDate, stepDate, timeFraction, timelineDates } from '../src/features/orbital/voyager/timeline.ts';

test('Voyager event and modeling dates stay aligned over the dated launch-to-milestone window', () => {
  const first = '1977-09-05';
  const states = loadVoyager();
  assert.equal(timelineDates.length, 20);
  assert.equal(timelineDates[0], first);
  assert.equal(timelineDates.at(-1), milestone);
  assert.equal(stepDate(first, -1), first);
  assert.equal(stepDate(first, 1), '1977-10-26');
  assert.equal(stepDate(milestone, 1), milestone);
  assert.equal(formatDate('1990-02-14'), 'Feb 14, 1990');
  assert.equal(timeFraction(first), 0);
  assert.equal(timeFraction(milestone), 1);
  assert.deepEqual(states.map(({ date }) => date), voyagerEvents.map(({ date }) => date));
  assert.equal(states[0].clockTdb, '18:00:00');
  assert.equal(states.at(-1).clockTdb, '12:00:00');
  assert.equal(states.at(-1).jdTdb, 2461363);
});

test('Earth lenses preserve the selected date and distinguish overlaps, offsets, and uncaptured states', () => {
  const selected = compareDate(milestone, 'All events');
  assert.equal(selected.mission.title, 'One light-day from Earth');
  assert.equal(selected.earth.event.short, 'COP31');
  assert.equal(selected.earth.offset, 0);
  assert.equal(compareDate('1977-09-05', 'All events').earth.offset, 51);
  const lookBack = compareDate(milestone, 'Computing');
  assert.equal(lookBack.mission, selected.mission);
  assert.equal(lookBack.earth.event.short, 'Web released');
  assert.ok(lookBack.earth.offset < 0);
  const earthOnly = '1989-11-09';
  assert.equal(compareDate(earthOnly, 'Human history').earth.offset, 0);
  assert.equal(compareDate(earthOnly, 'Human history').mission, undefined);
  assert.equal(loadVoyager().find(({ date }) => date === earthOnly), undefined);
});

test('the geometric one-way light time and the stationary signal demonstration use distinct sources', () => {
  assert.equal(KM_PER_AU, 149597870.7);
  assert.equal(LIGHT_SPEED_KM_S, 299792.458);
  assert.ok(Math.abs(LIGHT_DAY_KM - 25902068371.2) < 0.00001);
  assert.equal(lightHours(LIGHT_DAY_KM), 24);
  const state = loadVoyager().at(-1);
  assert.equal(state.earthRangeKm, 25902224889.49222);
  assert.equal(state.earthLightSeconds.toFixed(6), '86400.522089');
  assert.equal((state.sunRangeKm / KM_PER_AU).toFixed(3), '172.390');
  assert.equal((state.earthRangeKm / KM_PER_AU).toFixed(3), '173.146');
  assert.equal(signalAt(0).fraction, 0);
  assert.equal(signalAt(24).fraction, 1);
  assert.deepEqual(signalAt(36), { hour: 36, fraction: 0.5, leg: 'returning' });
  assert.equal(signalAt(48).fraction, 0);
});

test('all displayed events have primary-source links and both capture receipts match original bytes', async () => {
  for (const event of [...voyagerEvents, ...earthEvents]) {
    assert.equal(new URL(event.source.url).protocol, 'https:');
    assert.ok(event.source.name);
  }
  assert.match(nasaMilestone.url, /^https:\/\/www\.nasa\.gov\/news-release\//);
  assert.match(nasaInterruption.url, /\/2026\/11\/18\//);
  for (const [origin, receipt] of Object.entries(trajectorySources)) {
    const bytes = await readFile(new URL(`../src/features/orbital/voyager/data/${origin}.json`, import.meta.url));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), receipt.sha256);
    assert.equal(new Date(receipt.retrievedAt).toISOString(), receipt.retrievedAt);
    const url = new URL(receipt.url);
    assert.equal(url.origin, 'https://ssd.jpl.nasa.gov');
    assert.equal(url.searchParams.get('COMMAND'), "'-31'");
    assert.equal(url.searchParams.get('CENTER'), origin === 'earth' ? "'500@399'" : "'500@10'");
    assert.equal(url.searchParams.get('VEC_CORR'), "'NONE'");
    assert.deepEqual(JSON.parse(bytes).signature, receipt.signature);
  }
});

test('captured states reject wrong frame, wrong origin, invalid numeric rows and lost coverage', async () => {
  const bytes = await readFile(new URL('../src/features/orbital/voyager/data/earth.json', import.meta.url));
  const payload = JSON.parse(bytes);
  assert.throws(() => parseVoyagerVectors(payload, 'sun'), /center/);
  assert.throws(() => parseVoyagerVectors({ ...payload, result: payload.result.replace('ICRF', 'Ecliptic') }, 'earth'), /frame/);
  assert.throws(() => parseVoyagerVectors({ ...payload, result: payload.result.replace('6.527978485155701E+04', 'oops') }, 'earth'), /vector row/);
  assert.throws(() => parseVoyagerVectors({ ...payload, result: payload.result.replace(/^.*A.D. 1990-Feb-14.*\n/m, '') }, 'earth'), /discrete epochs/);
});
