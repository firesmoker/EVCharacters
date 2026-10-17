import { DATA, newCharacter, classFor, speciesFor, subclassesFor, subclassFor, progression, skillPlan, skillChoiceWarning, spellPlan, equipmentPlan, specialChoices, eligibleFeat, validateCharacter, buildCharacter, escapeHTML as esc, featureHTML } from './character-creation.js';
import { loadFromJSON, serializeSheet } from './io.js';
import './creation-wizard.css';
import { renderSpellDescriptionBlock } from './components.js';
import { SPELLS_DATABASE } from './spells_data.js';

export function initCreationWizard(save) {
  const dialog = document.createElement('dialog');
  dialog.className = 'creation-wizard';
  dialog.setAttribute('aria-labelledby', 'creation-title');
  document.body.append(dialog);
  let state = newCharacter(), step = 0;
  let rebuilding = false;
  const steps = ['Identity & class', 'Species', 'Subclass', 'Training & feats', 'Spells', 'Equipment', 'Review'];
  const select = (label, key, values, value, extra = '') => `<label class="creation-field">${esc(label)}<select aria-label="${esc(label)}" data-key="${esc(key)}" ${extra}><option value="">Choose…</option>${values.map(v => `<option ${v === value ? 'selected' : ''} value="${esc(v)}">${esc(v)}</option>`).join('')}</select></label>`;
  const input = (label, key, value, extra = '') => `<label class="creation-field">${esc(label)}<input data-key="${esc(key)}" value="${esc(value)}" ${extra}></label>`;
  const detail = (label, text) => `<details open><summary>${esc(label)}</summary><div class="creation-rule">${featureHTML(text)}</div></details>`;
  const spellDetail = sp => `<details open><summary>Spell details</summary>${renderSpellDescriptionBlock(sp)}</details>`;
  const notice = text => `<p class="creation-notice">${esc(text)}</p>`;
  function identity() {
    return `<h3>Who will you become?</h3><div class="creation-form-grid">${input('Character name', 'name', state.name, 'autocomplete="off"')}${input('Player name (optional)', 'player', state.player)}${select('Class', 'className', DATA.classes.map(x => x.Class).sort(), state.className)}${select('Level', 'level', Array.from({ length: 10 }, (_, i) => String(i + 1)), String(state.level))}</div><p>${esc(classFor(state)['Primary Roles'])}</p>${detail('Class features and progression rules', classFor(state)['Class Features / Rules'])}${notice('Missing progression values use provisional placeholders. These are identified in Review and on the finished sheet.')}`;
  }
  function species() {
    const race = speciesFor(state);
    return `<h3>Your heritage</h3>${select('Species', 'species', DATA.species.map(x => x.Species).sort(), state.species)}<p>Movement ${esc(race.Movement)} · ${esc(race.Languages)}</p>${detail('Species traits', race['Traits / Rules'].replaceAll(' • ', '\n'))}${input(state.species === 'Human' ? 'Additional language of your choice' : 'Other languages (optional)', 'languages', state.languages)}${state.species === 'Dwarf' ? input('Dwarvish Craftiness — crafting skill or tool', 'choice:craft', state.choices.craft?.[0] || '') : ''}`;
  }
  function subclass() {
    const options = subclassesFor(state);
    if (state.level < 3) return `<h3>Subclass</h3><p>Subclasses unlock at level 3. You can continue without choosing one.</p>`;
    if (!options.length) return `<h3>Subclass in development</h3>${notice('This class has no defined subclasses in the source sheet yet. Your character will include the base class package.')}`;
    const sub = subclassFor(state);
    return `<h3>Choose your specialization</h3>${select('Subclass', 'subclass', options.map(x => x.Subclass).sort(), state.subclass)}${sub ? `<p>${esc(sub.Description)}</p>${detail('Subclass features', sub['Full Features / Rules'])}${sub.Notes ? notice(sub.Notes) : ''}` : ''}`;
  }
  function training() {
    const plan = skillPlan(state);
    return `<h3>Training & feats</h3><p>Automatic training uses the highest grant; it does not stack. Choose your feats and then complete their skill choices below.</p>${['Origin', 'Minor'].map(category => {
      const count = category === 'Origin' ? state.species === 'Human' ? 2 : 1 : 1;
      return `<fieldset><legend>${category} feats — choose ${count}</legend><div class="creation-options">${DATA.feats.filter(f => f.Category === category).map(f => `<div class="creation-option"><label><input type="checkbox" data-feat="${esc(f.Feat)}" ${state.feats.includes(f.Feat) ? 'checked' : DATA.feats.filter(x => x.Category === category && state.feats.includes(x.Feat)).length >= count ? 'disabled' : ''}><strong>${esc(f.Feat)}</strong></label>${f.Requirements ? `<small>${esc(f.Requirements)}${eligibleFeat(f, state) ? '' : ' — not yet met'}</small>` : ''}${detail('Effect', f['Effect / Rules'])}</div>`).join('')}</div></fieldset>`;
    }).join('')}${specialChoices(state).map(g => `<fieldset><legend>${esc(g.label)}</legend>${Array.from({length:g.count}, (_,i) => select(`Choice ${i+1}`, `skill:${g.id}:${i}`, g.options, state.choices[g.id]?.[i] || '')).join('')}</fieldset>`).join('')}<h4>Automatic training</h4><p>${Object.entries(plan.base).map(([n, d]) => `${esc(n)} ${d}d6`).join(' · ')}</p>${plan.groups.map(g => `<fieldset><legend>${esc(g.label)} · ${g.dice}d6${g.distinct ? ' · different categories' : ''}</legend><div class="creation-form-grid">${Array.from({ length: g.count }, (_, i) => { const warning = skillChoiceWarning(state, g.id, i); return `<div>${select(`Choice ${i + 1}`, `skill:${g.id}:${i}`, g.options, state.choices[g.id]?.[i] || '')}${warning ? `<p class="creation-notice" role="status">${esc(warning)}</p>` : ''}</div>`; }).join('')}</div></fieldset>`).join('')}${state.feats.includes('Assurance') ? select('Assurance skill', 'choice:assurance', Object.keys(plan.fixed).filter(n => plan.fixed[n] >= 4), state.choices.assurance?.[0]) : ''}${state.feats.includes('Crafter') ? input('Crafter — crafting skill', 'choice:crafter', state.choices.crafter?.[0] || '') : ''}${state.feats.includes('Tool Handler') ? input('Tool Handler — two tools', 'choice:tools', state.choices.tools?.[0] || '') : ''}${state.feats.some(n => ['Communicator', 'Secret Languages'].includes(n)) ? input('Two languages from your feat', 'choice:feat-languages', state.choices['feat-languages']?.[0] || '') : ''}`;
  }
  function spells() {
    const plan = spellPlan(state), stats = progression(state);
    return `<h3>Spells & cantrips</h3><p>${stats.points} Spell Points · Maximum rank ${stats.rank} · ${stats.summons} summon slots</p><p>Species grants are additional spells known. Free species castings are once per day for each spell and cannot be empowered.</p>${plan.known.size ? `<details open><summary>Known spells, including automatic grants</summary>${[...plan.known].map(([name, why]) => { const spell = SPELLS_DATABASE.find(sp => sp.name === name); return `<div class="creation-option"><p>${esc(why)}</p>${spell ? renderSpellDescriptionBlock(spell) : esc(name)}</div>`; }).join('')}</details>` : ''}${plan.groups.map(g => `<fieldset><legend>${esc(g.label)} — ${(state.spells[g.id] || []).length} / ${g.count}</legend>${g.unfilled ? notice(`${g.unfilled} additional choices remain unfilled until more eligible spells are added to the catalogue.`) : ''}${g.count ? `<input class="creation-search" type="search" aria-label="Search ${esc(g.label)}" placeholder="Search spells…"><div class="creation-options">${g.options.map(sp => `<div class="creation-option" data-search-text="${esc(sp.name.toLowerCase())}"><label><input type="checkbox" data-spell-group="${esc(g.id)}" value="${esc(sp.name)}" ${(state.spells[g.id] || []).includes(sp.name) ? 'checked' : (state.spells[g.id] || []).length >= g.count ? 'disabled' : ''}><strong>${esc(sp.name)}</strong></label>${spellDetail(sp)}</div>`).join('')}</div>` : '<p>Granted automatically.</p>'}</fieldset>`).join('') || '<p>No spell choices for this character.</p>'}`;
  }
  function equipment() {
    const eq = equipmentPlan(state);
    return `<h3>Starting equipment</h3>${detail('Class starting equipment', eq.rules)}${eq.choices.length ? select('Starting weapon', 'equipment:weapon', eq.choices, state.equipment.weapon) : ''}<p>${esc([eq.armor, eq.shield, ...eq.fixed].filter(Boolean).join(' · '))}</p><p>Armor and shield bonuses are included in your defenses. Weapon attacks use your training plus weapon Extra Dice.</p><label class="creation-field">Background and additional notes (optional)<textarea data-key="notes" rows="4">${esc(state.notes)}</textarea></label>`;
  }
  function review() {
    const errors = validateCharacter(state), stats = progression(state), spells = spellPlan(state).known;
    return `<h3>${esc(state.name || 'Your character')}</h3><p class="creation-lead">Level ${state.level} ${esc(state.species)} ${esc(state.className)}${state.subclass ? ` · ${esc(state.subclass)}` : ''}</p><dl class="creation-stats"><div><dt>HP before feats</dt><dd>${stats.hp}</dd></div><div><dt>Instinct</dt><dd>${stats.instinct}</dd></div><div><dt>Spell Points</dt><dd>${stats.points}</dd></div><div><dt>Known magic</dt><dd>${spells.size}</dd></div></dl>${stats.placeholders.length ? notice(`Placeholder values: ${stats.placeholders.join(', ')}. Missing level progression uses +1 HP per two levels, starting Instinct 1 and +1 at level 7, +1 spell/spell point per level and +1 cantrip per two levels. Published table values override these placeholders.`) : ''}${state.level > 2 ? notice('Only defined feature unlocks are included. Higher-level skill and feat progression remains WIP; the current rule grants one Minor Feat at level 1.') : ''}${Object.keys(skillPlan(state).fixed).filter(n => !['Magic', 'Melee', 'Ranged', 'Unarmed'].includes(n)).length > 11 ? notice('This build may exceed the fixed skill rows. All training is preserved; larger builds use Auto sizing.') : ''}${detail('Selected feats', state.feats.join('\n'))}${detail('Training', Object.entries(skillPlan(state).fixed).map(([n, d]) => `${n}: ${d}d6`).join('\n'))}${detail('Spells and cantrips', [...spells].map(([n, why]) => `${n}: ${why}`).join('\n'))}${errors.length ? `<div class="creation-errors" role="alert"><strong>Complete these choices before creating:</strong><ul>${errors.map(e => `<li>${esc(e)}</li>`).join('')}</ul></div>` : '<p>Ready to create. Your existing sheet will be replaced only after confirmation.</p>'}`;
  }
  function render() {
    const scroll = dialog.querySelector('.creation-content')?.scrollTop || 0;
    const activeKey = document.activeElement?.dataset.key;
    const content = [identity, species, subclass, training, spells, equipment, review][step]();
    dialog.innerHTML = `<header><div><span class="creation-eyebrow">Eternal Valor</span><h2 id="creation-title">${rebuilding ? 'Rebuild character' : 'Create a character'}</h2></div><button type="button" data-close aria-label="Close character creation">×</button></header><div class="creation-layout"><nav aria-label="Character creation steps">${steps.map((name, i) => `<button type="button" data-step="${i}" ${i === step ? 'aria-current="step"' : ''}><span>${i + 1}</span>${name}</button>`).join('')}</nav><div class="creation-content">${content}</div></div><footer><span>Step ${step + 1} of ${steps.length}</span><div><button type="button" data-back ${step === 0 ? 'disabled' : ''}>Back</button>${step < steps.length - 1 ? '<button type="button" class="creation-primary" data-next>Continue</button>' : `<button type="button" class="creation-primary" data-create ${validateCharacter(state).length ? 'disabled' : ''}>${rebuilding ? 'Rebuild character' : 'Create character'}</button>`}</div></footer>`;
    dialog.querySelector('.creation-content').scrollTop = scroll;
    if (activeKey) [...dialog.querySelectorAll('[data-key]')].find(el => el.dataset.key === activeKey)?.focus({ preventScroll: true });
  }
  function change(e) {
    const el = e.target, key = el.dataset.key;
    if (el.dataset.feat) {
      state.feats = el.checked ? [...state.feats, el.dataset.feat] : state.feats.filter(n => n !== el.dataset.feat);
      render(); return;
    }
    if (el.dataset.spellGroup) {
      const id = el.dataset.spellGroup, selected = state.spells[id] || [];
      state.spells[id] = el.checked ? [...selected, el.value] : selected.filter(n => n !== el.value);
      render(); return;
    }
    if (!key) return;
    if (key.startsWith('skill:')) {
      const [, id, index] = key.split(':');
      (state.choices[id] ||= [])[+index] = el.value; render();
    } else if (key.startsWith('choice:')) state.choices[key.slice(7)] = [el.value];
    else if (key.startsWith('equipment:')) state.equipment[key.slice(10)] = el.value;
    else {
      state[key] = key === 'level' ? Number(el.value || 1) : el.value;
      if (['className', 'species', 'level', 'subclass'].includes(key)) {
        if (!state.className) state.className = 'Bard';
        if (!state.species) state.species = 'Human';
        if (!subclassesFor(state).some(x => x.Subclass === state.subclass)) state.subclass = '';
        for (const g of [...skillPlan(state).groups, ...specialChoices(state)]) state.choices[g.id] = (state.choices[g.id] || []).filter(v => g.options.includes(v)).slice(0, g.count);
        for (let i = 0; i < spellPlan(state).groups.length; i++) {
          const g = spellPlan(state).groups[i];
          state.spells[g.id] = (state.spells[g.id] || []).filter(v => g.options.some(sp => sp.name === v)).slice(0, g.count);
        }
        let origins = 0;
        state.feats = state.feats.filter(name => {
          const feat = DATA.feats.find(f => f.Feat === name);
          return feat?.Category === 'Origin' ? ++origins <= (state.species === 'Human' ? 2 : 1) : feat?.Category === 'Minor';
        });
        if (!equipmentPlan(state).choices.includes(state.equipment.weapon)) delete state.equipment.weapon;
        render();
      }
    }
  }
  dialog.addEventListener('change', change);
  dialog.addEventListener('input', e => {
    if (e.target.matches('.creation-search')) {
      const term = e.target.value.toLowerCase();
      e.target.closest('fieldset').querySelectorAll('[data-search-text]').forEach(el => { el.hidden = !el.dataset.searchText.includes(term); });
    } else if (e.target.matches('input[data-key], textarea[data-key]')) change(e);
  });
  dialog.addEventListener('click', e => {
    const button = e.target.closest('button'); if (!button) return;
    if (button.hasAttribute('data-close')) { dialog.close(); return; }
    if (button.hasAttribute('data-create')) {
      if (validateCharacter(state).length) { render(); return; }
      if (!confirm(rebuilding ? 'Rebuild using the current rules and your selected choices? Manual changes to features, equipment, and other sheet fields will be replaced. Portrait, appearance, and experience will be preserved. A recovery copy will be saved.' : 'Create this character and replace the current sheet? The current sheet will be saved as a local recovery copy.')) return;
      const data = buildCharacter(state);
      // Save before replacement; if storage fails, leave the existing sheet intact.
      try {
        const backup = serializeSheet();
        localStorage.setItem('ev-before-character-creation', backup);
        data.preferences = { ...JSON.parse(backup).preferences, ...data.preferences };
        if (rebuilding) {
          const previous = JSON.parse(backup);
          data.portrait = previous.portrait;
          data.preferences = previous.preferences;
          data.headers.experience = previous.headers.experience;
        }
      }
      catch { alert('Could not save a recovery copy. Save your current sheet to a file before trying again.'); return; }
      loadFromJSON(JSON.stringify(data)); save(); dialog.close(); state = newCharacter(); step = 0; return;
    }
    if (button.hasAttribute('data-step')) step = +button.dataset.step;
    if (button.hasAttribute('data-next')) step++;
    if (button.hasAttribute('data-back')) step--;
    render(); dialog.querySelector('.creation-content').scrollTop = 0;
  });
  return (sheet) => {
    if (!sheet && rebuilding) { state = newCharacter(); step = 0; }
    rebuilding = Boolean(sheet);
    if (sheet) {
      state = { ...newCharacter(), ...structuredClone(sheet.creation) };
      if (!classFor(state) || !speciesFor(state)) { alert('The saved class or species is no longer in the current rules. The sheet has not been changed.'); return; }
      state.name = sheet.headers['character-name'] || state.name;
      state.player = sheet.headers['player-name'] || state.player;
      step = steps.length - 1;
    }
    render(); if (!dialog.open) dialog.showModal();
  };
}
