import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEmail, CONTACT_METHODS, contactScript, copyDetailsText, createReferral, phoneIsValid, REFERRAL_EMAIL, removeReferral, updateReferral } from '../src/referrals.js';

const customer = { name: 'Test & Family — O’Neil', service: 'TEST-001/AB' };
const friend = () => ({ ...createReferral(), name: 'Test Friend & Co.', phone: '(317) 555-0100', city: 'Fort Wayne', state: 'IN' });

for (const count of [1, 3, 10, 100]) {
  test(`${count} referrals retain every field in a single correctly encoded email`, () => {
    const entries = Array.from({ length: count }, (_, i) => ({ ...friend(), name: `Friend ${i + 1} — A&B + # / é`, method: CONTACT_METHODS[i % 4] }));
    const email = buildEmail(customer, entries);
    const url = new URL(email.url);
    assert.equal(url.pathname, REFERRAL_EMAIL);
    assert.equal(url.searchParams.get('subject'), email.subject);
    assert.equal(url.searchParams.get('body'), email.body);
    assert.match(email.subject, new RegExp(`${count} Friends$`));
    assert.ok(email.body.includes(`Name: ${customer.name}`));
    assert.ok(email.body.includes(`Vivint Service Number: ${customer.service}`));
    assert.equal((email.body.match(/REFERRAL #/g) || []).length, count);
    for (const entry of entries) for (const value of [entry.name, entry.phone, entry.city, entry.state, entry.method]) assert.ok(email.body.includes(value));
    assert.ok(email.body.includes('\r\n\r\n'));
  });
}

test('adding and updating referrals preserves customer data and independent selections', () => {
  let entries = [friend()];
  const first = entries[0];
  entries = [...entries, createReferral(), createReferral()];
  assert.equal(new Set(entries.map(entry => entry.id)).size, 3);
  entries = updateReferral(entries, entries[1].id, 'method', 'Phone Call');
  assert.deepEqual(entries[0], first);
  assert.equal(entries[2].method, CONTACT_METHODS[0]);
  assert.equal(customer.service, 'TEST-001/AB');
});

test('removal preserves other entries and renumbers email output', () => {
  const entries = [friend(), friend(), friend()];
  const remaining = removeReferral(entries, entries[1].id);
  assert.deepEqual(remaining, [entries[0], entries[2]]);
  const email = buildEmail(customer, remaining);
  assert.ok(email.body.includes('REFERRAL #2'));
  assert.ok(!email.body.includes('REFERRAL #3'));
  assert.equal(removeReferral([entries[0]], entries[0].id).length, 1);
  assert.equal(removeReferral([entries[0]], entries[0].id)[0].name, '');
});

test('each contact script uses the selected method and entered names', () => {
  const scripts = CONTACT_METHODS.map(method => contactScript(customer, { ...friend(), method }));
  assert.equal(new Set(scripts).size, 4);
  for (const script of scripts) { assert.ok(script.includes(customer.name)); assert.ok(script.includes('Test Friend & Co.')); }
});

test('phone validation rejects malformed numbers and accepts normal US formats', () => {
  for (const phone of ['3175550100', '(317) 555-0100', '+1 317-555-0100']) assert.ok(phoneIsValid(phone));
  for (const phone of ['', '123', 'abcdefghij', '317555010000000', '23175550100']) assert.ok(!phoneIsValid(phone));
});

test('copy text includes destination, subject and complete multiline body', () => {
  const email = buildEmail(customer, [friend()]);
  const text = copyDetailsText(email);
  assert.ok(text.startsWith(`To: ${REFERRAL_EMAIL}`));
  assert.ok(text.includes(email.subject));
  assert.ok(text.endsWith(email.body));
});

test('subject does not allow injected header line breaks', () => {
  assert.ok(!buildEmail({ ...customer, name: 'Test\r\nCc: injected' }, [friend()]).subject.includes('\n'));
});
