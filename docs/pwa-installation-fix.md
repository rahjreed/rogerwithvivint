# PWA installation diagnosis and fix — November 1, 2026

## Diagnosis before application changes

A read-only audit visited `https://rogerwithvivint.com`, which redirects to the canonical HTTPS origin `https://www.rogerwithvivint.com/`. It used an isolated, non-incognito **desktop Google Chrome** profile with Android-style UA, mobile viewport, and touch emulation. It did not use a physical Android device, accept an install dialog, or change the deployment.

Observed on the deployed site:

| Check | Evidence |
| --- | --- |
| Secure homepage | HTTP 200, HTTPS, `isSecureContext: true`, HTML content type |
| Manifest | HTTP 200, `application/manifest+json`, `Cache-Control: no-cache`, no Chrome manifest errors |
| Manifest identity | Name `Roger With Vivint`, short name `Roger`, ID `/`, start URL `/#home`, scope `/`, display `standalone`, related-app preference false |
| Icons | All HTTP 200, `image/png`; decoded PNG headers confirmed 192×192, 512×512, and 512×512 maskable |
| Service worker | `/sw.js` HTTP 200, JavaScript MIME, `Service-Worker-Allowed: /`, `no-cache, no-store, must-revalidate` |
| Registration/control | One activated root-scope registration; page controlled by canonical-origin `/sw.js`; no waiting worker in this clean profile |
| CacheStorage | One Roger static precache with compiled JS/CSS, icons, manifest, and neutral offline guide; no stale HTML or customer-data cache observed in this fresh profile |
| Chrome diagnostics | `Page.getAppManifest.errors: []`; `Page.getInstallabilityErrors.installabilityErrors: []` |
| Real browser event | `beforeinstallprompt` fired once without synthetic dispatch after benign engagement; no `appinstalled` event |
| Runtime/network | No uncaught page errors, console errors, or failed requests in the audit |
| Truck endpoint | Canonical `/truck` returned HTTP 200 with HTML MIME |

The confirmed defect was the invitation/fallback UX, not a manifest or worker failure: **Download App** was always shown even when no deferred install event existed. Clicking it then opened generic instructions; notices also automatically expanded the help. This conflated “browser has not offered a prompt” with a functioning one-tap install action.

The original early event capture and direct-click `prompt()` invocation were already correct and were preserved. There is no evidence establishing why the user's particular Android session withheld installation. Engagement, previous dismissal, an existing install, browser mode/policy, or an embedded browser can affect promotion; absence of the event alone does not diagnose a broken PWA. A clean desktop profile cannot establish the cache or installation state of that phone.

## Changes

- On Chromium, the green **Download App** button appears only after the browser supplies the event. A late event automatically takes priority over open fallback help.
- The click invokes `installController.install()` immediately, and that controller calls the saved event's `prompt()` before any `await`. No worker setup, timers, or requests precede it.
- Without an event, a small **Installation options** link toggles a short Android/browser fallback. No lengthy permanent manual section or automatically opened instructions remain.
- On iPhone/iPad, **Download App** opens compact Safari Share → Add to Home Screen → Add guidance, including Open as Web App if offered.
- Cancellation and errors use brief, truthful status messages and leave help collapsed. A consumed event is not offered again unless the browser sends a new one.
- Standalone mode, Safari standalone, and `appinstalled` still replace the invitation with the installed message. Ordinary tabs cannot universally detect an existing app; the fallback acknowledges this without guessing or storing a false installed flag.
- Manifest identity, icons, worker caching, registration, update consent, routes, forms, videos, and offers were left intact because the audit did not show a defect in them.

## Verification of the fix

- All **23 unit tests** pass.
- Vite production build passes, including generated manifest and worker with 14 static precache entries.
- Production-artifact browser suite passes no-event/late-event priority, optional help, prompt dismissal/error, installed state, Safari guidance, offline privacy, retained form entries, genuine worker updates/cross-tab safety, and `/truck` direct visits/refreshes.
- Desktop **Google Chrome with Android-style emulation** emitted a genuine trusted `beforeinstallprompt` event for the rebuilt production app. A tap on **Download App** invoked the browser's real `prompt()` exactly once while `navigator.userActivation.isActive` was true. The test did not accept the dialog or install an app.
- Screenshots cover the compact fallback, Chrome's ready install card, and opt-in Safari guidance.

**Device limit:** no real Android phone or iPhone was available. Native browser event delivery and prompt invocation were verified in desktop Chrome emulation; an Android WebAPK install and Home Screen launch were not verified. The fix remains local until an authorized deployment. No commit, push, merge, or deployment was performed for this fix.

## Reproduce

```sh
npm test
npm run build
node tests/pwa-browser.mjs
node tests/pwa-android.mjs
# Read-only live audit; defaults to Edge, select Chrome for the reported audit:
# Set PWA_BROWSER=chrome in your shell, then:
node tests/pwa-live.mjs
```

Scripts use an available Playwright module (`PLAYWRIGHT_MODULE` optional) and isolated profiles under ignored `test-results/`. The live audit writes `test-results/pwa-live-audit.json`. It never submits forms or accepts an OS installation.

## Browser references

- [Chrome team's installability criteria and engagement requirements](https://web.dev/articles/install-criteria)
- [MDN: capture the event and reveal the install invitation when available](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event)
- [Browser installation prompt lifecycle and reasons an event may be unavailable](https://web.dev/learn/pwa/installation-prompt)
