import './style.css'

/**
 * Metadata and Helper Lists
 */
const SKILLS_LIST = [
  { groupLabel: "Speech", options: ["Bartering", "Charm", "Deception", "Diplomacy", "Intimidation", "Leadership", "Manipulation", "Reasoning"] },
  { groupLabel: "Knowledge", options: ["Arcana", "History", "Nature", "Occult", "Politics", "Religion", "Warfare"] },
  { groupLabel: "Perception", options: ["Notice", "Movement", "Find Hidden Paths", "Find Hidden Objects", "Detect Traps"] },
  { groupLabel: "Other", options: ["Acrobatics", "Animal Handling", "Athletics", "Cooking", "Deduction", "Disguise", "Insight", "Mechanics", "Medicine", "Performance", "Sleight of Hand", "Sneak", "Survival"] }
];

const COMBAT_SKILLS_LIST = [
  { groupLabel: "Weapons", options: ["Melee Strike", "Ranged Strike", "Weapon Throw"] },
  { groupLabel: "Magic", options: ["Arcane Magic", "Bardic Magic", "Divine Magic", "Nature Magic", "Occult Magic"] },
  { groupLabel: "Unarmed", options: ["Unarmed Strike", "Grapple"] }
];

const BONUS_LIST = [
  { groupLabel: "Training", options: ["Trained (+5)", "Expert (+10)", "Master (+15)", "Legend (+20)"] }
];

const DRAGS_IGNORED_LIST = [
  { groupLabel: "Common Drag Sources", options: ["Two-Handed Weapons", "Ranged Weapons", "Aiming for Weak Spots", "Reach Weapons", "Heavy Weapons"] }
];

const SPELLS_LIST = [
  { groupLabel: "Arcane", options: ["Arcane Shield"] },
  { groupLabel: "Bardic", options: ["Rainbow Eruption"] },
  { groupLabel: "Divine", options: ["Divine Intervention"] },
  { groupLabel: "Nature", options: ["Entangle"] },
  { groupLabel: "Occult", options: ["Summon Shade"] }
];

/**
 * Renders a standard dropdown menu.
 */
const renderDropdown = (options, className) => `
  <select class="${className}">
    <option value=""></option>
    ${options.map(opt => {
  const val = typeof opt === 'object' ? opt.value : opt;
  const label = typeof opt === 'object' ? opt.label : opt;
  return `<option value="${val}">${label}</option>`;
}).join('')}
  </select>
`

/**
 * Renders an autocomplete input field.
 */
const renderAutocomplete = (placeholder, type, inputClass = 'skill-name') => `
  <div class="autocomplete-wrapper" data-type="${type}">
    <input type="text" class="${inputClass}" placeholder="${placeholder}">
    <div class="suggestions-dropdown"></div>
  </div>
`

/**
 * Renders a datalist for a given set of options.
 */
const renderDatalist = (id, options) => `
  <datalist id="${id}">
    ${options.map(opt => {
  if (typeof opt === 'object' && opt.groupLabel && Array.isArray(opt.options)) {
    return opt.options.map(subOpt => `<option value="${subOpt}">`).join('');
  }
  return `<option value="${opt}">`;
}).join('')}
  </datalist>
`

/**
 * Renders a skill row for Combat Skills and Skills sections.
 */
const renderSkillRow = (type = 'skills') => {
  return `
    <div class="skill-row">
      ${renderAutocomplete("Skill", type)}
      ${renderAutocomplete("Untrained (+0)", "bonus", "skill-bonus")}
      <button class="remove-row-btn" title="Remove Row">-</button>
      <button class="add-row-btn" title="Add Row">+</button>
    </div>
  `;
}

/**
 * Renders a row for the Drags Ignored subsection.
 */
const renderDragsIgnoredRow = () => `
  <div class="skill-row">
    ${renderAutocomplete("Drag Source", "drags", "skill-name")}
    <button class="remove-row-btn" title="Remove Row">-</button>
    <button class="add-row-btn" title="Add Row">+</button>
  </div>
`

/**
 * Renders a row for the Spells Known section.
 */
