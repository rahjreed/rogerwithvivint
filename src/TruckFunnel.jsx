import React,{useEffect,useState} from 'react';
import {ArrowRight,ArrowUpRight,Check,Clock3,Gift,LockKeyhole,MessageSquare,Phone,Plane,ShieldCheck,Sparkles,Star,Users} from 'lucide-react';
import {VivintLogo,IMG_RAHJ_PROFILE,PHONE_NUMBER,VIVINT_CORPORATE_SERVICE} from './brand.jsx';
import {DESTINATIONS} from './travel.js';
import {NEXTDOOR_REVIEW_URL} from './NextdoorReview.jsx';
import {readTruckClaim,unlockTruckClaim,truckTimeLeft,validTruckCode,TRUCK_CLAIM_MS} from './truck-funnel.js';
import {usePwaState} from './usePwaState.js';
import './truck-funnel.css';

const vegas=DESTINATIONS.find(item=>item.id==='las-vegas');
const smsBase='Hi Roger! I scanned the QR code on your Vivint truck. I want to check the 317 introductory offer and Las Vegas hotel promotion. Please confirm current eligibility, pricing, and terms.';
const smsLink=message=>'sms:1'+PHONE_NUMBER.replace(/\D/g,'')+'?body='+encodeURIComponent(message);

