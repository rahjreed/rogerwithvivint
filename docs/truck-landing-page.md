# Truck QR landing page

Implemented on `codex-development` for the requested canonical path `https://rogerwithvivint.com/truck`. This describes a tested local implementation, not a production deployment.

## Experience

- Dedicated prospect-facing page with the requested truck-discovery headline, personal introduction, Roger's existing photo, 3,000+ installation statement, prominent text CTA, and Meet Your Smart Home Expert anchor.
- Six practical benefits of working directly with Roger, without claims that corporate representatives are unqualified or that Roger overrides company policy.
- Current-options inquiry section inspired by the original premium offer treatment, with no revived discounts, invented urgency, exclusive entitlement, or corporate price-match claim.
- Personal expertise, independent insurance, independent travel, and official referral-program previews. Travel lists all six destinations and explains taxes/fees, conditions, and independence from Vivint corporate. Insurance directs visitors to the existing hub review request and explains licensed-provider responsibility and uncertain savings/approval.
- No $300 or $600 claim on the truck page: a current applicable reward amount remains unconfirmed. Existing customer-hub rewards copy was not changed by this task.
- Reused biography, credentials, daycare news feature, all three customer testimonials, five enlargable Nextdoor reviews, professional overview video, product demonstration video, product data/images/details, and social links.
- Compact six-product gallery with native accessible product dialogs. Quotes, hero/options/final CTAs, and the reused Meet Roger contact buttons use the exact truck QR starter message.
- Final direct call/text actions at 463-281-3454, optional copy/manual-selection fallback, mobile sticky text action hidden when a dialog is open, and the original official-support disclaimer/phone.

No form, lead database, chatbot, analytics, automated outreach, booking, payment, login, backend, or new dependency was introduced. SMS opens the visitor's own application; the visitor presses Send.

## Files

- `src/TruckLanding.jsx`, `src/truck.css`: dedicated sales page; styles are scoped to the truck experience.
- `src/truck.js`: pathname matching, title, exact starter SMS text, encoded destination.
- `truck/index.html`: real HTML entry with truck-specific static title, description, theme, canonical link, and Open Graph metadata, using the existing favicon/profile URL.
- `src/App.jsx`: selects the truck page for its pathname and the existing hub everywhere else. Each page is lazy-loaded independently; the customer homepage/flows are retained.
- `vite.config.js`: retains the existing React setup and standard Vite build, adding the truck HTML input and clean-URL alias. The build emits both `dist/truck/index.html` and identical `dist/truck.html` from one source. A small development middleware maps `/truck` (including query strings) to that entry. No hosting, deployment, domain, or production-service settings were changed.
- `src/ProductGallery.jsx`, `src/ExploreVivint.jsx`: extracts the existing gallery as a shared component with the same product data, image URLs, button styling, and selection behavior. The truck uses a compact scoped presentation; Explore Vivint retains its original layout.
- `src/MeetRoger.jsx`: optional contact callback lets the truck preserve its QR starter text while the hub keeps its previous contact behavior by default.
- `tests/truck.test.js`, `tests/truck-browser.mjs`: route selection, SMS payload, production route/metadata, dialogs, responsive layout, copy fallback, media, and hub-handoff coverage.

## Verification

- **17 unit tests passed**, including all previous referral/clipboard/insurance/travel tests.
- **Production build passed**: Vite generated the root hub entry plus both truck HTML variants and separately loaded page chunks. No additional dependencies were installed.
- **Production preview browser test passed** at `/truck`, `/truck/`, `/truck/index.html`, and `/truck.html`, including refresh at each address. Each serves actual truck HTML and the proper metadata; the check does not merely rely on React changing the title after loading homepage HTML.
- **Development `/truck?scan=qr` returned 200 with truck metadata.** Query values are not collected or persisted by this implementation.
- **SMS/call checks passed**: requested recipient and exact decoded QR starter message, including the apostrophe. All protocol launches were intercepted; no call or text was initiated externally.
- **390 × 844 phone hero check passed** with the primary CTA visible without scrolling. The hero identifies Roger and his installation experience immediately.
- **320, 390, 768, and 1440 px layout checks passed** without horizontal overflow. Mobile hero/options screenshots were visually reviewed.
- **All six product dialogs and review enlargement passed**, including keyboard dismissal and sticky-action suppression while a dialog is open.
- **Clipboard and manual-selection fallbacks passed.** No false sent notification is shown.
- **Visible reused profile, product, and review images decoded successfully** in the production-page browser test. All six original video iframe sources are retained on the page; previously tested original media URLs were not altered.
- **Existing referral browser regression passed**: 1/3/10 referrals, independent selections, customer/entry preservation, removal/renumbering, review/email/copy, and modal behavior.
- **Existing customer-updates browser regression passed**: insurance validation and email/copy, six travel SMS/copy flows and photos, resources, original tutorial starting paused and advancing during muted playback, and responsive layouts.
- No uncaught page errors were observed. `git diff --check` passed.

To reproduce truck coverage, start a built preview on port 4173, use an available Playwright installation via `PLAYWRIGHT_MODULE`, and run `node tests/truck-browser.mjs` with `TEST_BASE_URL=http://localhost:4173`. Set `CHECK_MEDIA=1` for image decoding. Existing browser suites use the development server on port 5173 and should run sequentially because they exercise the system clipboard.

## Release boundaries

Actual live-host behavior is not claimed: the page has not been deployed. The artifact supports both clean-HTML and directory-index hosting conventions, tested with Vite's production preview. Verify the live `/truck` URL and refresh after any separately authorized release.

SMS and call protocol behavior was simulated in browser tests; real iOS/Android app handoff still needs device verification. The new page retains the original video embeds without promising full playback verification of every video on every device.

Current promotions, eligibility, inventory, detailed specifications, independent travel fulfillment/costs/restrictions, and insurance/referral program terms still require confirmation before promising an entitlement. No expired promotional terms were restored. Earlier company approval and data-handling publication checks for the customer hub remain recorded in `customer-updates.md`.

No commit, push, merge, deployment, or outbound message was performed.
