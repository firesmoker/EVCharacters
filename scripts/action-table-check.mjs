import assert from 'node:assert/strict';
const { chromium } = await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5174/');
  await page.evaluate(async () => {
    const { tidyCharacterContent } = await import('/src/sheet-content.js');
    const { default: records } = await import('/src/action-extraction.json');
    const ram = records.find(a => a.name === 'Ram');
    const data = { sections: {
      'Class Features': { sectionBody: `<p><b>You gain the following action:</b></p><p>fa${ram.raw.replaceAll('\n', '')}</p><p>Keep this independent benefit.</p>` },
      'Strikes & Damaging Cantrips': { dynamicRows: [{ slots: { name: 'Charge' }, variants: ['<strong>Ram:</strong> Full rules here.'] }] },
    } };
    const result = tidyCharacterContent(data).sections['Class Features'].sectionBody;
    if (result.includes('Perform a Charge') || result.includes('faRam') || result.includes('following action')) throw Error('Saved feature still duplicates Ram');
    if (!result.includes('You gain the Ram variant.') || !result.includes('Keep this independent benefit.')) throw Error('Cleanup removed a separate benefit');
    const standalone = { sections: { 'Class Features': { sectionBody: `<p>fa${ram.raw.replaceAll('\n', '')}</p>` } } };
    const full = tidyCharacterContent(standalone).sections['Class Features'].sectionBody;
    if (!full.includes('Perform a Charge') || full.includes('faRam')) throw Error('Unrepresented action must retain readable rules');
  });
  await page.evaluate(async () => {
    const io = await import('/src/io.js');
    const sheet = JSON.parse(io.serializeSheet());
    sheet.sections['Strikes & Damaging Cantrips'].dynamicRows = [{
      type: 'action', slots: { name: 'Charge', rollDescription: '', notes: 'Average Action ◆ Uses movement<br>Double your Movement score.<br>Move as close as possible.' },
      tableRows: [{ speed: 'Average' }], variants: [], ui: { variantsHidden: true },
    }];
    io.loadFromJSON(JSON.stringify(sheet));
  });
  const action = page.locator('.strikes-cantrips-container').filter({ has: page.locator('[data-slot="name"]', { hasText: 'Charge' }) }).first();
  assert.equal(await action.locator('[data-slot="notes"]').innerText(), 'Double your Movement score.\nMove as close as possible.');
  assert.equal(await action.locator('[data-slot="rollDescription"]').innerText(), 'Average Action ◆ Uses movement');
  assert.equal(await action.locator('.strikes-cantrips-table-line').isVisible(), false);
  await action.hover();
  await action.locator('.action-table-toggle-btn').click();
  assert.equal(await action.locator('.strikes-cantrips-table-line').isVisible(), true);
  await action.locator('.action-table-toggle-btn').click();
  assert.equal(await action.locator('.strikes-cantrips-table-line').isVisible(), false);
  await page.evaluate(async () => { const io = await import('/src/io.js'); io.loadFromJSON(io.serializeSheet()); });
  assert.equal(await action.locator('.strikes-cantrips-table-line').isVisible(), false);
  await page.emulateMedia({ media: 'print' });
  assert.equal(await action.locator('.action-table-toggle-btn').isVisible(), false);
  assert.equal(await action.locator('[data-slot="rollDescription"]').isVisible(), true);
  console.log('Legacy action text, table toggle, persistence, and print visibility passed.');
} finally { await browser.close(); }
