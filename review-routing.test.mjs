import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveSourceReviewOwner } from './review-routing.ts';
const sources=[{id:'policy',revisionId:'p-v2',ownerUserId:'alex'},{id:'soc2',revisionId:'s-v1',ownerUserId:'alex'},{id:'bcp',revisionId:'b-v1',ownerUserId:'jamie'},{id:'unknown',revisionId:'u-v1',ownerUserId:null}];
const eligible=new Set(['alex','jamie']);
test('one owner across several source records receives the review',()=>assert.equal(resolveSourceReviewOwner([{sourceId:'policy'},{sourceRevisionId:'s-v1'}],sources,eligible),'alex'));
test('mixed ownership goes to the admin queue',()=>assert.equal(resolveSourceReviewOwner([{sourceId:'policy'},{sourceId:'bcp'}],sources,eligible),null));
test('missing ownership or evidence never silently chooses another source owner',()=>{
 assert.equal(resolveSourceReviewOwner([{sourceId:'policy'},{sourceId:'unknown'}],sources,eligible),null);
 assert.equal(resolveSourceReviewOwner([{sourceId:'missing'}],sources,eligible),null);
 assert.equal(resolveSourceReviewOwner([],sources,eligible),null);
});
test('revoked or inactive owner is not eligible for automatic assignment',()=>assert.equal(resolveSourceReviewOwner([{sourceId:'policy'}],sources,new Set(['jamie'])),null));
test('source identity survives renewal of the cited revision',()=>assert.equal(resolveSourceReviewOwner([{sourceId:'policy',sourceRevisionId:'p-v1'}],sources,eligible),'alex'));
