import transcription from './transcription.json' with { type: 'json' };

export const { report, mortality, growth, figureArchive } = transcription;
export type MortalityRow = typeof mortality.rows[number];
export type MortalityMetric = 'z' | 's' | 'a';

export const mortalityMetrics: Record<MortalityMetric, { symbol: string; label: string; scale: string }> = {
  z: { symbol: 'Z', label: 'Instantaneous mortality', scale: 'Rate per year for annual age steps' },
  s: { symbol: 'S', label: 'Annual survival', scale: 'Fraction surviving one year' },
  a: { symbol: 'A', label: 'Annual mortality', scale: 'Fraction dying within one year' },
};

export const growthUnits = { asymptoteMm: 'mm', t0Years: 'years', k: 'Unit not supplied in the transcription' } as const;

export const methodsReferences = {
  mortality: 'https://www.fao.org/4/x5685e/x5685e05.htm',
  growth: 'https://www.fao.org/4/w5449e/w5449e04.pdf',
} as const;

export function periodsFor(group: string) {
  return [...new Set(mortality.rows.filter((row) => row.group === group).map((row) => row.period))];
}

export function recordsForPeriod(period: string) {
  return mortality.rows.filter((row) => row.period === period);
}

export function mortalityRecord(period: string, method: string) {
  return recordsForPeriod(period).find((row) => row.method === method);
}

export function comparisonSeries(selected: MortalityRow) {
  return mortality.rows.filter(({ group, season, method }) =>
    group === selected.group && season === selected.season && method === selected.method);
}
