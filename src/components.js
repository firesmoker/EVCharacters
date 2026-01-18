import { SKILLS_LIST, COMBAT_SKILLS_LIST } from './data.js';

/**
 * Renders a standard dropdown menu.
 */
export const renderDropdown = (options, className) => `
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
export const renderAutocomplete = (placeholder, type, inputClass = 'skill-name') => `
  <div class="autocomplete-wrapper" data-type="${type}">
    <input type="text" class="${inputClass}" placeholder="${placeholder}">
    <div class="suggestions-dropdown"></div>
  </div>
`

/**
 * Renders a datalist for a given set of options.
 */
export const renderDatalist = (id, options) => `
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
export const renderSkillRow = (type = 'skills') => {
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
export const renderDragsIgnoredRow = () => `
  <div class="skill-row">
    ${renderAutocomplete("Drag Source", "drags", "skill-name")}
    <button class="remove-row-btn" title="Remove Row">-</button>
    <button class="add-row-btn" title="Add Row">+</button>
  </div>
`

/**
 * Renders a row for the Spells Known section.
 */
export const renderSpellRow = () => `
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

export const renderHeaderField = (label, placeholder, flex = 1) => {
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
export const renderSectionRow = (label, placeholder, icon = null) => `
  <div class="section-row">
    <div class="stat-icon">
      ${icon ? `<img src="/icons/${icon}.svg" width="18" height="18" alt="${label} Icon">` : ''}
    </div>
    <span class="section-label">${label}:</span>
    <span class="editable-field section-row-editable" contenteditable="true" data-placeholder="${placeholder}" style="flex-grow: 1; padding-left: 5px;"></span>
  </div>
`

// Content for the Spells Known section with headings
export const renderSpellsKnownSection = () => `
  <div class="skill-header-row" style="margin-bottom: 4px; border-bottom: 1px solid #eee; padding-bottom: 2px; pointer-events: none;">
    <div style="flex: 0 0 12mm; text-align: center; font-size: 9px; font-weight: bold; color: #666; text-transform: uppercase; font-family: Inter, sans-serif;">Level</div>
    <div style="flex: 1 1 auto; text-align: left; font-size: 9px; font-weight: bold; color: #666; text-transform: uppercase; font-family: Inter, sans-serif; padding-left: 4px;">Spell Name</div>
    <div style="flex: 0 0 15mm; text-align: center; font-size: 9px; font-weight: bold; color: #666; text-transform: uppercase; font-family: Inter, sans-serif;">Cost</div>
  </div>
  <div class="dynamic-rows">
    ${renderSpellRow()}
  </div>
`

// Content for the structured Spellcasting section
export const renderSpellcastingSection = () => `
  <div class="section-container" style="flex-direction: row; gap: 10px;">
    <div style="flex: 1; display: flex; flex-direction: column; gap: 2px;">
      <div class="section-row">
        <div class="stat-icon"></div>
        <span class="section-label">Spell Points:</span>
        <div class="stat-split">
          <span class="editable-field section-row-editable" contenteditable="true" data-placeholder="Cur" style="min-width: 25px; text-align: right;"></span>
          <span class="stat-slash">/</span>
          <span class="editable-field section-row-editable" contenteditable="true" data-placeholder="Max" style="min-width: 25px;"></span>
        </div>
      </div>
      ${renderSectionRow('Spells Known', '0')}
      ${renderSectionRow('Cantrips Known', '0')}
      ${renderSectionRow('Summon Slots', '0')}
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
export const renderDeathSection = () => `
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
export const renderSection = (title, content, options = {}) => {
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
export const renderDefensesSection = () => `
  <div class="section-container">
    <div class="section-row">
      <div class="stat-icon"><img src="/icons/heart.svg" width="18" height="18" alt="HP Icon"></div>
      <span class="section-label"><span class="highlight-char">H</span>ealth<br><span class="highlight-char">P</span>oints:</span>
      <div class="stat-split">
        <span class="editable-field section-row-editable" contenteditable="true" data-placeholder="Cur" style="min-width: 25px; text-align: right;"></span>
        <span class="stat-slash">/</span>
        <span class="editable-field section-row-editable" contenteditable="true" data-placeholder="Max" style="min-width: 25px;"></span>
      </div>
    </div>
    <div class="section-row" style="margin-top: 4px;">
      <div class="stat-icon"><img src="/icons/armor.svg" width="18" height="18" alt="DR Icon"></div>
      <span class="section-label"><span class="highlight-char">D</span>amage<br><span class="highlight-char">R</span>eduction:</span>
      <span class="editable-field section-row-editable" contenteditable="true" data-placeholder="0" style="flex-grow: 1; padding-left: 5px;"></span>
    </div>
    <div class="section-separator"></div>
    ${renderSectionRow('Deflection', '5')}
    ${renderSectionRow('Fortitude', '0')}
    ${renderSectionRow('Will', '0')}
    <div class="section-separator"></div>
    <div>
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
export const renderSpeedSection = () => `
  <div class="section-container">
    ${renderSectionRow('Movement', '3')}
    <div class="section-subsection-label">Drags Ignored:</div>
    <div class="dynamic-rows">
      ${renderDragsIgnoredRow()}
    </div>
  </div>
`

export const renderHeader = () => `
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
 * Renders a variant action row.
 */
export const renderVariantActionRow = () => `
  <div class="variant-action-row" style="display: flex; align-items: center; margin-top: 4px; gap: 4px;">
    <div class="editable-field variant-action-text" contenteditable="true" data-placeholder="Variant..." style="flex-grow: 1;"></div>
    <button class="remove-variant-btn" title="Remove Variant" style="font-size: 10px; cursor: pointer;">-</button>
  </div>
`

/**
 * Renders a complex Main Action block.
 */
export const renderMainAction = () => `
  <div class="main-action-container">
    <div style="display: flex; flex-direction: column;">
      <div class="editable-field main-action-title" contenteditable="true" data-placeholder="Action Title"></div>
      <div class="editable-field main-action-subtitle" contenteditable="true" data-placeholder="Action Speed"></div>
    </div>
    <div class="section-separator"></div>
    <div class="action-split-row" style="display: flex; align-items: flex-start;">
      <div class="editable-field main-action-text" contenteditable="true" data-placeholder="Action details..." style="flex-grow: 1; padding-right: 8px; min-width: 0;"></div>
      <div class="table-wrapper" style="flex-shrink: 0; margin-top: 0;">
        <div class="table-toggle-btn" title="Toggle Table">👁️</div>
        <table class="main-action-table standard-damage-table">
          <tr>
            <td></td>
            <td>Damage</td>
            <td>Ignores<br>DR</td>
          </tr>
          <tr>
            <td>Normal</td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
          </tr>
          <tr>
            <td>Major</td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
          </tr>
          <tr>
            <td>Critical</td>
            <td contenteditable="true"></td>
            <td contenteditable="true"></td>
          </tr>
        </table>
      </div>
    </div>
    <div class="table-wrapper">
      <div class="table-toggle-btn" title="Toggle Expanded Table">👁️</div>
      <table class="main-action-table expanded-damage-table">
        <tr>
          <td></td>
          <td>Damage</td>
          <td>Ignores DR</td>
          <td>Special Effects</td>
        </tr>
        <tr>
          <td>Normal</td>
          <td contenteditable="true"></td>
          <td contenteditable="true"></td>
          <td contenteditable="true"></td>
        </tr>
        <tr>
          <td>Major</td>
          <td contenteditable="true"></td>
          <td contenteditable="true"></td>
          <td contenteditable="true"></td>
        </tr>
        <tr>
          <td>Critical</td>
          <td contenteditable="true"></td>
          <td contenteditable="true"></td>
          <td contenteditable="true"></td>
        </tr>
      </table>
    </div>
    <div class="variant-actions-container"></div>
    <div class="variant-btn-container">
       <button class="add-variant-btn" title="Add Variant" style="font-size: 10px; padding: 2px 6px; cursor: pointer;">+ Variant</button>
    </div>
    <button class="remove-row-btn" title="Remove Action">-</button>
    <button class="add-row-btn" title="Add Action">+</button>
  </div>
`

/**
 * Renders a detailed spell block for the reference page.
 */
export const renderSpellDescriptionBlock = (spell) => `
  <div class="spell-description-block" style="margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid #eee;">
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <strong style="font-size: 15px; font-family: 'Crimson Pro', serif; text-transform: uppercase;">${spell.name}</strong>
      <em style="font-size: 11px; color: #666;">${spell.spellType} • ${spell.level === 'Cantrip' ? 'Cantrip' : 'Level ' + spell.level}</em>
    </div>
    <div style="font-size: 10px; color: #444; margin-bottom: 4px; display: flex; gap: 2px 10px; flex-wrap: wrap; line-height: 1.1;">
      <span><strong>Speed:</strong> ${spell.actionSpeed}</span>
      <span><strong>Range:</strong> ${spell.range}</span>
      <span><strong>Area:</strong> ${spell.area}</span>
      <span><strong>Duration:</strong> ${spell.duration}</span>
      <span><strong>Cost:</strong> ${spell.cost}</span>
    </div>
    <div style="font-size: 12px; line-height: 1.3; white-space: pre-wrap;" class="editable-field">${spell.description}</div>
  </div>
`

/**
 * Renders the top toolbar.
 */
export const renderToolbar = () => `
  <div class="top-bar">
    <div class="menu-item">File
      <div class="dropdown-content">
        <div id="menu-new">New</div>
        <div class="menu-item-nested">New from Template
          <div class="nested-dropdown-content">
            <!-- Populated dynamically -->
          </div>
        </div>
        <div id="menu-open">Open</div>
        <div id="menu-save">Save</div>
        <div id="menu-save-template">Save as Template</div>
        <div id="export-pdf">Export to PDF</div>
      </div>
    </div>
    <input type="file" id="file-input" style="display: none;" accept=".json">
    <div class="menu-item">Edit<div class="dropdown-content"><div>Undo</div><div>Redo</div></div></div>
    <div class="menu-item">View<div class="dropdown-content"><div>Zoom In</div><div>Zoom Out</div></div></div>
    <div class="menu-item">Font<div class="dropdown-content"><div id="font-pt-sans">PT Sans (Default)</div><div id="font-kalam">Kalam (Handwritten)</div><div id="font-inter">Inter (Modern)</div><div id="font-crimson">Crimson Pro (Serif)</div><div id="font-gentium">Gentium Plus (Classic)</div></div></div>
    <div class="menu-item">Color<div class="dropdown-content"><div id="color-navy">Navy Blue</div><div id="color-black">Black</div><div id="color-red">Dark Red</div><div id="color-green">Dark Green</div><div id="color-purple">Purple</div></div></div>
  </div>
`

// Application Rendering Logic
export const renderApp = () => {
  document.querySelector('#app').innerHTML = `
  ${renderToolbar()}
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
              ${renderSection('Defenses', renderDefensesSection(), { isStructured: true })}
              ${renderSection('Speed', renderSpeedSection(), { isStructured: true, isDynamic: true })}
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
                  ${renderSection('Spellcasting', renderSpellcastingSection(), { isStructured: true, style: 'height: 100%;' })}
                </div>
                <div style="flex: 1;">
                   ${renderSection('Death', renderDeathSection(), { isStructured: true, style: 'height: 100%;' })}
                </div>
              </div>
              ${renderSection('Spells Known', renderSpellsKnownSection(), { isStructured: true, isDynamic: true })}
            </section>
          </main>
        </div>

        <div class="a4-page">
          ${renderHeader()}
          
          <main class="sheet-middle" style="grid-template-columns: 1fr 1fr;">
            <section class="sheet-column spell-descriptions-container" id="spells-col-1">
            </section>
            
            <section class="sheet-column spell-descriptions-container" id="spells-col-2">
            </section>
          </main>
        </div>
      </div>
    </div>
  </div>
`
};

/**
 * Returns the HTML for a new row based on the section title.
 */
export const renderRowForSection = (title) => {
  const templates = {
    'Standard Skills': () => renderSkillRow('skills'),
    'Combat Skills': () => renderSkillRow('combat'),
    'Speed': () => renderDragsIgnoredRow(),
    'Main Actions': () => renderMainAction(),
    'Spells Known': () => renderSpellRow()
  };
  return templates[title] ? templates[title]() : null;
};
