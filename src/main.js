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
    isDynamic ? 'allow-section-overflow' : ''
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
        ${renderHeaderField('Player Name', '...', 2.07)}
        ${renderHeaderField('Level', '0', 0.65)}
        ${renderHeaderField('Experience', '0', 1.28)}
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
    <div class="menu-item">File<div class="dropdown-content"><div id="menu-new">New</div><div id="menu-open">Open</div><div id="menu-save">Save</div><div id="export-pdf">Export to PDF</div></div></div>
    <input type="file" id="file-input" style="display: none;" accept=".csv">
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
              ${renderSection('Combat Skills', `<div class="dynamic-rows">${renderSkillRow('combat')}</div>`, { isStructured: true, isDynamic: true })}
              ${renderSection('Standard Skills', `<div class="dynamic-rows">${renderSkillRow('skills')}</div>`, { isStructured: true, isDynamic: true })}
            </section>
            
            <section class="sheet-column">
              ${renderSection('Main Actions', `<div class="dynamic-rows">${renderMainAction()}</div>`, { isStructured: true, isDynamic: true })}
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

  // Export to PDF
  if (e.target.id === 'export-pdf') {
    window.print();
  }

  // Save to CSV
  if (e.target.id === 'menu-save') {
    saveToCSV();
  }

  // Open CSV
  if (e.target.id === 'menu-open') {
    document.getElementById('file-input').click();
  }

  // New Sheet
  if (e.target.id === 'menu-new') {
    if (confirm('Are you sure you want to start a new sheet? All unsaved data will be lost.')) {
      prepareSheetForData(true);
    }
  }
});

/**
 * Helper to clear the sheet and optionally restore default rows
 */
