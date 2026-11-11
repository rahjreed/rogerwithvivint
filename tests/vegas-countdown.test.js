import test from 'node:test';
import assert from 'node:assert/strict';
import { VEGAS_WINDOW_MS, VEGAS_STORAGE_KEY, readVegasStart, vegasTimeLeft } from '../src/vegas-countdown.js';

function fakeStorage() {
  const values = new Map();
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, value); },
  };
}

test('first view saves a single fixed 90-day start timestamp', () => {
  const storage = fakeStorage(), first = 1794500000000;
  assert.equal(readVegasStart(storage, first), first);
  assert.equal(storage.getItem(VEGAS_STORAGE_KEY), String(first));
  assert.equal(readVegasStart(storage, first + 86400000), first);
});
test('countdown decreases across return visits and never resets after expiry', () => {
  const storage = fakeStorage(), first = 1794500000000;
  const started = readVegasStart(storage, first);
  assert.equal(vegasTimeLeft(started, first).days, 90);
  assert.equal(vegasTimeLeft(started, first + 86400000).days, 89);
  assert.equal(vegasTimeLeft(started, first + VEGAS_WINDOW_MS).expired, true);
  assert.equal(vegasTimeLeft(readVegasStart(storage, first + VEGAS_WINDOW_MS + 1000), first + VEGAS_WINDOW_MS + 1000).expired, true);
});
test('invalid timestamps create fresh local start rather than displaying broken countdown', () => {
  const storage = fakeStorage();
  storage.setItem(VEGAS_STORAGE_KEY, 'invalid');
  assert.equal(readVegasStart(storage, 1794500000000), 1794500000000);
});
