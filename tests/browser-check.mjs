// Uses an existing Playwright installation; no application dependency is needed.
// PLAYWRIGHT_MODULE points to its index.mjs. Start the Vite server separately.
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
page.setDefaultTimeout(12000);
page.setDefaultNavigationTimeout(20000);
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const externalRequests = [];
page.on('request', request => { if (!request.url().startsWith('http://localhost:5173')) externalRequests.push(request.url()); });
await mkdir('test-results', { recursive: true });
const fieldsets = () => page.locator('.friend-card');
const navigate = async hash => { await page.evaluate(hash => { window.location.hash = hash; }, hash); await page.waitForTimeout(150); };
const noOverflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'horizontal overflow');
try {
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: /Welcome to your/ }).waitFor();
  await noOverflow();
  await page.screenshot({ path: 'test-results/home-mobile.png', fullPage: true });
  await page.locator('.hero-button').click();
  console.log('Home and referral navigation passed.');
  await page.getByRole('heading', { name: 'Good neighbors. Safer homes.' }).waitFor();
  assert.equal(await page.locator('.mobile-referral-bar').count(), 0);
  await page.getByLabel('Your full name', { exact: true }).fill('Test & Family — O’Neil');
  await page.getByLabel('Vivint service number', { exact: true }).fill('TEST-001');
  await page.getByRole('button', { name: 'REVIEW REFERRALS' }).click();
  assert.equal(await page.getByRole('heading', { name: 'Review your introductions.' }).count(), 0, 'incomplete referral must not pass');
  async function fillFriend(index) {
    const row = fieldsets().nth(index);
    await row.getByLabel('Friend’s full name').fill(`Test Friend ${index + 1} & é`);
    await row.getByLabel('Phone number').fill('3175550100');
    await row.getByLabel('City', { exact: true }).fill('Indianapolis');
    await row.getByLabel('State', { exact: true }).selectOption('IN');
  }
  await fillFriend(0);
  console.log('First referral populated.');
  await page.getByRole('button', { name: 'REVIEW REFERRALS' }).click();
  await page.getByRole('heading', { name: 'Review your introductions.' }).waitFor();
  let mailto = new URL(await page.getByRole('link', { name: 'OPEN EMAIL TO SEND REFERRALS' }).getAttribute('href'));
  assert.ok(mailto.searchParams.get('subject').includes('1 Friends'));
  await page.getByRole('button', { name: 'Back to edit referrals' }).click();
  for (let index = 1; index < 10; index++) {
    await page.getByRole('button', { name: 'ADD ANOTHER FRIEND' }).click();
    await fillFriend(index);
    if (index === 2) assert.equal(await fieldsets().count(), 3);
  }
  await fieldsets().nth(1).getByLabel('Preferred contact method').selectOption('Phone Call');
  console.log('Ten referrals populated.');
  assert.equal(await fieldsets().nth(0).getByLabel('Preferred contact method').inputValue(), 'Call & Group Text');
  assert.equal(await fieldsets().nth(2).getByLabel('Preferred contact method').inputValue(), 'Call & Group Text');
  await navigate('resources');
  await navigate('refer');
  assert.equal(await fieldsets().count(), 10);
  assert.equal(await page.getByLabel('Your full name', { exact: true }).inputValue(), 'Test & Family — O’Neil');
  await page.getByRole('button', { name: 'REVIEW REFERRALS' }).click();
  mailto = new URL(await page.getByRole('link', { name: 'OPEN EMAIL TO SEND REFERRALS' }).getAttribute('href'));
  const body = mailto.searchParams.get('body');
  assert.ok(body.includes('TOTAL REFERRALS: 10'));
  assert.ok(body.includes('Test Friend 10 & é'));
  assert.ok(body.includes('\r\n\r\n'));
  assert.ok(body.includes('Preferred Contact: Phone Call'));
  await page.getByRole('button', { name: 'Copy Referral Details' }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  assert.ok(copied.endsWith(body));
  // Test the protocol link without launching an external mail client.
  await page.evaluate(() => document.querySelector('a[href^="mailto:"]').addEventListener('click', event => event.preventDefault()));
  await page.getByRole('link', { name: 'OPEN EMAIL TO SEND REFERRALS' }).click();
  assert.ok((await page.getByRole('status').first().innerText()).includes('Nothing has been sent'));
  await noOverflow();
  await page.screenshot({ path: 'test-results/referral-review-mobile.png', fullPage: true });
  await page.getByRole('button', { name: 'Back to edit referrals' }).click();
  await page.getByRole('button', { name: 'Remove referral 2', exact: true }).click();
  assert.equal(await fieldsets().count(), 9);
  assert.equal(await fieldsets().nth(1).getByLabel('Friend’s full name').inputValue(), 'Test Friend 3 & é');
  assert.equal(await fieldsets().nth(1).locator('legend').innerText(), 'Referral #2');
  await page.getByLabel('Your full name', { exact: true }).fill('   ');
  await page.getByRole('button', { name: 'REVIEW REFERRALS' }).click();
  assert.equal(await page.getByRole('heading', { name: 'Review your introductions.' }).count(), 0);
  await page.getByLabel('Your full name', { exact: true }).fill('Test Customer');
  await fieldsets().nth(0).getByLabel('Phone number').fill('123');
  await page.getByRole('button', { name: 'REVIEW REFERRALS' }).click();
  assert.equal(await page.getByRole('heading', { name: 'Review your introductions.' }).count(), 0);
  await fieldsets().nth(0).getByLabel('Phone number').fill('3175550100');
  // Simulate both copy mechanisms being unavailable; the full manual-copy text must remain available.
  await page.getByRole('button', { name: 'REVIEW REFERRALS' }).click();
  await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }); document.execCommand = () => false; });
  await page.getByRole('button', { name: 'Copy Referral Details' }).click();
  await page.getByLabel('Complete referral email').waitFor({ state: 'visible' });
  assert.ok((await page.getByLabel('Complete referral email').inputValue()).includes('TOTAL REFERRALS: 9'));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const area of ['home', 'refer', 'resources', 'partners', 'meet', 'explore']) { await navigate(area); await noOverflow(); }
  }
  await navigate('meet');
  assert.equal(await page.locator('iframe').count(), 4);
  assert.equal(await page.getByRole('button', { name: /Enlarge Nextdoor review/ }).count(), 5);
  await page.getByRole('button', { name: 'Enlarge Nextdoor review 1', exact: true }).click();
  await page.getByRole('dialog').waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  await navigate('explore');
  assert.equal(await page.locator('iframe').count(), 2);
  await page.getByRole('button', { name: /Outdoor Camera Pro/ }).click();
  await page.getByRole('dialog').waitFor();
  await page.getByRole('button', { name: 'TEXT ROGER ABOUT THIS PRODUCT' }).waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /Ask about current offers/ }).click();
  await page.getByRole('dialog').waitFor();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  if (process.env.CHECK_MEDIA === '1') {
    for (const area of ['home', 'meet', 'explore']) {
      await navigate(area);
      for (const img of await page.locator('main img:visible').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(element => element.decode());
        assert.ok(await img.evaluate(element => element.naturalWidth > 0));
      }
    }
    console.log('PASS: original profile, all five review images, and all six product images decoded in the browser.');
  }
  await navigate('home');
  await page.screenshot({ path: 'test-results/home-desktop.png', fullPage: true });
  assert.deepEqual(errors, []);
  // Referral data never left through network traffic: no query or request contains synthetic form values.
  assert.ok(externalRequests.every(url => !/TEST-001|Test%20Friend|O%E2%80%99Neil/.test(url)));
  console.log('PASS: homepage, 1/3/10 entries, validation, independent methods, removal, navigation retention, email encoding, clipboard/manual fallback, 4 viewport widths, modals and protocol-link simulation.');
} finally { await browser.close(); }
