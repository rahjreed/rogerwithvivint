import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { mkdir } from 'node:fs/promises';
import { startPwaTestServer } from './pwa-server.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const server = await startPwaTestServer();
await mkdir('test-results', { recursive: true });
// A disposable profile avoids Chromium's intentional incognito install restriction.
// Never open the user's normal browser profile or actually accept an OS install.
const context = await chromium.launchPersistentContext(`test-results/pwa-profile-${Date.now()}`, { channel: 'msedge', headless: true, viewport: { width: 390, height: 844 }, permissions: ['clipboard-read', 'clipboard-write'] });
const browser = context.browser();
const page = await context.newPage();
page.setDefaultTimeout(15000);
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await mkdir('test-results', { recursive: true });
const navigate = async hash => { await page.evaluate(hash => { location.hash = hash; }, hash); await page.waitForTimeout(150); };
const cacheSnapshot = () => page.evaluate(async () => {
  const result = [];
  for (const name of await caches.keys()) {
    const cache = await caches.open(name);
    for (const request of await cache.keys()) {
      const response = await cache.match(request);
      result.push({ name, url: request.url, text: /javascript|text|json/.test(response.headers.get('content-type') || '') ? await response.text() : '' });
    }
  }
  return result;
});
try {
  await page.goto(server.origin, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Download App', exact: true }).waitFor();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, { timeout: 30000 });
  const sw = await page.evaluate(async () => { const registration = await navigator.serviceWorker.getRegistration(); return { scope: registration.scope, script: registration.active.scriptURL }; });
  assert.equal(sw.scope, `${server.origin}/`);
  assert.equal(sw.script, `${server.origin}/sw.js`);
  const manifestResponse = await page.request.get(`${server.origin}/manifest.webmanifest`);
  assert.match(manifestResponse.headers()['content-type'], /manifest\+json/);
  const manifest = await manifestResponse.json();
  assert.equal(manifest.name, 'Roger With Vivint');
  assert.equal(manifest.start_url, '/#home');
  assert.equal(manifest.display, 'standalone');
  const workerResponse = await page.request.get(`${server.origin}/sw.js`);
  assert.match(workerResponse.headers()['content-type'], /javascript/);
  assert.match(workerResponse.headers()['cache-control'], /no-store/);
  assert.equal(workerResponse.headers()['service-worker-allowed'], '/');
  for (const icon of manifest.icons) {
    assert.equal((await page.request.get(server.origin + icon.src)).status(), 200);
  }
  assert.equal(await page.locator('link[rel="apple-touch-icon"]').getAttribute('href'), '/icons/apple-touch-icon.png');
  const cdp = await context.newCDPSession(page);
  await cdp.send('Page.enable');
  const appManifest = await cdp.send('Page.getAppManifest');
  assert.deepEqual(appManifest.errors, []);
  const installability = await cdp.send('Page.getInstallabilityErrors');
  assert.deepEqual(installability.installabilityErrors, [], 'Chromium installability checks');
  console.log('PASS: production manifest, icons, Apple metadata, worker scope/headers/control, and Chromium installability checks.');

  // This synthetic event tests the UI/user-activation contract, not a real OS installation.
  await page.evaluate(() => {
    window.promptCalls = 0;
    const event = new Event('beforeinstallprompt', { cancelable: true });
    event.prompt = async () => { window.promptCalls++; };
    event.userChoice = Promise.resolve({ outcome: 'dismissed' });
    dispatchEvent(event);
  });
  assert.equal(await page.evaluate(() => window.promptCalls), 0);
  await page.getByRole('button', { name: 'Download App', exact: true }).click();
  assert.equal(await page.evaluate(() => window.promptCalls), 1);
  await page.getByText('Installation canceled.', { exact: false }).waitFor();
  await page.evaluate(() => dispatchEvent(new Event('appinstalled')));
  await page.getByText('App installed — look for Roger on your Home Screen.').waitFor();
  assert.equal(await page.getByRole('button', { name: 'Download App', exact: true }).count(), 0);

  await navigate('refer');
  await page.getByLabel('Your full name', { exact: true }).fill('PWA Synthetic Private Customer');
  await page.getByLabel('Vivint service number', { exact: true }).fill('PWA-PRIVATE-001');
  await page.getByRole('button', { name: 'ADD ANOTHER FRIEND' }).click();
  await context.setOffline(true);
  await page.getByText('Current referral reward terms require an online, up-to-date app.', { exact: false }).waitFor();
  assert.equal(await page.getByLabel('Your full name', { exact: true }).inputValue(), 'PWA Synthetic Private Customer');
  assert.equal(await page.locator('.friend-card').count(), 2);
  await navigate('home');
  assert.equal(await page.locator('.destination-card').count(), 0);
  await page.getByText('Reconnect to view current travel opportunities', { exact: false }).waitFor();
  await context.setOffline(false);
  await page.locator('.destination-card').first().waitFor();
  await navigate('insurance');
  await page.locator('[name="name"]').fill('PWA Synthetic Insurance');
  await page.locator('[name="email"]').fill('private-pwa@example.com');
  await page.locator('[name="street"]').fill('123 PWA Private Street');
  await page.evaluate(async () => {
    await fetch('/icons/roger-192.png?customer=PWA-PRIVATE-QUERY', { cache: 'no-store' });
  });
  let cached = await cacheSnapshot();
  assert.ok(cached.length > 5);
  assert.ok(cached.some(entry => new URL(entry.url).pathname === '/offline.html'));
  for (const entry of cached) {
    const url = new URL(entry.url);
    assert.equal(url.origin, server.origin);
    assert.ok(url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icons/') || ['/offline.html', '/manifest.webmanifest'].includes(url.pathname));
    assert.ok([...url.searchParams.keys()].every(key => key === '__WB_REVISION__'));
    for (const privateValue of ['PWA Synthetic Private Customer', 'PWA-PRIVATE-001', 'PWA Synthetic Insurance', 'private-pwa@example.com', '123 PWA Private Street', 'PWA-PRIVATE-QUERY']) {
      assert.ok(!entry.url.includes(privateValue) && !entry.text.includes(privateValue), 'private values must not enter CacheStorage');
    }
  }
  console.log('PASS: offline offers hidden, open referral entries retained, and caches contain only static allowlisted files without private/query data.');

  // Exercise a genuine waiting-worker update while two tabs hold independent forms.
  const other = await context.newPage();
  await other.goto(`${server.origin}/#refer`, { waitUntil: 'domcontentloaded' });
  await other.getByLabel('Your full name', { exact: true }).fill('Other tab unsent customer');
  server.nextVersion();
  await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).update());
  await page.waitForFunction(async () => !!(await navigator.serviceWorker.getRegistration()).waiting, { timeout: 30000 });
  await page.getByRole('complementary', { name: 'App update available' }).waitFor();
  assert.equal(await page.locator('[name="street"]').inputValue(), '123 PWA Private Street');
  await page.getByRole('button', { name: 'Later', exact: true }).click();
  assert.equal(await page.locator('[name="street"]').inputValue(), '123 PWA Private Street');
  await navigate('home');
  assert.equal(await page.locator('.destination-card').count(), 0, 'dismissing the update notice must not reveal old offers');
  await page.getByText('A newer version is available.', { exact: false }).waitFor();
  await navigate('insurance');
  await other.getByRole('complementary', { name: 'App update available' }).waitFor();
  await Promise.all([other.waitForNavigation({ waitUntil: 'domcontentloaded' }), other.getByRole('button', { name: 'Update and reload' }).click()]);
  await other.getByLabel('Your full name', { exact: true }).waitFor();
  await page.waitForTimeout(700);
  assert.equal(await page.locator('[name="street"]').inputValue(), '123 PWA Private Street', 'another tab must not force-reload this form');
  await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), page.getByRole('button', { name: 'Update and reload' }).click()]);
  await page.locator('[name="street"]').waitFor();
  assert.equal(await page.locator('[name="street"]').inputValue(), '');
  await other.close();
  console.log('PASS: real worker update waits for consent; Later and cross-tab activation preserve unsent form entries.');

  for (const route of ['/truck', '/truck/', '/truck/index.html', '/truck.html']) {
    const response = await page.goto(server.origin + route, { waitUntil: 'domcontentloaded' });
    assert.equal(response.status(), 200);
    assert.ok((await response.text()).includes('Found My Truck?'));
    await page.getByRole('heading', { name: 'You Found My Truck. Now Discover Why That’s a Good Thing.' }).waitFor();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByRole('heading', { name: 'You Found My Truck. Now Discover Why That’s a Good Thing.' }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Download App', exact: true }).count(), 0);
  }
  assert.equal((await page.request.get(`${server.origin}/missing.js`)).status(), 404);
  const fallback = await page.request.get(`${server.origin}/unrecognized-section`);
  assert.equal(fallback.status(), 200);
  assert.ok((await fallback.text()).includes('Your personal connection to Roger Reed'));
  await context.setOffline(true);
  await page.getByText('Connect and load the latest app version to view current promotional opportunities', { exact: false }).waitFor();
  assert.equal(await page.locator('#truck-options').isVisible(), false);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'A familiar connection, even offline.' }).waitFor();
  assert.equal(await page.locator('.truck-options, .destination-card, form').count(), 0);
  await page.goto(`${server.origin}/?customer=PWA-PRIVATE-QUERY`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'A familiar connection, even offline.' }).waitFor();
  await context.setOffline(false);
  await page.getByRole('link', { name: 'Try the customer homepage again' }).click();
  await page.getByRole('heading', { name: /Welcome to your/ }).waitFor();
  assert.equal(new URL(page.url()).pathname, '/');
  console.log('PASS: local Vercel filesystem/fallback contract, /truck direct visits/refresh, and neutral offline navigation recovery to the hub.');

  // Safari guidance and standalone detection are emulated, not verified on physical iOS hardware.
  const ios = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1' });
  const iphone = await ios.newPage();
  await iphone.goto(server.origin, { waitUntil: 'domcontentloaded' });
  await iphone.getByRole('button', { name: 'Download App', exact: true }).click();
  await iphone.getByRole('heading', { name: 'Add Roger with Safari' }).waitFor();
  await iphone.getByText('Add to Home Screen', { exact: true }).waitFor();
  assert.equal(await iphone.locator('.install-guide').isVisible(), true);
  await iphone.locator('.install-card').screenshot({ path: 'test-results/pwa-ios-guide.png' });
  await ios.close();
  const installed = await browser.newContext();
  await installed.addInitScript(() => {
    Object.defineProperty(navigator, 'standalone', { value: true });
  });
  const installedPage = await installed.newPage();
  await installedPage.goto(server.origin, { waitUntil: 'domcontentloaded' });
  await installedPage.getByText('App installed — look for Roger on your Home Screen.').waitFor();
  assert.equal(await installedPage.getByRole('button', { name: 'Download App', exact: true }).count(), 0);
  await installed.close();
  assert.deepEqual(errors, []);
  console.log('PASS: install prompt interaction, installed-state UI, iPhone/Safari guidance, and no uncaught page errors. Real device installation is not simulated as success.');
} finally {
  await browser.close();
  await server.close();
}
