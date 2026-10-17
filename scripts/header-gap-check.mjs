import assert from 'node:assert/strict';
const {chromium}=await import(process.env.EV_PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 const page=await browser.newPage();await page.goto('http://127.0.0.1:5174/');await page.evaluate(()=>document.fonts.ready);
 const gaps=await page.evaluate(()=>{
  const rect=s=>document.querySelector(s).getBoundingClientRect();
  const health=rect('.health-panel');
  return {above:health.top-rect('[data-sync-id="class"]').bottom,below:rect('[data-section="damage-defenses"]').top-health.bottom};
 });
 assert(Math.abs(gaps.above-gaps.below)<1,JSON.stringify(gaps));
 console.log('Visible gaps match:',gaps);
}finally{await browser.close();}
