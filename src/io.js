import { 
  renderSkillRow, 
  renderDragsIgnoredRow, 
  renderMainAction, 
  renderSpellRow 
} from './components.js';

/**
 * Helper to clear the sheet and optionally restore default rows
 */
export const prepareSheetForData = (restoreDefaults = false) => {
  // Clear headers and fields
  document.querySelectorAll('.editable-field').forEach(el => el.innerText = '');
  // Clear checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
  
  // Purge/Reset dynamic rows
  // Now simpler and more robust: .dynamic-rows ONLY refers to the inner lists.
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
export const saveToCSV = () => {
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
 * Robust CSV Parser
 */
const parseCSV = (text) => {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i+1];
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

export const loadFromCSV = (csv) => {
  // Clear existing sheet using robust logic (no defaults restored as CSV will populate)
  prepareSheetForData(false);

  const rows = parseCSV(csv);

  // Cache section boxes by title for efficient lookup
  const boxesByTitle = {};
  document.querySelectorAll('.section-box').forEach(box => {
    const title = box.querySelector('.section-header').textContent.trim().toUpperCase();
    if (!boxesByTitle[title]) boxesByTitle[title] = [];
    boxesByTitle[title].push(box);
  });

  const forEachSection = (category, cb) => {
    const boxes = boxesByTitle[category.toUpperCase()] || [];
    boxes.forEach(cb);
  };

  rows.forEach(parts => {
    if (parts.length < 2) return;
    
    // Normalize values: handle quotes and normalize line breaks
    // We replace \r\n (CRLF) and \r (CR) with \n (LF) to prevent double spacing in contenteditable
    const [type, category, ...rawValues] = parts;
    const values = rawValues.map(v => v.replace(/\r\n/g, '\n').replace(/\r/g, '\n'));

    if (type === 'HEADER') {
      document.querySelectorAll(`[data-sync-id="${category}"]`).forEach(el => el.innerText = values[0]);
    } else if (type === 'CHECKBOX') {
      forEachSection(category, box => {
        box.querySelectorAll('.checkbox-item').forEach((item, idx) => {
          const label = item.innerText.trim() || `index-${idx}`;
          if (label.toUpperCase() === values[0].toUpperCase()) {
            item.querySelector('input').checked = values[1] === 'true';
          }
        });
      });
    } else if (type === 'FIELD') {
      forEachSection(category, box => {
        box.querySelectorAll('.section-row').forEach(row => {
          const label = row.querySelector('.section-label');
          if (label && label.innerText.replace(':', '').trim().toUpperCase() === values[0].toUpperCase()) {
            const field = row.querySelector('.editable-field');
            if (field) field.innerText = values[1];
          }
        });
      });
    } else if (type === 'SECTION_BODY') {
      forEachSection(category, box => {
        const field = box.querySelector('.section-content.editable-field');
        if (field) field.innerText = values[1];
      });
    } else if (type === 'SPLITFIELD') {
      forEachSection(category, box => {
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
      });
    } else if (type === 'DYNAMIC_SKILL') {
      forEachSection(category, box => {
        const title = box.querySelector('.section-header').textContent.trim();
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
      });
    } else if (type === 'DYNAMIC_ACTION') {
      forEachSection(category, box => {
        const title = box.querySelector('.section-header').textContent.trim();
        if (title === 'Main Actions') {
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
