import { ASSIGNMENTS, validateSamples, type AtlasProvenance } from './records.ts';

const revision = '591b3b8afd1650028a5fbc68c08576e9c2a92a96';

export const DEMO_SOURCE: AtlasProvenance = {
  datasetId: 'microsat-atlas-synthetic-v1',
  classification: 'synthetic',
  sourceUrl: `https://github.com/DanielBarletta81/microsat-atlas/tree/${revision}`,
  revision,
  seed: 20261108,
};

// Site centers, row counts, and assignment weights from the pinned synthetic demo.
const SITES = [
  ['Buzzards Bay, MA', 41.57, -70.82, 9, [0.62, 0.34, 0.04]],
  ['Narragansett Bay, RI', 41.5, -71.35, 8, [0.58, 0.38, 0.04]],
  ['Montauk, NY', 41.06, -71.94, 9, [0.55, 0.4, 0.05]],
  ['Western LI Sound, NY', 40.96, -73.56, 8, [0.78, 0.18, 0.04]],
  ['NY Harbor / Hudson, NY', 40.63, -74.04, 10, [0.86, 0.1, 0.04]],
  ['Sandy Hook, NJ', 40.44, -73.99, 8, [0.64, 0.28, 0.08]],
  ['Barnegat Inlet, NJ', 39.76, -74.1, 8, [0.42, 0.44, 0.14]],
  ['Great Bay / Mullica, NJ', 39.52, -74.32, 7, [0.3, 0.5, 0.2]],
  ['Cape May, NJ', 38.94, -74.91, 8, [0.2, 0.56, 0.24]],
  ['Delaware Bay, DE', 39.18, -75.24, 8, [0.12, 0.42, 0.46]],
  ['Choptank River, MD', 38.61, -76.07, 9, [0.03, 0.94, 0.03]],
  ['Potomac mouth, VA', 37.99, -76.25, 8, [0.04, 0.92, 0.04]],
  ['James River, VA', 37.02, -76.44, 8, [0.05, 0.9, 0.05]],
] as const;

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function createDemoDataset() {
  const next = mulberry32(DEMO_SOURCE.seed);
  const rows = [];

  for (const [site, centerLat, centerLon, count, [hudson, chesapeake]] of SITES) {
    for (let index = 0; index < count; index++) {
      const draw = next();
      const assignment = ASSIGNMENTS[draw < hudson ? 0 : draw < hudson + chesapeake ? 1 : 2];
      rows.push({
        id: `MSX-${String(rows.length + 1).padStart(3, '0')}`,
        site,
        lat: Number((centerLat + (next() - 0.5) * 0.12).toFixed(4)),
        lon: Number((centerLon + (next() - 0.5) * 0.12).toFixed(4)),
        assignment,
      });

      // The pinned generator consumed these draws for three illustrative fields.
      // Advance past them so subsequent positions and assignments stay identical.
      next();
      next();
      next();
    }
  }

  return validateSamples(rows, DEMO_SOURCE);
}
