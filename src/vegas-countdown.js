// Browser-only promotional interest countdown. Not proof of identity or eligibility.
export const VEGAS_WINDOW_MS = 90 * 24 * 60 * 60 * 1000;
export const VEGAS_STORAGE_KEY = 'roger-vegas-window-start-v1';
export function readVegasStart(storage, now = Date.now()) {
  const raw = storage?.getItem(VEGAS_STORAGE_KEY);
  const stored = raw == null ? NaN : Number(raw);
  if (Number.isFinite(stored) && stored > 0 && stored <= now) return stored;
  storage?.setItem(VEGAS_STORAGE_KEY, String(now));
  return now;
}
export function vegasTimeLeft(start, now = Date.now()) {
  const remaining = Math.max(0, start + VEGAS_WINDOW_MS - now);
  const totalSeconds = Math.ceil(remaining / 1000);
  return { expired: remaining <= 0, days: Math.floor(totalSeconds / 86400), hours: Math.floor((totalSeconds % 86400) / 3600), minutes: Math.floor((totalSeconds % 3600) / 60), seconds: totalSeconds % 60 };
}
