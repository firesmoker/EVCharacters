import './style.css'
import { SKILLS_LIST, COMBAT_SKILLS_LIST, BONUS_LIST, DRAGS_IGNORED_LIST, SPELLS_LIST } from './data.js';
import { SPELLS_DATABASE } from './spells_data.js';
import { 
  renderApp, renderSkillRow, renderDragsIgnoredRow, renderMainAction, 
  renderSpellRow, renderRowForSection, renderVariantActionRow,
  renderSpellDescriptionBlock 
} from './components.js';
import { saveToJSON, loadFromJSON, prepareSheetForData, serializeSheet } from './io.js';

// Initial Render
renderApp();

const updateSpellDescriptions = () => {
  const col1 = document.getElementById('spells-col-1');
  const col2 = document.getElementById('spells-col-2');
  if (!col1 || !col2) return;

  // Find all selected spell names
  const selectedSpellNames = Array.from(document.querySelectorAll('.autocomplete-wrapper[data-type="spells"] input'))
    .map(input => input.value.trim())
    .filter(val => val !== '');

  // Get unique, sorted spell data
  const uniqueSpells = [...new Set(selectedSpellNames)]
    .map(rawName => {
      // Strip everything in parentheses for matching
      // e.g., "Cure (Mend Flesh)" becomes "Cure"
      const cleanName = rawName.replace(/\s*\(.*\)/, '').trim();
      return SPELLS_DATABASE.find(s => s.name.toLowerCase() === cleanName.toLowerCase());
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));

  // Clear columns
  col1.innerHTML = '';
  col2.innerHTML = '';

  // Calculate midpoint for vertical distribution
  const midPoint = Math.ceil(uniqueSpells.length / 2);

  // Distribute into columns: first half in col 1, second half in col 2
  uniqueSpells.forEach((spell, index) => {
    const html = renderSpellDescriptionBlock(spell);
    if (index < midPoint) {
      col1.insertAdjacentHTML('beforeend', html);
    } else {
      col2.insertAdjacentHTML('beforeend', html);
    }
  });
};

// Dynamically discover all templates in src/templates/
const templateModules = import.meta.glob('./templates/*.json', { eager: true });

const updateTemplateMenu = () => {
  const container = document.querySelector('.nested-dropdown-content');
  if (!container) return;

  // Build list from discovered modules
  let html = Object.keys(templateModules).map(path => {
    const fileName = path.split('/').pop();
    const displayName = fileName.replace('.json', '').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return `<div class="template-item" data-file="${path}">${displayName}</div>`;
  }).join('');

  // Add custom templates from localStorage
  const customTemplates = JSON.parse(localStorage.getItem('ev-custom-templates') || '{}');
  const customKeys = Object.keys(customTemplates);
  
  if (customKeys.length > 0) {
    html += '<div style="border-top: 1px solid #ddd; margin: 4px 0;"></div>';
    customKeys.forEach(key => {
      // Simple capitalization for display
      const displayName = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      html += `<div class="template-item" data-file="${key}" data-custom="true">${displayName}</div>`;
    });
  }

  container.innerHTML = html;
};

updateTemplateMenu();
updateSpellDescriptions();

let devMode = false;
// Listen for data loads (from file or template) to update descriptions
document.addEventListener('sheet-loaded', updateSpellDescriptions);

// Auto-Load
const savedData = localStorage.getItem('ev-char-sheet');
if (savedData) {
  loadFromJSON(savedData);
  // No need for explicit call here as loadFromJSON now dispatches 'sheet-loaded'
}

// Auto-Save Logic
let autoSaveTimeout;
const autoSave = () => {
  clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(() => {
    localStorage.setItem('ev-char-sheet', serializeSheet());
  }, 1000);
};

/**
 * Autocomplete Logic
 */
