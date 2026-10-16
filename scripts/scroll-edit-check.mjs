import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const {chromium}=await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1280,height:720}});
 await page.goto('http://127.0.0.1:5174/');
 const data=JSON.parse(readFileSync('src/templates/bard_liora_vey_full_build.json','utf8'));
 await page.evaluate(async data=>(await import('/src/io.js')).loadFromJSON(JSON.stringify(data)),data);
 await page.evaluate(()=>document.fonts.ready);

 for(const mode of ['fixed','auto']) {
 await page.evaluate(async mode=>(await import('/src/section-format.js')).setSectionSize(mode),mode);
 for(const section of ['class-features','species-features','instinct-abilities','additional-features']) {
 const field=page.locator(`[data-section="${section}"] .section-content`).first();
 await field.click(); await page.keyboard.press('Control+End'); await page.waitForTimeout(200);
 const snap=()=>page.evaluate(()=>({scroll:document.querySelector('.main-area').scrollTop, inner:[...document.querySelectorAll('.a4-page')].map(x=>x.scrollTop),focus:document.activeElement.closest('[data-section]')?.dataset.section}));
 const before=await snap();
 await page.keyboard.type(' Some new feature text.',{delay:40});
 await page.waitForTimeout(200);
 assert.deepEqual(await snap(),before, mode + ' ' + section + ': editing must preserve scrolling and focus');
 }
 }
 console.log('Feature editing preserves scrolling and focus in fixed and auto sizing.');
} finally {await browser.close();}



