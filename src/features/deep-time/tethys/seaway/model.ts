import { seawayEvidence } from './evidence.ts';

export type Layer = 'plate' | 'marine' | 'questions';
export type Evidence = typeof seawayEvidence[number];

export type Inspection = {
  layer: Layer;
  checkpoint: string;
  evidence: Evidence;
};

export const initialInspection: Inspection = {
  layer: 'plate',
  checkpoint: 'adria',
  evidence: seawayEvidence[3],
};

type Action =
  | { type: 'layer'; layer: Layer }
  | { type: 'checkpoint'; id: string }
  | { type: 'evidence'; evidence: Evidence };

export function inspect(state: Inspection, action: Action): Inspection {
  switch (action.type) {
    case 'layer':
      return { ...state, layer: action.layer };
    case 'checkpoint': {
      const related = seawayEvidence.find((record) => record.mapContext === action.id);
      return {
        ...state,
        checkpoint: action.id,
        evidence: state.evidence.mapContext === action.id ? state.evidence : related ?? state.evidence,
      };
    }
    case 'evidence':
      return { ...state, evidence: action.evidence, checkpoint: action.evidence.mapContext ?? state.checkpoint };
  }
}

export function assessAge(record: Evidence, snapshotMa: number) {
  if (record.age.kind === 'model') return snapshotMa === record.age.inspectedAtMa ? 'model-epoch' : 'outside-verified-epoch';
  if (record.age.kind === 'stage') return 'stage-only';
  return snapshotMa >= record.age.youngerMa && snapshotMa <= record.age.olderMa ? 'study-interval' : 'outside-study';
}
