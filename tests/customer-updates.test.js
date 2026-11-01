import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInsuranceEmail, emptyInsuranceRequest, insuranceErrors } from '../src/insurance.js';
import { copyDetailsText } from '../src/referrals.js';
import { DESTINATIONS, travelMessage, travelSmsUrl, TRAVEL_SMS_NUMBER } from '../src/travel.js';

const details = { name: 'Test & Family — O’Neil', phone: '+1 (317) 555-0100', email: 'test+review@example.com', street: '123 Test St. #4 & Annex', city: 'Indianapolis', state: 'IN', zip: '46204-1234' };

test('insurance request preserves every field, special characters and line breaks in one email', () => {
  const email = buildInsuranceEmail(details);
  const url = new URL(email.url);
  assert.equal(url.pathname, 'roger.reed@vivint.com');
  assert.equal(url.searchParams.get('subject'), `Insurance Savings Request — ${details.name}`);
  assert.equal(url.searchParams.get('body'), email.body);
  assert.equal(email.body, ['HOME INSURANCE SAVINGS REQUEST', '', `Customer Name: ${details.name}`, `Phone: ${details.phone}`, `Email: ${details.email}`, '', 'PROPERTY ADDRESS', `Street: ${details.street}`, `City: ${details.city}`, `State: ${details.state}`, `ZIP: ${details.zip}`, '', 'Request: Home insurance savings review.'].join('\r\n'));
  assert.ok(copyDetailsText(email).endsWith(email.body));
});

test('insurance validation handles required, whitespace, phone, email, state and ZIP fields', () => {
  assert.deepEqual(insuranceErrors(details), {});
  assert.equal(Object.keys(insuranceErrors(emptyInsuranceRequest())).length, 7);
  for (const field of Object.keys(details)) assert.ok(insuranceErrors({ ...details, [field]: '   ' })[field]);
  for (const phone of ['123', 'not a number']) assert.ok(insuranceErrors({ ...details, phone }).phone);
  for (const email of ['missing-at.example.com', 'test@', 'test@example', 'x y@example.com']) assert.ok(insuranceErrors({ ...details, email }).email);
  for (const zip of ['1234', 'ABCDE', '46204-12', '123456789']) assert.ok(insuranceErrors({ ...details, zip }).zip);
  assert.deepEqual(insuranceErrors({ ...details, zip: '46204' }), {});
  assert.ok(insuranceErrors({ ...details, state: 'unknown' }).state);
});

test('insurance email trims inputs and keeps subject on one line', () => {
  const email = buildInsuranceEmail({ ...details, name: ' Test\r\nCustomer ', city: ' Indianapolis ' });
  assert.equal(email.subject, 'Insurance Savings Request — Test Customer');
  assert.ok(email.body.includes('City: Indianapolis\r\n'));
});

test('all six travel messages include the correct destination, duration, contact placeholders, and phone', () => {
  assert.deepEqual(DESTINATIONS.map(({ name, days }) => [name, days]), [['Las Vegas',4], ['Cancún',6], ['Bali',8], ['Dubai',5], ['Phuket',8], ['Puerto Vallarta',6]]);
  assert.equal(new Set(DESTINATIONS.map(destination => destination.id)).size, 6);
  for (const destination of DESTINATIONS) {
    const url = new URL(travelSmsUrl(destination));
    assert.equal(url.pathname, TRAVEL_SMS_NUMBER);
    assert.equal(url.searchParams.get('body'), travelMessage(destination));
    assert.ok(travelMessage(destination).includes(`${destination.name}, ${destination.region} ${destination.days}-day`));
    assert.ok(travelMessage(destination).endsWith('My Name:\nMy Phone Number:\nMy Email:'));
    assert.ok(destination.source.startsWith('https://commons.wikimedia.org/'));
    assert.ok(destination.author && destination.license && destination.licenseUrl);
  }
});
