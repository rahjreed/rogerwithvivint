import test from 'node:test';
import assert from 'node:assert/strict';
import { isTruckPath, TRUCK_SMS_MESSAGE, TRUCK_SMS_URL } from '../src/truck.js';

test('truck path selection supports direct, directory and explicit index visits without matching the hub', () => {
  for (const path of ['/truck', '/truck/', '/truck/index.html', '/truck.html']) assert.equal(isTruckPath(path), true);
  for (const path of ['/', '/truck-options', '/trucks', '/truck/other', '/index.html']) assert.equal(isTruckPath(path), false);
});

test('truck text link preserves the requested QR starter message and recipient', () => {
  const url = new URL(TRUCK_SMS_URL);
  assert.equal(url.protocol, 'sms:');
  assert.equal(url.pathname, '14632813454');
  assert.equal(url.searchParams.get('body'), "Hey Roger! I scanned the QR code on your Vivint truck. I'd like to learn about the special options available when working directly with you.");
  assert.equal(url.searchParams.get('body'), TRUCK_SMS_MESSAGE);
});
