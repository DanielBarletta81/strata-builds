import { photoReceipts, type CatchCurveFigure } from './catch-curves.ts';

const ageTickLabels = ['0', '2', '4', '6', '8', '10', '12'] as const;
const lnFrequencyTickLabels = ['0.00', '1.00', '2.00', '3.00', '4.00', '5.00'] as const;

const figure4Audit = {
  figureId: 'figure-4',
  sourceFile: 'IMG_3956.jpg',
  sha256: '0321094cbe674fc047ca1c3370513c360f7246aae219c1993161f20cc59e5b3c',
  sourceType: 'photograph_of_printed_figure',
  dimensions: [2048, 1536],
  status: 'reconstruction_blocked',
  ageTickLabels,
  lnFrequencyTickLabels,
  calibration: {
    pixelToDataTransform: null,
    independentReading: null,
  },
  points: null,
  tracedRegression: null,
  findings: [
    {
      label: 'Age (years)',
      note: `${ageTickLabels.join(', ')}. All printed tick labels and the x-axis baseline are visible.`,
    },
    {
      label: 'ln Frequency',
      note: `${lnFrequencyTickLabels.join(', ')}. The top border extends above the highest labeled tick.`,
    },
    {
      label: 'Plot geometry',
      note: 'The camera is oblique and the paper bows along the right edge. A four-corner correction alone would leave page curvature unaccounted for.',
    },
    {
      label: 'Plotted diamonds',
      note: 'Nine diamonds are visible above the baseline. Several lie close to the printed regression line. Their positions remain unmeasured.',
    },
    {
      label: 'Zero-axis marks',
      note: 'Three diamond-shaped marks touch the baseline, including one at the lower-right corner. Their meanings remain unresolved. A position at zero on this log axis cannot establish a zero catch count.',
    },
    {
      label: 'Regression line',
      note: 'The printed descending line is visible. Its coordinates and slope await independent tracing.',
    },
    {
      label: 'Independent reading',
      note: 'A second calibration and reading are unavailable. Coordinate uncertainty could not be quantified.',
    },
  ],
} as const;

export type Figure4Audit = typeof figure4Audit;

export function figure4AuditFor(figure: Pick<CatchCurveFigure, 'id' | 'sourceFile'>) {
  if (figure.id === figure4Audit.figureId && figure.sourceFile === figure4Audit.sourceFile &&
    photoReceipts[figure.sourceFile]?.sha256 === figure4Audit.sha256) {
    return figure4Audit;
  }
}