const updateSuggestions = (wrapper) => {
  const input = wrapper.querySelector('input');
  const dropdown = wrapper.querySelector('.suggestions-dropdown');
  const type = wrapper.getAttribute('data-type');
  const query = input.value.toLowerCase();

  const listMap = {
    'combat': COMBAT_SKILLS_LIST,
    'skills': SKILLS_LIST,
    'bonus': BONUS_LIST,
    'drags': DRAGS_IGNORED_LIST,
    'spells': SPELLS_LIST
  };

  const list = listMap[type];
  if (!list) return;

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

/**
 * Global Input Handler
 */
const handleInput = (e) => {
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
    if (e.target.closest('.autocomplete-wrapper').getAttribute('data-type') === 'spells') {
      updateSpellDescriptions();
    }
  }

  autoSave();
};

/**
 * Global Click Handler
 */
const handleClick = (e) => {
  // Suggestion Item Click
  if (e.target.classList.contains('suggestion-item')) {
    const wrapper = e.target.closest('.autocomplete-wrapper');
    const input = wrapper.querySelector('input');
    const value = e.target.innerText;
    input.value = value;
    wrapper.querySelector('.suggestions-dropdown').style.display = 'none';

    // Auto-fill logic for Spells Known
    if (wrapper.getAttribute('data-type') === 'spells') {
      const spellRow = wrapper.closest('.skill-row');
      if (spellRow) {
        const spell = SPELLS_DATABASE.find(s => s.name === value);
        if (spell) {
          const levelInput = spellRow.querySelector('input[placeholder="Lvl"]');
          const costInput = spellRow.querySelector('input[placeholder="Cost"]');
          const isCantrip = spell.level === 'Cantrip';
          if (levelInput) levelInput.value = isCantrip ? 'Cntrp' : spell.level;
          if (costInput) costInput.value = isCantrip ? '-' : spell.cost;
        }
      }
    }
    updateSpellDescriptions();
    return;
  }

  // Add Row
  if (e.target.classList.contains('add-row-btn')) {
    const sectionBox = e.target.closest('.section-box');
    const title = sectionBox.querySelector('.section-header').textContent.trim();
    const container = e.target.closest('.dynamic-rows');
    if (container) {
      const html = renderRowForSection(title);
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
    if (target) {
      target.remove();
      updateSpellDescriptions();
    }
  }

  // Add Variant Row
  if (e.target.classList.contains('add-variant-btn')) {
    const container = e.target.closest('.main-action-container').querySelector('.variant-actions-container');
    if (container) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = renderVariantActionRow();
      container.appendChild(tempDiv.firstElementChild);
    }
  }

  // Remove Variant Row
  if (e.target.classList.contains('remove-variant-btn')) {
    const target = e.target.closest('.variant-action-row');
    if (target) target.remove();
  }

  // New from Template Handler
  if (e.target.classList.contains('template-item')) {
    e.stopPropagation();
    const filePath = e.target.getAttribute('data-file');
    const isCustom = e.target.hasAttribute('data-custom');
    if (filePath) {
      if (confirm(`Load template "${e.target.innerText}"? Current unsaved changes will be lost.`)) {
        if (isCustom) {
          const customTemplates = JSON.parse(localStorage.getItem('ev-custom-templates') || '{}');
          if (customTemplates[filePath]) {
            loadFromJSON(JSON.stringify(customTemplates[filePath]));
            updateSpellDescriptions();
          }
        } else {
          // Use the data already loaded by Vite glob
          const templateData = templateModules[filePath];
          if (templateData) {
            // templateModules[filePath] is the module object; for JSON it's often the default or the object itself
            // In Vite, JSON glob eager imports return the object directly or { default: object }
            const data = templateData.default || templateData;
            loadFromJSON(JSON.stringify(data));
            updateSpellDescriptions();
          } else {
            alert('Template data not found.');
          }
        }
      }
    }
    return;
  }

  // Table/Notes Toggle
  if (e.target.classList.contains('table-toggle-btn')) {
    const targetEl = e.target.nextElementSibling;
    if (targetEl) {
      targetEl.classList.toggle('hidden');
      const isHidden = targetEl.classList.contains('hidden');
      
      if (targetEl.tagName === 'TABLE') {
        e.target.innerText = isHidden ? 'Show Table' : '👁️';
      } else {
        e.target.innerText = isHidden ? 'Show Notes' : '👁️';
      }
    }
  }

  // Menu Handlers
  const menuActions = {
    'export-pdf': () => window.print(),
    'menu-save': () => saveToJSON(),
    'menu-save-template': () => {
      const charName = document.querySelector('[data-sync-id="character-name"]').innerText.trim() || 'New Template';
      const templateName = prompt('Enter template name:', charName);
      if (!templateName) return;

      const fileKey = templateName.toLowerCase().replace(/[^a-z0-9]/gi, '_');
      const customTemplates = JSON.parse(localStorage.getItem('ev-custom-templates') || '{}');
      customTemplates[fileKey] = JSON.parse(serializeSheet());
      localStorage.setItem('ev-custom-templates', JSON.stringify(customTemplates));
      
      updateTemplateMenu();
      alert(`Template "${templateName}" saved!`);
    },
    'menu-open': () => document.getElementById('file-input').click(),
    'menu-new': () => {
      if (confirm('Are you sure you want to start a new sheet? All unsaved data will be lost.')) {
        localStorage.removeItem('ev-char-sheet');
        prepareSheetForData(true);
      }
    }
  };

  if (menuActions[e.target.id]) {
    menuActions[e.target.id]();
  }

  // Font Handlers
  const fontActions = {
    'font-pt-sans': "'PT Sans', sans-serif",
    'font-kalam': "'Kalam', cursive",
    'font-inter': "'Inter', sans-serif",
    'font-crimson': "'Crimson Pro', serif",
    'font-gentium': "'Gentium Plus', serif"
  };

  if (fontActions[e.target.id]) {
    document.documentElement.style.setProperty('--readable-font', fontActions[e.target.id]);
  }

  // Color Handlers
  const colorActions = {
    'color-navy': '#000080',
    'color-black': '#000000',
    'color-red': '#8B0000',
    'color-green': '#006400',
    'color-purple': '#4B0082'
  };

  if (colorActions[e.target.id]) {
    document.documentElement.style.setProperty('--field-color', colorActions[e.target.id]);
  }

  autoSave();
};

