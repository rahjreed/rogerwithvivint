import { registerSW } from 'virtual:pwa-register';
import { createInstallController } from './install-controller.js';

// Capture install events before lazy-loading the homepage so an early event is not lost.
export const installController = createInstallController(window, navigator);
let snapshot = { online: navigator.onLine, updateReady: false, contentOutdated: false, registrationFailed: false };
const listeners = new Set();
const publish = patch => { snapshot = { ...snapshot, ...patch }; listeners.forEach(listener => listener()); };
export const pwaState = {
  getSnapshot: () => snapshot,
  subscribe: listener => { listeners.add(listener); return () => listeners.delete(listener); },
  dismissUpdate: () => publish({ updateReady: false }),
};
window.addEventListener('online', () => publish({ online: true }));
window.addEventListener('offline', () => publish({ online: false }));

let applyUpdate;
let reloadApproved = false;
export function startPwa() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  let previousController = navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    const nextController = navigator.serviceWorker.controller;
    if (reloadApproved) {
      reloadApproved = false;
      window.location.reload();
    } else if (previousController && nextController !== previousController) {
      // A different tab may activate an update. Never discard this tab's entries.
      publish({ updateReady: true, contentOutdated: true });
    }
    previousController = nextController;
  });
  applyUpdate = registerSW({
    immediate: true,
    onNeedRefresh: () => publish({ updateReady: true, contentOutdated: true }),
    onNeedReload() {
      // Override the plugin's default reload; the native controllerchange handler
      // above only reloads after a deliberate action in this particular tab.
      publish({ updateReady: true, contentOutdated: true });
    },
    onRegisterError: () => publish({ registrationFailed: true }),
    onRegisteredSW(_url, registration) {
      // Recheck when the customer returns, without automatically reloading a form.
      const check = () => {
        if (navigator.onLine && document.visibilityState === 'visible') registration?.update().catch(() => {});
      };
      document.addEventListener('visibilitychange', check);
      window.addEventListener('online', check);
    },
  });
}

export async function updateApp() {
  reloadApproved = true;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration?.waiting) await applyUpdate?.(true);
    else window.location.reload(); // Another tab may already have activated it.
  }
  catch { reloadApproved = false; publish({ registrationFailed: true, updateReady: true }); }
}
