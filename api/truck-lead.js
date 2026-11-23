import {validateTruckLead} from '../src/truck-lead-validation.js';

export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({ok:false,error:'Method not allowed.'});}
 const origin=req.headers.origin;
 const host=req.headers.host;
 if(origin){let originHost;try{originHost=new URL(origin).host;}catch{return res.status(403).json({ok:false,error:'Invalid request origin.'});}
  if(!host||originHost!==host)return res.status(403).json({ok:false,error:'Cross-site requests are not accepted.'});
 }
 if(!String(req.headers['content-type']||'').toLowerCase().startsWith('application/json'))return res.status(415).json({ok:false,error:'Send a JSON request.'});
 const raw=typeof req.body==='string'?(()=>{try{return JSON.parse(req.body);}catch{return null;}})():req.body;
 const {valid,lead,error}=validateTruckLead(raw);
 if(!valid)return res.status(400).json({ok:false,error});
 const key=process.env.RESEND_API_KEY;
 const from=process.env.TRUCK_LEAD_FROM_EMAIL;
 const to=process.env.TRUCK_LEAD_TO_EMAIL;
 if(!key||!from||!to)return res.status(503).json({ok:false,error:'Lead submissions are not available yet. Please try again later.'});
 const safe=value=>String(value).replace(/[\r\n\u0000-\u001f]/g,' ').trim();
 const note=[
 'NEW TRUCK QR FUNNEL INQUIRY','',
 'Name: '+safe(lead.name),
 'Phone: '+safe(lead.phone),
 'Email: '+safe(lead.email),
 'ZIP: '+safe(lead.zip),
 'Contact permission: Yes — about their requested quote/offer',
 'Optional future marketing consent: '+(lead.marketingConsent?'Yes':'No'),
 'Offer reveal timestamp (client reported): '+(lead.claimStartedAt?new Date(lead.claimStartedAt).toISOString():'Not provided'),
 'Source: Roger With Vivint /truck QR funnel',
 'Submitted at: '+new Date().toISOString(),
 '',
 'Verify the customer request and any applicable promotion before quoting prices or hotel rewards.'
 ].join('\n');
 try{
  const response=await fetch('https://api.resend.com/emails',{
   method:'POST',
   headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},
   body:JSON.stringify({from,to:[to],reply_to:lead.email,subject:'Truck QR lead: '+safe(lead.name),text:note})
  });
  if(!response.ok){return res.status(502).json({ok:false,error:'The lead could not be delivered. Please try again.'});}
  const receipt=await response.json().catch(()=>({}));
  if(!receipt.id)return res.status(502).json({ok:false,error:'The lead could not be confirmed. Please try again.'});
  return res.status(200).json({ok:true});
 }catch{
  return res.status(502).json({ok:false,error:'The lead service is temporarily unavailable. Please try again.'});
 }
}
