import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Camera, Check, HeartHandshake, Home, Menu, MessageSquare, Phone, ShieldCheck, Smartphone, Users, X } from 'lucide-react';
import { IMG_RAHJ_PROFILE, INSTAGRAM_URL, TIKTOK_URL, PHONE_NUMBER, VIVINT_CORPORATE_SERVICE, VivintLogo, InstagramIcon, TikTokIcon, triggerTextMsg } from './brand.jsx';
import ReferralForm from './ReferralForm.jsx';
import MeetRoger from './MeetRoger.jsx';
import ExploreVivint from './ExploreVivint.jsx';
import Modal from './Modal.jsx';
import PanelTutorial from './PanelTutorial.jsx';
import TravelPerks from './TravelPerks.jsx';
import InsuranceForm from './InsuranceForm.jsx';
import './customer-updates.css';
import InstallApp from './InstallApp.jsx';

const AREAS = [['home', 'Customer Hub'], ['refer', 'Refer Friends & Family'], ['resources', 'How It Works'], ['insurance', 'Save on Home Insurance'], ['meet', 'Meet Roger'], ['explore', 'Explore Vivint'], ['partners', 'Partner Portal']];
const activeArea = () => AREAS.some(([id]) => id === window.location.hash.slice(1)) ? window.location.hash.slice(1) : 'home';

function Resources() {
  return <div className="content-width section-padding"><div className="section-intro"><span className="eyebrow">MAKE YOURSELF AT HOME</span><h1>How It Works</h1><p>A few helpful starting points for life after installation.</p></div><PanelTutorial /><div className="resource-grid">
    <article className="resource-card"><Smartphone /><h2>Start with the app</h2><p>Open the Vivint app and sign in with your account. Explore your devices with Roger before he finishes your installation.</p></article>
    <article className="resource-card"><Camera /><h2>Make alerts work for you</h2><p>Review your camera notification preferences in the app. Ask about settings that suit your routine and the devices in your home.</p></article>
    <article className="resource-card"><Home /><h2>Get comfortable</h2><p>Practice arming and disarming your system. Keep account credentials and access codes private, and review who has access to your home.</p></article>
    <article className="resource-card support-card"><Phone /><h2>Official customer support</h2><p>For technical support, account questions, or billing, contact Vivint Corporate.</p><a className="secondary-button" href={`tel:${VIVINT_CORPORATE_SERVICE}`}>{VIVINT_CORPORATE_SERVICE} <ArrowUpRight size={18} /></a><a className="text-button" href="https://support.vivint.com/" target="_blank" rel="noopener noreferrer">Visit official Vivint support <ArrowUpRight size={16} /></a></article>
  </div><div className="connection-strip"><div><h2>A question for Roger?</h2><p>For referrals, equipment planning, or installation follow-up, stay in touch.</p></div><button className="primary-button" onClick={() => triggerTextMsg('a question after my installation')}><MessageSquare size={18} /> TEXT ROGER</button></div></div>;
}

function PartnerPortal() {
  const [partner, setPartner] = useState({ name: '', client: '', phone: '', notes: '' });
  const [notice, setNotice] = useState('');
  return <div className="narrow-width section-padding"><div className="section-intro"><span className="eyebrow">BUSINESS CONNECTIONS</span><h1>Better together.</h1><p>A direct line for realtors and business partners. Homeowner introductions belong in Refer Friends & Family.</p></div><div className="partner-note"><HeartHandshake size={24} /><div><h2>Let’s talk about your partnership</h2><p>Contact Roger for current commission arrangements and approved marketing materials. This public page provides a referral handoff; it does not offer authenticated access to private partner information.</p></div></div>
    <form className="form-card" onSubmit={event => {
      event.preventDefault();
      const inputs = [...event.currentTarget.querySelectorAll('input[required]')];
      const blank = inputs.find(input => !input.value.trim());
      if (blank) { blank.setCustomValidity('Please enter a value, not only spaces.'); blank.reportValidity(); return; }
      triggerTextMsg(`Partner referral from ${partner.name.trim()} for ${partner.client.trim()} (${partner.phone.trim()}). ${partner.notes.trim()}`);
      setNotice('Text app requested. Review the message and send it there. This page has not sent a referral.');
    }} onInput={event => event.target.setCustomValidity?.('')}><h2>Introduce a client</h2><p className="field-hint">Required fields are marked below. This opens your text app for a personal handoff.</p><div className="form-grid">
      <label>Your name / business (required)<input required value={partner.name} onChange={event => setPartner({ ...partner, name: event.target.value })} /></label>
      <label>Client full name (required)<input required value={partner.client} onChange={event => setPartner({ ...partner, client: event.target.value })} /></label>
      <label className="full-width">Client phone (required)<input required type="tel" inputMode="tel" value={partner.phone} onChange={event => setPartner({ ...partner, phone: event.target.value })} /></label>
      <label className="full-width">Notes / timeline (optional)<textarea rows={3} value={partner.notes} onChange={event => setPartner({ ...partner, notes: event.target.value })} /></label>
    </div><button type="submit" className="primary-button"><MessageSquare size={18} /> OPEN TEXT TO REVIEW REFERRAL</button><p role="status" className="field-hint">{notice}</p></form>
    <a className="secondary-button" href={`tel:${PHONE_NUMBER}`}><Phone size={18} /> Call Roger · {PHONE_NUMBER}</a>
  </div>;
}

