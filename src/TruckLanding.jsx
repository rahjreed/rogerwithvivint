import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Award, Check, Copy, HeartHandshake, Home, MessageSquare, Phone, Plane, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { IMG_RAHJ_PROFILE, INSTAGRAM_URL, TIKTOK_URL, PHONE_NUMBER, VIVINT_CORPORATE_SERVICE, VivintLogo, InstagramIcon, TikTokIcon } from './brand.jsx';
import MeetRoger from './MeetRoger.jsx';
import ProductGallery from './ProductGallery.jsx';
import Modal from './Modal.jsx';
import { copyText } from './clipboard.js';
import { TRUCK_SMS_MESSAGE, TRUCK_SMS_URL, TRUCK_TITLE } from './truck.js';
import { HOLIDAY_SMS_MESSAGE, HOLIDAY_SMS_URL, HOLIDAY_TITLE, getHolidayCountdown } from './holiday.js';
import './truck.css';
import { usePwaState } from './usePwaState.js';

const DIFFERENCES = [
  [Award, 'Experience you can lean on', 'Over 3,000 home security installations. Practical experience, brought right to your front door.'],
  [Home, 'A plan for your actual home', 'Hands-on knowledge of system design, camera placement, and the equipment that fits your space.'],
  [HeartHandshake, 'The person behind the installation', 'Personal attention from someone who actually installs the systems, not an anonymous point of contact.'],
  [MessageSquare, 'One direct conversation', 'Talk with Roger about your priorities and understand your options before choosing a setup.'],
  [Sparkles, 'Clarity on what’s available', 'Help understanding equipment and eligible promotions, with current terms confirmed before you decide.'],
  [Users, 'A connection beyond installation day', 'A familiar contact for installation follow-up and future introductions, with official Vivint support for account and billing needs.'],
];

function TextLink({ children, className = 'primary-button', onClick, href = TRUCK_SMS_URL }) {
  return <a className={className} href={href} onClick={onClick}><MessageSquare size={18} />{children}</a>;
}

