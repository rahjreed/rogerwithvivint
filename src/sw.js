import { clientsClaim, setCacheNameDetails } from 'workbox-core';
import { cleanupOutdatedCaches, matchPrecache, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';

setCacheNameDetails({ prefix: 'roger-companion' });
cleanupOutdatedCaches();
// Even requests to an otherwise static asset bypass both app and HTTP caches
// when they carry any query string. No query keys are treated as disposable.
registerRoute(
  ({ request, url }) => request.mode !== 'navigate' && url.origin === self.location.origin && url.search.length > 0,
  ({ request }) => fetch(request, { cache: 'no-store' }),
);
precacheAndRoute(self.__WB_MANIFEST, {
  ignoreURLParametersMatching: [],
  cleanURLs: false,
  directoryIndex: null,
});

// Navigations always request current HTML. Never cache a request URL, query,
// response, or form payload. An offline visit receives only the neutral guide.
registerRoute(
  ({ request, url }) => request.mode === 'navigate' && url.origin === self.location.origin,
  async ({ request }) => {
    try {
      const response = await fetch(request, { cache: 'no-store' });
      if (response.status >= 500) return (await matchPrecache('/offline.html')) || response;
      return response;
    } catch {
      return (await matchPrecache('/offline.html')) || Response.error();
    }
  },
);

// Updates stay waiting until the user explicitly chooses Update and reload.
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
clientsClaim();
