import { SKILLS_LIST, COMBAT_SKILLS_LIST } from './data.js';
import { MONSTERS_DATABASE } from './monsters_data.js';
import defenseCrest from '../public/defense-crest.svg?raw';
import { ACCENT_THEMES } from './accent.js';

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
      <svg class="skill-icon" aria-hidden="true" viewBox="0 0 24 24"><use href="/icons/skills.svg#skill"></use></svg>
      ${renderAutocomplete("Skill", type)}
      ${renderAutocomplete("Training", "bonus", "skill-bonus")}
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
    <div class="autocomplete-wrapper" style="flex: 0 0 19mm;">
        <input type="text" class="skill-bonus" placeholder="Rank" style="width: 100%; text-align: center;">
    </div>
    ${renderAutocomplete("Spell Name", "spells", "skill-name")}
    <div class="autocomplete-wrapper" style="flex: 0 0 15mm;">
        <input type="text" class="skill-bonus" placeholder="Cost" style="width: 100%; text-align: center;">
    </div>
    <div class="autocomplete-wrapper spell-notes"><input type="text" class="skill-name" placeholder="Notes" aria-label="Spell notes"></div>
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
export const renderSectionRow = (label, placeholder, icon = null, showColon = true, decoration = '') => `
  <div class="section-row">
    ${decoration}
    <div class="stat-icon">
      ${icon ? `<img src="/icons/${icon}.svg" width="18" height="18" alt="${label} Icon">` : ''}
    </div>
    <span class="section-label">${label}${showColon ? ':' : ''}</span>
    <span class="editable-field section-row-editable" contenteditable="true" data-placeholder="${placeholder}" style="flex-grow: 1; padding-left: 5px;"></span>
  </div>
`

// Content for the Spells Known section with headings
export const renderSpellsKnownSection = () => `
  <div class="skill-header-row" style="margin-bottom: 4px; border-bottom: 1px solid #eee; padding-bottom: 2px; pointer-events: none;">
    <div style="flex: 0 0 19mm; text-align: center; font-size: 9px; font-weight: bold; color: #666; text-transform: uppercase; font-family: Inter, sans-serif;">Rank</div>
    <div style="flex: 1 1 auto; text-align: left; font-size: 9px; font-weight: bold; color: #666; text-transform: uppercase; font-family: Inter, sans-serif; padding-left: 4px;">Spell Name</div>
    <div style="flex: 0 0 15mm; text-align: center; font-size: 9px; font-weight: bold; color: #666; text-transform: uppercase; font-family: Inter, sans-serif;">Cost</div>
    <div style="flex: 1 1 0; text-align: left; font-size: 9px; font-weight: bold; color: #666; text-transform: uppercase; font-family: Inter, sans-serif; padding-left: 4px;">Notes</div>
  </div>
  <div class="dynamic-rows">
    ${renderSpellRow()}
  </div>
`