const renderSpellRow = () => `
  <div class="skill-row">
    <div class="autocomplete-wrapper" style="flex: 0 0 12mm;">
        <input type="text" class="skill-bonus" placeholder="Lvl" style="width: 100%; text-align: center;">
    </div>
    ${renderAutocomplete("Spell Name", "spells", "skill-name")}
    <div class="autocomplete-wrapper" style="flex: 0 0 15mm;">
        <input type="text" class="skill-bonus" placeholder="Cost" style="width: 100%; text-align: center;">
    </div>
    <button class="remove-row-btn" title="Remove Row">-</button>
    <button class="add-row-btn" title="Add Row">+</button>
  </div>
`

const renderHeaderField = (label, placeholder, flex = 1) => {
  const syncId = label.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `
  <div class="header-field-container" style="flex: ${flex};">
    <span class="header-label">${label}:</span>
    <span class="editable-field header-editable" contenteditable="true" data-placeholder="${placeholder}" style="flex-grow: 1;" data-sync-id="${syncId}"></span>
  </div>
`
}

/**
 * Renders a generic section row field (e.g., individual stats inside a section).
 */
const renderSectionRow = (label, placeholder, icon = null) => `
  <div class="section-row">
    <div class="stat-icon">
      ${icon ? `<img src="/icons/${icon}.svg" width="18" height="18" alt="${label} Icon">` : ''}
    </div>
    <span class="section-label">${label}:</span>
    <span class="editable-field section-row-editable" contenteditable="true" data-placeholder="${placeholder}" style="flex-grow: 1; padding-left: 5px;"></span>
  </div>
`

// Content for the Spells Known section with headings
const spellsKnownSectionContent = `
  <div class="skill-row" style="margin-bottom: 4px; border-bottom: 1px solid #eee; padding-bottom: 2px; pointer-events: none;">
    <div style="flex: 0 0 12mm; text-align: center; font-size: 9px; font-weight: bold; color: #666; text-transform: uppercase; font-family: Inter, sans-serif;">Level</div>
    <div style="flex: 1 1 auto; text-align: left; font-size: 9px; font-weight: bold; color: #666; text-transform: uppercase; font-family: Inter, sans-serif; padding-left: 4px;">Spell Name</div>
    <div style="flex: 0 0 15mm; text-align: center; font-size: 9px; font-weight: bold; color: #666; text-transform: uppercase; font-family: Inter, sans-serif;">Cost</div>
  </div>
  <div class="dynamic-rows">
    ${renderSpellRow()}
  </div>
`

// Content for the structured Spellcasting section
const spellcastingSectionContent = `
  <div class="section-container" style="flex-direction: row; gap: 10px;">
    <div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">
      <div class="section-row">
        <div class="stat-icon"></div>
        <span class="section-label">Spell Points:</span>
        <div class="hp-split">
          <span class="editable-field section-row-editable" contenteditable="true" data-placeholder="Cur" style="min-width: 25px; text-align: right;"></span>
          <span class="hp-slash">/</span>
          <span class="editable-field section-row-editable" contenteditable="true" data-placeholder="Max" style="min-width: 25px;"></span>
        </div>
      </div>
      ${renderSectionRow('Spells Known', '0')}
      ${renderSectionRow('Cantrips Known', '0')}
    </div>
    <div style="flex: 0 0 auto; display: flex; flex-direction: column; gap: 4px; padding-left: 10px; border-left: 1px solid #ccc;">
      <label class="checkbox-item"><input type="checkbox"> Arcane</label>
      <label class="checkbox-item"><input type="checkbox"> Bardic</label>
      <label class="checkbox-item"><input type="checkbox"> Divine</label>
      <label class="checkbox-item"><input type="checkbox"> Nature</label>
      <label class="checkbox-item"><input type="checkbox"> Occult</label>
    </div>
  </div>
`

// Content for the structured Death section
const deathSectionContent = `
  <div class="section-container">
    <div class="section-row">
       <span class="section-label" style="flex: 1;">Successes:</span>
       <div class="checkbox-group">
          <label class="checkbox-item"><input type="checkbox"></label>
          <label class="checkbox-item"><input type="checkbox"></label>
       </div>
    </div>
    <div class="section-row">
       <span class="section-label" style="flex: 1;">Failures:</span>
       <div class="checkbox-group">
          <label class="checkbox-item"><input type="checkbox"></label>
          <label class="checkbox-item"><input type="checkbox"></label>
       </div>
    </div>
    <div class="section-separator"></div>
    ${renderSectionRow('Exhaustion', '0')}
  </div>
`

