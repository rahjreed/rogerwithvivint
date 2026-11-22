import React,{useState,useRef} from 'react';
import {MessageSquare,Copy,Users,Plus,Share2} from 'lucide-react';
import './iphone-referral.css';
import {PHONE_NUMBER} from './brand.jsx';
import {copyText} from './clipboard.js';
import {usePwaState} from './usePwaState.js';
import {referralDraft,normalizePhone,REFERRAL_MESSAGE} from './group-referral.js';
export default function ReferralForm(){
 const {online,contentOutdated}=usePwaState();
 const [phone,setPhone]=useState(''),[message,setMessage]=useState(REFERRAL_MESSAGE),[notice,setNotice]=useState(''),[opened,setOpened]=useState(false);
 const input=useRef(null);
 const isIphone=/iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 const [socialNotice,setSocialNotice]=useState('');
 const [socialType,setSocialType]=useState('installed');
 const socialPosts={
  installed:"Just got my Vivint system installed, and I’m excited to share it! 🏡📷 Roger helped me get everything set up and walked me through how it works. If you’ve been thinking about smart-home security, reach out to Roger at https://rogerwithvivint.com and let him know I sent you! I may qualify for referral credits if someone I refer gets installed.",
  credit:"A little win worth sharing! 🙌 I recently earned a Vivint referral credit just by introducing someone to Roger. It's nice knowing that sharing my experience can help with my monitoring bill. If you’re curious about Vivint, check out https://rogerwithvivint.com and tell Roger I sent you! I may receive bill credits for qualifying referrals."
 };
 const socialPost=socialPosts[socialType];
 async function copySocial(){setSocialNotice(await copyText(socialPost)?'Post copied! Add a photo of your camera, doorbell or smart hub, then paste it into Facebook and personalize it.':'Copy unavailable. Select and copy the post manually.');}
 async function shareSocial(){try{if(navigator.share){await navigator.share({text:socialPost});setSocialNotice('Share sheet opened. Add your own device photo in Facebook if it was not attached automatically.');}else await copySocial();}catch(e){if(e?.name!=='AbortError')await copySocial();}}
 function send(e){e.preventDefault();if(isIphone){copy();return;}if(!message.trim()){setNotice('Enter an introduction before opening your group text.');return;}const normalized=normalizePhone(phone);if(!normalized||normalized===normalizePhone(PHONE_NUMBER)){setNotice('Enter your friend’s valid US phone number, different from Roger’s.');return;}const url=referralDraft(PHONE_NUMBER,normalized,message.trim(),navigator.userAgent);setOpened(true);setNotice('Before sending, check for TWO recipients: your friend AND Roger ('+PHONE_NUMBER+'). Some messaging apps drop the second number. If either number is missing, add it to the To field in Messages. Nothing has been sent yet.');window.location.href=url;}
 async function copy(){const ok=await copyText(message.trim());setNotice(ok?'Introduction copied! Open Messages, start a NEW group text, add Roger ('+PHONE_NUMBER+') and your friend from Contacts, paste the introduction and send.':'Copy unavailable. Select and copy the introduction above, then start a new group message to Roger and your friend.');}
 return <div className="referral-workspace">
 {online&&!contentOutdated?<aside className="referral-rewards"><span className="eyebrow">SHARE THE EXPERIENCE</span><h2>Earn $300 Toward Your Vivint Bill for Every Qualified Referral!</h2><h3>Could your monitoring practically pay for itself?</h3><p>One qualified referral could earn a $300 bill credit — roughly 4 to 6 months of monitoring at $50–$75 per month. Keep sharing your experience, and eligible referral credits could help cover your monitoring for years to come.</p><div className="referral-credit-grid">{[[1,'$300','4–6 months'],[2,'$600','8–12 months'],[3,'$900','12–18 months']].map(([n,credit,months])=><div key={n}><span>{n} {n===1?'referral':'referrals'}</span><strong>{credit}</strong><span>{months}</span></div>)}</div><p>Illustrative monitoring savings only. Actual credits, stacking, limits, monthly charges and equipment payments may vary; free service for life is not guaranteed.</p><small>Subject to Vivint’s official program terms, eligibility, limits and approval.</small><a href="https://support.vivint.com/article/Policy-Referrals" target="_blank" rel="noopener noreferrer">Official referral terms ↗</a></aside>:<p className="pwa-unavailable">Reconnect to check current referral reward terms.</p>}
 <div className="section-intro"><span className="eyebrow">ONE FRIEND. ONE QUICK INTRODUCTION.</span><h2>Make a three-way introduction.</h2><p>{isIphone?'Copy your introduction, start a new group message, and add Roger and your friend.':'No service number needed right now. Just enter your friend’s phone number and introduce us in a group text.'}</p></div>
 <form className="form-card referral-quick-form" onSubmit={send}>
 {!isIphone&&<><label htmlFor="friend-phone">Your friend’s phone number</label><input ref={input} id="friend-phone" type="tel" inputMode="tel" required placeholder="(317) 555-0123" value={phone} onChange={e=>{setPhone(e.target.value);setOpened(false);setNotice('');}} autoComplete="off"/><p className="field-hint">Type or paste your friend’s phone number.</p><p className="field-hint referral-group-line"><Users size={16} style={{display:'inline'}}/> Required recipients: your friend AND Roger ({PHONE_NUMBER})</p><p className="field-hint">The message should open with Roger and your friend. Verify both recipients before sending.</p></>}
 <label htmlFor="referral-message">Your ready-to-send message</label><textarea id="referral-message" rows={5} value={message} onChange={e=>setMessage(e.target.value)} required/><p className="field-hint">Only introduce someone who is comfortable being included in a group text. Personalize the message if you like.</p>
 {isIphone&&<div className="iphone-referral-simple"><strong>iPhone: Start a new group text</strong><p>Tap <strong>Copy Introduction</strong> below. Open Messages and tap New Message. Add <strong>Roger ({PHONE_NUMBER})</strong> and your friend from Contacts, then paste the introduction and send.</p><p>Do not reply in an existing one-to-one conversation with Roger; create a new message with both recipients.</p></div>}
 <button className="primary-button" style={{width:'100%',justifyContent:'center',marginTop:16}} type="submit">{isIphone?<Copy size={18}/>:<MessageSquare size={18}/>} {isIphone?'COPY INTRODUCTION':'OPEN GROUP TEXT'}</button>
 </form>
 {opened&&<button type="button" className="secondary-button" onClick={()=>{setPhone('');setMessage(REFERRAL_MESSAGE);setOpened(false);setNotice('');input.current?.focus();}}><Plus size={18}/> INTRODUCE ANOTHER FRIEND</button>}
 <p className="form-notice" role="status">{notice}</p>{isIphone&&<details className="script-preview"><summary>Text app didn’t prefill everything?</summary><p>On iPhone, tap New Message in Messages and choose both Roger ({PHONE_NUMBER}) and your friend, then paste the introduction. On Android, check both recipients before sending.</p><button type="button" className="secondary-button" onClick={copy}><Copy size={16}/> COPY MESSAGE</button></details>}
 {online&&!contentOutdated&&<section className="form-card referral-social">
 <span className="eyebrow">YOUR EXPERIENCE CAN HELP A FRIEND</span>
 <h2>Share your Vivint experience on Facebook</h2>
 <p>Your recommendation means more when it sounds like you. Choose the post that fits your experience, add a real photo of your new equipment, and share it with friends.</p>
 <div className="referral-social-example"><strong>4 referrals in 4 months = $1,200 in potential bill credits</strong><p>Roger received four referrals through social media over four months. At the current advertised $300 credit per qualified referral, four qualifying referrals could represent $1,200 toward monitoring bills for an eligible referring customer. Credit amounts, eligibility, approval and stacking are subject to Vivint's official terms; this isn't a guaranteed payout.</p></div>
 <div className="referral-social-switch" role="group" aria-label="Choose a social post">
 <button type="button" className={socialType==='installed'?'selected':''} aria-pressed={socialType==='installed'} onClick={()=>{setSocialType('installed');setSocialNotice('');}}>JUST GOT INSTALLED</button>
 <button type="button" className={socialType==='credit'?'selected':''} aria-pressed={socialType==='credit'} onClick={()=>{setSocialType('credit');setSocialNotice('');}}>EARNED A REFERRAL CREDIT</button>
 </div>
 <p className="field-hint">{socialType==='installed'?'Use this after your system is installed. Make it your own, especially the details about your installation.':'Only share this version after a referral credit has actually been earned.'}</p>
 <div className="referral-social-quote">{socialPost}</div>
 <div className="referral-photo-tip"><strong>📸 Add a photo of your setup</strong><p>Take a clear photo of the camera, video doorbell, or smart hub Roger installed. Pair it with your post so friends see a real example—not a generic advertisement. Avoid showing access codes, passwords, addresses, camera views or other sensitive details.</p></div>
 <div className="referral-social-actions"><button type="button" className="primary-button" onClick={shareSocial}><Share2 size={18}/> SHARE MY POST</button><button type="button" className="secondary-button" onClick={copySocial}><Copy size={18}/> COPY FACEBOOK POST</button></div>
 <p className="field-hint">Sharing is optional. Keep it truthful to your own experience and disclose that you may receive referral bill credits. Posting alone doesn't earn a credit; official eligibility and approval apply.</p>
 <p role="status" className="form-notice">{socialNotice}</p>
 </section>}<p className="privacy-note">Your friend’s number stays in this page until you open your texting app. Roger can confirm your account details and referral eligibility afterward.</p></div>;
}
