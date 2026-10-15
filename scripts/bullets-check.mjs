import assert from 'node:assert/strict';
const { chromium } = await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5174/');
  const field = page.locator('[data-section="class-features"] .section-content');
  await field.click();
  await page.keyboard.type('* ');
  assert.equal(await field.locator('li').count(), 1);
  await page.keyboard.press('Control+z');
  assert.equal(await field.innerText(), '*');
  await page.keyboard.press('Control+y');
  await page.keyboard.type('First');
  await page.keyboard.press('Enter');
  await page.keyboard.type('Second');
  assert.equal(await field.locator('li').count(), 2);
  await page.keyboard.press('Control+Shift+8');
  assert.equal(await field.locator('li').count(), 1);
  await page.keyboard.press('Control+Shift+8');
  assert.equal(await field.locator('li').count(), 2);
  const html = await field.innerHTML();
  await page.waitForTimeout(1200);
  await page.reload();
  assert.equal(await field.innerHTML(), html);
  console.log('Bullet typing, toggling, undo/redo, and persistence passed.');
} finally { await browser.close(); }