export default function Hub() {
  const [area, setArea] = useState(activeArea);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [offerOpen, setOfferOpen] = useState(false);
  const main = useRef(null);
  useEffect(() => {
    const navigate = () => { setArea(activeArea()); setMenuOpen(false); setSelectedProduct(null); setSelectedReview(null); setOfferOpen(false); window.scrollTo(0, 0); requestAnimationFrame(() => main.current?.focus({ preventScroll: true })); };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  useEffect(() => { document.title = `${AREAS.find(([id]) => id === area)[1]} | Roger With Vivint`; }, [area]);
  return <div className="hub-shell">
    <a href="#main-content" className="skip-link" onClick={event => { event.preventDefault(); main.current?.focus(); }}>Skip to content</a>
    <header className="hub-header"><div className="header-inner"><a href="#home" className="brand-link" aria-label="Roger with Vivint customer hub"><VivintLogo className="w-24 h-7 text-white" /><span className="brand-person">ROGER REED<small>YOUR SMART HOME EXPERT</small></span></a><nav className="desktop-nav" aria-label="Main navigation">{AREAS.filter(([id]) => id !== 'partners').map(([id, label]) => <a key={id} href={`#${id}`} aria-current={area === id ? 'page' : undefined}>{id === 'refer' ? 'Refer a friend' : label}</a>)}</nav><div className="header-actions"><a href={`tel:${PHONE_NUMBER}`} className="contact-link" aria-label={`Call Roger at ${PHONE_NUMBER}`}><Phone size={18} /><span>Call Roger</span></a><button className="icon-button menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div></div>
      {menuOpen && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{AREAS.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={area === id ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={16} /></a>)}</nav>}
    </header>
    <main id="main-content" ref={main} tabIndex={-1}>
      <div hidden={area !== 'home'}>
        <section className="welcome-section content-width">
          <div className="welcome-copy">
            <span className="welcome-badge"><span /> YOUR HOME. YOUR BENEFITS.</span>
            <h1>Make More of Your Smart Home.<br /><span>Discover Rewards and Savings.</span></h1>
            <p>Your system is installed, but your connection with Roger doesn't end there. Explore eligible referral rewards, see if you can save on home insurance, and keep helpful resources close whenever you need them.</p>
            <div className="campaign-hero-actions">
              <a href="#refer" className="primary-button hero-button"><Users size={20} /> EXPLORE REFERRAL REWARDS <ArrowRight size={20} /></a>
              <a href="#insurance" className="secondary-button"><ShieldCheck size={20} /> Check insurance savings <ArrowUpRight size={18} /></a>
            </div>
            <div className="hero-footnote"><Check size={16} /> Referral credits and insurance savings depend on eligibility; neither is guaranteed.</div>
          </div>
          <div className="welcome-visual"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="home-symbol"><Home size={96} strokeWidth={1} /><span className="home-check"><Check size={20} /></span></div><div className="roger-card"><img src={IMG_RAHJ_PROFILE} alt="Roger Reed, your Vivint Smart Home Expert" /><div><span>YOUR SMART HOME EXPERT</span><h2>Roger Reed</h2><p><span className="online-dot" /> One familiar face. One direct line.</p></div><a href="#meet" className="icon-button" aria-label="Meet Roger"><ArrowUpRight /></a></div><div className="visual-caption">A LITTLE MORE VALUE, RIGHT AT YOUR FINGERTIPS.<br /><strong>Keep this app handy for rewards, savings and support.</strong></div></div>
        </section>
        <section className="campaign-section content-width" aria-labelledby="campaign-heading">
          <div className="campaign-intro"><span className="eyebrow">GOOD REASONS TO KEEP COMING BACK</span><h2 id="campaign-heading">Three ways your customer hub works for you</h2><p>Your shortcuts to potential savings, eligible credits, and the help you need after installation.</p></div>
          <div className="campaign-grid">
            <a className="campaign-way campaign-referrals" href="#refer"><span className="campaign-number">01 / ELIGIBLE REFERRAL REWARDS</span><Users size={28}/><h3>Get credit for spreading the word</h3><p>Know someone who might benefit from Vivint? Introduce them with permission and ask Roger how official referral credits may reduce your service bill.</p><span className="campaign-link">Explore referral rewards <ArrowRight size={18}/></span></a>
            <a className="campaign-way campaign-insurance" href="#insurance"><span className="campaign-number">02 / POTENTIAL HOMEOWNER SAVINGS</span><ShieldCheck size={28}/><h3>Keep more of your money</h3><p>A free home insurance review through a licensed professional may uncover savings. Compare options without needing to buy a security system.</p><span className="campaign-link">Request an insurance review <ArrowRight size={18}/></span></a>
            <a className="campaign-way campaign-security" href="#resources"><span className="campaign-number">03 / SUPPORT IN YOUR POCKET</span><BookOpen size={28}/><h3>Get more from your system</h3><p>Revisit the panel walkthrough, find helpful setup tips, and keep important support links in one convenient place.</p><span className="campaign-link">Open how-it-works resources <ArrowRight size={18}/></span></a>
          </div>
          <p className="campaign-disclosure">Referral rewards are subject to Vivint program rules and approval and are typically credits rather than cash payments. Insurance quotes are arranged through independent, appropriately licensed professionals, not Vivint. Actual savings are not guaranteed.</p>
        </section>
        <InstallApp />
        <section className="intro-banner content-width"><div><span className="eyebrow">PASS ON THE PEACE OF MIND</span><h2>Someone come to mind?</h2><p>Friends, family, a neighbor down the street. Make an introduction and Roger can take it from there.</p></div><a href="#refer" className="secondary-button">Introduce a friend <ArrowRight size={18} /></a></section>
        <section className="home-resources content-width" aria-label="Helpful resources"><div className="home-resource-heading"><span className="eyebrow">SETTLE IN. MAKE THE MOST OF HOME.</span><h2>A little guidance. A few extra possibilities.</h2></div><div className="home-resource-grid"><a href="#resources" className="shortcut tutorial-shortcut"><BookOpen /><h2>How It Works</h2><p>Learn your panel with Roger’s personal Smart Hub tutorial, plus helpful tips and official support.</p><span>Watch Roger’s walkthrough <ArrowUpRight size={16} /></span></a><a href="#insurance" className="shortcut insurance-shortcut"><ShieldCheck /><h2>Save on Home Insurance</h2><p>Your smart home may be eligible for insurance discounts. Request a complimentary review to explore your options.</p><span>Request a savings review <ArrowUpRight size={16} /></span></a></div></section>
        <TravelPerks />
        <section className="hub-shortcuts content-width credibility-shortcuts" aria-label="Stay connected"><div className="shortcut-heading"><span className="eyebrow">A FAMILIAR FACE. A DIRECT CONNECTION.</span><p>Get to know Roger and explore<br />what’s possible for your home.</p></div><a href="#meet" className="shortcut"><HeartHandshake /><h2>Meet Roger</h2><p>The person behind your installation.</p><span>Get to know Roger <ArrowUpRight size={16} /></span></a><a href="#explore" className="shortcut"><ShieldCheck /><h2>Explore Vivint</h2><p>Find what fits your home and your life.</p><span>Explore your options <ArrowUpRight size={16} /></span></a><a href="#partners" className="shortcut"><Users /><h2>Partner Portal</h2><p>A direct line for realtors and business partners.</p><span>Connect with Roger <ArrowUpRight size={16} /></span></a></section>
      </div>
      {/* Keep forms mounted across hub navigation. Their data lives only in React state. */}
      <section hidden={area !== 'refer'} className="narrow-width section-padding" aria-label="Refer Friends & Family"><ReferralForm /></section>
      {area === 'meet' && <div><div className="page-lead content-width"><span className="eyebrow">YOUR PERSONAL CONNECTION</span><h1>Meet Roger.</h1><p>Experience in your home. A connection in your community.</p></div><MeetRoger setSelectedReview={setSelectedReview} /></div>}
      {area === 'explore' && <div><div className="page-lead content-width"><span className="eyebrow">A HOME THAT WORKS FOR YOU</span><h1>Explore Vivint.</h1><p>Get to know your options, then talk with Roger about a setup that fits.</p><div className="button-row"><button className="primary-button" onClick={() => triggerTextMsg('a personalized setup quote')}><MessageSquare size={18} /> TEXT ROGER FOR A QUOTE</button><button className="secondary-button" onClick={() => setOfferOpen(true)}>Ask about current offers <ArrowUpRight size={18} /></button></div></div><ExploreVivint setSelectedProduct={setSelectedProduct} /></div>}
      {area === 'resources' && <Resources />}
      <section hidden={area !== 'insurance'} aria-label="Save on Home Insurance"><InsuranceForm /></section>
      <section hidden={area !== 'partners'} aria-label="Partner Portal"><PartnerPortal /></section>
    </main>
    <footer className="hub-footer content-width"><div className="footer-top"><div><VivintLogo className="w-24 h-7 text-white" /><p>Roger Reed · Smart Home Expert<br /><a href={`tel:${PHONE_NUMBER}`}>{PHONE_NUMBER}</a></p></div><div className="footer-social"><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><InstagramIcon /> Instagram</a><a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer"><TikTokIcon /> TikTok</a><a href="#partners"><HeartHandshake size={17} /> Partner Portal</a></div></div><p className="support-disclaimer">TechRahj / Roger Reed is an official Vivint Smart Home Expert providing new account setup and local field support. For technical support or billing on active accounts, contact Vivint Corporate directly at <a href={`tel:${VIVINT_CORPORATE_SERVICE}`}>{VIVINT_CORPORATE_SERVICE}</a>.</p><div className="footer-bottom"><span>© {new Date().getFullYear()} TechRahj · Roger Reed</span><span>YOUR HOME. YOUR PEOPLE. YOUR CONNECTION.</span></div></footer>
    {area !== 'refer' && area !== 'partners' && area !== 'insurance' && !selectedProduct && !selectedReview && !offerOpen && <div className="mobile-referral-bar"><a href="#refer" className="primary-button"><Users size={18} /> REFER FRIENDS & FAMILY <ArrowRight size={18} /></a></div>}
    {selectedReview && <Modal title="Nextdoor recommendation" onClose={() => setSelectedReview(null)}><img className="expanded-review" src={selectedReview} alt="Expanded Nextdoor recommendation" /><button className="secondary-button" onClick={() => triggerTextMsg('a Nextdoor recommendation')}><MessageSquare size={18} /> Ask Roger about this review</button></Modal>}
    {selectedProduct && <Modal title={selectedProduct.name} onClose={() => setSelectedProduct(null)}><img className="product-modal-image" src={selectedProduct.img} alt={selectedProduct.name} /><p>{selectedProduct.longDesc}</p><ul className="product-features">{selectedProduct.features.map(feature => <li key={feature}><Check size={18} /> {feature}</li>)}</ul><p className="field-hint">Models, specifications, pricing, and availability are confirmed during your consultation.</p><button className="primary-button" onClick={() => triggerTextMsg(`Hardware quote for ${selectedProduct.name}`)}><MessageSquare size={18} /> TEXT ROGER ABOUT THIS PRODUCT</button></Modal>}
    {offerOpen && <Modal title="Ask about current offers" onClose={() => setOfferOpen(false)}><span className="eyebrow">A PERSONAL CONSULTATION</span><p>Talk with Roger about currently available equipment and offers for your home. He can confirm eligibility, inventory, pricing, and full terms before you decide.</p><button className="primary-button" onClick={() => triggerTextMsg('current equipment offers and eligibility')}><MessageSquare size={18} /> ASK ROGER ABOUT CURRENT OFFERS</button></Modal>}
  </div>;
}
