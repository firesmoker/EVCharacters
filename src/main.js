import { compareSpellRows } from './spell-sort.js';
import { initSheetHistory } from './sheet-history.js';
import { initSheetPaste } from './sheet-paste.js';
import { initCantripPicker } from './cantrip-picker.js';
import { applyAccent } from './accent.js';
import { initColorPicker } from './color-picker.js';
import { setSectionSize, isFixedSize } from './section-format.js';
import { initPortrait } from './portrait.js';
import './style.css'
import './sheet-theme.css'
import { updateSkillIcon } from './skill-icons.js';
import { initSheetTools } from './sheet-tools.js';
import { SKILLS_LIST, COMBAT_SKILLS_LIST, BONUS_LIST, DRAGS_IGNORED_LIST, SPELLS_LIST } from './data.js';
import { SPELLS_DATABASE } from './spells_data.js';
import { 
  renderApp, renderSkillRow,
  renderSpellRow, renderRowForSection, renderVariantActionRow,
  renderSpellDescriptionBlock, renderHeader, renderStrikesCantripsTableRow
} from './components.js';
import { saveToJSON, loadFromJSON, prepareSheetForData, serializeSheet } from './io.js';

// Initial Render
renderApp();

const updateSpellDescriptions = () => {
  const basePage = document.querySelector('.spell-page');
  if (!basePage) return;

  // Cleanup dynamic pages
  document.querySelectorAll('.spell-page-dynamic').forEach(el => el.remove());

  const col1 = document.getElementById('spells-col-1');
  const col2 = document.getElementById('spells-col-2');
  if (!col1 || !col2) return;

  // Clear base columns
  col1.innerHTML = '';
  col2.innerHTML = '';

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

  if (uniqueSpells.length === 0) {
    basePage.classList.add('hidden');
    return;
  }
  
  basePage.classList.remove('hidden');

  let currentPage = basePage;
  let currentCol = col1;
  let isSecondCol = false;

  // Height check helper (with slight tolerance)
  const isOverflowing = (page) => page.scrollHeight > page.clientHeight + 2;

  const createNewPage = () => {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'a4-page spell-page spell-page-dynamic';
    pageDiv.innerHTML = `
        ${renderHeader()}
        <main class="sheet-middle" style="grid-template-columns: repeat(2, minmax(0, 1fr));">
          <section class="sheet-column spell-descriptions-container" style="gap: 1px;"></section>
          <section class="sheet-column spell-descriptions-container" style="gap: 1px;"></section>
        </main>
    `;
    const allPages = document.querySelectorAll('.a4-page');
    allPages[allPages.length - 1].after(pageDiv);
    const cols = pageDiv.querySelectorAll('.sheet-column');
    return { page: pageDiv, col1: cols[0], col2: cols[1] };
  };

  uniqueSpells.forEach((spell) => {
    const html = renderSpellDescriptionBlock(spell);
    
    // Append to check height
    currentCol.insertAdjacentHTML('beforeend', html);
    
    if (isOverflowing(currentPage)) {
      // Remove the block we just added
      currentCol.lastElementChild.remove();
      
      // Try next column or next page
      if (!isSecondCol) {
        // Switch to second column
        isSecondCol = true;
        if (currentPage === basePage) {
           currentCol = col2;
        } else {
           currentCol = currentPage.querySelectorAll('.sheet-column')[1];
        }
        currentCol.insertAdjacentHTML('beforeend', html);
        
        // Check overflow again (if spell is huge)
        if (isOverflowing(currentPage)) {
           currentCol.lastElementChild.remove();
           // New Page needed
           const newPage = createNewPage();
           currentPage = newPage.page;
           currentCol = newPage.col1;
           isSecondCol = false;
           currentCol.insertAdjacentHTML('beforeend', html);
        }
      } else {
         // New Page needed
         const newPage = createNewPage();
         currentPage = newPage.page;
         currentCol = newPage.col1;
         isSecondCol = false;
         currentCol.insertAdjacentHTML('beforeend', html);
      }
    }
  });

  // Sync Headers for new pages
  const syncIds = ['character-name', 'player-name', 'level', 'experience', 'class', 'subclass', 'species'];
  syncIds.forEach(id => {
      const master = document.querySelector(`[data-sync-id="${id}"]`);
      if (master) {
          const val = master.innerText;
           document.querySelectorAll(`[data-sync-id="${id}"]`).forEach(el => {
              if (el !== master) el.innerText = val;
           });
      }
  });
};

