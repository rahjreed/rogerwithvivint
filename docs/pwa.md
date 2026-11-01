# Roger With Vivint companion PWA

Implemented on `codex-development`. These changes are uncommitted and have not been pushed, merged, or deployed.

## Customer experience

- The customer homepage has a branded **Download App** card explaining quick access to referrals, guidance, and contacts.
- On a supporting browser, a retained `beforeinstallprompt` event is invoked only by the customer's button click. Dismissal and errors have truthful fallback guidance; accepting a prompt is not itself treated as proof of installation.
- iPhone/iPad visitors receive Safari Share → Add to Home Screen instructions, including Open as Web App if shown. No native Chromium prompt is claimed on iOS.
- Standalone display mode, Safari's standalone flag, and the current session's `appinstalled` event replace the download invitation with an installed-state message. Installation cannot be detected reliably from every ordinary browser tab on every platform; no persistent installed marker is written.
- Manifest identity is **Roger With Vivint**, short name **Roger**, ID `/`, scope `/`, standalone display, and start URL **`/#home`**. Installing from any public page still launches the customer homepage rather than `/truck`.
- The existing referral, insurance, partner, travel, tutorial, media, product, testimonial, and truck experiences remain available online. No messages are sent automatically.

## Assets and metadata

`public/icons/roger-source.svg` is a code-native home/R monogram using the site's dark, green, white, and orange branding. Its important content fits inside the central maskable safe circle. Generated opaque PNGs are included at 192×192, 512×512, a separate full-bleed 512×512 maskable icon, and a 180×180 Apple touch icon. Both HTML entries retain their original favicon and gain Apple/mobile metadata. The plugin injects the same manifest link into the customer and truck entries.

## Worker, privacy, freshness, and updates

The maintained `vite-plugin-pwa` **2.0.0** uses its custom `injectManifest` strategy with Workbox **7.4.1**. Registration is enabled for production builds and disabled in the development server.

- A small precache contains hashed application JS/CSS, app/touch icons, the public app manifest automatically included by the plugin, and `offline.html`. The current build precaches **14 static entries, about 332 KiB**.
- **No hub HTML, truck HTML, promotional page HTML, third-party images/video, API responses, form data, or email drafts are stored in CacheStorage.** There are no runtime data caches, background sync queues, analytics, or new backend calls.
- Every navigation goes to the network with `cache: 'no-store'`. A network failure or server 5xx uses a neutral offline guide with basic tips and the existing public contact numbers, rather than an old copy of the promotional site.
- Query-bearing same-origin GET requests bypass app and HTTP caches. Precache matching does not ignore or strip any query parameters; customer/sensitive query strings cannot be treated as equivalent to a cached static asset. Internal Workbox revision query keys are hashes, not user data.
- Already-open form entries remain in React memory when connectivity changes. No local/session storage or database persistence was added. Fresh offline navigation shows the guide rather than opening a new referral or insurance form.
- Travel offers, the referral reward banner, and truck promotional content are hidden while offline or when a newer app version is pending. Choosing **Later** does not reveal the old promotional content again.
- Updates wait for an explicit **Update and reload** action with a warning to finish/copy entered details first. Activating an update in another tab does not force-reload a tab with unsent entries. The app checks the actual registration state, so a tab can explicitly reload after another tab has already activated the worker.
- Workbox manages obsolete precache entries during activation. HTML is never served from an old app cache, even while an update is waiting.

Offline support is intentionally informational. Live offers, videos, and new form sessions need a connection. Telephone links also require an available cellular connection. The app is not a replacement for Vivint's security system or official account support.

## Routing and Vercel

The existing static truck entries and clean-URL alias remain. New **`vercel.json`** keeps real files ahead of the app fallback, explicitly maps `/truck` to its dedicated truck HTML, and applies correct worker/manifest headers. Missing static files such as `missing.js` return 404 rather than homepage HTML. The root worker has `Service-Worker-Allowed: /` and no-store/revalidation headers; the manifest has its proper MIME type and revalidation policy. HTML uses a no-store policy.

The route contract was exercised against the built artifacts in a local test server implementing this file's rule order, as well as the existing production preview tests. **This is not a Vercel cloud deployment test.** The Vercel documentation connector was unavailable, so official documentation and local package source were consulted. Live HTTPS headers and routing must be checked after a separately authorized deployment.

## File inventory

