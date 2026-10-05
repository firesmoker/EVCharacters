export const SPELLS_DATABASE = [
  {
    name: "Acid Spray",
    level: "Cantrip",
    actionSpeed: "Average Action",
    spellType: "Nature / Occult",
    range: "6 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Spray acid at a creature you can see within range.
Roll Magic +2 against Deflection.
On success, deal SD Acid damage, and the target becomes weakened 1 (-1 Fortitude and a penalty of 1 on rolls) until the end of the next round. On failure, deal half as much damage.
If you roll a double six, the target becomes weakened 2 instead.`,
    cost: "0"
  },
  {
    name: "Animal Messenger",
    level: "1",
    actionSpeed: "1 minute",
    spellType: "Bardic / Nature",
    range: "15 units",
    area: "Single Target",
    duration: "24 hours",
    description: `Choose a tiny beast you can see within range. Roll Magic against Will. On success, it attempts to deliver a message for you. You automatically fail if the creature is openly hostile towards you.
You specify a location you have visited and a recipient who matches a general description, such as "a person dressed in the uniform of the town guard" or "a red-haired dwarf wearing a pointed hat." You also communicate a message of up to twenty-five words. The Beast travels for the duration toward the specified location, covering about 25 miles per 24 hours or 50 miles if the Beast can fly.
When the Beast arrives, it delivers your message to the creature that you described, mimicking your communication. If the Beast doesn't reach its destination before the spell ends, the message is lost, and the Beast returns to where you cast the spell.

Empowered Spell: The spell's duration increases by 48 hours for each two additional spell points spent.`,
    cost: "1"
  },
  {
    name: "Arcane Shield",
    level: "1",
    actionSpeed: "Instinct",
    spellType: "Arcane",
    range: "Self",
    area: "Self",
    duration: "end of current round",
    description: `Until the end of the round, you get +2 Deflection and are immune to the Magic Missile spell.

For every 2 additional Spell Points spent, you get an additional +1 Deflection.`,
    cost: "1+"
  },
  {
    name: "Aura of Truth",
    level: "1",
    actionSpeed: "Fast Action",
    spellType: "Bardic / Divine",
    range: "Self",
    area: "3-unit radius",
    duration: "10 minutes",
    description: `You emanate a 3-unit-radius aura for the duration. When a creature first enters the aura, including any creature already inside it when the spell is cast, roll Magic against its Will. On success, that creature cannot tell a deliberate lie while inside the aura for the rest of the spell's duration. You know whether you succeeded against each creature. The roll occurs only once per creature for each casting.`,
    cost: "1"
  },
  {
    name: "Bestow Curse",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Occult",
    range: "10 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Roll Magic against Will. On success, choose two the following modes, or one on failure:
• They become disoriented 2 (-2 penalty on all rolls) until the end of the next 2 rounds.
• They become slowed 1 (+1 Drag to all actions, -1 Movement) until the end of the next 2 rounds.
• They become vulnerable 2 (-2 to all defenses) until the end of the next 2 rounds.
• They become discouraged 2 (they deal -2 damage) until the end of the next 2 rounds.
If you roll a double 6, choose an additional mode.`,
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
For the duration, add +4 to Strike rolls using that weapon. The damage type is changed to the chosen energy type.

Empower Spell: For each additional spell point spent, choose one more creature.`,
    cost: "1"
  },
  {
    name: "Burning Ground",
    level: "3",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Arcane",
    range: "10 units",
    area: "4 units cube",
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
    description: `You unleash a wide flame from your hands. Roll Magic against Deflection for creatures in the area. Those you succeed against take 2 fire damage. The rest take half as much.

For every 2 additional Spell Points spent, add +2 to the Roll Magic roll.`,
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
    description: `Choose a willing creature within range. For the duration, it can understand any written and spoken language. This spell doesn’t provide the ability to speak or write in unknown languages.`,
    cost: "2 SP"
  },
  {
    name: "Command",
    level: "3",
    actionSpeed: "Fast Action",
    spellType: "Divine",
    range: "10 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `You tether your mind with that of a creature you can see within range. Roll Magic against Will. On success, you speak a one-word command of the available options. This spell works only once against the same creature per combat.<br><br><strong>1 Success die:</strong> choose one of the following:<ul><li><strong>Halt:</strong> the target must stay in place and loses all Instinct for this round.</li><li><strong>Move:</strong> in this round, the target must use its movement to move to or as close to a chosen point. It won't move to directly harmful places, such as a burning ground or walk off a cliff.</li></ul><strong>2 Success dice:</strong> choose any previous option, or one of the following:<ul><li><strong>Grovel:</strong> the target immediately becomes Prone and doesn't do anything else this round.</li><li><strong>Drop:</strong> the target immediately drops whatever it is holding and doesn't do anything else this round.</li></ul><strong>3+ Success dice:</strong> choose any previous option, or one of the following:<ul><li><strong>Harm:</strong> if the target committed to an offensive action against you or your allies, it changes its target to another enemy of yours. If their new target is out of the range of their action, they use their movement to the best of their ability to try and bring their target into range. If they haven't committed any offensive action, their action is cancelled and they don't do anything else this round.</li><li><strong>Flee:</strong> the action for the target this round becomes Dash. They must use their Movement to move as far away from you as they can. They won't move to directly harmful places, such as a burning ground or walk off a cliff. They don't do anything else this round.</li></ul><br>You may spend 2 additional Spell Points per additional target; each target may receive a different command.`,
    cost: "1+"
  },
  {
    name: "Cure",
    level: "1",
    actionSpeed: "Fast Action",
    spellType: "Bardic / Divine / Nature",
    range: "10 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Choose a target within range. Heal them for 1 HP. If the target is dying, it becomes stabilized. If you cast it using the Divine tradition, heal them for 1 additional HP.
You may also choose to cast the spell as a slow, interruptible action. If you do, heal up to two targets instead.

You may spend additional Spell Points as you cast this spell. For each additional Spell Point you heal them for 1 more HP.`,
    cost: "1+"
  },
  {
    name: "Detect Magic",
    level: "1",
    actionSpeed: "Fast Action",
    spellType: "Arcane / Bardic / Divine / Nature / Occult",
    range: "Self",
    area: "20-unit radius",
    duration: "10 minutes",
    description: `You attune your senses to magic for the duration. You detect the presence and location of magic within 20 units of you and can identify its tradition. If the magic belongs to a tradition you know, you can also discern some or all of its specific properties, at the GM's discretion.`,
    cost: "1"
  },
  {
    name: "Dissonant Whispers",
    level: "1",
    actionSpeed: "Average Action",
    spellType: "Bardic / Occult",
    range: "8 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Roll Magic +2 against Will.
You channel psychic disturbance into the mind of a creature you can see within range.
The target becomes disoriented (-1 penalty on all rolls) until the end of the next round. On success, the target takes SD Psychic damage, or half as much on failure.
If you roll a double six, the target is also frightened until the end of the next round. (They cannot choose you as a target for their attacks. They also cannot finish their movement on a unit that is adjacent to you.)`,
    cost: "1"
  },
  {
    name: "Divine Interference",
    level: "1",
    actionSpeed: "Instinct",
    spellType: "Divine",
    range: "15 units",
    area: "Single Target",
    duration: "end of current round",
    description: `Choose a creature within range. Until the end of the round, they get +1 to all defenses and can't become frightened or discouraged.`,
    cost: "1"
  },
  {
    name: "Eldritch Shield",
    level: "1",
    actionSpeed: "Instinct",
    spellType: "Occult",
    range: "Self",
    area: "Self",
    duration: "Instantaneous",
    description: `Get +1 Deflection. If you are hit by an attack against your Deflection, the enemy that dealt the damage loses 1 HP.`,
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
    description: `Shoot an elemental flare at a creature within range. Choose its damage type: lightning, fire or ice. Roll Magic +3 against Deflection. On success, deal SD damage of the chosen type, or half as much on failure.
If you roll a double six, depending on the damage type, the target also:
• Fire: becomes burning 1 until the end of the round (receive 1 fire damage at the end of the round)
• Lightning: they become disoriented 1 (-1 to all rolls) until the end of the next round
• Ice: they become chilled 2 (-2 Movement) until the end of the next round`,
    cost: "0"
  },
  {
    name: "Elemental Pulse",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Arcane",
    range: "10 Units",
    area: "2-unit radius",
    duration: "Instantaneous",
    description: `Choose an ally within range or yourself. Choose damage type: fire, ice, or lightning. A pulse of the chosen elemental energy bursts from the chosen target in a 2-unit radius.
Roll Magic against Deflection for all creatures within the radius (other than the chosen target). Those that you've succeed against take 2 damage; the rest take half the amount of damage.
The spell deals 1 less damage if the chosen ally is not yourself.

For every 2 additional Spell Points spent, add +2 to the Roll Magic roll.`,
    cost: "1"
  },
  {
    name: "Resistance",
    level: "1",
    actionSpeed: "Fast Action",
    spellType: "Arcane / Divine / Nature",
    range: "Touch",
    area: "Single Target",
    duration: "10 minutes",
    description: `Touch a creature and ward it against elemental harm. Choose a damage type other than force or psychic. The target gains resistance to the chosen damage type for the duration.`,
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
For the duration, add +4 to Strike rolls using that weapon, and their damage type becomes the chosen type.

Empower Spell: For each additional spell point spent, choose one more creature.`,
    cost: "1"
  },
  {
    name: "Entangle",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Nature",
    range: "15 units",
    area: "3 units cube",
    duration: "10 minutes",
    description: `Vines erupt from the ground, twisting around all who stand in the area. Roll Magic against Deflection for each enemy in the area. Each enemy that you've succeeded against becomes restrained (they can’t move from their place).
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
Roll Magic +8 against Deflection (minimum roll of 6).
On success, deal SD ice or piercing damage, or half as much on failure.
If you roll a double 6: the creature is slowed 1 (-1 movement, 1 Drag for all actions) until the end of the next round.

Empower Spell: Add +2 to the roll for each extra Spell Point you spent.`,
    cost: "3"
  },
  {
    name: "Goodberry",
    level: "1",
    actionSpeed: "Special Action (1 minute)",
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

You may spend additional Spell Points when you cast the spell. For each 1 additional point spent, the tree has 3 more HP.`,
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
    description: `Choose a target creature within range that you can see and that can see your face.
Roll Magic against Will. If you succeed, any Speech skill or Performance roll against the creature made by you or your allies have advantage.
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
    description: `Choose a creature within range. They get 8 Extra Dice on the next Strike they perform until the end of the next round. Its damage type can be radiant.`,
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
    description: `Engulf a creature you can see within range in dark flames.
Roll Magic +4 against Deflection.
On success, apply Burning 4 for three turns. On failure, apply only half the Burning amount, rounded down.

Empower Spell: for each additional spell point spent, increase Burning by 1.`,
    cost: "3"
  },
  {
    name: "Hex",
    level: "1",
    actionSpeed: "Average Action",
    spellType: "Occult",
    range: "10 Units",
    area: "Single Target",
    duration: "end of the next two rounds",
    description: `Choose a creature you can see within range. For the duration, each time the creature takes damage, they also lose 2 life.`,
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
    description: `Launch a large ice shard on a creature within range that you can see.
Roll Magic +4 against Deflection. On success, deal SD ice or piercing damage, or half as much on failure.
The shard shatters on impact, sending small ice shards to each enemy within 2 units of the target. Use the same roll, without the +4 main-target bonus, against their Deflection. Enemies you succeed against take 1 ice damage.

For every additional Spell Point spent, add +2 to the roll against the main target only.`,
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
Roll Magic against Deflection. On success, you trap the creature inside a thin but strong ice prison. The prison has 9 HP and Vulnerability to fire.
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
    description: `You create a large scythe made of ice in your hands for the duration. The scythe is a two-handed weapon with reach. You may perform Melee Strikes with it for the duration, using either Magic or Melee for the roll. Add +8 to the roll (minimum roll of 2). When you cast this spell, you may immediately perform a Melee Strike with it.
The scythe deals SD piercing or ice damage. Its double 6 effect: Slowed 1 until the end of the next turn.

Empower Spell: Add +2 to Melee rolls with the scythe for each 1 additional Spell Point spent.`,
    cost: "3"
  },
  {
    name: "Icy Ground",
    level: "3",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Arcane",
    range: "10 units",
    area: "4 units cube",
    duration: "1 hour",
    description: `Cover an area of 4 units cube with extremely slippery icy ground. Creatures in the area roll Acrobatics against Threshold 3 when entering the area and when it enters their space.
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
    description: `Shoot a ray of dark siphoning energy at a creature you can see within range.
Roll Magic +4 against Deflection. On success, deal SD Necrotic damage, and heal yourself or an ally within range for SD health points. On failure, deal half the damage and don’t heal.
If you roll a double six, you or the ally you healed gets 1 temporary health point until the end of the combat.
Choose which target to heal only when the spell resolves.

For each 1 additional Spell Point spent, add +2 to the Roll Magic roll.`,
    cost: "1+"
  },
  {
    name: "Life Drain",
    level: "Cantrip",
    actionSpeed: "Average Action",
    spellType: "Occult",
    range: "6 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Drain the life force from a creature you can see within range.
Roll Magic against Fortitude.
On success, deal SD Necrotic damage and heal yourself for half that amount, rounded down. On failure, halve both the damage and healing, rounded down.
If you roll a double six, you become inspired 1 (1 Extra Die on rolls) until the end of the next round.`,
    cost: "0"
  },
  {
    name: "Life Giving",
    level: "3",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Bardic / Divine / Nature",
    range: "8",
    area: "Single Target",
    duration: "1 day",
    description: `Increase the maximum HP of up to three creatures by 2 for the duration.
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
You may try to make an item or a limb of an enemy luminous.
Roll Magic against Deflection. On success, it becomes luminous, and if the enemy is invisible, it doesn’t get any of the benefits. The spell ends when you are unconscious, when you cast this spell again, or when you dismiss it. If cast on an enemy, it ends after an hour.`,
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
    description: `You charge your hands with chaotic lightning energy and shoot a lightning bolt at a creature you can see within range.
Roll Magic +4 against Deflection.
On success, deal SD lightning damage, or half as much on failure.
For the duration, you can perform an average action to shoot a similar lightning bolt without spending Spell Points.

Empower Spell: For each 2 additional Spell Points spent, add +2 to the roll for all shots of this spell.`,
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
    description: `Choose a creature you can see within range.
Roll Magic against Deflection or Fortitude, whichever is higher.
On success, coils of lightning tie the legs of the creature. They become restrained, and the take 3 lightning damage at the end of each round.
and roll Acrobatics or Athletic against Threshold 3.
On success, they break free of the coils. This threshold is reduced after each failed roll.

Empower Spell: For each 2 additional Spell Points you spend, add +2 to this roll.`,
    cost: "3"
  },
  {
    name: "Mage Hand",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Arcane",
    range: "20 Units",
    area: "Single Target",
    duration: "1 minute",
    description: `Conjure a small, floating hand of magical force at a point within range. The hand has Movement 5 (Flying) and lasts for the duration, until you dismiss it, until it moves more than 20 units away from you, or until you cast this cantrip again.
Spend 1 Instinct to direct the hand to move and perform a simple task, such as manipulating an unattended object. The hand cannot attack, activate magical items, or carry more than 5 kilograms.`,
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
    description: `Shoot three magical missiles. Choose a creature to target with each missile. You may choose the same creature for more than one missile. You only need to know the creatures’ general location. Each missile automatically hits its target and deals 1 force damage. If the missile has no way to reach the target, it fails.

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
    duration: "Varies",
    description: `Produce one harmless minor magical trick within range. Choose one:
• Create a brief sensory flourish, such as sparks, a puff of air, a faint melody, or an unusual scent.
• Ignite or extinguish a candle, torch, or small campfire.
• Instantly clean or soil a small object.
• Warm, chill, or flavor a serving of nonliving material for 1 hour.
• Place a simple color, mark, or symbol on a surface for 1 hour.
• Create a worthless handheld trinket or palm-sized illusory object until the end of the next round. It cannot deal damage.
You can maintain up to three non-instantaneous effects from this cantrip at once.`,
    cost: "0"
  },
  {
    name: "Mending",
    level: "Cantrip",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Arcane / Divine",
    range: "Touch",
    area: "Single Object",
    duration: "Instantaneous",
    description: `Touch an object with a single break or tear no larger than 1 foot in any dimension. You repair the damaged section, leaving no trace of the former damage. The spell can physically repair a magic item or construct, but it cannot restore lost magical properties.`,
    cost: "0"
  },
  {
    name: "Message",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Arcane / Bardic / Divine / Occult",
    range: "50 Units",
    area: "Single Target",
    duration: "10 minutes",
    description: `Choose a target within range. You send a telepathic message to it, and it may reply telepathically as well. The casting of this spell is visible unless you pass a Sneak or Sleight of hand roll. (The difficulty of the roll will be determined by the GM according to the situation).`,
    cost: "0"
  },
  {
    name: "Mind Blast",
    level: "Cantrip",
    actionSpeed: "Average Action",
    spellType: "Bardic / Occult",
    range: "8 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Blast the mind of a creature you can see within range with psychic energy.
Roll Magic against Will.
On success, deal SD Psychic damage; on failure, deal half as much damage.
The target becomes vulnerable 1 (-1 to all defenses) until the end of the next round.
If you roll a double six, the target also becomes disoriented 1 (-1 penalty on all rolls) until the end of the next round.`,
    cost: "0"
  },
  {
    name: "Minor Illusion",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Arcane / Bardic / Occult",
    range: "12 Units",
    area: "Single Target",
    duration: "1 minute",
    description: `Create either a sound or a stationary image at a point within range. It lasts for the duration or until you cast this cantrip again.
• Sound: Create any sound from a whisper to a shout. It may continue throughout the duration or occur at moments you choose.
• Image: Create the appearance of an object or visible phenomenon that fits within a 1-unit cube. It produces no sound, light, smell, or physical sensation, and creatures and objects pass through it.
Physical interaction reveals an image as an illusion. A creature that spends an action carefully examining either effect also recognizes it as false.`,
    cost: "0"
  },
  {
    name: "Minor Ward",
    level: "Cantrip",
    actionSpeed: "Instinct",
    spellType: "Arcane / Bardic / Divine / Nature / Occult",
    range: "Self",
    area: "Self",
    duration: "end of current round",
    description: `You get +1 Deflection until the end of the round.`,
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
• Create 1 unit cube of earth. It provides half cover (or full cover while being prone next to it). You cannot target an occupied space.
• Dig a hole o1 unit cube into the ground. Getting into the hole provides half cover. The ground must be earth.
If you choose both, the hole and the cube must be adjacent to each other.`,
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
    description: `You summon a tiny, flying Fae spirit in a point within range. The spirit is a separate actor you control in a similar way to your character.

Empower Spell: You may pay additional Spell Points when you cast this spell. The spirit gains 2 more HP for each additional SP spent.`,
    cost: "2+"
  },
  {
    name: "Nature Wall",
    level: "3",
    actionSpeed: "Average Action",
    spellType: "Nature",
    range: "6 units",
    area: "5 units, continuous, any shape",
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
    description: `Launch a dark bolt of necrotic energy at an enemy.
Roll Magic against Deflection.
On success, deal SD Necrotic damage, and they become vulnerable 1 until the end of the next round. On failure, deal half as much damage.
If you roll a double six, the creature also becomes disoriented (-1 penalty on all rolls) until the end of the next round.`,
    cost: "0"
  },
  {
    name: "Pacify",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Bardic / Divine",
    range: "6 units",
    area: "Single Target",
    duration: "10 minutes",
    description: `Choose a creature within range. Roll Magic against Will. On success, the target is pacified until the end of the next two rounds. (A pacified creature cannot perform offensive actions against other creatures.) The effect ends early if the target takes damage or is affected by an offensive action.`,
    cost: "1"
  },
  {
    name: "Poison Cloud",
    level: "3",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Nature / Occult",
    range: "10 units",
    area: "2-unit radius",
    duration: "10 minutes",
    description: `The ground releases a 2-units radius poisonous cloud from a point within range. When you cast the spell and at the end of each round, roll Magic against Fortitude for all creatures within the cloud radius. Creatures you succeed against become poisoned 1 (they have -1 Fortitude and take 1 poison damage at the end of each round) and disoriented 1 until the end of the next round. The cloud stays for the duration unless its dispersed by strong wind. At the beginning phase of each round, you may choose to disperse the cloud.

Empower Spell: You may pay additional Spell Points when you cast this spell. For each additional Spell Point spent, the radius of the spell increases by one.`,
    cost: "3"
  },
  {
    name: "Protection from Evil and Good",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Divine",
    range: "6 units",
    area: "Single Target",
    duration: "10 minutes",
    description: `Choose a creature within range. For the duration, Undead, Abominations, Fiends, and Celestials have disadvantage on attacks against the target.`,
    cost: "1"
  },
  {
    name: "Protective Circle",
    level: "3",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Divine",
    range: "10 units",
    area: "3-unit radius",
    duration: "1 hour",
    description: `A glowing, divine circle appears on the ground in a 3 units radius in a point within range. Whenever you, your allies, or other creatures you designate take damage while inside the circle, they take 2 less damage instead.`,
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
    description: `Launch a beam of divine energy at an enemy. If you are a Cleric, you may choose to change the damage type from Radiant to the one associated with your domain.
Roll Magic against Deflection.
On success, deal SD radiant damage and they become discouraged 1 until the end of the next round. On failure, deal half as much damage.
If you roll a double six, the target gets disadvantage on the next attack it makes against you or your allies.`,
    cost: "0"
  },
  {
    name: "Rainbow Eruption",
    level: "1",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Bardic / Nature",
    range: "10 units",
    area: "5-unit radius",
    duration: "1 minute or end of combat",
    description: `You create a chaotic eruption of rainbows at a point within range. The rainbows are attracted to each enemy within 5 units radius of that point.
Roll Magic against Deflection for the enemies inside the radius. Those that you succeed against become luminous for the duration. Attacks against them get advantage, they give off 2 units of bright light, and they can’t get the advantages of invisibility, if relevant.`,
    cost: "1"
  },
  {
    name: "Restoration",
    level: "1",
    actionSpeed: "Fast Action",
    spellType: "Bardic / Divine / Nature",
    range: "Touch",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Touch an ally and remove all negative conditions affecting them, except Exhaustion and the Paralyzed condition.`,
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
If the target is already targeted by attacks when the spell is cast, those attacks go through but suffer 1 penalty.`,
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
    description: `You get a pool of 4 points of fire damage. Distribute the damage between one, two or three rays, each targeting a different enemy you can see.
Roll Magic against Deflection. Targets that you've succeeded against take the fire damage, while targets you've failed against take only half the damage, rounded down.

For each 1 additional Spell Point spent, you get 2 additional fire damage to your damage pool.`,
    cost: "1+"
  },
  {
    name: "Shield of Faith",
    level: "1",
    actionSpeed: "Average Action",
    spellType: "Divine",
    range: "15 units",
    area: "Single Target",
    duration: "1 minute or until end of combat",
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
    description: `Choose a creature within range.
Roll Magic against Will. On success, the physical space of the creature cannot produce sound. It also completely blocks any outside sounds getting into it. The creature is immune to thunder damage. It cannot cast spells that require vocal activity (all spells require this unless described otherwise.)
Starting next round, at the end of each round, Roll Magic against Will again. Your roll gets 1 penalty for each time you’ve made the roll. On failure, the spell ends for that creature.

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
    description: `Choose a point within range.
Roll Magic against Will for each creature within 2 units of it. Each creature you succeed against falls asleep (if sleeping is something that it can do). They wake up if they take damage or if a creature uses a fast action to wake them up.`,
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
    area: "4 units cube",
    duration: "10 minutes",
    description: `Spikes grow from the ground in a 4-units cube in a point you can see within range.
Roll Magic against Deflection against creatures in the area. Each creature you succeed against takes 1 piercing damage.
When a creature first steps on the area during each round, it rolls Acrobatics against Threshold 3. On failure, each unit of movement in the area deals 1 piercing damage to it. The area is difficult terrain.`,
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
    description: `Summons a Large or smaller beast (your choice) in an unoccupied location you can see.
It can’t be a flying beast unless it’s small.
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
    description: `Summon a shade (Undead spirit) in an unoccupied location you can see within range.
If the location is not available when the spell resolves, choose an adjacent location within range.
The shade is a separate actor than your character that you control in the same manner. Start controlling it in the next round.
You must use the Command Instinct ability on your turn to enable the spirit to use the specific actions that require it.
When the shade is summoned, it can immediately perform Shadow Claw on an enemy within its range as a free action.`,
    cost: "1"
  },
  {
    name: "Enhanced Vitality",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Divine / Nature",
    range: "Touch",
    area: "Single Target",
    duration: "until end of combat",
    description: `In combat, channel a surge of divine vitality into yourself or an ally within range. The target gains 3 temporary HP until the end of combat.`,
    cost: "0"
  },
  {
    name: "Thaumaturgy",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Divine",
    range: "Self",
    area: "Self",
    duration: "Up to 1 minute",
    description: `Manifest a minor divine omen. Choose one effect:
• Your voice carries up to three times its normal distance for 1 minute.
• Nearby flames flicker, brighten, dim, or change color for 1 minute.
• The ground within 3 units of you trembles harmlessly for a moment.
• A brief sound emanates from a point within 6 units of you.
• One unlocked door or window within 6 units flies open or slams shut.
• Your eyes take on a supernatural appearance for 1 minute.
You can maintain up to three 1-minute effects from this cantrip at once. You may dismiss one as a Fast Action.`,
    cost: "0"
  },
  {
    name: "Thunder Fist",
    level: "Cantrip",
    actionSpeed: "Fast Action",
    spellType: "Arcane / Bardic / Divine / Nature",
    range: "Touch",
    area: "Single Target",
    duration: "Instantaneous",
    description: `You release thunderous energy from your hand into a nearby enemy. Melee Spell Attack. Roll Magic +2 against Deflection.
On success, deal SD Thunder damage and push them 2 units away from you. On failure, deal half as much damage.
If you roll a double six, the push is forceful (if they are pushed into a surface, they receive 1 damage. If they are pushed into a creature, they both receive 1 damage)`,
    cost: "0"
  },
  {
    name: "Thunder Wave",
    level: "Cantrip",
    actionSpeed: "Average Action",
    spellType: "Arcane / Bardic / Divine / Nature",
    range: "Self",
    area: "Self",
    duration: "Instantaneous",
    description: `You release a small wave of thunderous energy in an outward direction.
Roll Magic against Deflection for all creatures adjacent to you.
Those you've succeed against receive 1 Thunder Damage and are pushed 1 unit away from you.
If you rolled double six, the push is forceful (if they are pushed into a surface, they receive 1 damage. If they are pushed into a creature, they both receive 1 damage)
You may only push or pull the target if it’s up to one size larger than you.`,
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
    description: `Melee Spell Attack.
Roll Magic against Deflection.
Channel dark energy into an adjacent enemy.
Deal SD Necrotic damage, and they can’t be healed until the end of the next round. On failure, you deal half damage instead (rounded down). The target also becomes decayed 1 until the end of the next round (at the end of each round, they take 1 necrotic damage).
If you roll a double six, the target also becomes vulnerable 1 (-1 to all defenses) until the end of the next round.`,
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
    description: `Choose a creature in range that you can see. Vines latch to it. Roll Magic +2 against Deflection or Fortitude (whichever is higher). On success, it is restrained and prone.
At the end of each round, it rolls Athletics or Acrobatics against threshold 3. On success, it breaks loose and the spell ends. The threshold is reduced by 1 after each failed roll.`,
    cost: "3 SP"
  },
  {
    name: "Vine Whip",
    level: "Cantrip",
    actionSpeed: "Average Action",
    spellType: "Nature",
    range: "5 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Ranged Spell Attack
Roll Magic against Deflection. Launch a thorny vine at an enemy you can see within range. Deal SD piercing damage, and push or pull it 1 unit to any direction. On failure, you deal half damage instead (rounded down).
If you rolled a double six, push or pull for 2 units instead of 1, and the push is forceful (if they are pushed into a surface, they receive 1 damage. If they are pushed into a creature, they both receive 1 damage).
You may only push or pull the target if it’s up to one size larger than you.`,
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
  },
  {
    name: "Haste",
    level: "5",
    actionSpeed: "Slow Action (Interruptible)",
    spellType: "Chrono",
    range: "10 Units",
    area: "Single Target",
    duration: "until the end of the next two rounds",
    description: `Choose a creature within range. For the duration, the target may commit to two fast actions during the planning phase. If they do, during the action phase, they perform one as a fast action and the other as an average action. For each of these actions, the target may move immediately before or after performing it.

These actions cannot be used to cast spells that cost Spell Points. If Slow and Haste affect the same creature, both spells immediately dispel each other`,
    cost: "4"
  },
  {
    name: "Slow-Motion",
    level: "3",
    actionSpeed: "Fast Action",
    spellType: "Chrono",
    range: "10 Units",
    area: "Single Target",
    duration: "until the end of the next two rounds",
    description: `Choose a creature within range. For the duration, they perceive time much slower. They get +1 Deflection and advantage on all rolls.`,
    cost: "2"
  },
  {
    name: "Temporal Clarity",
    level: "5",
    actionSpeed: "Fast Action",
    spellType: "Chrono",
    range: "10 Units",
    area: "Single Target",
    duration: "until the end of the next two rounds",
    description: `Choose a creature within range. For the duration, they perceive time infinitely slower, as if it stands still. They get +2 Deflection, +1 instinct and advantage on all rolls.`,
    cost: "4"
  },
  {
    name: "Slow",
    level: "3",
    actionSpeed: "Fast Action",
    spellType: "Chrono",
    range: "10 Units",
    area: "Single Target",
    duration: "until the end of the next two rounds",
    description: `Choose a creature within range. Roll Magic against Fortitude. You get 1 penalty on your roll for each size the creature is larger than Medium.
On success, the creature movement is halved, and it gets 1 drag on all actions.

If Slow and Haste affect the same creature, both spells immediately dispel each other.`,
    cost: "2"
  },
  {
    name: "Time Detention",
    level: "3",
    actionSpeed: "Fast Action",
    spellType: "Chrono",
    range: "10 Units",
    area: "Single Target",
    duration: "until the end of the next two rounds",
    description: `Choose a creature within range. Roll Magic against Fortitude. You get 1 penalty on your roll for each size larger than Medium.

On success, the creature is paralyzed and invulnerable to all effects. Any durations currently affecting the target are paused.

On each subsequent round, you must take the Maintain fast action and make the same roll. You get 1 penalty on your roll for each round that has passed. If you fail the roll or choose not to take the Maintain action, the spell ends.
If you cast this spell or the Stasis spell while this spell is active on another creature, the previous spell immediately ends.`,
    cost: "2"
  },
  {
    name: "Stasis",
    level: "5",
    actionSpeed: "Fast Action",
    spellType: "Chrono",
    range: "10 Units",
    area: "Single Target",
    duration: "until the end of the next two rounds",
    description: `Choose a creature within range. Roll Magic against Fortitude. You get 1 penalty on your roll for each size larger than Medium.

On success, the creature is paralyzed and invulnerable to all effects. Any durations currently affecting the target are paused.

On each subsequent round, you must spend 1 Instinct at the beginning phase and make the same roll. You get 1 penalty on your roll for each round that has passed. If you fail the roll or choose not to spend Instinct to make it, the spell ends.

If you cast this spell or the Time Detention spell while this spell is active on another creature, the previous spell immediately ends.`,
    cost: "4"
  },
  {
    name: "Accelerate Magic",
    level: "5",
    actionSpeed: "Fast Action",
    spellType: "Chrono",
    range: "10 Units",
    area: "Single Target",
    duration: "Instantaneous",
    description: `Choose a non-permanent magical effect within range, such as a spell affecting a creature, object, or area. Reduce its duration by up to 3 rounds.

If the magic has a subsequent effect that occurs once per round, activate that effect once for each round reduced this way.`,
    cost: "4"
  }
];
