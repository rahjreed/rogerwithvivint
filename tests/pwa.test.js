import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createInstallController, isIOSDevice } from '../src/install-controller.js';
import { appManifest, pwaOptions } from '../src/pwa-config.js';

function environment({ ios = false, installed = false, desktopIPad = false } = {}) {
  const target = new EventTarget();
  const media = new EventTarget();
  media.matches = installed;
  target.matchMedia = () => media;
  const navigatorObject = { userAgent: ios ? 'iPhone Safari' : 'Chrome', standalone: false, platform: desktopIPad ? 'MacIntel' : '', maxTouchPoints: desktopIPad ? 5 : 0 };
  const controller = createInstallController(target, navigatorObject);
  return { target, media, controller };
}

test('manifest launches the customer homepage, has standalone identity, and proper PNG dimensions', async () => {
  assert.equal(appManifest.name, 'Roger With Vivint');
  assert.equal(appManifest.short_name, 'Roger');
  assert.equal(appManifest.start_url, '/#home');
  assert.equal(appManifest.scope, '/');
  assert.equal(appManifest.display, 'standalone');
  assert.equal(appManifest.id, '/');
  assert.ok(appManifest.icons.some(icon => icon.purpose === 'maskable'));
  for (const icon of appManifest.icons) {
    const bytes = await readFile(new URL(`../public${icon.src}`, import.meta.url));
    const [width, height] = icon.sizes.split('x').map(Number);
    assert.equal(bytes.toString('hex', 0, 8), '89504e470d0a1a0a');
    assert.equal(bytes.readUInt32BE(16), width);
    assert.equal(bytes.readUInt32BE(20), height);
  }
  const apple = await readFile(new URL('../public/icons/apple-touch-icon.png', import.meta.url));
  assert.equal(apple.readUInt32BE(16), 180);
  assert.equal(apple.readUInt32BE(20), 180);
});

test('cache configuration contains only static compiled assets, icons, and a neutral offline guide', () => {
  assert.equal(pwaOptions.registerType, 'prompt');
  assert.equal(pwaOptions.strategies, 'injectManifest');
  assert.deepEqual(pwaOptions.injectManifest.globPatterns, ['assets/*.{js,css}', 'icons/*.png', 'offline.html']);
  assert.equal(pwaOptions.includeManifestIcons, false);
  assert.deepEqual(pwaOptions.includeAssets, []);
  assert.equal(pwaOptions.devOptions.enabled, false);
});

test('native install is deferred until a user action; accepting is not a false installed claim', async () => {
  const { target, controller } = environment();
  let prompted = 0;
  const event = new Event('beforeinstallprompt', { cancelable: true });
  event.prompt = async () => { prompted++; };
  event.userChoice = Promise.resolve({ outcome: 'accepted' });
  target.dispatchEvent(event);
  assert.equal(event.defaultPrevented, true);
  assert.equal(prompted, 0);
  assert.equal(controller.getSnapshot().canPrompt, true);
  const result = controller.install();
  assert.equal(prompted, 1, 'prompt must be invoked synchronously during user activation');
  await result;
  assert.equal(controller.getSnapshot().installed, false);
  assert.equal(controller.getSnapshot().canPrompt, false);
  target.dispatchEvent(new Event('appinstalled'));
  assert.equal(controller.getSnapshot().installed, true);
  await controller.install();
  assert.equal(prompted, 1);
  controller.destroy();
});

test('dismissed and rejected prompts stay usable and never claim installation', async () => {
  const { target, controller } = environment();
  const dismissed = new Event('beforeinstallprompt', { cancelable: true });
  dismissed.prompt = async () => {};
  dismissed.userChoice = Promise.resolve({ outcome: 'dismissed' });
  target.dispatchEvent(dismissed); await controller.install();
  assert.equal(controller.getSnapshot().installed, false);
  assert.match(controller.getSnapshot().notice, /canceled/);
  const failed = new Event('beforeinstallprompt', { cancelable: true });
  failed.prompt = async () => { throw new Error('Unavailable'); };
  target.dispatchEvent(failed); await controller.install();
  assert.equal(controller.getSnapshot().busy, false);
  assert.match(controller.getSnapshot().notice, /could not open/);
  controller.destroy();
});

test('iOS including desktop-mode iPad uses guidance and never invokes a native prompt', async () => {
  assert.equal(isIOSDevice({ userAgent: 'Mac Safari', platform: 'MacIntel', maxTouchPoints: 5 }), true);
  for (const options of [{ ios: true }, { desktopIPad: true }]) {
    const { target, controller } = environment(options);
    const event = new Event('beforeinstallprompt');
    event.prompt = () => assert.fail('iOS cannot trigger the Chromium prompt');
    target.dispatchEvent(event); await controller.install();
    assert.equal(controller.getSnapshot().ios, true);
    assert.equal(controller.getSnapshot().canPrompt, false);
    controller.destroy();
  }
});

test('standalone and later display-mode changes replace the install invitation', () => {
  const installed = environment({ installed: true });
  assert.equal(installed.controller.getSnapshot().installed, true);
  installed.controller.destroy();
  const { media, controller } = environment();
  media.matches = true; media.dispatchEvent(new Event('change'));
  assert.equal(controller.getSnapshot().installed, true);
  controller.destroy();
});
