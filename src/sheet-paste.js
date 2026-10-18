// Keep semantic formatting, but let the destination field supply typography.
export function pasteMarkup(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  doc.querySelectorAll('script, style, meta, link, iframe, object').forEach(el => el.remove());
  const allowed = new Set(['P', 'DIV', 'BR', 'UL', 'OL', 'LI', 'B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'SUB', 'SUP']);
  for (const el of [...doc.body.querySelectorAll('*')].reverse()) {
    const emphasis = [];
    if (el.style.fontWeight === 'bold' || Number(el.style.fontWeight) >= 600) emphasis.push('strong');
    if (el.style.fontStyle === 'italic') emphasis.push('em');
    if (el.style.textDecorationLine.includes('underline')) emphasis.push('u');
    for (const tag of emphasis) {
      const wrapper = doc.createElement(tag);
      wrapper.append(...el.childNodes);
      el.append(wrapper);
    }
    for (const attr of [...el.attributes]) el.removeAttribute(attr.name);
    if (!allowed.has(el.tagName)) el.replaceWith(...el.childNodes);
  }
  return doc.body.innerHTML;
}

export function richTextHTML(value) {
  const text = String(value ?? '');
  const root = document.createElement('div');
  if (/<\/?(?:p|div|br|ul|ol|li|b|strong|i|em|u|s|strike|sub|sup)\b/i.test(text)) root.innerHTML = pasteMarkup(text);
  else {
    for (const line of text.split(/\n+/).filter(line => line.trim())) {
      const paragraph = document.createElement('p');
      paragraph.textContent = line;
      root.append(paragraph);
    }
  }
  for (const parent of [root, ...root.querySelectorAll('div')]) {
    let list;
    for (const child of [...parent.children]) {
      const marker = /^(?:P|DIV)$/.test(child.tagName) && !child.querySelector('p, div, ul, ol')
        && child.textContent.match(/^[ \t]*(?:[•●▪◦]|[-*])[ \t]+/);
      if (!marker) { list = null; continue; }
      if (!list) { list = document.createElement('ul'); child.before(list); }
      const prefix = document.createRange();
      prefix.setStart(child, 0);
      const walker = document.createTreeWalker(child, NodeFilter.SHOW_TEXT);
      let remaining = marker[0].length, node;
      while ((node = walker.nextNode())) {
        if (node.length >= remaining) { prefix.setEnd(node, remaining); break; }
        remaining -= node.length;
      }
      prefix.deleteContents();
      const item = document.createElement('li');
      item.append(...child.childNodes); list.append(item); child.remove();
    }
  }
  return root.innerHTML;
}

export function initSheetPaste() {
  document.querySelector('#app').addEventListener('paste', event => {
    const field = event.target.closest('[contenteditable="true"]');
    if (!field?.closest('.a4-page') || !event.clipboardData) return;
    event.preventDefault();
    field.dispatchEvent(new CustomEvent('sheet-edit-start', { bubbles: true }));
    try {
      const html = event.clipboardData.getData('text/html');
      if (html) document.execCommand('insertHTML', false, pasteMarkup(html));
      else document.execCommand('insertText', false, event.clipboardData.getData('text/plain'));
    } finally {
      field.dispatchEvent(new CustomEvent('sheet-edit-end', { bubbles: true }));
    }
  });
}
