import { 
  renderMainAction, 
  renderRowForSection,
  renderVariantActionRow
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
        const html = renderRowForSection(title);
        
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

const scrapeHeaders = (data) => {
  data.headers = {};
  document.querySelectorAll('[data-sync-id]').forEach(el => {
    const id = el.getAttribute('data-sync-id');
    // Save innerText for simple headers
    if (!data.headers[id]) {
      data.headers[id] = el.innerText;
    }
  });
};

const getSectionData = (data, title) => {
  if (!data.sections[title]) {
    data.sections[title] = {
      checkboxes: {},
      fields: {},
      sectionBody: '',
      splitFields: {},
      dynamicRows: []
    };
  }
  return data.sections[title];
};

const scrapeCheckboxes = (box, title, data) => {
  const section = getSectionData(data, title);
  box.querySelectorAll('.checkbox-item').forEach((item, idx) => {
    const label = item.innerText.trim() || `index-${idx}`;
    const checked = item.querySelector('input').checked;
    section.checkboxes[label] = checked;
  });
};

const scrapeFields = (box, title, data) => {
  const section = getSectionData(data, title);
  box.querySelectorAll('.section-row-editable, .editable-field:not(.dynamic-rows *):not([data-sync-id]):not(.hp-split *)').forEach(field => {
    const labelEl = field.previousElementSibling;
    if (labelEl && labelEl.classList.contains('section-label')) {
      const label = labelEl.innerText.replace(':', '').trim();
      // Use innerText for standard stats
      section.fields[label] = field.innerText;
    } else if (field.classList.contains('section-content')) {
      // Use innerHTML for big text blocks (Features, etc.) to capture styling
      section.sectionBody = field.innerHTML;
    }
  });
};

const scrapeSplitFields = (box, title, data) => {
  const section = getSectionData(data, title);
  box.querySelectorAll('.hp-split').forEach(split => {
    const labelEl = split.previousElementSibling;
    if (labelEl && labelEl.classList.contains('section-label')) {
      const label = labelEl.innerText.replace(':', '').trim();
      section.splitFields[label] = {
        cur: split.children[0].innerText,
        max: split.children[2].innerText
      };
    }
  });
};

const scrapeDynamicRows = (box, title, data) => {
  const section = getSectionData(data, title);
  box.querySelectorAll('.skill-row, .main-action-container').forEach(row => {
    if (row.classList.contains('skill-row')) {
      const inputs = Array.from(row.querySelectorAll('input'));
      if (inputs.length === 0) return;
      section.dynamicRows.push({
        type: 'skill',
        values: inputs.map(i => i.value)
      });
    } else if (row.classList.contains('main-action-container')) {
      const titleVal = row.querySelector('.main-action-title').innerText;
      const subtitleVal = row.querySelector('.main-action-subtitle').innerText;
      
      // Use innerHTML for Action Details to preserve styling
      const details = Array.from(row.querySelectorAll('.main-action-text')).map(t => t.innerHTML);
      // Use textContent instead of innerText to ensure hidden tables are saved correctly
      const tableVals = Array.from(row.querySelectorAll('.main-action-table td[contenteditable]')).map(td => td.textContent);
      
      const variants = Array.from(row.querySelectorAll('.variant-action-text')).map(t => t.innerHTML);
      
      const isTableHidden = row.querySelector('.main-action-table').classList.contains('hidden');

      section.dynamicRows.push({
        type: 'action',
        title: titleVal,
        subtitle: subtitleVal,
        details: details,
        table: tableVals,
        variants: variants,
        isTableHidden: isTableHidden
      });
    }
  });
};

/**
 * Serializes the current sheet to a JSON string.
 */
export const serializeSheet = () => {
  const data = {
    version: 1,
    headers: {},
    sections: {}
  };

  // 1. Headers
  scrapeHeaders(data);

  // 2. Structured Sections
  document.querySelectorAll('.section-box').forEach(box => {
    const title = box.querySelector('.section-header').textContent.trim();
    scrapeCheckboxes(box, title, data);
    scrapeFields(box, title, data);
    scrapeSplitFields(box, title, data);
    scrapeDynamicRows(box, title, data);
  });

  return JSON.stringify(data, null, 2);
};

/**
 * JSON SAVE LOGIC
 */
export const saveToJSON = () => {
  const jsonContent = serializeSheet();
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const charName = document.querySelector('[data-sync-id="character-name"]').innerText.trim() || 'character';
  link.setAttribute('href', url);
  link.setAttribute('download', `${charName.replace(/[^a-z0-9]/gi, '_')}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * JSON LOAD LOGIC
 */
export const loadFromJSON = (jsonString) => {
  let data;
  try {
    data = JSON.parse(jsonString);
  } catch (e) {
    alert('Invalid JSON file');
    return;
  }

  // Clear existing sheet
  prepareSheetForData(false);

  // 1. Headers
  if (data.headers) {
    Object.entries(data.headers).forEach(([id, val]) => {
      document.querySelectorAll(`[data-sync-id="${id}"]`).forEach(el => el.innerText = val);
    });
  }

  // Cache section boxes by title for efficient lookup
  const boxesByTitle = {};
  document.querySelectorAll('.section-box').forEach(box => {
    const title = box.querySelector('.section-header').textContent.trim();
    if (!boxesByTitle[title]) boxesByTitle[title] = [];
    boxesByTitle[title].push(box);
  });

  if (!data.sections) return;

  Object.entries(data.sections).forEach(([title, section]) => {
    const boxes = boxesByTitle[title] || [];
    boxes.forEach(box => {
      // Checkboxes
      if (section.checkboxes) {
        box.querySelectorAll('.checkbox-item').forEach((item, idx) => {
          const label = item.innerText.trim() || `index-${idx}`;
          if (section.checkboxes.hasOwnProperty(label)) {
            item.querySelector('input').checked = section.checkboxes[label];
          }
        });
      }

      // Fields
      if (section.fields) {
        box.querySelectorAll('.section-row').forEach(row => {
          const labelEl = row.querySelector('.section-label');
          if (labelEl) {
            const label = labelEl.innerText.replace(':', '').trim();
            if (section.fields.hasOwnProperty(label)) {
              row.querySelector('.editable-field').innerText = section.fields[label];
            }
          }
        });
      }

      // Section Body (Rich Text)
      if (section.sectionBody) {
        const field = box.querySelector('.section-content.editable-field');
        if (field) field.innerHTML = section.sectionBody;
      }

      // Split Fields
      if (section.splitFields) {
        box.querySelectorAll('.hp-split').forEach(split => {
          const labelEl = split.previousElementSibling;
          if (labelEl) {
            const label = labelEl.innerText.replace(':', '').trim();
            if (section.splitFields[label]) {
              split.children[0].innerText = section.splitFields[label].cur;
              split.children[2].innerText = section.splitFields[label].max;
            }
          }
        });
      }

      // Dynamic Rows
      if (section.dynamicRows) {
        const container = box.querySelector('.dynamic-rows');
        if (container) {
          section.dynamicRows.forEach(rowData => {
            const html = renderRowForSection(title);
            if (!html) return;
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const newRow = tempDiv.firstElementChild;

            if (rowData.type === 'skill') {
              const inputs = newRow.querySelectorAll('input');
              rowData.values.forEach((val, i) => { if (inputs[i]) inputs[i].value = val; });
            } else if (rowData.type === 'action') {
              newRow.querySelector('.main-action-title').innerText = rowData.title;
              newRow.querySelector('.main-action-subtitle').innerText = rowData.subtitle;
              
              const texts = newRow.querySelectorAll('.main-action-text');
              if (texts[0] && rowData.details[0]) texts[0].innerHTML = rowData.details[0]; // Rich Text
              if (texts[1] && rowData.details[1]) texts[1].innerHTML = rowData.details[1]; // Rich Text
              
              const tds = newRow.querySelectorAll('.main-action-table td[contenteditable]');
              rowData.table.forEach((val, i) => { if (tds[i]) tds[i].innerText = val; });

              if (rowData.isTableHidden) {
                const table = newRow.querySelector('.main-action-table');
                const btn = newRow.querySelector('.table-toggle-btn');
                if (table) table.classList.add('hidden');
                if (btn) btn.innerText = 'Show Table';
              }

              if (rowData.variants && rowData.variants.length > 0) {
                const variantContainer = newRow.querySelector('.variant-actions-container');
                rowData.variants.forEach(variantHtml => {
                   const tempDiv = document.createElement('div');
                   tempDiv.innerHTML = renderVariantActionRow();
                   const variantRow = tempDiv.firstElementChild;
                   variantRow.querySelector('.variant-action-text').innerHTML = variantHtml;
                   variantContainer.appendChild(variantRow);
                });
              }
            }

            container.appendChild(newRow);
          });
        }
      }
    });
  });

  // Final cleanup
  document.querySelectorAll('.editable-field').forEach(el => {
    if (el.innerText.trim() === '') {
      el.innerText = '';
      el.replaceChildren();
    }
  });
};