import type { NextRequest } from 'next/server';
import { fetchNoaa, parseSignalsParams, SignalsError } from '@/features/signals/noaa';

const headers = { 'Cache-Control': 'no-store' };

export async function GET(request: NextRequest) {
  try {
    const snapshot = await fetchNoaa(parseSignalsParams(request.nextUrl.searchParams));
    return Response.json(snapshot, { headers });
  } catch (error) {
    const code = error instanceof SignalsError ? error.code : 'upstream_unavailable';
    const status = code === 'invalid_request' ? 400 : code === 'upstream_timeout' ? 504 : 502;
    const message = error instanceof SignalsError ? error.message : 'Observations are temporarily unavailable.';
    return Response.json({ error: { code, message } }, { status, headers });
  }
}
