import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MONSTERS_DATABASE } from '../src/monsters_data.js';
import { SPELLS_DATABASE } from '../src/spells_data.js';
import { renderMonsterStatBlock, renderSpellDescriptionBlock } from '../src/components.js';

test('summoning spells render their current creature profiles exactly once', () => {
  for (const [spellName, creatureName] of [['Summon Beast', 'Beast'], ['Summon Shade', 'Shade'], ['Nature Spirit', 'Spirit']]) {
    const spell = SPELLS_DATABASE.find(item => item.name === spellName);
    const creature = MONSTERS_DATABASE.find(item => item.name === creatureName);
    assert(creature);
    const html = renderSpellDescriptionBlock(spell);
    assert.equal((html.match(/class="monster-stat-block"/g) || []).length, 1);
    assert(html.includes(`${creatureName} stat block`));
    assert(html.includes('<div class="spell-description-text">'));
    assert(!html.includes('editable-field spell-description-text'));
    assert(html.includes(`<dd>${creature.hp}</dd>`));
    assert(html.includes('<dt>FOR</dt><dd>1</dd>'));
    assert(html.includes('<dt>WILL</dt><dd>1</dd>'));
  }
  const beast = MONSTERS_DATABASE.find(item => item.name === 'Beast');
  assert(beast.actions.find(action => action.name === 'Animal Strike').description.includes('Roll 3d6 against DEF'));
  assert(beast.actions.find(action => action.name === 'Enhanced Animal Strike').description.includes("Roll the summoner's Magic against DEF"));
  assert(!beast.actions.some(action => action.description?.includes('+1 damage')));
  assert(!SPELLS_DATABASE.find(item => item.name === 'Summon Beast').description.includes('HP 3'));
});

test('ordinary spells have no stat block', () => {
  assert(!renderSpellDescriptionBlock(SPELLS_DATABASE.find(item => item.name === 'Light')).includes('monster-stat-block'));
});

test('empowerment gets a shaded section with a bold label', () => {
  for (const spell of SPELLS_DATABASE) {
    const labels = spell.description.match(/(?:^|\n)Empower(?:ed)? Spell:/g) || [];
    const html = renderSpellDescriptionBlock(spell);
    assert.equal((html.match(/class="spell-empowerment"/g) || []).length, labels.length, spell.name);
  }
  const animal = renderSpellDescriptionBlock(SPELLS_DATABASE.find(spell => spell.name === 'Animal Messenger'));
  assert(animal.includes('<strong>Empower Spell:</strong>'));
  const scythe = renderSpellDescriptionBlock(SPELLS_DATABASE.find(spell => spell.name === 'Ice Scythe'));
  assert(scythe.includes('<strong>Empower Spell:</strong>'));
  assert(scythe.indexOf('<strong>Double 6:</strong>') < scythe.indexOf('class="spell-empowerment"'));
});

test('spell Double 6 effects are labeled once, at the end before empowerment', () => {
  const spells = SPELLS_DATABASE.filter(spell => /Double 6:/.test(spell.description));
  assert.equal(spells.length, 16);
  for (const spell of spells) {
    assert.equal((spell.description.match(/Double 6:/g) || []).length, 1, spell.name);
    assert(!/If you roll(?:ed)? (?:a )?double (?:six|6)/i.test(spell.description), spell.name);
    assert.equal((renderSpellDescriptionBlock(spell).match(/<strong>Double 6:<\/strong>/g) || []).length, 1, spell.name);
    const effect = spell.description.split('Double 6:')[1];
    assert(!/\n\n(?!Empower(?:ed)? Spell:)/.test(effect), spell.name);
  }
  const flare = spells.find(spell => spell.name === 'Elemental Flare');
  for (const type of ['Fire', 'Lightning', 'Ice']) assert(flare.description.includes('• ' + type + ':'));
  const scythe = spells.find(spell => spell.name === 'Ice Scythe');
  assert(!scythe.description.includes('Its Double 6 effect'));
});

