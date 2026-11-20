import type { NextRequest } from 'next/server';
import { parseSignalsParams, SignalsError } from '@/features/signals/noaa';
import { readSignals } from '@/features/signals/snapshot-cache';

const headers = { 'Cache-Control': 'no-store' };

export async function GET(request: NextRequest) {
  try {
    const { result, delivery } = await readSignals(parseSignalsParams(request.nextUrl.searchParams));
    if ('snapshot' in result) return Response.json({ ...result.snapshot, delivery }, { headers });

    const status = result.error.code === 'upstream_timeout' ? 504 : 502;
    const retryAfter = Math.max(0, Math.ceil((Date.parse(delivery.nextCheckAt) - Date.now()) / 1000));
    return Response.json({ error: result.error, delivery }, {
      status, headers: { ...headers, 'Retry-After': String(retryAfter) },
    });
  } catch (error) {
    if (error instanceof SignalsError && error.code === 'invalid_request') {
      return Response.json({ error: { code: error.code, message: error.message } }, { status: 400, headers });
    }
    console.error('Signals cache lookup failed', error instanceof Error ? error.name : 'UnknownError');
    return Response.json({
      error: { code: 'service_unavailable', message: 'The observation service is temporarily unavailable.' },
    }, { status: 503, headers });
  }
}
