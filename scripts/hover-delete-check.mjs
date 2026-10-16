import assert from 'node:assert/strict';
const {chromium}=await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 const page=await browser.newPage();
 await page.goto('http://127.0.0.1:5174/');
 await page.evaluate(async()=>(await import('/src/section-format.js')).setSectionSize('auto'));
 for(const selector of ['[data-section="standard-skills"] .skill-row','.actions-page .strikes-cantrips-container']) {
  const rows=page.locator(selector), row=rows.first(), button=row.locator(':scope > .remove-row-btn');
  const count=await rows.count();
  await row.scrollIntoViewIfNeeded();
  await page.evaluate(()=>document.activeElement.blur());
  const r=await row.boundingBox(), b=await button.boundingBox();
  const y=b.y+b.height/2;
  await page.mouse.move(r.x+r.width-5,y);
  await page.mouse.move(r.x+r.width+3,y,{steps:10});
  await page.waitForTimeout(350);
  assert.equal(await button.evaluate(el=>getComputedStyle(el).opacity),'1',selector+' stays visible across gap');
  await page.mouse.move(b.x+b.width/2,y,{steps:10});
  await page.waitForTimeout(350);
  assert.equal(await button.evaluate(el=>getComputedStyle(el).pointerEvents),'auto');
  await page.mouse.click(b.x+b.width/2,y);
  assert.equal(await rows.count(),count-1);
 }
 console.log('Delete buttons remain visible and clickable while crossing the gap for skills and action blocks, without field focus.');
} finally {await browser.close();}
