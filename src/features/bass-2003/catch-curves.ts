import registry from './photo-registry.json' with { type: 'json' };
import { mortalityRecord } from './report.ts';

export const { catchCurves, printedFitAges } = registry;
export const photoReceipts: Readonly<Record<string, { sha256: string; content: string }>> = registry.photos;

export function catchCurveTableRecord(figure: typeof catchCurves[number]) {
  const record = mortalityRecord(figure.period, figure.method);
  return record?.scope === figure.scope ? record : undefined;
}
