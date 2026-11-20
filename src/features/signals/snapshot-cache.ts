import { randomUUID } from 'node:crypto';
import { unstable_cache } from 'next/cache';
import { REUSE_INTERVAL_MS, reuseSlot, type SignalsDelivery } from './delivery';
import { fetchNoaa, observationWindow, SignalsError } from './noaa';
import { PRODUCT, STATION, type SignalsSnapshot } from './observations';

type UpstreamFailure = {
  code: 'upstream_timeout' | 'upstream_unavailable';
  message: string;
};
type CachedResult = { requestId: string } & (
  { snapshot: SignalsSnapshot } | { error: UpstreamFailure }
);

const pendingReads = new Map<string, { requestId: string; lookup: Promise<CachedResult> }>();

export async function readSignals(hours: number) {
  const slot = reuseSlot(Date.now());
  const key = ['signals-v1', STATION.id, PRODUCT, String(hours), String(slot.startMs)];
  const flightKey = key.join(':');
  const withDelivery = (result: CachedResult, source: SignalsDelivery['source']) => ({
    result,
    delivery: { source, nextCheckAt: slot.nextCheckAt } satisfies SignalsDelivery,
  });

  const pending = pendingReads.get(flightKey);
  if (pending) {
    const result = await pending.lookup;
    return withDelivery(result, result.requestId === pending.requestId ? 'in_flight' : 'cache');
  }

  const requestId = randomUUID();
  // The slot anchors the NOAA query even if lookup or retrieval crosses an hour.
  const load = unstable_cache(async (): Promise<CachedResult> => {
    try {
      return { requestId, snapshot: await fetchNoaa(observationWindow(hours, new Date(slot.startMs))) };
    } catch (error) {
      if (error instanceof SignalsError && error.code !== 'invalid_request') {
        return { requestId, error: { code: error.code, message: error.message } };
      }
      throw error;
    }
  }, key, { revalidate: REUSE_INTERVAL_MS / 1000 });

  const lookup = load();
  pendingReads.set(flightKey, { requestId, lookup });
  try {
    const result = await lookup;
    return withDelivery(result, result.requestId === requestId ? 'noaa' : 'cache');
  } finally {
    pendingReads.delete(flightKey);
  }
}
