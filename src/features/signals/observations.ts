import type { SourceGap, TimeInterval } from '../evidence/model.ts';

export const STATION = {
  id: '8454000',
  name: 'Providence, Rhode Island',
  url: 'https://tidesandcurrents.noaa.gov/stationhome.html?id=8454000',
} as const;
export const PRODUCT = 'water_temperature';
export const HOUR_MS = 3_600_000;
export const DEFAULT_HOURS = 24;
export const MAX_HOURS = 72;
export const FRESHNESS_MS = 15 * 60_000;
export const NOAA_SCHEMA = 'https://api.tidesandcurrents.noaa.gov/api/prod/responseHelp.html';

export type ObservationWindow = TimeInterval & { hours: number };
export type Observation = {
  observedAt: string;
  rawTimestamp: string;
  value: number;
  rawValue: string | number;
  rowIndex: number;
  flags: { f: unknown; q: unknown };
};

export const EXCLUSIONS = {
  malformed_row: 'Malformed row',
  malformed_timestamp: 'Malformed timestamp',
  outside_window: 'Outside the requested window',
  off_hour: 'Not on the expected hour',
  missing_value: 'Missing value',
  blank_value: 'Blank value',
  malformed_value: 'Malformed value',
  non_finite_value: 'Non-finite value',
  duplicate_timestamp: 'Duplicate timestamp',
} as const;

export type Exclusion = {
  rowIndex: number;
  reason: keyof typeof EXCLUSIONS;
  observedAt: string | null;
  rawTimestamp: unknown;
  rawValue: unknown;
  flags: Observation['flags'];
};

export type SignalsSnapshot = {
  classification: 'observed';
  provider: 'NOAA CO-OPS';
  station: typeof STATION;
  product: typeof PRODUCT;
  units: '°C';
  sourceUrl: string;
  retrievedAt: string;
  window: ObservationWindow;
  status: 'complete' | 'partial' | 'empty';
  emptyReason: 'noaa_no_data' | 'no_rows_returned' | 'all_rows_excluded' | null;
  observations: Observation[];
  exclusions: Exclusion[];
  receivedRows: number;
  coverage: {
    applicable: boolean;
    expectedHours: number;
    acceptedHours: number;
    missingHours: number | null;
  };
  summary: { latest: Observation; min: number; max: number; mean: number; count: number } | null;
  gaps: SourceGap[];
};

export function hourlyInterval(startMs: number): TimeInterval {
  return {
    startUtc: new Date(startMs).toISOString(),
    endUtcExclusive: new Date(startMs + HOUR_MS).toISOString(),
  };
}

export function hasUninterpretedQuality({ f, q }: Observation['flags']) {
  return q !== null || (f !== null && f !== '0,0,0');
}

export function qualityLabel({ f, q }: Observation['flags']) {
  if (f === null && q === null) return 'No metadata';
  const fields = [];
  if (f !== null) fields.push('f ' + (typeof f === 'string' ? f : JSON.stringify(f)));
  if (q !== null) fields.push('q ' + (typeof q === 'string' ? q : JSON.stringify(q)));
  return fields.join(' · ');
}

export function contiguousObservations(observations: Observation[]) {
  const segments: Observation[][] = [];
  for (const point of observations) {
    const segment = segments[segments.length - 1];
    const previous = segment?.[segment.length - 1];
    if (previous && Date.parse(point.observedAt) - Date.parse(previous.observedAt) === HOUR_MS) {
      segment.push(point);
    } else {
      segments.push([point]);
    }
  }
  return segments;
}
