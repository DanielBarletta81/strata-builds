import { appendFileSync, readFileSync } from 'node:fs';
import { performance } from 'node:perf_hooks';
import process from 'node:process';
import { setTimeout } from 'node:timers/promises';
import { URL } from 'node:url';
import captured from './providence-hourly.json' with { type: 'json' };
import ambiguous from './ambiguous-no-data.json' with { type: 'json' };
import invalidStation from './invalid-station.json' with { type: 'json' };

// This is loaded only by test child processes. Exact query dates are derived
// from the adapter request. Rebased/modified fixtures are test cases only.
const { fetch: originalFetch, Request, Response } = globalThis;
const clockFile = process.env.STRATA_TEST_NOAA_CLOCK;
const requestLog = process.env.STRATA_TEST_NOAA_REQUESTS;

if (clockFile) {
  const now = () => Number(readFileSync(clockFile, 'utf8'));
  Date.now = now;
  // Next measures Data Cache age against the performance clock.
  Object.defineProperty(performance, 'timeOrigin', { get: () => now() - performance.now() });
  globalThis.Date = new Proxy(Date, {
    construct(target, args, newTarget) {
      return Reflect.construct(target, args.length ? args : [now()], newTarget);
    },
  });
}

globalThis.fetch = async (input, options) => {
  const address = input instanceof Request ? input.url : String(input);
  if (!URL.canParse(address)) return originalFetch(input, options);
  const url = new URL(address);
  if (url.hostname !== 'api.tidesandcurrents.noaa.gov') return originalFetch(input, options);
  const [begin, end] = ['begin_date', 'end_date'].map((key) => {
    const [date, time] = url.searchParams.get(key).split(' ');
    return Date.parse(date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6) + 'T' + time + ':00Z');
  });
  const hours = Math.ceil((end - begin) / 3_600_000);
  if (requestLog) appendFileSync(requestLog, JSON.stringify({ hours, begin }) + '\n');
  if (hours === 3) await setTimeout(100);
  if (hours === 8 && requestLog) await setTimeout(10_000, undefined, { signal: options.signal });
  if (hours === 12) return Response.json(ambiguous);
  if (hours === 6) return Response.json(invalidStation, { status: 400 });
  const data = Array.from({ length: hours }, (_, index) => ({
    ...captured.data[index % captured.data.length],
    t: new Date(begin + index * 3_600_000).toISOString().slice(0, 16).replace('T', ' '),
  }));
  if (hours === 24) {
    data[4].v = '';
    data[7].f = '0,1,0';
    data.splice(14, 1);
  }
  return Response.json({ metadata: captured.metadata, data });
};
