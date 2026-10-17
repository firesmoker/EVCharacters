export function compareSpellRows(left, right) {
  const rank = value => /^(cantrip|cntrp|0)$/i.test(value.trim()) ? 0 : /^\d+$/.test(value.trim()) ? Number(value) : Infinity;
  const leftName = left[1].trim(), rightName = right[1].trim();
  return Number(!leftName) - Number(!rightName)
    || rank(left[0]) - rank(right[0])
    || leftName.localeCompare(rightName, undefined, { sensitivity: 'base', numeric: true });
}
