import React,{useState,useRef} from 'react';
import {MessageSquare,Copy,Users,Plus,ContactRound} from 'lucide-react';
import {PHONE_NUMBER} from './brand.jsx';
import {copyText} from './clipboard.js';
import {usePwaState} from './usePwaState.js';
import {referralDraft,normalizePhone,REFERRAL_MESSAGE} from './group-referral.js';
export default function ReferralForm(){
 const {online,contentOutdated}=usePwaState();
 const [phone,setPhone]=useState(''),[message,setMessage]=useState(REFERRAL_MESSAGE),[notice,setNotice]=useState(''),[opened,setOpened]=useState(false);
 const input=useRef(null);
 const [contactName,setContactName]=useState(''),[options,setOptions]=useState([]),[picking,setPicking]=useState(false);
 const canPick=typeof navigator.contacts?.select==='function';
 async function pickContact(){
  if(!canPick){setNotice('This browser cannot open your contacts. Copy your friend’s number from Contacts and paste it above.');input.current?.focus();return;}
  setPicking(true);setNotice('');
  try{
   const [contact]=await navigator.contacts.select(['name','tel'],{multiple:false});
   if(!contact)return;
   const numbers=[...new Set((contact.tel||[]).map(normalizePhone).filter(n=>n&&n!==normalizePhone(PHONE_NUMBER)))];
   if(!numbers.length){setNotice('No usable US phone number was shared. Enter a number manually.');return;}
   setContactName(contact.name?.[0]||'Selected contact');setOptions(numbers.length>1?numbers:[]);setPhone(numbers.length===1?numbers[0]:'');setOpened(false);
  }catch(e){if(e?.name!=='AbortError')setNotice('Contacts could not be opened. You can still enter a number manually.');}
  finally{setPicking(false);}
 }
 function send(e){e.preventDefault();const normalized=normalizePhone(phone);if(!normalized||normalized===normalizePhone(PHONE_NUMBER)){setNotice('Enter your friend’s valid US phone number, different from Roger’s.');return;}const url=referralDraft(normalized,PHONE_NUMBER,message,navigator.userAgent);setOpened(true);setNotice('Check that BOTH recipients and the message appear in your texting app, then press Send there. Nothing has been sent by this website.');window.location.href=url;}
 async function copy(){setNotice(await copyText(message)?'Message copied. Open your texting app, add your friend and Roger ('+PHONE_NUMBER+'), then paste and send.':'Copy unavailable. Select the message above and copy it manually.');}
 return <div className="referral-workspace">
 {online&&!contentOutdated?<aside className="referral-rewards"><span className="eyebrow">SHARE THE EXPERIENCE</span><h2>Earn $300 Toward Your Vivint Bill for Every Qualified Referral!</h2><p>Introduce a friend to Roger. Each qualified referral resulting in an eligible installation could earn a $300 account credit.</p><small>Subject to Vivint’s official program terms, eligibility, limits and approval.</small><a href="https://support.vivint.com/article/Policy-Referrals" target="_blank" rel="noopener noreferrer">Official referral terms ↗</a></aside>:<p className="pwa-unavailable">Reconnect to check current referral reward terms.</p>}
 <div className="section-intro"><span className="eyebrow">ONE FRIEND. ONE QUICK INTRODUCTION.</span><h2>Make a three-way introduction.</h2><p>No service number needed right now. Just enter your friend’s phone number and introduce us in a group text.</p></div>
 <form className="form-card referral-quick-form" onSubmit={send}><label htmlFor="friend-phone">Your friend’s phone number</label><input ref={input} id="friend-phone" type="tel" inputMode="tel" required placeholder="(317) 555-0123" value={phone} onChange={e=>{setPhone(e.target.value);setContactName('');setOptions([]);setOpened(false);setNotice('');}} autoComplete="off"/><button className="secondary-button referral-contact-button" type="button" onClick={pickContact} disabled={picking}><ContactRound size={18}/> {picking?'OPENING CONTACTS…':'CHOOSE FROM CONTACTS'}</button>{!canPick&&<p className="field-hint">If your browser doesn’t support contacts, type or paste the number above.</p>}{contactName&&<p className="referral-selected">Selected: {contactName}</p>}{options.length>0&&<div className="referral-number-options"><label htmlFor="contact-number">Choose a phone number</label><select id="contact-number" value={phone} onChange={e=>setPhone(e.target.value)}><option value="">Select a number</option>{options.map(n=><option key={n} value={n}>{n}</option>)}</select></div>}<p className="field-hint referral-group-line"><Users size={16} style={{display:'inline'}}/> Group: you, your friend and Roger ({PHONE_NUMBER})</p><label htmlFor="referral-message">Your ready-to-send message</label><textarea id="referral-message" rows={5} value={message} onChange={e=>setMessage(e.target.value)} required/><p className="field-hint">Only introduce someone who is comfortable being included in a group text. Edit the message so it reflects your experience.</p><button className="primary-button" style={{width:'100%',justifyContent:'center',marginTop:16}} type="submit"><MessageSquare size={18}/> OPEN GROUP TEXT</button></form>
 {opened&&<button type="button" className="secondary-button" onClick={()=>{setPhone('');setContactName('');setOptions([]);setMessage(REFERRAL_MESSAGE);setOpened(false);setNotice('');input.current?.focus();}}><Plus size={18}/> INTRODUCE ANOTHER FRIEND</button>}
 <p className="form-notice" role="status">{notice}</p><details className="script-preview"><summary>Text app didn’t prefill everything?</summary><p>Start a new group message manually with your friend ({phone||'their number'}) and Roger ({PHONE_NUMBER}). Some phones do not support prefilled group texts from websites.</p><button type="button" className="secondary-button" onClick={copy}><Copy size={16}/> COPY MESSAGE</button></details>
 <p className="privacy-note">Your friend’s number stays in this page until you open your texting app. Roger can confirm your account details and referral eligibility afterward.</p></div>;
}
