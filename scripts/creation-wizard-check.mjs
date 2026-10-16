import assert from 'node:assert/strict';
const { chromium } = await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://127.0.0.1:5174/');
  const result = await page.evaluate(async () => {
    const m = await import('/src/character-creation.js');
    function fill(s) {
      s.name = 'Wizard Test'; s.languages = 'Common';
      s.feats = ['Tough', ...(s.species === 'Human' ? ['Focused'] : []), (s.level >= 2 ? 'Deep Sleep' : 'Pet')];
      s.choices.craft = ['Smithing'];
      for (const g of m.specialChoices(s)) s.choices[g.id] = g.options.slice(0,g.count);
      for (let pass = 0; pass < 3; pass++) for (const g of m.skillPlan(s).groups) {
        if (s.choices[g.id]?.length === g.count) continue;
        const selected = [], categories = new Set();
        const { SKILLS_LIST } = awaitData;
        for (const value of g.options) {
          const cat = SKILLS_LIST.find(x => x.options.includes(value))?.groupLabel;
          if (g.distinct && categories.has(cat)) continue;
          if (g.id !== 'muse-skill' && (Object.values(s.choices).flat().includes(value) || m.skillPlan(s).base[value])) continue;
          selected.push(value); categories.add(cat);
          if (selected.length === g.count) break;
        }
        s.choices[g.id] = selected;
      }
      for (let i = 0; i < m.spellPlan(s).groups.length; i++) {
        const g = m.spellPlan(s).groups[i]; s.spells[g.id] = g.options.slice(0, g.count).map(sp => sp.name);
      }
      s.equipment.weapon = m.equipmentPlan(s).choices[0] || '';
      return s;
    }
    const awaitData = await import('/src/data.js');
    const firstLevel = fill({ ...m.newCharacter(), species: 'High Elf', level: 1 });
    assertMinorFeat(firstLevel);
    function assertMinorFeat(s) {
      if (m.validateCharacter(s).some(e => /minor feat/i.test(e))) throw new Error('Level 1 should accept one eligible Minor Feat.');
      const missing = { ...s, feats: s.feats.filter(f => f !== 'Pet') };
      if (!m.validateCharacter(missing).includes('Choose 1 minor feat.')) throw new Error('Level 1 must require a Minor Feat.');
      if (!m.buildCharacter(s).sections.Feats.sectionBody.includes('Pet')) throw new Error('Minor Feat missing from generated sheet.');
    }
    const failures = [], cases = [];
    for (const c of m.DATA.classes) for (const species of m.DATA.species) for (const level of [1, 2, 3, 10]) {
      let s = { ...m.newCharacter(), className: c.Class, species: species.Species, level };
      const subclasses = m.subclassesFor(s);
      s.subclass = subclasses[0]?.Subclass || '';
      s = fill(s);
      const issues = m.validateCharacter(s);
      if (issues.length) failures.push({ class: c.Class, species: species.Species, level, issues });
      else { const built = m.buildCharacter(s); cases.push(built); }
    }
    for (const sub of m.DATA.subclasses) for (const race of m.DATA.species) {
      const s = fill({ ...m.newCharacter(), className: sub['Parent Class'], species: race.Species, level: 3, subclass: sub.Subclass });
      const issues = m.validateCharacter(s);
      if (issues.length) failures.push({ subclass: sub.Subclass, species: race.Species, issues });
      else cases.push(m.buildCharacter(s));
    }
    const bard = fill({ ...m.newCharacter(), name: 'Bard Example', className: 'Bard', species: 'High Elf', level: 3, subclass: 'Tale Weaver' });
    const built = m.buildCharacter(bard);
    const classContent = document.createElement('div'); classContent.innerHTML = built.sections['Class Features'].sectionBody;
    if (classContent.textContent.includes('Unlocked at Level')) throw Error('Unlock labels should not appear on the sheet');
    if (![...classContent.querySelectorAll('li strong')].some(el => el.textContent === 'Rise to the Challenge:')) throw Error('War Singing phrases must be bold bullets');
    const instincts = document.createElement('div'); instincts.innerHTML = built.sections['Instinct Abilities'].sectionBody;
    if (!instincts.textContent.includes('Inspired 1 (1 Extra Die on rolls)')) throw Error('Reenactment must grant Extra Dice through Inspired');
    if (!classContent.textContent.includes('Inspired 1 (1 Extra Die on rolls)')) throw Error('War Singing must grant Extra Dice through Inspired');
    if (instincts.querySelectorAll('li > ul > li').length < 2) throw Error('Grand Finales must be nested under their reenactments');
    for (const name of ['The Dragon Slayer', 'The Martyr']) {
      if (![...instincts.querySelectorAll('li > strong')].some(el => el.textContent === `Reenact: ${name}:`)) throw Error(`Full reenactment name must be bold: ${name}`);
    }
    if (built.sections['Additional Features'].sectionBody.includes('Historian')) throw Error('Historian is redundant with the skills table');
    const io = await import('/src/io.js');
    io.loadFromJSON(JSON.stringify(built));
    const saved = JSON.parse(io.serializeSheet());
    const invalid = structuredClone(bard); invalid.spells['class-spells'] = ['Godly Force'];
    return { bard, failures, total: cases.length, built, saved, rejectsExclusive: m.validateCharacter(invalid).length > 0 };
  });
  assert.deepEqual(result.failures, []);
  assert(result.total >= 400);
  assert(result.rejectsExclusive);
  assert.equal(result.saved.headers.class, 'Bard');
  assert.equal(result.saved.sections.Spellcasting.splitFields['Spell Points'].max, '4');
  assert.equal(result.saved.sections.Spellcasting.fields['Spells Known'], '9');
  assert.equal(result.saved.sections.Spellcasting.fields['Cantrips Known'], '5');
  assert.match(result.saved.sections['Class Features'].sectionBody, /War Singing/);
  assert.match(result.saved.sections['Instinct Abilities'].sectionBody, /Martyr/);
  await page.locator('#menu-create-character').evaluate(el => el.click());
  assert.equal(await page.locator('.creation-wizard details:not([open])').count(), 0);
  await page.locator('.creation-wizard details summary').first().click();
  assert.equal(await page.locator('.creation-wizard details:not([open])').count(), 1);
  await page.getByLabel('Character name', { exact: true }).fill('UI Test');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel('Species', { exact: true }).selectOption('High Elf');
  await page.getByRole('button', { name: 'Review', exact: false }).click();
  assert(await page.getByRole('button', { name: 'Create character', exact: true }).isDisabled());
  await page.getByRole('button', { name: 'Close character creation' }).click();
  await page.locator('#menu-create-character').evaluate(el => el.click());
  await page.getByRole('button', { name: 'Identity & class', exact: false }).click();
  await page.getByLabel('Level', {exact:true}).selectOption('3');
  await page.getByRole('button', {name:'Subclass',exact:false}).click();
  await page.getByLabel('Subclass',{exact:true}).selectOption('Tale Weaver');
  await page.getByRole('button', {name:'Training & feats',exact:false}).click();
  for (const feat of result.bard.feats) await page.locator(`[data-feat="${feat}"]`).check();
  for (const [key,values] of Object.entries(result.bard.choices)) {
    for (let i=0;i<values.length;i++) {
      const field=page.locator(`[data-key="skill:${key}:${i}"]`);
      if (await field.count()) await field.selectOption(values[i]);
    }
  }
  await page.locator('dialog[open]').getByRole('button', {name:'Spells',exact:false}).click();
  const spellStats = await page.locator('.creation-wizard .spell-description-block').allTextContents();
  assert(spellStats.some(text => text.includes('Duration:')));
  for (const label of ['Speed:', 'Cost:', 'Range:', 'Area:', 'Requirements:']) assert(spellStats.some(text => text.includes(label)), `Missing ${label}`);
  for (const [key,values] of Object.entries(result.bard.spells)) {
    for (const name of values) await page.locator(`[data-spell-group="${key}"][value="${name}"]`).check();
  }
  await page.getByRole('button', {name:'Equipment',exact:false}).click();
  await page.getByLabel('Starting weapon',{exact:true}).selectOption(result.bard.equipment.weapon);
  await page.getByRole('button', {name:'Review',exact:false}).click();
  assert(await page.getByRole('button',{name:'Create character',exact:true}).isEnabled(), await page.locator('.creation-content').innerText());
  await page.screenshot({path: 'C:/Users/eylon/.codex/visualizations/2026/09/15/01a0a530-6d6f-7f31-829c-b3c870dfb2f5/creation-wizard-review.png'});
  page.on('dialog', d => d.accept());
  await page.getByRole('button',{name:'Create character',exact:true}).click();
  assert.equal(await page.locator('.creation-wizard').isVisible(), false);
  assert.equal(await page.locator('[data-sync-id="character-name"]').first().innerText(), 'UI Test');
  assert(await page.evaluate(() => !!localStorage.getItem('ev-before-character-creation')));

  assert.deepEqual(errors, []);
  console.log(`${result.total} class/species/level combinations, grants, spell limits, sheet population and wizard validation passed.`);
} finally { await browser.close(); }
