import assert from 'node:assert/strict';
const { chromium } = await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5174/');
  for (const mode of ['fixed', 'auto']) {
    await page.evaluate(async mode => (await import('/src/section-format.js')).setSectionSize(mode), mode);
    const block = page.locator('.strikes-cantrips-container').first();
    const rows = block.locator('tbody tr');
    const count = await rows.count();
    await block.locator('.strikes-cantrips-table-line').hover();
    const add = block.locator('.add-strikes-table-row-btn');
    assert(await add.isVisible(), `${mode}: add weapon button visible`);
    await add.click();
    assert.equal(await rows.count(), count + 1);
    await block.locator('.remove-strikes-table-row-btn').click();
    assert.equal(await rows.count(), count);
    if (mode === 'fixed') {
      assert.equal(await page.locator('.actions-page .strikes-cantrips-container').count(), 4);
      assert(!(await block.locator(':scope > .add-row-btn').isVisible()));
    }
  }
  console.log('Weapon rows can be added and removed on hover in fixed and auto modes; fixed action limit remains.');
} finally { await browser.close(); }
