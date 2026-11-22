import React,{useState} from 'react';
import {Copy,MessageSquare,Users} from 'lucide-react';
import {PHONE_NUMBER} from './brand.jsx';
import {copyText} from './clipboard.js';
import {normalizePhone,referralDraft} from './group-referral.js';

// Works entirely in the customer's browser; no phone numbers are transmitted to our server.
export default function MarketingGroupReferral({message,setMessage}){
 const [friendPhone,setFriendPhone]=useState('');
 const [notice,setNotice]=useState('');
 const isIphone=/iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 async function prepare(e){
  e.preventDefault();
  const body=message.trim();
  if(!body){setNotice('Enter an introduction before continuing.');return}
  if(isIphone){
   const copied=await copyText(body);
   setNotice(copied?'Introduction copied! In Messages, tap New Message, add Roger ('+PHONE_NUMBER+') and your friend, paste the introduction and send.':'Copy unavailable. Select the introduction text and copy it manually. Then start a new group message to Roger and your friend.');
   return;
  }
  const other=normalizePhone(friendPhone);
  if(!other||other===normalizePhone(PHONE_NUMBER)){
   setNotice('Enter a valid US phone number for your friend, different from Roger’s.');
   return;
  }
  setNotice('Opening your text app. Check that both your friend and Roger ('+PHONE_NUMBER+') appear as recipients before sending. No message has been sent yet.');
  window.location.href=referralDraft(PHONE_NUMBER,other,body,navigator.userAgent);
 }
 return <section className="marketing-group-tool" id="marketing-group-tool" aria-labelledby="marketing-group-tool-heading">
  <div className="marketing-group-heading"><div className="marketing-group-icon"><Users size={22}/></div><div><span className="marketing-eyebrow">GROUP TEXT REFERRAL TOOL</span><h2 id="marketing-group-tool-heading">Connect a friend with Roger</h2><p>Make a three-way introduction directly from your Marketing Back Office. No need to leave the dashboard to find the referral form.</p></div></div>
  <form onSubmit={prepare}>
   {!isIphone&&<div className="marketing-group-field"><label htmlFor="marketing-friend-phone">Friend’s phone number</label><input id="marketing-friend-phone" type="tel" inputMode="tel" autoComplete="off" required placeholder="(317) 555-0123" value={friendPhone} onChange={e=>{setFriendPhone(e.target.value);setNotice('')}}/><small>Roger ({PHONE_NUMBER}) will be included automatically.</small></div>}
   <div className="marketing-group-field"><label htmlFor="marketing-group-message">Your introduction</label><textarea id="marketing-group-message" rows={5} required value={message} onChange={e=>{setMessage(e.target.value);setNotice('')}}/><small>Edit this message to sound like you. Only include someone who has agreed to be introduced.</small></div>
   {isIphone&&<div className="marketing-group-iphone"><strong>iPhone: Start a fresh group conversation</strong><p>Copy the introduction, open Messages, tap New Message, and add Roger ({PHONE_NUMBER}) plus your friend from Contacts. Paste and send. You cannot add a friend to an existing one-to-one thread with Roger.</p></div>}
   <button type="submit" className="marketing-group-action">{isIphone?<Copy size={18}/>:<MessageSquare size={18}/>} {isIphone?'COPY INTRODUCTION':'OPEN GROUP TEXT'}</button>
   <p className="marketing-group-notice" role="status">{notice}</p>
  </form>
  <p className="marketing-group-privacy">Your friend's phone number stays on this page until your phone opens its messaging app. This tool does not send a text for you.</p>
 </section>;
}
