import type { SourceGap } from '../evidence/model.ts';
import {
  DEFAULT_HOURS, EXCLUSIONS, HOUR_MS, MAX_HOURS, PRODUCT, STATION, hasUninterpretedQuality, hourlyInterval,
  type Exclusion, type Observation, type ObservationWindow, type SignalsSnapshot,
} from './observations.ts';

export const NOAA_ENDPOINT = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';
const NO_DATA_MESSAGE = 'No data was found. This product may not be offered at this station at the requested time.';
const MAX_BODY_BYTES = 256 * 1024;
const MAX_ROWS = 150;
const NUMERIC_PATTERN = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;
const NOAA_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/;

type ErrorCode = 'invalid_request' | 'upstream_timeout' | 'upstream_unavailable';

export class SignalsError extends Error {
  readonly code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

export function parseSignalsParams(params: URLSearchParams) {
  const entries = [...params.entries()];
  const range = params.get('range');
  const hours = range === null ? DEFAULT_HOURS : Number(range);
  const supported = entries.length <= 3 && entries.every(([key, value]) => {
    if (params.getAll(key).length !== 1) return false;
    if (key === 'station') return value === STATION.id;
    if (key === 'product') return value === PRODUCT;
    return key === 'range' && /^[1-9]\d?$/.test(value) && hours <= MAX_HOURS;
  });
  if (!supported) {
    throw new SignalsError('invalid_request', 'Use Providence station 8454000, water_temperature, and a whole-hour range from 1 to 72.');
  }
  return hours;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

// Adapted from the pinned NOAA Signals Lab GMT parser. Round-trip validation
// rejects impossible dates rather than letting Date.UTC roll them forward.
export function parseNoaaGmtTimestamp(raw: unknown) {
  if (typeof raw !== 'string') return null;
  const parts = NOAA_TIME_PATTERN.exec(raw);
  if (!parts) return null;
  const [, year, month, day, hour, minute] = parts.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
  if (
    date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day || date.getUTCHours() !== hour || date.getUTCMinutes() !== minute
  ) return null;
  return date.toISOString();
}

function classifyMeasurement(raw: unknown):
  | { ok: true; value: number; rawValue: Observation['rawValue'] }
  | { ok: false; reason: Exclusion['reason'] } {
  if (raw === undefined || raw === null) return { ok: false, reason: 'missing_value' };
  if (typeof raw === 'string' && raw.trim() === '') return { ok: false, reason: 'blank_value' };
  if (typeof raw !== 'number' && (typeof raw !== 'string' || !NUMERIC_PATTERN.test(raw.trim()))) {
    return { ok: false, reason: 'malformed_value' };
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) return { ok: false, reason: 'non_finite_value' };
  return { ok: true, value: value === 0 ? 0 : value, rawValue: raw };
}

export function observationWindow(hours: number, now: Date): ObservationWindow {
  // Use completed UTC hours. The current hour may still be in progress.
  const end = Math.floor(now.getTime() / HOUR_MS) * HOUR_MS;
  return {
    hours,
    startUtc: new Date(end - hours * HOUR_MS).toISOString(),
    endUtcExclusive: new Date(end).toISOString(),
  };
}

export function noaaSourceUrl(window: ObservationWindow) {
  const from = (date: string) => date.slice(0, 16).replace(/-/g, '').replace('T', ' ');
  const lastMinute = new Date(Date.parse(window.endUtcExclusive) - 60_000).toISOString();
  const query = new URLSearchParams({
    station: STATION.id,
    product: PRODUCT,
    begin_date: from(window.startUtc),
    end_date: from(lastMinute),
    interval: 'h',
    units: 'metric',
    time_zone: 'gmt',
    format: 'json',
    application: 'strata_builds',
  });
  return NOAA_ENDPOINT + '?' + query.toString();
}

function isAmbiguousNoData(payload: Record<string, unknown> | null) {
  const message = asRecord(payload?.error)?.message;
  return message === NO_DATA_MESSAGE || message === 'No data was found.';
}

function upstreamUnavailable() {
  return new SignalsError('upstream_unavailable', 'NOAA observations could not be retrieved or validated. Try again later.');
}

function normalizeRows(rows: unknown[], window: ObservationWindow) {
  const observations = new Map<string, Observation>();
  const exclusions: Exclusion[] = [];
  // First structurally valid value in NOAA order wins each in-window hour.
  rows.forEach((value, rowIndex) => {
    const row = asRecord(value);
    const rawTimestamp = row?.t ?? null;
    const rawValue = row?.v ?? null;
    const flags = { f: row?.f ?? null, q: row?.q ?? null };
    const observedAt = parseNoaaGmtTimestamp(rawTimestamp);
    const measurement = classifyMeasurement(rawValue);
    const reject = (reason: Exclusion['reason']) => {
      exclusions.push({ rowIndex, reason, observedAt, rawTimestamp, rawValue, flags });
    };
    if (!row) return reject('malformed_row');
    if (!observedAt || typeof rawTimestamp !== 'string') return reject('malformed_timestamp');
    if (observedAt < window.startUtc || observedAt >= window.endUtcExclusive) return reject('outside_window');
    if (Date.parse(observedAt) % HOUR_MS !== 0) return reject('off_hour');
    if (!measurement.ok) return reject(measurement.reason);
    if (observations.has(observedAt)) return reject('duplicate_timestamp');
    observations.set(observedAt, {
      rowIndex, observedAt, rawTimestamp, value: measurement.value, rawValue: measurement.rawValue, flags,
    });
  });
  return { observations: [...observations.values()].sort((a, b) => a.observedAt.localeCompare(b.observedAt)), exclusions };
}

function summarize(observations: Observation[]): SignalsSnapshot['summary'] {
  const latest = observations[observations.length - 1];
  if (!latest) return null;
  const values = observations.map(({ value }) => value);
  // Divide prior to summing so extreme finite inputs cannot overflow the sum.
  const mean = values.reduce((sum, value) => sum + value / values.length, 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return {
    latest,
    min,
    max,
    mean: Number(Math.min(max, Math.max(min, mean)).toFixed(2)),
    count: values.length,
  };
}

function evidenceGaps(
  window: ObservationWindow,
  observations: Observation[],
  exclusions: Exclusion[],
  sourceUrl: string,
  retrievedAt: string,
  ambiguous: boolean,
) {
  const scope = {
    provider: 'NOAA CO-OPS', dataset: 'CO-OPS Data API', station: STATION.id,
    location: STATION.name, product: PRODUCT,
  };
  const basis = 'One expected slot per completed UTC hour in the requested window.';
  const prefix = STATION.id + ':' + PRODUCT;
  const originalRecords = 'Inspect the NOAA response, station inventory and maintenance history, then compare documented alternate sources.';
  const gaps: SourceGap[] = [];

  if (ambiguous) {
    gaps.push({
      id: prefix + ':coverage:' + window.startUtc + '/' + window.endUtcExclusive,
      type: 'source_coverage_unknown',
      scope, interval: window, coverageBasis: basis,
      sources: [{ url: sourceUrl, retrievedAt }],
      detection: 'Matched the documented NOAA no-data response seen in the upstream fixture.',
      assumptions: 'The same response can occur when the requested product was not offered for this time.',
      directEvidence: 'NOAA returned an ambiguous no-data message instead of observation rows.',
      alternatives: 'The requested product might have been unavailable. Records may also exist outside this response.',
      verification: 'cannot_determine',
      limitation: 'This response cannot establish hourly coverage or observations elsewhere.',
      nextAction: originalRecords,
    });
  } else {
    const accepted = new Set(observations.map(({ observedAt }) => observedAt));
    const start = Date.parse(window.startUtc);
    for (let index = 0; index < window.hours; index++) {
      const interval = hourlyInterval(start + index * HOUR_MS);
      if (accepted.has(interval.startUtc)) continue;
      const sameHour = exclusions.filter(({ observedAt }) => observedAt === interval.startUtc);
      gaps.push({
        id: prefix + ':missing:' + interval.startUtc,
        type: 'observation_gap',
        scope, interval, coverageBasis: basis,
        sources: [{ url: sourceUrl, retrievedAt, rowIndexes: sameHour.map(({ rowIndex }) => rowIndex) }],
        detection: 'Compared accepted UTC timestamps with the expected hourly grid.',
        assumptions: 'The hourly grid is a review basis and does not certify a continuous monitoring schedule.',
        directEvidence: sameHour.length
          ? 'Raw rows at this expected hour were excluded during validation.'
          : 'The response contains no row attributable to this expected hour.',
        alternatives: 'A reading may have been delayed, withheld, uncollected, or available in another record.',
        verification: 'confirmed_within_source_scope',
        limitation: 'The gap establishes only that this response supplies no accepted value for the hour.',
        nextAction: originalRecords,
      });
    }
  }

  for (const row of exclusions) {
    gaps.push({
      id: prefix + ':excluded:' + window.startUtc + '/' + window.endUtcExclusive + ':' + row.rowIndex + ':' + (row.observedAt ?? row.reason),
      type: 'excluded_observation',
      scope,
      interval: row.observedAt && Date.parse(row.observedAt) % HOUR_MS === 0
        ? hourlyInterval(Date.parse(row.observedAt))
        : undefined,
      coverageBasis: basis,
      sources: [{ url: sourceUrl, retrievedAt, rowIndexes: [row.rowIndex] }],
      detection: 'Applied the documented Strata row validation rules.',
      assumptions: 'Validation establishes suitability for this instrument and window.',
      directEvidence: 'Strata excluded a returned raw row (' + EXCLUSIONS[row.reason] + ').',
      alternatives: 'A duplicate may represent a correction, or a malformed row may have a usable source counterpart.',
      verification: 'confirmed_within_source_scope',
      limitation: 'Row validation does not establish the cause of the exclusion or a monitoring outage.',
      nextAction: 'Inspect the raw row and compare it with the original NOAA record or later revision.',
    });
  }

  for (const point of observations.filter(({ flags }) => hasUninterpretedQuality(flags))) {
    gaps.push({
      id: prefix + ':quality:' + point.observedAt,
      type: 'uninterpreted_quality',
      scope, interval: hourlyInterval(Date.parse(point.observedAt)), coverageBasis: basis,
      sources: [{ url: sourceUrl, retrievedAt, rowIndexes: [point.rowIndex] }],
      detection: 'Preserved a quality field or a flag other than the captured baseline f=0,0,0.',
      assumptions: 'Strata has no verified rule mapping these fields to acceptance or rejection.',
      directEvidence: 'An accepted measurement contains NOAA quality metadata requiring review.',
      alternatives: 'A field may indicate a threshold or rate check, a product-specific quality level, or an unfamiliar representation.',
      verification: 'apparent_requires_investigation',
      limitation: 'The flag alone does not establish an invalid measurement or a physical cause.',
      nextAction: 'Check NOAA Water Temperature response help and confirm field semantics before applying any filter.',
    });
  }
  return gaps;
}

export function normalizeNoaa(
  payload: unknown,
  window: ObservationWindow,
  sourceUrl: string,
  retrievedAt: string,
): SignalsSnapshot {
  const response = asRecord(payload);
  const ambiguous = isAmbiguousNoData(response);
  const data = response?.data;
  if (!ambiguous && (
    response?.error || !Array.isArray(data) || data.length > MAX_ROWS ||
    (data.length > 0 && asRecord(response?.metadata)?.id !== STATION.id)
  )) throw upstreamUnavailable();

  const rows = !ambiguous && Array.isArray(data) ? data : [];
  const { observations, exclusions } = normalizeRows(rows, window);
  const summary = summarize(observations);
  const missingHours = ambiguous ? null : window.hours - observations.length;
  return {
    classification: 'observed', provider: 'NOAA CO-OPS', station: STATION, product: PRODUCT,
    units: '°C', sourceUrl, retrievedAt, window,
    status: !summary ? 'empty' : missingHours || exclusions.length ? 'partial' : 'complete',
    emptyReason: summary ? null : ambiguous ? 'noaa_no_data' : rows.length ? 'all_rows_excluded' : 'no_rows_returned',
    observations, exclusions, receivedRows: rows.length, summary,
    coverage: { applicable: !ambiguous, expectedHours: window.hours, acceptedHours: observations.length, missingHours },
    gaps: evidenceGaps(window, observations, exclusions, sourceUrl, retrievedAt, ambiguous),
  };
}

async function boundedJson(response: Response): Promise<unknown> {
  if (!response.body) throw upstreamUnavailable();
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let body = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        void reader.cancel().catch(() => {});
        throw upstreamUnavailable();
      }
      body += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(body + decoder.decode());
}

export async function fetchNoaa(
  hours: number,
  { fetchImpl = fetch, now = () => new Date(), timeoutMs = 8_000 } = {},
) {
  const window = observationWindow(hours, now());
  const sourceUrl = noaaSourceUrl(window);
  const signal = AbortSignal.timeout(timeoutMs);
  try {
    const response = await fetchImpl(sourceUrl, {
      signal, cache: 'no-store', redirect: 'error', headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      void response.body?.cancel().catch(() => {});
      throw upstreamUnavailable();
    }
    return normalizeNoaa(await boundedJson(response), window, sourceUrl, now().toISOString());
  } catch {
    if (signal.aborted) throw new SignalsError('upstream_timeout', 'The NOAA request timed out. Try again.');
    throw upstreamUnavailable();
  }
}
