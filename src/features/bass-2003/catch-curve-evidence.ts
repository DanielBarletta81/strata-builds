import type { CatchCurveFigure } from './catch-curves.ts';
import { figure4AuditFor } from './figure4-audit.ts';

export const evidenceLayers = [
  { id: 'published', label: 'Published evidence' },
  { id: 'source-quality', label: 'Source quality' },
  { id: 'open-questions', label: 'Open questions' },
] as const;

export type EvidenceLayer = typeof evidenceLayers[number]['id'];

export function evidenceLayerForKey(current: EvidenceLayer, key: string): EvidenceLayer | undefined {
  const index = evidenceLayers.findIndex(({ id }) => id === current);

  switch (key) {
    case 'ArrowLeft':
      return evidenceLayers[(index + evidenceLayers.length - 1) % evidenceLayers.length].id;
    case 'ArrowRight':
      return evidenceLayers[(index + 1) % evidenceLayers.length].id;
    case 'Home':
      return evidenceLayers[0].id;
    case 'End':
      return evidenceLayers[evidenceLayers.length - 1].id;
  }
}

// The Phase 2 register covers photograph and metadata verification only.
// The remaining states were recorded explicitly in the Phase 3 Figure 4 audit.
const reportedStates = [
  { label: 'Printed metadata', status: 'Verified' },
  { label: 'Source photograph', status: 'Verified' },
] as const;

const figure4States = [
  { label: 'Axis tick labels', status: 'Readable' },
  { label: 'Pixel calibration', status: 'Unresolved' },
  { label: 'Independent reading', status: 'Unresolved' },
] as const;

const reconstructionStates = [
  { label: 'Digitized observations', status: 'Withheld' },
  { label: 'Regression reconstruction', status: 'Withheld' },
] as const;

export function catchCurveSourceStates(figure: CatchCurveFigure) {
  return figure4AuditFor(figure)
    ? [...reportedStates, ...figure4States, ...reconstructionStates]
    : [...reportedStates, ...reconstructionStates];
}
