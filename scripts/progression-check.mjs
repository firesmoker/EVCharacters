import assert from 'node:assert/strict';
import fs from 'node:fs';
const { chromium } = await import(process.env.EV_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
try {
  const page = await browser.newPage();
  await page.goto(process.env.EV_TEST_URL || 'http://127.0.0.1:5174/');
  const result = await page.evaluate(async () => {
    const m = await import('/src/character-creation.js');
    const stats = (className, level, subclass = '') => m.progression({ ...m.newCharacter(), className, level, subclass });
    const series = (className, key) => Array.from({ length: 10 }, (_, i) => stats(className, i + 1)[key]);
    const equal = (a, b, label) => { if (JSON.stringify(a) !== JSON.stringify(b)) throw Error(label); };
    const casterHP = [5,5,6,6,7,7,8,8,9,10], martialHP = [5,6,6,7,8,8,9,10,11,12];
    const frontliners = ['Barbarian','Paladin','Warrior','Spellsword','Zephyr'];
    for (const c of m.DATA.classes) {
      equal(series(c.Class, 'hp'), frontliners.includes(c.Class) ? martialHP : casterHP, `${c.Class} HP`);
      equal(series(c.Class, 'minorFeats'), [1,2,2,2,2,2,2,2,2,2], `${c.Class} feats`);
      if (stats(c.Class, 1).instinct !== 1) throw Error(`${c.Class} starting Instinct`);
      if (m.DATA.progression.filter(r => r.Class === c.Class).length !== 10) throw Error(`${c.Class} missing levels`);
    }
    for (const key of ['points','spells','cantrips','rank']) {
      equal(series('Occultist', key), series('Wizard', key), `Occultist ${key}`);
      equal(series('Druid', key), series('Cleric', key), `Druid ${key}`);
    }
    equal(series('Wizard','points'), [4,5,6,7,9,10,12,13,15,17], 'Keep Wizard SP');
    equal(series('Wizard','spells'), [4,5,7,9,11,13,15,17,20,24], 'Keep Wizard spells');
    equal(series('Cleric','points'), [3,4,5,6,7,8,9,10,11,12], 'Keep Cleric SP');
    equal(series('Spellsword','points'), series('Bard','points'), 'Spellsword SP');
    equal(series('Spellsword','spells'), series('Bard','spells').map(n => n - 1), 'Spellsword spells');
    equal(series('Spellsword','cantrips'), series('Bard','cantrips'), 'Spellsword cantrips');
    for (const name of ['Bard','Cleric','Druid','Occultist','Wizard','Spellsword']) equal(series(name,'rank'), [1,1,2,2,3,3,4,4,5,5], `${name} ranks`);
    equal(series('Alchemist','concoctionPoints'), [4,5,7,8,10,11,13,14,16,18], 'Alchemist CP');
    equal(series('Alchemist','concoctions'), [4,5,6,7,8,9,10,11,12,14], 'Alchemist known');
    equal(series('Archer','archeryPoints'), [3,3,3,4,4,4,5,5,5,6], 'Archer AP');
    equal(series('Bard','summons'), [0,0,1,1,1,1,1,1,1,1], 'Bard summons');
    for (const name of ['Druid','Occultist']) equal(series(name,'summons'), Array(10).fill(1), `${name} summons`);
    if (stats('Druid',3,'Shephard').summons !== 2) throw Error('Keep Shephard bonus');
    if (stats('Warrior',3,'Sentinel').instinct !== stats('Warrior',3).instinct + 1) throw Error('Keep Sentinel bonus');
    const alchemist = m.specialChoices({ ...m.newCharacter(), className:'Alchemist', level:10 })[0];
    if (alchemist.count !== 10 || alchemist.unfilled !== 4) throw Error('Preserve unfilled concoction slots');
    equal(m.sheetFeatureHTML('{{progression.concoctionPoints}}', {}, stats('Alchemist',10)), '18', 'Resource interpolation');
    const incomplete = { ...m.newCharacter(), name:'Test', species:'High Elf', level:2, feats:['Tough','Pet'] };
    if (!m.validateCharacter(incomplete).includes('Choose 2 minor feats.')) throw Error('Require second Minor Feat');
    return { classes:m.DATA.classes.length, rows:m.DATA.progression.length };
  });
  assert.deepEqual(result, { classes:14, rows:140 });
  const book = fs.readFileSync('Eternal Valor 0.53.md','utf8');
  assert.equal((book.match(/### Resource \/ Spell Progression Table/g) || []).length, 14);
  assert.match(book, /At level 1 and again at level 2/);
  console.log('All 140 progression rows, resource curves, ranks, summon slots, and Minor Feats passed.');
} finally { await browser.close(); }
