const utcClock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const temperature = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 1,
  useGrouping: false,
});

export function formatUtc(iso: string) {
  return utcClock.format(new Date(iso)) + ' UTC';
}

export function formatFullUtc(iso: string) {
  return iso.replace('T', ' ').replace(/\.\d+Z$/, ' UTC');
}

export function formatTemperature(value: number) {
  return Math.abs(value) >= 10_000 ? value.toExponential(1) : temperature.format(value);
}

export function formatRaw(raw: unknown) {
  if (raw === null) return 'Missing';
  if (typeof raw === 'string') return raw.trim() === '' ? JSON.stringify(raw) : raw;
  if (typeof raw === 'number') return String(raw);
  return JSON.stringify(raw) ?? 'Missing';
}
