import { compareSpellRows } from './spell-sort.js';
import DATA from './creation-data.json';
import { SKILLS_LIST, COMBAT_SKILLS_LIST, DEFAULT_COMBAT_SKILLS } from './data.js';
import { SPELLS_DATABASE } from './spells_data.js';
import { tidyCharacterContent } from './sheet-content.js';
import { cantripAction } from './cantrip-action.js';
import ACTIONS from './creation-actions.json';
import SHEET_FEATURES from './sheet-features.json';
import { damageDefenses } from './damage-defenses.js';

export { DATA };
export const standardSkills = SKILLS_LIST.flatMap(g => g.options);
const category = skill => SKILLS_LIST.find(g => g.options.includes(skill))?.groupLabel;
const traditions = { Bard: 'Bardic', Cleric: 'Divine', Druid: 'Nature', Wizard: 'Arcane', Occultist: 'Occult', Spellsword: 'Arcane' };
const affinity = { 'High Elf': 'Arcane', Ossian: 'Occult', Remnant: 'Divine' };
const freeSpells = { 'High Elf': ['Arcane Shield', 'Detect Magic', 'Magic Missile'], Ossian: ['Detect Magic', 'Eldritch Shield', 'Hex'], Remnant: ['Detect Magic', 'Healing Touch', 'Shield of Faith'] };
const classCantrip = { Wizard: 'Elemental Flare', Cleric: 'Radiant Beam', Druid: 'Speak with Animals', Occultist: 'Necrotic Bolt' };
const startingMagic = { Bard: [2, 3, 2], Cleric: [3, 3, 3], Druid: [3, 4, 3], Wizard: [4, 4, 3], Occultist: [4, 4, 3], Spellsword: [2, 2, 2] };
const subclassTraining = { 'Tale Weaver': ['History', 'Knowledge'], Assassin: ['Disguise', 'Other'], 'Fae Trickster': ['Deception', 'Speech'], Toymaker: ['Mechanics', 'Knowledge'], 'Walking Ballista': ['Mechanics'], Bowslinger: ['Acrobatics'], 'Arcane Archer': ['Arcana'], Witchblade: ['Magic'] };
const names = (s) => s.replace(/\band\b|\bor\b/g, ',').split(',').map(x => x.trim().replace(/[.]$/, '')).filter(Boolean);
const canonicalSkill = s => ({ 'Weapon Throws': 'Weapon Throw', Stealth: 'Sneak', 'Mechanical(Disarm Traps)': 'Mechanics (Disarm Traps)' }[s] || s);
export const escapeHTML = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const p = s => `<p>${escapeHTML(s)}</p>`;
export function sheetFeatureHTML(html, choices) {
  return html.replace(/\{\{choices\.([\w-]+)\}\}/g, (_, key) => {
    const values = choices[key];
    if (!Array.isArray(values) || !values.length || values.some(v => !v.trim())) throw new Error(`Missing feature choice: ${key}`);
    return escapeHTML(new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(values));
  });
}
const section = (body = '') => ({ fields: {}, checkboxes: {}, splitFields: {}, dynamicRows: [], sectionBody: body });
export const newCharacter = () => ({ name: '', player: '', className: 'Bard', species: 'Human', subclass: '', level: 1, feats: [], choices: {}, spells: {}, equipment: {}, languages: '', notes: '' });
export const classFor = s => DATA.classes.find(c => c.Class === s.className);
export const speciesFor = s => DATA.species.find(c => c.Species === s.species);
export const subclassesFor = s => DATA.subclasses.filter(c => c['Parent Class'] === s.className && Number(c['Unlock Level']) <= s.level);
export const subclassFor = s => subclassesFor(s).find(c => c.Subclass === s.subclass);

