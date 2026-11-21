import type { CoverageFinding } from '../evidence/model.ts';
import bullockRows from './data/bullock-2012.json' with { type: 'json' };
import planktonRows from './data/station-ii-weeks.json' with { type: 'json' };
import { bullockCoverage, parseBullock, parseWeeks, planktonCoverage, samplingDifferences } from './coverage.ts';
import { sourceLinks } from './sources.ts';

const archive = { url: sourceLinks.archive, retrievedAt: '2026-11-21T00:28:32Z' };
const plan = { url: sourceLinks.report, retrievedAt: null };
const planktonFile = { url: sourceLinks.planktonFile, retrievedAt: '2026-11-21T00:26:51Z' };
const planktonMetadata = { url: sourceLinks.plankton, retrievedAt: null };

const bullockScope = {
  provider: 'RIDEM OWR and NBC', dataset: 'NBFSMN 2012 edited archive, BR sheet', station: 'B4-S',
  location: 'Bullock Reach, upper Narragansett Bay', product: 'Surface water temperature',
  period: { start: '2012-05-18', endInclusive: '2012-11-25', precision: 'civil_date' },
} as const;

const planktonScope = {
  provider: 'URI-GSO and BCO-DMO', dataset: '874956 v1', station: 'Station II',
  location: 'West Passage, Narragansett Bay', product: 'Temperature_SURF',
  period: { start: '2012', endInclusive: '2012', precision: 'year' },
} as const;

type Finding = CoverageFinding & { title: string };
const outOfWater = new Set([
  '2012-06-12', '2012-06-26', '2012-07-10', '2012-08-07', '2012-08-21',
  '2012-09-06', '2012-09-20', '2012-10-16', '2012-10-31', '2012-11-14',
]);