function Countdown({remaining}) {
 return <section className="qr-timer" aria-label="Local claim countdown">
  <span className="qr-overline"><Clock3 size={17}/> YOUR SEVEN-DAY REQUEST WINDOW</span>
  <div className="qr-timer-grid" role="timer" aria-label={remaining.days+' days, '+remaining.hours+' hours, '+remaining.minutes+' minutes, '+remaining.seconds+' seconds remaining'}>
   {[[remaining.days,'DAYS'],[remaining.hours,'HRS'],[remaining.minutes,'MIN'],[remaining.seconds,'SEC']].map(([value,label])=><div key={label}><strong>{String(value).padStart(2,'0')}</strong><small>{label}</small></div>)}
  </div>
  <p>This countdown is saved on this device. It tracks your request window, not guaranteed availability. Roger must confirm the offer and deadline.</p>
 </section>;
}
export default function TruckFunnel(){
 const {online,contentOutdated}=usePwaState();
 const [start,setStart]=useState(()=>readTruckClaim(window.localStorage));
 const [code,setCode]=useState('');
 const [error,setError]=useState('');
 const [now,setNow]=useState(()=>Date.now());
 const [justUnlocked,setJustUnlocked]=useState(false);
 useEffect(()=>{
  document.title='You Found My Truck | The 317 Exclusive | Roger With Vivint';
  const tick=()=>{setNow(Date.now());setStart(readTruckClaim(window.localStorage));};
  const interval=window.setInterval(tick,1000);
  window.addEventListener('focus',tick);
  window.addEventListener('storage',tick);
  document.addEventListener('visibilitychange',tick);
  return ()=>{window.clearInterval(interval);window.removeEventListener('focus',tick);window.removeEventListener('storage',tick);document.removeEventListener('visibilitychange',tick);};
 },[]);
 useEffect(()=>{if(!justUnlocked)return;const timeout=window.setTimeout(()=>setJustUnlocked(false),1900);return ()=>window.clearTimeout(timeout);},[justUnlocked]);
 const remaining=start?truckTimeLeft(start,now):null;
 const expired=Boolean(remaining&&remaining.expired);
 const canShowOffer=online&&!contentOutdated;
 const active=Boolean(start&&!expired&&canShowOffer);
 const message=smsBase+(start?' My local claim window ends '+new Date(start+TRUCK_CLAIM_MS).toLocaleString('en-US',{dateStyle:'medium',timeStyle:'short'})+'.':'');
 function unlock(event){
  event.preventDefault();
  setError('');
  if(!validTruckCode(code)){setError('Try an Indianapolis area code: 317 or 463.');return;}
  try{const time=unlockTruckClaim(window.localStorage,code);setStart(time);setNow(Date.now());setJustUnlocked(true);}
  catch{setError('Browser storage is needed for the seven-day request window. You can still text or call Roger below.');}
 }
 return <div className="qr-page">
  <header className="qr-header"><a href="/#home" aria-label="Roger With Vivint customer hub"><VivintLogo className="w-24 h-7 text-white"/></a><span>ROGER WITH VIVINT</span><a href={'tel:'+PHONE_NUMBER} aria-label="Call Roger"><Phone size={17}/></a></header>
  <main className="qr-main">
   <div className="qr-skyline" aria-hidden="true"><svg viewBox="0 0 320 90" fill="none"><path d="M0 84H320M12 84V65H40V84M45 84V42H76V84M81 84V56H103V84M110 84V31H144V84M153 84V47H165V84M174 84V26H181L190 5L199 26H206V84M214 84V45H244V84M250 84V34H279V84M284 84V65H310V84" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg><small>INDIANAPOLIS · YOUR LOCAL SMART HOME EXPERT</small></div>
   <span className="qr-overline"><Sparkles size={17}/> YOU SCANNED THE TRUCK. YOU FOUND ROGER.</span>
   <h1>You Found My Truck.<br/><span>Now Unlock Your 317 Special! 🚘</span></h1>
   <p className="qr-intro">You've already spotted my truck around town. Now see the special introductory monitoring offer you can ask me about directly—plus a possible Las Vegas bonus.</p>
   <section className={'qr-offer'+(active?' qr-unlocked':'')} aria-label="Truck QR offer reveal">
    <div className="qr-offer-stage">
     <div className="qr-offer-rays" aria-hidden="true"/>
     <span className="qr-reward-badge"><Gift size={17}/>{active?'YOUR OFFER IS UNLOCKED':expired?'YOUR CLAIM WINDOW ENDED':'A LOCAL REWARD FOR FINDING MY TRUCK'}</span>
     {canShowOffer&&!expired?<><p className="qr-stage-label">{active?'INTRODUCTORY MONITORING RATE':'ENTER AN INDIANAPOLIS AREA CODE TO REVEAL THE OFFER'}</p>
      {active?<><div className={'qr-number'+(justUnlocked?' qr-pop':'')}>$3.65<small>/mo</small></div><strong className="qr-six-months">FOR THE FIRST SIX MONTHS*</strong></>:<div className="qr-mystery"><LockKeyhole size={44}/><strong>SPECIAL RATE LOCKED</strong></div>}
     </>:<><p className="qr-stage-label">{expired?'THE SEVEN-DAY WINDOW HAS PASSED':'CURRENT OFFERS TEMPORARILY UNAVAILABLE'}</p><h2>{expired?'Contact Roger for today’s options':'Check back when online'}</h2></>}
    </div>
    {canShowOffer&&!start&&<form className="qr-unlock-form" onSubmit={unlock}><label htmlFor="qr-local-code">🔑 What’s Indianapolis’s area code?</label><input id="qr-local-code" inputMode="numeric" autoComplete="off" maxLength={3} placeholder="Enter 317 or 463" value={code} onChange={e=>{setCode(e.target.value);setError('');}}/><button className="qr-primary" type="submit"><LockKeyhole size={18}/> UNLOCK THE LOCAL SPECIAL</button>{error&&<p role="alert" className="qr-error">{error}</p>}</form>}
    {active&&<div className="qr-offer-summary"><p><Check size={18}/> Eligible new customers · introductory monitoring*</p><p><Check size={18}/> Ask about month-to-month monitoring availability*</p><a className="qr-primary" href={smsLink(message)}><MessageSquare size={18}/> TEXT ROGER TO CHECK ELIGIBILITY</a></div>}
    <p className="qr-disclaimer">*The $3.65/month monitoring rate for six months is a conditional introductory offer, not a complete system price or guaranteed entitlement. Standard rates apply afterward. Equipment, installation, activation, and other fees may apply. Any cancellation rights and equipment payment obligations depend on your approved agreement. Roger confirms current availability, location, full terms, and eligibility.</p>
   </section>
   {active&&<Countdown remaining={remaining}/>}
   {active&&vegas&&<section className="qr-vegas">
    <img src={vegas.image} alt={vegas.alt}/>
    <div className="qr-vegas-body"><span className="qr-overline"><Plane size={17}/> POTENTIAL NEW-CUSTOMER TRAVEL BONUS</span><h2>Las Vegas Is Calling. 🎰</h2>
     <p>Ask whether your completed, qualifying new Vivint installation makes you eligible for a promotional Las Vegas hotel stay. No referral is required for the hotel offer.</p>
     <div className="qr-vegas-extra"><Gift size={24}/><div><strong>Refer a qualified friend, and ask about hotel-tax help.</strong><p>If your referral completes an eligible installation, Roger may cover qualifying hotel taxes. Get the exact conditions in writing.</p></div></div>
     <p className="qr-travel-terms">Hotel resort fees and taxes may apply; travel, airfare, meals, and incidentals aren't included. Dates, stay length, availability, eligibility, and any presentation requirements must be confirmed in writing. Independent promotion arranged by Roger, not Vivint corporate.</p>
    </div>
   </section>}
   <section className="qr-convert" aria-labelledby="qr-convert-heading"><span className="qr-overline"><MessageSquare size={17}/> YOUR NEXT MOVE</span><h2 id="qr-convert-heading">Talk to the Guy Behind the Truck. 📲</h2><p>No demo signup or forms that go nowhere. Text me directly and I'll personally check which current offers fit your home.</p><a className="qr-primary" href={smsLink(message)}><MessageSquare size={18}/> TEXT ROGER ABOUT MY OPTIONS <ArrowRight size={18}/></a><a className="qr-secondary" href={'tel:'+PHONE_NUMBER}><Phone size={18}/> CALL ROGER · {PHONE_NUMBER}</a><small>Your messaging app prepares a message. Nothing is sent until you press Send. Calling or texting doesn't enroll you in an offer.</small></section>
   <section className="qr-trust"><img src={IMG_RAHJ_PROFILE} alt="Roger Reed, Vivint Smart Home Expert"/><div><span className="qr-overline"><ShieldCheck size={17}/> A REAL LOCAL TECHNICIAN</span><h2>Meet Roger Reed.</h2><strong>3,000+ security installations</strong><p>I'm the one who installs these systems—not just someone reading a sales script. I'll help you understand the equipment, costs, and installation before you decide.</p><div className="qr-trust-links"><a href="/#meet">Read customer experiences <ArrowUpRight size={15}/></a><a href={NEXTDOOR_REVIEW_URL} target="_blank" rel="noopener noreferrer"><Star size={15}/> Nextdoor reviews <ArrowUpRight size={15}/></a></div></div></section>
   <footer className="qr-footer"><p>The truck QR offer is intended for prospective new customers. Unlocking a code or seeing a countdown does not establish offer eligibility or guarantee a hotel stay. For existing Vivint service, billing, or technical assistance, contact Vivint Corporate at <a href={'tel:'+VIVINT_CORPORATE_SERVICE}>{VIVINT_CORPORATE_SERVICE}</a>.</p><a href="/#home">Explore Roger's Customer Hub <ArrowUpRight size={14}/></a></footer>
  </main>
  <div className="qr-sticky"><a href={smsLink(message)}><MessageSquare size={18}/> TEXT ROGER · CHECK MY OFFER</a></div>
 </div>;
}
