import assert from 'node:assert/strict';
const { chromium } = await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(process.env.EV_TEST_URL || 'http://127.0.0.1:5174/');
  await page.evaluate(async () => {
    const { initCreationWizard } = await import('/src/creation-wizard.js');
    window.openRebuildTest = initCreationWizard(() => {});
    window.openRebuildTest({ headers: {} });
  });
  const dialog = page.locator('.creation-wizard[open]');
  assert.match(await dialog.locator('[aria-current="step"]').innerText(), /7\s*Review/);
  assert(await dialog.locator('[data-create]').isDisabled());
  assert.match(await dialog.innerText(), /Choose a species/);
  await dialog.locator('[data-step="0"]').click();
  await dialog.locator('[data-key="className"]').selectOption('Bard');
  await dialog.locator('[data-key="level"]').selectOption('3');
  await dialog.locator('[data-step="1"]').click();
  await dialog.locator('[data-key="species"]').selectOption('High Elf');
  await dialog.locator('[data-step="6"]').click();
  assert(await dialog.locator('[data-create]').isDisabled());
  assert.match(await dialog.innerText(), /Choose a subclass/);
  await dialog.locator('[data-close]').click();
  await page.evaluate(() => window.openRebuildTest({ headers: {}, creation: { className: 'Bard', species: 'High Elf', level: 3, choices: { origin: ['Insight'] } } }));
  assert(await dialog.locator('[data-create]').isDisabled());
  await dialog.locator('[data-step="3"]').click();
  assert.equal(await dialog.locator('[data-key="skill:origin:0"]').inputValue(), 'Insight');
  assert.deepEqual(errors, []);
  console.log('Incomplete rebuilds open Review, preserve choices, and require completion.');
} finally { await browser.close(); }
