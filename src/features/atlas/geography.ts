import type { Assignment, AtlasSample } from './records.ts';

type Position = Pick<AtlasSample, 'lat' | 'lon'>;

export type MapView = {
  lonMin: number;
  latMax: number;
  kx: number;
  scale: number;
  ox: number;
  oy: number;
  midLat: number;
};

export const MAP_WIDTH = 920;
export const MAP_HEIGHT = 660;

export const NEIGHBOR_COUNT = 5;
export const FLAG_THRESHOLD = 3;
export const MIN_HEURISTIC_SAMPLES = 8;

export function fitMap(points: readonly Position[], width: number, height: number, padding = 0.1): MapView {
  let lonMin = Infinity;
  let lonMax = -Infinity;
  let latMin = Infinity;
  let latMax = -Infinity;

  for (const { lat, lon } of points) {
    lonMin = Math.min(lonMin, lon);
    lonMax = Math.max(lonMax, lon);
    latMin = Math.min(latMin, lat);
    latMax = Math.max(latMax, lat);
  }

  const padLon = Math.max((lonMax - lonMin) * padding, 0.15);
  const padLat = Math.max((latMax - latMin) * padding, 0.15);
  lonMin -= padLon;
  lonMax += padLon;
  latMin -= padLat;
  latMax += padLat;
  const midLat = (latMin + latMax) / 2;
  const kx = Math.cos(midLat * Math.PI / 180);
  const spanX = (lonMax - lonMin) * kx;
  const spanY = latMax - latMin;
  const scale = Math.min(width / spanX, height / spanY);

  return {
    lonMin, latMax, kx, scale, midLat,
    ox: (width - spanX * scale) / 2,
    oy: (height - spanY * scale) / 2,
  };
}

export function project(lon: number, lat: number, view: MapView): [number, number] {
  return [
    view.ox + (lon - view.lonMin) * view.kx * view.scale,
    view.oy + (view.latMax - lat) * view.scale,
  ];
}

function distanceSquared(a: Position, b: Position, kx: number) {
  const x = (a.lon - b.lon) * kx;
  const y = a.lat - b.lat;
  return x * x + y * y;
}

export function findNeighborhoodFlags(samples: readonly AtlasSample[]) {
  const flags = new Map<string, Assignment>();
  if (samples.length < MIN_HEURISTIC_SAMPLES) return flags;

  const meanLat = samples.reduce((sum, sample) => sum + sample.lat, 0) / samples.length;
  const kx = Math.cos(meanLat * Math.PI / 180);

  for (const sample of samples) {
    const neighbors = samples.filter(candidate => candidate.id !== sample.id)
      .map(candidate => ({ candidate, distance: distanceSquared(sample, candidate, kx) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, NEIGHBOR_COUNT);
    const counts = new Map<Assignment, number>();
    for (const { candidate } of neighbors) {
      if (candidate.assignment === sample.assignment) continue;
      counts.set(candidate.assignment, (counts.get(candidate.assignment) ?? 0) + 1);
    }
    for (const [assignment, count] of counts) {
      if (count >= FLAG_THRESHOLD) flags.set(sample.id, assignment);
    }
  }

  return flags;
}
