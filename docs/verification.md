# Redesign verification

This report records the initial redesign. See [customer-updates.md](customer-updates.md) for the subsequent resources, tutorial, travel, rewards, insurance changes, current build, 15-test result, and remaining publication checks.

Implementation branch: `codex-development`. No commit, push, merge, deployment, domain change, backend, or outbound message was performed.

## Results

| Check | Result | Evidence / scope |
| --- | --- | --- |
| Unit tests | PASS — 11 tests | Node native test runner; 1, 3, 10, and 100 referrals; complete encoded email round-trip; stable IDs and independent edits; removal; script variants; phone validation; full copy text; header newline handling; Clipboard API and fallback success/failure. |
| Production build | PASS | Vite 7.3.7; 1,585 modules; final JS 191.66 kB (60.73 kB gzip); CSS 31.80 kB (7.60 kB gzip). Existing production configuration unchanged. |
| Browser flow | PASS | Headless Microsoft Edge; actual React interface; completed entries, incomplete/whitespace/invalid-phone rejection, 1/3/10 entries, customer/entry preservation across navigation, independent contact methods, deletion/renumbering, review/edit, special characters and line breaks in mailto, actual browser clipboard, manual-copy fallback, and no false sent notification. |
| Responsive layout | PASS | 320, 390, 768, and 1440 px viewport widths across all six hub sections; no horizontal overflow detected. Referral sticky action absent from both forms; native product/review/offer dialogs open/close and Escape dismisses. Desktop/mobile screenshots visually reviewed. |
| Browser errors | PASS | No uncaught page errors during the browser checks. |
| Data handling | PASS within inspected implementation | React state only, no form-data network submission, local/session storage, analytics, or console logging. Browser network capture did not contain synthetic referral/customer values. |
| Image rendering | PASS | Original profile, all five review images, and all six product images successfully decoded in the browser with external network access. |
| Media endpoint availability | PASS | All 20 original media URL variants returned HTTP 200, including original image and video-embed URLs. This checks endpoint availability, not full audiovisual playback. |
| Whitespace / patch check | PASS | `git diff --check`. |

Browser protocol handling was simulated by preventing the final mailto navigation and inspecting its fully populated recipient, subject, and body. No external email application was launched and no email or text was sent. The email link and copy details are not truncated, and longer links show a copy-fallback notice.

No existing test/lint suite was present; a dependency-free unit suite and a browser verification script were added. Build/testing used the bundled Node executable and existing dependency ranges. No application dependencies or package-manager/deployment configuration changes were introduced.

The sandbox initially blocked package/network access and bundler path reads. Existing dependencies installed using Windows system certificate trust; build and media checks succeeded with the required external permissions. No TLS verification was disabled. The first sandboxed screenshot could not load the profile; the subsequent network-enabled run decoded all expected images successfully.

## Remaining release checks

- Confirm Vivint/company authorization for transmitting the customer service number and third-party phone numbers via the customer's email app before production release.
- Confirm current offers, inventory, detailed specifications, commissions, and approved partner assets before restoring their archived claims. No such unverified claims are active in the current interface.
- Test actual mailto handling and long-link behavior in supported iOS/Android email apps, mobile keyboard interactions, and audiovisual playback. Headless desktop viewport tests do not establish real-device compatibility or email delivery.
- The partner handoff is public and intentionally has no pretend authentication. Any future private partner materials require a separate secure authentication decision.

Full file inventory and feature notes are in the repository README.
