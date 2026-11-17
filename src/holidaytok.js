export const CLAIM_MS = 7 * 86400000;
export const KEY = 'roger-holidaytok-v1';
export const validCode = value => String(value).trim().replace(/\s+/g,'').toUpperCase() === 'HOLIDAYTOK';
export function readClaim(storage) { try { const raw=storage.getItem(KEY); const n=Number(raw); return raw && Number.isFinite(n) && n>0 ? n : null; } catch { return null; } }
export function unlockClaim(storage, code, now=Date.now()) { if(!validCode(code)) return null; const existing=readClaim(storage); if(existing) return existing; storage.setItem(KEY,String(now)); if(readClaim(storage)!==now) throw Error('Unable to save claim'); return now; }
export function timeLeft(start,now=Date.now()) { const ms=Math.max(0,Math.min(CLAIM_MS,start+CLAIM_MS-now)); const s=Math.ceil(ms/1000); return {expired:ms===0,days:Math.floor(s/86400),hours:Math.floor(s/3600)%24,minutes:Math.floor(s/60)%60,seconds:s%60}; }
