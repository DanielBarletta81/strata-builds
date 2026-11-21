import type { MetadataRoute } from 'next';

const siteUrl = 'https://strata-builds.tech';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { url: '', changeFrequency: 'weekly', priority: 1 },
    { url: '/studio', changeFrequency: 'monthly', priority: 0.9 },
    { url: '/atlas', changeFrequency: 'monthly', priority: 0.9 },
    { url: '/signals', changeFrequency: 'monthly', priority: 0.9 },
    { url: '/orbital', changeFrequency: 'monthly', priority: 0.9 },
  ] as const;

  return routes.map(({ url, changeFrequency, priority }) => ({
    url: `${siteUrl}${url}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