export function specialChoices(s) {
  const result = [];
  if (s.className === 'Cleric') result.push({ id: 'domain', label: 'Divine Domain', count: 1, options: ['Light — Fire / Undead', 'Abyss — Psychic / Fae', 'Inferno — Fire / Celestials', 'Maelstrom — Ice / Devils', 'Resonance — Thunder / Constructs', 'Tempest — Lightning / Demons'] });
  if (s.className === 'Ranger') result.push({ id: 'favored', label: 'Favored enemy', count: 1, options: ['Abominations', 'Beasts', 'Dragons', 'Elementals', 'Fey', 'Fiends', 'Giants', 'Oozes', 'Plants', 'Undead'] });
  if (s.className === 'Alchemist') result.push({ id: 'concoctions', label: 'Known concoctions (higher-level count is provisional)', count: 4, options: ['Toughskin Potion', 'Fire Resistance Potion', 'Acid Resistance Potion', 'Poison Resistance Potion', 'Basic Healing Potion', 'Poison Bomb', 'Nerve Gas Bomb', 'Burning Bomb', 'Acid Coating', 'Nerve Coating'] });
  return result;
}

// Missing progression is deliberately provisional, never presented as a published rule.
export function progression(s) {
  const c = classFor(s), row = DATA.progression.find(p => p.Class === s.className && +p.Level === +s.level);
  const magic = startingMagic[s.className] || (s.subclass === 'Witchblade' ? [2, 2, 2] : [0, 0, 0]);
  const placeholders = [];
  function value(key, fallback, missing = true) {
    if (row?.[key] !== undefined && row[key] !== '') return Number(String(row[key]).replace('Rank ', ''));
    if (missing) placeholders.push(key);
    return fallback;
  }
  const hp = value('HP', +c.HP + Math.floor(s.level / 2), s.level > 1);
  const instinct = Math.max(1, value('Instinct', 1 + (s.level >= 7 ? 1 : 0), s.level > 1));
  const growth = s.level - (s.subclass === 'Witchblade' ? 3 : 1);
  return {
    hp: s.level === 1 ? +c.HP : hp,
    instinct: instinct + (['Sentinel', 'Fae Trickster'].includes(s.subclass) ? 1 : 0),
    points: magic[0] ? value('Spell Points', magic[0] + growth, growth > 0) : 0,
    spells: magic[1] ? value('Spells Known', magic[1] + growth, growth > 0) : 0,
    cantrips: magic[2] ? value('Cantrips Known', magic[2] + Math.floor(Math.max(0, growth) / 2), growth > 0) : 0,
    rank: value('Max Spell Rank', Math.min(3, Math.ceil(s.level / 2)), !!magic[0] && s.level > 5),
    devotion: s.className === 'Paladin' ? value('Devotion Points', s.level + 2) : 0,
    summons: (['Druid', 'Occultist'].includes(s.className) ? 1 : 0) + (s.subclass === 'Shephard' ? 1 : 0),
    traditions: [...new Set([traditions[s.className], s.subclass === 'Witchblade' && 'Occult', s.subclass === 'Chronomancer' && 'Chrono'].filter(Boolean))],
    placeholders,
  };
}

