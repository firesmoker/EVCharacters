import { renderHeader } from './components.js';

const groups = [];
const origins = new WeakMap();
let roots = [];
let busy = false;
let queued = false;
const body = box => box.querySelector('.dynamic-rows') || box.querySelector('.section-content');
const origin = node => origins.get(node) || node;

function appendJoined(target, node) {
  const last = target.lastChild;
  if (last && origin(last) === origin(node)) {
    if (last.nodeType === Node.TEXT_NODE) last.data += node.data;
    else while (node.firstChild) appendJoined(last, node.firstChild);
    node.remove();
  } else target.append(node);
}

function copy(node) {
  const clone = node.cloneNode(false);
  origins.set(clone, origin(node));
  for (const child of node.childNodes) clone.append(copy(child));
  if (node instanceof HTMLInputElement) { clone.value = node.value; clone.checked = node.checked; }
  if (node instanceof HTMLTextAreaElement) clone.value = node.value;
  return clone;
}

// Serialization reads a complete logical section without moving the live editor.
let snapshotHost;
export function clearSectionSnapshot() { snapshotHost?.remove(); snapshotHost = undefined; }
export function logicalSections() {
  clearSectionSnapshot();
  snapshotHost = document.createElement('div');
  snapshotHost.style.cssText = 'position:fixed;left:-10000px;top:0;opacity:0;pointer-events:none;width:800px';
  document.body.append(snapshotHost);
  const continuations = new Set(groups.flatMap(group => group.parts.slice(1)));
  return [...document.querySelectorAll('.section-box')].filter(box => !continuations.has(box)).map(box => {
    const group = groups.find(group => group.parts[0] === box);
    if (!group || group.parts.length === 1) return box;
    const clone = copy(box);
    const target = body(clone);
    for (const part of group.parts.slice(1)) {
      for (const node of body(part).childNodes) appendJoined(target, copy(node));
    }
    snapshotHost.append(clone);
    return clone;
  });
}

export function restoreSections() {
  for (const group of groups) {
    const target = body(group.parts[0]);
    target.style.removeProperty('max-height');
    target.style.removeProperty('overflow-y');
    for (const part of group.parts.slice(1)) {
      while (body(part).firstChild) appendJoined(target, body(part).firstChild);
      part.remove();
    }
    group.parts = [group.parts[0]];
    group.column.append(group.parts[0]);
  }
  document.querySelectorAll('.continuation-page').forEach(page => page.remove());
}

function selectionBookmark() {
  const active = document.activeElement;
  if (!active?.closest('.a4-page')) return () => {};
  if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) {
    const start = active.selectionStart, end = active.selectionEnd;
    return () => { if (active.isConnected) { active.focus({ preventScroll: true }); if (start !== null) active.setSelectionRange(start, end); } };
  }
  const selection = getSelection();
  if (!active.isContentEditable || !selection.rangeCount) return () => {};
  const range = selection.getRangeAt(0);
  const group = groups.find(g => g.parts.includes(active.closest('.section-box')));
  const isBody = group && active.classList.contains('section-content');
  const previous = isBody ? group.parts.slice(0, group.parts.indexOf(active.closest('.section-box'))).reduce((n, part) => n + body(part).textContent.length, 0) : 0;
  const before = range.cloneRange(); before.selectNodeContents(active); before.setEnd(range.startContainer, range.startOffset);
  const offset = previous + before.toString().length;
  const length = range.toString().length;
  return () => {
    const fields = isBody ? group.parts.map(body) : [active];
    let count = 0, start, end;
    for (const field of fields) {
      const walker = document.createTreeWalker(field, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (!start && count + node.length >= offset) start = [node, offset - count, field];
        if (!end && count + node.length >= offset + length) end = [node, offset + length - count];
        count += node.length;
      }
    }
    if (start && end) {
      start[2].focus({ preventScroll: true });
      const restored = document.createRange(); restored.setStart(start[0], start[1]); restored.setEnd(end[0], end[1]);
      selection.removeAllRanges(); selection.addRange(restored);
    } else if (active.isConnected) active.focus({ preventScroll: true });
  };
}

// Split oversized rich text recursively, retaining markup and its original identity.
function splitNode(node, fits) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.data;
    let low = 0, high = text.length;
    while (low < high) {
      const mid = Math.ceil((low + high) / 2); node.data = text.slice(0, mid);
      if (fits()) low = mid; else high = mid - 1;
    }
    // Prefer a word boundary so adjacent pages remain readable.
    const space = text.lastIndexOf(' ', low);
    if (space > low / 2) low = space + 1;
    node.data = text.slice(0, low);
    const tail = document.createTextNode(text.slice(low)); origins.set(tail, origin(node));
    return tail;
  }
  const tail = node.cloneNode(false); origins.set(tail, origin(node));
  while (!fits() && node.lastChild) tail.prepend(node.lastChild);
  if (tail.firstChild) {
    const crossing = tail.firstChild; node.append(crossing);
    if (!fits()) {
      if (crossing.nodeType === Node.TEXT_NODE || crossing.childNodes.length) {
        const remainder = splitNode(crossing, fits); tail.prepend(remainder);
      } else tail.prepend(crossing);
    }
  }
  return tail;
}

