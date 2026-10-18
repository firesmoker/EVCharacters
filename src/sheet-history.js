import { serializeSheet, loadFromJSON } from './io.js';
import { paginateSheets } from './sheet-tools.js';

// Native editing history cannot follow nodes moved or split by pagination.
export function initSheetHistory(onRestore) {
  const undo = [], redo = [];
  let restoring = false, pending, epoch = 0;
  const fields = section => [...document.querySelectorAll(`[data-section="${section}"] input, [data-section="${section}"] textarea, [data-section="${section}"] [contenteditable="true"]`)];
  function bookmark(field) {
    if (!(field instanceof Element)) return null;
    const sync = field.getAttribute('data-sync-id');
    const section = field.closest('.section-box')?.dataset.section;
    const isBody = field.matches('.section-content[contenteditable]');
    const result = { sync, section, isBody, index: section ? fields(section).indexOf(field) : 0 };
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      result.start = field.selectionStart; result.end = field.selectionEnd;
    } else if (field.isContentEditable) {
      const selection = getSelection();
      if (selection.rangeCount && field.contains(selection.anchorNode) && field.contains(selection.focusNode)) {
        const range = selection.getRangeAt(0), before = range.cloneRange();
        before.selectNodeContents(field); before.setEnd(range.startContainer, range.startOffset);
        result.start = before.toString().length; result.end = result.start + range.toString().length;
        const element = range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer.parentElement : range.startContainer;
        const emptyItem = element.closest('li');
        if (emptyItem && !emptyItem.textContent) {
          const parts = isBody ? [...document.querySelectorAll(`[data-section="${section}"] .section-content`)] : [field];
          result.emptyListItem = parts.flatMap(part => [...part.querySelectorAll('li')]).indexOf(emptyItem);
        }
        if (isBody) {
          for (const part of document.querySelectorAll(`[data-section="${section}"] .section-content`)) {
            if (part === field) break;
            result.start += part.textContent.length; result.end += part.textContent.length;
          }
        }
      }
    }
    result.key = sync || `${section}:${isBody ? 'body' : result.index}`;
    return result;
  }
  function restoreFocus(mark) {
    if (!mark) return;
    let targets = mark.sync ? [document.querySelector(`[data-sync-id="${mark.sync}"]`)]
      : mark.isBody ? [...document.querySelectorAll(`[data-section="${mark.section}"] .section-content`)]
      : [fields(mark.section)[mark.index]];
    targets = targets.filter(Boolean);
    if (!targets.length) return;
    const field = targets[0];
    if (Number.isInteger(mark.emptyListItem)) {
      const item = targets.flatMap(target => [...target.querySelectorAll('li')])[mark.emptyListItem];
      if (item && !item.textContent) {
        item.closest('[contenteditable="true"]').focus({ preventScroll: true });
        getSelection().collapse(item, 0);
        return;
      }
    }
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      field.focus({ preventScroll: true });
      if (mark.start !== null) field.setSelectionRange(mark.start, mark.end);
      return;
    }
    let offset = 0, start, end;
    for (const target of targets) {
      const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (!start && offset + node.length >= mark.start) start = [node, mark.start - offset, target];
        if (!end && offset + node.length >= mark.end) end = [node, mark.end - offset];
        offset += node.length;
      }
    }
    (start?.[2] || field).focus({ preventScroll: true });
    const range = document.createRange();
    if (start && end) { range.setStart(start[0], start[1]); range.setEnd(end[0], end[1]); }
    else { range.selectNodeContents(field); range.collapse(false); }
    const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
  }
  function travel(backwards) {
    pending = undefined;
    const from = backwards ? undo : redo, to = backwards ? redo : undo;
    const entry = from.pop();
    if (!entry) return;
    restoring = true;
    try {
      loadFromJSON(backwards ? entry.before : entry.after);
      paginateSheets();
      restoreFocus(backwards ? entry.focusBefore : entry.focusAfter);
      to.push(entry); entry.time = 0;
      onRestore();
    } finally { restoring = false; }
  }
  let groupedEdit = false;
  function begin(event) {
    if (groupedEdit) return;
    if (restoring || !event.target.closest?.('.a4-page')) return;
    pending = { before: serializeSheet(), focusBefore: bookmark(event.target), type: event.inputType, epoch };
  }
  function finish(event) {
    if (groupedEdit) return;
    if (!pending || restoring) return;
    const entry = pending; pending = undefined;
    if (entry.epoch !== epoch) return;
    entry.after = serializeSheet();
    if (entry.after === entry.before) return;
    entry.focusAfter = bookmark(event.target);
    entry.time = Date.now();
    const last = undo.at(-1);
    const typing = /^(insertText|deleteContentBackward|deleteContentForward)$/.test(entry.type || '');
    if (typing && last?.type === entry.type && last.focusAfter?.key === entry.focusBefore?.key && entry.time - last.time < 1000 && last.after === entry.before) {
      last.after = entry.after; last.focusAfter = entry.focusAfter; last.time = entry.time;
    } else { undo.push(entry); if (undo.length > 100) undo.shift(); }
    redo.length = 0;
  }
  document.addEventListener('beforeinput', event => {
    if (!event.target.closest?.('.a4-page')) return;
    if (event.inputType === 'historyUndo' || event.inputType === 'historyRedo') {
      event.preventDefault(); travel(event.inputType === 'historyUndo');
    } else begin(event);
  }, true);
  document.addEventListener('input', finish);
  document.addEventListener('sheet-edit-start', event => { begin(event); groupedEdit = true; });
  document.addEventListener('sheet-edit-end', event => { groupedEdit = false; finish(event); });
  document.addEventListener('keydown', event => {
    if (event.target.isContentEditable && event.shiftKey &&
      (['BracketLeft', 'BracketRight'].includes(event.code) || (event.ctrlKey && event.code === 'Digit8'))) {
      begin(event);
    }
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
    const key = event.key.toLowerCase();
    if (key !== 'z' && key !== 'y') return;
    if (!event.target.closest?.('.a4-page') && event.target !== document.body) return;
    event.preventDefault(); event.stopImmediatePropagation();
    travel(key === 'z' && !event.shiftKey);
  }, true);
  document.addEventListener('keydown', finish);
  document.addEventListener('click', event => {
    const menu = event.target.closest?.('[data-history-action]');
    if (menu) { travel(menu.dataset.historyAction === 'undo'); return; }
    if (!event.target.closest?.('.a4-page button, .a4-page .suggestion-item, .a4-page input[type="checkbox"]')) return;
    const checkbox = event.target.matches?.('input[type="checkbox"]') ? event.target : null;
    // Checkbox activation happens before click listeners, so snapshot its previous state.
    if (checkbox) checkbox.checked = !checkbox.checked;
    begin(event);
    if (checkbox) checkbox.checked = !checkbox.checked;
  }, true);
  document.addEventListener('click', finish);
  document.addEventListener('sheet-loaded', () => {
    if (!restoring) { undo.length = 0; redo.length = 0; pending = undefined; epoch++; }
  });
}