/**
 * Global Keydown Handler
 */
const handleGlobalKeydown = (e) => {
  // Font Size Shortcuts: Shift + [ (Decrease) / Shift + ] (Increase)
  if (e.shiftKey && (e.key === '{' || e.key === '}' || e.code === 'BracketLeft' || e.code === 'BracketRight')) {
    // Check if we are inside an editable field
    if (e.target.isContentEditable) {
      e.preventDefault();
      
      // Get current size (approximate) or default to 3 (normal)
      const currentSizeStr = document.queryCommandValue('fontSize');
      let currentSize = parseInt(currentSizeStr) || 3;

      if (e.key === '}' || e.code === 'BracketRight') {
        currentSize = Math.min(currentSize + 1, 7);
      } else {
        currentSize = Math.max(currentSize - 1, 1);
      }

      document.execCommand('fontSize', false, currentSize);
      return;
    }
  }

  // Autocomplete Logic
  if (!isAutocompleteInput(e.target)) return;

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
};

document.querySelector('#app').addEventListener('input', handleInput);

document.querySelector('#app').addEventListener('focusin', (e) => {
  if (isAutocompleteInput(e.target)) {
    updateSuggestions(e.target.closest('.autocomplete-wrapper'));
  }
});

document.querySelector('#app').addEventListener('keydown', handleGlobalKeydown);

// Listen for file input change via delegation
document.querySelector('#app').addEventListener('change', (e) => {
  if (e.target.id === 'file-input') {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target.result;
      loadFromJSON(json);
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  }
});

document.querySelector('#app').addEventListener('click', handleClick);

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