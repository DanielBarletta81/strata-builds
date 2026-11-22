import { earthEvents, voyagerEvents, type EarthEvent, type EarthLens } from './events.ts';

const msPerDay = 86_400_000;
const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' });

export const timelineDates = [...new Set([...voyagerEvents, ...earthEvents].map(({ date }) => date))].sort();

export function formatDate(date: string) {
  return dateFormat.format(new Date(date + 'T00:00:00Z'));
}

export function daysBetween(from: string, to: string) {
  return (Date.parse(to) - Date.parse(from)) / msPerDay;
}

export function timeFraction(date: string) {
  const first = timelineDates[0];
  return daysBetween(first, date) / daysBetween(first, timelineDates[timelineDates.length - 1]);
}

export function eventsForLens(lens: EarthLens) {
  return lens === 'All events' ? earthEvents : earthEvents.filter(({ category }) => category === lens);
}

function intervalOffset(date: string, event: EarthEvent) {
  if (date < event.date) return daysBetween(date, event.date);
  if (date > (event.through ?? event.date)) return daysBetween(date, event.through ?? event.date);
  return 0;
}

export function compareDate(date: string, lens: EarthLens) {
  const mission = voyagerEvents.find((event) => event.date === date);
  let nearest: { event: EarthEvent; offset: number } | undefined;
  for (const event of eventsForLens(lens)) {
    const offset = intervalOffset(date, event);
    if (!nearest || Math.abs(offset) < Math.abs(nearest.offset)) nearest = { event, offset };
  }
  return { mission, earth: nearest };
}

export function stepDate(current: string, step: number) {
  const index = timelineDates.indexOf(current);
  return timelineDates[Math.max(0, Math.min(timelineDates.length - 1, index + step))];
}

export function earthDateLabel(event: EarthEvent) {
  return event.through ? `${formatDate(event.date)} – ${formatDate(event.through)}` : formatDate(event.date);
}
