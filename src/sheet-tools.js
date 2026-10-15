// Keep long character pages printable without clipping their content.
export const initSheetTools = () => {
  const observer = new ResizeObserver(() => {
    for (const page of document.querySelectorAll('.a4-page:not(.spell-page)')) {
      page.dataset.overflow = String(page.getBoundingClientRect().height > 1125);
    }
  });
  document.querySelectorAll('.a4-page:not(.spell-page)').forEach(page => observer.observe(page));
};
