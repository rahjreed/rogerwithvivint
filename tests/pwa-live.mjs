// Read-only audit of the deployed PWA in an isolated desktop Chromium profile.
// A mobile UA/layout is emulation, not a real Android device or OS installation.
import { pathToFileURL } from 'node:url';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
await mkdir('test-results', { recursive: true });
const origin = process.env.PWA_LIVE_URL || 'https://rogerwithvivint.com';
const context = await chromium.launchPersistentContext(`test-results/pwa-live-${Date.now()}`, {
  channel: process.env.PWA_BROWSER || 'msedge', headless: true, isMobile: true, hasTouch: true,
  viewport: { width: 393, height: 851 },
  userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
});
const report = { origin, browserChannel: process.env.PWA_BROWSER || 'msedge', emulated: true, errors: [], consoleErrors: [], failedRequests: [] };
try {
  await context.addInitScript(() => {
    window.installAudit = { prompts: 0, installed: 0 };
    addEventListener('beforeinstallprompt', event => { window.installAudit.prompts++; window.installAudit.trusted = event.isTrusted; });
    addEventListener('appinstalled', () => window.installAudit.installed++);
  });
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('requestfailed', request => report.failedRequests.push({ url: request.url(), error: request.failure()?.errorText }));
  const response = await page.goto(origin, { waitUntil: 'domcontentloaded' });
  report.page = { url: page.url(), status: response.status(), headers: response.headers() };
  await page.locator('.install-card').waitFor({ timeout: 30000 });
  // Benign user engagement; never click install, submit forms, call, or text.
  await page.locator('#install-heading').tap();
  try { await page.waitForFunction(() => !!navigator.serviceWorker.controller, { timeout: 30000 }); }
  catch { report.errors.push('No service-worker controller within 30 seconds'); }
  const cdp = await context.newCDPSession(page);
  await cdp.send('Page.enable');
  report.manifestDiagnostics = await cdp.send('Page.getAppManifest');
  report.installability = await cdp.send('Page.getInstallabilityErrors');
  const resources = ['/manifest.webmanifest', '/sw.js', '/icons/roger-192.png', '/icons/roger-512.png', '/icons/roger-maskable-512.png', '/truck'];
  report.resources = [];
  for (const resource of resources) {
    const result = await page.request.get(new URL(resource, page.url()).href);
    const body = await result.body();
    report.resources.push({ path: resource, url: result.url(), status: result.status(), headers: result.headers(),
      ...(resource.endsWith('.png') ? { width: body.readUInt32BE(16), height: body.readUInt32BE(20) } : {}),
      ...(resource.endsWith('.webmanifest') ? { manifest: JSON.parse(body.toString()) } : {}),
    });
  }
  // Chrome may defer install promotion until the engagement criteria are met.
  await page.waitForTimeout(35000);
  report.browser = await page.evaluate(async () => ({
    secure: isSecureContext, userAgent: navigator.userAgent, audit: window.installAudit,
    manifestLinks: [...document.querySelectorAll('link[rel="manifest"]')].map(link => link.href),
    controller: navigator.serviceWorker.controller?.scriptURL,
    registrations: await Promise.all((await navigator.serviceWorker.getRegistrations()).map(async r => ({ scope: r.scope, active: r.active?.scriptURL, state: r.active?.state, waiting: r.waiting?.scriptURL }))),
    caches: await Promise.all((await caches.keys()).map(async name => ({ name, urls: (await (await caches.open(name)).keys()).map(request => request.url) }))),
    card: document.querySelector('.install-card')?.innerText,
  }));
  await page.locator('.install-card').screenshot({ path: 'test-results/pwa-live.png' });
  await writeFile('test-results/pwa-live-audit.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  assert.equal(report.browser.secure, true);
  assert.equal(report.page.status, 200);
  assert.deepEqual(report.manifestDiagnostics.errors, []);
  assert.deepEqual(report.installability.installabilityErrors, []);
  assert.equal(report.browser.controller, new URL('/sw.js', report.page.url).href);
  assert.deepEqual(report.errors, []);
  for (const resource of report.resources) {
    assert.equal(resource.status, 200, resource.path);
    assert.match(resource.headers['content-type'], resource.path.endsWith('.png') ? /image\/png/ : resource.path.endsWith('.js') ? /javascript/ : resource.path.endsWith('.webmanifest') ? /manifest\+json/ : /text\/html/);
  }
} finally { await context.close(); }
