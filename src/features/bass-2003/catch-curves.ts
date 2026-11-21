import registry from './photo-registry.json' with { type: 'json' };
import { recordsForPeriod } from './report.ts';

export const { audit: catchCurveAudit, catchCurves, printedFitAges } = registry;
export type CatchCurveFigure = typeof catchCurves[number];
export const photoReceipts: Readonly<Record<string, { sha256: string; content: string }>> = registry.photos;

export function selectedCatchCurve(figures: readonly CatchCurveFigure[], id: string) {
  return figures.find((figure) => figure.id === id) ?? figures[0];
}

export function catchCurveTableRecord(figure: CatchCurveFigure) {
  const matches = recordsForPeriod(figure.period).filter((record) =>
    record.method === figure.method && record.scope === figure.scope &&
    record.group === figure.group && record.season === figure.season);
  return matches.length === 1 ? matches[0] : undefined;
}
