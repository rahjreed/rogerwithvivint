import { REFERRAL_EMAIL, STATES, phoneIsValid } from './referrals.js';

export const emptyInsuranceRequest = () => ({ name: '', phone: '', email: '', street: '', city: '', state: '', zip: '' });

export function insuranceErrors(details) {
  const errors = {};
  for (const field of Object.keys(emptyInsuranceRequest())) {
    if (!details[field]?.trim()) errors[field] = 'Please complete this field.';
  }
  if (details.phone && !phoneIsValid(details.phone)) errors.phone = 'Enter a 10-digit US phone number, optionally starting with +1.';
  if (details.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) errors.email = 'Enter a valid email address.';
  if (details.state && !STATES.includes(details.state)) errors.state = 'Select a US state.';
  if (details.zip && !/^\d{5}(-\d{4})?$/.test(details.zip.trim())) errors.zip = 'Enter a 5-digit ZIP or ZIP+4 code.';
  return errors;
}

export function buildInsuranceEmail(details) {
  const clean = Object.fromEntries(Object.entries(details).map(([key, value]) => [key, value.trim()]));
  const subject = `Insurance Savings Request — ${clean.name.replace(/[\r\n]+/g, ' ')}`;
  const body = ['HOME INSURANCE SAVINGS REQUEST', '', `Customer Name: ${clean.name}`, `Phone: ${clean.phone}`, `Email: ${clean.email}`, '', 'PROPERTY ADDRESS', `Street: ${clean.street}`, `City: ${clean.city}`, `State: ${clean.state}`, `ZIP: ${clean.zip}`, '', 'Request: Home insurance savings review.'].join('\r\n');
  return { subject, body, url: `mailto:${REFERRAL_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}
