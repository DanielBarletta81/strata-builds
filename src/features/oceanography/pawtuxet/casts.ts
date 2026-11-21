import capture from './profiles.json' with { type: 'json' };

export const station = capture.station;
export const profileProgram = 'https://www.narrabay.com/snapshot-of-the-bay/water-quality-initiatives/water-quality-profiles/';
export const oxygenReference = 'https://dem.ri.gov/latest-bay-area-report';
export const lowOxygenLimit = 3;

export const fields = {
  depth: { label: 'Depth', units: 'm', column: 'E' },
  temperature: { label: 'Temperature', units: '°C', column: 'F' },
  oxygen: { label: 'Dissolved oxygen', units: 'mg/L', column: 'J' },
  density: { label: 'Published density', units: 'kg/m³', column: 'L' },
  salinity: { label: 'Salinity', units: 'psu', column: 'M' },
} as const;

export type Metric = Exclude<keyof typeof fields, 'depth'>;
type SourceCell = string | number | null;
export type DepthRecord = Record<keyof typeof fields, SourceCell> & { row: number };

export type Cast = {
  year: 2014 | 2016;
  date: string;
  clock: string | null;
  metadataRow: number;
  mark: string;
  note: string | null;
  records: readonly DepthRecord[];
};

export const casts = capture.events as readonly Cast[];
export const workbookHashes = capture.hashes;

export function workbookUrl(year: Cast['year']) {
  return `https://www.narrabay.com/wp-content/uploads/2024/04/${year}-Water-Column-Profile-Data.xlsx`;
}

export function castKey({ date, clock }: Cast) {
  return clock ? `${date} ${clock}` : date;
}

export function isNumber(value: SourceCell): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function depthCounts(records: readonly DepthRecord[]) {
  const counts = new Map<number, number>();
  for (const { depth } of records) {
    if (isNumber(depth)) counts.set(depth, (counts.get(depth) ?? 0) + 1);
  }
  return counts;
}

export function castEndpoints(records: readonly DepthRecord[]) {
  const counts = depthCounts(records);
  const levels = [...counts.keys()].sort((a, b) => a - b);
  if (levels.length < 2) return { shallow: undefined, deep: undefined };
  const shallow = levels[0];
  const deep = levels[levels.length - 1];
  return {
    shallow: counts.get(shallow) === 1 ? records.find(({ depth }) => depth === shallow) : undefined,
    deep: counts.get(deep) === 1 ? records.find(({ depth }) => depth === deep) : undefined,
  };
}

export function lowOxygenRows(records: readonly DepthRecord[]) {
  const counts = depthCounts(records);
  return records.filter(({ depth, oxygen }) =>
    isNumber(depth) && counts.get(depth) === 1 && isNumber(oxygen) && oxygen < lowOxygenLimit);
}

export function cellLocator(year: Cast['year'], row: number, field: keyof typeof fields) {
  return `${year} Data!${fields[field].column}${row}`;
}
