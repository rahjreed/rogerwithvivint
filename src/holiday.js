// Black Friday 2026 begins at midnight Eastern Standard Time in Indiana.
export const HOLIDAY_DEADLINE = Date.parse('2026-11-27T00:00:00-05:00');
export const HOLIDAY_TITLE = 'Holiday Special | Roger Reed — Vivint Smart Home Expert';
export const HOLIDAY_SMS_MESSAGE = "Hey Roger! I saw your holiday special at RogerWithVivint.com/holiday. I'd like to find out what home security options I qualify for.";
export const HOLIDAY_SMS_URL = `sms:14632813454?body=${encodeURIComponent(HOLIDAY_SMS_MESSAGE)}`;

export function isHolidayPath(pathname) {
  return /^\\/holiday(?:\\.html|\\/(?:index\\.html)?)?$/.test(pathname);
}

export function getHolidayCountdown(now = Date.now()) {
  const remaining = Math.max(0, HOLIDAY_DEADLINE - now);
  const total = Math.floor(remaining / 1000);
  return {
    expired: remaining === 0,
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}
