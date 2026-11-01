import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { mkdir } from 'node:fs/promises';
import { DESTINATIONS, travelMessage, travelSmsUrl } from '../src/travel.js';
import { buildInsuranceEmail } from '../src/insurance.js';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
page.setDefaultTimeout(15000);
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const navigate = async hash => { await page.evaluate(hash => { location.hash = hash; }, hash); await page.waitForTimeout(200); };
await mkdir('test-results', { recursive: true });
try {
  await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Customer Travel Perks' }).waitFor();
  assert.equal(await page.locator('.destination-card').count(), 6);
  assert.equal(await page.locator('.home-resource-grid a[href="#insurance"]').count(), 1);
  assert.equal(await page.locator('.home-resource-grid a[href="#resources"]').count(), 1);
  // Suppress actual protocol launches while checking the app's event handlers and URL payloads.
  await page.evaluate(() => {
    window.protocolRequests = [];
    document.addEventListener('click', event => {
      const link = event.target.closest?.('a');
      if (link && /^(mailto|sms):/.test(link.href)) { event.preventDefault(); window.protocolRequests.push(link.href); }
    }, true);
  });
  for (let index = 0; index < DESTINATIONS.length; index++) {
    const card = page.locator('.destination-card').nth(index);
    const link = card.getByRole('link', { name: 'TEXT ROGER ABOUT THIS TRIP' });
    assert.equal(await link.getAttribute('href'), travelSmsUrl(DESTINATIONS[index]));
    await link.click();
    assert.ok((await card.getByRole('status').innerText()).includes('has not sent'));
    await card.getByRole('button', { name: 'Copy message' }).click();
    assert.equal((await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n'), `To: 463-281-3454\n\n${travelMessage(DESTINATIONS[index])}`);
  }
  console.log('PASS: six destination cards, SMS payloads, correct recipient, and real Clipboard API.');
  await navigate('refer');
  const rewards = page.getByRole('heading', { name: 'Earn $200 Toward Your Vivint Bill for Every Qualified Referral!' });
  await rewards.waitFor();
  assert.ok((await rewards.boundingBox()).y < (await page.locator('.referral-workspace form').boundingBox()).y);
  await page.getByLabel('Your full name', { exact: true }).fill('Referral Customer');
  await page.getByRole('button', { name: 'ADD ANOTHER FRIEND' }).click();
  assert.equal(await page.locator('.friend-card').count(), 2);
  await navigate('insurance');
  assert.equal(await page.locator('.mobile-referral-bar').count(), 0);
  const insurance = page.locator('.insurance-workspace');
  const submit = insurance.getByRole('button', { name: 'Open Email to Request Savings Review' });
  await submit.click();
  assert.equal((await page.evaluate(() => window.protocolRequests)).filter(url => url.startsWith('mailto:')).length, 0);
  const values = { name: 'Test & Family — O’Neil', phone: '3175550100', email: 'test+insurance@example.com', street: '123 Test St #4 & Annex', city: 'Indianapolis', state: 'IN', zip: '46204-1234' };
  for (const [name, value] of Object.entries(values)) {
    const input = insurance.locator(`[name="${name}"]`);
    if (name === 'state') await input.selectOption(value); else await input.fill(value);
  }
  for (const [name, invalid] of [['name', '   '], ['phone','123'], ['email','bad-email'], ['zip','1234']]) {
    await insurance.locator(`[name="${name}"]`).fill(invalid);
    await submit.click();
    assert.equal((await page.evaluate(() => window.protocolRequests)).filter(url => url.startsWith('mailto:')).length, 0);
    assert.ok(await insurance.locator(`[name="${name}"]`).evaluate(element => !element.validity.valid));
    await insurance.locator(`[name="${name}"]`).fill(values[name]);
  }
  assert.equal(await insurance.locator('[name="phone"]').getAttribute('type'), 'tel');
  assert.equal(await insurance.locator('[name="email"]').getAttribute('type'), 'email');
  assert.equal(await insurance.locator('[name="zip"]').getAttribute('inputmode'), 'numeric');
  await submit.click();
  const expected = buildInsuranceEmail(values);
  assert.equal((await page.evaluate(() => window.protocolRequests)).at(-1), expected.url);
  assert.ok((await insurance.getByRole('status').innerText()).includes('has not submitted'));
  await insurance.getByRole('button', { name: 'Copy Details', exact: true }).click();
  assert.ok((await page.evaluate(() => navigator.clipboard.readText())).endsWith(expected.body));
  await navigate('home'); await navigate('insurance');
  assert.equal(await insurance.locator('[name="street"]').inputValue(), values.street);
  console.log('PASS: insurance required/whitespace/email/phone/ZIP validation, email encoding, truthful status, clipboard, and navigation retention.');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const area of ['home','refer','resources','insurance']) {
      await navigate(area);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${area}: overflow at ${width}px`);
    }
  }
  await navigate('refer');
  assert.equal(await page.getByLabel('Your full name', { exact: true }).inputValue(), 'Referral Customer');
  assert.equal(await page.locator('.friend-card').count(), 2);
  await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }); document.execCommand = () => false; });
  await navigate('insurance');
  await insurance.getByRole('button', { name: 'Copy Details', exact: true }).click();
  await insurance.getByLabel('Complete insurance request email').waitFor({ state: 'visible' });
  assert.ok((await insurance.getByLabel('Complete insurance request email').inputValue()).includes('123 Test St #4 & Annex'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'test-results/insurance-mobile.png', fullPage: true });
  await navigate('home');
  await page.locator('.destination-card').first().getByRole('button', { name: 'Copy message' }).click();
  await page.getByLabel('Las Vegas message to copy').waitFor({ state: 'visible' });
  if (process.env.CHECK_MEDIA === '1') {
    for (const img of await page.locator('.destination-photo img').all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(element => element.decode()); }
    console.log('PASS: all six destination photographs decoded.');
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'test-results/customer-updates-mobile.png', fullPage: true });
  await navigate('resources');
  await page.getByRole('heading', { name: 'How It Works', exact: true }).waitFor();
  const iframe = page.locator('.tutorial-player iframe');
  assert.ok((await iframe.getAttribute('src')).includes('/embed/587199/eaa2d055-1343-4c49-bb9d-3ee2852d574c?autoplay=false'));
  assert.equal(await page.getByRole('link', { name: 'Open Video', exact: true }).getAttribute('href'), 'https://player.mediadelivery.net/play/587199/eaa2d055-1343-4c49-bb9d-3ee2852d574c');
  if (process.env.CHECK_MEDIA === '1') {
    await iframe.scrollIntoViewIfNeeded();
    const video = page.frameLocator('.tutorial-player iframe').locator('video').first();
    await video.waitFor({ state: 'attached', timeout: 30000 });
    assert.equal(await video.evaluate(element => element.paused), true, 'tutorial must not autoplay');
    await video.evaluate(async element => { element.muted = true; await element.play(); });
    await page.waitForTimeout(2500);
    assert.ok(await video.evaluate(element => element.currentTime > 0 && !element.paused), 'tutorial playback must advance');
    await video.evaluate(element => element.pause());
    console.log('PASS: original panel tutorial loads, starts paused, and advances during muted playback.');
  }
  assert.deepEqual(errors, []);
  console.log('PASS: rewards position, referral preservation, How It Works, manual copy fallbacks, and responsive layouts. No external message was sent.');
} finally { await browser.close(); }
