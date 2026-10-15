let roots = [];
let busy = false;
let queued = false;

// Fitting is visual only: saved rich text retains its original formatting.
export function logicalSections() { return [...document.querySelectorAll('.section-box')]; }
export function clearSectionSnapshot() {}
export function restoreSections() {
  document.querySelectorAll('[data-auto-fit]').forEach(column => {
    column.removeAttribute('data-auto-fit');
    column.style.removeProperty('--fit-scale');
  });
}

export function paginateSheets() {
  if (!roots.length || busy) return;
  busy = true;
  try {
    for (const page of roots) {
      const bottom = page.getBoundingClientRect().bottom - 36;
      for (const column of page.querySelector('.sheet-middle').children) {
        column.removeAttribute('data-auto-fit');
        column.style.removeProperty('--fit-scale');
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
  } finally { busy = false; }
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
