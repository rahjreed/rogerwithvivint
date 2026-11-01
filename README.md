# Roger With Vivint — Customer Hub

Progressive Web App support is documented in [docs/pwa.md](docs/pwa.md): a customer-home launch manifest, branded icons, Download App/Safari guidance, static-only caching with a neutral offline guide, and explicit updates that protect in-progress forms. It includes current PWA verification results and physical-device/live-release checks.

The dedicated **`/truck` QR sales page** is documented in [docs/truck-landing-page.md](docs/truck-landing-page.md), including routing/build output, preserved hub behavior, and current verification results. `src/App.jsx` now chooses between the separately loaded customer hub and truck page; the build produces static truck HTML for both clean-URL and directory-index hosting conventions.

The follow-up resources/travel/rewards/insurance implementation and its current verification results are recorded in [docs/customer-updates.md](docs/customer-updates.md). It adds How It Works and Roger's panel tutorial, six independent travel inquiries, the requested referral rewards messaging, and an email-based home insurance savings request. The original redesign notes below describe the earlier baseline; see that update for current promotional review requirements.

Customer-first redesign of the existing React 18 / Vite / Tailwind application. The original entry point remains `src/main.jsx` → `src/App.jsx`; `App` now re-exports the hub. Navigation uses URL fragments and does not require new hosting rewrites or a router. Existing deployment configuration, domains, public assets, and dependency ranges are unchanged. No runtime dependencies were added.

## Run locally

Use a Node version supported by Vite 7 (Node 20.19+ or 22.12+).

```sh
npm install
npm run dev
npm test
npm run build
```

`npm test` runs the Node test runner. `tests/browser-check.mjs` also exercises the rendered site using an existing Playwright installation and Edge; it adds no application dependency. Start Vite on `http://localhost:5173`, then run that file with `PLAYWRIGHT_MODULE` set to your Playwright `index.mjs` path, or make Playwright available to Node's normal module resolution. Screenshots are written to ignored `test-results/`.

Set `CHECK_MEDIA=1` for browser image-decoding checks that require access to the original external hosts. Completed verification evidence and remaining device checks are recorded in `docs/verification.md`.

## Files and behavior

- `src/Hub.jsx`: homepage, fragment navigation, resources, footer, separate public business-partner handoff, offer inquiry, review/product dialogs.
- `src/ReferralForm.jsx`: reusable multi-referral form, required fields, independent contact methods, review, script previews, email and copy actions. Forms stay mounted when switching hub sections.
- `src/referrals.js`: stable entry IDs, immutable updates/removal, contact scripts, US phone validation, encoded structured email generation.
- `src/clipboard.js`: Clipboard API, selection-based fallback, truthful failure result, focus restoration.
- `src/Modal.jsx`: native accessible modal with keyboard dismissal, focus containment/restoration, scroll lock, backdrop dismissal.
- `src/brand.jsx`, `src/MeetRoger.jsx`, `src/ExploreVivint.jsx`: reused branding, equipment image URLs, profile, biography, experience, daycare feature, three customer testimonials, five enlargable Nextdoor reviews, two sales videos, and direct contact/social links.
- `src/index.css`: responsive dark/green customer-hub styling, comfortable form controls, focus states, reduced-motion support, referral sticky action hidden on both forms and while dialogs are open.
- `index.html`: customer-hub description and theme metadata. Vite/Tailwind/PostCSS configuration remains unchanged.
- `.gitignore`: activates appropriate build/dependency/test-output exclusions; original `_gitignore` retained.
- `tests/`: referral and clipboard unit tests plus the browser verification script.
- `docs/original-media-urls.json`: original URL inventory. `docs/offers-and-specifications-pending-review.txt`: original promotional modal and detailed product claims, archived outside the served app for review.

## Preserved and removed

Preserved: Roger's profile and credentials, 3,000+ installation statement, 2014 daycare story and footage, all three customer testimonial videos, five Nextdoor images and enlargement, Instagram/TikTok links, phone number, support disclaimer, six equipment items and images, product details/quote dialogs, personal promotional video, product demonstration video, partner referral text handoff, and current-offer inquiry.

Removed from the active interface: phone-sales comparison, repetitive sales CTAs, sales sticky banner, frontend partner password and misleading authentication, unverified commission amounts, fake marketing downloads, and active inventory/discount/free-service/exclusive-offer claims. The existing promotion is retained as an offer-inquiry modal, with the original terms archived for approval. Exact unverified model/technical claims are replaced with product-specific consultation descriptions; no new offer terms were invented.

## Privacy and release decisions

Referral/customer data lives only in React state during the active page session. It is not saved in local/session storage, logged, or posted to an API. The homeowner form opens one encoded draft addressed to `roger.reed@vivint.com`, or lets the user copy its complete details. No automated calls, texts, emails, CRM, database, analytics, account, or lead dashboard was introduced. Opening an app never displays a delivery-success claim. Long email links have a full-content copy/manual-selection fallback; no referral count limit or truncation is applied.

**Before production release:** Obtain Vivint/company approval for sending a service number and third-party phone numbers through the customer's email app. That approval cannot be established from this repository and has not been assumed. Outreach authorization/procedures remain separate; a referring customer's contact-method preference is not proof of the friend's marketing permission. No mandatory consent checkbox was added.

Confirm current offer terms, inventory, product specifications, commission arrangements, and approved marketing assets before reactivating those claims. If private partner information is needed later, secure server-side authentication is a separate implementation decision; this public partner page must not be treated as an access boundary.

The mailto protocol is inspected and simulated in automated browser tests. Actual email app compatibility, delivery, iOS/Android keyboard behavior, and real-device mailto length limits still require device verification. Browser tests do not send messages. External media availability and playback depend on their original hosts and network policies.

No commit, push, merge, deployment, production configuration change, or external outreach is part of this implementation.