export function skillPlan(s) {
  const fixed = {}, groups = [];
  const grant = (name, dice) => { fixed[name] = Math.max(fixed[name] || 3, dice); };
  const add = (id, label, count, dice, options, distinct = false) => groups.push({ id, label, count, dice, options, distinct });
  for (const [i, line] of classFor(s)['Skill Training'].split('\n').entries()) {
    const [rule, training] = line.split(' → ');
    const dice = Number(training?.match(/(\d)d6/)?.[1] || 4);
    if (/choice|following/i.test(rule)) {
      const count = /three|^3/i.test(rule) ? 3 : /two/i.test(rule) ? 2 : 1;
      let options = rule.includes(':') ? names(rule.split(':').slice(1).join(':').replace('Medicine Nature', 'Medicine, Nature')).map(canonicalSkill) : standardSkills;
      if (/Knowledge skill/i.test(rule)) options = SKILLS_LIST.find(g => g.groupLabel === 'Knowledge').options;
      if (/"Other" category/i.test(rule)) options = SKILLS_LIST.find(g => g.groupLabel === 'Other').options;
      add(`class-${i}`, `${s.className} training`, count, dice, options, /different categor/i.test(rule));
    } else grant(canonicalSkill(rule.trim()), dice);
  }
  add('origin', 'Origin skill', 1, 4, standardSkills);
  const trait = speciesFor(s)['Traits / Rules'];
  if (s.species === 'Human') {
    add('legacy-expert', 'Legacy of Discovery', 1, 5, standardSkills);
    add('legacy-adept', 'Legacy of Discovery', 1, 4, standardSkills);
  } else {
    const list = trait.match(/one of the following: ([^.]+)\./)?.[1];
    if (list) add('legacy-expert', 'Species legacy', 1, 5, names(list));
  }
  if (affinity[s.species]) grant('Magic', 5);
  if (s.species === 'High Elf') add('cramming', 'Knowledge Cramming (until next long rest)', 1, 4, standardSkills);
  if (s.feats.includes('Skilled')) add('skilled', 'Skilled feat', 2, 4, standardSkills, true);
  if (s.feats.includes('Skill Training')) add('skill-training', 'Skill Training feat', 1, 4, standardSkills);
  for (const name of s.feats) {
    const match = name.match(/^Expert (.+) Training$/);
    if (match) grant(match[1], 5);
  }
  const base = { ...fixed };
  for (const g of groups) for (const choice of s.choices[g.id] || []) if (g.options.includes(choice)) grant(choice, g.dice);
  const special = s.subclass === 'Muse' ? [s.choices['muse-skill']?.[0], 'Speech'] : subclassTraining[s.subclass];
  if (s.subclass === 'Muse') add('muse-skill', 'Difficult to Ignore', 1, 5, ['Charm', 'Deception']);
  if (special?.[0]) {
    const [name, group] = special, previous = fixed[name] || 3;
    grant(name, 5);
    if (group && previous >= 4) add('subclass-replacement', 'Subclass replacement skill', 1, 4, SKILLS_LIST.find(g => g.groupLabel === group).options.filter(x => x !== name));
    if (group && previous >= 5) add('subclass-extra', 'Subclass extra skill', 1, 4, standardSkills.filter(x => x !== name));
  }
  for (const g of groups) for (const choice of s.choices[g.id] || []) if (g.options.includes(choice)) grant(choice, g.dice);
  return { fixed, base, groups };
}

export function skillChoiceWarning(s, groupId, index) {
  const name = s.choices[groupId]?.[index];
  if (!name) return '';
  const otherChoices = { ...s.choices, [groupId]: s.choices[groupId].filter((_, i) => i !== index) };
  const existing = skillPlan({ ...s, choices: otherChoices }).fixed[name];
  return existing ? `${name} is already granted elsewhere at ${existing}d6. Only the highest training applies; these grants do not stack.` : '';
}

export function eligibleFeat(feat, s) {
  const skills = skillPlan(s).fixed;
  const trained = skill => (skills[skill] || 3) >= 4;
  if (/Level 2/i.test(feat.Requirements) && s.level < 2) return false;
  if (feat.Feat === 'Actor') return (trained('Deception') || trained('Performance')) && trained('Disguise');
  const req = feat.Requirements.match(/Trained in (.+)$/i)?.[1];
  return !req || req.split(/ or |, /).some(trained);
}

