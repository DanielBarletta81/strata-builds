import assert from 'node:assert/strict';
import test from 'node:test';
import robots from '../src/app/robots.ts';
import sitemap from '../src/app/sitemap.ts';

test('robots allows public crawling and advertises the canonical sitemap', () => {
  assert.deepEqual(robots(), {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://strata-builds.tech/sitemap.xml',
    host: 'https://strata-builds.tech',
  });
});

test('sitemap keeps the canonical URLs, crawl hints, and modification dates', () => {
  const before = Date.now();
  const entries = sitemap();
  const after = Date.now();

  assert.deepEqual(
    entries.map(({ url, changeFrequency, priority }) => ({ url, changeFrequency, priority })),
    [
      { url: 'https://strata-builds.tech', changeFrequency: 'weekly', priority: 1 },
      { url: 'https://strata-builds.tech/studio', changeFrequency: 'monthly', priority: 0.9 },
      { url: 'https://strata-builds.tech/atlas', changeFrequency: 'monthly', priority: 0.9 },
      { url: 'https://strata-builds.tech/signals', changeFrequency: 'monthly', priority: 0.9 },
      { url: 'https://strata-builds.tech/orbital', changeFrequency: 'monthly', priority: 0.9 },
      { url: 'https://strata-builds.tech/oceanography', changeFrequency: 'monthly', priority: 0.9 },
      { url: 'https://strata-builds.tech/frontier', changeFrequency: 'monthly', priority: 0.9 },
      { url: 'https://strata-builds.tech/frontier/reconciliation', changeFrequency: 'monthly', priority: 0.8 },
    ],
  );

  for (const { lastModified, url } of entries) {
    assert.ok(lastModified instanceof Date, url);
    assert.ok(lastModified.getTime() >= before && lastModified.getTime() <= after, url);
  }
});
