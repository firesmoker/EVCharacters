import assert from 'node:assert/strict';
const {chromium}=await import(process.env.EV_PLAYWRIGHT_MODULE||'playwright');const browser=await chromium.launch({channel:'msedge',headless:true});
try{const page=await browser.newPage();await page.goto('http://127.0.0.1:5174/');
const result=await page.evaluate(async()=>{
const io=await import('/src/io.js'),t=await import('/src/sheet-tools.js'),f=await import('/src/section-format.js');
t.initSheetTools();io.prepareSheetForData(true);await document.fonts.ready;t.paginateSheets();
const read=()=>['standard-skills','spells-known','equipment-proficiencies'].map(name=>{
const box=document.querySelector(`[data-section="${name}"]`),list=box.querySelector('.dynamic-rows'),content=box.querySelector('.section-content');
return {name,rows:list?.children.length,height:box.getBoundingClientRect().height,fit:!list||list.lastElementChild.getBoundingClientRect().bottom<=box.getBoundingClientRect().bottom};});
const smart=!f.isFixedSize(),before=read();const equip=document.querySelector('[data-section="equipment-proficiencies"]');equip.style.removeProperty('height');const minimal= equip.getBoundingClientRect().height;
const input=document.querySelector('[data-section="standard-skills"] input');input.value='Athletics';input.dispatchEvent(new Event('input',{bubbles:true}));t.paginateSheets();
const saved=io.serializeSheet();io.loadFromJSON(saved);t.paginateSheets();const preserved=document.querySelector('[data-section="standard-skills"] input').value;
const old=JSON.parse(saved);delete old.preferences.sectionSize;io.loadFromJSON(JSON.stringify(old));const fallback=!f.isFixedSize();
old.preferences.sectionSize='fixed';io.loadFromJSON(JSON.stringify(old));const explicit=f.isFixedSize();
return {smart,before,minimal,preserved,fallback,explicit};});
assert(result.smart&&result.fallback&&result.explicit);assert.equal(result.preserved,'Athletics');assert(result.before.every(x=>x.fit),JSON.stringify(result));assert(result.before[0].rows>1);assert(result.before[1].rows>1);assert(Math.abs(result.before[2].height-result.minimal)<2,JSON.stringify(result));console.log(JSON.stringify(result));
}finally{await browser.close();}


