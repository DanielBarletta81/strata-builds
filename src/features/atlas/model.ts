import coast from './coast.json' with { type: 'json' };
import { createDemoDataset } from './demo.ts';
import { findNeighborhoodFlags, fitMap, MAP_HEIGHT, MAP_WIDTH, project } from './geography.ts';
import { ASSIGNMENTS, summarizeAssignments } from './records.ts';

const STYLES = [
  { color: '#e0a353', shape: 'circle' },
  { color: '#6bc4d4', shape: 'square' },
  { color: '#b694dc', shape: 'diamond' },
] as const;

export const COAST_SOURCE_URL =
  'https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.html';

export function createAtlasModel(dataset = createDemoDataset()) {
  const { samples, rejected, provenance } = dataset;
  const { totals, sites } = summarizeAssignments(samples);
  const legend = [...ASSIGNMENTS]
    .sort((a, b) => totals[b] - totals[a])
    .map((assignment, index) => ({ assignment, count: totals[assignment], ...STYLES[index] }));
  const neighbors = findNeighborhoodFlags(samples);

  const extent = samples.length ? samples : [{ lon: -76, lat: 37 }, { lon: -70.5, lat: 42 }];
  const view = fitMap(extent, MAP_WIDTH, MAP_HEIGHT);
  const coastline = coast.segments.map(segment =>
    'M' + segment.map(([lon, lat]) => project(lon, lat, view).map(value => value.toFixed(1)).join(',')).join('L'),
  );

  const meridians = [];
  for (let lon = -78; lon <= -69; lon++) {
    const [x] = project(lon, view.midLat, view);
    if (x > 0 && x < MAP_WIDTH) meridians.push({ x, label: `${-lon}°W` });
  }
  const parallels = [];
  for (let lat = 36; lat <= 43; lat++) {
    const [, y] = project(view.lonMin, lat, view);
    if (y > 0 && y < MAP_HEIGHT) parallels.push({ y, label: `${lat}°N` });
  }

  const points = samples.map(sample => {
    const [x, y] = project(sample.lon, sample.lat, view);
    return { ...sample, x, y, neighborAssignment: neighbors.get(sample.id) ?? null };
  });
  // The longitude scale factor cancels when converting the original 50 km bar.
  const scaleWidth = 50 * view.scale / 111.32;

  return {
    points, rejected, provenance, sites, legend, coastline, meridians, parallels, scaleWidth,
    flaggedCount: neighbors.size,
  };
}

export type AtlasModel = ReturnType<typeof createAtlasModel>;
export type AtlasPoint = AtlasModel['points'][number];
export type AtlasLegendEntry = AtlasModel['legend'][number];
