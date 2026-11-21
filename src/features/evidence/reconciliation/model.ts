export type EvidenceSource = {
  provider: string;
  dataset: string;
  version: string;
  url: string;
  file?: string;
  sha256?: string;
  retrievedAt: string | null;
  access: 'public' | 'inaccessible';
  rights: string;
};

export type EvidenceRecord = {
  source: EvidenceSource;
  station: string;
  variable: string;
  unit: string;
  locator: string;
  time: string;
  timeConvention: string;
} & (
  | { status: 'recorded' | 'derived'; originalValue: string }
  | { status: 'excluded' | 'missing' | 'present_unverified' | 'published_statement'; originalValue: string | null }
);

export type ReconciliationOutcome =
  | 'direct_record_match'
  | 'partially_resolved'
  | 'unresolved_source_conflict'
  | 'unresolved_missing_records'
  | 'not_comparable';

export type ReconciliationClaim = {
  question: string;
  compared: readonly EvidenceRecord[];
  assumptions: readonly string[];
  supporting: readonly string[];
  conflicting: readonly string[];
  outcome: ReconciliationOutcome;
  alternatives: readonly string[];
  nextEvidence: string;
};

export const outcomeLabels: Record<ReconciliationOutcome, string> = {
  direct_record_match: 'Resolved by direct record match',
  partially_resolved: 'Partially resolved',
  unresolved_source_conflict: 'Unresolved source conflict',
  unresolved_missing_records: 'Unresolved due to missing records',
  not_comparable: 'Not comparable',
};
