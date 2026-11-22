import React, {useEffect, useState} from 'react';
import {Clock3} from 'lucide-react';
import './referral-countdown.css';

// January 20, 2027, 12:00 a.m. Eastern Standard Time (Indiana).
export const REFERRAL_PROMO_END = Date.parse('2027-01-20T05:00:00Z');
export const referralPromoActive = (now = Date.now()) => now < REFERRAL_PROMO_END;
export const currentReferralCredit = (now = Date.now()) => referralPromoActive(now) ? 300 : 200;

function remainingParts(now) {
 const delta = Math.max(0, REFERRAL_PROMO_END - now);
 const days = Math.floor(delta / 86400000);
 const hours = Math.floor((delta % 86400000) / 3600000);
 const minutes = Math.floor((delta % 3600000) / 60000);
 const seconds = Math.floor((delta % 60000) / 1000);
 return [days,hours,minutes,seconds];
}
export default function ReferralCountdown({now}) {
 const active=referralPromoActive(now);
 const parts=remainingParts(now);
 return <div className={'referral-countdown'+(active?'':' referral-countdown-ended')}>
  <div className="referral-countdown-heading"><Clock3 size={21} aria-hidden="true"/><div><strong>{active?'$300 REFERRAL BONUS ENDS JANUARY 20':'$300 REFERRAL BONUS HAS ENDED'}</strong><span>{active?'The qualified-referral credit is scheduled to return to $200 on January 20, 2027 at 12:00 a.m. Eastern.':'The advertised referral credit is now $200 per qualified referral.'}</span></div></div>
  {active&&<div className="referral-countdown-units" role="timer" aria-label={parts[0]+' days, '+parts[1]+' hours, '+parts[2]+' minutes, '+parts[3]+' seconds remaining'}>{parts.map((value,i)=><div className="referral-countdown-unit" key={i}><strong>{String(value).padStart(2,'0')}</strong><span>{['DAYS','HOURS','MIN','SEC'][i]}</span></div>)}</div>}
  <small>Referral rewards are subject to Vivint’s current program terms, qualification, approval, and changes. Confirm the offer with Roger before relying on it.</small>
 </div>;
}