/**
 * Renders a generic section box.
 */
const renderSection = (title, content, options = {}) => {
  const { isStructured = false, isDynamic = false, style = '' } = options;
  const contentClasses = [
    'section-content',
    isStructured ? 'section-content-structured' : 'editable-field',
    isDynamic ? 'dynamic-rows' : ''
  ].filter(Boolean).join(' ');

  return `
    <div class="section-box" style="${style}">
      <div class="section-header">${title}</div>
      <div class="${contentClasses}" 
           ${isStructured ? '' : 'contenteditable="true"'} 
           data-placeholder="Enter ${title.toLowerCase()}...">
        ${content}
      </div>
    </div>
  `
}

// Content for the structured Defense section
const defensesSectionContent = `
  <div class="section-container">
    <div class="section-row">
      <div class="stat-icon"><img src="/icons/heart.svg" width="18" height="18" alt="HP Icon"></div>
      <span class="section-label">Health Points (HP):</span>
      <div class="hp-split">
        <span class="editable-field section-row-editable" contenteditable="true" data-placeholder="Cur" style="min-width: 25px; text-align: right;"></span>
        <span class="hp-slash">/</span>
        <span class="editable-field section-row-editable" contenteditable="true" data-placeholder="Max" style="min-width: 25px;"></span>
      </div>
    </div>
    ${renderSectionRow('Damage Reduction (DR)', '0', 'armor')}
    <div class="section-separator"></div>
    ${renderSectionRow('Deflection', '5')}
    ${renderSectionRow('Fortitude', '0')}
    ${renderSectionRow('Will', '0')}
    <div class="section-separator"></div>
    <div style="margin-top: 6px;">
      <div class="section-subsection-label">Armor Training:</div>
      <div class="checkbox-group">
        <label class="checkbox-item"><input type="checkbox"> Light</label>
        <label class="checkbox-item"><input type="checkbox"> Medium</label>
        <label class="checkbox-item"><input type="checkbox"> Heavy</label>
      </div>
    </div>
    <div style="margin-top: 6px;">
      <div class="section-subsection-label">Shield Training:</div>
      <div class="checkbox-group">
        <label class="checkbox-item"><input type="checkbox"> Heavy Shields</label>
        <label class="checkbox-item"><input type="checkbox"> Tower Shields</label>
      </div>
    </div>
  </div>
`

// Content for the structured Speed section
const speedSectionContent = `
  <div class="section-container">
    ${renderSectionRow('Movement', '3')}
    <div class="section-separator"></div>
    <div class="section-subsection-label">Drags Ignored:</div>
    <div class="dynamic-rows">
      ${renderDragsIgnoredRow()}
    </div>
  </div>
`

const renderHeader = () => `
  <header class="sheet-header">
    <div style="flex-grow: 1;">
      <h1 class="editable-field sheet-title" contenteditable="true" data-placeholder="Character Name" data-sync-id="character-name"></h1>
      <div class="header-row">
        ${renderHeaderField('Player Name', '...', 2)}
        ${renderHeaderField('Level', '0', 1)}
        ${renderHeaderField('Experience', '0', 1)}
      </div>
      <div class="header-row">
        ${renderHeaderField('Class', '...', 1)}
        ${renderHeaderField('Species', '...', 1)}
      </div>
    </div>
    <div class="logo-box">
      <img src="/Logo.png" alt="Eternal Valor Logo">
    </div>
  </header>
`

/**
 * Renders a complex Main Action block.
 */