// Content for the structured Spellcasting section
const renderTradition = name => `<label class="checkbox-item tradition-choice"><input type="checkbox"><svg class="tradition-icon" viewBox="0 0 32 32" aria-hidden="true"><use href="/icons/traditions.svg#${name.toLowerCase()}"></use></svg><span>${name}</span></label>`;
export const renderSpellcastingSection = () => `
  <div class="section-container spellcasting-layout">
    <div class="spellcasting-resources">
      <div class="section-row">
        <div class="stat-icon"></div>
        <span class="section-label">Spell Points:</span>
        <div class="stat-split">
          <div class="spell-point-pool">
          <span class="editable-field section-row-editable" contenteditable="true" data-split-part="cur" data-placeholder="Cur" style="min-width: 25px; text-align: right;"></span>
          <span class="stat-slash">/</span>
          <span class="editable-field section-row-editable" contenteditable="true" data-split-part="max" data-placeholder="Max" style="min-width: 25px;"></span>
          </div>
          <span class="temp-sp-caption">Temporary Spell Points:</span>
          <span class="editable-field section-row-editable" contenteditable="true" data-split-part="temp" data-placeholder="Temp" aria-label="Temporary Spell Points" style="min-width: 25px;"></span>
        </div>
      </div>
      ${renderSectionRow('Spells Known', '0')}
      ${renderSectionRow('Cantrips Known', '0')}
      ${renderSectionRow('Summon Slots', '0')}
    </div>
    <div class="traditions-panel">
      <div class="traditions-grid">
      <div class="basic-traditions">
      <div class="traditions-heading">Traditions</div>
      ${['Arcane', 'Bardic', 'Divine', 'Nature', 'Occult'].map(renderTradition).join('')}
      </div>
      <div class="exclusive-traditions">
      <div class="traditions-heading">Exclusive</div>
      ${['Chrono', 'Necromancy'].map(renderTradition).join('')}
      </div>
      </div>
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
    <div class="section-box" data-section="${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}" style="${style}">
      ${title === 'Spells Known' ? '<button class="sort-spells-btn" title="Sort spells by rank, then name" aria-label="Sort spells by rank, then name">↕</button>' : ''}
      <div class="section-header"${title === 'Feats' ? ' title="At level 1, choose one Minor Feat for which you meet the requirements, in addition to your Origin Feat."' : ''}>${title}</div>
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
  <div class="defense-summary">
    <div class="section-row health-panel">
      <div class="health-heading" aria-hidden="true">Health</div>
      <div class="health-captions" aria-hidden="true"><span>Current</span><span>Maximum</span><span>Temp HP</span></div>
      <span class="section-label"><span class="highlight-char">H</span>ealth<br><span class="highlight-char">P</span>oints:</span>
      <div class="stat-split">
        <span class="editable-field section-row-editable" contenteditable="true" data-split-part="cur" data-placeholder="Cur" aria-label="Current HP"></span>
        <span class="stat-slash">/</span>
        <span class="editable-field section-row-editable" contenteditable="true" data-split-part="max" data-placeholder="Max" aria-label="Maximum HP"></span>
        <span class="editable-field section-row-editable" contenteditable="true" data-split-part="temp" data-placeholder="Temp" aria-label="Temporary HP"></span>
      </div>
    </div>
    <div class="defense-crests">
    ${renderSectionRow('Deflection', '0', null, false, defenseCrest)}
    ${renderSectionRow('Fortitude', '0', null, false, defenseCrest)}
    ${renderSectionRow('Will', '0', null, false, defenseCrest)}
    </div>
  </div>
`

// Content for the structured Equipment Proficiencies section
export const renderEquipmentProficienciesSection = () => `
  <div class="section-container">
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
    <div style="margin-top: 6px;">
      <div class="section-subsection-label">Weapon Training:</div>
      <div class="checkbox-group">
        <label class="checkbox-item"><input type="checkbox"> Martial Weapons</label>
      </div>
    </div>
    <div class="drags-ignored">
    <div class="section-subsection-label" title="Each point of Drag slows an action by one speed level, to a minimum of Slow. Each additional point adds a penalty of 1 to the Slow action's roll.">Drags Ignored:</div>
    <div class="dynamic-rows">
      ${renderDragsIgnoredRow()}
    </div>
    </div>
  </div>
`

// Content for the structured Speed section
export const renderSpeedSection = () => `
  <div class="section-container">
    <div class="speed-stats">
    ${renderSectionRow('Movement', '3')}
    ${renderSectionRow('Instinct', '0')}
    </div>

  </div>
`

export const renderHeader = (showDetails = false) => `
  <span class="page-corner top-left" aria-hidden="true"></span>
  <span class="page-corner top-right" aria-hidden="true"></span>
  <span class="page-corner bottom-left" aria-hidden="true"></span>
  <span class="page-corner bottom-right" aria-hidden="true"></span>
  <header class="sheet-header">
    ${showDetails ? `<label class="portrait-toggle"><input type="checkbox" id="portrait-enabled"> Portrait</label>
    <label class="portrait-frame" for="portrait-upload" tabindex="0" role="button" aria-label="Upload character portrait" hidden>
      <img alt="Character portrait" hidden>
      <span class="portrait-placeholder">Upload image</span>
    </label>
    <button class="portrait-crop-button" type="button" hidden>Adjust crop</button>
    <input type="file" id="portrait-upload" accept="image/png,image/jpeg,image/webp,image/gif" hidden>` : ''}
    <div class="sheet-identity">
      <h1 class="editable-field sheet-title" contenteditable="true" data-placeholder="Character Name" data-sync-id="character-name"></h1>
      <div class="sheet-wordmark" aria-hidden="true">Eternal Valor</div>
      ${showDetails ? `<div class="header-row player-details">
        ${renderHeaderField('Player Name', '...', 2.07)}
        ${renderHeaderField('Level', '0', 0.65)}
        ${renderHeaderField('Experience', '0', 1.28)}
      </div>
      <div class="header-row">
        ${renderHeaderField('Class', '...', 1)}
        ${renderHeaderField('Subclass', '...', 1)}
        ${renderHeaderField('Species', '...', 1)}
      </div>` : ''}
    </div>
  </header>
`

