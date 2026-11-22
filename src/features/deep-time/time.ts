import { chronology, type GeologicalEvent } from './chronology.ts';

export const referenceYear = 2026;
const maxAge = 4_600_000_000;

export const scales = [
  { id: 'billions', label: 'Billions', span: maxAge },
  { id: 'hundreds', label: 'Hundreds of millions', span: 600_000_000 },
  { id: 'millions', label: 'Millions', span: 30_000_000 },
  { id: 'thousands', label: 'Thousands', span: 80_000 },
  { id: 'historical', label: 'Historical years', span: 200 },
] as const;

export type TimeWindow = { older: number; younger: number };
export type Selection = { id: string; anchorAge: number; level: number };

const openingEvent = chronology.find(({ id }) => id === 'liquid-water') ?? chronology[0];
export const initialSelection = selectEvent({ id: openingEvent.id, anchorAge: 0, level: 0 }, openingEvent);

export function ageRange({ when }: GeologicalEvent): TimeWindow | null {
  if (when.kind === 'unresolved') return null;
  if (when.kind === 'interval') return { older: when.older, younger: when.younger };
  const age = when.kind === 'approximate' ? when.years : referenceYear - Number(when.date.slice(0, 4));
  return { older: age, younger: age };
}

export function zoomLimit(age: number) {
  if (age <= scales[4].span) return 4;
  if (age <= scales[3].span) return 3;
  return 2;
}

export function setZoom(selection: Selection, level: number): Selection {
  return { ...selection, level: Math.max(0, Math.min(zoomLimit(selection.anchorAge), level)) };
}

export function selectEvent(selection: Selection, event: GeologicalEvent): Selection {
  const range = ageRange(event);
  if (!range) return { ...selection, id: event.id };
  const anchorAge = (range.older + range.younger) / 2;
  return { id: event.id, anchorAge, level: Math.min(selection.level, zoomLimit(anchorAge)) };
}

export function timeWindow(selection: Selection): TimeWindow {
  const window = { older: maxAge, younger: 0 };
  // Fit each successive window inside its parent, including near either edge.
  for (let level = 1; level <= selection.level; level++) {
    const span = scales[level].span;
    window.younger = Math.max(window.younger, Math.min(selection.anchorAge - span / 2, window.older - span));
    window.older = window.younger + span;
  }
  return window;
}

export function visibleEvents(window: TimeWindow) {
  return chronology.flatMap((event) => {
    const range = ageRange(event);
    if (!range || range.older < window.younger || range.younger > window.older) return [];
    return [{ event, range }];
  });
}

export function position(age: number, window: TimeWindow) {
  return (window.older - age) / (window.older - window.younger) * 100;
}

export function axisLabel(age: number, level: number) {
  if (level === 4) return `${referenceYear - age} CE`;
  if (age === 0) return 'Present';
  const [divisor, unit] = level === 3 ? [1_000, 'ka'] : level === 0 ? [1_000_000_000, 'Ga'] : [1_000_000, 'Ma'];
  return `${(age / divisor).toLocaleString('en-US', { maximumFractionDigits: 1 })} ${unit}`;
}
