import CREATION_DATA from './creation-data.json';
import { SPELLS_DATABASE } from './spells_data.js';

const fragment = html => {
  const el = document.createElement('div');
  el.innerHTML = html || '';
  return el;
};
const plain = html => fragment(html).textContent;
function featureCapacity() {
  const field = document.querySelector('[data-section="class-features"] .section-content');
  const probe = document.createElement('div');
  const width = field?.clientWidth || 380;
  const capacity = field?.clientHeight > 200 ? field.clientHeight : 500;
  probe.style.cssText = `position:fixed;visibility:hidden;pointer-events:none;width:${width}px;font-size:13px;line-height:1.4;padding:5px;box-sizing:border-box`;
  document.body.append(probe);
  return { probe, capacity, height(html) {
    probe.innerHTML = html;
    for (const el of probe.querySelectorAll('*')) el.style.removeProperty('font-size');
    for (const el of probe.querySelectorAll('p, div')) el.style.margin = '0 0 6px';
    return probe.offsetHeight;
  } };
}

// Remove only abilities already represented in the dedicated pane.
function removeDuplicateInstincts(html, instincts) {
  const root = fragment(html);
  const nameOf = text => text.trim().replace(/^Level \d+\s*(?::|[—–-])\s*/, '')
    .replace(/,?\s*Instinct Ability:/i, ':').split(':')[0].trim().toLowerCase();
  const names = new Set([...fragment(instincts).querySelectorAll('li')].map(el => nameOf(el.textContent)));
  for (const wrapper of root.querySelectorAll('[data-class-overflow]')) wrapper.innerHTML = removeDuplicateInstincts(wrapper.innerHTML, instincts);
  const groups = [];
  for (const el of [...root.children]) {
    const text = el.textContent.trim();
    const heading = /^Level \d+\s*(?::|[—–-])/.test(text) || el.matches('p') && el.firstElementChild?.matches('strong, b');
    if (!groups.length || heading) groups.push([]);
    groups.at(-1).push(el);
  }
  for (const group of groups) {
    const title = nameOf(group[0].textContent);
    const entries = group.flatMap(el => [...el.querySelectorAll('li')]);
    const generic = /^(?:instinct abilities|instinct ability)$/.test(title);
    if (names.has(title) || generic && entries.length && entries.every(el => names.has(nameOf(el.textContent)))) {
      group.forEach(el => el.remove());
    }
  }
  return root.innerHTML;
}

// Shared by creation, template loading and existing saved characters.
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

  const species = sections['Species Features'];
  if (species?.sectionBody) {
    const root = fragment(species.sectionBody);
    for (const el of root.children) {
      if (el.querySelector('strong, b') || !el.textContent.trim()) continue;
      const text = el.textContent;
      const match = text.match(/^(?:Level \d+\s*[—–-]\s*)?[^\n]*?(?:\s[—–]\s|:)/);
      if (!match || match[0].length > 120) continue;
      const label = document.createElement('strong');
      label.textContent = match[0].trimEnd();
      el.replaceChildren(label, text.slice(match[0].trimEnd().length));
    }
    species.sectionBody = root.innerHTML;
  }

  for (const name of ['Feats', 'Instinct Abilities', 'Additional Features']) {
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

  const normalize = text => text.trim().replace(/^[“"']|[”"']$/g, '').trim();
  const titles = new Set([...CREATION_DATA.classes.map(c => c.Class), ...CREATION_DATA.subclasses.map(c => c.Subclass)]);
  const flavor = new Set(CREATION_DATA.subclasses.map(c => normalize(c.Description || '')).filter(Boolean));
  for (const name of ['Class Features', 'Species Features', 'Additional Features']) {
    const section = sections[name];
    if (!section?.sectionBody) continue;
    if (name !== 'Species Features') {
      const root = fragment(section.sectionBody);
      for (const el of root.querySelectorAll('p, h2, h3, h4')) {
        const text = normalize(el.textContent);
        if (titles.has(text) || flavor.has(text) || text === 'Flavor Text') el.remove();
      }
      section.sectionBody = root.innerHTML;
    }
    if (sections['Instinct Abilities']?.sectionBody) section.sectionBody = removeDuplicateInstincts(section.sectionBody, sections['Instinct Abilities'].sectionBody);
  }

  const features = sections['Class Features'];
  if (features?.sectionBody) {
    const additional = sections['Additional Features'];
    const extra = fragment(additional?.sectionBody);
    // Recover the familiar moved by the earlier, overly small overflow limit.
    if (/Student of Magic/.test(features.sectionBody) && !/Fae Familiar/.test(features.sectionBody)
        && /^Level 2:\s*Fae Familiar/.test(extra.textContent.trim())) {
      features.sectionBody += extra.innerHTML;
      extra.replaceChildren();
    }
    for (const el of [...extra.querySelectorAll('[data-class-overflow]')]) {
      features.sectionBody += el.innerHTML;
      el.remove();
    }
    if (additional) additional.sectionBody = extra.innerHTML;
    const root = fragment(features.sectionBody);
    let skip = false;
    for (const el of [...root.children]) {
      const text = el.textContent.trim();
      if (/^Level \d+:/.test(text)) skip = /^(?:Level \d+:\s*)Spellcasting$/i.test(text);
      if (skip || /^Spellcasting[.:]/i.test(text)) el.remove();
      else if (!text) el.remove();
    }
    const groups = [];
    for (const el of root.children) {
      if (!groups.length || /^Level \d+:/.test(el.textContent.trim()) || /^(STRONG|B)$/.test(el.firstElementChild?.tagName || '')) groups.push([]);
      groups.at(-1).push(el.outerHTML);
    }
    let kept = '', moved = '';
    const measure = featureCapacity();
    // Moderate overflow stays here and uses the existing automatic font fitting.
    const substantialOverflow = measure.height(root.innerHTML) > measure.capacity * 1.75;
    for (const group of groups) {
      const html = group.join('');
      if (substantialOverflow && kept && (moved || measure.height(kept + html) > measure.capacity)) moved += html;
      else kept += html;
    }
    measure.probe.remove();
    features.sectionBody = kept;
    if (moved) {
      const additional = sections['Additional Features'] ||= { sectionBody: '' };
      additional.sectionBody = `<div data-class-overflow>${moved}</div>` + (additional.sectionBody || '');
    }
  }
  for (const action of sections['Strikes & Damaging Cantrips']?.dynamicRows || []) {
    if (!action.slots) continue;
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
  for (const name of ['Class Features', 'Species Features', 'Additional Features']) {
    const section = sections[name];
    if (!section?.sectionBody) continue;
    const root = fragment(section.sectionBody);
    for (const el of root.querySelectorAll('p, li, h2, h3, h4')) {
      if (!/^Level \d+\s*(?::|[—–-])/.test(el.textContent.trim())) continue;
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let text;
      while ((text = walker.nextNode())) {
        if (!text.textContent.trim()) continue;
        text.textContent = text.textContent.replace(/^\s*Level \d+\s*(?::|[—–-])\s*/, '');
        break;
      }
    }
    section.sectionBody = root.innerHTML;
  }
  return data;
}
