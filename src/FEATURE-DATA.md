# Character-sheet features and rebuilding

`creation-data.json` holds the full creator rules. `sheet-features.json` holds the separately authored character-sheet summaries. Do not infer summaries, titles, omissions, or action grants from rule prose at runtime.

Each class, subclass, and species has an array of records:

```json
{
  "level": 1,
  "name": "Ram",
  "html": "<p><strong>Ram:</strong> You gain the Ram variant.</p>",
  "actions": ["Ram"]
}
```

- `level` controls availability, without printing an unlock label.
- `html` is the finished editable sheet content. Keep the bold label and its description in the same paragraph. Use real lists for options.
- Omit entries fully represented elsewhere, such as class skill grants or Instinct abilities. Keep species skill features and independent passive benefits.
- `actions` refers to names in `creation-actions.json`. Variants are placed inside their parent action; standalone actions get their own block. An entry may have empty `html` if its only purpose is an action grant.
- Class and subclass entries go to Class Features; species entries go to Species Features. An explicit `section: "Additional Features"` routes unusually long content there. There is no text-length heuristic.
- `concoctions` contains authored descriptions keyed by the creator's selected concoction names.

Update full rules and sheet summaries together when rules change. Loading an existing sheet must not rewrite its feature text. Rebuild is the explicit update path.

## Saved choices

The sheet JSON's `creation` object stores the creator selections (class, subclass, species, level, skills, feats, spells, equipment and other choices). Serialization, autosave and export retain it. Sheets without this object cannot be reliably rebuilt; do not guess choices from their rendered text.

File → Rebuild from Saved Choices opens the creator on Review with the stored selections. Current validation runs before replacement. The user can change selections and must confirm replacement of manual sheet edits. Current character/player names, portrait, appearance preferences and experience are retained. Other values are regenerated from current data.

Before creation or rebuilding, the previous sheet is saved in browser storage. File → Restore Before Creation / Rebuild restores that single recovery copy. This is local to the browser, not a substitute for exporting a character file.
