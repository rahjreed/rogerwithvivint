export function isIOSDevice(navigatorObject) {
  return /iPad|iPhone|iPod/i.test(navigatorObject.userAgent) ||
    (navigatorObject.platform === 'MacIntel' && navigatorObject.maxTouchPoints > 1);
}

export function createInstallController(windowObject, navigatorObject) {
  const media = windowObject.matchMedia('(display-mode: standalone)');
  let deferred;
  let snapshot = { installed: media.matches || navigatorObject.standalone === true, ios: isIOSDevice(navigatorObject), canPrompt: false, busy: false, notice: '' };
  const subscribers = new Set();
  const publish = patch => { snapshot = { ...snapshot, ...patch }; subscribers.forEach(callback => callback()); };
  const onPrompt = event => {
    if (snapshot.installed || snapshot.ios) return;
    event.preventDefault();
    deferred = event;
    publish({ canPrompt: true, notice: '' });
  };
  const onInstalled = () => { deferred = undefined; publish({ installed: true, canPrompt: false, busy: false, notice: '' }); };
  const onDisplay = () => {
    if (media.matches || navigatorObject.standalone === true) onInstalled();
  };
  windowObject.addEventListener('beforeinstallprompt', onPrompt);
  windowObject.addEventListener('appinstalled', onInstalled);
  media.addEventListener?.('change', onDisplay);
  return {
    getSnapshot: () => snapshot,
    subscribe: callback => { subscribers.add(callback); return () => subscribers.delete(callback); },
    async install() {
      if (!deferred || snapshot.installed || snapshot.ios || snapshot.busy) return;
      const promptEvent = deferred;
      deferred = undefined;
      publish({ canPrompt: false, busy: true, notice: '' });
      try {
        // Keep this call synchronous with the customer's click/user activation.
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (!snapshot.installed) publish({ busy: false, notice: choice.outcome === 'accepted' ? 'Installation requested. Finish in your browser to add Roger.' : 'Installation canceled. You can still use the website.' });
      } catch {
        publish({ busy: false, notice: 'The install prompt could not open. Try Installation options.' });
      }
    },
    destroy() {
      windowObject.removeEventListener('beforeinstallprompt', onPrompt);
      windowObject.removeEventListener('appinstalled', onInstalled);
      media.removeEventListener?.('change', onDisplay);
      subscribers.clear();
    },
  };
}
