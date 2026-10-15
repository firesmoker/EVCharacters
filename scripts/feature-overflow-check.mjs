import assert from 'node:assert/strict';
const { chromium } = await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5174/');
  const result = await page.evaluate(async () => {
    const { tidyCharacterContent } = await import('/src/sheet-content.js');
    const make = count => ({ sections: { 'Class Features': {sectionBody: Array.from({length:count}, (_,i)=>`<p><strong>Feature ${i}</strong></p><p>${'Useful feature description. '.repeat(8)}</p>`).join('')} } });
    const moderate = tidyCharacterContent(make(5));
    const large = tidyCharacterContent(make(30));
    const first = JSON.stringify(large);
    tidyCharacterContent(large);
    const recovered = tidyCharacterContent({sections:{'Class Features':{sectionBody:'<p><strong>Level 1: Student of Magic</strong></p><p>Reveal a spell.</p>'},'Additional Features':{sectionBody:'<p><strong>Level 2: Fae Familiar</strong></p><p>A magical companion.</p>'}}});
    return {moderateMoved:!!moderate.sections['Additional Features']?.sectionBody,largeMoved:!!large.sections['Additional Features']?.sectionBody, stable:first===JSON.stringify(large), recovered:recovered.sections['Class Features'].sectionBody.includes('Fae Familiar') && !recovered.sections['Additional Features'].sectionBody};
  });
  assert.deepEqual(result,{moderateMoved:false,largeMoved:true,stable:true,recovered:true});
  console.log('Feature overflow: moderate content stays, substantial overflow moves, reload is stable, premature familiar move is repaired.');
} finally { await browser.close(); }
