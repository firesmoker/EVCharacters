import assert from 'node:assert/strict';
const { chromium } = await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5174/');
  await page.evaluate(async () => (await import('/src/section-format.js')).setSectionSize('auto'));
  const field = page.locator('[data-section="class-features"] .section-content');
  await field.click();
  const paste = html => field.evaluate((el, html) => {
    const clipboardData = new DataTransfer();
    clipboardData.setData('text/html', html);
    el.dispatchEvent(new ClipboardEvent('paste', {bubbles:true, cancelable:true, clipboardData}));
  }, html);
  await paste('<div style="font-size:30px;font-family:monospace;color:red"><p>Feature</p><ul><li><span style="font-weight:700;font-size:24px">Bold title</span>: description</li></ul></div>');
  await page.waitForTimeout(100);
  const result = await field.evaluate(el => ({
    text:el.innerText, bold:!!el.querySelector('strong'), list:!!el.querySelector('ul li'),
    styles:[...el.querySelectorAll('*')].map(node => [getComputedStyle(node).fontSize,getComputedStyle(node).fontFamily]),
    expected:[getComputedStyle(el).fontSize,getComputedStyle(el).fontFamily],
  }));
  assert(result.bold && result.list);
  for (const style of result.styles) assert.deepEqual(style,result.expected);
  await page.keyboard.press('Control+z');
  assert.equal((await field.innerText()).trim(),'');
  await page.keyboard.press('Control+y');
  assert.equal(await field.innerText(),result.text);
  const speed = page.locator('.strikes-cantrips-slots-table td:nth-child(2) .editable-field').first();
  assert.equal(await speed.evaluate(el=>getComputedStyle(el).fontWeight),'400');
  await speed.fill('Average');
  assert(await speed.evaluate(el => {
    const range = document.createRange();
    range.selectNodeContents(el);
    return range.getClientRects().length === 1 && el.scrollWidth <= el.clientWidth;
  }), 'Average must fit on one line in the Speed column');
  console.log('Paste adopts destination typography, preserves bold/lists and undo/redo; action speed uses regular weight.');
} finally { await browser.close(); }
