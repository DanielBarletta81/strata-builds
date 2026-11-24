import type { Observation } from './observations';

export function normalizeObservationSelection(observations: Observation[], selectedObservationAt: string | null) {
  if (!selectedObservationAt) return null;
  return observations.some(({ observedAt }) => observedAt === selectedObservationAt) ? selectedObservationAt : null;
}

export function toggleObservationSelection(selectedObservationAt: string | null, observedAt: string) {
  return selectedObservationAt === observedAt ? null : observedAt;
}

export function moveObservationSelection(
  observations: Observation[],
  selectedObservationAt: string | null,
  direction: 'next' | 'previous',
) {
  if (!observations.length) return null;
  const selectedIndex = observations.findIndex(({ observedAt }) => observedAt === selectedObservationAt);
  if (direction === 'next') {
    return observations[(selectedIndex + 1 + observations.length) % observations.length].observedAt;
  }
  if (selectedIndex <= 0) return observations[observations.length - 1].observedAt;
  return observations[selectedIndex - 1].observedAt;
}