const prepareSheetForData = (restoreDefaults = false) => {
  // Clear headers and fields
  document.querySelectorAll('.editable-field').forEach(el => el.innerText = '');
  // Clear checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);

  // Purge/Reset dynamic rows
  document.querySelectorAll('.dynamic-rows').forEach(container => {
    container.innerHTML = '';

    if (restoreDefaults) {
      // Find parent section to determine type
      const sectionBox = container.closest('.section-box');
      if (sectionBox) {
        const title = sectionBox.querySelector('.section-header').textContent.trim();
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
  });

  // Restore placeholders
  document.querySelectorAll('.editable-field').forEach(el => {
    if (el.innerText.trim() === '') el.replaceChildren();
  });
};

/**
 * CSV SAVE LOGIC
 */
const saveToCSV = () => {
  const data = [];

  // Helper to push rows
  const pushRow = (type, key, ...values) => {
    const escapedValues = values.map(v => `"${(v || '').toString().replace(/"/g, '""')}"`);
    data.push([type, key, ...escapedValues].join(','));
  };

  // 1. Headers (data-sync-id)
  const uniqueSyncIds = new Set();
  document.querySelectorAll('[data-sync-id]').forEach(el => {
    const id = el.getAttribute('data-sync-id');
    if (!uniqueSyncIds.has(id)) {
      pushRow('HEADER', id, el.innerText);
      uniqueSyncIds.add(id);
    }
  });

  // 2. Structured Sections (Defenses, Speed, etc.)
  document.querySelectorAll('.section-box').forEach(box => {
    const title = box.querySelector('.section-header').textContent.trim();

    // Checkboxes
    box.querySelectorAll('.checkbox-item').forEach((item, idx) => {
      const label = item.innerText.trim() || `index-${idx}`;
      const checked = item.querySelector('input').checked;
      pushRow('CHECKBOX', title, label, checked ? 'true' : 'false');
    });

    // Simple editable fields inside structured sections (excluding dynamic rows, header fields, and hp-split children)
    box.querySelectorAll('.section-row-editable, .editable-field:not(.dynamic-rows *):not([data-sync-id]):not(.hp-split *)').forEach(field => {
      const labelEl = field.previousElementSibling;
      if (labelEl && labelEl.classList.contains('section-label')) {
        pushRow('FIELD', title, labelEl.innerText.replace(':', '').trim(), field.innerText);
      } else if (field.classList.contains('section-content')) {
        pushRow('SECTION_BODY', title, 'CONTENT', field.innerText);
      }
    });

    // HP-style split fields
    box.querySelectorAll('.hp-split').forEach(split => {
      const labelEl = split.previousElementSibling;
      if (labelEl && labelEl.classList.contains('section-label')) {
        const label = labelEl.innerText.replace(':', '').trim();
        const cur = split.children[0].innerText;
        const max = split.children[2].innerText;
        pushRow('SPLITFIELD', title, label, cur, max);
      }
    });

    // Dynamic Rows (reaches nested ones like in Speed section)
    box.querySelectorAll('.skill-row, .main-action-container').forEach(row => {
      if (row.classList.contains('skill-row')) {
        const inputs = Array.from(row.querySelectorAll('input'));
        // Skip header rows or rows with no inputs
        if (inputs.length === 0) return;
        const values = inputs.map(i => i.value);
        pushRow('DYNAMIC_SKILL', title, ...values);
      } else if (row.classList.contains('main-action-container')) {
        const titleVal = row.querySelector('.main-action-title').innerText;
        const subtitleVal = row.querySelector('.main-action-subtitle').innerText;
        const details = Array.from(row.querySelectorAll('.main-action-text')).map(t => t.innerText);
        const tableVals = Array.from(row.querySelectorAll('.main-action-table td[contenteditable]')).map(td => td.innerText);
        pushRow('DYNAMIC_ACTION', title, titleVal, subtitleVal, ...details, ...tableVals);
      }
    });
  });

  const csvContent = data.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const charName = document.querySelector('[data-sync-id="character-name"]').innerText.trim() || 'character';
  link.setAttribute('href', url);
  link.setAttribute('download', `${charName.replace(/[^a-z0-9]/gi, '_')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * CSV OPEN LOGIC
 */
document.getElementById('file-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const csv = event.target.result;
    loadFromCSV(csv);
  };
  reader.readAsText(file);
  e.target.value = ''; // Reset input
});

const loadFromCSV = (csv) => {
  // Clear existing sheet using robust logic (no defaults restored as CSV will populate)
  prepareSheetForData(false);

  // Robust CSV Parser
  const parseCSV = (text) => {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      if (inQuotes) {
        if (char === '"') {
          if (nextChar === '"') { field += '"'; i++; }
          else { inQuotes = false; }
        } else { field += char; }
      } else {
        if (char === '"') { inQuotes = true; }
        else if (char === ',') { row.push(field); field = ''; }
        else if (char === '\n' || char === '\r') {
          row.push(field); rows.push(row); field = ''; row = [];
          if (char === '\r' && nextChar === '\n') i++;
        } else { field += char; }
      }
    }
    if (field || row.length > 0) { row.push(field); rows.push(row); }
    return rows;
  };

  const rows = parseCSV(csv);
  rows.forEach(parts => {
    if (parts.length < 2) return;
    const [type, category, ...values] = parts;

    if (type === 'HEADER') {
      document.querySelectorAll(`[data-sync-id="${category}"]`).forEach(el => el.innerText = values[0]);
    } else if (type === 'CHECKBOX') {
      document.querySelectorAll('.section-box').forEach(box => {
        if (box.querySelector('.section-header').textContent.trim().toUpperCase() === category.toUpperCase()) {
          box.querySelectorAll('.checkbox-item').forEach((item, idx) => {
            const label = item.innerText.trim() || `index-${idx}`;
            if (label.toUpperCase() === values[0].toUpperCase()) {
              item.querySelector('input').checked = values[1] === 'true';
            }
          });
        }
      });
    } else if (type === 'FIELD') {
      document.querySelectorAll('.section-box').forEach(box => {
        if (box.querySelector('.section-header').textContent.trim().toUpperCase() === category.toUpperCase()) {
          box.querySelectorAll('.section-row').forEach(row => {
            const label = row.querySelector('.section-label');
            if (label && label.innerText.replace(':', '').trim().toUpperCase() === values[0].toUpperCase()) {
              const field = row.querySelector('.editable-field');
              if (field) field.innerText = values[1];
            }
          });
        }
      });
    } else if (type === 'SECTION_BODY') {
      document.querySelectorAll('.section-box').forEach(box => {
        if (box.querySelector('.section-header').textContent.trim().toUpperCase() === category.toUpperCase()) {
          const field = box.querySelector('.section-content.editable-field');
          if (field) field.innerText = values[1];
        }
      });
    } else if (type === 'SPLITFIELD') {
      document.querySelectorAll('.section-box').forEach(box => {
        if (box.querySelector('.section-header').textContent.trim().toUpperCase() === category.toUpperCase()) {
          box.querySelectorAll('.section-row').forEach(row => {
            const label = row.querySelector('.section-label');
            if (label && label.innerText.replace(':', '').trim().toUpperCase() === values[0].toUpperCase()) {
              const split = row.querySelector('.hp-split');
              if (split) {
                split.children[0].innerText = values[1];
                split.children[2].innerText = values[2];
              }
            }
          });
        }
      });
    } else if (type === 'DYNAMIC_SKILL') {
      document.querySelectorAll('.section-box').forEach(box => {
        const title = box.querySelector('.section-header').textContent.trim();
        if (title.toUpperCase() === category.toUpperCase()) {
          const container = box.querySelector('.dynamic-rows');
          if (!container) return;

          let html = '';
          if (title === 'Standard Skills') html = renderSkillRow('skills');
          else if (title === 'Combat Skills') html = renderSkillRow('combat');
          else if (title === 'Speed') html = renderDragsIgnoredRow();
          else if (title === 'Spells Known') html = renderSpellRow();

          if (html && values.length > 0) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const newRow = tempDiv.firstElementChild;
            const inputs = newRow.querySelectorAll('input');
            values.forEach((val, i) => { if (inputs[i]) inputs[i].value = val; });

            container.appendChild(newRow);
          }
        }
      });
    } else if (type === 'DYNAMIC_ACTION') {
      document.querySelectorAll('.section-box').forEach(box => {
        const title = box.querySelector('.section-header').textContent.trim();
        if (title.toUpperCase() === category.toUpperCase() && title === 'Main Actions') {
          const container = box.querySelector('.dynamic-rows');
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = renderMainAction();
          const newRow = tempDiv.firstElementChild;

          newRow.querySelector('.main-action-title').innerText = values[0];
          newRow.querySelector('.main-action-subtitle').innerText = values[1];

          const texts = newRow.querySelectorAll('.main-action-text');
          if (texts[0]) texts[0].innerText = values[2];
          if (texts[1]) texts[1].innerText = values[3];

          const tds = newRow.querySelectorAll('.main-action-table td[contenteditable]');
          values.slice(4).forEach((val, i) => { if (tds[i]) tds[i].innerText = val; });

          // Precise container targeting not needed anymore
          // because .dynamic-rows is only on the inner list.
          if (container) container.appendChild(newRow);
        }
      });
    }
  });

  // Final cleanup: Restore placeholders for empty fields
  document.querySelectorAll('.editable-field').forEach(el => {
    if (el.innerText.trim() === '') {
      el.innerText = '';
      el.replaceChildren();
    }
  });
};

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
