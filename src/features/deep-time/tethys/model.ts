import type { GeologicalEvent } from '../chronology.ts';
import sources from './data/sources.json' with { type: 'json' };

export const tethysSources = sources;

export function hasTethysReconstruction(when: GeologicalEvent['when']) {
  return when.kind === 'approximate' && when.years === sources.ageMa * 1_000_000;
}

export function formatCoordinates([longitude, latitude]: readonly number[]) {
  return `${Math.abs(latitude).toFixed(1)}° ${latitude < 0 ? 'S' : 'N'}, ${Math.abs(longitude).toFixed(1)}° ${longitude < 0 ? 'W' : 'E'}`;
}
