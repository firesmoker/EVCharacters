import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = path => JSON.parse(fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, ''));
const features = read('src/sheet-features.json');
const rules = read('src/creation-data.json');
const actions = read('src/creation-actions.json');
for (const feat of rules.feats) {
  assert(features.feats[feat.Feat]?.some(record => record.html.includes(`<strong>${feat.Feat}:</strong>`)), `Feat must remain visible: ${feat.Feat}`);
}
for (const [group, source, key] of [['classes',rules.classes,'Class'], ['subclasses',rules.subclasses,'Subclass'], ['species',rules.species,'Species'], ['feats',rules.feats,'Feat']]) {
  for (const entity of source) assert(Array.isArray(features[group][entity[key]]), `Missing feature data: ${entity[key]}`);
  for (const [owner, records] of Object.entries(features[group])) for (const feature of records) {
    assert(feature.level === null || Number.isInteger(feature.level), `${owner}: invalid feature level`);
    if (!feature.html) assert(feature.omitReason, `${owner}/${feature.name}: explain omission`);
    assert(feature.name && typeof feature.html === 'string');
    assert(!feature.html || /^<p><strong>[^<]+<\/strong> \S/.test(feature.html) || /^<ul>/.test(feature.html), `${owner}/${feature.name}: label must be inline`);
    assert(!feature.section || ['Class Features','Species Features','Additional Features'].includes(feature.section));
    for (const name of feature.actions || []) assert(actions.some(a => a.name === name), `Unknown action ${name}`);
    for (const ability of feature.instincts || []) assert(ability.html.startsWith(`<li><strong>${ability.name}:</strong> `), `${owner}: bad Instinct title`);
  }
}
assert.equal(features.classes.Barbarian.find(f => f.name === 'Ram').html, '<p><strong>Ram:</strong> You gain the Ram Charge variant.</p>');
assert.deepEqual(features.classes.Barbarian.find(f => f.name === 'Cleave').actions, ['Cleave']);
for (const [group, key, field] of [['classes','Class','Class Features / Rules'],['subclasses','Subclass','Full Features / Rules']]) {
  for (const entity of rules[group]) {
    const records=features[group][entity[key]];
    for (const match of entity[field].matchAll(/^Level (?:\d+|\?): (.+)$/gm)) {
      const name=match[1];
      if(name==='Subclasses') continue;
      const alias=entity[key]==='Druid' && name==='Expanded Instinct Abilities'?'Instinct Abilities':name==='Mechanism Options?'?'Mechanisms':name;
      assert(records.some(f=>f.name===alias), `Unaudited feature: ${entity[key]} / ${name}`);
    }
  }
}
assert(features.subclasses.Worldshaper.find(f=>f.name==='Earth Bending').html.includes('second time'));
assert(features.subclasses['Fae Trickster'].find(f=>f.name==='Fidgety').html.includes('1 additional Instinct'));
assert(features.subclasses.Witchblade.filter(f=>['Mutant Body','Vile Slash'].includes(f.name)).every(f=>f.level===null));
console.log('Feature coverage, inline labels, destinations and action references passed.');
