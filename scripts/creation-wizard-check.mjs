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
    if (awaitData.COMBAT_SKILLS_LIST.some(g => g.options.includes('Grapple'))) throw Error('Grapple is an action, not a skill');
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
    const actions = sheet => sheet.sections['Strikes & Damaging Cantrips'].dynamicRows;
    const assured = fill({ ...m.newCharacter(), className: 'Barbarian', species: 'Human', level: 2 });
    assured.feats = ['Assurance', 'Tough', 'Focused'];
    assured.choices.assurance = ['Athletics'];
    const assuredSheet = m.buildCharacter(assured);
    if (!assuredSheet.sections.Feats.sectionBody.includes('For Athletics, you may forgo rolling')) throw Error('Assurance choice missing');
    if (/assurance|Weapon Throw/i.test(assuredSheet.sections['Additional Features'].sectionBody)) throw Error('Choice or skill duplicated in Additional Features');
    if (!assuredSheet.sections['Combat Skills'].dynamicRows.some(r => r.values[0] === 'Weapon Throw' && r.values[1] === 'Expert (5d6)')) throw Error('Weapon Throw training lost');
    if (!assuredSheet.sections['Equipment Proficiencies'].checkboxes['Martial Weapons'] || assuredSheet.sections['Class Features'].sectionBody.includes('Martial Weapons Proficiency')) throw Error('Martial proficiency routing incorrect');
    const rebuilt = structuredClone(assuredSheet.creation);
    rebuilt.choices.assurance = ['Melee'];
    if (!m.buildCharacter(rebuilt).sections.Feats.sectionBody.includes('For Melee,')) throw Error('Rebuild did not resolve changed choice');
    if (m.sheetFeatureHTML('{{choices.tools}}', { tools: ['<img src=x>', 'Smithing'] }) !== '&lt;img src=x&gt; and Smithing') throw Error('Feature choices must be escaped');
    let missingChoice = false;
    try { m.sheetFeatureHTML('{{choices.missing}}', {}); } catch { missingChoice = true; }
    if (!missingChoice) throw Error('Missing feature choice silently accepted');
    for (const sheet of cases) {
      if (sheet.sections['Equipment Proficiencies'].dynamicRows.some(r => /^none$/i.test(r.values[0]))) throw Error('None is not a Drag entry');
      const spells = sheet.sections['Spells Known'].dynamicRows.map(r => r.values);
      for (let i = 1; i < spells.length; i++) {
        const [a, b] = [spells[i - 1], spells[i]];
        const rankA = a[0] === 'Cantrip' ? 0 : +a[0], rankB = b[0] === 'Cantrip' ? 0 : +b[0];
        if (rankA > rankB || (rankA === rankB && a[1].localeCompare(b[1], undefined, { sensitivity: 'base', numeric: true }) > 0)) throw Error('Created spells are not sorted');
      }
      const combat = sheet.sections['Combat Skills'].dynamicRows.map(r => r.values[0]);
      for (const name of awaitData.DEFAULT_COMBAT_SKILLS) if (!combat.includes(name)) throw Error(`Missing default combat skill: ${name}`);
      const grapple = actions(sheet).find(a => a.slots.name === 'Grapple');
      if (grapple && !grapple.slots.notes.includes('Roll Unarmed against')) throw Error('Grapple must use Unarmed');
      if (JSON.stringify(sheet.sections).includes('{{choices.')) throw Error('Unresolved feature placeholder');
      if (/Weapon Throw|Bomb Throw|Alchemy:/.test(sheet.sections['Additional Features'].sectionBody)) throw Error('Skill training dumped into features');
    }
    const sample = subclass => cases.find(sheet => sheet.headers.subclass === subclass && sheet.headers.level === '3');
    const berserkerActions = actions(sample('Berserker'));
    const whirlwind = berserkerActions.find(a => a.slots.name === 'Whirlwind');
    if (!whirlwind || !whirlwind.slots.rollDescription.includes('5 Rage') || !whirlwind.slots.notes.includes('regardless of whether the roll succeeds')) throw Error('Whirlwind must be a standalone action with unconditional Double 6');
    if (berserkerActions.some(a => a.variants.some(v => v.includes('Whirlwind')))) throw Error('Whirlwind is not a variant');
    const featureText = sheet => ['Class Features','Species Features','Additional Features'].map(n=>sheet.sections[n].sectionBody).join('');
    assertFeature(sample('Worldshaper'), 'Earth Bending', 'immediately cast it a second time');
    assertFeature(sample('Fae Trickster'), 'Fidgety', '1 additional Instinct');
    function assertFeature(sheet, label, text) {
      if (!featureText(sheet).includes(`<strong>${label}:</strong> ${text}`) && !featureText(sheet).includes(text)) throw Error(`Missing passive benefit: ${label}`);
    }
    const exarch=sample('Exarch');
    if(featureText(exarch).includes('party members gain +2 Movement')) throw Error('Prayer option duplicated in features');
    if(!actions(exarch).find(a=>a.slots.name==='Prayer')?.slots.notes.includes('Alacrity (1 Faith)')) throw Error('Alacrity not in Prayer');
    const justiciar=sample('Justiciar');
    if(featureText(justiciar).includes('Decree of the Fair Fight')) throw Error('Rally options duplicated in features');
    const rally=document.createElement('div');rally.innerHTML=justiciar.sections['Instinct Abilities'].sectionBody;
    if(![...rally.querySelectorAll('li > strong')].some(el=>el.textContent==='Decree of the Fair Fight (2 Devotion Points):' && el.closest('ul').parentElement.tagName==='LI')) throw Error('Decrees must be nested under Rally');
    const arcane=sample('Arcane Archer');
    if(!arcane.sections['Instinct Abilities'].sectionBody.includes('<strong>Arcane Shield (2 AP):</strong> At any point')) throw Error('AP ability replaced with spell reference');
    for(const sheet of cases.filter(s=>s.headers.class==='Warrior' && s.headers.level==='1')){
      for(const name of ['Opportunity Attacks','Counter','Protect &amp; Serve']) if(!sheet.sections['Instinct Abilities'].sectionBody.includes(name)) throw Error(`Missing Warrior instinct ${name}`);
    }
    const witch=sample('Witchblade');
    if(featureText(witch).includes('Mutant Body') || actions(witch).some(a=>a.variants.some(v=>v.includes('Vile Slash')))) throw Error('Unscheduled WIP features must not be granted');
    for (const sheet of cases) {
      const features = ['Class Features', 'Species Features', 'Additional Features'].map(name => sheet.sections[name]?.sectionBody || '').join('');
      if (/\bfa[A-Z]|VariantCosts|SpecialFast|Variant1 \/ Combat/.test(features)) throw Error('Extracted action artifacts remain');
      if (actions(sheet).some(a => a.variants.some(v => v.includes('<strong>Ram:</strong>'))) && features.includes('Perform a Charge using Unarmed Strike')) throw Error('Ram rules duplicated in features');
    }
    for (const sheet of cases) for (const name of ['Melee Strike', 'Ranged Strike']) {
      if (actions(sheet).filter(a => a.slots.name === name).length > 1) throw Error(`Duplicate ${name}`);
    }
    for (const [className, subclass, parent, variant] of [
      ['Paladin', '', 'Melee Strike', 'Holy Smite'],
      ['Archer', 'Walking Ballista', 'Ranged Strike', 'Power Shot'],
      ['Archer', 'Walking Ballista', 'Bomb Throw', 'Bomb Slinging'],
      ['Archer', 'Bowslinger', 'Ranged Strike', 'Multishot'],
      ['Barbarian', 'Berserker', 'Charge', 'Ram'],
      ['Barbarian', 'Berserker', 'Grapple', 'Aggressive Grapple'],
      ['Barbarian', 'Berserker', 'Weapon Throw', 'Enraged Toss'],
    ]) {
      const s = fill({ ...m.newCharacter(), className, subclass: subclass || m.DATA.subclasses.find(x => x['Parent Class'] === className).Subclass, species: 'Human', level: 3 });
      const block = actions(m.buildCharacter(s)).find(a => a.slots.name === parent);
      if (!block?.variants.some(v => v.includes(`<strong>${variant}:</strong>`)) || block.ui.variantsHidden) throw Error(`${variant} missing from ${parent}`);
    }
    // Exercise multiple weapon rows independently of the current starting-equipment grants.
    const warrior = m.DATA.classes.find(c => c.Class === 'Warrior');
    const originalEquipment = warrior['Starting Equipment'];
    let multi;
    try {
      warrior['Starting Equipment'] = 'Weapons: Shortsword, Sabre, Shortbow, Longbow';
      multi = m.buildCharacter(fill({ ...m.newCharacter(), className: 'Warrior', species: 'Human', level: 1 }));
      const rows = actions(multi);
      for (const name of ['Melee Strike', 'Ranged Strike']) {
        const block = rows.find(a => a.slots.name === name);
        if (block?.tableRows.length !== 2) throw Error(`${name} must contain two weapon rows`);
      }
    } finally { warrior['Starting Equipment'] = originalEquipment; }
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
    const barbarian = m.buildCharacter(fill({ ...m.newCharacter(), className: 'Barbarian', species: 'Human', level: 1 }));
    for (const name of ['Charge', 'Grapple']) {
      const action = actions(barbarian).find(a => a.slots.name === name);
      if (!action.ui.tableHidden || !/^(Fast|Average) Action/.test(action.slots.rollDescription)) throw Error(`${name} needs text metadata and no table`);
      if (/<br>|^(Fast|Average) Action/.test(action.slots.notes)) throw Error(`${name} contains HTML or duplicated speed`);
    }
    if (!actions(barbarian).find(a => a.slots.name === 'Charge').variants.some(v => v.includes('2 Extra Dice') && !v.includes('+1 damage'))) throw Error('Ram must grant Extra Dice');
    if (actions(barbarian).some(a => a.variants.some(v => /Enraged Toss|Whirlwind/.test(v)))) throw Error('Locked variants should not be granted');
    if (actions(barbarian).some(a => a.slots.name === 'Whirlwind')) throw Error('Whirlwind granted before Berserker');
    io.loadFromJSON(JSON.stringify(barbarian));
    const barbarianSaved = JSON.parse(io.serializeSheet());
    if (!actions(barbarianSaved).find(a => a.slots.name === 'Charge').ui.tableHidden) throw Error('Hidden table state lost');
    for (const block of actions(barbarian).filter(a => a.variants.length)) {
      const savedBlock = actions(barbarianSaved).find(a => a.slots.name === block.slots.name);
      const normalize = html => { const el = document.createElement('div'); el.innerHTML = html; return el.innerHTML; };
      if (JSON.stringify(block.variants.map(normalize)) !== JSON.stringify(savedBlock.variants.map(normalize)) || savedBlock.ui.variantsHidden) throw Error(`Variants lost on save: ${JSON.stringify({block, savedBlock})}`);
    }
    io.loadFromJSON(JSON.stringify(multi));
    const multiSaved = JSON.parse(io.serializeSheet());
    for (const name of ['Melee Strike', 'Ranged Strike']) {
      const before = actions(multi).find(a => a.slots.name === name);
      const after = actions(multiSaved).find(a => a.slots.name === name);
      if (JSON.stringify(before.tableRows) !== JSON.stringify(after.tableRows)) throw Error('Weapon rows lost on save');
    }
    io.loadFromJSON(JSON.stringify(built));
    const saved = JSON.parse(io.serializeSheet());
    const invalid = structuredClone(bard); invalid.spells['class-spells'] = ['Godly Force'];
    const ossian = cases.find(c => c.headers.species === 'Ossian' && c.headers.class === 'Archer' && c.headers.level === '3');
    ossian.headers['character-name'] = 'Varek';
    return { bard, ossian, failures, total: cases.length, built, saved, rejectsExclusive: m.validateCharacter(invalid).length > 0 };
  });
  assert.deepEqual(result.failures, []);
  assert(result.total >= 400);
  assert(result.rejectsExclusive);
  assert.deepEqual(result.saved.creation, result.built.creation);
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

  // Rebuilding uses saved choices, preserves presentation, and can be recovered.
  const beforeRebuild = await page.evaluate(async () => {
    const io = await import('/src/io.js');
    const sheet = JSON.parse(io.serializeSheet());
    sheet.headers.experience = '123';
    sheet.sections['Class Features'].sectionBody = '<p>My manual feature edit.</p>';
    io.loadFromJSON(JSON.stringify(sheet));
    return JSON.parse(io.serializeSheet());
  });
  await page.locator('#menu-rebuild-character').evaluate(el => el.click());
  assert(await page.getByRole('button', {name:'Rebuild character',exact:true}).isEnabled());
  await page.getByRole('button', {name:'Close character creation'}).click();
  assert.deepEqual(await page.evaluate(async () => JSON.parse((await import('/src/io.js')).serializeSheet())), beforeRebuild);
  await page.locator('#menu-rebuild-character').evaluate(el => el.click());
  await page.getByRole('button', {name:'Rebuild character',exact:true}).click();
  const rebuilt = await page.evaluate(async () => JSON.parse((await import('/src/io.js')).serializeSheet()));
  assert.deepEqual(rebuilt.creation, beforeRebuild.creation);
  assert.deepEqual(rebuilt.preferences, beforeRebuild.preferences);
  assert.deepEqual(rebuilt.portrait, beforeRebuild.portrait);
  assert.equal(rebuilt.headers.experience, '123');
  assert(rebuilt.sections['Class Features'].sectionBody.includes('War Singing'));
  assert(!rebuilt.sections['Class Features'].sectionBody.includes('My manual feature edit'));
  await page.locator('#menu-recover-character').evaluate(el => el.click());
  assert.deepEqual(await page.evaluate(async () => JSON.parse((await import('/src/io.js')).serializeSheet())), beforeRebuild);

  const invalidRebuild = await page.evaluate(async () => {
    const io = await import('/src/io.js'); const sheet = JSON.parse(io.serializeSheet());
    const {spellPlan, validateCharacter} = await import('/src/character-creation.js');
    const group = spellPlan(sheet.creation).groups.find(group => group.count > 0).id;
    sheet.creation.spells[group] = ['No longer available'];
    io.loadFromJSON(JSON.stringify(sheet));
    return {errors:validateCharacter(JSON.parse(io.serializeSheet()).creation), choices:JSON.parse(io.serializeSheet()).creation};
  });
  assert(invalidRebuild.errors.length, JSON.stringify(invalidRebuild));
  await page.locator('#menu-rebuild-character').evaluate(el => el.click());
  await page.locator('.creation-wizard[open]').waitFor();
  assert(await page.getByRole('button', {name:'Rebuild character',exact:true}).isDisabled(), await page.locator('.creation-content').innerText());
  await page.getByRole('button', {name:'Close character creation'}).click();

  assert.deepEqual(result.ossian.sections['Damage Defenses'].fields, { Resistances: 'Slashing, Piercing', Vulnerabilities: 'Crushing' });
  await page.evaluate(async sheet => { const io = await import('/src/io.js'); io.loadFromJSON(JSON.stringify(sheet)); }, result.ossian);
  assert.equal(await page.getByLabel('Resistances', {exact:true}).innerText(), 'Slashing, Piercing');
  assert.equal(await page.getByLabel('Vulnerabilities', {exact:true}).innerText(), 'Crushing');
  await page.getByLabel('Resistances', {exact:true}).fill('Slashing, Piercing, Fire');
  const savedDefenses = await page.evaluate(async () => {
    const io = await import('/src/io.js'); const saved = io.serializeSheet(); io.loadFromJSON(saved);
    return JSON.parse(saved).sections['Damage Defenses'].fields;
  });
  assert.equal(savedDefenses.Resistances, 'Slashing, Piercing, Fire');
  await page.getByLabel('Resistances', {exact:true}).fill('Slashing, Piercing');
  await page.locator('.character-page').scrollIntoViewIfNeeded();
  await page.screenshot({path: 'C:/Users/eylon/.codex/visualizations/2026/09/15/01a0a530-6d6f-7f31-829c-b3c870dfb2f5/ossian-damage-defenses.png'});
  await page.emulateMedia({media:'print'});
  assert(await page.getByLabel('Resistances', {exact:true}).isVisible());
  const { damageDefenses } = await import('../src/damage-defenses.js');
  assert.deepEqual(damageDefenses('Slashing resistance; Crushing vulnerability', 'Resistance to Crushing'), {Resistances:'Slashing', Vulnerabilities:''});
  assert.deepEqual(damageDefenses('', 'Resistance to all Physical Damage'), {Resistances:'Slashing, Piercing, Crushing', Vulnerabilities:''});

  assert.deepEqual(errors, []);
  console.log(`${result.total} class/species/level combinations, grants, spell limits, sheet population and wizard validation passed.`);
} finally { await browser.close(); }
