import assert from 'node:assert/strict';
const {chromium}=await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 const page=await browser.newPage();
 await page.goto('http://127.0.0.1:5174/');
 await page.evaluate(()=>{
  window.savedSheets=[];
  window.showSaveFilePicker=async options=>({createWritable:async()=>({write:async json=>window.savedSheets.push({options,data:JSON.parse(json)}),close:async()=>{}})});
 });
 await page.locator('[data-sync-id="character-name"]').first().fill('Save Test');
 const feature=page.locator('[data-section="class-features"] .section-content');
 await feature.fill('Latest unsaved text');
 await page.keyboard.press('Control+s');
 await page.waitForFunction(()=>window.savedSheets.length===1);
 const saved=await page.evaluate(()=>window.savedSheets[0]);
 assert.equal(saved.options.suggestedName,'save_test.json');
 assert(saved.data.sections['Class Features'].sectionBody.includes('Latest unsaved text'));
 const prevented=await page.evaluate(()=>{
  document.activeElement.blur();
  const event=new KeyboardEvent('keydown',{key:'s',metaKey:true,bubbles:true,cancelable:true});
  document.body.dispatchEvent(event);
  return event.defaultPrevented;
 });
 assert(prevented);
 await page.waitForFunction(()=>window.savedSheets.length===2);
 console.log('Ctrl+S saves current edits; Cmd+S works outside fields and prevents browser Save Page.');
} finally {await browser.close();}
