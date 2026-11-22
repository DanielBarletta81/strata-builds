export const LIGHT_SPEED_KM_S = 299_792.458;
export const HOURS_PER_DAY = 24;
export const SECONDS_PER_HOUR = 3600;
export const ROUND_TRIP_HOURS = 2 * HOURS_PER_DAY;
export const LIGHT_DAY_KM = LIGHT_SPEED_KM_S * (HOURS_PER_DAY * SECONDS_PER_HOUR);

export function lightHours(rangeKm: number) {
  return rangeKm / LIGHT_SPEED_KM_S / SECONDS_PER_HOUR;
}

export function signalAt(elapsedHours: number) {
  const hour = Math.min(ROUND_TRIP_HOURS, Math.max(0, elapsedHours));
  const fraction = hour <= HOURS_PER_DAY ? hour / HOURS_PER_DAY : (ROUND_TRIP_HOURS - hour) / HOURS_PER_DAY;
  return { hour, fraction, leg: hour <= HOURS_PER_DAY ? 'outbound' : 'returning' } as const;
}
