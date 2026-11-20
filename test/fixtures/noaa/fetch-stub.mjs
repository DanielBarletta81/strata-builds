import { URL } from 'node:url';
import captured from './providence-hourly.json' with { type: 'json' };
import ambiguous from './ambiguous-no-data.json' with { type: 'json' };
import invalidStation from './invalid-station.json' with { type: 'json' };

// This is loaded only by test child processes. Exact query dates are derived
// from the adapter request. Rebased/modified fixtures are test cases only.
const { fetch: originalFetch, Request, Response } = globalThis;
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
