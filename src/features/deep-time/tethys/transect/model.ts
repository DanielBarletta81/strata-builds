import { seawayEvidence } from '../seaway/evidence.ts';
import { initialInspection, inspect, type Inspection, type SeawayAction } from '../seaway/model.ts';
import { targetMa, transectEvidence, type ReportedAge, type TransectRecord } from './evidence.ts';

export const coverageLabels = {
  verified: '111 Ma within published age bracket',
  broad: 'Broadly age-compatible',
  outside: 'Outside target interval',
  unresolved: 'Unresolved',
} as const;

export function ageCoverage(age: ReportedAge): keyof typeof coverageLabels {
  switch (age.basis) {
    case 'bracket':
      return age.range.youngerMa <= targetMa && targetMa <= age.range.olderMa ? 'verified' : 'outside';
    case 'conflicting-ranges': {
      const older = age.ranges.every(({ youngerMa }) => youngerMa > targetMa);
      const younger = age.ranges.every(({ olderMa }) => olderMa < targetMa);
      return older || younger ? 'outside' : 'unresolved';
    }
    case 'outside-stage':
      return 'outside';
    case 'broad':
    case 'unresolved':
      return age.basis;
  }
}

type LaboratoryState = { inspection: Inspection; record: TransectRecord };
type LaboratoryAction = SeawayAction | { type: 'transect-record'; record: TransectRecord };

export const initialLaboratory: LaboratoryState = {
  inspection: initialInspection,
  record: transectEvidence[0],
};

export function inspectLaboratory(state: LaboratoryState, action: LaboratoryAction): LaboratoryState {
  if (action.type === 'transect-record') {
    const related = seawayEvidence.find(({ id }) => id === action.record.regionalRecord);
    return {
      inspection: related ? inspect(state.inspection, { type: 'evidence', evidence: related }) : state.inspection,
      record: action.record,
    };
  }
  const inspection = inspect(state.inspection, action);
  const related = inspection.evidence.id === state.inspection.evidence.id
    ? state.record
    : transectEvidence.find((record) => record.regionalRecord === inspection.evidence.id);
  return { inspection, record: related ?? state.record };
}