// Dynamically discover all templates in src/templates/
const templateModules = import.meta.glob('./templates/*.json', { eager: true });

const updateTemplateMenu = () => {
  const container = document.querySelector('.nested-dropdown-content');
  if (!container) return;

  const compareByDisplayName = (a, b) => a.displayName.localeCompare(b.displayName, undefined, { sensitivity: 'base' });

  // Build list from discovered modules
  const builtInTemplates = Object.keys(templateModules).map(path => {
    const fileName = path.split('/').pop();
    const displayName = fileName.replace('.json', '').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return { path, displayName };
  }).sort(compareByDisplayName);

  let html = builtInTemplates.map(template => `<div class="template-item" data-file="${template.path}">${template.displayName}</div>`).join('');

  // Add custom templates from localStorage
  const customTemplates = JSON.parse(localStorage.getItem('ev-custom-templates') || '{}');
  const customTemplateItems = Object.keys(customTemplates).map(key => {
    const displayName = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return { key, displayName };
  }).sort(compareByDisplayName);
  
  if (customTemplateItems.length > 0) {
    html += '<div style="border-top: 1px solid #ddd; margin: 4px 0;"></div>';
    customTemplateItems.forEach(template => {
      html += `<div class="template-item" data-file="${template.key}" data-custom="true">${template.displayName}</div>`;
    });
  }

  container.innerHTML = html;
};

const updateStrikesCantripsTableRowControls = (strikesContainer) => {
  if (!strikesContainer) return;
  const tbody = strikesContainer.querySelector('.strikes-cantrips-slots-table tbody');
  const removeBtn = strikesContainer.querySelector('.remove-strikes-table-row-btn');
  if (!tbody || !removeBtn) return;

  const rowCount = tbody.querySelectorAll('tr').length;
  removeBtn.classList.toggle('hidden', rowCount <= 1);
};

const createStrikesCantripsTableRowElement = () => {
  const table = document.createElement('table');
  table.innerHTML = `<tbody>${renderStrikesCantripsTableRow()}</tbody>`;
  return table.querySelector('tbody tr');
};

const updateAllStrikesCantripsTableRowControls = () => {
  document.querySelectorAll('.strikes-cantrips-container').forEach(updateStrikesCantripsTableRowControls);
};

updateTemplateMenu();
updateSpellDescriptions();
updateAllStrikesCantripsTableRowControls();

let devMode = false;
const updateSkillPresentation = () => {
  document.querySelectorAll('.skill-row').forEach(updateSkillIcon);
};
const spellPointFields = () => document.querySelector('[data-section="spellcasting"] .stat-split');
const syncSpellPointSummary = () => {
  document.querySelectorAll('[data-spell-point-mirror]').forEach(mirror => {
    const field = spellPointFields()?.querySelector(`[data-split-part="${mirror.dataset.spellPointMirror}"]`);
    mirror.innerText = field?.innerText || '';
  });
};
// Listen for data loads (from file or template) to update descriptions
document.addEventListener('sheet-loaded', updateSpellDescriptions);
document.addEventListener('sheet-loaded', updateAllStrikesCantripsTableRowControls);
document.addEventListener('sheet-loaded', syncSpellPointSummary);
document.addEventListener('sheet-loaded', updateSkillPresentation);

