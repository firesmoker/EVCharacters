import {
  renderRowForSection,
  renderVariantActionRow,
  renderStrikesCantripsTableRow
} from './components.js';

const STRIKES_CANTRIPS_TABLE_SLOT_ORDER = ['weapon', 'speed', 'roll', 'damage', 'range', 'doubleSix'];

const createStrikesCantripsTableRowElement = () => {
  const table = document.createElement('table');
  table.innerHTML = `<tbody>${renderStrikesCantripsTableRow()}</tbody>`;
  return table.querySelector('tbody tr');
};

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
  box.querySelectorAll('.section-row-editable, .editable-field:not(.dynamic-rows *):not([data-sync-id]):not(.stat-split *)').forEach(field => {
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
  box.querySelectorAll('.stat-split').forEach(split => {
    const labelEl = split.previousElementSibling;
    if (labelEl && labelEl.classList.contains('section-label')) {
      const label = labelEl.innerText.replace(':', '').trim();
      const curField = split.querySelector('.editable-field[data-split-part="cur"]');
      const maxField = split.querySelector('.editable-field[data-split-part="max"]');
      const tempField = split.querySelector('.editable-field[data-split-part="temp"]');

      section.splitFields[label] = {
        cur: curField ? curField.innerText : '',
        max: maxField ? maxField.innerText : ''
      };

      if (tempField) {
        section.splitFields[label].temp = tempField.innerText;
      }
    }
  });
};

const scrapeDynamicRows = (box, title, data) => {
  const section = getSectionData(data, title);
  box.querySelectorAll('.skill-row, .strikes-cantrips-container').forEach(row => {
    if (row.classList.contains('skill-row')) {
      const inputs = Array.from(row.querySelectorAll('input'));
      if (inputs.length === 0) return;
      section.dynamicRows.push({
        type: 'skill',
        values: inputs.map(i => i.value)
      });
    } else if (row.classList.contains('strikes-cantrips-container')) {
      const slots = {};
      row.querySelectorAll('.strikes-cantrips-slot-value').forEach(field => {
        const slotName = field.getAttribute('data-slot');
        if (!slotName) return;
        const isTableField = Boolean(field.closest('.strikes-cantrips-slots-table'));
        if (!isTableField) {
          slots[slotName] = field.innerText;
        }
      });

      const tableRows = Array.from(row.querySelectorAll('.strikes-cantrips-slots-table tbody tr')).map(tableRow => {
        const rowData = {};
        STRIKES_CANTRIPS_TABLE_SLOT_ORDER.forEach(slotName => {
          const field = tableRow.querySelector(`.strikes-cantrips-slot-value[data-slot="${slotName}"]`);
          rowData[slotName] = field ? field.innerHTML : '';
        });
        return rowData;
      });

      const variants = Array.from(row.querySelectorAll('.variant-action-text')).map(t => t.innerHTML);
      const variantsRegion = row.querySelector('.variants-region');
      const ui = {
        variantsHidden: variantsRegion ? variantsRegion.classList.contains('variants-hidden') : false,
        weaponColumnHidden: row.classList.contains('weapon-column-hidden')
      };

      section.dynamicRows.push({
        type: 'action',
        slots,
        tableRows,
        variants,
        ui
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
    sections: {},
    preferences: {}
  };

  // 0. Preferences
  const style = getComputedStyle(document.documentElement);
  // We want the inline style value if set, or computed if we want to persist defaults (though usually we only care if user changed it)
  // Actually, better to check the inline style on document.documentElement directly as that's where we set it.
  data.preferences.font = document.documentElement.style.getPropertyValue('--readable-font') || '';
  data.preferences.color = document.documentElement.style.getPropertyValue('--field-color') || '';

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
export const saveToJSON = async () => {
  const jsonContent = serializeSheet();
  const charName = document.querySelector('[data-sync-id="character-name"]').innerText.trim() || 'ev_character';
  const fileName = `${charName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;

  if ('showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{
          description: 'Character Sheet JSON',
          accept: { 'application/json': ['.json'] },
        }],
      });
      const writable = await handle.createWritable();
      await writable.write(jsonContent);
      await writable.close();
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Save failed:', err);
      }
    }
  } else {
    // Fallback for browsers without File System Access API
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
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

  // 0. Preferences
  if (data.preferences) {
    if (data.preferences.font) {
      document.documentElement.style.setProperty('--readable-font', data.preferences.font);
    }
    if (data.preferences.color) {
      document.documentElement.style.setProperty('--field-color', data.preferences.color);
    }
  }

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
        box.querySelectorAll('.stat-split').forEach(split => {
          const labelEl = split.previousElementSibling;
          if (labelEl) {
            const label = labelEl.innerText.replace(':', '').trim();
            if (section.splitFields[label]) {
              const curField = split.querySelector('.editable-field[data-split-part="cur"]');
              const maxField = split.querySelector('.editable-field[data-split-part="max"]');
              const tempField = split.querySelector('.editable-field[data-split-part="temp"]');

              if (curField) curField.innerText = section.splitFields[label].cur || '';
              if (maxField) maxField.innerText = section.splitFields[label].max || '';
              if (tempField) tempField.innerText = section.splitFields[label].temp || '';
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
              const slots = rowData.slots || {};
              newRow.querySelectorAll('.strikes-cantrips-slot-value').forEach(field => {
                const slotName = field.getAttribute('data-slot');
                if (!slotName) return;
                const isTableField = Boolean(field.closest('.strikes-cantrips-slots-table'));
                if (!isTableField && slots.hasOwnProperty(slotName)) {
                  field.innerText = slots[slotName];
                }
              });

              const tableBody = newRow.querySelector('.strikes-cantrips-slots-table tbody');
              if (tableBody) {
                tableBody.innerHTML = '';
                const tableRows = Array.isArray(rowData.tableRows) && rowData.tableRows.length > 0
                  ? rowData.tableRows
                  : [{
                      weapon: slots.weapon || '',
                      speed: slots.speed || '',
                      roll: slots.roll || '',
                      damage: slots.damage || '',
                      range: slots.range || '',
                      doubleSix: slots.doubleSix || ''
                    }];

                tableRows.forEach(tableRowData => {
                  const tableRow = createStrikesCantripsTableRowElement();
                  if (!tableRow) return;

                  STRIKES_CANTRIPS_TABLE_SLOT_ORDER.forEach(slotName => {
                    const field = tableRow.querySelector(`.strikes-cantrips-slot-value[data-slot="${slotName}"]`);
                    if (field) {
                      field.innerHTML = tableRowData[slotName] || '';
                    }
                  });

                  tableBody.appendChild(tableRow);
                });

                const removeTableRowBtn = newRow.querySelector('.remove-strikes-table-row-btn');
                if (removeTableRowBtn) {
                  removeTableRowBtn.classList.toggle('hidden', tableRows.length <= 1);
                }
              }

              if (rowData.ui && typeof rowData.ui.variantsHidden === 'boolean') {
                const variantsRegion = newRow.querySelector('.variants-region');
                const variantsToggleBtn = newRow.querySelector('.variants-toggle-btn');
                if (variantsRegion) {
                  variantsRegion.classList.toggle('variants-hidden', rowData.ui.variantsHidden);
                }
                if (variantsToggleBtn) {
                  variantsToggleBtn.innerText = rowData.ui.variantsHidden ? 'Show Variants' : '👁️';
                }
              }

              if (rowData.ui && typeof rowData.ui.weaponColumnHidden === 'boolean') {
                const weaponToggleBtn = newRow.querySelector('.weapon-column-toggle-btn');
                newRow.classList.toggle('weapon-column-hidden', rowData.ui.weaponColumnHidden);
                if (weaponToggleBtn) {
                  weaponToggleBtn.innerText = rowData.ui.weaponColumnHidden ? 'Show Weapon' : '👁️';
                }
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

  // Notify the app that data has been loaded
  document.dispatchEvent(new CustomEvent('sheet-loaded'));
};

