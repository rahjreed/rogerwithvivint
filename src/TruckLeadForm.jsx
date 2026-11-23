import React,{useState} from 'react';
import {ArrowRight,CheckCircle2,Mail,ShieldCheck} from 'lucide-react';
import {validateTruckLead} from './truck-lead-validation.js';

export default function TruckLeadForm({claimStartedAt,onDelivered}){
 const [form,setForm]=useState({name:'',phone:'',email:'',zip:'',contactPermission:false,marketingConsent:false,website:''});
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState('');
 const change=(key,value)=>{setForm(previous=>({...previous,[key]:value}));setError('');};
 async function submit(event){
  event.preventDefault();
  if(busy)return;
  const payload={...form,claimStartedAt};
  const checked=validateTruckLead(payload);
  if(!checked.valid){setError(checked.error);return;}
  setBusy(true);setError('');
  try{
   const response=await fetch('/api/truck-lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),cache:'no-store'});
   const result=await response.json().catch(()=>null);
   if(!response.ok||result?.ok!==true){setError(result?.error||'We could not deliver your request. Please try again.');return;}
   onDelivered({name:checked.lead.name});
  }catch{setError('Connection problem: your information was not confirmed as delivered. Please try again.');}
  finally{setBusy(false);}
 }
 return <section className="qr-lead" id="qr-lead" aria-labelledby="qr-lead-heading">
  <div className="qr-lead-heading"><span className="qr-overline"><Mail size={17}/> STEP 2 OF 3 · REQUEST YOUR SPECIAL</span><h2 id="qr-lead-heading">Where Should Roger Send Your Offer Details? 📬</h2><p>You've revealed the offer. Tell me a little about yourself so I can personally check your available options. You can call or text me after your request is received.</p></div>
  <form onSubmit={submit}>
   <div className="qr-lead-fields">
    <label>Full name <span>*</span><input type="text" name="name" autoComplete="name" required maxLength={100} value={form.name} onChange={event=>change('name',event.target.value)} placeholder="Your first and last name"/></label>
    <label>Mobile phone <span>*</span><input type="tel" name="phone" inputMode="tel" autoComplete="tel" required maxLength={30} value={form.phone} onChange={event=>change('phone',event.target.value)} placeholder="(317) 555-0123"/></label>
    <label>Email address <span>*</span><input type="email" name="email" autoComplete="email" required maxLength={180} value={form.email} onChange={event=>change('email',event.target.value)} placeholder="you@example.com"/></label>
    <label>Installation ZIP code <span>*</span><input type="text" inputMode="numeric" name="zip" autoComplete="postal-code" required minLength={5} maxLength={5} pattern="[0-9]{5}" value={form.zip} onChange={event=>change('zip',event.target.value)} placeholder="46038"/></label>
   </div>
   <label className="qr-checkbox"><input type="checkbox" required checked={form.contactPermission} onChange={event=>change('contactPermission',event.target.checked)}/><span>I agree that Roger may contact me by phone, text or email about this specific offer inquiry. <strong>Required to request a personal follow-up.</strong></span></label>
   <label className="qr-checkbox"><input type="checkbox" checked={form.marketingConsent} onChange={event=>change('marketingConsent',event.target.checked)}/><span>I'd also like occasional future offers by email or text (optional). This is not required to request information. I can opt out later.</span></label>
   <div className="qr-honeypot" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" name="website" value={form.website} onChange={event=>change('website',event.target.value)}/></label></div>
   <button className="qr-primary" type="submit" disabled={busy}><CheckCircle2 size={19}/>{busy?'SENDING YOUR REQUEST…':'SEND MY REQUEST & CONTINUE'}<ArrowRight size={17}/></button>
   {error&&<p className="qr-lead-error" role="alert">{error}</p>}
   <p className="qr-lead-fineprint"><ShieldCheck size={16}/> Your information is sent securely to Roger's lead inbox when submission succeeds. It is not posted publicly. The offer and hotel promotion remain conditional and are not guaranteed by submitting this form. We won't show a success screen unless delivery is confirmed.</p>
  </form>
 </section>;
}
