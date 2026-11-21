export type TimeInterval = {
  startUtc: string;
  endUtcExclusive: string;
};

type SourceScope = {
  provider: string;
  dataset: string;
  station?: string;
  location?: string;
  product?: string;
};

type SourceRecord = {
  url: string;
  retrievedAt: string | null;
  rowIndexes?: number[];
};

type GapDetails = {
  id: string;
  interval?: TimeInterval;
  coverageBasis: string;
  detection: string;
  assumptions: string;
  directEvidence: string;
  alternatives: string;
  limitation: string;
  nextAction: string;
};

export type SourceGap = GapDetails & {
  type: 'observation_gap' | 'excluded_observation' | 'uninterpreted_quality' | 'source_coverage_unknown';
  verification: 'confirmed_within_source_scope' | 'apparent_requires_investigation' | 'cannot_determine';
  scope: SourceScope;
  sources: [SourceRecord];
};

export type ResearchGap = GapDetails & {
  type: 'research_gap';
  verification: 'apparent_requires_investigation' | 'confirmed_by_cross_source_review';
  scope: Omit<SourceScope, 'provider' | 'station' | 'product'>;
  sources: [SourceRecord, SourceRecord, ...SourceRecord[]];
  crossSourceReview: string;
};

export type CoverageFinding = Omit<GapDetails, 'interval'> & {
  type: 'confirmed_missing_observation' | 'planned_seasonal_non_sampling' |
    'source_not_yet_inspected' | 'known_dataset_inaccessible' | 'uncertain_monitoring_continuation' |
    'incompatible_sampling_methods' | 'conflicting_records' | 'potentially_outdated_findings';
  verification: SourceGap['verification'];
  scope: SourceScope & {
    // Date-only and archive week scopes are kept apart from UTC instants.
    period: { start: string; endInclusive: string; precision: 'civil_date' | 'year' };
  };
  sources: [SourceRecord, ...SourceRecord[]];
};

export type EvidenceGap = SourceGap | ResearchGap | CoverageFinding;