export function loadInvestigation() {
  const months = bullockCoverage(parseBullock(bullockRows));
  const weeks = parseWeeks(planktonRows);
  const years = [2011, 2012, 2013].map((year) => planktonCoverage(weeks, year));
  const blanks = months.flatMap((month) => month.blanks);
  const blankDates = new Set(blanks.map(({ date }) => date));
  const explainedDates = [...blankDates].filter((date) => outOfWater.has(date)).length;
  const expected = months.reduce((sum, month) => sum + month.expected, 0);
  const reported = months.reduce((sum, month) => sum + month.reported, 0);
  const unknown = months.reduce((sum, month) => sum + month.unknownSlots, 0);
  const outsideDays = months.reduce((sum, month) => sum + month.outsideDays, 0);
  if (years.some(({ reported }) => reported === null) || years[1].reported !== 0 || unknown !== 0) {
    throw new Error('Frozen Frontier coverage differs from the reviewed evidence');
  }

  const incompatibleFields = samplingDifferences(
    { station: 'B4-S', depth: '0.5–1 m', units: '°C', device: 'Fixed YSI sonde', cadence: '15 minutes', timeSupport: 'Workbook date and time' },
    { station: 'Station II', depth: 'Surface grab', units: '°C', device: 'Bucket sample', cadence: 'Nominally weekly', timeSupport: 'Archive year and week label' },
  );

  const findings: Finding[] = [
    {
      id: 'bullock-in-season', title: 'Blank temperature cells within the deployment',
      type: 'confirmed_missing_observation', verification: 'confirmed_within_source_scope',
      scope: bullockScope, sources: [{ ...archive, rowIndexes: blanks.map(({ row }) => row - 1) }, plan],
      coverageBasis: '96 worksheet slots per full deployment day. Launch and recovery dates are excluded.',
      detection: 'Compare the edited surface temperature column with the unique worksheet date and quarter-hour grid.',
      assumptions: 'Edited cell presence is evidence about this release. The dates and times retain the workbook’s clock labels.',
      directEvidence: blanks.length + ' blank slots across ' + blankDates.size + ' dates. The surface field notes document out-of-water events on ' + explainedDates + ' of those dates.',
      alternatives: 'A sonde swap can explain absent measurements. An exclusion during editing can also leave a blank.',
      limitation: 'Two note times differ by one minute from the quarter-hour cells. Matching dates do not settle the cause of each cell.',
      nextAction: 'Compare the July 10 09:30 and 09:45 cells with the raw surface export and the same-day sonde log.',
    },
    {
      id: 'bullock-off-season', title: 'The Bullock Reach schedule explains winter coverage',
      type: 'planned_seasonal_non_sampling', verification: 'confirmed_within_source_scope',
      scope: { ...bullockScope, period: { start: '2012-01-01', endInclusive: '2012-12-31', precision: 'civil_date' } },
      sources: [plan, archive],
      coverageBasis: 'The NBC report and surface metadata agree on the 2012 deployment date boundaries.',
      detection: 'Separate dates before May 17 and after November 26 from the full in-season grid.',
      assumptions: 'This schedule applies only to surface station B4-S in the reviewed 2012 deployment.',
      directEvidence: outsideDays + ' dates fall outside the documented season. May 17 and November 26 are partial boundary dates.',
      alternatives: 'Winter observations may exist from other programs or stations.',
      limitation: 'The B4 calendar does not establish whether other instruments sampled the surrounding waters in winter.',
      nextAction: 'Check identified winter deployments separately with their station and depth metadata.',
    },
    {
      id: 'station-ii-2012', title: 'Station II has a provider-documented 2012 temperature gap',
      type: 'confirmed_missing_observation', verification: 'confirmed_within_source_scope',
      scope: planktonScope, sources: [planktonFile, planktonMetadata],
      coverageBasis: 'Nominally weekly surface bucket sampling. The CSV contains 52 archive week keys in 2012.',
      detection: 'Count non-nd Temperature_SURF entries and compare with the provider’s 2012 exception.',
      assumptions: 'Year/week keys are archive labels. The file supplies no observation dates or timezone for individual entries.',
      directEvidence: 'All 52 temperature entries are nd in 2012. The provider lists 2012 as a year without temperature collection for this series.',
      alternatives: 'An independent nearby program might have overlapping measurements. They would describe its own site and method.',
      limitation: 'This evidence applies to temperature at Station II. It leaves the cause of the collection gap unresolved.',
      nextAction: 'Ask for the survey’s 2012 field log or a dated methods note covering the temperature program.',
    },
    {
      id: 'unequal-methods', title: 'The two surface-temperature records cannot be pooled',
      type: 'incompatible_sampling_methods', verification: 'confirmed_within_source_scope',
      scope: { ...planktonScope, location: 'Station II and Bullock Reach, Narragansett Bay' },
      sources: [plan, planktonMetadata],
      coverageBasis: 'Both studies report surface temperature in °C and overlap in calendar year 2012.',
      detection: 'Compare station, depth, collection device, cadence, and temporal support before joining records.',
      assumptions: 'The comparisons use the published methods for each historical source product.',
      directEvidence: 'B4-S is a fixed 0.5–1 m sonde with a 15-minute grid. Station II is a weekly surface bucket sample at a different site.',
      alternatives: 'A documented paired sampling study could establish how the two methods relate under matched conditions.',
      limitation: 'Coverage can be inspected independently. Temperature values cannot fill gaps in the other series from this evidence.',
      nextAction: 'Locate collocated, time-matched surface measurements with depth and quality flags, or plan paired sampling.',
    },
    {
      id: 'location-conflict', title: 'Two source coordinates for Bullock Reach require review',
      type: 'conflicting_records', verification: 'apparent_requires_investigation',
      scope: { ...bullockScope, period: { start: '2012', endInclusive: '2012', precision: 'year' } },
      sources: [archive, plan],
      coverageBasis: 'Both records describe Bullock Reach in the 2012 monitoring program.',
      detection: 'Compare the workbook Notes coordinates with the approximate location in section 5 of the NBC report.',
      assumptions: 'Convert degrees and decimal minutes to signed decimal degrees. The sources reviewed give no named datum.',
      directEvidence: 'The worksheet gives about 41.74057° N, 71.37467° W. The NBC report gives about 41.73240° N, 71.37023° W.',
      alternatives: 'The documents might refer to different location conventions, deployments or transcription.',
      limitation: 'The locator uses the workbook position. The discrepancy alone cannot establish that the buoy moved.',
      nextAction: 'Obtain the 2012 deployment location log and datum before making a spatial join.',
    },
    {
      id: 'post-2019', title: 'The Station II file ends in 2019',
      type: 'uncertain_monitoring_continuation', verification: 'cannot_determine',
      scope: { ...planktonScope, period: { start: '2020', endInclusive: '2026', precision: 'year' } },
      sources: [planktonMetadata, { url: sourceLinks.planktonProject, retrievedAt: null }],
      coverageBasis: 'The reviewed temperature release is explicitly bounded to 1959–2019.',
      detection: 'Check the file’s terminal year and compare it with the broader series landing page.',
      assumptions: 'A dataset version can end before the underlying time series ends.',
      directEvidence: 'The archived temperature file supplies no rows after 2019.',
      alternatives: 'A later release may exist under a different accession or be available from the team.',
      limitation: 'The end of this release cannot establish when, or whether, temperature collection stopped.',
      nextAction: 'Identify a post-2019 Station II surface temperature accession and its collection and QA metadata.',
    },
  ];

  return { months, years, blanks, blankDates: blankDates.size, expected, reported, outsideDays, incompatibleFields, findings };
}
