export const DEFAULT_ACCENT = '#91703e';
export const ACCENT_THEMES = [
  ['brown', 'Antique Brass', '#91703e'], ['navy', 'Midnight Navy', '#23395d'],
  ['black', 'Obsidian', '#303238'], ['red', 'Crimson', '#8B0000'],
  ['green', 'Deep Forest', '#285943'], ['purple', 'Royal Amethyst', '#65417d'],
  ['copper', 'Burnished Copper', '#a65d3d'], ['amber', 'Golden Amber', '#a87923'],
  ['olive', 'Ancient Olive', '#657039'], ['sage', 'Silver Sage', '#617b6a'],
  ['emerald', 'Emerald', '#197359'], ['jade', 'Jade', '#348577'],
  ['teal', 'Deep Teal', '#236b73'], ['ocean', 'Ocean Blue', '#286c93'],
  ['sapphire', 'Sapphire', '#34569b'], ['slate', 'Storm Slate', '#566c82'],
  ['indigo', 'Twilight Indigo', '#514a88'], ['iris', 'Iris', '#78639e'],
  ['plum', 'Velvet Plum', '#754667'], ['rose', 'Dusty Rose', '#a05e70'],
  ['wine', 'Mulled Wine', '#743747'], ['terracotta', 'Terracotta', '#ac634f'],
  ['umber', 'Warm Umber', '#705442'], ['graphite', 'Graphite', '#60656b'],
];

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