// These edit the Spellcasting section's existing fields; they are not a second saved resource.
export const renderSpellPointSummary = () => `
  <div class="spell-point-summary">
    <div>
    <span class="resource-label">Spell Points</span>
    <div class="resource-values">
      <span class="editable-field" contenteditable="true" data-spell-point-mirror="cur" data-placeholder="Cur" aria-label="Current Spell Points"></span>
      <span aria-hidden="true">/</span>
      <span class="editable-field" contenteditable="true" data-spell-point-mirror="max" data-placeholder="Max" aria-label="Maximum Spell Points"></span>
    </div>
    </div>
    <div class="temp-sp-group">
      <span class="resource-label">Temp SP</span>
      <span class="editable-field" contenteditable="true" data-spell-point-mirror="temp" data-placeholder="—" aria-label="Temporary Spell Points"></span>
    </div>
  </div>
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
 * Renders a table row for Strikes & Damaging Cantrips.
 */
export const renderStrikesCantripsTableRow = () => `
  <tr>
    <td class="strikes-cantrips-cell-weapon"><div class="editable-field strikes-cantrips-slot-value" contenteditable="true" data-slot="weapon" data-placeholder="weapon"></div></td>
    <td><div class="editable-field strikes-cantrips-slot-value" contenteditable="true" data-slot="speed" data-placeholder="—"></div></td>
    <td><div class="editable-field strikes-cantrips-slot-value" contenteditable="true" data-slot="roll" data-placeholder="—"></div></td>
    <td><div class="editable-field strikes-cantrips-slot-value" contenteditable="true" data-slot="minimum" data-placeholder="—"></div></td>
    <td><div class="editable-field strikes-cantrips-slot-value" contenteditable="true" data-slot="damage" data-placeholder="—"></div></td>
    <td><div class="editable-field strikes-cantrips-slot-value" contenteditable="true" data-slot="range" data-placeholder="—"></div></td>
    <td><div class="editable-field strikes-cantrips-slot-value" contenteditable="true" data-slot="doubleSix" data-placeholder="—"></div></td>
  </tr>
