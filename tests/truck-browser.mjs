import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { mkdir, readFile } from 'node:fs/promises';
import { TRUCK_SMS_MESSAGE, TRUCK_SMS_URL, TRUCK_TITLE } from '../src/truck.js';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const base = process.env.TEST_BASE_URL || 'http://localhost:5173';
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
page.setDefaultTimeout(15000);
const errors = [];
const assertTruckSms = value => {
  const url = new URL(value);
  assert.equal(url.protocol, 'sms:');
  assert.equal(url.pathname, '14632813454');
  assert.equal(url.searchParams.get('body'), TRUCK_SMS_MESSAGE);
};
page.on('pageerror', error => errors.push(error.message));
await mkdir('test-results', { recursive: true });
try {
  // A real built directory entry must carry truck metadata without JavaScript or a hosting rewrite.
  const html = await readFile(new URL('../dist/truck/index.html', import.meta.url), 'utf8');
  assert.ok(html.includes(`<title>${TRUCK_TITLE}</title>`));
  assert.ok(html.includes('https://rogerwithvivint.com/truck'));
  assert.ok(!html.includes('/src/main.jsx'));
  for (const path of ['/truck', '/truck/', '/truck/index.html', '/truck.html']) {
    const response = await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
    assert.equal(response.status(), 200);
    assert.ok((await response.text()).includes(`<title>${TRUCK_TITLE}</title>`), `${path} must serve truck HTML`);
    await page.getByRole('heading', { name: 'You Found My Truck. Now Discover Why That’s a Good Thing.' }).waitFor();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'You Found My Truck. Now Discover Why That’s a Good Thing.' }).waitFor();
    assert.equal(await page.title(), TRUCK_TITLE);
  }
  assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).includes('Scanned Roger'));
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://rogerwithvivint.com/truck');
  await page.evaluate(() => {
    window.protocolRequests = [];
    document.addEventListener('click', event => {
      const link = event.target.closest?.('a');
      if (link && /^(sms|tel):/.test(link.href)) { event.preventDefault(); window.protocolRequests.push(link.href); }
    }, true);
  });
  const hero = page.locator('.truck-hero-actions').getByRole('link', { name: 'UNLOCK MY OPTIONS — TEXT ROGER' });
  assert.equal(await hero.getAttribute('href'), TRUCK_SMS_URL);
  const bounds = await hero.boundingBox();
  assert.ok(bounds.y + bounds.height < 844, 'primary hero CTA must be visible on a typical phone without scrolling');
  await hero.click();
  assertTruckSms((await page.evaluate(() => window.protocolRequests)).at(-1));
  await page.locator('.truck-call').click();
  assert.equal((await page.evaluate(() => window.protocolRequests)).at(-1), 'tel:463-281-3454');
  for (const link of await page.locator('a[href^="sms:"]').all()) assert.equal(await link.getAttribute('href'), TRUCK_SMS_URL);
  await page.getByRole('link', { name: 'ASK ROGER ABOUT MY SPECIAL OPTIONS', exact: true }).click();
  assertTruckSms((await page.evaluate(() => window.protocolRequests)).at(-1));
  await page.getByRole('link', { name: 'MEET YOUR SMART HOME EXPERT', exact: true }).click();
  assert.equal(new URL(page.url()).hash, '#truck-meet');
  await page.getByRole('button', { name: 'TEXT ROGER REED DIRECTLY' }).click();
  assertTruckSms((await page.evaluate(() => window.protocolRequests)).at(-1));
  assert.equal(await page.locator('iframe').count(), 6);
  assert.equal(await page.getByRole('button', { name: /Enlarge Nextdoor review/ }).count(), 5);
  assert.equal(await page.locator('.product-gallery > button').count(), 6);
  assert.ok(!(await page.locator('.truck-advantage').innerText()).includes('$200'));
  assert.ok(!(await page.locator('.truck-options').innerText()).includes('Months Free'));
  for (const product of await page.locator('.product-gallery > button').all()) {
    await product.click();
    await page.getByRole('dialog').waitFor();
    assert.equal(await page.getByRole('dialog').locator('a[href^="sms:"]').getAttribute('href'), TRUCK_SMS_URL);
    assert.equal(await page.locator('.truck-mobile-bar').count(), 0);
    await page.keyboard.press('Escape');
  }
  await page.getByRole('button', { name: 'Enlarge Nextdoor review 1', exact: true }).click();
  await page.getByRole('dialog').waitFor();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: 'Copy the starter message' }).click();
  assert.equal((await page.evaluate(() => navigator.clipboard.readText())).replaceAll('\r\n', '\n'), `To: 463-281-3454\n\n${TRUCK_SMS_MESSAGE}`);
  await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }); document.execCommand = () => false; });
  await page.getByRole('button', { name: 'Copy the starter message' }).click();
  await page.getByLabel('Truck starter message to copy').waitFor({ state: 'visible' });
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => scrollTo(0, 0));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `truck overflow at ${width}px`);
  }
  if (process.env.CHECK_MEDIA === '1') {
    for (const img of await page.locator('main img:visible').all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(element => element.decode()); }
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: 'test-results/truck-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: 'test-results/truck-mobile-hero.png' });
  await page.locator('.truck-options').screenshot({ path: 'test-results/truck-options-mobile.png' });
  // Actual cross-document links return to the customer hub and its existing form.
  await page.locator('.truck-footer').getByRole('link', { name: 'Customer hub' }).click();
  await page.getByRole('heading', { name: /Welcome to your/ }).waitFor();
  assert.equal(new URL(page.url()).pathname, '/');
  assert.equal(await page.locator('.truck-page').count(), 0);
  await page.locator('.hero-button').click();
  await page.getByLabel('Your full name', { exact: true }).fill('Truck regression customer');
  await page.getByRole('button', { name: 'ADD ANOTHER FRIEND' }).click();
  assert.equal(await page.locator('.friend-card').count(), 2);
  assert.equal(await page.getByLabel('Your full name', { exact: true }).inputValue(), 'Truck regression customer');
  assert.deepEqual(errors, []);
  console.log('PASS: built truck HTML, /truck variants and refresh, metadata, phone/SMS payloads, above-fold CTA, all product/review dialogs, copy/manual fallback, four screen widths, preserved media, and customer-hub handoff. No messages sent.');
} finally { await browser.close(); }
