import assert from 'node:assert/strict';
const { chromium } = await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5174/');
  const accent = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
  const open = async () => {
    await page.locator('.menu-item').filter({ hasText: /^Color/ }).hover();
    await page.locator('#color-custom').click();
  };
  assert.equal(await page.locator('[data-accent]').count(), 24);
  const original = await accent();
  await open();
  await page.getByLabel('Hex color').fill('#288b72');
  assert.equal(await accent(), '#288b72', 'Hex updates before closing');
  const old = await accent();
  await page.getByLabel('Hue', { exact: false }).press('ArrowRight');
  assert.notEqual(await accent(), old, 'Range updates live');
  await page.locator('.accent-wheel').click({ position: { x: 180, y: 110 } });
  assert.notEqual(await accent(), old, 'Wheel updates live');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  assert.equal(await accent(), original);
  await open();
  await page.getByLabel('Hex color').fill('#5a68a1');
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await page.waitForTimeout(1200);
  await page.reload();
  assert.equal(await accent(), '#5a68a1');
  assert.equal(await page.locator('[aria-label="Current HP"]').evaluate(el => getComputedStyle(el).color), 'rgb(41, 62, 80)');
  console.log('24 presets, live hex/range/wheel updates, cancel, save/reload and fixed text color passed.');
} finally { await browser.close(); }