const renderMainAction = () => `
  <div class="main-action-container">
    <div style="display: flex; flex-direction: column;">
      <div class="editable-field main-action-title" contenteditable="true" data-placeholder="Action Title"></div>
      <div class="editable-field main-action-subtitle" contenteditable="true" data-placeholder="Action Speed"></div>
    </div>
    <div class="section-separator"></div>
    <div class="editable-field main-action-text" contenteditable="true" data-placeholder="Action details..."></div>
    <table class="main-action-table">
      <tr>
        <td></td>
        <td>Normal Success</td>
        <td>Major Success</td>
        <td>Critical Success</td>
      </tr>
      <tr>
        <td>Damage</td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
      </tr>
      <tr>
        <td>Ignores DR</td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
        <td contenteditable="true"></td>
      </tr>
    </table>
    <div class="editable-field main-action-text" contenteditable="true" data-placeholder="Additional notes..."></div>
    <button class="remove-row-btn" title="Remove Action">-</button>
    <button class="add-row-btn" title="Add Action">+</button>
  </div>
`

// ... (renderSection definition remains the same)

// Render the application
document.querySelector('#app').innerHTML = `
  <div class="top-bar">
    <div class="menu-item">File<div class="dropdown-content"><div>New</div><div>Open</div><div>Save</div></div></div>
    <div class="menu-item">Edit<div class="dropdown-content"><div>Undo</div><div>Redo</div></div></div>
    <div class="menu-item">View<div class="dropdown-content"><div>Zoom In</div><div>Zoom Out</div></div></div>
  </div>
  <div class="main-area">
    <div class="editor-canvas">
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div class="a4-page">
          <!-- Define Datalists -->
          ${renderDatalist('skills-list', SKILLS_LIST)}
          ${renderDatalist('combat-skills-list', COMBAT_SKILLS_LIST)}

          ${renderHeader()}
          
          <main class="sheet-middle">
            <section class="sheet-column">
              ${renderSection('Defenses', defensesSectionContent, { isStructured: true })}
              ${renderSection('Speed', speedSectionContent, { isStructured: true, isDynamic: true })}
              ${renderSection('Combat Skills', renderSkillRow('combat'), { isStructured: true, isDynamic: true })}
              ${renderSection('Standard Skills', renderSkillRow('skills'), { isStructured: true, isDynamic: true })}
            </section>
            
            <section class="sheet-column">
              ${renderSection('Main Actions', renderMainAction(), { isStructured: true, isDynamic: true })}
              ${renderSection('Features', '')}
            </section>
          </main>
        </div>

        <div class="a4-page">
          ${renderHeader()}
          
          <main class="sheet-middle">
            <section class="sheet-column">
              ${renderSection('Languages', '')}
              ${renderSection('Equipment', '')}
              ${renderSection('More Features', '')}
            </section>
            
            <section class="sheet-column">
              <div style="display: flex; gap: var(--section-gap);">
                <div style="flex: 1.4;">
                  ${renderSection('Spellcasting', spellcastingSectionContent, { isStructured: true, style: 'height: 100%;' })}
                </div>
                <div style="flex: 1;">
                   ${renderSection('Death', deathSectionContent, { isStructured: true, style: 'height: 100%;' })}
                </div>
              </div>
              ${renderSection('Spells Known', spellsKnownSectionContent, { isStructured: true, isDynamic: true })}
            </section>
          </main>
        </div>
      </div>
    </div>
  </div>
`

/**
 * Autocomplete Logic
 */
const updateSuggestions = (wrapper) => {
  const input = wrapper.querySelector('input');
  const dropdown = wrapper.querySelector('.suggestions-dropdown');
  const type = wrapper.getAttribute('data-type');
  const query = input.value.toLowerCase();

  let list;
  if (type === 'combat') list = COMBAT_SKILLS_LIST;
  else if (type === 'skills') list = SKILLS_LIST;
  else if (type === 'bonus') list = BONUS_LIST;
  else if (type === 'drags') list = DRAGS_IGNORED_LIST;
  else if (type === 'spells') list = SPELLS_LIST;

  let html = '';
  list.forEach(group => {
    const filteredOptions = group.options.filter(opt => opt.toLowerCase().includes(query));
    if (filteredOptions.length > 0) {
      html += `<div class="suggestion-group-title">${group.groupLabel}</div>`;
      filteredOptions.forEach(opt => {
        html += `<div class="suggestion-item">${opt}</div>`;
      });
    }
  });

  dropdown.innerHTML = html;
  dropdown.style.display = html ? 'block' : 'none';
}

const isAutocompleteInput = (el) => el.tagName === 'INPUT' && (el.classList.contains('skill-name') || el.classList.contains('skill-bonus'));

