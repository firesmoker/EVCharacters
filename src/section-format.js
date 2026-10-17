import { DEFAULT_COMBAT_SKILLS } from './data.js';
import { renderSkillRow, renderDragsIgnoredRow, renderStrikesDamagingCantripsBlock } from './components.js';

export const fixedSections = { 'Combat Skills': 180, 'Standard Skills': 341, 'Equipment Proficiencies': 306, 'Species Features': 254, 'Class Features': 559 };
export const compactSections = { Languages: 58, Death: 98, Spellcasting: 174 };
export const isFixedSize = () => document.documentElement.dataset.sectionSize === 'fixed';

export function setSectionSize(mode) {
  const lists = [...document.querySelectorAll('.character-page .dynamic-rows')].map(list => {
    const title = list.closest('.section-box').querySelector('.section-header').textContent.trim();
    return { list, count: title === 'Combat Skills' ? DEFAULT_COMBAT_SKILLS.length : title === 'Standard Skills' ? 11 : 3,
      render: title === 'Combat Skills' ? () => renderSkillRow('combat') : title === 'Standard Skills' ? () => renderSkillRow('skills') : renderDragsIgnoredRow };
  });
  const actions = document.querySelector('.actions-page .dynamic-rows');
  if (mode === 'fixed') {
    const hasContent = row => [...row.querySelectorAll('input, [contenteditable]')].some(field => (field.value || field.textContent).trim());
    if (lists.some(({ list, count }) => [...list.children].slice(count).some(hasContent))) {
      alert('Fixed size needs at most 5 combat skills, 11 standard skills, and 3 Drags Ignored entries. Move or clear the extra entries first; nothing has been deleted.');
      mode = 'auto';
    } else {
      for (const { list, count, render } of lists) {
        while (list.children.length > count) list.lastElementChild.remove();
        while (list.children.length < count) list.insertAdjacentHTML('beforeend', render());
      }
      if (actions && !document.querySelector('[data-action-continuation]')) {
        while (actions.children.length > 4 && !hasContent(actions.lastElementChild)) actions.lastElementChild.remove();
        while (actions.children.length < 4) actions.insertAdjacentHTML('beforeend', renderStrikesDamagingCantripsBlock());
      }
    }
  }
  document.documentElement.dataset.sectionSize = mode === 'fixed' ? 'fixed' : 'auto';
  document.querySelectorAll('[role="menuitemradio"][data-section-size]').forEach(item => item.setAttribute('aria-checked', String(item.dataset.sectionSize === mode)));
}
