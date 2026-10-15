// Run against `npm run dev`; uses Playwright if installed or EV_PLAYWRIGHT_MODULE.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const { chromium } = await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1250 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(process.env.EV_APP_URL || 'http://127.0.0.1:5174/');
  await page.evaluate(() => document.fonts.ready);
  const templatesDir = fileURLToPath(new URL('../src/templates/', import.meta.url));
  const load = data => page.evaluate(async data => {
    (await import('/src/io.js')).loadFromJSON(JSON.stringify(data));
    await document.fonts.ready;
    (await import('/src/sheet-tools.js')).paginateSheets();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }, data);
  const save = () => page.evaluate(async () => JSON.parse((await import('/src/io.js')).serializeSheet()));

  // Existing characters retain section identities, values, rich text, and row order.
  for (const file of readdirSync(templatesDir).filter(name => name.endsWith('.json'))) {
    const template = JSON.parse(readFileSync(`${templatesDir}/${file}`, 'utf8'));
    await load(template);
    assert.equal(await page.locator('.continuation-page').count(), 0, 'No continuation pages');
    assert(await page.locator('.a4-page').nth(1).evaluate(el => el.classList.contains('actions-page')), 'Actions remain the second physical page');
    assert.equal(await page.locator('.actions-page .sheet-column').first().locator('[data-section="instinct-abilities"]').count(), 1);
    assert.equal(await page.locator('.actions-page .sheet-column').last().locator('[data-section="strikes-damaging-cantrips"]').count(), 1);
    const beforeReflow = await save();
    await page.evaluate(async () => {
      const { paginateSheets } = await import('/src/sheet-tools.js');
      for (let i = 0; i < 5; i++) paginateSheets();
    });
    assert.deepEqual(await save(), beforeReflow, `${file}: repeated pagination preserves content`);
    const saved = await save();
    assert.deepEqual(saved.headers, template.headers, `${file}: headers`);
    for (const [title, section] of Object.entries(template.sections)) {
      assert(saved.sections[title], `${file}: missing ${title}`);
      for (const key of ['fields', 'splitFields', 'checkboxes']) {
        for (const [name, value] of Object.entries(section[key] || {})) {
          assert.deepEqual(saved.sections[title][key][name], value, `${file}: ${title}/${name}`);
        }
      }
      if (section.sectionBody) assert.equal(saved.sections[title].sectionBody, section.sectionBody, `${file}: ${title} text`);
      for (const [i, row] of (section.dynamicRows || []).entries()) {
        if (row.type === 'skill') assert.deepEqual(saved.sections[title].dynamicRows[i].values, row.values, `${file}: ${title} row ${i}`);
        if (row.type === 'action') {
          const actual = saved.sections[title].dynamicRows[i];
          assert.deepEqual(actual.variants, row.variants || [], `${file}: variants`);
          for (const [slot, value] of Object.entries(row.slots || {})) {
            if (slot in actual.slots) assert.equal(actual.slots[slot], value, `${file}: ${slot}`);
          }
          if (row.tableRows) assert.deepEqual(actual.tableRows, row.tableRows, `${file}: strike table`);
          if (row.ui) assert.deepEqual(actual.ui, row.ui, `${file}: toggles`);
        }
      }
    }
    const overflow = await page.locator('.a4-page:not(.hidden)').evaluateAll(pages => pages.map(p => ({
      page: p.className, excess: p.scrollHeight - p.clientHeight
    })).filter(p => p.excess > 2));
    assert.deepEqual(overflow, [], `${file}: A4 overflow`);
    await load(saved);
    assert.deepEqual(await save(), saved, `${file}: save/load stability`);
    if (file === 'bard_liora_vey_full_build.json') {
      await page.evaluate(async () => localStorage.setItem('ev-char-sheet', (await import('/src/io.js')).serializeSheet()));
      await page.reload();
      await page.evaluate(() => document.fonts.ready);
      assert.equal((await save()).sections['Class Features'].sectionBody, template.sections['Class Features'].sectionBody, 'All Bard features survive autosave/reload after pagination');
    }

  }

  const fixture = JSON.parse(readFileSync(`${templatesDir}/wizard.json`, 'utf8'));
  fixture.headers['character-name'] = 'Seren Vale';
  fixture.headers.subclass = 'War Mage';
  fixture.sections.Defenses.fields = { Deflection: '3', Fortitude: '1', Will: '2' };
  fixture.sections.Defenses.splitFields = { 'Health\nPoints': { cur: '8', max: '10', temp: '2' } };
  fixture.sections.Death = { fields: { Exhaustion: '2' }, checkboxes: { 'index-0': true, 'index-1': false, 'index-2': false, 'index-3': true } };
  fixture.sections.Spellcasting.splitFields = { 'Spell Points': { cur: '4', max: '5', temp: '1' } };
  fixture.sections.Speed.dynamicRows = ['Heavy Weapons', 'Ranged Weapons', 'Aiming for Weak Spots', 'Custom Drag'].map(name => ({ type: 'skill', values: [name] }));
  fixture.sections['Instinct Abilities'] = { dynamicRows: [{ type: 'skill', values: ['Cantrip', 'Minor Ward', 'Gain +1 Deflection until the end of the round.\nUse when an incoming attack would otherwise succeed.'] }] };
  fixture.sections['Strikes & Damaging Cantrips'].dynamicRows[0].tableRows = [{
    weapon: 'Quarterstaff', speed: 'Fast', roll: '5d6', minimum: '3', damage: 'Crushing', range: 'Melee', doubleSix: 'Prone'
  }];
  await load(fixture);
  assert.equal(await page.locator('.details-page [data-section="death"]').count(), 1);
  assert.deepEqual((await save()).sections.Death.fields, fixture.sections.Death.fields);
  assert.deepEqual((await save()).sections.Death.checkboxes, fixture.sections.Death.checkboxes);
  assert.equal((await save()).sections.Defenses.fields.Exhaustion, undefined, 'Death fields remain separate in saved data');
  assert.equal(await page.locator('[data-sync-id="player-name"]').count(), 1, 'Detailed header appears only on the first page');
  assert.equal(await page.locator('.sheet-title').first().evaluate(el => getComputedStyle(el).backgroundColor), 'rgba(0, 0, 0, 0)');
  const skillIcons = await page.evaluate(async () => {
    const { SKILLS_LIST, COMBAT_SKILLS_LIST } = await import('/src/data.js');
    const { renderSkillRow } = await import('/src/components.js');
    const { updateSkillIcon } = await import('/src/skill-icons.js');
    const host = document.createElement('div');
    host.innerHTML = renderSkillRow();
    return [...SKILLS_LIST, ...COMBAT_SKILLS_LIST].flatMap(group => group.options).map(name => {
      host.querySelector('input.skill-name').value = name;
      updateSkillIcon(host.firstElementChild);
      return host.querySelector('use').getAttribute('href');
    });
  });
  assert.equal(new Set(skillIcons).size, skillIcons.length, 'Every listed skill has a distinct icon');
  const sprite = readFileSync(fileURLToPath(new URL('../public/icons/skills.svg', import.meta.url)), 'utf8');
  for (const href of skillIcons) assert(sprite.includes(`id="${href.split('#')[1]}"`), `Missing icon: ${href}`);
  const crest = page.locator('.defense-crests .editable-field').first();
  await crest.fill('22');
  assert(await crest.evaluate(el => el.scrollWidth <= el.clientWidth + 1), 'Two-digit defense fits its field');
  assert.equal(await crest.evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(255, 255, 255)', 'Focused editable field stays white');
  await crest.fill('3');
  assert.equal(await page.locator('[data-section="equipment-proficiencies"] .drags-ignored .skill-row').count(), 4, 'Drag entries appear under equipment proficiencies');
  assert.deepEqual((await save()).sections.Speed.dynamicRows, fixture.sections.Speed.dynamicRows, 'Moved Drag entries preserve saved values');
  assert.equal((await save()).sections['Instinct Abilities'].sectionBody, '<ul><li><strong>Minor Ward:</strong> Gain +1 Deflection until the end of the round.<br>Use when an incoming attack would otherwise succeed.</li></ul>', 'Saved Instinct rows convert to rich text without a source');
  const instinct = page.locator('[data-section="instinct-abilities"] .section-content').first();
  assert.equal(await instinct.evaluate(el => getComputedStyle(el).fontSize), '13px');
  assert.equal(await page.locator('[data-section="class-features"] .section-content').first().evaluate(el => getComputedStyle(el).fontSize), '13px');
  assert(await page.locator('[data-section="combat-skills"] .skill-icon use').count() > 0, 'Combat skills have icons');
  assert.equal((await save()).sections['Strikes & Damaging Cantrips'].dynamicRows[0].tableRows[0].minimum, '3');
  assert.equal(await page.locator('[data-spell-point-mirror="temp"]').innerText(), '1');
  await page.locator('[data-spell-point-mirror="cur"]').fill('2');
  assert.equal((await save()).sections.Spellcasting.splitFields['Spell Points'].cur, '2');
  await page.locator('[data-section="spellcasting"] [data-split-part="max"]').fill('6');
  assert.equal(await page.locator('[data-spell-point-mirror="max"]').innerText(), '6');
  await page.locator('[aria-label="Current HP"]').fill('7');
  assert.deepEqual((await save()).sections.Defenses.splitFields['Health\nPoints'], { cur: '7', max: '10', temp: '2' });

  // Autocomplete, dynamic rows, variants, table controls, and separate skill groups.
  const combat = page.locator('[data-section="combat-skills"]');
  const standard = page.locator('[data-section="standard-skills"]');
  assert.equal(await combat.locator('.section-header').innerText(), 'Combat Skills');
  assert.equal(await standard.locator('.section-header').innerText(), 'Standard Skills');
  const before = await combat.locator('.skill-row').count();
  await combat.locator('input.skill-name').first().click();
  await combat.locator('.add-row-btn').last().click();
  assert.equal(await combat.locator('.skill-row').count(), before + 1);
  await combat.locator('input.skill-name').last().fill('Ranged');
  await combat.locator('.suggestion-item[data-value="Ranged"]').last().click();
  assert.equal(await combat.locator('input.skill-name').last().inputValue(), 'Ranged');
  await combat.locator('input.skill-name').last().click();
  await combat.locator('.remove-row-btn').last().click();
  assert.equal(await combat.locator('.skill-row').count(), before);
  const strike = page.locator('.strikes-cantrips-container').first();
  await strike.locator('[data-slot="name"]').click();
  assert.equal(await strike.locator('thead').evaluate(el => getComputedStyle(el).display), 'table-header-group');
  const rows = await strike.locator('tbody tr').count();
  await strike.locator('.add-strikes-table-row-btn').click();
  assert.equal(await strike.locator('tbody tr').count(), rows + 1);
  await strike.locator('.remove-strikes-table-row-btn').click();
  assert.equal(await strike.locator('tbody tr').count(), rows);
  await strike.locator('.variants-toggle-btn').click();
  await strike.locator('.add-variant-btn').click();
  await strike.locator('.variant-action-text').last().fill('A preserved custom variant.');
  await strike.locator('.variants-toggle-btn').click();
  assert(await strike.locator('.variants-region').evaluate(el => el.classList.contains('variants-hidden')));
  await strike.locator('.variants-toggle-btn').click();
  assert(await strike.locator('.variant-action-text').last().isVisible());

  const spells = page.locator('[data-section="spells-known"]');
  await spells.locator('[data-type="spells"] input').first().fill('Summon Beast');
  await spells.locator('.suggestion-item[data-value="Summon Beast"]').first().click();
  assert.equal(await page.locator('[aria-label="Beast stat block"]').count(), 1);
  assert.equal(await spells.locator('input[placeholder="Cost"]').first().inputValue(), '1');
  assert.equal(await spells.locator('input[placeholder="Rank"]').first().inputValue(), '1');
  await page.locator('[data-sync-id="character-name"]').first().fill('A Changed Name');
  assert((await page.locator('[data-sync-id="character-name"]').allInnerTexts()).every(name => name === 'A Changed Name'));

  await page.locator('.menu-item').filter({ hasText: /^Color/ }).hover();
  await page.locator('#color-red').click();
  assert.equal(await page.locator('[aria-label="Current HP"]').evaluate(el => getComputedStyle(el).color), 'rgb(139, 0, 0)');
  await page.locator('.menu-item').filter({ hasText: /^Font/ }).hover();
  await page.locator('#font-kalam').click();
  assert((await page.locator('[aria-label="Current HP"]').evaluate(el => getComputedStyle(el).fontFamily)).includes('Kalam'));
  await page.waitForTimeout(1200);
  const persisted = await save();
  await page.reload();
  assert.deepEqual(await save(), persisted, 'autosave and reload');

  await page.emulateMedia({ media: 'print' });
  assert.equal(await page.locator('.editor-canvas').evaluate(el => getComputedStyle(el).padding), '0px');
  const printOverflow = await page.locator('.a4-page:not(.hidden)').evaluateAll(pages => pages.map(p => p.scrollHeight - p.clientHeight));
  assert(printOverflow.every(excess => excess <= 2), `Print overflow: ${printOverflow}`);
  assert.equal(await page.locator('.top-bar').isVisible(), false);
  assert.equal(await page.locator('.add-row-btn:visible').count(), 0);
  assert(await page.locator('[aria-label="Beast stat block"]').isVisible());
  assert.equal(await page.locator('.sheet-tools').count(), 0, 'No detached editing toolbar');
  await page.emulateMedia({ media: 'screen' });
  const richFixture = structuredClone(fixture);
  richFixture.sections['Class Features'].sectionBody = '<p><strong>Long formatted feature:</strong> ' + 'Formatted words remain editable across pages. '.repeat(300) + '</p><p><em>Final paragraph.</em></p>';
  await load(richFixture);
  assert.equal((await save()).sections['Class Features'].sectionBody, richFixture.sections['Class Features'].sectionBody, 'Split rich text preserves exact markup');
  await load(fixture);
  const longText = Array.from({ length: 90 }, (_, i) => `Feature ${i + 1}: This long character description must remain visible and editable.`).join('\n');
  await page.locator('[data-section="class-features"] .section-content').first().fill(longText);
  await page.waitForFunction(() => document.querySelector('[data-section="class-features"]').closest('.sheet-column').hasAttribute('data-auto-fit'));
  assert.equal(await page.locator('.continuation-page').count(), 0);
  assert(await page.locator('[data-section="class-features"] .section-content').evaluate(el => parseFloat(getComputedStyle(el).fontSize) < 13), 'Long text automatically shrinks');
  assert.equal((await save()).sections['Class Features'].sectionBody.includes('Feature 90'), true);
  assert(await page.locator('[data-section="class-features"] .section-content').first().evaluate(el => el.scrollHeight <= el.clientHeight + 2), 'Long text is not clipped');
  const longSaved = await save();
  await load(longSaved);
  assert.deepEqual(await save(), longSaved, 'Paginated long text round-trips exactly');
  const continuationField = page.locator('[data-section="class-features"] .section-content').last();
  await continuationField.press('ControlOrMeta+End');
  await continuationField.pressSequentially(' Continuation edit.');
  assert((await save()).sections['Class Features'].sectionBody.includes('Continuation edit.'), 'Continuation remains editable and saves');
  await page.emulateMedia({ media: 'print' });
  assert.equal(await page.locator('.details-page').evaluate(el => getComputedStyle(el).overflow), 'hidden');
  const heights = await page.locator('.a4-page:not(.hidden)').evaluateAll(pages => pages.map(p => p.getBoundingClientRect().height));
  assert(heights.every(h => Math.abs(h - 1122.52) < 2), 'Every page is exactly A4 height');
  if (process.env.EV_UI_STRESS_PDF) await page.pdf({ path: process.env.EV_UI_STRESS_PDF, format: 'A4', printBackground: true });
  await page.emulateMedia({ media: 'screen' });
  await continuationField.fill('A short feature.');
  await page.waitForFunction(() => !document.querySelector('[data-section="class-features"]').closest('.sheet-column').hasAttribute('data-auto-fit'));
  assert.equal(await continuationField.evaluate(el => getComputedStyle(el).fontSize), '13px', 'Text returns to normal size when space is available');
  assert.deepEqual(errors, []);
  console.log('All templates round-trip without data loss or A4 overflow. Editing, autocomplete, row/variant controls, resource sync, preferences, autosave, and print checks passed.');
} finally {
  await browser.close();
}
