import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { cp, mkdtemp, readFile, rename, rm, symlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { after, before, test } from 'node:test';
import { URL } from 'node:url';
import atlasFixture from './fixtures/atlas-pinned-demo.json' with { type: 'json' };

const nextCli = createRequire(import.meta.url).resolve('next/dist/bin/next');
let server;
let origin;
let buildDirectory;
let clockFile;
let requestLog;

before(async () => {
  buildDirectory = await mkdtemp(join(tmpdir(), 'strata-route-smoke-'));
  const build = resolve('.next');
  await cp(build, join(buildDirectory, '.next'), {
    recursive: true,
    filter: (source) => source !== join(build, 'cache'),
  });
  await cp(resolve('package.json'), join(buildDirectory, 'package.json'));
  await cp(resolve('next.config.mjs'), join(buildDirectory, 'next.config.mjs'));
  await symlink(resolve('node_modules'), join(buildDirectory, 'node_modules'), 'dir');
  clockFile = join(buildDirectory, 'fixture-clock');
  requestLog = join(buildDirectory, 'noaa-requests.ndjson');
  await writeFile(requestLog, '');
  await setClock('2026-11-14T00:57:19Z');
  await startServer();
});

async function setClock(iso) {
  await writeFile(clockFile + '.tmp', String(Date.parse(iso)));
  await rename(clockFile + '.tmp', clockFile);
}

async function upstreamCalls(hours) {
  const lines = (await readFile(requestLog, 'utf8')).trim();
  if (!lines) return 0;
  return lines.split('\n').map((line) => JSON.parse(line)).filter((request) => request.hours === hours).length;
}

async function startServer() {
  server = spawn(process.execPath, ['--import', new URL('./fixtures/noaa/fetch-stub.mjs', import.meta.url).href, nextCli, 'start', '--hostname', '127.0.0.1', '--port', '0'], {
    cwd: buildDirectory,
    env: {
      ...process.env, NEXT_TELEMETRY_DISABLED: '1',
      STRATA_TEST_NOAA_CLOCK: clockFile, STRATA_TEST_NOAA_REQUESTS: requestLog,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout.setEncoding('utf8');
  server.stderr.setEncoding('utf8');

  let stdout = '';
  let stderr = '';
  let timeout;
  try {
    origin = await new Promise((resolve, reject) => {
      timeout = setTimeout(() => reject(new Error(`Next.js startup timed out.\n${stdout}${stderr}`)), 20_000);
      server.stderr.on('data', (chunk) => { stderr += chunk; });
      server.stdout.on('data', (chunk) => {
        stdout += chunk;
        const address = stdout.match(/Local:\s+(http:\/\/127\.0\.0\.1:\d+)\r?\n/)?.[1];
        if (address) resolve(address);
      });
      server.once('error', reject);
      server.once('close', (code, signal) => {
        reject(new Error(`Next.js exited during startup (${signal ?? code}).\n${stdout}${stderr}`));
      });
    });
  } finally {
    clearTimeout(timeout);
  }
}

after(async () => {
  await stopServer();
  if (buildDirectory) await rm(buildDirectory, { recursive: true, force: true });
});

async function stopServer() {
  if (!server?.pid || server.exitCode !== null || server.signalCode !== null) return;
  const exited = once(server, 'exit', { signal: AbortSignal.timeout(5_000) });
  server.kill();
  try {
    await exited;
  } finally {
    if (server.exitCode === null && server.signalCode === null) server.kill('SIGKILL');
  }
}

async function fetchRoute(path, contentType) {
  const response = await fetch(`${origin}${path}`, {
    redirect: 'manual',
    signal: AbortSignal.timeout(10_000),
  });

  assert.equal(response.status, 200, path);
  assert.equal(response.headers.get('content-type')?.split(';')[0], contentType, path);
  if (path.startsWith('/api/signals')) assert.equal(response.headers.get('cache-control'), 'no-store');
  return response.text();
}

const pages = [
  ['/', 'Strata Builds', 'Featured Projects'],
  ['/atlas', 'Microsat Atlas', 'SYNTHETIC DEMONSTRATION DATA'],
  ['/studio', 'Studio', 'Strata Works portfolio coming soon'],
  ['/signals', 'NOAA Signals Lab', 'Loading NOAA observations'],
  ['/orbital', '1 Ceres', 'Modeled geometric state from JPL'],
  ['/frontier', 'Where does the record break[?]', 'Surface temperature coverage'],
];

for (const [path, heading, content] of pages) {
  test(`GET ${path} renders its content and the shared layout`, async () => {
    const html = await fetchRoute(path, 'text/html');
    assert.match(html, /<html[^>]*\blang="en"/);
    if (path === '/signals') {
      assert.match(html, /<title>NOAA Signals Lab \| Strata Builds<\/title>/);
      assert.match(html, /<label for="signals-hours">Observation window<\/label>/);
      assert.match(html, /role="status"/);
    } else if (path === '/orbital') {
      assert.match(html, /<title>Orbital Observatory \| Strata Builds<\/title>/);
    } else if (path === '/frontier') {
      assert.match(html, /<title>Evidence Frontier \| Strata Builds<\/title>/);
    } else {
      assert.match(html, /<title>Strata Builds<\/title>/);
      assert.match(html, /<meta name="description" content="Design, data, structure — visualizations and digital products"/);
    }
    assert.match(html, new RegExp(`<h1\\b[^>]*>${heading}</h1>`));
    assert.ok(html.includes(content));

    const nav = html.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
    const links = [...nav.matchAll(/<a\b[^>]*\bhref="([^"]+)"[^>]*>([^<]+)<\/a>/g)]
      .map(([, href, label]) => [href, label]);
    assert.deepEqual(links, [['/', 'Strata Builds'], ['/studio', 'Studio'], ['/atlas', 'Atlas'], ['/signals', 'Signals'], ['/orbital', 'Orbital'], ['/frontier', 'Frontier']]);
  });
}

test('GET /atlas renders the synthetic map, composition and matching accessible records', async () => {
  const html = await fetchRoute('/atlas', 'text/html');
  const map = html.match(/<svg\b[^>]*role="group"[^>]*>([\s\S]*?)<\/svg>/)?.[1] ?? '';
  assert.match(map, /<title[^>]*>Atlantic coastal map of synthetic striped bass assignments<\/title>/);
  assert.match(html, /id="atlas-composition">Site composition<\/h2>/);
  assert.match(html, /Assignment legend/);
  assert.match(html, /U\.S\. Census Bureau cartographic boundary files/);
  assert.match(html, /at least three of its five closest samples share the same/);
  const caption = html.match(/<caption>(.*?)<\/caption>/)?.[1].replaceAll('<!-- -->', '');
  assert.equal(caption, `All ${atlasFixture.recordCount} plotted synthetic records`);

  const markers = [...map.matchAll(/<g\b[^>]*data-map-sample="([^"]+)"/g)].map(([, id]) => id);
  const rows = [...html.matchAll(/<tr\b[^>]*data-record-sample="([^"]+)"/g)].map(([, id]) => id);
  assert.equal(markers.length, atlasFixture.recordCount);
  assert.equal(new Set(markers).size, markers.length);
  assert.deepEqual(markers, rows);
  assert.equal(markers[0], atlasFixture.firstRecord.id);
  assert.equal(markers.at(-1), atlasFixture.lastRecord.id);
  assert.equal([...map.matchAll(/aria-pressed="true"/g)].length, 1);
  assert.equal([...map.matchAll(/tabindex="0"/gi)].length, 1);
  assert.match(html, /<label for="atlas-site">Site<\/label>/);
  assert.match(html, /<label for="atlas-sample">Sample<\/label>/);
  assert.match(html, /href="#atlas-inspector">Choose a site or sample<\/a>/);
  assert.match(html, /<th scope="col">Assignment<\/th>/);
  const table = html.match(/<table\b[^>]*>([\s\S]*?)<\/table>/)?.[1] ?? '';
  const recordButtons = [...table.matchAll(/<button\b[^>]*aria-label="Select sample ([^"]+)"[^>]*>/g)];
  assert.deepEqual(recordButtons.map(([, id]) => id), rows);
  assert.equal(recordButtons.filter(([button]) => button.includes('tabindex="0"')).length, 1);
  assert.equal(recordButtons.find(([button]) => button.includes('aria-pressed="true"'))?.[1], markers[0]);
  assert.match(table, /<th scope="row"><button/);
});

test('GET /robots.txt preserves the public crawl and sitemap directives', async () => {
  const robots = await fetchRoute('/robots.txt', 'text/plain');
  assert.match(robots, /^User-Agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Host: https:\/\/strata-builds\.tech$/m);
  assert.match(robots, /^Sitemap: https:\/\/strata-builds\.tech\/sitemap\.xml$/m);
});

test('GET /sitemap.xml publishes all nine canonical URLs', async () => {
  const sitemap = await fetchRoute('/sitemap.xml', 'application/xml');
  assert.match(sitemap, /<urlset\b/);
  assert.deepEqual(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url),
    ['https://strata-builds.tech', 'https://strata-builds.tech/studio', 'https://strata-builds.tech/atlas', 'https://strata-builds.tech/signals', 'https://strata-builds.tech/orbital', 'https://strata-builds.tech/oceanography', 'https://strata-builds.tech/oceanography/pawtuxet', 'https://strata-builds.tech/frontier', 'https://strata-builds.tech/frontier/reconciliation'],
  );
});

test('equivalent Signals requests reuse the Data Cache across a server restart and preserve provenance', async () => {
  const read = async (query = '') => JSON.parse(await fetchRoute('/api/signals' + query, 'application/json'));
  const first = await read();
  assert.equal(first.delivery.source, 'noaa');
  assert.equal(first.retrievedAt, '2026-11-14T00:57:19.000Z');
  assert.equal(first.delivery.nextCheckAt, '2026-11-14T01:00:00.000Z');
  assert.equal(await upstreamCalls(24), 1);

  await stopServer();
  await startServer();
  await setClock('2026-11-14T00:59:59.999Z');
  const same = await read('?product=water_temperature&range=24&station=8454000');
  assert.deepEqual(same, { ...first, delivery: { ...first.delivery, source: 'cache' } });
  assert.equal(await upstreamCalls(24), 1);

  const different = await read('?range=1');
  assert.equal(different.window.hours, 1);
  assert.equal(different.summary.count, 1);
  assert.equal(different.window.endUtcExclusive, first.window.endUtcExclusive);
  assert.equal(different.delivery.source, 'noaa');

  await setClock('2026-11-14T01:00:00Z');
  const rollover = await read();
  assert.equal(rollover.delivery.source, 'noaa');
  assert.equal(rollover.window.endUtcExclusive, '2026-11-14T01:00:00.000Z');
  assert.equal(rollover.retrievedAt, '2026-11-14T01:00:00.000Z');
  assert.equal(Date.parse(rollover.summary.latest.observedAt) - Date.parse(first.summary.latest.observedAt), 3_600_000);
  assert.equal(await upstreamCalls(24), 2);

  await setClock('2026-11-14T01:05:00Z');
  const expired = await read();
  assert.equal(expired.delivery.source, 'noaa');
  assert.equal(expired.retrievedAt, '2026-11-14T01:05:00.000Z');
  assert.equal(expired.summary.latest.observedAt, rollover.summary.latest.observedAt);
  assert.deepEqual(expired.window, rollover.window);
  assert.equal(await upstreamCalls(24), 3);
});

test('simultaneous cold requests within one instance share an upstream retrieval', async () => {
  const read = async () => JSON.parse(await fetchRoute('/api/signals?range=3', 'application/json'));
  const pair = await Promise.all([read(), read()]);
  assert.deepEqual(pair.map(({ delivery }) => delivery.source).sort(), ['in_flight', 'noaa']);
  assert.equal(pair[0].retrievedAt, pair[1].retrievedAt);
  assert.deepEqual(pair[0].observations, pair[1].observations);
  assert.equal(await upstreamCalls(3), 1);
});

test('GET /api/signals serves fixture-backed partial and ambiguous responses', async () => {
  const snapshot = JSON.parse(await fetchRoute('/api/signals?range=24', 'application/json'));
  assert.equal(snapshot.status, 'partial');
  assert.equal(snapshot.station.id, '8454000');
  assert.equal(snapshot.receivedRows, 23);
  assert.equal(snapshot.observations.length, 22);
  assert.equal(snapshot.exclusions.length, 1);
  assert.equal(snapshot.coverage.missingHours, 2);
  assert.equal(snapshot.gaps.length, 4);
  const unknown = JSON.parse(await fetchRoute('/api/signals?range=12', 'application/json'));
  assert.equal(unknown.emptyReason, 'noaa_no_data');
  assert.equal(unknown.coverage.missingHours, null);
  const cached = JSON.parse(await fetchRoute('/api/signals?range=12&station=8454000', 'application/json'));
  assert.deepEqual(cached, { ...unknown, delivery: { ...unknown.delivery, source: 'cache' } });
  assert.equal(await upstreamCalls(12), 1);
});

test('GET /api/signals rejects unsupported input and sanitizes upstream failures', async () => {
  for (const [query, status, code] of [
    ['station=0000000', 400, 'invalid_request'],
    ['range=24&range=12', 400, 'invalid_request'],
    ['range=6', 502, 'upstream_unavailable'],
  ]) {
    const response = await fetch(origin + '/api/signals?' + query, { signal: AbortSignal.timeout(10_000) });
    assert.equal(response.status, status);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    const payload = await response.json();
    assert.equal(payload.error.code, code);
    assert.doesNotMatch(JSON.stringify(payload), /0000000|datagetter/);
  }
});

test('NOAA HTTP failures and timeouts retain their status and reuse the same-slot retry hold', async () => {
  async function failure(hours, status, code) {
    const response = await fetch(origin + '/api/signals?range=' + hours, { signal: AbortSignal.timeout(15_000) });
    assert.equal(response.status, status);
    assert.equal(response.headers.get('retry-after'), '300');
    const payload = await response.json();
    assert.equal(payload.error.code, code);
    assert.equal(payload.delivery.nextCheckAt, '2026-11-14T01:10:00.000Z');
    assert.ok(!('retrievedAt' in payload));
    return payload;
  }

  const reused = await failure(6, 502, 'upstream_unavailable');
  assert.equal(reused.delivery.source, 'cache');
  assert.equal(await upstreamCalls(6), 1);
  const timeout = await failure(8, 504, 'upstream_timeout');
  assert.equal(timeout.delivery.source, 'noaa');
  const retry = await failure(8, 504, 'upstream_timeout');
  assert.deepEqual(retry, { ...timeout, delivery: { ...timeout.delivery, source: 'cache' } });
  assert.equal(await upstreamCalls(8), 1);
  await setClock('2026-11-14T01:10:00Z');
  const newAttempt = await fetch(origin + '/api/signals?range=6', { signal: AbortSignal.timeout(10_000) });
  assert.equal(newAttempt.status, 502);
  assert.equal((await newAttempt.json()).delivery.source, 'noaa');
  assert.equal(await upstreamCalls(6), 2);
});

test('GET /orbital publishes provenance and the same accessible sample in the plot and table', async () => {
  const html = await fetchRoute('/orbital', 'text/html');
  assert.match(html, /<label for="orbital-sample">Ephemeris sample<\/label>/);
  assert.match(html, /type="range"[^>]*min="0"[^>]*max="261"/);
  assert.match(html, /<svg[^>]*role="img"[^>]*aria-labelledby="orbit-svg-title orbit-svg-desc"/);
  const marker = html.match(/<circle[^>]*data-sample-jd="([^"]+)"/)?.[1];
  const table = html.match(/<table[^>]*data-sample-jd="([^"]+)"/)?.[1];
  assert.equal(marker, '2461220.5');
  assert.equal(table, marker);
  assert.match(html, /<caption>JPL state vector components<\/caption>/);
  assert.match(html, /JPL Horizons manual/);
  assert.match(html, /2026-11-20T23:53:46\.724Z/);
  assert.match(html, /J2000 ecliptic plane/);
  assert.match(html, /Evidence gaps and limits/);
});

test('GET /frontier renders source coverage, locators and inspectable evidence', async () => {
  const html = await fetchRoute('/frontier', 'text/html');
  assert.match(html, /18,421(?:<!-- -->)? \/ (?:<!-- -->)?18,432/);
  assert.match(html, /11.*blank slots across 10 dates/);
  assert.match(html, /All 52 temperature entries are nd in 2012/);
  assert.match(html, /data-site-id="B4-S"/);
  assert.match(html, /data-site-id="BCO-DMO 874956"/);
  assert.match(html, /<caption>Blank surface-temperature cells in the edited workbook<\/caption>/);
  assert.match(html, /What would resolve this\?/);
  assert.match(html, /https:\/\/datadem.ri.gov\/documents\/bart\/nbfsmn12.zip/);
  assert.match(html, /cannot establish when, or whether, temperature collection stopped/);
  assert.match(html, /href="\/frontier\/reconciliation"/);
});

test('GET /frontier/reconciliation renders two evidence case files with locators and source links', async () => {
  const html = (await fetchRoute('/frontier/reconciliation', 'text/html')).replaceAll('<!-- -->', '');
  assert.match(html, /<h1>Trace the missing measurements<\/h1>/);
  for (const marker of [
    'Partially resolved', 'Unresolved source conflict', 'BR!F5230', 'BR!F5231',
    '23.47 °C', '23.51 °C', 'Calculated · display rounded', 'No corresponding raw value found',
    '1997 week records', '1999 week records', 'Temperature_SURF record locators',
    'https://datadem.ri.gov/documents/bart/nbfsmn12.zip', 'https://www.bco-dmo.org/dataset/874956',
  ]) assert.ok(html.includes(marker), marker);

  const exactValues = [...html.matchAll(/<details[^>]*><summary aria-label="Exact workbook value at (BR!F\d+)">Exact workbook value<\/summary><small><code>([^<]+)<\/code> °C<\/small><small>SHA-256 <code>([a-f0-9]{64})<\/code>/g)];
  assert.deepEqual(exactValues.map(([, locator, value]) => [locator, value]), [
    ['BR!F5230', '23.473333333333333'],
    ['BR!F5231', '23.509999999999998'],
  ]);
  for (const [, , , hash] of exactValues) {
    assert.equal(hash, 'b670816f7d53de5f783edb4db0f0de1bf490283afc04948b8865fb3f6e68fd83');
  }
});

test('GET /oceanography renders the station locator, paired records and depth provenance', async () => {
  const html = (await fetchRoute('/oceanography', 'text/html')).replaceAll('<!-- -->', '');
  for (const label of [
    'Estuarine Gradient Observatory', 'Narragansett Bay station locator', 'Phillipsdale Landing',
    '9 of 14 reviewed surface rows', 'Salt-wedge explorer', 'Sampling coverage and gaps',
    'PD!Y11480', 'CB85102', 'Mid-depth sensor only', 'Source records and file fingerprints',
  ]) assert.ok(html.includes(label), label);
});

test('GET /oceanography/pawtuxet exposes profiler observations, limits and source locators', async () => {
  const html = (await fetchRoute('/oceanography/pawtuxet', 'text/html')).replaceAll('<!-- -->', '');
  for (const label of [
    'Pawtuxet Water Column Explorer', '49 published casts', '2014-01-15 · metadata only',
    '3 published depth readings below 3 mg/L</strong> in one cast on <time', '>2016-07-20</time>',
    '2.69799', '1016.7244', '1019.2272', '2016 Data!J2046', 'Selected reading',
    'Published density difference', 'oyster-bearing rocks beneath the bridge', 'https://dem.ri.gov/latest-bay-area-report',
  ]) assert.ok(html.includes(label), label);
});
