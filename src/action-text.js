import EXTRACTED_ACTIONS from './action-extraction.json';
import ACTIONS from './creation-actions.json';

export function cleanActionText(text, represented = new Set()) {
  for (const action of EXTRACTED_ACTIONS) {
    const reference = `You gain the ${action.name} ${action.clean.split('\n')[0].includes('Variant') ? 'variant' : 'action'}.`;
    const replacement = represented.has(action.name) ? reference : action.clean;
    const flat = action.raw.replace(/\n/g, '');
    for (const old of [`fa${flat}0`, `fa${flat}`, `fa${action.raw}`, action.raw, flat, action.clean]) text = text.split(old).join(replacement);
    text = text.replace(`You gain the following action:\n${reference}`, reference);
  }
  for (const action of ACTIONS) {
    if (!represented.has(action.name)) continue;
    const reference = `See ${action.name} in your actions.`;
    text = text.split(action.description).join(reference);
    const lines = text.split('\n');
    text = lines.filter((line, i) => !(lines[i + 1] === reference && /^(?:(?:Fast|Average|Slow) Action|.*?Variant\s*\/)/.test(line))).join('\n');
  }
  return text;
}

export function representedActions(rows = []) {
  const result = new Set(rows.map(row => row.slots?.name).filter(Boolean));
  for (const row of rows) for (const variant of row.variants || []) {
    const el = document.createElement('div'); el.innerHTML = variant;
    const title = el.querySelector('strong, b')?.textContent.replace(/:\s*$/, '').replace(/\s*\(.*$/, '').trim();
    if (title) result.add(title);
  }
  return result;
}
