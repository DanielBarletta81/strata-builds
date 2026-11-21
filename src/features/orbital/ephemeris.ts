export const KM_PER_AU = 149_597_870.7;
export const SAMPLE_STEP_DAYS = 7;

type Vector = [number, number, number];

export type StateSample = {
  jdTdb: number;
  dateTdb: string;
  positionKm: Vector;
  velocityKmS: Vector;
  rangeKm: number;
  rangeRateKmS: number;
};

type HorizonsPayload = {
  signature?: { source?: string; version?: string };
  result?: string;
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const sourceNumber = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:E[+-]?\d+)?$/i;

function requiredMatch(text: string, pattern: RegExp, field: string) {
  const value = pattern.exec(text)?.[1];
  if (value === undefined) throw new Error('Missing Horizons ' + field);
  return value;
}

function numberFromSource(text: string) {
  const value = Number(text);
  if (!sourceNumber.test(text) || !Number.isFinite(value)) {
    throw new Error('Invalid Horizons numeric field');
  }
  return value;
}

// Gregorian calendar arithmetic only. The caller supplies a midnight on
// Horizons' TDB scale. This calculation does not convert from UTC.
function gregorianMidnightJd(year: number, month: number, day: number) {
  const leapDay = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthLengths = [31, leapDay ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day < 1 || day > monthLengths[month - 1]) throw new Error('Invalid Horizons calendar date');
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045.5;
}

function readSample(line: string): StateSample {
  const fields = line.split(',').map((field) => field.trim());
  const [jd, date, x, y, z, vx, vy, vz, lightTime, range, rangeRate, trailingComma] = fields;
  if (fields.length !== 12 || trailingComma !== '') throw new Error('Unexpected Horizons vector columns');
  const parts = /^A\.D\. (\d{4})-([A-Z][a-z]{2})-(\d{2}) 00:00:00\.0+$/.exec(date);
  if (!parts) throw new Error('Expected a Horizons TDB midnight');
  const [, year, abbreviation, day] = parts;
  const month = months.indexOf(abbreviation) + 1;
  const jdTdb = numberFromSource(jd);
  if (!month || jdTdb !== gregorianMidnightJd(Number(year), month, Number(day))) {
    throw new Error('Horizons TDB calendar and Julian date disagree');
  }
  const rangeKm = numberFromSource(range);
  if (numberFromSource(lightTime) <= 0 || rangeKm <= 0) {
    throw new Error('Invalid Horizons range or light time');
  }
  return {
    jdTdb,
    dateTdb: [year, String(month).padStart(2, '0'), day].join('-'),
    positionKm: [numberFromSource(x), numberFromSource(y), numberFromSource(z)],
    velocityKmS: [numberFromSource(vx), numberFromSource(vy), numberFromSource(vz)],
    rangeKm,
    rangeRateKmS: numberFromSource(rangeRate),
  };
}

export function parseCeresHorizons(payload: HorizonsPayload) {
  if (payload.signature?.source !== 'NASA/JPL Horizons API' || payload.signature.version !== '1.2') {
    throw new Error('Unsupported Horizons capture signature');
  }

  const result = payload.result ?? '';
  const table = /^([\s\S]*?)^\$\$SOE[ \t]*\r?\n([\s\S]*?)^\$\$EOE[ \t]*$/m.exec(result);
  if (!table || (result.match(/^\$\$(?:SOE|EOE)[ \t]*$/gm) ?? []).length !== 2) {
    throw new Error('Expected one complete Horizons vector table');
  }
  const [, header, data] = table;
  const requiredHeader = [
    /^Center body name:\s+Sun \(10\)\s+\{source: DE441\}$/m,
    /^Center-site name: BODY CENTER$/m,
    /^Start time\s*: A\.D\. 2024-Jan-01 00:00:00\.0+ TDB$/m,
    /^Stop\s+time\s*: A\.D\. 2029-Jan-01 00:00:00\.0+ TDB$/m,
    /^Step-size\s*: 10080 minutes$/m,
    /^Output units\s*: KM-S$/m,
    /^Output type\s*: GEOMETRIC cartesian states$/m,
    /^Output format\s*: 3 \(position, velocity, LT, range, range-rate\)$/m,
    /^Reference frame : Ecliptic of J2000\.0$/m,
    /^\s*JDTDB,\s+Calendar Date \(TDB\),\s+X,\s+Y,\s+Z,\s+VX,\s+VY,\s+VZ,\s+LT,\s+RG,\s+RR,$/m,
  ];
  if (!requiredHeader.every((field) => field.test(header))) {
    throw new Error('Horizons capture frame, time scale, units, or table shape changed');
  }

  const samples = data.trim().split('\n').map(readSample);
  if (samples.length !== 262 || samples[0].dateTdb !== '2024-01-01' ||
      samples[samples.length - 1].dateTdb !== '2029-01-01' ||
      samples.some((sample, index) => index > 0 && sample.jdTdb - samples[index - 1].jdTdb !== SAMPLE_STEP_DAYS)) {
    throw new Error('Horizons capture did not contain the complete seven-day grid');
  }
  return {
    solutionId: requiredMatch(header, /^Target body name:\s+1 Ceres \(A801 AA\)\s+\{source: JPL#(\d+)\}$/m, 'target or solution'),
    epochJdTdb: numberFromSource(requiredMatch(header, /^\s*EPOCH=\s+([0-9.]+)\s+! .* \(TDB\)/m, 'solution epoch')),
    perturbers: requiredMatch(header, /^Small perturbers: Yes\s+\{source: ([A-Z0-9-]+)\}$/m, 'perturber reference'),
    residualRms: requiredMatch(header, /Residual RMS=\s+([.0-9]+)/, 'residual RMS'),
    samples,
  };
}

export function sampleMetrics(sample: StateSample) {
  const distanceKm = Math.hypot(...sample.positionKm);
  const speedKmS = Math.hypot(...sample.velocityKmS);
  const radialKmS = sample.positionKm.reduce((dot, component, index) =>
    dot + component * sample.velocityKmS[index], 0) / distanceKm;
  return {
    distanceKm,
    distanceAu: distanceKm / KM_PER_AU,
    speedKmS,
    radialKmS,
  };
}

export function closestSampleIndex(samples: StateSample[], jdTdb: number) {
  return samples.reduce((closest, sample, index) =>
    Math.abs(sample.jdTdb - jdTdb) < Math.abs(samples[closest].jdTdb - jdTdb) ? index : closest, 0);
}