test('spell formatting uses canonical empowerment labels and real bullet lists', () => {
  for (const spell of SPELLS_DATABASE) {
    assert(!/Empowered Spell:/i.test(spell.description), spell.name);
    const bullets = spell.description.match(/^[ \t]*•/gm) || [];
    if (bullets.length) {
      const html = renderSpellDescriptionBlock(spell);
      assert.equal((html.match(/<li>/g) || []).length, bullets.length, spell.name);
      assert(!html.split('<div class="spell-description-text">')[1].includes('• '), spell.name);
    }
  }
  const aura = SPELLS_DATABASE.find(spell => spell.name === 'Aura of Truth');
  assert(aura.description.includes('\nWhen a creature first enters'));
  assert(aura.description.includes('\nOn success,'));
  const empowered = SPELLS_DATABASE.filter(spell => spell.description.includes('Empower Spell:'));
  assert.equal(empowered.length, 27);
  for (const spell of empowered) {
    const text = spell.description.split('Empower Spell:')[1];
    assert(!/\bextra\b(?! Dice)|\bSP\b|^ For every/i.test(text), spell.name);
    assert(/^(?: For each (?:2 )?additional Spell Points? spent,| Spend 2 additional Spell Points)/.test(text), spell.name);
  }
});

test('traits and actions render in separate labeled sections', () => {
  for (const creature of MONSTERS_DATABASE) {
    const html = renderMonsterStatBlock(creature);
    assert.equal((html.match(/<h4>Traits<\/h4>/g) || []).length, 1);
    assert.equal((html.match(/<h4>Actions<\/h4>/g) || []).length, 1);
    for (const action of creature.actions) assert(html.includes(`<strong>${action.name}</strong>`));
    assert.equal((html.match(/class="monster-stat-speed"/g) || []).length, creature.actions.filter(action => action.speed).length);
    for (const action of creature.actions.filter(action => action.speed)) {
      assert(html.includes(`monster-stat-speed">${action.speed}</span>`));
      assert(!action.detail?.includes(action.speed));
    }
    assert.equal((html.match(/class="monster-stat-entry"/g) || []).length, creature.actions.length + creature.traits.length);
  }
  const shade = MONSTERS_DATABASE.find(item => item.name === 'Shade');
  assert(shade.traits.some(trait => trait.description?.includes('Ignores difficult terrain')));
  const spirit = MONSTERS_DATABASE.find(item => item.name === 'Spirit');
  assert(spirit.traits.some(trait => trait.name === 'Flying'));
  assert(renderMonsterStatBlock(spirit).includes('monster-stat-entry-detail">Costs 1 HP</span>'));
  assert(renderMonsterStatBlock(MONSTERS_DATABASE[0]).includes('monster-stat-empty">None.</li>'));
});

test('stat blocks preserve zero values and escape creature text', () => {
  const html = renderMonsterStatBlock({ name: '<img>', type: 'A & B', hp: 0,
    traits: [{name:'<b>unsafe</b>'}], actions: [{name:'Attack',detail:'<i>cost</i>',description:'<script>alert("x")</script>'}] });
  assert(html.includes('<dd>0</dd>'));
  assert(html.includes('<dt>DEF</dt><dd>1</dd>'));
  assert(html.includes('<dt>FOR</dt><dd>1</dd>'));
  assert(html.includes('<dt>WILL</dt><dd>1</dd>'));
  assert(renderMonsterStatBlock({name:'Zero defense',deflection:0}).includes('<dt>DEF</dt><dd>0</dd>'));
  assert(html.includes('&lt;img&gt;'));
  assert(html.includes('A &amp; B'));
  assert(!html.includes('<script>'));
  assert(html.includes('&lt;b&gt;unsafe&lt;/b&gt;'));
  assert(html.includes('&lt;i&gt;cost&lt;/i&gt;'));
  assert.equal(renderMonsterStatBlock(undefined), '');
});
