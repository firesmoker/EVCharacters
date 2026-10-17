import { isFixedSize, fixedSections, compactSections } from './section-format.js';
import { renderSpellRow } from './components.js';
let roots = [];
let busy = false;
let queued = false;

// Fitting is visual only: saved rich text retains its original formatting.
export function logicalSections() { return [...document.querySelectorAll('.section-box')]; }
export function clearSectionSnapshot() {}
export function restoreSections() {
  const actions = document.querySelector('.actions-page:not([data-action-continuation]) .dynamic-rows');
  document.querySelectorAll('[data-action-continuation]').forEach(page => {
    if (actions) actions.append(...page.querySelector('.dynamic-rows').children);
    page.remove();
  });
  document.querySelectorAll('[data-auto-fit]').forEach(column => {
    column.removeAttribute('data-auto-fit');
    column.style.removeProperty('--fit-scale');
  });
}

function paginateActions() {
  if (!isFixedSize()) { restoreSections(); return; }
  const first = document.querySelector('.actions-page:not([data-action-continuation])');
  if (!first) return;
  const pages = [first, ...document.querySelectorAll('[data-action-continuation]')];
  const rows = pages.flatMap(page => [...page.querySelector('.dynamic-rows').children]);
  const count = Math.max(1, Math.ceil(rows.length / 4));
  while (pages.length < count) {
    const page = first.cloneNode(true);
    page.setAttribute('data-action-continuation', '');
    page.querySelector('.sheet-column').replaceChildren();
    page.querySelector('.dynamic-rows').replaceChildren();
    pages.at(-1).after(page);
    pages.push(page);
  }
  rows.forEach((row, index) => {
    const list = pages[Math.floor(index / 4)].querySelector('.dynamic-rows');
    if (row.parentElement !== list) list.append(row);
  });
  pages.slice(count).forEach(page => page.remove());
}

export function paginateSheets() {
  if (!roots.length || busy) return;
  busy = true;
  // Floating controls must not count toward printable content height.
  document.documentElement.setAttribute('data-measuring-sheet', '');
  try {
    paginateActions();
    for (const page of document.querySelectorAll('.a4-page:not(.spell-page)')) {
      const bottom = page.getBoundingClientRect().bottom - 36;
      for (const column of page.querySelector('.sheet-middle').children) {
        column.querySelectorAll('[data-auto-fit]').forEach(el => { el.removeAttribute('data-auto-fit'); el.style.removeProperty('--fit-scale'); });
        for (const box of column.children) box.style.removeProperty('height');
        column.removeAttribute('data-auto-fit');
        column.style.removeProperty('--fit-scale');
        if (isFixedSize()) {
          const boxes = [...column.children];
          const titles = boxes.map(box => box.querySelector('.section-header')?.textContent.trim());
          const weights = titles.map(title => compactSections[title] ? 0 : fixedSections[title] || 1);
          const total = weights.reduce((a, b) => a + b, 0);
          const available = bottom - column.getBoundingClientRect().top - parseFloat(getComputedStyle(column).gap || 0) * (boxes.length - 1);
          const reserved = titles.reduce((sum, title) => sum + (compactSections[title] || 0), 0);
          boxes.forEach((box, index) => {
            box.style.height = `${compactSections[titles[index]] || (available - reserved) * weights[index] / total}px`;
            box.setAttribute('data-auto-fit', '');
            const fits = () => box.scrollHeight <= box.clientHeight + 1 && [...box.querySelectorAll('.section-content')].every(content => content.scrollHeight <= content.clientHeight + 1);
            box.style.setProperty('--fit-scale', 1);
            if (titles[index] === 'Spells Known') {
              const list = box.querySelector('.dynamic-rows');
              const content = box.querySelector('.section-content');
              const capacity = Math.max(1, Math.floor((content.getBoundingClientRect().bottom - parseFloat(getComputedStyle(content).paddingBottom) - list.getBoundingClientRect().top) / 27));
              while (list.children.length > capacity && ![...list.lastElementChild.querySelectorAll('input')].some(input => input.value.trim())) list.lastElementChild.remove();
              while (list.children.length < capacity) list.insertAdjacentHTML('beforeend', renderSpellRow());
            }
            if (!fits()) {
              let low = .001, high = 1;
              for (let i = 0; i < 12; i++) {
                const mid = (low + high) / 2;
                box.style.setProperty('--fit-scale', mid);
                if (fits()) low = mid; else high = mid;
              }
              box.style.setProperty('--fit-scale', low);
            }
          });
          continue;
        }
        const fits = () => [...column.children].every(box => box.getBoundingClientRect().bottom <= bottom);
        if (!fits()) {
          column.setAttribute('data-auto-fit', '');
          const apply = scale => column.style.setProperty('--fit-scale', scale);
          // Find the largest font scale that fits, without moving or splitting editor nodes.
          let low = 0.001, high = 1;
          for (let i = 0; i < 12; i++) {
            const mid = (low + high) / 2;
            apply(mid);
            if (fits()) low = mid; else high = mid;
          }
          apply(low);
        }
      }
    }
    document.querySelectorAll('.dynamic-rows').forEach(container => {
      [...container.children].forEach((row, index) => {
        row.classList.toggle('logical-last-row', index === container.children.length - 1);
        row.classList.toggle('logical-multiple-rows', container.children.length > 1);
      });
    });
  } finally {
    document.documentElement.removeAttribute('data-measuring-sheet');
    busy = false;
  }
}

export const initSheetTools = () => {
  roots = [...document.querySelectorAll('.a4-page:not(.spell-page)')];
  const schedule = () => {
    if (queued || busy) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; paginateSheets(); });
  };
  for (const event of ['input', 'change', 'click', 'sheet-loaded']) document.addEventListener(event, schedule);
  const observer = new ResizeObserver(schedule);
  for (const page of roots) observer.observe(page.querySelector('.sheet-middle'));
  document.fonts.addEventListener('loadingdone', schedule);
  document.fonts.ready.then(schedule);
  window.addEventListener('beforeprint', paginateSheets);
  window.addEventListener('resize', schedule);
  paginateSheets();
};
