import assert from 'node:assert/strict';
const { chromium } = await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(process.env.EV_TEST_URL || 'http://127.0.0.1:5174/');
  await page.evaluate(async () => {
    const { richTextHTML } = await import('/src/sheet-paste.js');
    const root = document.createElement('div');
    root.innerHTML = richTextHTML('<p>Choices:</p><p>• <strong>Fire:</strong> burn</p><p>• Ice: chill</p><p>-1 to the roll.</p>');
    if (root.querySelectorAll('ul > li').length !== 2 || !root.querySelector('li strong')) throw Error('Convert fake bullets and preserve emphasis');
    if (!root.lastElementChild.textContent.startsWith('-1')) throw Error('Do not convert numeric penalties');
    if (richTextHTML(root.innerHTML) !== root.innerHTML) throw Error('Real lists must remain unchanged');
    const { cantripAction } = await import('/src/cantrip-action.js');
    const { SPELLS_DATABASE } = await import('/src/spells_data.js');
    const { tidyCharacterContent } = await import('/src/sheet-content.js');
    for (const [name, count] of [['Elemental Flare',3], ['Magic Tricks',6], ['Minor Illusion',2], ['Mold Earth',2], ['Thaumaturgy',6]]) {
      const action = cantripAction(SPELLS_DATABASE.find(spell => spell.name === name));
      tidyCharacterContent({ sections:{ 'Strikes & Damaging Cantrips':{dynamicRows:[action]} } });
      root.innerHTML = action.slots.notes;
      if (root.querySelectorAll('ul > li').length !== count || root.textContent.includes('•')) throw Error(`${name}: use real bullets`);
    }
  });
  await page.evaluate(async () => {
    const { prepareSheetForData } = await import('/src/io.js');
    const { renderVariantActionRow } = await import('/src/components.js');
    prepareSheetForData(true);
    const action = document.querySelector('.strikes-cantrips-container');
    action.querySelector('.variants-region').classList.remove('variants-hidden');
    action.querySelector('.variant-actions-container').innerHTML = renderVariantActionRow();
  });
  const action = page.locator('.strikes-cantrips-container').first();
  for (const selector of ['[data-slot="notes"]', '[data-slot="rollDescription"]', '.variant-action-text']) {
    const field = action.locator(selector);
    await field.fill('');
    await field.click();
    await page.keyboard.type('* ');
    assert.equal(await field.locator('li').count(), 1, `${selector}: star shortcut`);
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
    await field.evaluate(el => {
      el.innerHTML = '<p>Keep this description.</p>';
      el.focus();
      const caret = document.createRange(); caret.selectNodeContents(el.firstElementChild); caret.collapse(false);
      getSelection().removeAllRanges(); getSelection().addRange(caret);
    });
    await page.keyboard.press('Enter');
    await page.keyboard.type('* New item');
    assert.equal(await field.locator('li').innerText(), 'New item');
    assert.match(await field.innerText(), /Keep this description\./);
  }
  const saved = await page.evaluate(async () => {
    const io = await import('/src/io.js');
    const markup = '<p><strong>First paragraph</strong><br>Still here.</p><p>Second paragraph.</p><ul><li>One</li><li>Two<ul><li>Nested</li></ul></li></ul>';
    document.querySelector('[data-section="class-features"] .rich-text').innerHTML = markup;
    for (const field of document.querySelectorAll('.strikes-cantrips-container:first-child .rich-text')) field.innerHTML = markup;
    const json = io.serializeSheet();
    io.loadFromJSON(json);
    return JSON.parse(json).sections['Strikes & Damaging Cantrips'].dynamicRows[0];
  });
  for (const value of [saved.slots.notes, saved.slots.rollDescription, saved.variants[0]]) {
    assert.match(value, /<strong>First paragraph<\/strong><br>/);
    assert.match(value, /<ul><li>Nested/);
  }
  for (const selector of ['[data-slot="notes"]', '[data-slot="rollDescription"]', '.variant-action-text']) {
    const field = action.locator(selector);
    assert.equal(await field.locator('p').count(), 2);
    assert.equal(await field.locator('li').count(), 3);
    const styles = await field.evaluate(field => {
      const fitted = [...document.querySelectorAll('[data-auto-fit]')];
      fitted.forEach(el => el.removeAttribute('data-auto-fit'));
      const reference = document.querySelector('[data-section="class-features"] .rich-text');
      const read = el => {
        const root = getComputedStyle(el), p = getComputedStyle(el.querySelector('p')), ul = getComputedStyle(el.querySelector('ul'));
        return { font: root.fontSize, line: root.lineHeight, paragraph: p.marginBottom, indent: ul.paddingLeft, bullets: ul.listStyleType };
      };
      const result = { actual: read(field), expected: read(reference) };
      fitted.forEach(el => el.setAttribute('data-auto-fit', ''));
      return result;
    });
    assert.deepEqual(styles.actual, styles.expected, `${selector}: match Features typography`);
  }
  assert.deepEqual(errors, []);
  console.log('Action descriptions and variants support bullets, undo/redo, matching paragraph spacing, and rich-text save/load.');
} finally { await browser.close(); }
