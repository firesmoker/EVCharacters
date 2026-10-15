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
    assert(html.includes(`<dd>${creature.hp}</dd>`));
    assert(html.includes('<dt>FOR</dt><dd>1</dd>'));
    assert(html.includes('<dt>WILL</dt><dd>1</dd>'));
  }
  const beast = MONSTERS_DATABASE.find(item => item.name === 'Beast');
  assert(beast.actions.includes('Roll 3d6 against DEF'));
  assert(beast.actions.includes("Roll the summoner's Magic against DEF"));
  assert(!beast.actions.includes('+1 damage'));
  assert(!SPELLS_DATABASE.find(item => item.name === 'Summon Beast').description.includes('HP 3'));
});

test('ordinary spells have no stat block', () => {
  assert(!renderSpellDescriptionBlock(SPELLS_DATABASE.find(item => item.name === 'Light')).includes('monster-stat-block'));
});

test('stat blocks preserve zero values and escape creature text', () => {
  const html = renderMonsterStatBlock({ name: '<img>', type: 'A & B', hp: 0, actions: '<script>alert("x")</script>' });
  assert(html.includes('<dd>0</dd>'));
  assert(html.includes('<dt>DEF</dt><dd>1</dd>'));
  assert(html.includes('<dt>FOR</dt><dd>1</dd>'));
  assert(html.includes('<dt>WILL</dt><dd>1</dd>'));
  assert(renderMonsterStatBlock({name:'Zero defense',deflection:0,actions:''}).includes('<dt>DEF</dt><dd>0</dd>'));
  assert(html.includes('&lt;img&gt;'));
  assert(html.includes('A &amp; B'));
  assert(!html.includes('<script>'));
  assert.equal(renderMonsterStatBlock(undefined), '');
});
