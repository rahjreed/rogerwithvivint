import React, { useRef, useState } from 'react';
import { Copy, Mail, ShieldCheck } from 'lucide-react';
import { copyText } from './clipboard.js';
import { copyDetailsText, STATES } from './referrals.js';
import { buildInsuranceEmail, emptyInsuranceRequest, insuranceErrors } from './insurance.js';

const FIELDS = [
  { name: 'name', label: 'Full name', autoComplete: 'name' },
  { name: 'phone', label: 'Phone number', type: 'tel', inputMode: 'tel', autoComplete: 'tel' },
  { name: 'email', label: 'Email address', type: 'email', inputMode: 'email', autoComplete: 'email', wide: true },
  { name: 'street', label: 'Property/service street address', autoComplete: 'street-address', wide: true },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  { name: 'state', label: 'State', autoComplete: 'address-level1' },
  { name: 'zip', label: 'ZIP code', inputMode: 'numeric', autoComplete: 'postal-code', placeholder: '46204 or 46204-1234' },
];

export default function InsuranceForm() {
  const [details, setDetails] = useState(emptyInsuranceRequest);
  const [prepared, setPrepared] = useState(false);
  const [manualCopy, setManualCopy] = useState(false);
  const [notice, setNotice] = useState('');
  const form = useRef(null);
  const emailLink = useRef(null);
  const email = buildInsuranceEmail(details);

  function validate() {
    const errors = insuranceErrors(details);
    for (const field of FIELDS) form.current.elements.namedItem(field.name).setCustomValidity(errors[field.name] || '');
    return form.current.reportValidity();
  }

  function openEmail(event) {
    event.preventDefault();
    if (!validate()) return;
    setPrepared(true);
    setNotice('Email app requested. Review the complete draft and send it there. This website has not submitted a request and cannot confirm delivery.');
    emailLink.current.click();
  }

  async function copy() {
    if (!validate()) return;
    setPrepared(true);
    const success = await copyText(copyDetailsText(email));
    setNotice(success ? 'Details copied. Paste them into an email to roger.reed@vivint.com, review, and send when ready.' : 'Copy is unavailable. Select and copy the complete details below.');
    setManualCopy(!success);
  }

  return <div className="narrow-width section-padding insurance-workspace">
    <div className="section-intro"><span className="eyebrow"><ShieldCheck size={20} /> A LITTLE MORE PEACE OF MIND</span><h1>Save on Home Insurance</h1><p>Your smart home may be eligible for insurance discounts. Request a complimentary review to explore your options.</p></div>
    <div className="insurance-disclosure"><p>Discounts, savings, and coverage approval are not guaranteed. Insurance quotes are provided by appropriately licensed insurance professionals, not by Vivint.</p><p>This request is addressed to Roger Reed. This website does not forward your information to an insurance partner. Any later sharing with a partner requires your separate authorization.</p></div>
    <p className="privacy-note">Only enter your contact information and property address. Do not include Social Security numbers, dates of birth, policy numbers, or other sensitive information. Form entries stay in this page’s memory and are cleared when you refresh or leave the site.</p>
    <form ref={form} onSubmit={openEmail} noValidate className="form-card" onInput={event => { event.target.setCustomValidity?.(''); setPrepared(false); setManualCopy(false); setNotice(''); }}>
      <h2>Your savings review request</h2><p className="field-hint">All fields are required. No request is sent by this website.</p>
      <div className="form-grid">{FIELDS.map(field => <div key={field.name} className={field.wide ? 'full-width' : undefined}>
        <label htmlFor={`insurance-${field.name}`}>{field.label}</label>
        {field.name === 'state' ? <select id="insurance-state" name="state" required autoComplete={field.autoComplete} value={details.state} onChange={event => setDetails({ ...details, state: event.target.value })}><option value="">Select a state</option>{STATES.map(state => <option key={state}>{state}</option>)}</select> : <input id={`insurance-${field.name}`} name={field.name} required type={field.type || 'text'} inputMode={field.inputMode} autoComplete={field.autoComplete} placeholder={field.placeholder} value={details[field.name]} onChange={event => setDetails({ ...details, [field.name]: event.target.value })} />}
      </div>)}</div>
      <div className="insurance-actions"><button type="submit" className="primary-button"><Mail size={18} /> Open Email to Request Savings Review</button><button type="button" className="secondary-button" onClick={copy}><Copy size={18} /> Copy Details</button></div>
      <a ref={emailLink} href={email.url} hidden aria-hidden="true" tabIndex={-1}>Open insurance email draft</a>
      <p className="field-hint">Your email app opens a draft to roger.reed@vivint.com. You decide when to send. If the app does not open or the draft is incomplete, use Copy Details.</p>
      <p role="status" className="form-notice">{notice}</p>
      {prepared && <details className="email-preview" open={manualCopy || undefined}><summary>View complete insurance request</summary><textarea aria-label="Complete insurance request email" readOnly rows={14} value={copyDetailsText(email)} onFocus={event => event.target.select()} /></details>}
    </form>
    <a className="text-button" href="#home">← Back to the customer hub</a>
  </div>;
}
