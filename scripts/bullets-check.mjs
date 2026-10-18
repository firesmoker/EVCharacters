import assert from 'node:assert/strict';
const { chromium } = await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  await page.goto(process.env.EV_TEST_URL || 'http://127.0.0.1:5174/');
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
  for (const lineBreak of ['Enter', 'Shift+Enter']) {
    await field.evaluate(el => {
      el.innerHTML = '<p>Keep this paragraph.</p>';
      el.focus();
      const caret = document.createRange(); caret.selectNodeContents(el.firstElementChild); caret.collapse(false);
      getSelection().removeAllRanges(); getSelection().addRange(caret);
    });
    await page.keyboard.press(lineBreak);
    await page.keyboard.type('* ');
    assert.equal(await field.locator('li').count(), 1, `Start list after ${lineBreak}`);
    assert.match(await field.innerText(), /Keep this paragraph\./);
    assert(!await field.innerText().then(text => text.includes('*')));
    await page.keyboard.press('Control+z');
    assert.match(await field.innerText(), /\*/);
    assert.match(await field.innerText(), /Keep this paragraph\./);
    await page.keyboard.press('Control+y');
    await page.keyboard.type('New item');
    assert.equal(await field.locator('li').innerText(), 'New item');
  }
  for (const previous of ['<p>Keep this paragraph.</p>', '<ul><li>Keep this item.</li></ul>']) {
    await field.evaluate((el, previous) => {
      el.innerHTML = previous + '<p><br></p>';
      el.focus();
      const caret = document.createRange();
      caret.setStart(el.lastElementChild, 0);
      caret.collapse(true);
      getSelection().removeAllRanges(); getSelection().addRange(caret);
    }, previous);
    await page.keyboard.type('* New item');
    assert.match(await field.innerText(), /Keep this (?:paragraph|item)\./);
    assert.equal(await field.locator('li').last().innerText(), 'New item');
    assert.equal(await field.locator('p ul').count(), 0, 'Keep valid list markup');
    await page.evaluate(async () => { const io = await import('/src/io.js'); io.loadFromJSON(io.serializeSheet()); });
    assert.equal(await field.locator('li').last().innerText(), 'New item');
  }
  console.log('Bullet typing after paragraphs, line breaks and lists, toggling, undo/redo, and persistence passed.');
} finally { await browser.close(); }
