import { SPELLS_DATABASE } from './spells_data.js';
import { cantripAction } from './cantrip-action.js';
import { tidyCharacterContent } from './sheet-content.js';
import { renderStrikesDamagingCantripsBlock } from './components.js';

export function initCantripPicker(save) {
  const dialog = document.createElement('dialog');
  dialog.className = 'cantrip-picker';
  dialog.setAttribute('aria-label', 'Choose a cantrip');
  dialog.innerHTML = '<form method="dialog"><h2>Choose a cantrip</h2><label>Cantrip <select name="cantrip" required></select></label><p>This replaces the details in this action block.</p><div><button value="cancel" formnovalidate>Cancel</button> <button value="fill">Fill action block</button></div></form>';
  const select = dialog.querySelector('select');
  for (const spell of SPELLS_DATABASE.filter(sp => sp.rank === 'Cantrip').sort((a, b) => a.name.localeCompare(b.name))) {
    select.add(new Option(spell.name, spell.name));
  }
  document.body.append(dialog);
  let target;
  document.querySelector('#app').addEventListener('click', event => {
    const button = event.target.closest('.choose-cantrip-btn');
    if (!button) return;
    target = button.closest('.strikes-cantrips-container');
    const current = target.querySelector('[data-slot="name"]').textContent.trim();
    select.value = SPELLS_DATABASE.some(sp => sp.rank === 'Cantrip' && sp.name === current) ? current : select.options[0].value;
    dialog.returnValue = '';
    dialog.showModal();
  });
  dialog.addEventListener('close', () => {
    if (dialog.returnValue !== 'fill' || !target?.isConnected) return;
    const spell = SPELLS_DATABASE.find(sp => sp.name === select.value);
    const magic = [...document.querySelectorAll('[data-section="combat-skills"] .skill-row')].find(row => row.querySelector('input.skill-name')?.value.trim().toLowerCase() === 'magic');
    const dice = Number(magic?.querySelector('input.skill-bonus')?.value.match(/(\d+)d6/i)?.[1] || 3);
    const subclass = document.querySelector('[data-sync-id="subclass"]')?.textContent.trim();
    const action = cantripAction(spell, dice, subclass);
    tidyCharacterContent({ sections: { 'Strikes & Damaging Cantrips': { dynamicRows: [action] } } });
    target.dispatchEvent(new CustomEvent('sheet-edit-start', { bubbles: true }));
    const wrapper = document.createElement('div');
    wrapper.innerHTML = renderStrikesDamagingCantripsBlock();
    target.innerHTML = wrapper.firstElementChild.innerHTML;
    target.classList.add('weapon-column-hidden');
    target.querySelector('.weapon-column-toggle-btn').textContent = 'Show Weapon';
    for (const [slot, value] of Object.entries({ ...action.slots, ...action.tableRows[0] })) {
      target.querySelector(`[data-slot="${slot}"]`).innerText = value;
    }
    target.dispatchEvent(new CustomEvent('sheet-edit-end', { bubbles: true }));
    target.dispatchEvent(new Event('input', { bubbles: true }));
    save();
  });
}
