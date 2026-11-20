import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createRequire } from 'node:module';
import { after, before, test } from 'node:test';

const nextCli = createRequire(import.meta.url).resolve('next/dist/bin/next');
let server;
let origin;

before(async () => {
  server = spawn(process.execPath, [nextCli, 'start', '--hostname', '127.0.0.1', '--port', '0'], {
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
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
});

after(async () => {
  if (!server?.pid || server.exitCode !== null || server.signalCode !== null) return;
  const exited = once(server, 'exit', { signal: AbortSignal.timeout(5_000) });
  server.kill();
  try {
    await exited;
  } finally {
    if (server.exitCode === null && server.signalCode === null) server.kill('SIGKILL');
  }
});

async function fetchRoute(path, contentType) {
  const response = await fetch(`${origin}${path}`, {
    redirect: 'manual',
    signal: AbortSignal.timeout(10_000),
  });

  assert.equal(response.status, 200, path);
  assert.equal(response.headers.get('content-type')?.split(';')[0], contentType, path);
  return response.text();
}

const pages = [
  ['/', 'Strata Builds', 'Featured Projects'],
  ['/atlas', 'Atlas', 'Microsat Atlas app coming soon'],
  ['/studio', 'Studio', 'Strata Works portfolio coming soon'],
];

for (const [path, heading, content] of pages) {
  test(`GET ${path} renders its content and the shared layout`, async () => {
    const html = await fetchRoute(path, 'text/html');
    assert.match(html, /<html[^>]*\blang="en"/);
    assert.match(html, /<title>Strata Builds<\/title>/);
    assert.match(html, /<meta name="description" content="Design, data, structure — visualizations and digital products"/);
    assert.match(html, new RegExp(`<h1\\b[^>]*>${heading}</h1>`));
    assert.ok(html.includes(content));

    const nav = html.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '';
    const links = [...nav.matchAll(/<a\b[^>]*\bhref="([^"]+)"[^>]*>([^<]+)<\/a>/g)]
      .map(([, href, label]) => [href, label]);
    assert.deepEqual(links, [['/', 'Strata Builds'], ['/studio', 'Studio'], ['/atlas', 'Atlas']]);
  });
}

test('GET /robots.txt preserves the public crawl and sitemap directives', async () => {
  const robots = await fetchRoute('/robots.txt', 'text/plain');
  assert.match(robots, /^User-Agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, /^Host: https:\/\/strata-builds\.tech$/m);
  assert.match(robots, /^Sitemap: https:\/\/strata-builds\.tech\/sitemap\.xml$/m);
});

test('GET /sitemap.xml publishes all three canonical URLs', async () => {
  const sitemap = await fetchRoute('/sitemap.xml', 'application/xml');
  assert.match(sitemap, /<urlset\b/);
  assert.deepEqual(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url),
    ['https://strata-builds.tech', 'https://strata-builds.tech/studio', 'https://strata-builds.tech/atlas'],
  );
});
