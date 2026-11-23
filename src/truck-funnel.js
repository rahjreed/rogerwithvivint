export const TRUCK_CLAIM_KEY='roger-truck-qr-claim-v1';
export const TRUCK_CLAIM_MS=7*86400000;
export const validTruckCode=value=>['317','463'].includes(String(value).trim());
export function readTruckClaim(storage){try{const raw=storage.getItem(TRUCK_CLAIM_KEY);const n=Number(raw);return raw&&Number.isFinite(n)&&n>0?n:null;}catch{return null;}}
export function unlockTruckClaim(storage,code,now=Date.now()){
 if(!validTruckCode(code))return null;
 const existing=readTruckClaim(storage);
 if(existing)return existing;
 storage.setItem(TRUCK_CLAIM_KEY,String(now));
 if(readTruckClaim(storage)!==now)throw Error('Claim could not be saved');
 return now;
}
export function truckTimeLeft(start,now=Date.now()){
 const ms=Math.max(0,Math.min(TRUCK_CLAIM_MS,start+TRUCK_CLAIM_MS-now));
 const s=Math.ceil(ms/1000);
 return {expired:ms===0,days:Math.floor(s/86400),hours:Math.floor(s/3600)%24,minutes:Math.floor(s/60)%60,seconds:s%60};
}
