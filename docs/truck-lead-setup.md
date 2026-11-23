# Truck QR funnel: live lead delivery setup

The `/truck` preview uses a three-step journey:
1. Tap to reveal the conditional introductory monitoring offer.
2. Submit name, phone, email, ZIP code and required one-time follow-up permission.
3. **Only after the server confirms an email-service acceptance**, show the direct call/text controls.

The independent Las Vegas promotion and seven-day local countdown remain subject to actual eligibility and confirmed terms.

## Activation required before merging to production

This project currently has **no Vercel environment variables configured**. The form intentionally returns HTTP 503 and **does not unlock the contact options** until delivery is configured. Do not claim that preview submissions are being captured.

Use a Resend account with a verified sender domain, then set these **server-side** Vercel environment variables in the RogerWithVivint Vercel project:
- `RESEND_API_KEY`: private API key. Never use a `VITE_` prefix or put it in GitHub source.
- `TRUCK_LEAD_FROM_EMAIL`: a verified sender address, e.g. `Truck QR Leads <leads@your-verified-domain.example>`.
- `TRUCK_LEAD_TO_EMAIL`: Roger's destination mailbox, confirmed by the owner.

Set for Preview and Production once verified. Redeploy the branch after adding variables. The Vercel function `api/truck-lead.js` forwards a text email to the configured inbox using Resend's API. The confirmation means Resend accepted the message; verify actual mailbox delivery and spam filtering during real testing.

## Required verification

1. Open the preview in a fresh browser or fresh site storage and tap **Reveal My Truck Special**.
2. Confirm no direct Roger call/text buttons appear before the form.
3. Complete the form with a real inbox and phone, consent to follow-up, leave marketing consent unchecked. Verify the email arrives at the configured destination and notes marketing consent = No.
4. Confirm the success screen and call/text actions appear only after the confirmed API response. Verify both links on Android and iPhone.
5. Try an invalid ZIP/phone/email, blank consent, and unavailable email service. Verify there is no false success or premature call/text access.
6. Check mobile layout, Vegas disclosures, countdown persistence, and that `/holiday` and `/tiktok` were unaffected.

Privacy: customer details are transmitted by HTTPS and forwarded to the configured inbox; this implementation does not keep them in a database, does not subscribe customers to a list, and does not automatically send SMS. Marketing consent is recorded in the emailed lead but is not permission to contact users for campaigns without compliance review. There is currently no durable lead database, anti-abuse rate limiter, consent timestamp audit log, or confirmed-delivery webhook. These should be assessed before high-volume marketing use. A browser-side claim timer is not a provider-guaranteed deadline.
