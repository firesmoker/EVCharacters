import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const {chromium}=await import(process.env.EV_PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:5174/');
 const data=JSON.parse(readFileSync('src/templates/bard_liora_vey_full_build.json'));
 const result=await page.evaluate(async data=>{
  const io=await import('/src/io.js'), tools=await import('/src/sheet-tools.js'), format=await import('/src/section-format.js');
  const key='Strikes & Damaging Cantrips';
  const base=data.sections[key].dynamicRows[0];
  data.sections[key].dynamicRows=Array.from({length:9},(_,i)=>({...structuredClone(base),slots:{...base.slots,name:`Action ${i+1}`}}));
  data.preferences.sectionSize='fixed';
  tools.initSheetTools();io.loadFromJSON(JSON.stringify(data));await document.fonts.ready;tools.paginateSheets();
  const counts=()=>[...document.querySelectorAll('.actions-page .dynamic-rows')].map(n=>n.children.length);
  const names=()=>JSON.parse(io.serializeSheet()).sections[key].dynamicRows.map(r=>r.slots.name);
  const first={counts:counts(),names:names(),fixed:format.isFixedSize(),pages:[...document.querySelectorAll('.a4-page:not(.spell-page)')].map(p=>p.className),instincts:document.querySelectorAll('[data-section="instinct-abilities"]').length};
  io.loadFromJSON(io.serializeSheet());tools.paginateSheets();const reloaded={counts:counts(),names:names()};
  format.setSectionSize('auto');tools.paginateSheets();const auto={counts:counts(),names:names()};
  format.setSectionSize('fixed');tools.paginateSheets();const fixedAgain=counts();
  io.prepareSheetForData(true);tools.paginateSheets();const reset=counts();
  return {first,reloaded,auto,fixedAgain,reset};
 },data);
 assert(result.first.fixed);assert.deepEqual(result.first.counts,[4,4,1]);
 assert.equal(result.first.instincts,1);
 assert(result.first.pages.slice(1,4).every(x=>x.includes('actions-page')));
 const names=Array.from({length:9},(_,i)=>`Action ${i+1}`);
 for(const state of [result.first,result.reloaded,result.auto])assert.deepEqual(state.names,names);
 assert.deepEqual(result.reloaded.counts,[4,4,1]);assert.deepEqual(result.auto.counts,[9]);assert.deepEqual(result.fixedAgain,[4,4,1]);assert.deepEqual(result.reset,[4]);
 console.log('Action continuation pages, order, save/reload, mode switching and reset passed.');
}finally{await browser.close();}