export function spellPlan(s) {
  const stats = progression(s), groups = [], known = new Map();
  const addKnown = (name, note) => known.set(name, [known.get(name), note].filter(Boolean).join('; '));
  if (s.species === 'Remnant') addKnown('Godly Force', 'Species exclusive');
  if (s.level >= 2) for (const name of freeSpells[s.species] || []) addKnown(name, '1/day free; no empowerment');
  function group(id, label, count, types, cantrip, fixed = []) {
    let remaining = count;
    for (const name of fixed) if (!known.has(name)) { addKnown(name, label); remaining--; }
    const options = SPELLS_DATABASE.filter(spell => !spell.exclusive && (cantrip ? spell.rank === 'Cantrip' : spell.rank !== 'Cantrip' && +spell.rank <= stats.rank)
      && Number(spell.requirements?.match(/Level (\d+)/i)?.[1] || 1) <= s.level
      && spell.spellType.split('/').some(t => types.includes(t.trim())) && !known.has(spell.name));
    groups.push({ id, label, count: Math.min(options.length, Math.max(0, remaining)), unfilled: Math.max(0, remaining - options.length), options });
    for (const name of s.spells[id] || []) if (options.some(x => x.name === name)) addKnown(name, label);
  }
  if (affinity[s.species]) group('species-cantrips', `${s.species} cantrips`, 2, [affinity[s.species]], true);
  if (stats.cantrips) group('class-cantrips', `${s.className} cantrips`, stats.cantrips, stats.traditions, true, classCantrip[s.className] ? [classCantrip[s.className]] : []);
  if (stats.spells) group('class-spells', `${s.className} spells`, stats.spells, stats.traditions, false);
  const bonus = { Hierophant: ['Thaumaturgy', 'Divine'], Worldshaper: ['Mold Earth', 'Nature'], Defiler: ['Necrotic Bolt', 'Occult'], Warden: ['Cure', 'Divine'] }[s.subclass];
  if (bonus) group('subclass-spell', `${s.subclass} bonus`, 1, [bonus[1]], s.subclass !== 'Warden', [bonus[0]]);
  if (s.subclass === 'Hierophant') addKnown('Command', 'Subclass; WIP');
  if (s.subclass === 'Chronomancer') group('chrono', 'Secrets of Chronomancy', 2, ['Chrono'], false);
  if (s.feats.includes('Arcane Detection')) addKnown('Detect Magic', 'Arcane Detection feat; see feat rules');
  return { groups, known };
}

export function equipmentPlan(s) {
  const weaponNames = DATA.weapons.map(w => w.Weapon);
  const rules = classFor(s)['Starting Equipment'];
  const weapons = rules.match(/Weapons: ([\s\S]*?)(?:\n|$)/)?.[1] || '';
  let choices = [];
  if (/choose|any/i.test(weapons)) {
    choices = /any.*melee/i.test(weapons) ? DATA.weapons.filter(w => /Melee/.test(w.Category) && (!/two-handed/.test(weapons) || w['Other Properties'].includes('Two Handed'))).map(w => w.Weapon) : weaponNames.filter(w => weapons.includes(w));
  }
  const fixed = weaponNames.filter(w => weapons.includes(w) && !choices.includes(w));
  const armorText = rules.match(/Armor: (.*)/)?.[1] || '';
  const armor = DATA.armor.find(a => armorText.includes(a.Name))?.Name || '';
  const shield = /Shield: Heavy Shield/.test(rules) ? 'Heavy Shield' : '';
  return { choices, fixed, armor, shield, rules };
}

export function featureHTML(text) {
  const lines = text.split('\n').filter(x => x.trim());
  let html = '', bullets = [];
  const flush = () => { if (bullets.length) html += `<ul>${bullets.map(x => `<li>${x}</li>`).join('')}</ul>`; bullets = []; };
  for (const line of lines) {
    const value = line.replace(/^•\s*/, '');
    const colon = value.indexOf(':');
    const body = colon > 0 && colon < 65 ? `<strong>${escapeHTML(value.slice(0, colon + 1))}</strong>${escapeHTML(value.slice(colon + 1))}` : escapeHTML(value);
    if (line.startsWith('•')) bullets.push(body);
    else { flush(); html += `<p>${/^Level \d+:/.test(line) ? `<strong>${body}</strong>` : body}</p>`; }
  }
  flush(); return html;
}

