# Character creation

Open **File → Create Character…**. The wizard gathers identity, class/level,
species, subclass, feats, skill choices, spells, and starting equipment. The
last step validates the choices before replacing the sheet. Cancelling keeps
the existing sheet untouched. A local recovery copy is saved under
`ev-before-character-creation` before replacement.

## Rules data

- `src/creation-data.json`: read-only snapshot of the primary classes, species,
  subclasses, feats, progression, armor, and weapons tables from the source
  Google Sheet, checked October 15, 2026. The source URL is in the file.
- `src/character-creation.js`: choice counts, grant resolution, requirements,
  placeholder progression, and conversion to the app's sheet JSON format.
- `src/spells_data.js`: existing spell catalogue, reused for selection and the
  generated spell reference pages. Exclusive spells cannot be freely selected.
- `src/creation-wizard.js` and `.css`: lazy-loaded interface.

The Google Sheet remains authoritative. Rule changes should update the relevant
snapshot entries and structured choice rules together. No Sheet or book rules
were changed to introduce this UI.

## Provisional progression

At the author's request, missing values have placeholders. A defined progression
table cell always wins. Missing higher-level HP uses base HP plus floor(level/2).
All classes start with 1 Instinct. Missing later progression holds this at 1
until level 7, then uses a provisional value of 2. Missing caster progression adds one Spell Point and one spell per level,
and one cantrip every two levels, from the initial casting package. Witchblade's
package begins at level 3. Unknown maximum spell rank uses ceil(level/2), capped
at rank 3, and is flagged above level 5. Only the defined level-1 Minor Feat is
granted; further feat/skill progression has not been invented.

The review and generated sheet identify provisional values. Unfinished spell
catalogues may have fewer eligible spells than the character's allowance; all
available choices can be selected and the remaining slots are recorded as
unfilled. They are not replaced with invented spells. Undefined subclasses are
not invented. Existing WIP subclass rules remain provisional.

Species magic does not grant tradition training. Species-granted spells add to
class spells known. Duplicate bonus spell/cantrip grants offer replacement
choices. Skill grants take the highest training rather than stacking dice.
Subclass replacement skills depend on training held before the subclass grant.

Starting equipment is taken from the class, with its listed choices. Its armor
and shield affect Deflection; weapons and damaging cantrips populate action
blocks. Conditional effects remain in feature descriptions rather than being
treated as permanent bonuses. Extra combat/crafting skills appear in Additional
Features because the fixed Combat Skills table has four rows. Characters that
exceed the fixed standard-skill/action row counts use Auto to preserve all data.

## Checks

`scripts/creation-wizard-check.mjs` runs in an isolated Playwright browser. It
covers all classes/species at levels 1, 2, 3 and 10, every subclass with every
species at level 3, spell grants/limits, and a complete UI creation flow.
