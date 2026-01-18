import { SPELLS_DATABASE } from './spells_data.js';

/**
 * Metadata and Helper Lists
 */
export const SKILLS_LIST = [
  { groupLabel: "Speech", options: ["Bartering", "Charm", "Deception", "Diplomacy", "Intimidation", "Leadership", "Manipulation", "Reasoning"] },
  { groupLabel: "Knowledge", options: ["Arcana", "History", "Nature", "Occult", "Politics", "Religion", "Warfare"] },
  { groupLabel: "Perception", options: ["Notice Movement", "Find Hidden Paths", "Find Hidden Objects", "Detect Traps"] },
  { groupLabel: "Other", options: ["Acrobatics", "Animal Handling", "Athletics", "Cooking", "Deduction", "Disguise", "Insight", "Mechanics", "Medicine", "Performance", "Sleight of Hand", "Sneak", "Survival"] }
];

export const COMBAT_SKILLS_LIST = [
  { groupLabel: "Weapons", options: ["Melee Strike", "Ranged Strike", "Weapon Throw"] },
  { groupLabel: "Magic", options: ["Arcane Magic", "Bardic Magic", "Divine Magic", "Nature Magic", "Occult Magic"] },
  { groupLabel: "Unarmed", options: ["Unarmed Strike", "Grapple"] }
];

export const BONUS_LIST = [
  { groupLabel: "Training", options: ["Trained (+5)", "Expert (+10)", "Master (+15)", "Legend (+20)"] }
];

export const DRAGS_IGNORED_LIST = [
  { groupLabel: "Common Drag Sources", options: ["Two-Handed Weapons", "Ranged Weapons", "Aiming for Weak Spots", "Reach Weapons", "Heavy Weapons"] }
];

// Dynamically generate SPELLS_LIST from SPELLS_DATABASE
const spellsByType = SPELLS_DATABASE.reduce((acc, spell) => {
  // Split by " / " to handle multiple types
  const types = spell.spellType.split('/').map(t => t.trim());
  types.forEach(type => {
    if (!acc[type]) acc[type] = [];
    if (!acc[type].includes(spell.name)) {
      acc[type].push(spell.name);
    }
  });
  return acc;
}, {});

export const SPELLS_LIST = Object.entries(spellsByType).map(([groupLabel, options]) => ({
  groupLabel,
  options: options.sort()
}));