`

/**
 * Renders a complex Strikes & Damaging Cantrips block.
 */
export const renderStrikesDamagingCantripsBlock = () => `
  <div class="strikes-cantrips-container">
    <button class="choose-cantrip-btn" title="Choose a cantrip" aria-label="Choose a cantrip">✦</button>
    <button class="action-table-toggle-btn" title="Show or hide action table" aria-label="Show or hide action table" aria-pressed="false">▦</button>
    <div class="strikes-cantrips-name-line">
      <div class="strikes-cantrips-slot slot-name">
        <div class="editable-field strikes-cantrips-slot-value" contenteditable="true" data-slot="name" data-placeholder="name"></div>
      </div>
    </div>
    <div class="strikes-cantrips-roll-description-line">
      <div class="strikes-cantrips-slot slot-roll-description">
        <div class="editable-field strikes-cantrips-slot-value" contenteditable="true" data-slot="rollDescription" data-placeholder="roll description"></div>
      </div>
    </div>
    <div class="strikes-cantrips-table-line">
      <div class="strikes-cantrips-table-row-controls">
        <button class="remove-strikes-table-row-btn hidden" title="Remove Table Row">-</button>
        <button class="add-strikes-table-row-btn" title="Add Table Row">+</button>
      </div>
      <button class="weapon-column-toggle-btn" title="Toggle Weapon Column">👁️</button>
      <table class="strikes-cantrips-slots-table">
        <colgroup>
          <col class="strikes-cantrips-col-weapon">
          <col class="strikes-cantrips-col-speed">
          <col class="strikes-cantrips-col-roll">
          <col class="strikes-cantrips-col-minimum">
          <col class="strikes-cantrips-col-damage">
          <col class="strikes-cantrips-col-range">
          <col class="strikes-cantrips-col-double-six">
        </colgroup>
        <thead>
          <tr>
            <th>Weapon</th>
            <th>Speed</th>
            <th>Roll</th>
            <th>Min.</th>
            <th>Damage</th>
            <th>Range</th>
            <th>Double Six</th>
          </tr>
        </thead>
        <tbody>
          ${renderStrikesCantripsTableRow()}
        </tbody>
      </table>
    </div>
    <div class="strikes-cantrips-notes-line">
      <div class="strikes-cantrips-slot slot-notes">
        <div class="editable-field strikes-cantrips-slot-value" contenteditable="true" data-slot="notes" data-placeholder="notes"></div>
      </div>
    </div>
    <div class="variants-region variants-hidden">
      <button class="variants-toggle-btn" title="Toggle Variants">Show Variants</button>
      <div class="variants-container">
        <div class="section-subsection-label">Variants</div>
        <div class="variant-actions-container"></div>
      </div>
    </div>
    <div class="variant-btn-container">
       <button class="add-variant-btn" title="Add Variant" style="font-size: 10px; padding: 2px 6px; cursor: pointer;">+ Variant</button>
    </div>
    <button class="remove-row-btn" title="Remove Action">-</button>
    <button class="add-row-btn" title="Add Action">+</button>
  </div>
`

const escapeStatText = (value) => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[char]));

const renderMonsterEntries = (entries = [], bullets = false) => entries.length ? entries.map(entry => `
  <li class="monster-stat-entry">${bullets ? '<span class="monster-stat-bullet" aria-hidden="true">•</span>' : ''}<span class="monster-stat-entry-content"><span class="monster-stat-entry-header"><strong>${escapeStatText(entry.name)}</strong>${entry.speed ? ` <span class="monster-stat-speed">${escapeStatText(entry.speed)}</span>` : ''}${entry.detail ? '' : '.'}</span>${entry.detail ? `<span class="monster-stat-entry-detail">${escapeStatText(entry.detail)}</span>` : ''}${entry.description ? ` <span class="monster-stat-entry-description">${escapeStatText(entry.description)}</span>` : ''}</span></li>`).join('') : '<li class="monster-stat-empty">None.</li>';

export const renderMonsterStatBlock = (monster) => {
  if (!monster) return '';
  const stats = [['HP', monster.hp], ['DEF', monster.deflection ?? 1], ['FOR', monster.fortitude ?? 1],
    ['WILL', monster.will ?? 1], ['Movement', monster.movement]]
    .filter(([, value]) => value !== undefined && value !== null && value !== '');
  return `<section class="monster-stat-block" aria-label="${escapeStatText(monster.name)} stat block">
    <div class="monster-stat-heading"><strong>${escapeStatText(monster.name)}</strong>
      <span>${[monster.type, monster.size].filter(Boolean).map(escapeStatText).join(' • ')}</span></div>
    <dl class="monster-stat-values">${stats.map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeStatText(value)}</dd></div>`).join('')}</dl>
    <section class="monster-stat-section">
      <h4>Traits</h4>
      <ul class="monster-stat-traits">${renderMonsterEntries(monster.traits)}</ul>
    </section>
    <section class="monster-stat-section">
      <h4>Actions</h4>
      <ul class="monster-stat-actions">${renderMonsterEntries(monster.actions, true)}</ul>
    </section>
  </section>`;
};

/**
 * Renders a detailed spell block for the reference page.
 */
