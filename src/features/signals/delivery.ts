import { FRESHNESS_MS, HOUR_MS, type SignalsSnapshot } from './observations.ts';

export const REUSE_MINUTES = 5;
export const REUSE_INTERVAL_MS = REUSE_MINUTES * 60_000;

export type SignalsDelivery = {
  source: 'noaa' | 'cache' | 'in_flight';
  nextCheckAt: string;
};

export type SignalsResponse = SignalsSnapshot & { delivery: SignalsDelivery };
export type SignalsApiError = {
  error: { code: string; message: string };
  delivery?: SignalsDelivery;
};

export function reuseSlot(nowMs: number) {
  const startMs = Math.floor(nowMs / REUSE_INTERVAL_MS) * REUSE_INTERVAL_MS;
  return {
    startMs,
    nextCheckAt: new Date(startMs + REUSE_INTERVAL_MS).toISOString(),
  };
}

export function signalsStatus({
  response,
  nowMs,
  pending,
  error,
  failedDelivery,
}: {
  response: SignalsResponse | null;
  nowMs: number;
  pending: boolean;
  error: string | null;
  failedDelivery?: SignalsDelivery;
}) {
  const stale = Boolean(response && (
    error ||
    nowMs - Date.parse(response.retrievedAt) >= FRESHNESS_MS ||
    nowMs >= Date.parse(response.window.endUtcExclusive) + HOUR_MS
  ));
  if (pending) {
    return {
      stale,
      text: response ? 'Checking for an update. The previous response remains visible.' : 'Loading NOAA observations…',
    };
  }
  if (error) {
    const failureContext = failedDelivery?.source === 'cache' ? 'Reused the last failed NOAA check. '
      : failedDelivery?.source === 'in_flight' ? 'The shared NOAA check failed. ' : '';
    return {
      stale,
      text: failureContext + error + (response ? ' Showing the previous response.' : ''),
    };
  }
  if (stale) {
    return { stale, text: 'The displayed response is stale. Check for an updated window.' };
  }
  if (!response) return { stale, text: 'NOAA observations are unavailable.' };

  const disposition = response.delivery.source === 'noaa'
    ? 'New response from NOAA.'
    : response.delivery.source === 'cache' ? 'Reused a cached NOAA response.' : 'Shared a NOAA request already in progress.';
  const coverage = response.status === 'complete' ? 'All expected hours are represented.'
    : response.status === 'partial' ? 'Partial response. Review coverage and excluded rows.'
    : response.emptyReason === 'noaa_no_data' ? 'NOAA returned an ambiguous no-data response.'
    : response.emptyReason === 'all_rows_excluded' ? 'The response included rows, but none passed validation.'
    : 'NOAA returned an empty observation list.';
  return { stale, text: disposition + ' ' + coverage };
}
