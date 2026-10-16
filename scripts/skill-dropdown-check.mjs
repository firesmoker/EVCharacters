import assert from 'node:assert/strict';
const { chromium } = await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({channel:'msedge',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1400,height:1000}});
 await page.goto('http://127.0.0.1:5174/');
 for(const mode of ['fixed','auto']) {
  await page.evaluate(async mode=>{const {setSectionSize}=await import('/src/section-format.js'); const {paginateSheets}=await import('/src/sheet-tools.js'); setSectionSize(mode); paginateSheets();},mode);
  for(const section of ['standard-skills','combat-skills']) {
   const input=page.locator(`[data-section="${section}"] .autocomplete-wrapper input`).last();
   const size=()=>input.evaluate(el=>getComputedStyle(el).fontSize);
   const before=await size();
   await input.click();
   await page.evaluate(async()=>{await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame);});
   assert.equal(await size(),before,`${mode} ${section}: opening dropdown changes skill font`);
   const menu=page.locator(`[data-section="${section}"] .suggestions-dropdown`).last();
   assert(await menu.isVisible());
   const item=menu.locator('.suggestion-item').first();
   assert(parseFloat(await item.evaluate(el=>getComputedStyle(el).fontSize))>=13);
   const selected=await item.innerText();
   await item.click();
   assert.equal(await input.inputValue(),selected.trim());
  }
 }
 console.log('Skill dropdowns preserve field sizes and allow selection in fixed and auto modes.');
} finally {await browser.close();}