export function validateCharacter(s) {
  const errors = [];
  if (!s.name.trim()) errors.push('Enter a character name.');
  if (!Number.isInteger(+s.level) || s.level < 1 || s.level > 10) errors.push('Choose a level from 1 to 10.');
  if (subclassesFor(s).length && !subclassFor(s)) errors.push('Choose a subclass.');
  for (const g of specialChoices(s)) {
    const chosen = s.choices[g.id] || [];
    if (chosen.length !== g.count || new Set(chosen).size !== g.count || chosen.some(v => !g.options.includes(v))) errors.push(`Complete ${g.label} (${g.count} choices).`);
  }
  for (const category of ['Origin', 'Minor']) {
    const required = category === 'Origin' ? (s.species === 'Human' ? 2 : 1) : 1;
    const chosen = DATA.feats.filter(f => f.Category === category && s.feats.includes(f.Feat));
    if (chosen.length !== required) errors.push(`Choose ${required} ${category.toLowerCase()} feat${required === 1 ? '' : 's'}.`);
    for (const feat of chosen) if (!eligibleFeat(feat, s)) errors.push(`Requirements not met: ${feat.Feat}.`);
  }
  const plan = skillPlan(s);
  for (const g of plan.groups) {
    const selected = s.choices[g.id] || [];
    if (selected.length !== g.count || new Set(selected).size !== g.count || selected.some(v => !g.options.includes(v))) errors.push(`Complete ${g.label} (${g.count} choices).`);
    if (g.distinct && new Set(selected.map(category)).size !== selected.length) errors.push(`${g.label}: choose different skill categories.`);
    if (g.id === 'cramming' && selected.some(v => (plan.base[v] || 3) > 3 || plan.groups.some(other => other.id !== g.id && (s.choices[other.id] || []).includes(v)))) errors.push('Knowledge Cramming must choose an otherwise untrained skill.');
  }
  if (s.species === 'Human' && s.choices['legacy-expert']?.[0] === s.choices['legacy-adept']?.[0]) errors.push('Legacy of Discovery requires two different skills.');
  for (const g of spellPlan(s).groups) {
    const selected = s.spells[g.id] || [];
    if (selected.length !== g.count || new Set(selected).size !== g.count || selected.some(n => !g.options.some(sp => sp.name === n))) errors.push(`Choose ${g.count} for ${g.label}.`);
  }
  const equipment = equipmentPlan(s);
  if (equipment.choices.length && !equipment.choices.includes(s.equipment.weapon)) errors.push('Choose your starting weapon.');
  if (s.species === 'Human' && !s.languages.trim()) errors.push('Choose your additional Human language.');
  for (const [condition, key, label] of [[s.species === 'Dwarf', 'craft', 'Dwarvish Craftiness'], [s.feats.includes('Crafter'), 'crafter', 'Crafter'], [s.feats.includes('Assurance'), 'assurance', 'Assurance'], [s.feats.includes('Tool Handler'), 'tools', 'two tools'], [s.feats.includes('Communicator') || s.feats.includes('Secret Languages'), 'feat-languages', 'two feat languages']]) {
    if (condition && !s.choices[key]?.[0]?.trim()) errors.push(`Choose ${label}.`);
  }
  if (s.feats.includes('Assurance') && (plan.fixed[s.choices.assurance?.[0]] || 3) < 4) errors.push('Assurance requires a trained skill.');
  for (const [key, enabled, label] of [['tools', s.feats.includes('Tool Handler'), 'tools'], ['feat-languages', s.feats.some(n => ['Communicator', 'Secret Languages'].includes(n)), 'languages']]) {
    if (enabled && new Set(names(s.choices[key]?.[0] || '')).size !== 2) errors.push(`Enter two different ${label}, separated by a comma.`);
  }
  return [...new Set(errors)];
}

