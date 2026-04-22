export const SPELLS_DATABASE = [
  {
    name: "Animal Messenger",
    level: "1",
    actionSpeed: "1 minute",
    spellType: "Bardic / Nature",
    range: "15 units",
    area: "Single Target",
    duration: "24 hours",
    description: `Choose a tiny beast you can see within range. Roll Magic against Will. The threshold is 1. On success, it attempts to deliver a message for you. You automatically fail if the creature is openly hostile towards you.
You specify a location you have visited and a recipient who matches a general description, such as "a person dressed in the uniform of the town guard" or "a red-haired dwarf wearing a pointed hat." You also communicate a message of up to twenty-five words. The Beast travels for the duration toward the specified location, covering about 25 miles per 24 hours or 50 miles if the Beast can fly.
When the Beast arrives, it delivers your message to the creature that you described, mimicking your communication. If the Beast doesn't reach its destination before the spell ends, the message is lost, and the Beast returns to where you cast the spell.
Empowered Spell: The spell's duration increases by 48 hours for each two additional spell points spent.`,
    cost: "1"
  },
  {
    name: "Arcane Shield",
    level: "1",
    actionSpeed: "Fast Action",
    spellType: "Arcane",
    range: "Self",
    area: "Self",
    duration: "End of next round",
    description: `You get +2 Deflection for the duration. You are also immune to one Magic Missile.
Successfully casting a cantrip, casting a spell, or performing any kind of strike ends this spell.

You may pay additional Spell Points to cast the spell, raising the number of Magic Missiles you are immune to by one for each additional point you pay.`,
    cost: "1+"
  },
  {
    name: "Bestow Curse",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Occult",
    range: "10 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Roll Magic against Will. Choose a number of the following equal to the number of Success Dice:

- They become disoriented (-1 penalty on all rolls) until the end of the next 2 rounds.
- They become slowed (+1 Drag to all actions, -1 Movement) until the end of the next 2 rounds.
- They become vulnerable (-1 to all defenses) until the end of the next 2 rounds.
- They become discouraged (they deal -1 damage) until the end of the next 2 rounds.

On success, if you roll a double 6, choose an additional mode.`,
    cost: "1+"
  },
  {
    name: "Blessed Weapon",
    level: "1",
    actionSpeed: "Fast Action",
    spellType: "Divine",
    range: "15 units",
    area: "Single Target",
    duration: "10 minutes",
    description: `Choose a creature within range. Their weapon is imbued with radiant energy. If you are a cleric, you can instead choose the energy to be the associated element of your domain.
For the duration, they deal +2 damage of the chosen energy type with strikes using that weapon.
Empower Spell: For each additional spell point spent, choose one more creature.`,
    cost: "1"
  },
  {
    name: "Burning Ground",
    level: "3",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Arcane",
    range: "10 units",
    area: "Single Target",
    duration: "until end of combat",
    description: `Set an area of 4 units cube on magical fire for the duration. When the area first enters the space of a creature, and whenever a creature enters the area or starts their turn there, they get Burning 1 until the end of the round.`,
    cost: "3"
  },
  {
    name: "Burning Hands",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Arcane",
    range: "3 units burst",
    area: "3 units burst",
    duration: "Instantaneous",
    description: `You unleash a wide flame from your hands. Roll Magic against Deflection for creatures in the area. The threshold is 1. Those you succeed against receive 2 fire damage. The rest receive 1 fire damage.

You may spend additional Spell Points when you cast this spell. For every 2 additional Spell Points spent, you deal +1 damage.`,
    cost: "1"
  },
  {
    name: "Burrowed Knowledge",
    level: "3",
    actionSpeed: "Fast Action",
    spellType: "Bardic / Divine / Occult",
    range: "8 units",
    area: "Single Target",
    duration: "1 hour",
    description: `Choose a creature within range. It becomes Expert (5d6) in a standard skill of your choice for the duration.
Empower Spell: you can increase the duration of this spell to a full day by spending 2 additional SP.`,
    cost: "2 SP"
  },
  {
    name: "Comprehend Languages",
    level: "3",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Arcane / Bardic / Divine / Occult",
    range: "6 units",
    area: "Single Target",
    duration: "1 hour",
    description: `Choose a willing creature within range. For the duration, it can understand any written and spoken language. This spell doesn't provide the ability to speak or write in unknown languages.`,
    cost: "2 SP"
  },
  {
    name: "Cure",
    level: "1",
    actionSpeed: "Fast Action",
    spellType: "Divine / Nature / Bardic",
    range: "10 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Choose a target within range. Heal them for 1 HP. If the target is dying, it becomes stabilized. If you cast it using Divine Magic, heal them for 1 additional HP.

You may spend additional Spell Points as you cast this spell. For each additional Spell Point you heal them for 1 more HP.
You may also choose to cast the spell as a slow, interruptible action. If you do, heal up to two targets instead.`,
    cost: "1+"
  },
  {
    name: "Dissonant Whispers",
    level: "1",
    actionSpeed: "Average Action",
    spellType: "Occult / Bardic",
    range: "8 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Roll Magic against Will.
You channel psychic disturbance into the mind of a creature you can see within range.

On success, the target takes SD + 1 Psychic damage.
It also becomes disoriented (-1 penalty on all rolls) until the end of the next round and receives

On success, if you roll a double six, the target is also frightened until the end of the next round. (They cannot choose you as a target for their attacks. They also cannot finish their movement on a unit that is adjacent to you.)`,
    cost: "1"
  },
  {
    name: "Divine Guidance",
    level: "Cantrip",
    actionSpeed: "Average Action",
    spellType: "Divine",
    range: "Touch",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Choose a target within range. They gain advantage on rolls of: Religion, Speech skills in conversations with religious context, Insight, Medicine, Perception rolls against demons and undead.
The spell ends when you are unconscious, when you cast this spell again, or when you dismiss it.`,
    cost: "0"
  },
  {
    name: "Divine Interference",
    level: "1",
    actionSpeed: "Fast Action",
    spellType: "Divine",
    range: "15 units",
    area: "Single Target",
    duration: "End of current round",
    description: `Choose a target within range. They get +1 Deflection until the end of the current round.`,
    cost: "1"
  },
  {
    name: "Eldritch Shield",
    level: "1",
    actionSpeed: "Fast Action",
    spellType: "Occult",
    range: "Self",
    area: "Self",
    duration: "End of next round",
    description: `Get +1 Deflection. If you are hit by an attack against your Deflection, the enemy that dealt the damage loses 1 HP.
Successfully casting a spell or cantrip while under the effect of this spell ends this spell.`,
    cost: "1"
  },
  {
    name: "Elemental Flare",
    level: "Cantrip",
    actionSpeed: "Average Action",
    spellType: "Arcane",
    range: "12 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Shoot an elemental flare at a creature in range. Choose its damage type: lightning, fire or ice. Roll Magic against Deflection. On success, deal SD + 1 damage of the chosen type.

On success, if you roll a double six, depending on the damage type, the target also:
- Fire: becomes burning 1 until the end of the round (receive 1 fire damage at the end of the round)
- Lightning: they become disoriented 1 (-1 to all rolls) until the end of the next round
- Ice: they become chilled 2 (-2 Movement) until the end of the next round`,
    cost: "0"
  },
  {
    name: "Elemental Pulse",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Arcane",
    range: "10 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Choose an ally within range or yourself. Choose damage type: fire, ice, or lightning. A pulse of the chosen elemental energy bursts from the chosen target in a 2-unit radius. Roll Magic against Deflection for all creatures within the radius (other than the chosen target). The threshold is 2. Those that you've succeed against take 2 damage; the rest take half the amount of damage.
The spell deals 1 less damage if the chosen ally is not yourself.
You may spend additional Spell Points when you cast this spell. For every 2 additional Spell Points spent, you deal +1 damage`,
    cost: "1"
  },
  {
    name: "Elemental Weapon",
    level: "1",
    actionSpeed: "Fast Action",
    spellType: "Arcane",
    range: "15 units",
    area: "Single Target",
    duration: "10 minutes",
    description: `Choose a creature within range. Their weapon is imbued with an element of your choice: fire, lightning, or ice. 
For the duration, they deal +2 damage of the chosen type with strikes using that weapon.
Empower Spell: For each additional spell point spent, choose one more creature.`,
    cost: "1"
  },
  {
    name: "Entangle",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Nature",
    range: "15 units",
    area: "Single Target",
    duration: "10 minutes",
    description: `Vines erupt from the ground, twisting around all who stand in the area. Roll Nature Magic against Deflection for each enemy in the area. The threshold is 1. Each enemy that you've succeeded against becomes restrained (they can't move from their place).
The affected area is considered difficult terrain for all creatures.
At the beginning phase of each round each affected enemy rolls Acrobatics or Athletics. When they get a total of 3 Success Dice in one roll or more, they break free of the restrained effect.`,
    cost: "1"
  },
  {
    name: "Glacial Spike",
    level: "3",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Arcane",
    range: "10 units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `A large spike of ice bursts from the ground, piercing through a creature you can see within range.
Roll Magic against Deflection.
On success, deal SD + 6 ice or piercing damage.
If you roll a double 6: the creature is slowed 1 (-1 movement, 1 Drag for all actions) until the end of the next round.
Empower Spell: Deal +2 damage for each extra spell point you spent.`,
    cost: "3"
  },
  {
    name: "Goodberry",
    level: "1",
    actionSpeed: "Special Action",
    spellType: "Nature",
    range: "Self",
    area: "Self",
    duration: "Instantaneous",
    description: `Spend a minute to create three Goodberry fruits. Each fruit can be consumed to heal 1 HP. It also provides enough nutrition for an entire day. Consuming a Goodberry takes one minute (therefore it cannot be consumed in combat). The fruits last only for a day, after which they spoil.`,
    cost: "1"
  },
  {
    name: "Guardian Tree",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Nature",
    range: "10 Units",
    area: "1 unit square",
    duration: "1 day",
    description: `You cause a large tree to sprout from the ground at a target location. The tree trunk occupies 1 unit. When allies (including you) that are adjacent to the tree are attacked by an attack against deflection, the tree becomes the target instead.
The tree has 0 Deflection and 7 HP. It has weakness to fire damage (takes double damage from fire).
You may spend additional Spell Points when you cast the spell. For each 1 additional point spent, the tree has 3 more HP`,
    cost: "1+"
  },
  {
    name: "Gullibility",
    level: "1",
    actionSpeed: "Fast Action",
    spellType: "Bardic / Occult",
    range: "5 Units",
    area: "Single Target",
    duration: "5 minutes",
    description: `Choose a target creature within range that you can see and that can see your face. Roll Magic against Will. The threshold is 2. If you succeed, any Speech skill or Performance roll against the creature made by you or your allies have advantage.
The target is not aware of the magical effect, even if you failed on the roll.
They feel unexplained discomfort if the spell was cast using Occult magic, regardless of success.`,
    cost: "1"
  },
  {
    name: "Healing Touch",
    level: "1",
    actionSpeed: "Fast Action",
    spellType: "Divine / Nature",
    range: "Touch",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Heal a target for 2 HP, or 3 HP if cast with Divine magic.
Outside of combat, heal the target to its maximum HP.
If the target is dying, it becomes stabilized.
You may spend additional Spell Points when you cast this spell. You heal 2 additional HP for each of those Spell Points.`,
    cost: "1"
  },
  {
    name: "Heavenly Strike",
    level: "3",
    actionSpeed: "Fast Action",
    spellType: "Divine",
    range: "6 units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Choose a creature within range. When they first perform a Strike of any kind this round, they are empowered by divine energy. They deal +4 radiant damage with that strike. They also get advantage on that strike.`,
    cost: "2"
  },
  {
    name: "Hellfire",
    level: "3",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Arcane",
    range: "10 units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Engulf a creature you can see within range in dark flames. Roll Magic against Deflection. The threshold is 1.
On success, apply Burning 4 for three turns. On failure: apply half of the Burning for three turns.
Empower Spell: for each additional spell point spent, increase Burning by 1.`,
    cost: "3"
  },
  {
    name: "Hex",
    level: "1",
    actionSpeed: "Fast Action",
    spellType: "Occult",
    range: "10 Units",
    area: "Single Target",
    duration: "end of the next round",
    description: `Choose a target you can see within range. Until the end of the duration, each time the target receives damage from any Strike or Spell Attack, they also lose 1 life.`,
    cost: "1"
  },
  {
    name: "Ice Knife",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Arcane",
    range: "10 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Roll Magic against Deflection. Launch a large ice shard on an enemy within range that you can see.
On success, deal SD + 2 ice or piercing damage.

The shard shatters on impact (whether you succeed or not), sending small ice shards to each enemy within 2 units of the target. Use the same roll against their deflection. Enemies you succeed against take 1 ice damage.
You may spend additional Spell Points when you cast this spell. For every additional Spell Point spent, you deal +1 damage to the main target.`,
    cost: "1+"
  },
  {
    name: "Ice Prison",
    level: "3",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Arcane",
    range: "10 units",
    area: "Single Target",
    duration: "until end of combat",
    description: `Choose a creature within range that is up to one size larger than you.
Roll Magic against Deflection. The threshold is 1. On success, you trap the creature inside a thin but strong ice prison. The prison has 9 HP and Vulnerability to fire.
The enemy can act as normal inside, but within standard limits.
Empower Spell: for each extra SP, the prison has +3 HP.`,
    cost: "3"
  },
  {
    name: "Ice Scythe",
    level: "3",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Arcane",
    range: "2",
    area: "Single Target",
    duration: "10 minutes",
    description: `You create a large scythe made of ice in your hands for the duration. The scythe is a two-handed weapon with reach. You may perform Melee Strikes with it for the duration, using either Magic or Melee Strike for the roll. When you cast this spell, you may immediately perform a Melee Strike with it.
The scythe has +4 damage bonus, and deals piercing or ice damage. Its double 6 effect: Slowed 1 until the end of the next turn.
Empower Spell: The scythe damage bonus increases by 1 for each 2 additional spell points spent.`,
    cost: "3"
  },
  {
    name: "Icy Ground",
    level: "3",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Arcane",
    range: "10 units",
    area: "Single Target",
    duration: "1 hour",
    description: `Cover an area of 4 units cube with extremely slippery icy ground. Creatures in the area roll Acrobatics when entering the area and when it enters their space. Threshold is 3.
On failure, they are knocked prone and lose the rest of their movement. The area is difficult terrain.`,
    cost: "2 SP"
  },
  {
    name: "Invisibility",
    level: "3",
    actionSpeed: "Fast Action",
    spellType: "Arcane / Bardic / Occult",
    range: "6 units",
    area: "Single Target",
    duration: "1 hour",
    description: `Choose a willing creature within range. It becomes invisible for the duration. If it attacks or casts a spell during the duration of the spell, the spell immediately ends. It has advantage on the first attack it makes while invisible.`,
    cost: "2 SP"
  },
  {
    name: "Leech",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Occult",
    range: "10 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Shoot a ray of dark siphoning energy at a creature you can see within range. Roll Magic against Deflection. On success, deal SD + 2 Necrotic damage, and heal yourself or an ally within range for SD health points.

On success, if you roll a double six, you or the ally you healed gets 1 temporary health point until the end of the combat.
Choose which target to heal only when the spell resolves.

You may spend additional Spell Points when you cast the spell. For each 1 additional point spent, you deal +1 Necrotic damage.`,
    cost: "1+"
  },
  {
    name: "Life Giving",
    level: "3",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Bardic / Divine / Nature",
    range: "8",
    area: "Single Target",
    duration: "1 day",
    description: `Increase the maximum HP of up to three creatures by 1 for the duration.
No more than one casting of this spell can affect the same creature at the same time.
Empower Spell: for each 2 additional SP spent, increase the HP maximum by 1 additional HP.`,
    cost: "2 SP"
  },
  {
    name: "Light",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Arcane / Bardic / Divine / Nature",
    range: "15 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Create up to two stationary floating balls of light or make one item or limb luminous.
The light provides 6 units of bright light and further 6 units of dim light.
You may try to make an item or a limb of an enemy luminous. Roll Magic against Deflection. The threshold is 1. On success, it becomes luminous, and if the enemy is invisible, it doesn't get any of the benefits. The spell ends when you are unconscious, when you cast this spell again, or when you dismiss it. If cast on an enemy, it ends after an hour.`,
    cost: "0"
  },
  {
    name: "Lightning Bolt",
    level: "1",
    actionSpeed: "Average Action",
    spellType: "Arcane",
    range: "12 units",
    area: "Single Target",
    duration: "until end of combat",
    description: `Roll Magic against Deflection. You charge your hands with chaotic lightning energy and shoot lightning bolt at a creature you can see within range. Roll Magic against Deflection.
On success, deal SD + 2 lightning damage.
For the duration, you can perform an average action to shoot a similar lightning bolt without spending spell points.
Empower Spell: For each 2 additional SP you deal +1 damage on all shots of this spell.`,
    cost: "1 SP"
  },
  {
    name: "Lightning Coil",
    level: "3",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Arcane",
    range: "10",
    area: "Single Target",
    duration: "10 minutes",
    description: `Choose a creature you can see within range. Roll Magic against Deflection or Fortitude, whichever is higher. The threshold is 1.
On success, coils of lightning tie the legs of the creature. They become restrained, and the take 3 lightning damage at the end of each round.
At the beginning of each round, they roll Acrobatics or Athletics. The threshold is 3. On success, they break free of the coils. This threshold is reduced after each failed roll.
Empower Spell: For each 2 additional SP you spend, the creature takes +1 damage at the end of each turn.`,
    cost: "3"
  },
  {
    name: "Mage Hand",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Arcane",
    range: "12 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `[Mage Hand]`,
    cost: "0"
  },
  {
    name: "Magic Missile",
    level: "1",
    actionSpeed: "Average Action",
    spellType: "Arcane",
    range: "15 units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Shoot three magical missiles. Choose a creature to target with each missile. You may choose the same creature for more than one missile. You only need to know the creatures' general location. Each missile automatically hits its target and deals 1 force damage. If the missile has no way to reach the target, it fails.

You may spend additional Spell Points when you cast the spell. For each additional point spent, shoot one more missile.`,
    cost: "1+"
  },
  {
    name: "Magic Tricks",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Arcane",
    range: "12 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `[Like prestidigitation, but maybe more free form.]`,
    cost: "0"
  },
  {
    name: "Message",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Arcane / Bardic",
    range: "50 Units",
    area: "Single Target",
    duration: "10 minutes",
    description: `Choose a target within range. You send a telepathic message to it, and it may reply telepathically as well. The casting of this spell is visible unless you pass a Sneak or Sleight of hand roll. (The difficulty of the roll will be determined by the GM according to the situation).`,
    cost: "0"
  },
  {
    name: "Mind Spike",
    level: "1",
    actionSpeed: "Fast Action",
    spellType: "Arcane / Bardic / Occult",
    range: "15 units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Choose an enemy you can see within range. Roll Magic against Will. The threshold is 1. On success, the target is interrupted and disoriented (-1 penalty to all rolls) until the end of the round.
If cast using Occult magic, they are also discouraged (they deal -1 damage) until the end of the round.`,
    cost: "1"
  },
  {
    name: "Minor Illusion",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Arcane / Bardic / Occult",
    range: "12 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `[Minor Illusion]`,
    cost: "0"
  },
  {
    name: "Minor Ward",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Arcane / Bardic / Divine / Nature / Occult",
    range: "Self",
    area: "Self",
    duration: "Instantaneous",
    description: `You get +1 Deflection until the end of the next round.`,
    cost: "0"
  },
  {
    name: "Mold Earth",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Nature",
    range: "10 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `You manipulate the ground at a point within range. 
Choose one or both:
- Create 1 unit cube of earth. It provides half cover (or full cover while being prone next to it). You cannot target an occupied space.
- Dig a hole o1 unit cube into the ground. Getting into the hole provides half cover. The ground must be earth.
If you choose both, the hole and the cube must be adjacent to each other.`,
    cost: "0"
  },
  {
    name: "Natural Guidance",
    level: "Cantrip",
    actionSpeed: "Average Action",
    spellType: "Nature",
    range: "Touch",
    area: "Single Target",
    duration: "Unlimited",
    description: `Choose one creature. It gains advantage on Survival, Nature, Animal handling, Cooking, Medicine, and Perception skill rolls against beasts and natural world phenomena.
The spell ends when you are unconscious, when you cast this spell again, or when you dismiss it.`,
    cost: "0"
  },
  {
    name: "Nature Spirit",
    level: "3",
    actionSpeed: "Average Action",
    spellType: "Bardic / Nature",
    range: "6 units",
    area: "Single Target",
    duration: "10 minutes",
    description: `Summon slot: 1
You summon a tiny, flying Fae spirit in a point within range. The spirit is a separate actor you control in a similar way to your character.

Empower Spell: You may pay additional Spell Points when you cast this spell. The spirit gains 2 more HP for each additional SP spent.`,
    cost: "2+"
  },
  {
    name: "Nature Wall",
    level: "3",
    actionSpeed: "Average Action",
    spellType: "Nature",
    range: "6 units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Choose an area 5 units large. It can be of any shape but must be continuous. Create a continuous wall of grown vines and roots that is 1 unit in height. Each section of the wall has 8 HP with vulnerability to fire.
Empower Spell: for each additional SP spent, increase the size of the area by 2 Units`,
    cost: "2 SP"
  },
  {
    name: "Necrotic Bolt",
    level: "Cantrip",
    actionSpeed: "Average Action",
    spellType: "Occult",
    range: "10 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Ranged Spell Attack. Roll Magic against Deflection.
Launch a dark bolt of necrotic energy at an enemy. On success, deal SD Necrotic damage, and they become vulnerable 1 until the end of the next round.

On success, if you roll a double six, the target also becomes disoriented (-1 penalty on all rolls) until the end of the next round.`,
    cost: "0"
  },
  {
    name: "Protective Circle",
    level: "3",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Divine",
    range: "10 units",
    area: "Single Target",
    duration: "1 hour",
    description: `A glowing, divine circle appears on the ground in a 3 units radius in a point within range. Whenever you, your allies, or other creatures you designate take damage while inside the circle, they take 1 less damage instead.`,
    cost: "3"
  },
  {
    name: "Radiant Beam",
    level: "Cantrip",
    actionSpeed: "Average Action",
    spellType: "Divine",
    range: "10 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Divine Magic roll against Deflection.
Launch a beam of divine energy at an enemy. If you are a Cleric, you may choose to change the damage type from Radiant to the one associated with your domain. On success, deal SD radiant damage and they become discouraged 1 until the end of the next round.
On success, if you roll a double six, they get disadvantage on attacks against you and your allies until the end of the next round.`,
    cost: "0"
  },
  {
    name: "Rainbow Eruption",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Nature / Bardic",
    range: "10 units",
    area: "Single Target",
    duration: "1 minute or end of combat",
    description: `You create a chaotic eruption of rainbows at a point within range. The rainbows are attracted to each enemy within 5 units radius of that point.
Roll Magic against Deflection for the enemies inside the radius. The threshold is 1. Those that you succeed against become luminous for the duration. Attacks against them get advantage, they give off 2 units of bright light, and they can't get the advantages of invisibility, if relevant.`,
    cost: "1"
  },
  {
    name: "Sanctuary",
    level: "1",
    actionSpeed: "Fast Action",
    spellType: "Divine",
    range: "15 units",
    area: "Single Target",
    duration: "end of the next two rounds.",
    description: `Choose an ally within range or yourself. The target cannot be targeted by any enemy for the duration. When the target performs any action other than Dash or Dodge, the spell ends.
If the target is already targeted by attacks when the spell is cast, those attacks go through, but suffer 1 penalty.`,
    cost: "2"
  },
  {
    name: "Scorching Rays",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Arcane",
    range: "10 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `You get a pool of 4 points of fire damage. Distribute the damage between one, two or three ray s, each targeting a different enemy you can see. Roll Magic against Deflection. The threshold is 2. Targets that you've succeeded against take the fire damage, while targets you've failed against take only half the damage, rounded down.
You may spend additional Spell Points when you cast the spell. For each 1 additional point spent, you get 2 additional fire damage to your damage pool.`,
    cost: "1+"
  },
  {
    name: "Shield of Faith",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Divine",
    range: "15 units",
    area: "Single Target",
    duration: "10 minutes",
    description: `Choose a target within range. They get +2 Deflection for the duration.`,
    cost: "1"
  },
  {
    name: "Silence",
    level: "3",
    actionSpeed: "Fast Action",
    spellType: "Bardic / Divine / Occult",
    range: "10 units",
    area: "Single Target",
    duration: "1 minute.",
    description: `Choose a creature within range. Roll Magic against Will. The threshold is 1. On success, the physical space of the creature cannot produce sound. It also completely blocks any outside sounds getting into it. The creature is immune to thunder damage. It cannot cast spells that require vocal activity (all spells require this unless described otherwise.)
Starting next round, at the end of each round, Roll Magic against Will again. The threshold increases by 1 for each time you make the roll. On failure, the spell ends for that creature.
Empower Spell: you can increase the duration of this by 1 hour for each 2 additional spell points spent.`,
    cost: "2 SP"
  },
  {
    name: "Sleep",
    level: "3",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Arcane / Bardic / Nature / Occult",
    range: "8 units",
    area: "Single Target",
    duration: "1 hour",
    description: `Choose a point within range. Roll Magic against Will for each creature within 2 units of it. The threshold is 1. Each creature you succeed against falls asleep (if sleeping is something that it does). They wake up if they take damage or if a creature uses a fast action to wake them up.`,
    cost: "3 SP"
  },
  {
    name: "Speak with Animals",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Nature",
    range: "30 Units",
    area: "Single Target",
    duration: "10 minutes",
    description: `Choose an animal within range. They understand your speech, and you understand theirs. The effect stops at the end of its duration or when you use this cantrip again.`,
    cost: "0"
  },
  {
    name: "Spike Growth",
    level: "3",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Nature",
    range: "10 units",
    area: "Single Target",
    duration: "10 minutes",
    description: `Spikes grow from the ground in a 4-units cube in a point you can see within range.
Roll Magic against Deflection against creatures in the area. The threshold is 1. Each creature you succeed against takes 1 piercing damage.
When a creature first steps on the area during each round, it rolls Acrobatics. The threshold is 3. On failure, each unit of movement in the area deals 1 piercing damage to it. The area is difficult terrain.`,
    cost: "3 SP"
  },
  {
    name: "Summon Beast",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Nature",
    range: "10 Units",
    area: "Single Target",
    duration: "1 day",
    description: `Requires 1 summon slot
Summons a Large or smaller beast (your choice) in an unoccupied location you can see.
It can't be a flying beast unless it's small.
The beast is a separate actor than your character that you control in the same manner.
You must take the Command fast action on your turn to enable the beast to use the specific actions that require it. (it may still move and take other actions without it)`,
    cost: "1"
  },
  {
    name: "Summon Shade",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Occult",
    range: "10 Units",
    area: "Single Target",
    duration: "10 minutes",
    description: `Requires 1 summon slot
Summon a shade (Undead spirit) in an unoccupied location you can see within range.
If the location is not available when the spell resolves, choose an adjacent location within range.
The shade is a separate actor than your character that you control in the same manner. Start controlling it in the next round.
You must take the Command fast action in your turn to enable the spirit to use the specific actions that require it.
When the shade is summoned, it can immediately use Shadow Claw on an enemy within its range as a free action.`,
    cost: "1"
  },
  {
    name: "Thaumaturgy",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Divine",
    range: "Self",
    area: "Self",
    duration: "Instantaneous",
    description: `[Thaumaturgy]`,
    cost: "0"
  },
  {
    name: "Thunder Fist",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Arcane / Bardic / Nature",
    range: "Touch",
    area: "Single Target",
    duration: "Instantaneous",
    description: `You release thunderous energy from your hand into a nearby enemy. Melee Spell Attack. Roll Magic against Deflection.
On success, deal SD +1 Thunder damage and push them 2 units away from you.

On success, if you roll a double six, the push is forceful (if they are pushed into a surface, they receive 1 damage. If they are pushed into a creature, they both receive 1 damage)`,
    cost: "0"
  },
  {
    name: "Thunder Wave",
    level: "Cantrip",
    actionSpeed: "Average Action",
    spellType: "Arcane / Bardic / Nature",
    range: "Self",
    area: "Self",
    duration: "Instantaneous",
    description: `You release a small wave of thunderous energy in an outward direction. Roll Magic against Deflection for all creatures adjacent to you. The threshold is 1.
Those you've succeed against receive 1 Thunder Damage and are pushed 1 unit away from you. 
If you rolled double six, the push is forceful (if they are pushed into a surface, they receive 1 damage. If they are pushed into a creature, they both receive 1 damage)`,
    cost: "0"
  },
  {
    name: "Touch of Decay",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Occult",
    range: "Touch",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Channel dark energy into an adjacent enemy. Roll Magic against Deflection.
On success, deal SD Necrotic damage, and they can't be healed until the end of the next round.

On success, if you roll a double six, the target also becomes vulnerable 1 (-1 to all defenses) until the end of the next round.`,
    cost: "0"
  },
  {
    name: "Vine Knot",
    level: "3",
    actionSpeed: "Average Action",
    spellType: "Nature",
    range: "10 units",
    area: "Single Target",
    duration: "10 minutes",
    description: `Choose a creature in range that you can see. Vines latch to him. Roll Magic against Deflection. The threshold is 1. On success, it is restrained and prone. At the end of each round, it rolls Athletics or Acrobatics. The threshold is 3. On success, it breaks loose and the spell ends. The threshold is reduced by 1 after each failed roll.`,
    cost: "3 SP"
  },
  {
    name: "Vine Whip",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Nature",
    range: "5 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Launch a thorny vine at an enemy you can see within range. Roll Nature Magic against Deflection. On success, deal SD piercing damage, and push or pull 1 unit to any direction.

On success, if you rolled a double six, push or pull for 2 units forcefully (if they are pushed into a surface, they receive 1 damage. If they are pushed into a creature, they both receive 1 damage) instead of 1.

You may only push or pull the target if it's up to one size larger than you.`,
    cost: "0"
  },
  {
    name: "Windsurf",
    level: "1",
    actionSpeed: "Fast Action",
    spellType: "Nature",
    range: "10",
    area: "Single Target",
    duration: "10 minutes",
    description: `Choose a creature in range that you can see. It is engulfed in windy currents. For the duration, it gets +2 Movement, and it can make its movement through the air as long as it's up to 2 units height and no longer than then 5 seconds.`,
    cost: "1 SP"
  }
];
