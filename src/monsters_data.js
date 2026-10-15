// Summoned creature profiles from the rules Sheet's monsters tab.
export const MONSTERS_DATABASE = [
  {
    "name": "Beast",
    "type": "Summoned beast",
    "hp": 3,
    "deflection": 1,
    "fortitude": 1,
    "will": 1,
    "movement": 3,
    "actions": "Available actions\nDash.\n\nAnimal Strike — Fast Action.\nRoll 3d6 against DEF. On success, deal SD damage; on failure, deal half as much, rounded down. The damage type is appropriate to the beast type.\n\nEnhanced Animal Strike — Fast Action. Requires Command\nRoll the summoner's Magic against DEF. On success, deal SD damage; on failure, deal half as much, rounded down. The damage type is appropriate to the beast type. The next attack against the target has advantage",
    "size": "Large or smaller"
  },
  {
    "name": "Shade",
    "type": "Undead summon",
    "hp": 1,
    "deflection": 1,
    "fortitude": 1,
    "will": 1,
    "movement": 5,
    "actions": "Traits\nIgnores difficult terrain. Immune to Slashing, Piercing and Crushing damage.\n\nAvailable actions\nDash.\n\nShadow Claw — Melee Strike variant; Fast Action; requires the summoner's Command Instinct.\nRoll the summoner's Magic +6 against Deflection.\n\nShadow Burst — Slow Action; costs 2 of the summoner's Spell Points; requires summoner level 3 or higher and the summoner's Command Instinct.\nThe Shade explodes into shadow and destroys itself. Roll the summoner's Magic against each creature's Deflection within 1 unit of the Shade. On success, deal 4 Necrotic damage; on failure, deal half as much, rounded down."
  },
  {
    "name": "Spirit",
    "type": "Summoned spirit",
    "hp": 3,
    "deflection": 2,
    "fortitude": 1,
    "will": 1,
    "movement": 8,
    "actions": "Traits\nFlying. Immune to all damage except Force or Psychic. Immune to healing.\n\nAvailable actions\nDash.\nHinder (costs 1 HP): Annoy an adjacent creature to create an opening. Choose an ally; it gains advantage on one attack against that creature this round.\nHeal: Heal an adjacent creature. Pay 1 HP for each HP restored.",
    "size": "Tiny"
  }
];
