const icons = {
  Magic: 'magic', Melee: 'swords', Ranged: 'bow', 'Weapon Throw': 'dagger',
  Unarmed: 'fist', Grapple: 'grapple', Arcana: 'arcana', Nature: 'leaf',
  Athletics: 'runner', Acrobatics: 'acrobat', Sneak: 'sneak', Disguise: 'mask',
  Mechanics: 'tools', Medicine: 'medicine', Cooking: 'flame',
  Performance: 'music', 'Sleight of Hand': 'hand', 'Animal Handling': 'paw', Survival: 'compass',
  Bartering: 'coins', Charm: 'heart', Deception: 'serpent', Diplomacy: 'dove',
  Intimidation: 'skull', Leadership: 'banner', Manipulation: 'puppet', Reasoning: 'scales',
  History: 'scroll', Occult: 'moon', Politics: 'crown', Religion: 'sun', Warfare: 'helmet',
  'Notice Movement': 'movement', 'Find Hidden Paths': 'path',
  'Find Hidden Objects': 'search', 'Detect Traps': 'trap', Deduction: 'puzzle', Insight: 'eye'
};

export const updateSkillIcon = row => {
  const icon = row?.querySelector('.skill-icon use');
  if (!icon) return;
  const name = row.querySelector('.skill-name')?.value.trim() || '';
  const canonical = Object.keys(icons).find(key => key.toLowerCase() === name.toLowerCase());
  icon.setAttribute('href', `/icons/skills.svg#${icons[canonical] || 'skill'}`);
};