// Auto-Load
const savedData = localStorage.getItem('ev-char-sheet');
if (savedData) {
  loadFromJSON(savedData);
  // No need for explicit call here as loadFromJSON now dispatches 'sheet-loaded'
} else {
  prepareSheetForData(true);
  updateSkillPresentation();
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
        const spell = type === 'spells' ? SPELLS_DATABASE.find(item => item.name === opt) : null;
        const tag = spell?.exclusive ? '<span class="spell-tag">Exclusive</span>' : '';
        html += `<div class="suggestion-item" data-value="${opt}"><span>${opt}</span>${tag}</div>`;
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
  if (e.target.matches('input.skill-name')) updateSkillIcon(e.target.closest('.skill-row'));
  // Contenteditable cleanup
  if (e.target.classList.contains('editable-field')) {
    if (e.target.innerHTML === '<br>' || e.target.innerText === '\n' || e.target.innerText.trim() === '') {
      if (e.target.innerText.trim() === '') e.target.replaceChildren();
    }
  }

  if (e.target.hasAttribute('data-spell-point-mirror')) {
    const field = spellPointFields()?.querySelector(`[data-split-part="${e.target.dataset.spellPointMirror}"]`);
    if (field) field.innerText = e.target.innerText;
  } else if (e.target.closest('[data-section="spellcasting"] .stat-split')) {
    syncSpellPointSummary();
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
  const sortSpells = e.target.closest('.sort-spells-btn');
  if (sortSpells) {
    const list = sortSpells.closest('.section-box').querySelector('.dynamic-rows');
    const values = row => [...row.querySelectorAll('input')].map(input => input.value);
    list.append(...[...list.children].sort((a, b) => compareSpellRows(values(a), values(b))));
    autoSave();
    return;
  }
  if (e.target.dataset.sectionSize) {
    document.dispatchEvent(new CustomEvent('sheet-edit-start'));
    setSectionSize(e.target.dataset.sectionSize);
    document.dispatchEvent(new CustomEvent('sheet-edit-end'));
    autoSave();
    return;
  }
  if (isFixedSize() && e.target.matches('.add-row-btn, .remove-row-btn, .add-variant-btn, .remove-variant-btn')) return;
  // Suggestion Item Click
  const suggestionItem = e.target.closest('.suggestion-item');
  if (suggestionItem) {
    const wrapper = suggestionItem.closest('.autocomplete-wrapper');
    const input = wrapper.querySelector('input');
    const value = suggestionItem.dataset.value;
    input.value = value;
    updateSkillIcon(input.closest('.skill-row'));
    wrapper.querySelector('.suggestions-dropdown').style.display = 'none';

    // Auto-fill logic for Spells Known
    if (wrapper.getAttribute('data-type') === 'spells') {
      const spellRow = wrapper.closest('.skill-row');
      if (spellRow) {
        const spell = SPELLS_DATABASE.find(s => s.name === value);
        if (spell) {
          const rankInput = spellRow.querySelector('input[placeholder="Rank"]');
          const costInput = spellRow.querySelector('input[placeholder="Cost"]');
          const isCantrip = spell.rank === 'Cantrip';
          if (rankInput) rankInput.value = isCantrip ? 'Cantrip' : spell.rank;
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
        const newRow = tempDiv.firstElementChild;
        container.appendChild(newRow);
        if (newRow && newRow.classList.contains('strikes-cantrips-container')) {
          updateStrikesCantripsTableRowControls(newRow);
        }
      }
    }
  }

  // Remove Row
  if (e.target.classList.contains('remove-row-btn')) {
    const target = e.target.closest('.skill-row') || e.target.closest('.strikes-cantrips-container');
    if (target) {
      const dynamicRows = target.closest('.dynamic-rows');
      target.remove();
      if (dynamicRows) {
        updateAllStrikesCantripsTableRowControls();
      }
      updateSpellDescriptions();
    }
  }

  // Add Table Row (Strikes & Damaging Cantrips)
  if (e.target.classList.contains('add-strikes-table-row-btn')) {
    const strikesContainer = e.target.closest('.strikes-cantrips-container');
    const tbody = strikesContainer?.querySelector('.strikes-cantrips-slots-table tbody');
    if (tbody) {
      const newRow = createStrikesCantripsTableRowElement();
      if (newRow) {
        tbody.appendChild(newRow);
        updateStrikesCantripsTableRowControls(strikesContainer);
      }
    }
  }

  // Remove Table Row (Strikes & Damaging Cantrips)
  if (e.target.classList.contains('remove-strikes-table-row-btn')) {
    const strikesContainer = e.target.closest('.strikes-cantrips-container');
    const tbody = strikesContainer?.querySelector('.strikes-cantrips-slots-table tbody');
    if (tbody) {
      const rows = tbody.querySelectorAll('tr');
      if (rows.length > 1) {
        rows[rows.length - 1].remove();
        updateStrikesCantripsTableRowControls(strikesContainer);
      }
    }
  }

  // Add Variant Row
  if (e.target.classList.contains('add-variant-btn')) {
    const container = e.target.closest('.strikes-cantrips-container').querySelector('.variant-actions-container');
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

  // Toggle Variants Container
  if (e.target.classList.contains('variants-toggle-btn')) {
    const variantsRegion = e.target.closest('.variants-region');
    if (variantsRegion) {
      variantsRegion.classList.toggle('variants-hidden');
      const isCollapsed = variantsRegion.classList.contains('variants-hidden');
      e.target.innerText = isCollapsed ? 'Show Variants' : '👁️';
    }
    autoSave();
    return;
  }

  // Toggle Weapon Column
  if (e.target.classList.contains('action-table-toggle-btn')) {
    const block = e.target.closest('.strikes-cantrips-container');
    const hidden = block.classList.toggle('action-table-hidden');
    e.target.setAttribute('aria-pressed', String(hidden));
    autoSave();
    return;
  }

  // Toggle Weapon Column
  if (e.target.classList.contains('weapon-column-toggle-btn')) {
    const strikesContainer = e.target.closest('.strikes-cantrips-container');
    if (strikesContainer) {
      strikesContainer.classList.toggle('weapon-column-hidden');
      const isHidden = strikesContainer.classList.contains('weapon-column-hidden');
      e.target.innerText = isHidden ? 'Show Weapon' : '👁️';
    }
    autoSave();
    return;
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
    'export-pdf': () => {
      const charName = document.querySelector('[data-sync-id="character-name"]').innerText.trim();
      const originalTitle = document.title;
      document.title = charName || 'ev_character';
      window.print();
      document.title = originalTitle;
    },
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
    'menu-delete-templates': () => {
      const customTemplates = JSON.parse(localStorage.getItem('ev-custom-templates') || '{}');
      const totalTemplates = Object.keys(customTemplates).length;
      if (totalTemplates === 0) {
        alert('No custom templates to delete.');
        return;
      }

      const label = totalTemplates === 1 ? 'template' : 'templates';
      const confirmed = confirm(`Delete all ${totalTemplates} custom ${label}? This cannot be undone.`);
      if (!confirmed) return;

      localStorage.removeItem('ev-custom-templates');
      updateTemplateMenu();
      alert(`Deleted ${totalTemplates} custom ${label}.`);
    },
    'menu-open': () => document.getElementById('file-input').click(),
    'menu-new': () => {
      if (confirm('Are you sure you want to start a new sheet? All unsaved data will be lost.')) {
        localStorage.removeItem('ev-char-sheet');
        prepareSheetForData(true);
        updateSpellDescriptions();
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
    document.fonts.ready.then(updateSkillPresentation);
  }

  // Color Handlers
  const colorChoice = e.target.closest('[data-accent]');
  if (colorChoice) {
    applyAccent(colorChoice.dataset.accent);
  }

  autoSave();
};

/**
 * Global Keydown Handler
 */
const handleGlobalKeydown = (e) => {
  const richField = e.target.closest('.rich-text[contenteditable="true"]');
  if (richField && e.key === ' ' && !e.isComposing && !e.ctrlKey && !e.metaKey && !e.altKey) {
    const selection = getSelection();
    if (selection?.isCollapsed && selection.rangeCount && richField.contains(selection.anchorNode)) {
      const caret = selection.getRangeAt(0);
      const element = caret.startContainer.nodeType === Node.TEXT_NODE ? caret.startContainer.parentElement : caret.startContainer;
      const block = element.closest('p, div, li');
      if (block && richField.contains(block) && !element.closest('li')) {
        const prefix = caret.cloneRange();
        prefix.selectNodeContents(block);
        prefix.setEnd(caret.startContainer, caret.startOffset);
        const lastBreak = [...block.querySelectorAll('br')].filter(br => prefix.intersectsNode(br)).at(-1);
        if (lastBreak) prefix.setStartAfter(lastBreak);
        let startsAfterBreak = Boolean(lastBreak);
        const text = prefix.toString(), newline = text.lastIndexOf('\n');
        if (newline >= 0 && caret.startContainer.nodeType === Node.TEXT_NODE && caret.startOffset >= text.length - newline - 1) {
          prefix.setStart(caret.startContainer, caret.startOffset - (text.length - newline - 1));
          startsAfterBreak = true;
        }
        if (/^\s*\*$/.test(prefix.toString())) {
          e.preventDefault();
          richField.dispatchEvent(new CustomEvent('sheet-edit-start', { bubbles: true }));
          selection.removeAllRanges();
          selection.addRange(prefix);
          document.execCommand('delete', false, null);
          if (!richField.hasChildNodes()) {
            richField.innerHTML = '<ul><li></li></ul>';
            selection.collapse(richField.querySelector('li'), 0);
          } else {
            if (startsAfterBreak) {
              document.execCommand('delete', false, null);
              document.execCommand('insertParagraph', false, null);
            }
            const current = selection.anchorNode?.nodeType === Node.TEXT_NODE ? selection.anchorNode.parentElement : selection.anchorNode;
            const paragraph = current?.closest('p');
            if (paragraph && richField.contains(paragraph)) document.execCommand('formatBlock', false, 'div');
            document.execCommand('insertUnorderedList', false, null);
          }
          richField.dispatchEvent(new CustomEvent('sheet-edit-end', { bubbles: true }));
          autoSave();
          return;
        }
      }
    }
  }
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

  // Bullet Points Shortcut: Ctrl + Shift + 8
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === '8' || e.code === 'Digit8')) {
    if (richField) {
      e.preventDefault();
      richField.dispatchEvent(new CustomEvent('sheet-edit-start', { bubbles: true }));
      document.execCommand('insertUnorderedList', false, null);
      richField.dispatchEvent(new CustomEvent('sheet-edit-end', { bubbles: true }));
      autoSave();
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
      items[selectedIndex].click();
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
document.addEventListener('keydown', (event) => {
  if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey || event.key.toLowerCase() !== 's') return;
  event.preventDefault();
  if (!event.repeat) saveToJSON();
});

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

initSheetTools();
initSheetHistory(autoSave);
initSheetPaste();
initCantripPicker(autoSave);
initPortrait(autoSave);
initColorPicker(autoSave);
let creationWizard;
document.getElementById('menu-create-character').addEventListener('click', async () => {
  creationWizard ||= import('./creation-wizard.js').then(module => module.initCreationWizard(autoSave));
  (await creationWizard)();
});
document.getElementById('menu-rebuild-character').addEventListener('click', async () => {
  const sheet = JSON.parse(serializeSheet());
  creationWizard ||= import('./creation-wizard.js').then(module => module.initCreationWizard(autoSave));
  (await creationWizard)(sheet);
});
document.getElementById('menu-recover-character').addEventListener('click', () => {
  const backup = localStorage.getItem('ev-before-character-creation');
  if (!backup) { alert('No recovery copy is available in this browser.'); return; }
  if (!confirm('Restore the sheet saved before your last creation or rebuild? This replaces the current sheet.')) return;
  loadFromJSON(backup); autoSave();
});

