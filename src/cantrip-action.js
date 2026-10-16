export function cantripAction(spell, magicDice = 3, subclass = '') {
  const roll = spell.description.match(/Roll Magic(?:\s*([+-]\d+))?[^.]*\./i);
  const parts = spell.description.split(/Double 6:\s*/);
  const damaging = /deal (?:SD|\d+) .*damage/i.test(spell.description);
  const damage = spell.name === 'Elemental Flare' ? 'Fire / Ice / Lightning' : spell.description.match(/deal (?:SD|\d+) (\w+) damage/i)?.[1] || (damaging ? 'See spell' : '');
  return {
    type: 'action',
    slots: { name: spell.name, rollDescription: roll?.[0] || '', notes: parts[0].replace(roll?.[0] || '', '').trim() },
    tableRows: [{ weapon: '', speed: subclass === 'War Mage' && damaging && spell.actionSpeed.includes('Average') ? 'Fast' : spell.actionSpeed.replace(' Action', ''), roll: roll ? `${magicDice + Number(roll[1] || 0)}d6` : '', minimum: '', damage, range: spell.range, doubleSix: parts[1]?.trim() || '' }],
    variants: [], ui: { variantsHidden: true, weaponColumnHidden: true },
  };
}
