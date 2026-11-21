import primary from './data/primary.json' with { type: 'json' };
import type { EvidenceRecord, ReconciliationClaim } from './model.ts';
import { comparisonOutcome, matchClock, summarizeWeeks } from './matching.ts';
import { sources } from './sources.ts';

const rawAlignment = { kind: 'scoped_clock_alignment', offsetSeconds: 64 } as const;
const gridAlignment = { kind: 'same_time_convention' } as const;
const gridClock = 'Workbook local standard-time quarter-hour grid';
const loggerClock = 'Original logger civil label. UTC offset unverified.';
const stationClock = 'Published archive year/week. Sampling instant unverified.';

type BullockInput = { row: number; date: string; clock: string; value: string | null; bold?: boolean };

function bullockRecord(product: 'rawText' | 'rawWorkbook' | 'edited' | 'corrected', row: BullockInput): EvidenceRecord {
  const raw = product === 'rawText' || product === 'rawWorkbook';
  const details = {
    source: sources[product],
    station: 'Bullock Reach B4-S',
    variable: product === 'rawText' ? 'snd1Parms(1)' : raw ? 'Surf_Temp' : 'Temp',
    unit: '°C',
    time: `${row.date} ${row.clock}`,
    timeConvention: raw ? loggerClock : gridClock,
    locator: product === 'rawText' ? `Line ${row.row}` : raw ? `BullocksReach_Surface!C${row.row}` : `BR!F${row.row}`,
  };

  if (row.value === null) return { ...details, status: product === 'edited' ? 'excluded' : 'missing', originalValue: null };
  return { ...details, status: product === 'corrected' && row.bold ? 'derived' : 'recorded', originalValue: row.value };
}

export function bullockClassification(
  first: ReturnType<typeof matchClock<BullockInput>>,
  second: ReturnType<typeof matchClock<BullockInput>>,
  edited: EvidenceRecord,
  corrected: EvidenceRecord | null,
) {
  if (first.status === 'unavailable' || second.status === 'unavailable' || !corrected) {
    return 'Source records unavailable or incomplete';
  }
  if (first.status === 'missing' && second.status === 'missing') {
    return 'No corresponding raw value found in the reviewed files';
  }
  if (first.status === 'matched' && second.status === 'matched' && edited.status === 'excluded'
    && comparisonOutcome(first.record.value, second.record.value, 'verified') === 'direct_record_match') {
    return corrected.status === 'derived'
      ? 'Raw value exists; transformed in corrected product'
      : 'Raw value exists; removed during editing';
  }
  return 'Correspondence ambiguous';
}

export const bullockRows = primary.bullock.edited.map((row) => {
  const logger = matchClock(row, primary.bullock.rawText, rawAlignment);
  const rawBook = matchClock(row, primary.bullock.rawWorkbook, rawAlignment);
  const correction = matchClock(row, primary.bullock.corrected, gridAlignment);
  const raw = logger.status === 'matched' ? bullockRecord('rawText', logger.record) : null;
  const worksheet = rawBook.status === 'matched' ? bullockRecord('rawWorkbook', rawBook.record) : null;
  const edited = bullockRecord('edited', row);
  const corrected = correction.status === 'matched' ? bullockRecord('corrected', correction.record) : null;
  const agreement = raw && worksheet
    && comparisonOutcome(raw.originalValue, worksheet.originalValue, 'verified') === 'direct_record_match'
    && comparisonOutcome(raw.originalValue, edited.originalValue, 'verified') === 'direct_record_match'
    && corrected && comparisonOutcome(raw.originalValue, corrected.originalValue, 'verified') === 'direct_record_match';

  return {
    clock: row.clock, raw, recordNumber: logger.status === 'matched' ? logger.record.recordNumber : null,
    worksheet, edited, corrected,
    finding: agreement ? 'Temperature agrees across products' : bullockClassification(logger, rawBook, edited, corrected),
  };
});

const bullockTarget = bullockRows.filter((row) => row.edited.status === 'excluded');

