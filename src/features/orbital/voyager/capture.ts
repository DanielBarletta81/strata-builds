import earth from './data/earth.json' with { type: 'json' };
import sun from './data/sun.json' with { type: 'json' };
import receipts from './data/receipt.json' with { type: 'json' };
import { voyagerEvents } from './events.ts';
import { LIGHT_SPEED_KM_S } from './light.ts';
import { KM_PER_AU } from '../ephemeris.ts';

export const trajectorySolution = 'Voyager_1_ST+refit2022_m';
export const trajectorySources = receipts;
export type Origin = keyof typeof receipts;
type Vector = [number, number, number];

type HorizonsPayload = {
  signature?: { source?: string; version?: string };
  result?: string;
  error?: string;
};

type OriginSample = {
  jdTdb: number;
  date: string;
  clock: string;
  positionKm: Vector;
  rangeKm: number;
  lightSeconds: number;
};

export type VoyagerSample = {
  date: string;
  clockTdb: string;
  jdTdb: number;
  earthRangeKm: number;
  earthLightSeconds: number;
  sunRangeKm: number;
  sunPositionKm: Vector;
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const columns = /^\s*JDTDB,\s+Calendar Date \(TDB\),\s+X,\s+Y,\s+Z,\s+VX,\s+VY,\s+VZ,\s+LT,\s+RG,\s+RR,$/m;
const sourceNumber = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:E[+-]?\d+)?$/i;

export function parseVoyagerVectors(payload: HorizonsPayload, origin: Origin): OriginSample[] {
  const receipt = receipts[origin];
  if (payload.error || payload.signature?.source !== receipt.signature.source || payload.signature?.version !== receipt.signature.version) {
    throw new Error('Unexpected Voyager Horizons response signature');
  }
  const center = origin === 'earth' ? /^Center body name:\s+Earth \(399\)\s+\{source:/m : /^Center body name:\s+Sun \(10\)\s+\{source:/m;
  const text = payload.result ?? '';
  const table = /^([\s\S]*?)^\$\$SOE[ \t]*\r?\n([\s\S]*?)^\$\$EOE[ \t]*$/m.exec(text);
  const header = table?.[1] ?? '';
  const target = /^Target body name:\s+Voyager 1 \(spacecraft\) \(-31\)\s+\{source: (.+)\}$/m.exec(header)?.[1];
  if (!table || (text.match(/^\$\$(?:SOE|EOE)[ \t]*$/gm) ?? []).length !== 2 ||
      target !== trajectorySolution || !center.test(header) || !/^Center-site name: BODY CENTER$/m.test(header) ||
      !/^Output units\s*: KM-S$/m.test(header) || !/^Output type\s*: GEOMETRIC cartesian states$/m.test(header) ||
      !/^Reference frame\s*: ICRF$/m.test(header) || !columns.test(header)) {
    throw new Error('Unexpected Voyager center, frame, units or time scale');
  }

  const samples = table[2].trim().split(/\r?\n/).map((line) => {
    const [jd, timestamp, ...fields] = line.split(',').map((field) => field.trim());
    const calendar = /^A\.D\. (\d{4})-([A-Z][a-z]{2})-(\d{2}) (\d{2}:\d{2}:\d{2})\.0+$/.exec(timestamp);
    if (!calendar || !sourceNumber.test(jd) || fields.length !== 10 || fields[fields.length - 1] !== '' ||
        !fields.slice(0, -1).every((field) => sourceNumber.test(field) && Number.isFinite(Number(field)))) {
      throw new Error('Invalid Voyager vector row');
    }
    const [, year, abbreviation, day, clock] = calendar;
    const month = monthNames.indexOf(abbreviation) + 1;
    const date = `${year}-${String(month).padStart(2, '0')}-${day}`;
    // Treat the calendar fields as arithmetic only. This does not convert TDB to UTC.
    const arithmeticDate = new Date(date + 'T' + clock + 'Z');
    const jdTdb = Number(jd);
    const [x, y, z, , , , lightSeconds, rangeKm] = fields.slice(0, -1).map(Number);
    if (!Number.isFinite(arithmeticDate.getTime()) || arithmeticDate.toISOString().slice(0, 10) !== date ||
        Math.abs(arithmeticDate.getTime() / 86_400_000 + 2_440_587.5 - jdTdb) > 1e-8 ||
        rangeKm <= 0 || lightSeconds <= 0 || Math.abs(Math.hypot(x, y, z) - rangeKm) > 0.00005 ||
        Math.abs(rangeKm / LIGHT_SPEED_KM_S - lightSeconds) > 0.000001) {
      throw new Error('Voyager row fails date, range or light time checks');
    }
    return { jdTdb, date, clock, positionKm: [x, y, z] as Vector, rangeKm, lightSeconds };
  });
  const expected = voyagerEvents.map(({ date }, index) => date + (index === 0 ? ' 18:00:00' : ' 12:00:00'));
  if (samples.length !== expected.length || samples.some(({ date, clock }, index) => `${date} ${clock}` !== expected[index])) {
    throw new Error('Voyager capture does not match the requested discrete epochs');
  }
  return samples;
}

export function loadVoyager() {
  const earthStates = parseVoyagerVectors(earth, 'earth');
  const sunStates = parseVoyagerVectors(sun, 'sun');
  return earthStates.map((geocentric, index): VoyagerSample => {
    const heliocentric = sunStates[index];
    const centerSeparationAu = Math.hypot(...geocentric.positionKm.map((component, axis) =>
      heliocentric.positionKm[axis] - component)) / KM_PER_AU;
    if (geocentric.jdTdb !== heliocentric.jdTdb || centerSeparationAu < 0.98 || centerSeparationAu > 1.02) {
      throw new Error('Voyager origin samples disagree');
    }
    return {
      date: geocentric.date, clockTdb: geocentric.clock, jdTdb: geocentric.jdTdb,
      earthRangeKm: geocentric.rangeKm, earthLightSeconds: geocentric.lightSeconds,
      sunRangeKm: heliocentric.rangeKm, sunPositionKm: heliocentric.positionKm,
    };
  });
}