export function paginateSheets() {
  if (!roots.length || busy) return;
  busy = true;
  const restoreSelection = selectionBookmark();
  try {
    restoreSections();
    for (const group of groups) group.parts[0].remove();
    for (const root of roots) {
      const pages = [root];
      const columns = [...root.querySelector('.sheet-middle').children];
      const continuation = index => {
        while (pages.length <= index) {
          const page = document.createElement('div');
          page.className = `a4-page continuation-page ${root.classList.contains('character-page') ? 'character-continuation' : ''}`;
          page.innerHTML = `${renderHeader()}<main class="sheet-middle">${columns.map(() => '<section class="sheet-column"></section>').join('')}</main>`;
          page.querySelector('.sheet-middle').style.gridTemplateColumns = getComputedStyle(root.querySelector('.sheet-middle')).gridTemplateColumns;
          page.querySelector('[data-sync-id="character-name"]').textContent = document.querySelector('[data-sync-id="character-name"]').textContent;
          pages.at(-1).after(page); pages.push(page);
        }
        return pages[index];
      };
      let overflowPage = 1, overflowColumn = 0;
      columns.forEach((column, columnIndex) => {
        let index = 0, lane = columnIndex;
        const advance = () => {
          if (index === 0) { index = overflowPage; lane = overflowColumn; }
          else if (++lane === columns.length) { lane = 0; index++; }
          overflowPage = index; overflowColumn = lane;
        };
        for (const group of groups.filter(g => g.column === column)) {
          let box = group.parts[0];
          let guard = 0;
          while (box && guard++ < 200) {
            let page = continuation(index);
            let destination = page.querySelector('.sheet-middle').children[lane];
            destination.append(box);
            const fits = () => {
              for (const field of box.querySelectorAll('.instinct-description')) {
                field.style.height = 'auto'; field.style.height = `${field.scrollHeight + 2}px`;
              }
              return box.getBoundingClientRect().bottom <= page.getBoundingClientRect().bottom - 36;
            };
            if (fits()) break;
            const source = body(box);
            const canSplit = source.matches('[contenteditable="true"]') || (source.matches('.dynamic-rows') && source.parentElement === box.querySelector('.section-content'));
            // Move a complete section first if it cannot fit even one entry here.
            if (!canSplit || source.childNodes.length === 0) {
              if (destination.children.length > 1 || index === 0) { advance(); continue; }
              break;
            }
            const next = box.cloneNode(true);
            next.classList.add('section-continuation');
            const target = body(next); target.replaceChildren();
            while (!fits() && source.childNodes.length) target.prepend(source.lastChild);
            if (source.matches('[contenteditable="true"]') && target.firstChild) {
              const crossing = target.firstChild; source.append(crossing);
              if (!fits()) {
                const remainder = splitNode(crossing, fits); target.prepend(remainder);
              }
            }
            const hasContent = source.matches('.dynamic-rows') ? source.children.length : source.textContent.trim().length;
            if (!hasContent) {
              while (target.firstChild) appendJoined(source, target.firstChild);
              if (destination.children.length > 1 || index === 0) { advance(); continue; }
              // An individual oversized action remains editable within a fixed page.
              source.style.maxHeight = `${Math.max(100, page.getBoundingClientRect().bottom - source.getBoundingClientRect().top - 48)}px`;
              source.style.setProperty('overflow-y', 'auto', 'important');
              break;
            }
            if (!target.childNodes.length) break;
            group.parts.push(next); box = next; advance();
          }
        }
      });
    }
    for (const group of groups) {
      const rows = group.parts.flatMap(part => [...(part.querySelector('.dynamic-rows')?.children || [])]);
      rows.forEach((row, i) => {
        row.classList.toggle('logical-last-row', i === rows.length - 1);
        row.classList.toggle('logical-multiple-rows', rows.length > 1);
      });
    }
  } finally { restoreSelection(); busy = false; }
}

export const initSheetTools = () => {
  roots = [...document.querySelectorAll('.a4-page:not(.spell-page)')];
  for (const page of roots) for (const column of page.querySelector('.sheet-middle').children) {
    for (const box of column.children) groups.push({ column, parts: [box] });
  }
  const schedule = () => {
    if (queued || busy) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; paginateSheets(); });
  };
  for (const event of ['input', 'change', 'click', 'sheet-loaded']) document.addEventListener(event, schedule);
  const observer = new ResizeObserver(schedule);
  for (const group of groups) observer.observe(group.parts[0]);
  document.fonts.addEventListener('loadingdone', schedule);
  document.fonts.ready.then(schedule);
  window.addEventListener('beforeprint', paginateSheets);
  window.addEventListener('resize', schedule);
  paginateSheets();
};
