export const DEPLOYMENT = { start: '2012-05-17', end: '2012-11-26' } as const;
export const SLOTS_PER_DAY = 96;

type Blank = { time: string; row: number };
export type Day = { date: string; slots: number; reported: number; blanks: Blank[] };
type Week = { year: number; week: number; temperaturePresent: boolean };

export function civilDate(value: unknown): string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Invalid civil date');
  // UTC midnight is an arithmetic surrogate. Workbook local times are never converted to UTC.
  const instant = new Date(value + 'T00:00:00Z');
  if (!Number.isFinite(instant.getTime()) || instant.toISOString().slice(0, 10) !== value) {
    throw new Error('Invalid civil date');
  }
  return value;
}

function isCount(value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= min && value <= max;
}

function isBlank(value: unknown): value is Blank {
  if (typeof value !== 'object' || value === null) return false;
  const { time, row } = value as Partial<Blank>;
  return typeof time === 'string' && /^(?:[01]\d|2[0-3]):(?:00|15|30|45)$/.test(time) && isCount(row, 8);
}

export function parseBullock(input: unknown): Day[] {
  if (!Array.isArray(input)) throw new Error('Expected a daily coverage array');
  const dates = new Set<string>();
  return input.map((value) => {
    if (typeof value !== 'object' || value === null) throw new Error('Invalid day record');
    const day = value as Partial<Day>;
    const date = civilDate(day.date);
    if (date < DEPLOYMENT.start || date > DEPLOYMENT.end || dates.has(date) ||
        day.slots !== SLOTS_PER_DAY || !isCount(day.reported, 0, day.slots) ||
        !Array.isArray(day.blanks) || !day.blanks.every(isBlank) || day.blanks.length !== day.slots - day.reported ||
        new Set(day.blanks.map(({ time }) => time)).size !== day.blanks.length ||
        new Set(day.blanks.map(({ row }) => row)).size !== day.blanks.length) {
      throw new Error('Invalid or duplicate daily grid');
    }
    dates.add(date);
    return { date, slots: day.slots, reported: day.reported, blanks: day.blanks };
  });
}

export function parseWeeks(input: unknown): Week[] {
  if (!Array.isArray(input)) throw new Error('Expected an archive week array');
  const keys = new Set<string>();
  return input.map((value) => {
    if (typeof value !== 'object' || value === null) throw new Error('Invalid archive week');
    const { year, week, temperaturePresent } = value as Partial<Week>;
    if (!isCount(year, 1959, 2019) || !isCount(week, 1, 52) || typeof temperaturePresent !== 'boolean') {
      throw new Error('Invalid archive week');
    }
    const key = year + '/' + week;
    if (keys.has(key)) throw new Error('Duplicate archive week');
    keys.add(key);
    return { year, week, temperaturePresent };
  });
}

export function classifyDay(date: string, day: Day | undefined, plan?: { start: string; end: string }) {
  if (!plan) return 'unknown';
  if (date < plan.start || date > plan.end) return day ? 'unknown' : 'outside_plan';
  if (date === plan.start || date === plan.end) return 'boundary';
  if (!day) return 'unknown';
  return day.blanks.length > 0 ? 'blank_grid_slots' : 'reported';
}

export function bullockCoverage(days: Day[]) {
  const rows = new Map(days.map((day) => [day.date, day]));
  const months = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1, expected: 0, reported: 0, unknownSlots: 0, outsideDays: 0, boundaryDays: 0,
    blanks: [] as (Blank & { date: string })[],
  }));

  for (const day = new Date('2012-01-01T00:00:00Z'); day.getUTCFullYear() === 2012; day.setUTCDate(day.getUTCDate() + 1)) {
    const date = day.toISOString().slice(0, 10);
    const row = rows.get(date);
    const month = months[day.getUTCMonth()];
    const state = classifyDay(date, row, DEPLOYMENT);
    if (state === 'outside_plan') month.outsideDays++;
    else if (state === 'boundary') month.boundaryDays++;
    else {
      month.expected += SLOTS_PER_DAY;
      if (state === 'unknown' || !row) {
        month.unknownSlots += SLOTS_PER_DAY;
      } else {
        month.reported += row.reported;
        month.blanks.push(...row.blanks.map((blank) => ({ ...blank, date })));
      }
    }
  }
  return months;
}

export function planktonCoverage(weeks: Week[], year: number) {
  const rows = weeks.filter((row) => row.year === year);
  return rows.length === 52 ? { year, published: rows.length, reported: rows.filter((row) => row.temperaturePresent).length }
    : { year, published: rows.length, reported: null };
}

type Sampling = Record<'station' | 'depth' | 'units' | 'device' | 'cadence' | 'timeSupport', string>;

export function samplingDifferences(first: Sampling, second: Sampling) {
  return (Object.keys(first) as (keyof Sampling)[]).filter((key) => first[key] !== second[key]);
}
