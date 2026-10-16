import assert from 'node:assert/strict';
const { chromium } = await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({channel:'msedge',headless:true});
try {
 const page=await browser.newPage();
 await page.goto('http://127.0.0.1:5174/');
 const original=[['2','Zebra','2','keep Z'],['Cantrip','Light','','keep L'],['1','Bless','1','keep B'],['Cantrip','Acid Spray','','keep A'],['10','Future','10','keep F'],['2','Alpha','2','keep alpha']];
 for(const mode of ['fixed','auto']) {
  await page.evaluate(async ({mode,original})=>{
   const {loadFromJSON}=await import('/src/io.js');
   loadFromJSON(JSON.stringify({preferences:{sectionSize:mode},sections:{'Spells Known':{dynamicRows:original.map(values=>({type:'skill',values}))}}}));
  },{mode,original});
  const section=page.locator('[data-section="spells-known"]');
  const rows=()=>section.locator('.dynamic-rows > .skill-row').evaluateAll(rows=>rows.map(row=>[...row.querySelectorAll('input')].map(el=>el.value)).filter(values=>values[1]));
  assert.deepEqual(await rows(),original);
  await section.hover();
  const button=section.getByRole('button',{name:'Sort spells by rank, then name'});
  await button.click();
  assert.deepEqual(await rows(),[original[3],original[1],original[2],original[5],original[0],original[4]]);
  await page.keyboard.press('Control+z');
  assert.deepEqual(await rows(),original);
  await page.keyboard.press('Control+y');
  assert.equal((await rows())[0][1],'Acid Spray');
  await page.emulateMedia({media:'print'});
  assert(!(await button.isVisible()));
  await page.emulateMedia({media:'screen'});
 }
 console.log('Spell sorting: ranks, alphabetical order, associated costs/notes, undo/redo, both sizing modes, and print hiding passed.');
} finally {await browser.close();}
