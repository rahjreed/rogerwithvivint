# Customer resources, travel, referral rewards, and insurance update

Continues the existing customer hub on `codex-development`. No new dependencies, backend, API, account, booking, payment, quoting engine, production configuration, commit, push, merge, or deployment was introduced.

## Changes

- `src/ReferralForm.jsx`: requested $300 rewards headline, explanatory paragraph, approval/eligibility note, and official-terms link above the referral form. The add/remove, contact-method, review, email, and copy logic is unchanged.
- `src/Hub.jsx`: renames Customer Resources to **How It Works** while preserving the existing `#resources` link. Adds a prominent tutorial/resources card and **Save on Home Insurance** card on the homepage, followed by Customer Travel Perks and secondary credibility/navigation cards. Adds `#insurance` as a destination and keeps that form mounted across navigation. The mobile referral bar is hidden on the insurance form.
- `src/PanelTutorial.jsx`: Roger's supplied original video, embedded with the provider-supported `/embed/587199/eaa2d055-1343-4c49-bb9d-3ee2852d574c` URL, responsive 16:9 player, no autoplay, fullscreen/picture-in-picture support, and an Open Video link to the original `/play/` page. Other customer resources remain available below it.
- `src/TravelPerks.jsx`, `src/travel.js`: six requested destinations/durations, destination-specific SMS drafts to 463-281-3454, copy and manual-selection fallback, explicit no-message-sent status, taxes/fees disclosure, independence from Vivint corporate, and written-terms/availability reminders. No booking or payment collection. Photography is illustrative; photo source, author, license, and responsive-crop attribution appear in the page's credits.
- `src/InsuranceForm.jsx`, `src/insurance.js`: required name, phone, email, street, city, state, ZIP; phone/email/ZIP validation and suitable mobile inputs; complete encoded email addressed only to `roger.reed@vivint.com`; Copy Details and manual-selection fallback; no sent/submitted claim. Form data stays in React memory only. The requested licensed-insurance-professional disclosure and separate-authorization requirement for any later partner sharing are visible before the fields. No partner forwarding occurs through the site.
- `src/customer-updates.css`: responsive cards, form presentation, tutorial layout, rewards banner, travel disclosures, photo credits, and mobile styling.
- `tests/customer-updates.test.js`, `tests/customer-updates-browser.mjs`: validation, email/text payloads, copying, new UI, media, and regression coverage. The existing referral tests remain.

## Verification completed

- **15 unit tests passed**, including all existing referral/clipboard tests and four new insurance/travel tests.
- **Existing browser regression passed**: 1/3/10 referrals, entry preservation, independent contact methods, removal/renumbering, email encoding, copy/manual fallback, dialogs, and responsive layout.
- **New browser flow passed**: all six destination SMS payloads and correct recipient; actual Clipboard API; insurance required/whitespace/phone/email/ZIP validation; full email payload including special characters and line breaks; truthful draft status; form retention across navigation; insurance/travel manual-copy fallbacks; rewards banner placement; preserved Add Another Friend behavior.
- **320, 390, 768, and 1440 px widths passed** without horizontal overflow for the homepage, referral, How It Works, and insurance destinations. The sticky action is absent from the insurance form.
- **All six destination photographs decoded** in the network-enabled browser.
- **Original Smart Hub tutorial loaded, started paused, and advanced during muted playback** in headless Microsoft Edge. The original `/play/` URL remains the fallback. This is actual browser playback, not merely an HTTP availability check.
- **Production build passed**: Vite 7.3.7, 1,591 modules, JS 206.19 kB / 65.14 kB gzip; CSS 37.21 kB / 8.78 kB gzip.
- No uncaught browser page errors were observed; email/SMS protocol launches were intercepted during testing, so no external email/text was sent. Unit tests and browser tests use synthetic customer data.

To run new browser coverage, start Vite on localhost:5173 and use the existing Playwright runtime with `PLAYWRIGHT_MODULE` pointing to its `index.mjs`. Run `node tests/customer-updates-browser.mjs`. Set `CHECK_MEDIA=1` to include destination decoding and tutorial playback checks. Actual phone/email application behavior still needs real-device verification.

## Sources and unresolved publication checks

- [Bunny's maintained embedding documentation](https://github.com/BunnyWay/documentation/blob/main/stream/embedding.mdx) distinguishes `/embed/` from the standalone `/play/` page and documents responsive sizing. The supplied original video was retained.
- [Vivint's official referral policy](https://support.vivint.com/article/Policy-Referrals) leaves reward amounts subject to Vivint's determination and change. It does not independently establish a current $300 reward for this site. It also describes restrictions on general commercial advertising of the program. The requested copy and disclaimer were implemented as provided; **confirm the reward amount, public presentation, eligibility, and applicable program terms with Vivint before publishing**. Three $300 credits total $900; a full year depends on the customer's actual monthly rate and eligible charges and is not guaranteed by this page.
- Travel destinations and durations came from Roger's supplied brief. No fulfillment provider, full written terms, exact taxes/fees, travel dates, accommodations, booking/expiration windows, blackout dates, guest/household eligibility, cancellation conditions, or presentation requirements were supplied. These remain **unverified**. Cards solicit details only; they do not establish availability, inclusions, free travel, a confirmed booking, or corporate sponsorship. Obtain the complete approved written terms and costs before making final package promises or accepting bookings.
- Insurance savings, discounts, coverage, and approval are not promised. Quotes must come from appropriately licensed insurance professionals. Any later sharing with a partner requires a separate authorization process; the website implements no such forwarding.
- The existing preproduction company approval for transmitting service numbers/referral contact details by email remains unresolved. Confirm company-approved handling of insurance contact/address information as well. Neither approval is presumed by the implementation.

Destination photo source and license links are recorded with each entry in `src/travel.js` and exposed through the homepage credits. Sources: Wikimedia Commons files **Vegas Strip viewed from the STRAT**, **Cancun Beach**, **Ulun Danu Beratan Temple**, **Dubai Desert Dunes**, **Thailand phuket beach**, and **View of Puerto Vallarta**. No original site media URLs were removed.