const renderSpellText = (description) => description.trim().replace(/\n[ \t]*\n+/g, '\n').replace(
  /(^|\n+)(Empower Spell:)([\s\S]*?)(?=\n[ \t]*\n|$)/g,
  (_, prefix, label, text) => `<div class="spell-empowerment"><strong>${label}</strong>${text}</div>`
).replace(/(^|\n)(Double 6:)/g, '$1<strong>$2</strong>')
  .replace(/(^[ \t]*•[^\n]*(?:\n|$))+/gm, list => '<ul>' + list.trimEnd().split('\n')
    .map(line => `<li>${escapeStatText(line.replace(/^[ \t]*•[ \t]*/, ''))}</li>`).join('') + '</ul>\n')
  .replace(/\n/g, '<span class="spell-paragraph-break"></span>');

export const renderSpellDescriptionBlock = (spell) => `
  <div class="spell-description-block">
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; border-bottom: 1px solid #eee; padding-bottom: 2px;">
      <div style="display: flex; align-items: center; gap: 6px;">
        <strong style="font-size: 15px; font-family: 'Crimson Pro', serif; text-transform: uppercase;">${spell.name}</strong>
        ${spell.exclusive ? '<span class="spell-tag">Exclusive</span>' : ''}
      </div>
      <em style="font-size: 11px; color: #666;">${spell.spellType} • ${spell.rank === 'Cantrip' ? 'Cantrip' : 'Rank ' + spell.rank}</em>
    </div>
    <div style="font-size: 13px; color: #444; margin-bottom: 8px; display: flex; gap: 2px 10px; flex-wrap: wrap; line-height: 1.2;">
      <span><strong>Speed:</strong> ${spell.actionSpeed}</span>
      <span><strong>Range:</strong> ${spell.range}</span>
      <span><strong>Area:</strong> ${spell.area}</span>
      ${spell.duration.trim() && !/^instantaneous$/i.test(spell.duration.trim()) ? `<span><strong>Duration:</strong> ${spell.duration}</span>` : ''}
      ${spell.requirements ? `<span><strong>Requirements:</strong> ${spell.requirements}</span>` : ''}
      ${spell.rank !== 'Cantrip' ? `<span><strong>Cost:</strong> ${spell.cost}</span>` : ''}
    </div>
    <div class="spell-description-text">${renderSpellText(spell.description)}</div>
    ${(spell.summons || []).map(name => renderMonsterStatBlock(MONSTERS_DATABASE.find(monster => monster.name === name))).join('')}
  </div>
`

/**
 * Renders the top toolbar.
 */
export const renderToolbar = () => `
  <div class="top-bar">
    <div class="menu-item">File
      <div class="dropdown-content">
        <div id="menu-create-character">Create Character…</div>
        <div id="menu-rebuild-character">Rebuild from Saved Choices…</div>
        <div id="menu-recover-character">Restore Before Creation / Rebuild…</div>
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
        <div class="menu-separator"></div>
        <div id="menu-delete-templates">Delete All Templates</div>
      </div>
    </div>
    <input type="file" id="file-input" style="display: none;" accept=".json">
    <div class="menu-item">Edit<div class="dropdown-content"><div data-history-action="undo">Undo</div><div data-history-action="redo">Redo</div></div></div>
    <div class="menu-item">View<div class="dropdown-content"><div>Zoom In</div><div>Zoom Out</div></div></div>
    <div class="menu-item">Format<div class="dropdown-content"><div role="menuitemradio" data-section-size="auto">Smart size sections</div><div role="menuitemradio" data-section-size="fixed">Fixed size sections</div></div></div>
    <div class="menu-item">Font<div class="dropdown-content"><div id="font-pt-sans">PT Sans (Default)</div><div id="font-kalam">Kalam (Handwritten)</div><div id="font-inter">Inter (Modern)</div><div id="font-crimson">Crimson Pro (Serif)</div><div id="font-gentium">Gentium Plus (Classic)</div></div></div>
    <div class="menu-item">Color<div class="dropdown-content color-menu"><div id="color-custom">Custom…</div>${ACCENT_THEMES.map(([id, name, color]) => `<div id="color-${id}" data-accent="${color}"><span class="color-swatch" style="background:${color}"></span>${name}</div>`).join('')}</div></div>
  </div>
`

