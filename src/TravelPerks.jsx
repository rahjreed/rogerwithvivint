import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, Clock3, ExternalLink, MapPin, MessageSquare, Plane, ShieldCheck } from 'lucide-react';
import { DESTINATIONS } from './travel.js';
import { PHONE_NUMBER } from './brand.jsx';
import { readVegasStart, vegasTimeLeft, VEGAS_WINDOW_MS } from './vegas-countdown.js';
import { usePwaState } from './usePwaState.js';

const vegas = DESTINATIONS.find(destination => destination.id === 'las-vegas');
function loadCountdownStart() {
  try { return readVegasStart(window.localStorage); }
  catch { return Date.now(); }
}
function Countdown({ remaining }) {
  return <div className="vegas-countdown" role="timer" aria-label="Your Las Vegas referral countdown">
    <span className="vegas-timer-title"><Clock3 size={17}/> YOUR PERSONAL 90-DAY REFERRAL WINDOW</span>
    <div className="vegas-time-grid">{[['DAYS',remaining.days],['HOURS',remaining.hours],['MIN',remaining.minutes],['SEC',remaining.seconds]].map(([label,value])=><div key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>
    <p>The countdown began when you first opened this offer on this browser. Refreshing will not restart it.</p>
  </div>;
}
export default function TravelPerks() {
  const { online, contentOutdated } = usePwaState();
  const [start] = useState(loadCountdownStart);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const interval = window.setInterval(refresh, 1000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {window.clearInterval(interval); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh);};
  }, []);
  const remaining = vegasTimeLeft(start, now);
  const eligibleToView = online && !contentOutdated;
  const rewardText = remaining.expired ? 'My local 90-day window ended. I would like to ask about current travel offers.' : 'I would like to ask about the Las Vegas featured getaway and how my referral can qualify.';
  const sms = `sms:14632813454?body=${encodeURIComponent(`Hi Roger! ${rewardText}\n\nMy name:\nMy Vivint service number (if applicable):\nMy phone number:`)}`;
  return <section className="travel-section vegas-feature content-width" aria-labelledby="travel-heading">
    <div className="travel-heading"><span className="eyebrow"><Plane size={18}/> FEATURED GETAWAY · LAS VEGAS</span><h2 id="travel-heading">Your Referral Could Take You to Vegas.</h2><p>One clear goal: refer one qualifying homeowner who becomes an eligible installed Vivint customer, and ask about a Las Vegas hotel getaway paid for by Roger.</p></div>
    <div className="vegas-feature-layout">
      <div className="vegas-image"><img src={vegas.image} alt={vegas.alt} loading="lazy"/><span><MapPin size={15}/> Las Vegas, Nevada</span></div>
      <div className="vegas-offer">
        <span className="eyebrow">A REWARD WORTH SHARING</span>
        <h3>Hotel + hotel taxes covered.*</h3>
        <p>Imagine the Bellagio fountains, Fremont Street's light show, the High Roller observation wheel, and the energy of the Las Vegas Strip.</p>
        <div className="vegas-inclusions"><div><Check size={18}/><span>Eligible promotional hotel accommodations</span></div><div><Check size={18}/><span>Included hotel taxes and mandatory resort fees</span></div><div><Plane size={18}/><span>You handle travel to Las Vegas, meals, activities and other personal expenses</span></div></div>
        <p className="vegas-terms-short">This is Roger's independently arranged customer promotion, not a Vivint corporate offer. Dates, number of hotel nights, package availability, eligibility, and any required presentations must be confirmed in writing before you rely on the offer.</p>
      </div>
    </div>
    {eligibleToView ? <>
      {remaining.expired ? <div className="vegas-ended"><Clock3 size={24}/><div><h3>Your personal 90-day countdown has ended.</h3><p>That countdown does not restart on refresh. Contact Roger to ask about any current referral or travel opportunities; no past reward is automatically awarded.</p></div></div> : <Countdown remaining={remaining}/>}
      <div className="vegas-actions"><a className="primary-button" href="#refer"><ShieldCheck size={19}/> {remaining.expired ? 'EXPLORE CURRENT REFERRAL OPTIONS' : 'INTRODUCE YOUR QUALIFYING REFERRAL'} <ArrowRight size={18}/></a><a className="secondary-button" href={sms}><MessageSquare size={18}/> TEXT ROGER ABOUT VEGAS</a></div>
    </> : <p className="pwa-unavailable">Reconnect and load the latest app to view this promotional campaign and current terms. You can still reach Roger at {PHONE_NUMBER}.</p>}
    <div className="travel-disclosure"><strong>*Important details about the featured getaway</strong><p>The proposed reward requires one qualified referral who completes an eligible installation within the relevant 90-day window; submitting a name alone does not earn a trip. The qualification and travel reward are subject to Roger confirming written program terms and any required company approval before publication or redemption.</p><p>Hotel accommodations, hotel taxes, and mandatory resort fees are the intended covered costs; airfare, ground transportation, meals, entertainment, incidentals, and other charges are not included. Exact accommodation and trip length are not yet guaranteed. No cash equivalent is promised.</p><p>Your 90-day clock is saved locally on this browser/PWA. Refreshing and reopening on the same browser retain it, but clearing site data, switching devices, or changing device time can affect it. It is <strong>not</strong> proof of eligibility or an enforceable deadline; Roger must verify referrals and any official deadlines separately. No tracking or customer account is created by this timer.</p><p>Destination photo is illustrative, not a representation of the hotel offered. <a href={vegas.source} target="_blank" rel="noopener noreferrer">Photo by {vegas.author} ({vegas.license}) <ExternalLink size={13} style={{display:'inline'}}/></a>.</p></div>
  </section>;
}
