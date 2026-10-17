import assert from 'node:assert/strict';
const { chromium } = await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:5174/');
  const result = await page.evaluate(async () => {
    const m = await import('/src/character-creation.js');
    const { tidyCharacterContent } = await import('/src/sheet-content.js');
    const example = { sections: {
      'Class Features': { sectionBody: '<p><strong>Example Feature</strong></p><p>First description.</p><ul><li>Keep this list.</li></ul><p>Keep this later paragraph.</p>' },
      'Species Features': { sectionBody: '<p><b>Example Trait</b><br>Trait description.</p>' },
      'Additional Features': { sectionBody: '<p>Hardwall</p><p>Passive feature</p><p>You gain proficiency with Heavy Armor.</p>' },
    } };
    const untouched = JSON.stringify(example.sections);
    tidyCharacterContent(example);
    for (const name of ['Class Features','Species Features','Additional Features']) {
      if (example.sections[name].sectionBody !== JSON.parse(untouched)[name].sectionBody) throw Error('Feature text must not be rewritten at load time');
    }
    const s = m.newCharacter(); s.species='Human'; s.className='Wizard';
    s.choices.origin=['Arcana']; s.choices['legacy-expert']=['Arcana'];
    const duplicate=m.skillChoiceWarning(s,'origin',0);
    s.choices['legacy-expert']=['Athletics'];
    const clear=m.skillChoiceWarning(s,'legacy-expert',0);
    s.choices.origin=['Magic'];
    const automatic=m.skillChoiceWarning(s,'origin',0);
    s.feats=m.DATA.feats.filter(f=>/Cast Marvelously|Become Inspired/.test(f['Effect / Rules'])).map(f=>f.Feat);
    s.level=2; s.name='Test'; s.languages='Elvish'; s.choices={};
    const used=new Set();
    for(const g of m.skillPlan(s).groups) {
      s.choices[g.id]=g.options.filter(n=>!used.has(n)).slice(0,g.count);
      s.choices[g.id].forEach(n=>used.add(n));
    }
    for(let i=0;i<m.spellPlan(s).groups.length;i++) {
      const g=m.spellPlan(s).groups[i]; s.spells[g.id]=g.options.slice(0,g.count).map(sp=>sp.name);
    }
    s.feats.push('Deep Sleep');
    s.equipment.weapon=m.equipmentPlan(s).choices[0]||'';
    const built=m.buildCharacter(s);
    const html=built.sections['Instinct Abilities'].sectionBody;
    const strike=built.sections['Strikes & Damaging Cantrips'].dynamicRows[0].slots.notes;
    const data={sections:{'Instinct Abilities':{sectionBody:'<ul><li><strong>You gain the following Instinct ability:</strong>: Become Inspired (1 / Day): When you roll, roll with advantage.</li><li><strong>Arcane Shield (1 / Day):</strong> Full repeated spell text.</li></ul>'}}};
    data.sections['Class Features']={sectionBody:`<p><strong>Shephard</strong></p><p>${m.DATA.subclasses.find(x=>x.Subclass==='Shephard').Description}</p><p><strong><strong>Level 3:</strong> Multiple Summons</strong></p><p>You gain an additional summon slot.</p>`};
    tidyCharacterContent(data);
    const mixed = {sections:{
      'Class Features': {sectionBody:'<p><strong>Level 3: Historian</strong></p><p>You become Expert (5d6) in History.</p><p>If you were already Adept (4d6) in History, gain another skill.</p><p><strong>Level 3: Fidgety</strong></p><p>You gain the following Instinct abilities:</p><ul><li><b>Unleash:</b> Add 1 Extra Dice.</li><li><b>Evade:</b> Gain +1 Deflection against an attack.</li></ul><p>You have 1 more Instinct.</p><p><strong>Moving Target</strong></p><p>Gain +1 Deflection after moving and Expert Acrobatics.</p>'},
      'Instinct Abilities': {sectionBody:'<ul><li><b>Unleash:</b> Add 1 Extra Dice.</li><li><b>Evade:</b> Gain +1 Deflection against an attack.</li></ul>'},
      'Standard Skills': {dynamicRows:[{type:'skill',values:['History','Expert (5d6)']}]},
    }};
    tidyCharacterContent(mixed);
    const mixedFeatures = mixed.sections['Class Features'].sectionBody;
    tidyCharacterContent(mixed);
    if (mixed.sections['Class Features'].sectionBody !== mixedFeatures) throw Error('Feature cleanup must be idempotent');
    return {mixedFeatures, history:mixed.sections['Standard Skills'].dynamicRows[0].values,cleanedClass:data.sections['Class Features'].sectionBody,duplicate,clear,automatic,html,strike,classFeatures:built.sections['Class Features'].sectionBody,speciesFeatures:built.sections['Species Features'].sectionBody,repaired:data.sections['Instinct Abilities'].sectionBody};
  });
  assert(result.cleanedClass.includes('Multiple Summons'));
  assert(!result.classFeatures.includes('Level 1:'));
  assert(!result.classFeatures.includes('Instinct Abilities'), result.classFeatures);
  assert(result.classFeatures.includes('Fae Familiar'));
  assert(!result.speciesFeatures.includes('Human Adaptiveness'));
  assert(result.speciesFeatures.includes('Legacy of Discovery'));
  assert(result.mixedFeatures.includes('You have 1 more Instinct'));
  assert(result.mixedFeatures.includes('Moving Target'));
  assert.deepEqual(result.history, ['History', 'Expert (5d6)']);
  assert(!/Level \d/.test(result.speciesFeatures));
  assert(result.html.includes('Human Adaptiveness'));
  assert(result.html.includes('Evade'));
  assert.match(result.strike,/On success, deal SD .+ damage\. On failure, deal half damage, rounded down\./);
  assert.match(result.duplicate,/already granted elsewhere at 5d6/);
  assert.equal(result.clear,'');
  assert.match(result.automatic,/already granted/);
  assert(!result.html.includes('You gain the following Instinct'));
  assert(result.html.includes('<strong>Cast Marvelously (1 / Day):</strong>'));
  assert(result.html.includes('<strong>Become Inspired (1 / Day):</strong>'));
  assert.equal(result.repaired,'<ul><li><strong>Become Inspired (1 / Day):</strong> When you roll, roll with advantage.</li><li><strong>Arcane Shield (1 / Day):</strong> See spell description.</li></ul>');
  await page.evaluate(async()=>{const {initCreationWizard}=await import('/src/creation-wizard.js'); initCreationWizard(()=>{})();});
  await page.getByRole('button',{name:'Training & feats',exact:false}).click();
  await page.locator('[data-key="skill:origin:0"]').selectOption('Athletics');
  await page.locator('[data-key="skill:legacy-expert:0"]').selectOption('Athletics');
  assert(await page.getByRole('status').filter({hasText:'Athletics is already granted'}).count()>0);
  await page.locator('[data-key="skill:legacy-expert:0"]').selectOption('Arcana');
  assert.equal(await page.getByRole('status').filter({hasText:'Athletics is already granted'}).count(),0);
  console.log('Duplicate skill warnings and generated/existing Instinct formatting passed.');
} finally {await browser.close();}