// Application Rendering Logic
export const renderApp = () => {
  document.querySelector('#app').innerHTML = `
  ${renderToolbar()}
  <div class="main-area">
    <div class="editor-canvas">
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div class="a4-page character-page">
          <!-- Define Datalists -->
          ${renderDatalist('skills-list', SKILLS_LIST)}
          ${renderDatalist('combat-skills-list', COMBAT_SKILLS_LIST)}

          ${renderHeader(true)}

          <div class="combat-band">
            ${renderSection('Defenses', renderDefensesSection(), { isStructured: true })}
            <div class="essentials-panel">
              <div class="essentials-heading" aria-hidden="true">Essentials</div>
              ${renderSection('Speed', renderSpeedSection(), { isStructured: true, isDynamic: true })}
              ${renderSpellPointSummary()}
            </div>
            ${renderSection('Damage Defenses', `<div class="damage-defense-line">
              <div class="section-row"><span class="section-label">Resistances:</span><span class="editable-field" contenteditable="true" aria-label="Resistances" data-placeholder="—"></span></div>
              <div class="section-row"><span class="section-label">Vulnerabilities:</span><span class="editable-field" contenteditable="true" aria-label="Vulnerabilities" data-placeholder="—"></span></div>
            </div>`, { isStructured: true })}
          </div>
          
          <main class="sheet-middle">
            <section class="sheet-column">
              ${renderSection('Combat Skills', `<div class="dynamic-rows">${renderSkillRow('combat')}</div>`, { isStructured: true, isDynamic: true })}
              ${renderSection('Standard Skills', `<div class="dynamic-rows">${renderSkillRow('skills')}</div>`, { isStructured: true, isDynamic: true })}
              ${renderSection('Equipment Proficiencies', renderEquipmentProficienciesSection(), { isStructured: true })}
            </section>
            
            <section class="sheet-column">
              ${renderSection('Species Features', '')}
              ${renderSection('Class Features', '')}
            </section>
          </main>
        </div>

        <div class="a4-page actions-page">
          ${renderHeader()}
          <main class="sheet-middle">
            <section class="sheet-column">
              ${renderSection('Instinct Abilities', '')}
            </section>
            <section class="sheet-column">
              ${renderSection('Strikes & Damaging Cantrips', `<div class="dynamic-rows">${renderStrikesDamagingCantripsBlock()}</div>`, { isStructured: true, isDynamic: true })}
            </section>
          </main>
        </div>

        <div class="a4-page details-page">
          ${renderHeader()}
          
          <main class="sheet-middle">
            <section class="sheet-column">
              ${renderSection('Languages', '', { style: 'flex: 0 0 auto; min-height: 65px;' })}
              ${renderSection('Death', renderDeathSection(), { isStructured: true, style: 'flex: 0 0 auto;' })}
              ${renderSection('Equipment', '')}
              ${renderSection('Items', '')}
            </section>
            
            <section class="sheet-column">
              ${renderSection('Additional Features', '')}
              ${renderSection('Feats', '')}
            </section>
          </main>
        </div>

        <div class="a4-page spellcasting-page">
          ${renderHeader()}
          
          <main class="sheet-middle" style="grid-template-columns: 1fr;">
            <section class="sheet-column">
              ${renderSection('Spellcasting', renderSpellcastingSection(), { isStructured: true })}
              ${renderSection('Spells Known', renderSpellsKnownSection(), { isStructured: true, isDynamic: true })}
            </section>
          </main>
        </div>

        <div class="a4-page spell-page hidden">
          ${renderHeader()}
          
          <main class="sheet-middle" style="grid-template-columns: repeat(2, minmax(0, 1fr));">
            <section class="sheet-column spell-descriptions-container" id="spells-col-1" style="gap: 1px;">
            </section>
            
            <section class="sheet-column spell-descriptions-container" id="spells-col-2" style="gap: 1px;">
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
    'Equipment Proficiencies': () => renderDragsIgnoredRow(),
    'Strikes & Damaging Cantrips': () => renderStrikesDamagingCantripsBlock(),
    'Spells Known': () => renderSpellRow()
  };
  return templates[title] ? templates[title]() : null;
};