- `src/pwa-config.js`: manifest and build/cache configuration.
- `src/sw.js`: production worker with strict static precache matching, network-only navigation, neutral offline fallback, and explicit update activation.
- `src/pwa.js`, `src/usePwaState.js`: early install event capture, registration, connection/update state, and safe reload behavior.
- `src/install-controller.js`, `src/InstallApp.jsx`: native prompt lifecycle, iOS guidance, installed state, and homepage download card.
- `src/PwaStatus.jsx`, `src/pwa.css`: offline/update notices and responsive install presentation.
- `public/icons/*`, `public/offline.html`: public branded icons and neutral offline resources.
- `src/main.jsx`, `src/App.jsx`, `src/Hub.jsx`: registration and UI integration.
- `src/ReferralForm.jsx`, `src/TravelPerks.jsx`, `src/TruckLanding.jsx`: freshness/connection guards; the established form logic and online content are preserved.
- `index.html`, `truck/index.html`, `vite.config.js`, `package.json`: metadata, plugin integration, and pinned PWA/Workbox dependencies. The existing package-manager convention was retained.
- `vercel.json`: filesystem-first routing and PWA response headers; no production service settings were changed remotely.
- `tests/pwa.test.js`, `tests/pwa-server.mjs`, `tests/pwa-browser.mjs`, `tests/pwa-android.mjs`: unit, local production-route, browser lifecycle/privacy, and mobile-emulation coverage.

## Verification completed

- **23 unit tests passed**, including all previous tests and new manifest/icon dimensions, install lifecycle, iOS/iPad handling, and installed-state tests.
- **Production build passed**, generating the manifest, custom worker, icon/offline assets, and both truck HTML variants. The worker is about 17 KiB before gzip.
- A real browser registered and was controlled by the production worker; Chromium's manifest and installability diagnostics returned no errors in a disposable, non-incognito profile.
- Native-prompt UI tests confirm no invocation before a user click, one invocation after the click, truthful dismissal handling, and installed-state replacement. Prompt events are synthetic; no real OS app installation occurred.
- A genuine waiting-worker update was produced by changing the locally served worker bytes. **Later**, explicit reload, and cross-tab activation were tested with independent synthetic form entries; another tab could not erase those entries.
- CacheStorage was inspected after entering synthetic referral/insurance details and requesting a sensitive-query URL. Only the allowed public static files were present; no entered values or customer query keys were stored.
- Offline tests verify current offers disappear, open entries remain in memory, fresh hub/truck requests receive the neutral guide, and reconnecting returns to the customer homepage.
- Production `/truck`, `/truck/`, `/truck/index.html`, and `/truck.html` direct visits and refreshes passed under the local Vercel routing contract. Worker/manifest MIME types and cache headers passed. Missing JS returned 404 and the page fallback preserved the hub.
- Android-style mobile Chromium emulation passed installability diagnostics, worker control, manifest/maskable icons, and install-card layout. Safari/iPhone emulation showed the correct Add to Home Screen guide. The installed-state UI was also verified.
- Existing browser regression suites passed for referrals (including 10 entries), insurance, all six travel messages/photos, actual tutorial playback, truck calls/texts, product/review dialogs, and responsive layouts at small phone through desktop widths.
- No uncaught browser page errors were observed. Screenshots of the icons and mobile install guidance/card were visually reviewed. No email, text, phone call, or real app installation was initiated by the tests.

### Reproduce

Use the existing Node/Vite-compatible environment:

```sh
npm install
npm test
npm run build
node tests/pwa-browser.mjs
node tests/pwa-android.mjs
```

The two PWA browser scripts need an available Playwright installation (`PLAYWRIGHT_MODULE` may point to its `index.mjs`) and Edge. They start their own local production-artifact server and use isolated test profiles, never the user's normal browser profile. Generated profiles/screenshots remain under ignored `test-results/`. The existing browser suites still use the development server on port 5173 and preview on 4173; run suites sequentially when they use the system clipboard.

## Limits and release checks

No physical Android or iOS device was available. Emulated layouts, installability diagnostics, and synthetic install events do not establish a completed Android WebAPK install or Safari Home Screen launch. After an authorized HTTPS release, verify actual install/remove/reinstall, Home Screen icon/masking, customer-home launch, offline recovery, update prompts, and live Vercel headers plus `/truck` refresh on supported devices. No commit, push, merge, or deployment was performed.

The existing unverified reward/travel/company data-handling publication checks remain unchanged; PWA support does not establish approval for those programs or email workflows.

## References

- [Vite PWA custom worker and precache lifecycle](https://vite-pwa-org.netlify.app/guide/inject-manifest)
- [Vite PWA prompt-for-update behavior](https://vite-pwa-org.netlify.app/guide/prompt-for-update) and the installed 2.0.0 client's `onNeedReload` support
- [MDN: beforeinstallprompt and its platform limitations](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event)
- [MDN: standalone mode and installed-state detection limits](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Create_a_standalone_app)
- [Apple: add a website as a Safari Home Screen app](https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/27/ios/27)
- [Vercel project configuration](https://vercel.com/docs/project-configuration) and [routing](https://vercel.com/docs/routing/rewrites)
