import './style.css'
import { SKILLS_LIST, COMBAT_SKILLS_LIST, BONUS_LIST, DRAGS_IGNORED_LIST, SPELLS_LIST } from './data.js';
import { renderApp, renderSkillRow, renderDragsIgnoredRow, renderMainAction, renderSpellRow, renderRowForSection } from './components.js';
import { saveToJSON, loadFromJSON, prepareSheetForData } from './io.js';

// Initial Render
renderApp();

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
  }
};

/**
 * Global Click Handler
 */
const handleClick = (e) => {
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
    if (target) target.remove();
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
    'menu-open': () => document.getElementById('file-input').click(),
    'menu-new': () => {
      if (confirm('Are you sure you want to start a new sheet? All unsaved data will be lost.')) {
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