export function damageDefenses(speciesRules = '', armorRules = '') {
  const resistances = new Set(), vulnerabilities = new Set();
  const types = ['Slashing', 'Piercing', 'Crushing', 'Fire', 'Ice', 'Lightning', 'Acid', 'Necrotic', 'Psychic', 'Radiant', 'Force', 'Thunder', 'Poison'];
  for (const clause of `${speciesRules};${armorRules}`.split(';')) {
    const target = /vulnerab/i.test(clause) ? vulnerabilities : /resistan/i.test(clause) ? resistances : null;
    if (!target) continue;
    for (const type of types) if (new RegExp(`\\b${type}\\b`, 'i').test(clause) || /all Physical Damage/i.test(clause) && ['Slashing', 'Piercing', 'Crushing'].includes(type)) target.add(type);
  }
  for (const type of [...resistances]) if (vulnerabilities.has(type)) { resistances.delete(type); vulnerabilities.delete(type); }
  return { Resistances: [...resistances].join(', '), Vulnerabilities: [...vulnerabilities].join(', ') };
}
