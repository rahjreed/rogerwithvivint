export function normalizeTruckLead(input){
 const body=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
 return {
  name:String(body.name||'').trim().replace(/\s+/g,' ').slice(0,100),
  phone:String(body.phone||'').trim().slice(0,30),
  email:String(body.email||'').trim().toLowerCase().slice(0,180),
  zip:String(body.zip||'').trim().slice(0,12),
  contactPermission:body.contactPermission===true,
  marketingConsent:body.marketingConsent===true,
  website:String(body.website||'').trim().slice(0,100),
  claimStartedAt:Number.isFinite(Number(body.claimStartedAt))&&Number(body.claimStartedAt)>0&&Number(body.claimStartedAt)<8640000000000000?Number(body.claimStartedAt):null
 };
}
export function validateTruckLead(raw){
 const lead=normalizeTruckLead(raw);
 if(lead.website)return {valid:false,error:'Unable to process this request.'};
 if(lead.name.length<2||lead.name.length>100)return {valid:false,error:'Enter your full name.'};
 const phoneDigits=lead.phone.replace(/\D/g,'');
 if(!/^(1)?\d{10}$/.test(phoneDigits))return {valid:false,error:'Enter a valid US phone number.'};
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)||lead.email.length>180)return {valid:false,error:'Enter a valid email address.'};
 if(!/^\d{5}$/.test(lead.zip))return {valid:false,error:'Enter a five-digit ZIP code.'};
 if(!lead.contactPermission)return {valid:false,error:'Please confirm we may contact you about this request.'};
 return {valid:true,lead:{...lead,phone:phoneDigits.length===11?phoneDigits.slice(1):phoneDigits}};
}
