// Mobile Chromium emulation, not a physical Android device or a real OS install.
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { mkdir } from 'node:fs/promises';
import { startPwaTestServer } from './pwa-server.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const server = await startPwaTestServer();
await mkdir('test-results', { recursive: true });
const context = await chromium.launchPersistentContext(`test-results/pwa-android-${Date.now()}`, {
  channel: 'msedge', headless: true, isMobile: true, hasTouch: true,
  viewport: { width: 393, height: 851 }, deviceScaleFactor: 2,
  userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
});
try {
  const page = await context.newPage();
  await page.goto(server.origin, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Download App', exact: true }).waitFor();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, { timeout: 30000 });
  const cdp = await context.newCDPSession(page);
  await cdp.send('Page.enable');
  assert.deepEqual((await cdp.send('Page.getAppManifest')).errors, []);
  assert.deepEqual((await cdp.send('Page.getInstallabilityErrors')).installabilityErrors, []);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  const manifest = await (await page.request.get(server.origin + '/manifest.webmanifest')).json();
  assert.equal(manifest.start_url, '/#home');
  assert.ok(manifest.icons.some(icon => icon.purpose === 'maskable'));
  await page.locator('.install-card').screenshot({ path: 'test-results/pwa-android-install.png' });
  console.log('PASS: Android-style mobile Chromium emulation: installability diagnostics, manifest/icons, worker control, homepage install button and layout. No physical Android installation was performed.');
} finally { await context.close(); await server.close(); }