export function buildCharacter(s) {
  const errors = validateCharacter(s);
  if (errors.length) throw new Error(errors.join('\n'));
  const c = classFor(s), race = speciesFor(s), sub = subclassFor(s), stats = progression(s), skills = skillPlan(s).fixed;
  const equip = equipmentPlan(s), weaponNames = [...new Set([...equip.fixed, s.equipment.weapon].filter(Boolean))];
  const armor = DATA.armor.find(a => a.Name === equip.armor), shield = DATA.armor.find(a => a.Name === equip.shield);
  const sections = Object.fromEntries(['Defenses', 'Speed', 'Combat Skills', 'Standard Skills', 'Equipment Proficiencies', 'Species Features', 'Class Features', 'Instinct Abilities', 'Feats', 'Additional Features', 'Languages', 'Equipment', 'Spellcasting', 'Spells Known', 'Strikes & Damaging Cantrips', 'Death'].map(n => [n, section()]));
  const hp = stats.hp + +(race['HP Bonus'] || 0) + (s.feats.includes('Tough') ? Math.max(1, Math.floor(s.level / 2)) : 0);
  sections.Defenses.fields = { Deflection: String(+c['Base Deflection'] + +(race['Deflection Bonus'] || 0) + +(armor?.Deflection || 0) + +(shield?.Deflection || 0)), Fortitude: String(+c.Fortitude + +(race['Fortitude Bonus'] || 0)), Will: String(+c.Will + +(race['Will Bonus'] || 0)) };
  sections.Defenses.splitFields['Health\nPoints'] = { cur: String(hp), max: String(hp), temp: '0' };
  sections['Damage Defenses'] = { ...section(), fields: damageDefenses(race['Resistances / Weaknesses'], [armor?.Modifiers, shield?.Modifiers].filter(Boolean).join(';')) };
  sections.Speed.fields = { Movement: String(+race.Movement), Instinct: String(stats.instinct) };
  const row = (name, value) => ({ type: 'skill', values: [name, value] });
  const training = dice => ({ 3: 'Untrained (3d6)', 4: 'Adept (4d6)', 5: 'Expert (5d6)' }[dice]);
  const combatSkills = COMBAT_SKILLS_LIST.flatMap(g => g.options);
  const trainedCombat = Object.keys(skills).filter(n => combatSkills.includes(n));
  const displayedCombat = [...new Set([...DEFAULT_COMBAT_SKILLS, ...trainedCombat])];
  sections['Combat Skills'].dynamicRows = displayedCombat.map(n => row(n, training(skills[n] || 3)));
  sections['Standard Skills'].dynamicRows = Object.entries(skills).filter(([n]) => !combatSkills.includes(n)).map(([n, dice]) => row(n, training(dice)));
  const prof = sections['Equipment Proficiencies'];
  let proficiency = c['Armor Proficiency'] + ' ' + c['Shield Proficiency'];
  if (['Skald', 'Warden'].includes(s.subclass)) proficiency += ' Medium';
  if (s.subclass === 'Skald') proficiency += ' Heavy Shield Martial Weapons';
  if (s.subclass === 'Walking Ballista') proficiency += ' Heavy Armor';
  if (s.feats.includes('Light Armor Proficiency')) proficiency += ' Light';
  prof.checkboxes = { Light: /Light/.test(proficiency), Medium: /Medium/.test(proficiency), Heavy: /Heavy Armor/.test(proficiency), 'Heavy Shields': /Heavy Shield/.test(proficiency), 'Tower Shields': false, 'Martial Weapons': /Martial Weapons/.test(proficiency) };
  const drags = names(c['Drags Ignored']).filter(name => !/^none$/i.test(name));
  if (s.feats.includes('Heavy Swinger')) drags.push('Heavy Weapons');
  if (s.feats.includes('Shooter')) drags.push('Ranged Weapons');
  prof.dynamicRows = [...new Set(drags)].map(n => ({ type: 'skill', values: [n] }));
  const selectedFeatures = [
    ...(SHEET_FEATURES.classes[s.className] || []),
    ...(SHEET_FEATURES.subclasses[sub?.Subclass] || []),
    ...(SHEET_FEATURES.species[s.species] || []),
    ...s.feats.flatMap(name => SHEET_FEATURES.feats[name] || []),
  ].filter(f => f.level !== null && f.level <= s.level);
  for (const name of selectedFeatures.flatMap(f => f.proficiencies || [])) prof.checkboxes[name] = true;
  const renderFeature = html => sheetFeatureHTML(html, s.choices);
  for (const [group, name, destination] of [['classes', s.className, 'Class Features'], ['subclasses', sub?.Subclass, 'Class Features'], ['species', s.species, 'Species Features']]) {
    for (const feature of SHEET_FEATURES[group][name] || []) {
      if (feature.level !== null && feature.level <= s.level) sections[feature.section || destination].sectionBody += renderFeature(feature.html);
    }
  }
  if (s.className === 'Alchemist') sections['Additional Features'].sectionBody += (s.choices.concoctions || []).map(name => SHEET_FEATURES.concoctions[name] || '').join('');
  sections['Additional Features'].sectionBody += s.notes ? p(s.notes) : '';
  sections.Feats.sectionBody = s.feats.flatMap(name => SHEET_FEATURES.feats[name] || []).map(f => renderFeature(f.html)).join('');
  sections.Languages.sectionBody = p([race.Languages.includes('choice') ? '' : race.Languages, s.languages, ...(s.choices['feat-languages'] || [])].filter(Boolean).join('; '));
  const utility = equip.rules.match(/Utility: (.*)/)?.[1];
  sections.Equipment.sectionBody = p([equip.armor, equip.shield, ...weaponNames, utility].filter(Boolean).join('; ')) + (armor ? p(armor.Modifiers) : '');
  sections.Spellcasting.fields = { 'Summon Slots': String(stats.summons) };
  sections.Spellcasting.splitFields['Spell Points'] = { cur: String(stats.points), max: String(stats.points), temp: '0' };
  sections.Spellcasting.checkboxes = Object.fromEntries(stats.traditions.map(t => [t, true]));
  const spells = spellPlan(s).known;
  sections.Spellcasting.fields['Cantrips Known'] = String([...spells.keys()].filter(n => SPELLS_DATABASE.find(x => x.name === n)?.rank === 'Cantrip').length);
  sections.Spellcasting.fields['Spells Known'] = String(spells.size - Number(sections.Spellcasting.fields['Cantrips Known']));
  sections['Spells Known'].dynamicRows = [...spells].map(([name, note]) => { const sp = SPELLS_DATABASE.find(x => x.name === name); return { type: 'skill', values: [sp?.rank || '', name, sp?.cost || '', note] }; });
  sections['Spells Known'].dynamicRows.sort((a, b) => compareSpellRows(a.values, b.values));
  for (const g of spellPlan(s).groups) if (g.unfilled) sections['Additional Features'].sectionBody += p(`${g.label}: ${g.unfilled} unfilled choices; the current spell catalogue has too few eligible spells. These slots remain available.`);
  const instinct = [];
  for (const name of spells.keys()) { const sp = SPELLS_DATABASE.find(x => x.name === name); if (/Instinct/i.test(sp?.actionSpeed || '')) instinct.push(`${name}: See spell description.`); }
  const authoredInstincts = new Map(selectedFeatures.flatMap(f => f.instincts || []).map(ability => [ability.name, renderFeature(ability.html)]));
  for (const option of selectedFeatures.flatMap(f => f.instinctOptions || [])) {
    const ability = authoredInstincts.get(option.ability);
    if (!ability) throw new Error(`Missing parent Instinct: ${option.ability}`);
    authoredInstincts.set(option.ability, ability.slice(0, -5) + renderFeature(option.html) + '</li>');
  }
  sections['Instinct Abilities'].sectionBody = `<ul>${[...authoredInstincts.values()].join('')}${[...new Set(instinct)].map(t => { const i = t.indexOf(':'); return `<li>${i < 0 ? escapeHTML(t) : `<strong>${escapeHTML(t.slice(0, i))}:</strong>${escapeHTML(t.slice(i + 1))}`}</li>`; }).join('')}</ul>`;
  sections['Strikes & Damaging Cantrips'].dynamicRows = weaponNames.map(name => {
    const w = DATA.weapons.find(x => x.Weapon === name); if (!w) return null;
    const ranged = /Ranged/.test(w.Category), skill = s.className === 'Cleric' && !ranged && !w['Other Properties'].includes('Two Handed') ? 'Magic' : ranged ? 'Ranged' : 'Melee';
    const activeDrags = names(w['Drag Properties']).filter(d => !(d === 'Heavy' && drags.includes('Heavy Weapons')) && !(d === 'Ranged' && drags.includes('Ranged Weapons')));
    return { type: 'action', slots: { name: ranged ? 'Ranged Strike' : 'Melee Strike', rollDescription: `Roll ${skill} against Deflection.`, notes: `On success, deal SD ${w['Damage Type'].replace(/\s*\/\s*/g, ' or ')} damage. On failure, deal half damage, rounded down.` }, tableRows: [{ weapon: name, speed: ['Fast', 'Average', 'Slow'][Math.min(2, activeDrags.length)], roll: `${(skills[skill] || 3) + Number(w['Extra Dice'] || 0)}d6`, minimum: w['Minimum Roll'], damage: w['Damage Type'], range: ranged ? `${w['Effective Range']} / ${w['Maximum Range']}` : w['Other Properties'].includes('Reach') ? '2' : '1', doubleSix: w['Double 6'] }], variants: [], ui: { variantsHidden: true, weaponColumnHidden: false } };
  }).filter(Boolean);
  const grouped = new Map();
  for (const action of sections['Strikes & Damaging Cantrips'].dynamicRows) {
    const existing = grouped.get(action.slots.name);
    if (!existing) { grouped.set(action.slots.name, action); continue; }
    existing.tableRows.push(...action.tableRows);
    existing.slots.notes = 'On success, deal SD damage of the type shown for the weapon. On failure, deal half damage, rounded down.';
    if (existing.slots.rollDescription !== action.slots.rollDescription) {
      existing.slots.rollDescription = 'Roll Magic for one-handed melee weapons, or Melee for two-handed melee weapons, against Deflection.';
    }
  }
  for (const name of new Set(selectedFeatures.flatMap(f => f.actions || []))) {
    const variant = ACTIONS.find(action => action.name === name);
    if (!variant) throw new Error(`Missing action data: ${name}`);
    if (!variant.parent) {
      if (!grouped.has(name)) grouped.set(name, { type: 'action', slots: { name, rollDescription: variant.summary || `${variant.speed} Action`, notes: variant.description }, tableRows: [{speed: variant.speed}], variants: [], ui: {variantsHidden: true, tableHidden: true, weaponColumnHidden: true} });
      continue;
    }
    let parent = grouped.get(variant.parent);
    if (!parent) {
      const base = ACTIONS.find(action => action.name === variant.parent && !action.parent);
      if (!base) continue;
      const lines = base.description.split('\n');
      const summary = lines.shift();
      parent = { type: 'action', slots: { name: base.name, rollDescription: summary, notes: lines.join('\n') }, tableRows: [{ weapon: '', speed: base.speed, roll: '', minimum: '', damage: '', range: '', doubleSix: '' }], variants: [], ui: { variantsHidden: false, weaponColumnHidden: true, tableHidden: true } };
      grouped.set(base.name, parent);
    }
    const details = [variant.speed ? `${variant.speed} Action` : '', variant.cost].filter(Boolean).join(' · ');
    parent.variants.push(`<strong>${escapeHTML(variant.name)}:</strong> ${details ? `${escapeHTML(details)}.<br>` : ''}${escapeHTML(variant.description).replace(/\n/g, '<br>')}`);
    parent.ui.variantsHidden = false;
  }
  for (const option of selectedFeatures.flatMap(f => f.actionOptions || [])) {
    const action = grouped.get(option.action);
    if (!action) throw new Error(`Missing parent action: ${option.action}`);
    action.slots.notes += `\n${option.html}`;
  }
  sections['Strikes & Damaging Cantrips'].dynamicRows = [...grouped.values()];
  for (const name of spells.keys()) {
    const sp = SPELLS_DATABASE.find(x => x.name === name);
    if (sp?.rank !== 'Cantrip' || !/deal (?:SD|\d+) .*damage/i.test(sp.description)) continue;
    const roll = sp.description.match(/Roll Magic(?:\s*([+-]\d+))?[^.]*\./i);
    if (!roll) continue;
    sections['Strikes & Damaging Cantrips'].dynamicRows.push(cantripAction(sp, skills.Magic || 3, s.subclass));
  }
  if (stats.devotion) sections['Additional Features'].sectionBody += p(`Devotion Points: ${stats.devotion}`);
  if (stats.placeholders.length) sections['Additional Features'].sectionBody += p(`Provisional progression: ${stats.placeholders.join(', ')}. These are placeholder values, pending finalized class progression.`);
  // Preserve large builds rather than dropping skills to meet the fixed row limit.
  const mode = sections['Combat Skills'].dynamicRows.length > DEFAULT_COMBAT_SKILLS.length || sections['Standard Skills'].dynamicRows.length > 11 ? 'auto' : 'fixed';
  return tidyCharacterContent({ version: 1, headers: { 'character-name': s.name.trim(), 'player-name': s.player.trim(), class: s.className, subclass: s.subclass, species: s.species, level: String(s.level), experience: '0' }, sections, preferences: { sectionSize: mode }, creation: { ...s, source: DATA.source } });
}