export default function TruckLanding({ holiday = false }) {
  const { online, contentOutdated } = usePwaState();
  const [holidayNow, setHolidayNow] = useState(() => Date.now());
  const holidayCountdown = getHolidayCountdown(holidayNow);
  const smsUrl = holiday ? HOLIDAY_SMS_URL : TRUCK_SMS_URL;
  const smsMessage = holiday ? HOLIDAY_SMS_MESSAGE : TRUCK_SMS_MESSAGE;
  const ContactLink = props => <TextLink {...props} href={smsUrl} />;
  useEffect(() => {
    if (!holiday) return;
    const refresh = () => setHolidayNow(Date.now());
    const interval = window.setInterval(refresh, 1000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => { window.clearInterval(interval); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); };
  }, [holiday]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [notice, setNotice] = useState('');
  const [manualCopy, setManualCopy] = useState(false);
  const contactLink = useRef(null);
  const main = useRef(null);
  useEffect(() => { document.title = holiday ? HOLIDAY_TITLE : TRUCK_TITLE; }, [holiday]);
  const contact = () => contactLink.current?.click();
  async function copyStarter() {
    const copied = await copyText(`To: ${PHONE_NUMBER}\n\n${smsMessage}`);
    setNotice(copied ? 'Message copied. Paste it into your text app and send it to Roger when ready.' : 'Copy is unavailable. Select and copy the message below.');
    setManualCopy(!copied);
  }
  return <div className="truck-page">
    <a className="skip-link" href="#truck-main" onClick={event => { event.preventDefault(); main.current?.focus(); }}>Skip to content</a>
    <header className="truck-header"><div className="truck-width truck-header-inner"><a className="truck-brand" href="/#home" aria-label="Roger with Vivint customer hub"><VivintLogo className="w-24 h-7 text-white" /><span>ROGER REED<small>SMART HOME EXPERT</small></span></a><nav aria-label={holiday ? "Holiday page navigation" : "Truck page navigation"}><a href="#truck-meet">Meet Roger</a><a href="#truck-options">Your options</a></nav><a className="truck-call" href={`tel:${PHONE_NUMBER}`} aria-label={`Call Roger at ${PHONE_NUMBER}`}><Phone size={17} /><span>{PHONE_NUMBER}</span></a></div></header>
    <main id="truck-main" tabIndex={-1} ref={main}>
      {holiday ? <section className="holiday-invitation truck-width" aria-labelledby="holiday-heading">
        <div className="holiday-award-heading"><span className="holiday-award-icon"><Sparkles size={28} /></span><span className="truck-eyebrow">A SPECIAL HOLIDAY INVITATION FROM ROGER WITH VIVINT</span>
          <h1 id="holiday-heading">Congratulations!<br /><span>You've Been Nominated.</span></h1>
          <p>Roger With Vivint has invited you to explore an exclusive-looking holiday opportunity to try professional home monitoring at a special introductory rate. This is a personal invitation to ask about eligibility, not a prize drawing or a guaranteed award.</p>
        </div>
        {!holidayCountdown.expired ? <>
          <div className="holiday-prize-panel">
            <span className="holiday-prize-label">YOUR HOLIDAY INTRODUCTORY OFFER</span>
            <div className="holiday-price"><strong>$3.65</strong><span>/month</span></div>
            <p className="holiday-price-duration">FOR YOUR FIRST 6 MONTHS</p>
            <div className="holiday-benefits">
              <div><Check size={20}/><strong>NO LONG-TERM MONITORING CONTRACT*</strong></div>
              <div><Check size={20}/><strong>CANCEL MONITORING ANYTIME*</strong></div>
            </div>
            <p className="holiday-price-note">Try eligible Vivint monitoring for six months at an introductory rate. Regular monitoring rates apply afterward. Equipment, installation, activation, and other fees may apply.</p>
          </div>
          <div className="holiday-timer-wrap"><div className="holiday-countdown" role="timer" aria-label="Time remaining before the holiday offer expires">
            <span className="holiday-countdown-label">YOUR HOLIDAY INVITATION EXPIRES WHEN BLACK FRIDAY BEGINS · NOV 27, 2026</span>
            <div className="holiday-countdown-grid">{[['DAYS', holidayCountdown.days], ['HOURS', holidayCountdown.hours], ['MIN', holidayCountdown.minutes], ['SEC', holidayCountdown.seconds]].map(([label, value]) => <div key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div>
            <p>Midnight Eastern on Friday, November 27, 2026</p>
          </div></div>
        </> : <div className="holiday-prize-panel holiday-expired"><h2>The Holiday Invitation Has Ended</h2><p>The limited-time $3.65 introductory offer is no longer available through this page. Roger can still explain other current Vivint options.</p></div>}
        <div className="holiday-contact">
          <h2>{holidayCountdown.expired ? 'Still Interested in Protecting Your Home?' : 'Claim the Details on Your Invitation'}</h2>
          <p>Contact Roger directly to review your eligibility, equipment options, full costs, and how to get started.</p>
          <a className="primary-button holiday-call" href={`tel:${PHONE_NUMBER}`}><Phone size={22}/> CALL ROGER · {PHONE_NUMBER}</a>
          <ContactLink>{holidayCountdown.expired ? "TEXT ROGER ABOUT CURRENT OFFERS" : "TEXT ROGER FOR HOLIDAY SPECIAL DETAILS"}</ContactLink>
          <small>*No long-term monitoring commitment and cancel-anytime flexibility apply only to eligible month-to-month service arrangements; equipment may need to be paid upfront. Cancellation is subject to your agreement, and any financed equipment balance remains payable. The $3.65 rate is conditional and is not a total system price or a guaranteed award. Roger will confirm approved pricing, eligibility, and full terms before enrollment.</small>
        </div>
        <div className="holiday-reassurance"><img src={IMG_RAHJ_PROFILE} alt="Roger Reed, Vivint Smart Home Expert" /><p><strong>Personally from Roger Reed</strong><span>Your local Smart Home Expert · 3,000+ installations</span></p></div>
      </section> : <section className="truck-hero truck-width" aria-labelledby="truck-hero-heading">
        <div className="truck-hero-copy"><span className="truck-eyebrow"><span className="truck-live-dot" /> {holiday ? "HOLIDAY 2026 · LIMITED-TIME OFFER" : "YOU SCANNED THE TRUCK. YOU FOUND ROGER."}</span><div className="truck-mobile-identity"><img src={IMG_RAHJ_PROFILE} alt="Roger Reed" /><div><strong>Roger Reed</strong><span>Vivint Smart Home Expert</span><small>3,000+ security installations</small></div><ShieldCheck size={26} /></div><h1 id="truck-hero-heading">{holiday ? <>A Holiday Special.<br /><span>A Smarter Home Starts Here.</span></> : <>You Found My Truck.<br /><span>Now Discover Why That’s a Good Thing.</span></>}</h1><h2>{holiday ? "Ask Roger About Special Introductory Pricing." : "Not Every Vivint Experience Is the Same."}</h2><p>I'm Roger Reed, a Vivint Smart Home Expert with over 3,000 security installations behind me. When you work directly with me, you're connecting with someone who understands the equipment, the installation, and how to design a security system around your actual home.</p>{holiday && <div className="holiday-countdown" role="timer" aria-label="Time until Black Friday 2026">
          <span className="holiday-countdown-label">{holidayCountdown.expired ? "THE HOLIDAY INTRODUCTORY OFFER HAS ENDED" : "COUNTDOWN TO BLACK FRIDAY · NOVEMBER 27"}</span>
          {!holidayCountdown.expired && <><div className="holiday-countdown-grid">{[['DAYS', holidayCountdown.days], ['HOURS', holidayCountdown.hours], ['MIN', holidayCountdown.minutes], ['SEC', holidayCountdown.seconds]].map(([label, value]) => <div key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></div>)}</div><p>Offer on this page ends when Black Friday begins at 12:00 a.m. Eastern on November 27, 2026.</p></>}
          {holidayCountdown.expired && <p>The $3.65 introductory promotion is no longer advertised on this page. You can still contact Roger about currently available options.</p>}
        </div>}<div className="truck-hero-actions"><ContactLink>{holiday ? "TEXT ROGER ABOUT MY HOLIDAY OPTIONS" : "UNLOCK MY OPTIONS — TEXT ROGER"}</ContactLink><a className="truck-meet-link" href="#truck-meet">MEET YOUR SMART HOME EXPERT <ArrowDown size={16} /></a></div><p className="truck-discovery">{holiday ? 'You can connect directly with me to explore eligible home security options. The limited-time introductory price is shown below while the holiday campaign is active.' : "By scanning my truck, you've found a direct connection to me, my personal approach, and promotional opportunities that may be available through my channel."}</p><span className="truck-personal-note"><Check size={15} /> Your home. A personal plan. A direct connection.</span></div>
        <div className="truck-portrait"><div className="truck-portrait-label"><ShieldCheck size={18} /> YOUR SMART HOME EXPERT</div><img src={IMG_RAHJ_PROFILE} alt="Roger Reed, Vivint Smart Home Expert" fetchPriority="high" /><div className="truck-portrait-caption"><div><span>{holiday ? "YOUR PERSONAL SMART HOME EXPERT" : "MEET THE MAN BEHIND THE TRUCK"}</span><h2>Roger Reed</h2></div><a href="#truck-meet" className="icon-button" aria-label="Get to know Roger"><ArrowUpRight /></a></div><div className="truck-install-stat"><strong>3,000+</strong><span>INSTALLATIONS.<br />REAL HANDS-ON EXPERIENCE.</span></div></div>
      </section>}
      <section className="truck-difference truck-width" aria-labelledby="truck-difference-heading"><div className="truck-section-heading"><span className="truck-eyebrow">SKIP THE GUESSWORK. START WITH EXPERIENCE.</span><h2 id="truck-difference-heading">Why Go Through the Usual Sales Process When You Can Work Directly With an Expert?</h2><p>A conversation with the person who understands what goes into making your home work better.</p></div><div className="truck-difference-grid">{DIFFERENCES.map(([Icon, title, text], index) => <article key={title}><div className="truck-benefit-number"><Icon size={22} /><span>0{index + 1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
      <section hidden={!online || contentOutdated} className="truck-options truck-width" id="truck-options" aria-labelledby="truck-options-heading"><div className="truck-options-copy"><span className="truck-eyebrow"><Sparkles size={17} /> YOUR HOME. YOUR POSSIBILITIES.</span><h2 id="truck-options-heading">{holiday && holidayCountdown.expired ? "The Holiday Introductory Special Has Ended." : "Ask About $3.65/Month for Your First 6 Months."}</h2>{holiday && holidayCountdown.expired ? <><p>The Black Friday countdown has ended. Ask Roger about today's available equipment and monitoring options.</p><ContactLink>TEXT ROGER ABOUT CURRENT OPTIONS</ContactLink></> : <><p className="truck-promo-highlight">Introductory Vivint monitoring may be available to eligible new customers for $3.65 per month for the first six months.</p>{holiday && <p><strong>No long-term monitoring contract. Cancel monitoring anytime.</strong> Applies to eligible month-to-month monitoring arrangements; equipment and cancellation terms apply.</p>}<p>Regular monitoring rates apply after six months. Equipment costs, installation charges, fees, and other terms may apply. Not every customer or installation qualifies.</p><p>Text me about your home, and I’ll confirm whether this promotion is currently available to you and explain the full pricing before you decide.</p><ContactLink>TEXT ROGER — CHECK MY ELIGIBILITY</ContactLink><small>Offer subject to current availability, eligibility, and approved terms. This price is not guaranteed for every customer or installation.</small></>}</div><div className="truck-options-card"><span className="truck-options-icon"><ShieldCheck size={36} /></span><span className="truck-eyebrow">A PERSONAL CONSULTATION</span><h3>Let’s find your fit.</h3><ul><li><Check /> Equipment chosen around your home</li><li><Check /> Guidance on placement and installation</li><li><Check /> A look at current, eligible opportunities</li><li><Check /> Clear details before you decide</li></ul><div className="truck-options-card-footer">A direct conversation with Roger.<br /><strong>No code to unlock. Just say hello.</strong></div></div></section>
      {(!online || contentOutdated) && <p className="pwa-unavailable truck-width">Connect and load the latest app version to view current promotional opportunities and independent travel perks. Direct contact information remains below.</p>}
      <section className="truck-advantage truck-width" aria-labelledby="truck-advantage-heading"><div className="truck-section-heading"><span className="truck-eyebrow">THE ROGER CUSTOMER ADVANTAGE</span><h2 id="truck-advantage-heading">Getting Protected Is Just the Beginning.</h2><p>A smart home is the start. Here are a few more reasons to stay connected.</p></div><div className="truck-advantage-grid">
        <article><ShieldCheck /><span className="truck-card-label">YOUR PERSONAL CONNECTION</span><h3>Personal Smart Home Expertise</h3><p>Direct access to Roger’s practical installation knowledge and guidance for making sense of your equipment and your home.</p><a href="#truck-meet">Get to know Roger <ArrowRight size={16} /></a></article>
        <article className="truck-independent"><Home /><span className="truck-card-label">INDEPENDENT INSURANCE OPTIONS</span><h3>Potential Home Insurance Savings</h3><p>Explore possible insurance discounts through independent, appropriately licensed insurance professionals. Insurance quotes are not provided by Vivint; savings and coverage approval are not guaranteed.</p><a href="/#insurance">Explore a savings review <ArrowUpRight size={16} /></a></article>
        <article hidden={!online || contentOutdated} className="truck-independent"><Plane /><span className="truck-card-label">INDEPENDENT TRAVEL PERKS</span><h3>Promotional Vacation Opportunities</h3><p>Ask about Las Vegas, Cancún, Bali, Dubai, Phuket, and Puerto Vallarta. Applicable taxes, fees, eligibility, availability, and package conditions must be confirmed before booking.</p><p className="truck-perk-note">Arranged independently by Roger Reed. Not sponsored, administered, fulfilled, or guaranteed by Vivint corporate. No airfare, meals, or other inclusions are promised.</p><a href="/#home">See travel details in the customer hub <ArrowUpRight size={16} /></a></article>
        <article><Users /><span className="truck-card-label">OFFICIAL PROGRAM · ELIGIBILITY APPLIES</span><h3>Referral Rewards</h3><p>Eligible customers may receive referral credits toward Vivint service under the official referral program. Roger can help you understand the current reward and requirements; credits require program approval.</p><a href="https://support.vivint.com/article/Policy-Referrals" target="_blank" rel="noopener noreferrer">View official referral terms <ArrowUpRight size={16} /></a></article>
      </div><p className="truck-advantage-note">Travel and insurance are separate, independent opportunities. The full customer-facing resources remain in the <a href="/#home">customer hub</a>.</p></section>
      <section id="truck-meet" className="truck-credibility" aria-labelledby="truck-meet-heading"><div className="truck-width truck-story-lead"><div className="truck-section-heading"><span className="truck-eyebrow">A REAL PERSON. A HANDS-ON PROFESSIONAL.</span><h2 id="truck-meet-heading">{holiday ? "Meet Your Smart Home Expert." : "Meet the Man Behind the Truck."}</h2><p>My name is on the experience. Get to know the person you’re inviting into your home.</p></div><div className="truck-video"><iframe loading="lazy" src="https://player.mediadelivery.net/embed/587199/86db6eb7-5583-4bd9-a701-1fa49be85227?autoplay=false&loop=false&muted=false&preload=none" title="Roger’s professional installation and smart home overview" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen /></div></div><MeetRoger setSelectedReview={setSelectedReview} onContact={contact} /></section>
      <section className="truck-equipment truck-width" aria-labelledby="truck-equipment-heading"><div className="truck-equipment-intro"><div className="truck-section-heading"><span className="truck-eyebrow">SEE WHAT VIVINT CAN DO</span><h2 id="truck-equipment-heading">Smart equipment.<br />A smarter plan for your home.</h2><p>Explore a few possibilities. I’ll help you choose what fits, where it belongs, and how it works together.</p></div><div className="truck-video"><iframe loading="lazy" src="https://play.vidyard.com/wocFzyrv2ZcK1ALvvdw5vA?autoplay=0&loop=1&muted=0&controls=1" title="Vivint Proactive Security Overview Video" allow="fullscreen; encrypted-media; picture-in-picture" allowFullScreen /></div></div><ProductGallery onSelect={setSelectedProduct} /><p className="truck-equipment-note">Select a product for details. Confirm current models, features, pricing, and availability with Roger.</p></section>
      <section className="truck-final truck-width" aria-labelledby="truck-final-heading"><span className="truck-eyebrow">YOU FOUND ME. LET’S FIND YOUR FIT.</span><h2 id="truck-final-heading">{holiday ? <>Your Home Deserves a Personal Plan.<br /><span>Let’s Talk About Your Options.</span></> : <>You Already Found the Right Truck.<br /><span>Now Let’s Talk About Your Home.</span></>}</h2><p>You don't have to guess what equipment you need or settle for a generic recommendation. Contact me directly, tell me a little about your home, and I'll help you explore your options.</p><div className="truck-final-actions"><a ref={contactLink} className="primary-button" href={smsUrl} onClick={() => setNotice('Text app requested. Review the message and press Send in your text app. This website has not sent a message.')}><MessageSquare size={18} /> TEXT ROGER DIRECTLY</a><a className="secondary-button" href={`tel:${PHONE_NUMBER}`}><Phone size={18} /> CALL ROGER</a></div><a className="truck-direct-number" href={`tel:${PHONE_NUMBER}`}>{PHONE_NUMBER}</a><p className="truck-send-note">Your text app opens with a starter message. You choose when to send it.</p><button type="button" className="text-button" onClick={copyStarter}><Copy size={15} /> Copy the starter message</button><p role="status" className="truck-contact-status">{notice}</p>{manualCopy && <textarea className="truck-copy-fallback" aria-label="Truck starter message to copy" readOnly rows={5} value={`To: ${PHONE_NUMBER}\n\n${smsMessage}`} onFocus={event => event.target.select()} />}</section>
    </main>
    <footer className="truck-footer truck-width"><div><VivintLogo className="w-24 h-7 text-white" /><span>Roger Reed · Smart Home Expert</span></div><nav aria-label="Roger’s links"><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><InstagramIcon /> Instagram</a><a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer"><TikTokIcon /> TikTok</a><a href="/#home">Customer hub <ArrowUpRight size={16} /></a></nav><p>TechRahj / Roger Reed is an official Vivint Smart Home Expert providing new account setup and local field support. For technical support or billing on active accounts, contact Vivint Corporate at <a href={`tel:${VIVINT_CORPORATE_SERVICE}`}>{VIVINT_CORPORATE_SERVICE}</a>.</p><small>© {new Date().getFullYear()} TechRahj · Roger Reed. Independent perks are separate from Vivint corporate services.</small></footer>
    {!selectedProduct && !selectedReview && <div className="truck-mobile-bar"><ContactLink>TEXT ROGER DIRECTLY <ArrowRight size={16} /></ContactLink></div>}
    {selectedProduct && <Modal title={selectedProduct.name} onClose={() => setSelectedProduct(null)}><img className="product-modal-image" src={selectedProduct.img} alt={selectedProduct.name} /><p>{selectedProduct.longDesc}</p><ul className="product-features">{selectedProduct.features.map(feature => <li key={feature}><Check size={18} /> {feature}</li>)}</ul><p className="field-hint">Confirm current specifications, models, availability, and pricing with Roger.</p><ContactLink>ASK ROGER ABOUT THIS EQUIPMENT</ContactLink></Modal>}
    {selectedReview && <Modal title="Nextdoor recommendation" onClose={() => setSelectedReview(null)}><img className="expanded-review" src={selectedReview} alt="Expanded Nextdoor recommendation" /><ContactLink>TEXT ROGER DIRECTLY</ContactLink></Modal>}
  </div>;
}