document.querySelector('#app').addEventListener('input', (e) => {
  // Contenteditable cleanup
  if (e.target.classList.contains('editable-field')) {
    if (e.target.innerHTML === '<br>' || e.target.innerText === '\n' || e.target.innerText.trim() === '') {
      if (e.target.innerText.trim() === '') e.target.replaceChildren();
    }
  }

  // Synchronization logic for header fields
  if (e.target.hasAttribute('data-sync-id')) {
    const syncId = e.target.getAttribute('data-sync-id');
    const value = e.target.innerHTML;
    document.querySelectorAll(`[data-sync-id="${syncId}"]`).forEach(el => {
      if (el !== e.target) {
        el.innerHTML = value;
      }
    });
  }

  // Autocomplete
  if (isAutocompleteInput(e.target)) {
    updateSuggestions(e.target.closest('.autocomplete-wrapper'));
  }
});

document.querySelector('#app').addEventListener('focusin', (e) => {
  if (isAutocompleteInput(e.target)) {
    updateSuggestions(e.target.closest('.autocomplete-wrapper'));
  }
});

document.querySelector('#app').addEventListener('keydown', (e) => {
  if (isAutocompleteInput(e.target)) {
    const wrapper = e.target.closest('.autocomplete-wrapper');
    const dropdown = wrapper.querySelector('.suggestions-dropdown');
    const items = Array.from(dropdown.querySelectorAll('.suggestion-item'));

    if (dropdown.style.display !== 'block') return;

    let selectedIndex = items.findIndex(item => item.classList.contains('selected'));

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex++;
      if (selectedIndex >= items.length) selectedIndex = 0;
      items.forEach((item, i) => item.classList.toggle('selected', i === selectedIndex));
      if (items[selectedIndex]) items[selectedIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex--;
      if (selectedIndex < 0) selectedIndex = items.length - 1;
      items.forEach((item, i) => item.classList.toggle('selected', i === selectedIndex));
      if (items[selectedIndex]) items[selectedIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      if (selectedIndex > -1) {
        e.preventDefault();
        e.target.value = items[selectedIndex].innerText;
        dropdown.style.display = 'none';
      }
    } else if (e.key === 'Escape') {
      dropdown.style.display = 'none';
    }
  }
});

document.querySelector('#app').addEventListener('click', (e) => {
  // Suggestion Item Click
  if (e.target.classList.contains('suggestion-item')) {
    const wrapper = e.target.closest('.autocomplete-wrapper');
    const input = wrapper.querySelector('input');
    input.value = e.target.innerText;
    wrapper.querySelector('.suggestions-dropdown').style.display = 'none';
    return;
  }

  // Add Row
  if (e.target.classList.contains('add-row-btn')) {
    const sectionBox = e.target.closest('.section-box');
    const title = sectionBox.querySelector('.section-header').textContent.trim();
    const container = e.target.closest('.dynamic-rows');
    if (container) {
      let html = '';
      if (title === 'Standard Skills') html = renderSkillRow('skills');
      else if (title === 'Combat Skills') html = renderSkillRow('combat');
      else if (title === 'Speed') html = renderDragsIgnoredRow();
      else if (title === 'Main Actions') html = renderMainAction();
      else if (title === 'Spells Known') html = renderSpellRow();

      if (html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        container.appendChild(tempDiv.firstElementChild);
      }
    }
  }

  // Remove Row
  if (e.target.classList.contains('remove-row-btn')) {
    const target = e.target.closest('.skill-row') || e.target.closest('.main-action-container');
    if (target) target.remove();
  }
});

// Close dropdowns on mouse press
document.querySelector('#app').addEventListener('mousedown', (e) => {
  const activeWrapper = e.target.closest('.autocomplete-wrapper');
  document.querySelectorAll('.suggestions-dropdown').forEach(dropdown => {
    if (dropdown.closest('.autocomplete-wrapper') !== activeWrapper) {
      dropdown.style.display = 'none';
    }
  });
});

// Initial cleanup
document.querySelectorAll('.editable-field').forEach(el => {
  if (el.innerText.trim() === '') el.replaceChildren();
});
