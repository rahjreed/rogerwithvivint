import React,{useState} from 'react';
import {MessageSquare,Copy,Users,Share2} from 'lucide-react';
import {PHONE_NUMBER} from './brand.jsx';
import {copyText} from './clipboard.js';
import {usePwaState} from './usePwaState.js';
import {normalizePhone,REFERRAL_MESSAGE} from './group-referral.js';
export default function ReferralForm(){
 const {online,contentOutdated}=usePwaState();
 const [message,setMessage]=useState(REFERRAL_MESSAGE),[notice,setNotice]=useState('');
 const [socialNotice,setSocialNotice]=useState('');
 const socialPost='Thank you Roger! I just earned another Vivint referral credit. My monitoring costs are getting covered through referrals! If you’re interested in Vivint, visit https://rogerwithvivint.com or check out the Indianapolis-area 317 Exclusive at https://rogerwithvivint.com/tiktok. I may earn bill credits from qualifying referrals; please mention my name when you contact Roger.';
 async function copySocial(){setSocialNotice(await copyText(socialPost)?'Post copied! Paste it into your social app and personalize it before sharing.':'Please select and copy the example post manually.');}
 async function shareSocial(){try{if(navigator.share){await navigator.share({text:socialPost});setSocialNotice('Share sheet completed. Check that the website links are included in your post.');}else await copySocial();}catch(e){if(e?.name!=='AbortError')await copySocial();}}
 function openMessages(e){
  e.preventDefault();
  const ios=/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  setNotice('In Messages, add your friend as another recipient, verify both recipients and the introduction, then tap Send. Nothing has been sent yet.');
  window.location.href='sms:'+normalizePhone(PHONE_NUMBER)+(ios?'&':'?')+'body='+encodeURIComponent(message.trim());
 }
 async function copy(){setNotice(await copyText(message)?'Introduction copied. Open Messages, add your friend and Roger ('+PHONE_NUMBER+'), paste the introduction and send.':'Copy unavailable. Select and copy the introduction manually.');}
 return <div className="referral-workspace">
 {online&&!contentOutdated?<aside className="referral-rewards"><span className="eyebrow">SHARE THE EXPERIENCE</span><h2>Earn $300 Toward Your Vivint Bill for Every Qualified Referral!</h2><h3>Could your monitoring practically pay for itself?</h3><p>One qualified referral could earn a $300 bill credit — roughly 4 to 6 months of monitoring at $50–$75 per month. Keep sharing your experience, and eligible referral credits could help cover your monitoring for years to come.</p><div className="referral-credit-grid">{[[1,'$300','4–6 months'],[2,'$600','8–12 months'],[3,'$900','12–18 months']].map(([n,credit,months])=><div key={n}><span>{n} {n===1?'referral':'referrals'}</span><strong>{credit}</strong><span>{months}</span></div>)}</div><p>Illustrative monitoring savings only. Actual credits, stacking, limits, monthly charges and equipment payments may vary; free service for life is not guaranteed.</p><small>Subject to Vivint’s official program terms, eligibility, limits and approval.</small><a href="https://support.vivint.com/article/Policy-Referrals" target="_blank" rel="noopener noreferrer">Official referral terms ↗</a></aside>:<p className="pwa-unavailable">Reconnect to check current referral reward terms.</p>}
 <div className="section-intro"><span className="eyebrow">ONE FRIEND. ONE QUICK INTRODUCTION.</span><h2>Make a three-way introduction.</h2><p>No service number or phone numbers to type. Start in your texting app and choose your friend from your own contacts.</p></div>
 <form className="form-card referral-quick-form" onSubmit={openMessages}>
 <p className="field-hint referral-group-line"><Users size={18}/> You + your friend + Roger</p>
 <ol style={{paddingLeft:22,listStyle:'decimal',lineHeight:1.8,fontSize:14,display:'grid',gap:8}}><li>Tap <strong>Start Referral in Messages</strong> below.</li><li>Add your friend from your contacts to the recipient list alongside Roger ({PHONE_NUMBER}).</li><li>Check that both recipients are included, then send your introduction.</li></ol>
 <label htmlFor="referral-message">Your ready-to-send introduction</label><textarea id="referral-message" rows={5} value={message} onChange={e=>{setMessage(e.target.value);setNotice('');}} required/>
 <p className="field-hint">Only introduce someone who is comfortable being included in a group text. Personalize the message if you like.</p>
 <button className="primary-button" style={{width:'100%',justifyContent:'center',marginTop:8}} type="submit" disabled={!message.trim()}><MessageSquare size={18}/> START REFERRAL IN MESSAGES</button>
 <p className="form-notice" role="status">{notice}</p>
 <details className="script-preview"><summary>Messages didn’t prefill everything?</summary><p>Start a new group message manually with your friend and Roger ({PHONE_NUMBER}). Some messaging apps open an existing conversation or do not prefill the message.</p><button type="button" className="secondary-button" onClick={copy}><Copy size={16}/> COPY INTRODUCTION</button></details>
 </form>
 {online&&!contentOutdated&&<section className="form-card referral-social"><span className="eyebrow">SHARE YOUR REAL RESULTS</span><h2>Another credit? Tell your story!</h2><p>Every time you actually earn another referral credit, share your experience on social media and include <strong>RogerWithVivint.com</strong> and the <strong>317 Exclusive</strong> at <strong>RogerWithVivint.com/tiktok</strong>. No tagging required! Ask interested friends to mention your name to Roger so he can confirm referral eligibility.</p><p>Here’s a starting point — personalize it to reflect the credit you actually received.</p><div className="referral-social-quote">{socialPost}</div><div className="referral-social-actions"><button type="button" className="primary-button" onClick={shareSocial}><Share2 size={18}/> SHARE MY STORY</button><button type="button" className="secondary-button" onClick={copySocial}><Copy size={18}/> COPY POST</button></div><p className="field-hint">Sharing is optional. Be truthful about your experience and disclose that you may receive referral credits. No credit is promised just for posting.</p><p role="status" className="form-notice">{socialNotice}</p></section>}<p className="privacy-note">Your contacts stay in your texting app. This website does not access or collect your friend’s phone number. Roger can confirm your account details and referral eligibility afterward.</p></div>;
}
