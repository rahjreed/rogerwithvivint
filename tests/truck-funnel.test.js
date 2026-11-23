import test from 'node:test';
import assert from 'node:assert/strict';
import {TRUCK_CLAIM_KEY,TRUCK_CLAIM_MS,readTruckClaim,unlockTruckClaim,truckTimeLeft,validTruckCode} from '../src/truck-funnel.js';
const storage=()=>{const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};};
test('accepts local Indy area codes but not arbitrary codes',()=>{assert.equal(validTruckCode('317'),true);assert.equal(validTruckCode(' 463 '),true);assert.equal(validTruckCode('212'),false);});
test('sets the claim only once even when unlocked again',()=>{const store=storage();assert.equal(readTruckClaim(store),null);assert.equal(unlockTruckClaim(store,'317',100000),100000);assert.equal(unlockTruckClaim(store,'463',200000),100000);assert.equal(store.getItem(TRUCK_CLAIM_KEY),'100000');});
test('displays seven-day countdown without resetting after expiry',()=>{const start=100000;assert.equal(truckTimeLeft(start,start).days,7);assert.equal(truckTimeLeft(start,start+TRUCK_CLAIM_MS-1000).seconds,1);assert.equal(truckTimeLeft(start,start+TRUCK_CLAIM_MS).expired,true);assert.equal(truckTimeLeft(start,start+TRUCK_CLAIM_MS+5000).days,0);});
