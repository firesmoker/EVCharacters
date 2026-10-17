import assert from 'node:assert/strict';
const {chromium}=await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try {
  const page=await browser.newPage({viewport:{width:1300,height:1000}});
  await page.goto('http://127.0.0.1:5174/');
  const section=page.locator('[data-section="spellcasting"]');
  for(const mode of ['fixed','auto']) {
    await page.evaluate(async mode=>{
      const io=await import('/src/io.js');const data=JSON.parse(io.serializeSheet());
      data.preferences.sectionSize=mode;
      data.sections.Spellcasting.splitFields['Spell Points']={cur:'12',max:'22',temp:'3'};
      data.sections.Spellcasting.checkboxes={Arcane:true,Bardic:false,Divine:true,Nature:false,Occult:true,Chrono:true,Necromancy:true};
      io.loadFromJSON(JSON.stringify(data));
      io.loadFromJSON(io.serializeSheet());
    },mode);
    await section.scrollIntoViewIfNeeded();
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(250);
    const result=await section.evaluate(el=>{
      const panel=el.querySelector('.traditions-panel').getBoundingClientRect();
      return {height:el.getBoundingClientRect().height,overflow:[...el.querySelectorAll('.editable-field')].map(f=>f.getBoundingClientRect().bottom-el.getBoundingClientRect().bottom),width:el.getBoundingClientRect().width,panelWidth:panel.width,
        choices:[...el.querySelectorAll('.tradition-choice')].map(label=>({name:label.innerText.trim(),checked:label.querySelector('input').checked,icon:label.querySelector('use').getAttribute('href'),fits:label.lastElementChild.getBoundingClientRect().right<=label.getBoundingClientRect().right+1})),
        contained:[...el.querySelectorAll('.editable-field')].every(f=>f.getBoundingClientRect().bottom<=el.getBoundingClientRect().bottom-2),
        fields:[...el.querySelectorAll('[data-split-part]')].map(f=>f.innerText)};
    });
    assert.equal(result.choices.length,7);
    assert.equal(new Set(result.choices.map(c=>c.icon)).size,7);
    assert(result.choices.every(c=>c.fits),JSON.stringify(result));
    assert(result.panelWidth>result.width/2);
    assert(result.contained, `${mode}: Fields must stay inside the section border: ${JSON.stringify(result)}`);
    assert.deepEqual(result.fields,['12','22','3']);
    assert.deepEqual(result.choices.filter(c=>c.checked).map(c=>c.name),['Arcane','Divine','Occult','Chrono','Necromancy']);
    await section.screenshot({path:`C:/Users/eylon/.codex/visualizations/2026/09/15/01a0a530-6d6f-7f31-829c-b3c870dfb2f5/spellcasting-${mode}.png`});
  }
  await page.emulateMedia({media:'print'});
  assert(await section.locator('.tradition-icon').first().isVisible());
  console.log('Tradition icons, fixed/auto layout, saved values and print visibility passed.');
}finally{await browser.close();}
