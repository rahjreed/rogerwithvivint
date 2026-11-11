import test from 'node:test';
import assert from 'node:assert/strict';
import { isHolidayPath, HOLIDAY_DEADLINE, HOLIDAY_SMS_URL, getHolidayCountdown } from '../src/holiday.js';
import { isTruckPath } from '../src/truck.js';

test('holiday page has an independent direct route', () => {
  for (const path of ['/holiday', '/holiday/', '/holiday/index.html', '/holiday.html']) {
    assert.equal(isHolidayPath(path), true);
    assert.equal(isTruckPath(path), false);
  }
  for (const path of ['/', '/truck', '/holiday-special', '/holiday/other']) {
    assert.equal(isHolidayPath(path), false);
  }
});
test('holiday deadline is midnight EST on Black Friday 2026', () => {
  assert.equal(new Date(HOLIDAY_DEADLINE).toISOString(), '2026-11-27T05:00:00.000Z');
  const before = getHolidayCountdown(HOLIDAY_DEADLINE - 1000);
  assert.deepEqual([before.expired, before.days, before.hours, before.minutes, before.seconds], [false, 0, 0, 0, 1]);
  assert.equal(getHolidayCountdown(HOLIDAY_DEADLINE).expired, true);
  assert.equal(getHolidayCountdown(HOLIDAY_DEADLINE + 60000).expired, true);
});
test('holiday CTA identifies the campaign, not a truck QR scan', () => {
  const url = new URL(HOLIDAY_SMS_URL);
  assert.equal(url.protocol, 'sms:');
  assert.equal(url.pathname, '14632813454');
  assert.match(url.searchParams.get('body'), /holiday special/i);
  assert.doesNotMatch(url.searchParams.get('body'), /scanned.*truck/i);
});
