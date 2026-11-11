import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy, Mail, Plus, Trash2, Users } from 'lucide-react';
import { buildEmail, CONTACT_METHODS, contactScript, copyDetailsText, createReferral, phoneIsValid, removeReferral, STATES, updateReferral } from './referrals.js';
import { copyText } from './clipboard.js';
import { usePwaState } from './usePwaState.js';

export default function ReferralForm() {
  const { online, contentOutdated } = usePwaState();
  const [customer, setCustomer] = useState({ name: '', service: '' });
  const [entries, setEntries] = useState(() => [createReferral()]);
  const [reviewing, setReviewing] = useState(false);
  const [notice, setNotice] = useState('');
  const [manualCopy, setManualCopy] = useState(false);
  const heading = useRef(null);
  const form = useRef(null);
  const email = buildEmail(customer, entries);
  // Mail clients differ in URL limits. This threshold only suggests the fallback;
  // it never truncates the email or limits the number of referrals.
  const longEmail = email.url.length > 1800;
  const focusHeading = () => requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
  const edit = () => { setReviewing(false); setNotice(''); setManualCopy(false); focusHeading(); };
  const update = (id, field, value) => setEntries(previous => updateReferral(previous, id, field, value));

  function addFriend() {
    const entry = createReferral();
    setEntries(previous => [...previous, entry]);
    setNotice('Another friend added.');
    requestAnimationFrame(() => document.getElementById(`friend-${entry.id}`)?.focus());
  }

  function removeFriend(id, index) {
    const remaining = removeReferral(entries, id);
    setEntries(remaining);
    setNotice(`Referral #${index + 1} removed.`);
    requestAnimationFrame(() => document.getElementById(`friend-${remaining[Math.min(index, remaining.length - 1)].id}`)?.focus());
  }

  function review(event) {
    event.preventDefault();
    for (const input of form.current.querySelectorAll('input[type="tel"]')) {
      input.setCustomValidity(phoneIsValid(input.value) ? '' : 'Enter a 10-digit US phone number, optionally starting with +1.');
    }
    if (!form.current.reportValidity()) return;
    const whitespaceOnly = [...form.current.querySelectorAll('input[required]')].find(input => !input.value.trim());
    if (whitespaceOnly) {
      whitespaceOnly.setCustomValidity('Please enter a value, not only spaces.');
      whitespaceOnly.reportValidity();
      return;
    }
    setReviewing(true);
    setNotice('');
    focusHeading();
  }

  async function copy() {
    const success = await copyText(copyDetailsText(email));
    setNotice(success ? 'Referral details copied. Paste them into your email and send when ready.' : 'Copy is unavailable. Select and copy the details below manually.');
    setManualCopy(!success);
  }

  return (
    <div className="referral-workspace">
      {online && !contentOutdated ? <aside className="referral-rewards" aria-labelledby="referral-rewards-heading"><span className="eyebrow">SHARE THE EXPERIENCE</span><h2 id="referral-rewards-heading">Earn $300 Toward Your Vivint Bill for Every Qualified Referral!</h2><p>Love your new Vivint system? Share the experience with friends and family! Each qualified referral that results in an eligible installation could earn you a $300 credit toward your Vivint bill. Just three successful referrals could potentially cover an entire year of monitoring service, depending on your monthly rate!</p><small>Referral credits are subject to Vivint's official referral program terms, eligibility requirements, and applicable limits. Credits are not guaranteed until approved.</small><a href="https://support.vivint.com/article/Policy-Referrals" target="_blank" rel="noopener noreferrer">View official referral program terms ↗</a></aside> : <p className="pwa-unavailable">Current referral reward terms require an online, up-to-date app. Finish or copy any entries before reloading; entries already on this page remain in memory.</p>}
      <div className="step-bar" aria-label="Referral progress"><span className={!reviewing ? 'current' : ''}>01 · Add your friends</span><span className={reviewing ? 'current' : ''}>02 · Review & email</span></div>
      <div className="section-intro"><span className="eyebrow">A PERSONAL INTRODUCTION</span><h2 ref={heading} tabIndex={-1}>{reviewing ? 'Review your introductions.' : 'Good neighbors. Safer homes.'}</h2><p>{reviewing ? 'Check the details and contact scripts before opening your email app.' : 'Know someone who would appreciate a smarter, more protected home? Introduce them to Roger.'}</p></div>
      <p className="privacy-note">Your details stay in this page’s memory until you choose to open or copy the email. Leaving this page or refreshing clears the form.</p>
      {!reviewing ? (
        <form ref={form} onSubmit={review} onInput={event => event.target.setCustomValidity?.('')}>
          <fieldset className="form-card"><legend><span className="step-icon"><Users size={18} /></span> Your information</legend><p className="field-hint">Enter this once. It will accompany all your referrals. All fields are required unless marked optional.</p><div className="form-grid">
            <label>Your full name<input required autoComplete="name" value={customer.name} onChange={event => setCustomer({ ...customer, name: event.target.value })} /></label>
            <div><label htmlFor="customer-service">Vivint service number</label><input id="customer-service" required autoComplete="off" value={customer.service} onChange={event => setCustomer({ ...customer, service: event.target.value })} aria-describedby="service-help" /><small id="service-help">Use the service number associated with your Vivint account.</small></div>
          </div></fieldset>
          {entries.map((entry, index) => (
            <fieldset key={entry.id} className="form-card friend-card"><legend>Referral #{index + 1}</legend><div className="friend-toolbar"><span>FRIEND OR FAMILY</span><button type="button" className="text-button" onClick={() => removeFriend(entry.id, index)} aria-label={`Remove referral ${index + 1}`}><Trash2 size={16} /> Remove</button></div>
              <div className="form-grid">
                <label>Friend’s full name<input id={`friend-${entry.id}`} required autoComplete="off" value={entry.name} onChange={event => update(entry.id, 'name', event.target.value)} /></label>
                <label>Phone number<input required type="tel" inputMode="tel" autoComplete="off" placeholder="(555) 000-0000" value={entry.phone} onChange={event => { event.target.setCustomValidity(''); update(entry.id, 'phone', event.target.value); }} onBlur={event => { event.target.setCustomValidity(!entry.phone || phoneIsValid(entry.phone) ? '' : 'Enter a 10-digit US phone number, optionally starting with +1.'); }} /></label>
                <label>City<input required autoComplete="off" value={entry.city} onChange={event => update(entry.id, 'city', event.target.value)} /></label>
                <div><label htmlFor={`state-${entry.id}`}>State</label><select id={`state-${entry.id}`} required value={entry.state} onChange={event => update(entry.id, 'state', event.target.value)}><option value="">Select a state</option>{STATES.map(state => <option key={state}>{state}</option>)}</select></div>
                <div className="full-width"><label htmlFor={`method-${entry.id}`}>Preferred contact method</label><select id={`method-${entry.id}`} value={entry.method} onChange={event => update(entry.id, 'method', event.target.value)}>{CONTACT_METHODS.map((method, i) => <option key={method} value={method}>{method}{i === 0 ? ' — Recommended' : ''}</option>)}</select></div>
              </div>
              <details className="script-preview"><summary>Preview Roger’s {entry.method.toLowerCase()} introduction</summary><p>{contactScript(customer, entry)}</p></details>
            </fieldset>
          ))}
          <button type="button" onClick={addFriend} className="add-friend"><Plus size={20} /> ADD ANOTHER FRIEND</button>
          <div className="form-actions"><p>One email. All {entries.length} {entries.length === 1 ? 'introduction' : 'introductions'}.<br /><span>You’ll review everything first.</span></p><button className="primary-button" type="submit">REVIEW REFERRALS <ArrowRight size={18} /></button></div>
        </form>
      ) : (
        <div className="review-panel">
          <div className="form-card"><h3>Existing customer</h3><dl className="review-details"><div><dt>Name</dt><dd>{customer.name}</dd></div><div><dt>Vivint service number</dt><dd>{customer.service}</dd></div></dl></div>
          {entries.map((entry, index) => <article className="form-card" key={entry.id}><h3>Referral #{index + 1} · {entry.name}</h3><dl className="review-details"><div><dt>Phone</dt><dd>{entry.phone}</dd></div><div><dt>Location</dt><dd>{entry.city}, {entry.state}</dd></div><div><dt>Preferred contact</dt><dd>{entry.method}</dd></div></dl><div className="script-preview"><h4>Contact script preview</h4><p>{contactScript(customer, entry)}</p></div></article>)}
          <p className="field-hint">These are suggested introductions for Roger’s personal follow-up. No calls or texts are sent by this form. A selected contact method does not establish the friend’s permission for marketing contact.</p>
          <div className="email-card"><span className="eyebrow">READY WHEN YOU ARE</span><h3>{entries.length} {entries.length === 1 ? 'friend' : 'friends'}, one email.</h3><p>To: roger.reed@vivint.com</p><p>Your email app will open a draft. You must send it there. This page cannot confirm delivery.</p>{longEmail && <p className="email-warning">This email may exceed your email app’s link limit. If the draft is incomplete, use Copy Referral Details to paste the complete message into an email to Roger.</p>}<a className="primary-button" href={email.url} onClick={() => setNotice('Email app requested. Check the recipient and complete message, then send it in your email app. Nothing has been sent by this page.')}><Mail size={18} /> OPEN EMAIL TO SEND REFERRALS</a><button type="button" className="secondary-button" onClick={copy}><Copy size={18} /> Copy Referral Details</button></div>
          <button type="button" className="text-button" onClick={edit}><ArrowLeft size={18} /> Back to edit referrals</button>
          <details className="email-preview" open={manualCopy || undefined}><summary>View complete email details</summary><textarea aria-label="Complete referral email" readOnly value={copyDetailsText(email)} onFocus={event => event.target.select()} rows={14} /></details>
        </div>
      )}
      <p role="status" className="form-notice">{notice && <><Check size={16} /> {notice}</>}</p>
    </div>
  );
}
