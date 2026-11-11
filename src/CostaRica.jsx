import React, { useEffect } from 'react';
import { ArrowRight, ArrowUpRight, Check, HeartHandshake, Home, MessageSquare, Phone, Plane, ShieldCheck, Users } from 'lucide-react';
import { IMG_RAHJ_PROFILE, PHONE_NUMBER, VIVINT_CORPORATE_SERVICE, VivintLogo, triggerTextMsg } from './brand.jsx';
import './costa-rica.css';

export default function CostaRica() {
  useEffect(() => { document.title = 'Help Roger & Sarah Reach Costa Rica | Roger With Vivint'; }, []);
  return <div className="costa-page">
    <header className="costa-header"><a href="/#home" className="costa-brand"><VivintLogo className="w-24 h-7 text-white"/><span>ROGER REED<small>SMART HOME EXPERT</small></span></a><a href={`tel:${PHONE_NUMBER}`}><Phone size={18}/> {PHONE_NUMBER}</a></header>
    <main>
      <section className="costa-hero">
        <span className="costa-kicker"><Plane size={17}/> A PERSONAL GOAL · COSTA RICA</span>
        <div className="costa-hero-layout"><div className="costa-hero-copy">
          <h1>Help Me Take Sarah <span>Somewhere We've Never Been.</span></h1>
          <p>I'm working toward earning a company trip to Costa Rica, and I'd love your help making it happen.</p>
          <p>I've never been outside the country. And Sarah and I have never had the chance to experience an international trip together. The opportunity to share that first adventure with my wife would mean a lot to us.</p>
          <p className="costa-highlight">The best part? You might be able to help me reach that goal while finding something valuable for yourself.</p>
          <a href="#costa-help" className="primary-button">SEE HOW YOU CAN HELP <ArrowRight size={18}/></a>
        </div><div className="costa-photo">
          <div className="costa-photo-label">A FIRST INTERNATIONAL ADVENTURE</div>
          <div className="costa-scene"><Plane size={86} strokeWidth={1.1}/><span>COSTA RICA</span><small>A journey we'd love to share together</small></div>
          <div className="costa-person"><img src={IMG_RAHJ_PROFILE} alt="Roger Reed"/><div><strong>Roger Reed</strong><span>Thank you for considering helping Sarah and me.</span></div></div>
        </div></div>
      </section>
      <section id="costa-help" className="costa-help"><span className="costa-kicker">SUPPORT THE GOAL · EXPLORE YOUR OPTIONS</span><h2>Three Simple Ways to Help</h2><p>You don't need to purchase a security system to request an insurance review or introduce a friend.</p>
        <div className="costa-grid">
          <article><ShieldCheck size={30}/><span>01 / LOOK FOR SAVINGS</span><h3>Request a Free Home Insurance Review</h3><p>See whether a licensed insurance professional can find a policy that works for your home and budget. Savings aren't guaranteed, but checking your options could be worthwhile.</p><a href="/#insurance">Request my free review <ArrowUpRight size={18}/></a></article>
          <article><Users size={30}/><span>02 / MAKE AN INTRODUCTION</span><h3>Refer Someone Who Needs Home Security</h3><p>If you know a homeowner interested in smart-home security, introduce us with their permission. I'll handle the conversation personally.</p><a href="/#refer">Introduce a friend <ArrowUpRight size={18}/></a></article>
          <article><Home size={30}/><span>03 / EXPLORE SECURITY</span><h3>Ask About Your Home's Options</h3><p>Curious about Vivint for yourself? I can explain equipment, installation and any current offers for which you're eligible.</p><a href="/#explore">Explore Vivint <ArrowUpRight size={18}/></a></article>
        </div>
      </section>
      <section className="costa-thanks"><HeartHandshake size={32}/><h2>Whether You Can Help or Not, Thank You.</h2><p>Sarah and I appreciate you even taking the time to read this. I hope this page helps you find something useful, too. And if we make it to Costa Rica, I'll have a pretty unforgettable story to share.</p><button className="primary-button" onClick={() => triggerTextMsg('helping with your Costa Rica goal')}><MessageSquare size={18}/> TEXT ROGER</button><p className="costa-footnote">This is Roger's personal company-incentive goal. Insurance quotes are offered through independent licensed professionals, not Vivint. Referral credits depend on official program eligibility and approval; no reward or savings is guaranteed. There is no charge simply to ask about available options.</p></section>
    </main>
    <footer className="costa-footer"><p>Roger Reed · Vivint Smart Home Expert</p><a href="/#home">Back to customer hub <ArrowUpRight size={16}/></a><small>For official Vivint account support or billing call {VIVINT_CORPORATE_SERVICE}.</small></footer>
  </div>;
}
