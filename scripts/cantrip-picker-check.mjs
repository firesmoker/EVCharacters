import assert from 'node:assert/strict';
const {chromium}=await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
 const page=await browser.newPage();
 await page.goto(process.env.EV_TEST_URL || 'http://127.0.0.1:5174/');
 const blocks=page.locator('.actions-page .strikes-cantrips-container');
 assert.equal(await blocks.count(),4);
 await page.locator('[data-section="combat-skills"] .skill-row').first().locator('input.skill-bonus').fill('Expert (5d6)');
 await page.locator('[data-sync-id="subclass"]').first().fill('War Mage');
 const block=blocks.first();
 await block.hover();
 await block.getByRole('button',{name:'Choose a cantrip',exact:true}).click();
 await page.getByRole('dialog',{name:'Choose a cantrip'}).getByRole('combobox').selectOption('Elemental Flare');
 await page.getByRole('button',{name:'Fill action block'}).click();
 assert.equal(await block.locator('[data-slot="name"]').innerText(),'Elemental Flare');
 assert.equal(await block.locator('[data-slot="roll"]').innerText(),'8d6');
 assert.equal(await block.locator('[data-slot="speed"]').innerText(),'Fast');
 assert.equal(await block.locator('[data-slot="doubleSix"]').innerText(),'See notes');
 assert.match(await block.locator('[data-slot="notes"]').innerText(),/Double 6:/);
 assert.equal(await block.locator('[data-slot="notes"] ul > li').count(),3);
 assert(!await block.locator('[data-slot="notes"]').innerText().then(text=>text.includes('•')));
 await page.keyboard.press('Control+z');
 assert.equal(await block.locator('[data-slot="name"]').innerText(),'');
 await page.keyboard.press('Control+y');
 assert.equal(await block.locator('[data-slot="name"]').innerText(),'Elemental Flare');
 await block.hover();
 await block.getByRole('button',{name:'Choose a cantrip',exact:true}).click();
 await page.getByRole('button',{name:'Cancel',exact:true}).click();
 assert.equal(await block.locator('[data-slot="name"]').innerText(),'Elemental Flare');
 await page.evaluate(async()=>{
  const io=await import('/src/io.js'); const saved=io.serializeSheet(); io.loadFromJSON(saved);
 });
 assert.equal(await block.locator('[data-slot="name"]').innerText(),'Elemental Flare');
 page.on('dialog',dialog=>dialog.accept());
 await page.evaluate(async()=>{
  const format=await import('/src/section-format.js'); format.setSectionSize('auto');
  const {renderStrikesDamagingCantripsBlock}=await import('/src/components.js');
  const list=document.querySelector('.actions-page .dynamic-rows');
  list.insertAdjacentHTML('beforeend',renderStrikesDamagingCantripsBlock());
  list.lastElementChild.querySelector('[data-slot="name"]').textContent='Keep fifth action';
  format.setSectionSize('fixed');
 });
 assert.equal(await blocks.count(),5);
 assert.equal(await page.locator('html').getAttribute('data-section-size'),'fixed');
 console.log('Cantrip fill, current Magic/War Mage, long Double 6, undo/redo, cancel, persistence, four fixed blocks and preservation of a populated fifth passed.');
} finally {await browser.close();}
