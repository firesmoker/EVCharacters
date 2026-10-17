import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = path => JSON.parse(fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, ''));
const features = read('src/sheet-features.json');
const rules = read('src/creation-data.json');
const actions = read('src/creation-actions.json');
for (const [group, source, key] of [['classes',rules.classes,'Class'], ['subclasses',rules.subclasses,'Subclass'], ['species',rules.species,'Species']]) {
  for (const entity of source) assert(Array.isArray(features[group][entity[key]]), `Missing feature data: ${entity[key]}`);
  for (const [owner, records] of Object.entries(features[group])) for (const feature of records) {
    assert(Number.isInteger(feature.level), `${owner}: invalid feature level`);
    assert(feature.name && typeof feature.html === 'string');
    assert(!feature.html || /^<p><strong>[^<]+<\/strong> \S/.test(feature.html) || /^<ul>/.test(feature.html), `${owner}/${feature.name}: label must be inline`);
    assert(!feature.section || ['Class Features','Species Features','Additional Features'].includes(feature.section));
    for (const name of feature.actions || []) assert(actions.some(a => a.name === name), `Unknown action ${name}`);
  }
}
assert.equal(features.classes.Barbarian.find(f => f.name === 'Ram').html, '<p><strong>Ram:</strong> You gain the Ram Charge variant.</p>');
assert.deepEqual(features.classes.Barbarian.find(f => f.name === 'Cleave').actions, ['Cleave']);
console.log('Feature coverage, inline labels, destinations and action references passed.');
