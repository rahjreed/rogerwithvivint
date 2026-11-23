import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeTruckLead,validateTruckLead} from '../src/truck-lead-validation.js';

const valid={name:'Test Homeowner',phone:'317-555-0123',email:'test@example.com',zip:'46038',contactPermission:true,marketingConsent:false,website:''};
test('lead must have full contact details and permission to reply',()=>{
 assert.equal(validateTruckLead(valid).valid,true);
 for(const key of ['name','phone','email','zip'])assert.equal(validateTruckLead({...valid,[key]:''}).valid,false,key);
 assert.equal(validateTruckLead({...valid,contactPermission:false}).valid,false);
});
test('marketing consent is optional and not implied',()=>{
 const result=validateTruckLead(valid);
 assert.equal(result.valid,true);assert.equal(result.lead.marketingConsent,false);
 assert.equal(normalizeTruckLead({...valid,marketingConsent:true}).marketingConsent,true);
});
test('rejects spam honeypot and invalid US numbers',()=>{
 assert.equal(validateTruckLead({...valid,website:'https://spam.example'}).valid,false);
 assert.equal(validateTruckLead({...valid,phone:'123'}).valid,false);
 assert.equal(validateTruckLead({...valid,zip:'bad'}).valid,false);
});
