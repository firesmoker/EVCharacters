export const SPELLS_DATABASE = [
  {
    name: "Arcane Bolt",
    level: 1,
    actionSpeed: "Fast Action",
    spellType: "Arcane",
    range: "12 units",
    area: "Single Target",
    description: "A bolt of pure magical energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes 1d10 force damage.",
    cost: "1 SP"
  },
  {
    name: "Healing Light",
    level: 1,
    actionSpeed: "Slow Action",
    spellType: "Divine",
    range: "6 units",
    area: "Single Target",
    description: "A surge of holy light washes over a creature you can see within range. The target regains Health Points equal to 1d8 + your spellcasting modifier.",
    cost: "2 SP"
  },
  {
    name: "Fireball",
    level: 3,
    actionSpeed: "Slow Action",
    spellType: "Arcane",
    range: "20 units",
    area: "6-unit radius sphere",
    description: "A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame. Each creature in a 6-unit radius sphere centered on that point must make a Fortitude save. A target takes 8d6 fire damage on a failed save, or half as much damage on a successful one.",
    cost: "5 SP"
  }
];