export const bullockClaim: ReconciliationClaim = {
  question: 'What happened to the two edited surface-temperature cells on July 10, 2012?',
  compared: bullockTarget.flatMap(({ edited, corrected }) => corrected ? [edited, corrected] : [edited]),
  outcome: 'partially_resolved',
  supporting: [
    'Both edited cells are blank. The corrected workbook has a bold calculated value at each matching grid row.',
    'Four adjacent temperatures agree across the logger text, raw workbook, edited workbook and corrected workbook.',
  ],
  conflicting: [
    'The edited workbook’s Notes tab describes blanks as deletions without calculation. Neither reviewed raw export has a corresponding row for these two slots.',
    'The two corrected values are stored as numbers. The temperature cells contain no formula, and the reviewed notes give no calculation recipe for them.',
  ],
  assumptions: [
    'Compare only B4-S near-surface temperature on July 10. Match the edited and corrected grid by station, civil date and clock.',
    'The July logger alignment is +64 seconds, supported by four adjacent timestamps and unchanged temperatures. It is a match within this window, with the logger and notes UTC offsets unverified.',
    'The archive introduction documents quarter-hour normalization for edited and corrected Date & Time. Sep 6 and Oct 31 notes use 07:31, paired with raw 07:31:04 and edited grid 07:30:00. The export rule for choosing a field-note label is undocumented.',
  ],
  alternatives: [
    'The spot readings could be absent from the reviewed exports or retained in a separate sonde download. The consecutive buoy record numbers establish the export sequence only.',
  ],
  nextEvidence: 'Retrieve the two field-listed deployment files (B4.nbcbrs062612 and B4.nbcbrs071012) and the correction worksheet or edit log for BR!F5230–F5231.',
};

const yearTotals = summarizeWeeks(primary.station);
export const stationYears = [...yearTotals].map(([year, totals]) => ({
  year, ...totals, records: primary.station.filter((row) => row.year === year),
}));

const stationRecords: EvidenceRecord[] = primary.station.map((row) => ({
  source: sources.stationCsv,
  station: 'Station II, Narragansett Bay West Passage',
  variable: 'Temperature_SURF',
  unit: '°C',
  locator: `CSV line ${row.row}, Temperature_SURF`,
  time: `${row.year}, archive week ${row.week}`,
  timeConvention: stationClock,
  ...(row.field === 'nd'
    ? { status: 'missing', originalValue: 'nd' } as const
    : { status: 'present_unverified', originalValue: null } as const),
}));

export const stationMethodQuote = 'No data were collected for the following parameters during the following years: Temperature: 1997-1999; 2012';
const stationMethod: EvidenceRecord = {
  source: sources.stationMethods,
  station: 'Station II, Narragansett Bay West Passage',
  variable: 'Temperature',
  unit: '°C',
  locator: 'Methods & Sampling → Methodology → Sampling and analytical procedures',
  time: '1997–1999 and 2012',
  timeConvention: 'Provider’s stated collection years',
  status: 'published_statement',
  originalValue: stationMethodQuote,
};

export const legacyRows = primary.legacy1997;
export const legacyEqual = legacyRows.filter((row) => row.relation === 'same_numeric').length;

export const stationClaim: ReconciliationClaim = {
  question: 'Why are temperatures published for years listed as collection gaps?',
  compared: [stationMethod, ...stationRecords],
  outcome: 'unresolved_source_conflict',
  supporting: [
    '1998 and 2012 contain 52 published archive weeks each, all marked nd.',
    `The earlier NABATS workbook has ${legacyEqual} numeric cells that agree at the same published 1997 year/week keys.`,
    'URI’s separate Physical Data workbook has dated Station II surface-temperature entries after 2019, up to January 13, 2025 in this copy.',
  ],
  conflicting: [
    'BCO-DMO v1 contains 16 numeric entries in 1997 and 42 in 1999. Its methodology lists both years as collection gaps.',
    'In the legacy 1997 worksheet, week 7 is 5.50 °C where v1 is nd. At week 8, the legacy value is 5.00 °C and v1 is 5.25 °C.',
  ],
  assumptions: [
    'Treat year/week as the published archive key. Dates in other files describe those files only.',
    'The BCO-DMO sentinel nd counts as missing. A numeric field, including zero, counts as published presence. Collection and QA for disputed cells remain unverified.',
    'The legacy comparison uses matching published year/week and surface °C fields. Agreement does not establish that one file was copied from the other.',
  ],
  alternatives: [
    'The gap note could describe a different collection scope from the archived values. Partial-year coverage, a predecessor source, or later additions remain possible.',
    'The study describes separate model-based gap filling. Its released input tables agree with v1 on these weeks and do not explain the provenance of the disputed numeric fields.',
  ],
  nextEvidence: 'Ask the dataset curator for a row-level crosswalk or original collection and QA logs for the 1997 and 1999 cells, beginning with legacy weeks 7–8 and the first populated 1999 weeks.',
};
