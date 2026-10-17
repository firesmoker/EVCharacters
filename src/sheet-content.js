import { SPELLS_DATABASE } from './spells_data.js';

const fragment = html => {
  const el = document.createElement('div');
  el.innerHTML = html || '';
  return el;
};
const plain = html => fragment(html).textContent;
const updateRam = text => (text || '').replaceAll('Perform a Charge using Unarmed Strike. On a successful hit, you deal +1 damage.', 'Perform a Charge using Unarmed Strike with 2 Extra Dice.');

export function tidyCharacterContent(data) {
  const sections = data.sections;
  if (!sections) return data;
  const languages = sections.Languages ||= { sectionBody: '' };
  if (!/\bCommon\b/i.test(plain(languages.sectionBody))) {
    languages.sectionBody = `<p>Common</p>${languages.sectionBody || ''}`;
    const root = fragment(languages.sectionBody);
    if (root.children.length === 2 && [...root.children].every(el => el.tagName === 'P')) {
      root.firstElementChild.append('; ', ...root.lastElementChild.childNodes);
      root.lastElementChild.remove();
      languages.sectionBody = root.innerHTML;
    }
  }
  if (sections.Speed?.fields && Number(sections.Speed.fields.Instinct) < 1) sections.Speed.fields.Instinct = '1';

  for (const name of ['Feats', 'Instinct Abilities']) {
    const target = sections[name];
    if (!target?.sectionBody) continue;
    const root = fragment(target.sectionBody);
    for (const el of root.querySelectorAll('p, li')) if (/Potion Chugger|Chug Potion/i.test(el.textContent)) el.remove();
    target.sectionBody = root.innerHTML;
  }
  const instincts = sections['Instinct Abilities'];
  if (instincts?.sectionBody) {
    const root = fragment(instincts.sectionBody);
    for (const item of root.querySelectorAll('li')) {
      const text = item.textContent.trim();
      const label = text.split(':')[0];
      const spellName = label.replace(/\s*\([^)]*\)\s*$/, '').trim();
      const spell = SPELLS_DATABASE.find(sp => sp.name.toLowerCase() === spellName.toLowerCase() && /Instinct/i.test(sp.actionSpeed));
      if (spell) {
        const title = document.createElement('strong');
        title.textContent = `${label}:`;
        item.replaceChildren(title, ' See spell description.');
        continue;
      }
      const cleaned = text.replace(/^You gain the following Instinct abilit(?:y|ies):\s*:?\s*/i, '');
      if (cleaned === text) continue;
      const colon = cleaned.indexOf(':');
      if (colon < 0) continue;
      const title = document.createElement('strong');
      title.textContent = cleaned.slice(0, colon + 1);
      item.replaceChildren(title, cleaned.slice(colon + 1));
    }
    for (const title of root.querySelectorAll('li > strong, li > b')) {
      if (!/^Reenact:$/i.test(title.textContent.trim())) continue;
      const continuation = title.nextSibling;
      const name = continuation?.nodeType === Node.TEXT_NODE && continuation.textContent.match(/^\s*[^:]+:/);
      if (!name) continue;
      title.append(name[0]);
      continuation.textContent = continuation.textContent.slice(name[0].length);
    }
    // A Finale belongs to the preceding reenactment, not to the ability list.
    for (const list of [...root.querySelectorAll('ul, ol')]) {
      for (const item of [...list.children]) {
        if (!/^Grand Finale:/i.test(item.textContent.trim())) continue;
        const parentAbility = item.previousElementSibling;
        if (!parentAbility || !/Reenact|Dragon Slayer|Martyr/i.test(parentAbility.textContent)) continue;
        const nested = document.createElement('ul');
        parentAbility.append(nested);
        nested.append(item);
      }
    }
    for (const item of root.querySelectorAll('li')) {
      if (!/^Reenact/i.test(item.textContent.trim()) || item.querySelector('ul, ol')) continue;
      const match = item.innerHTML.match(/\s+(?:Grand )?Finale:\s*([\s\S]*)$/);
      if (!match) continue;
      item.innerHTML = item.innerHTML.slice(0, match.index) + `<ul><li><strong>Grand Finale:</strong> ${match[1]}</li></ul>`;
    }
    instincts.sectionBody = root.innerHTML;
  }
  if (sections.Equipment?.sectionBody) {
    const root = fragment(sections.Equipment.sectionBody);
    for (const el of root.children) {
      if (!/choose (?:between|any)|any two-handed/i.test(el.textContent)) continue;
      const lines = el.textContent.split(/\n/).filter(line => !/choose (?:between|any)|any two-handed/i.test(line));
      if (lines.length) el.textContent = lines.join('\n'); else el.remove();
    }
    sections.Equipment.sectionBody = root.innerHTML;
  }

  for (const action of sections['Strikes & Damaging Cantrips']?.dynamicRows || []) {
    if (!action.slots) continue;
    action.slots.notes = updateRam(action.slots.notes);
    action.variants = (action.variants || []).map(updateRam);
    // These slots store plain text, unlike the rich-text variant fields.
    if (/<br\s*\/?\s*>/i.test(action.slots.notes || '')) action.slots.notes = plain(action.slots.notes.replace(/<br\s*\/?\s*>/gi, '\n'));
    if (['Charge', 'Grapple', 'Bomb Throw', 'Weapon Throw'].includes(action.slots.name)
        && /^(Fast|Average|Slow) Action/.test(action.slots.notes || '')
        && !(action.tableRows || []).some(row => row.weapon || row.roll || row.damage || row.range)) {
      const lines = action.slots.notes.split('\n');
      const summary = lines.shift();
      action.slots.rollDescription ||= summary;
      action.slots.notes = lines.join('\n');
      action.ui = { ...action.ui, tableHidden: action.ui?.tableHidden ?? true };
    }
    const notes = action.slots.notes || '';
    const types = [...new Set((action.tableRows || []).map(row => row.damage).filter(Boolean))];
    if (/On failure, deal half damage, rounded down\./.test(notes) && !/\bSD\b|on success/i.test(notes)
        && types.length === 1 && /^(?:Slashing|Piercing|Crushing|Fire|Ice|Lightning|Acid|Necrotic|Psychic|Radiant|Force|Thunder|Poison|Elemental)(?:\s*\/\s*(?:Slashing|Piercing|Crushing|Fire|Ice|Lightning))*$/i.test(types[0])) {
      const damage = types[0] === 'Elemental' ? 'damage of the chosen type' : `${types[0].replace(/\s*\/\s*/g, ' or ')} damage`;
      action.slots.notes = notes.replace('On failure,', `On success, deal SD ${damage}. On failure,`);
    }
    for (const row of action.tableRows || []) {
      let effect = plain(row.doubleSix || '').trim();
      if (/^see notes$/i.test(effect)) continue;
      if (/^by element$/i.test(effect)) effect = SPELLS_DATABASE.find(sp => sp.name === action.slots.name)?.description.split('Double 6:')[1]?.trim() || effect;
      if (effect.length <= 80 && !/[\n•]/.test(effect)) continue;
      const label = (action.tableRows.length > 1 && row.weapon ? `${row.weapon} — ` : '') + 'Double 6:';
      if (!plain(action.slots.notes || '').includes(effect)) action.slots.notes = `${action.slots.notes || ''}\n${label} ${effect}`.trim();
      row.doubleSix = 'See notes';
    }
  }
  return data;
}
