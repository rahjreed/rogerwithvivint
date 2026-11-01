export const REFERRAL_EMAIL = 'roger.reed@vivint.com';
export const CONTACT_METHODS = ['Call & Group Text', 'Phone Call', 'Text Message', 'Call & Text'];
export const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

export function createReferral() {
  return { id: crypto.randomUUID(), name: '', phone: '', city: '', state: '', method: CONTACT_METHODS[0] };
}

export function updateReferral(entries, id, field, value) {
  return entries.map(entry => entry.id === id ? { ...entry, [field]: value } : entry);
}

export function removeReferral(entries, id) {
  const remaining = entries.filter(entry => entry.id !== id);
  return remaining.length ? remaining : [createReferral()];
}

export function phoneIsValid(phone) {
  const digits = phone.replace(/\D/g, '');
  return /^\+?[\d\s().-]+$/.test(phone.trim()) && (digits.length === 10 || (digits.length === 11 && digits.startsWith('1')));
}

export function contactScript(customer, entry) {
  const friend = entry.name.trim() || '[Friend]';
  const name = customer.name.trim() || '[Customer]';
  const intro = `Hey ${friend}, this is Roger with Vivint. I just finished installing ${name}'s new smart home security system. They thought you might appreciate learning about what we offer.`;
  const endings = {
    'Call & Group Text': 'I wanted to introduce myself in a group text with them and see if you would be interested in a quick conversation.',
    'Phone Call': 'I am calling to introduce myself. Is now a good time for a quick conversation about smart home protection?',
    'Text Message': 'I wanted to introduce myself by text. Would you like to learn more about smart home protection?',
    'Call & Text': 'I wanted to introduce myself by phone and follow up by text so you have my contact information. Would you be interested in a quick conversation?',
  };
  return `${intro} ${endings[entry.method]}`;
}

export function buildEmail(customer, entries) {
  // Subject values stay on one line; the body intentionally preserves line breaks.
  const subjectName = customer.name.trim().replace(/[\r\n]+/g, ' ');
  const subject = `New Vivint Referrals — ${subjectName} — ${entries.length} Friends`;
  const body = [
    'NEW VIVINT CUSTOMER REFERRALS', '', 'EXISTING CUSTOMER',
    `Name: ${customer.name.trim()}`, `Vivint Service Number: ${customer.service.trim()}`, '',
    `TOTAL REFERRALS: ${entries.length}`, '',
    ...entries.flatMap((entry, index) => [
      `REFERRAL #${index + 1}`, `Name: ${entry.name.trim()}`, `Phone: ${entry.phone.trim()}`,
      `City: ${entry.city.trim()}`, `State: ${entry.state}`, `Preferred Contact: ${entry.method}`, '',
    ]),
  ].join('\r\n');
  return { subject, body, url: `mailto:${REFERRAL_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}

export function copyDetailsText(email) {
  return `To: ${REFERRAL_EMAIL}\nSubject: ${email.subject}\n\n${email.body}`;
}
