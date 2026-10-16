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
    "size": "Large or smaller",
    "traits": [],
    "actions": [
      {
        "name": "Dash",
        "speed": "Fast Action"
      },
      {
        "name": "Animal Strike",
        "speed": "Fast Action",
        "description": "Roll 3d6 against DEF. On success, deal SD damage; on failure, deal half as much, rounded down. The damage type is appropriate to the beast type."
      },
      {
        "name": "Enhanced Animal Strike",
        "speed": "Fast Action",
        "detail": "Requires Command",
        "description": "Roll the summoner's Magic against DEF. On success, deal SD damage; on failure, deal half as much, rounded down. The damage type is appropriate to the beast type. The next attack against the target has advantage."
      }
    ]
  },
  {
    "name": "Shade",
    "type": "Shadow demon",
    "hp": 1,
    "deflection": 1,
    "fortitude": 1,
    "will": 1,
    "movement": 5,
    "traits": [
      {
        "name": "Terrain",
        "description": "Ignores difficult terrain."
      },
      {
        "name": "Damage Immunity",
        "description": "Slashing, Piercing and Crushing."
      }
    ],
    "actions": [
      {
        "name": "Dash",
        "speed": "Fast Action"
      },
      {
        "name": "Shadow Claw",
        "speed": "Fast Action",
        "detail": "Melee Strike variant · Requires Command",
        "description": "Roll the summoner's Magic +6 against Deflection."
      },
      {
        "name": "Shadow Burst",
        "speed": "Slow Action",
        "detail": "2 Spell Points · Level 3+ · Requires Command",
        "description": "The Shade explodes into shadow and destroys itself. Roll the summoner's Magic against each creature's Deflection within 1 unit of the Shade. On success, deal 4 Necrotic damage; on failure, deal half as much, rounded down. The summoner pays the Spell Point cost."
      }
    ]
  },
  {
    "name": "Spirit",
    "type": "Summoned spirit",
    "hp": 3,
    "deflection": 2,
    "fortitude": 1,
    "will": 1,
    "movement": 8,
    "size": "Tiny",
    "traits": [
      {
        "name": "Flying"
      },
      {
        "name": "Damage Immunity",
        "description": "All damage except Force or Psychic."
      },
      {
        "name": "Healing Immunity",
        "description": "Cannot be healed."
      }
    ],
    "actions": [
      {
        "name": "Dash",
        "speed": "Fast Action"
      },
      {
        "name": "Hinder",
        "speed": "Fast Action",
        "detail": "Costs 1 HP",
        "description": "Annoy an adjacent creature to create an opening. Choose an ally; it gains advantage on one attack against that creature this round."
      },
      {
        "name": "Heal",
        "speed": "Fast Action",
        "description": "Heal an adjacent creature. Pay 1 HP for each HP restored."
      }
    ]
  }
];
