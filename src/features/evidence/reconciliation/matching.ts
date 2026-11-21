type TimedRecord = {
  date: string | null;
  clock: string | null;
};

type Alignment =
  | { kind: 'same_time_convention' }
  | { kind: 'scoped_clock_alignment'; offsetSeconds: number }
  | { kind: 'unverified' };

function clockSeconds(clock: string | null) {
  if (!clock || !/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(clock)) return null;
  const [hours, minutes, seconds] = clock.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

export function matchClock<T extends TimedRecord>(
  target: TimedRecord,
  candidates: readonly T[] | null,
  alignment: Alignment,
) {
  if (!candidates) return { status: 'unavailable' } as const;
  if (alignment.kind === 'unverified') return { status: 'ambiguous', reason: 'time_convention' } as const;

  const targetSeconds = clockSeconds(target.clock);
  if (!target.date || targetSeconds === null) {
    return { status: 'ambiguous', reason: 'target_time_missing' } as const;
  }

  const offsetSeconds = alignment.kind === 'scoped_clock_alignment' ? alignment.offsetSeconds : 0;
  const expected = targetSeconds + offsetSeconds;
  if (!Number.isInteger(expected) || expected < 0 || expected >= 86_400) {
    return { status: 'ambiguous', reason: 'scope_boundary' } as const;
  }

  const exact = candidates.filter((record) => record.date === target.date && clockSeconds(record.clock) === expected);
  if (exact.length > 1) return { status: 'ambiguous', reason: 'duplicate_time' } as const;
  // A record without a usable timestamp could belong to the same slot.
  if (candidates.some((record) => !record.date || (record.date === target.date && clockSeconds(record.clock) === null))) {
    return { status: 'ambiguous', reason: 'candidate_time_missing' } as const;
  }
  if (!exact.length) return { status: 'missing' } as const;
  return { status: 'matched', record: exact[0], offsetSeconds } as const;
}

export function comparisonOutcome(
  left: string | null,
  right: string | null,
  correspondence: 'verified' | 'ambiguous' | 'source_unavailable',
) {
  if (correspondence === 'source_unavailable') return 'unresolved_missing_records';
  if (correspondence === 'ambiguous') return 'not_comparable';
  if (left === null || right === null) return 'unresolved_missing_records';
  if (temperaturePresence(left) !== 'numeric' || temperaturePresence(right) !== 'numeric') return 'not_comparable';
  return Number(left) === Number(right) ? 'direct_record_match' : 'unresolved_source_conflict';
}

export function temperaturePresence(field: string) {
  if (field === 'nd') return 'missing';
  if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(field) && Number.isFinite(Number(field))) {
    return 'numeric';
  }
  return 'unrecognized';
}

export function summarizeWeeks(records: readonly { year: number; week: number; field: string }[]) {
  const years = new Map<number, { total: number; populated: number; missing: number }>();
  const seen = new Set<string>();
  for (const { year, week, field } of records) {
    const key = `${year}/${week}`;
    if (!Number.isInteger(week) || week < 1 || week > 53 || seen.has(key)) {
      throw new Error(`Duplicate or invalid archive week ${key}`);
    }
    seen.add(key);
    const totals = years.get(year) ?? { total: 0, populated: 0, missing: 0 };
    if (field === 'numeric') totals.populated++;
    else if (field === 'nd') totals.missing++;
    else throw new Error(`Unrecognized archive field at ${key}`);
    totals.total++;
    years.set(year, totals);
  }
  return years;
}
