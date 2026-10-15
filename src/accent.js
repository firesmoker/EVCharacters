export const DEFAULT_ACCENT = '#91703e';

export function applyAccent(color = DEFAULT_ACCENT) {
  if (!/^#[0-9a-f]{6}$/i.test(color)) color = DEFAULT_ACCENT;
  const root = document.documentElement;
  root.style.setProperty('--accent', color);
  root.style.removeProperty('--field-color');
  const [r, g, b] = color.slice(1).match(/../g).map(value => parseInt(value, 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
  const hue = delta === 0 ? 0 : 60 * (max === r ? ((g - b) / delta + 6) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4);
  root.style.setProperty('--ornament-filter', color.toLowerCase() === DEFAULT_ACCENT ? 'none' : delta === 0 ? 'grayscale(1)' : `sepia(1) hue-rotate(${hue - 38}deg) saturate(1.4)`);
}
