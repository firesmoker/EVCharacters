import assert from 'node:assert/strict';
const {chromium}=await import(process.env.EV_PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:5174/');
 await page.evaluate(async()=>{
  const io=await import('/src/io.js'),format=await import('/src/section-format.js');
  io.prepareSheetForData(true);format.setSectionSize('auto');
  for(const name of ['additional-features','feats']) document.querySelector(`[data-section="${name}"] .section-content`).innerHTML='<p>Short text.</p>';
  document.dispatchEvent(new Event('input',{bubbles:true}));await document.fonts.ready;
 });
 const sizes=()=>page.evaluate(()=>Object.fromEntries(['additional-features','feats'].map(name=>{
  const box=document.querySelector(`[data-section="${name}"]`),content=box.querySelector('.section-content');
  return [name,{height:box.getBoundingClientRect().height,font:parseFloat(getComputedStyle(content).fontSize),bottom:box.getBoundingClientRect().bottom,limit:box.closest('.a4-page').getBoundingClientRect().bottom-36}];
 })));
 await page.waitForTimeout(150);const before=await sizes();
 await page.locator('[data-section="additional-features"] .section-content').fill(Array.from({length:28},(_,i)=>`Feature line ${i+1}.`).join('\n'));
 await page.waitForTimeout(150);const after=await sizes();
 assert(after['additional-features'].height>before['additional-features'].height+30,JSON.stringify({before,after}));
 assert(after.feats.height<before.feats.height-30,JSON.stringify({before,after}));
 assert.equal(after['additional-features'].font,before['additional-features'].font);
 assert(after.feats.bottom<=after.feats.limit+1,JSON.stringify(after));
 await page.locator('[data-section="additional-features"] .section-content').fill('Short text.');
 await page.waitForTimeout(150);const restored=await sizes();
 assert(Math.abs(restored.feats.height-before.feats.height)<2);
 console.log('Typing reclaims spare neighboring space, preserves font size, fits A4, and restores space on deletion.');
}finally{await browser.close();}
