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
- Use `{{choices.choice-id}}` for creator selections, such as `{{choices.assurance}}`. Creation and rebuilding substitute the saved choice, join multiple values with “and,” and HTML-escape them. Missing values fail generation rather than producing an incomplete feature. Keep the choice in its feature instead of duplicating it in Additional Features.
- `proficiencies` lists Equipment Proficiencies checkbox labels granted by the feature (for example `"Martial Weapons"`). A pure checkbox grant has empty `html` and an `omitReason`.
- Omit entries fully represented elsewhere, such as class skill grants or Instinct abilities. Keep species skill features and independent passive benefits.
- `actions` refers to names in `creation-actions.json`. Variants are placed inside their parent action; standalone actions get their own block. An entry may have empty `html` if its only purpose is an action grant.
- Class and subclass entries go to Class Features; species entries go to Species Features. An explicit `section: "Additional Features"` routes unusually long content there. There is no text-length heuristic.
- `concoctions` contains authored descriptions keyed by the creator's selected concoction names.
- `instincts` contains named, finished list-item HTML for the Instinct Abilities section. Nested options belong inside that item. Spell-based Instinct references are still added from the selected spells.
- `instinctOptions` adds authored nested options to a named ability (for example Holy Decrees under Rally); `actionOptions` adds rules to a named action (Alacrity under Prayer).
- `feats` contains the authored Feats text and feat-granted Instincts. Creator requirements are not printed on the sheet.
- Empty `html` has an `omitReason` recording where the benefit is represented. Mixed features retain their passive benefit and separately supply their Instincts.
- `level: null` means the source has not assigned an unlock level. Preserve the data without granting the feature at an invented level.

The audit covers 14 classes, 27 subclasses, 8 species, 34 feats, and all 10 concoctions. Full-rule previews remain separate. Class/subclass Instincts, species Instincts, and feat Instincts no longer depend on extracting prose. Earth Bending's second casting and Fidgety's additional Instinct are explicit passive entries; Rally decrees and Prayer's Alacrity are routed to their parent abilities.

Update full rules and sheet summaries together when rules change. Loading an existing sheet must not rewrite its feature text. Rebuild is the explicit update path.

## Saved choices

The sheet JSON's `creation` object stores the creator selections (class, subclass, species, level, skills, feats, spells, equipment and other choices). Serialization, autosave and export retain it. Sheets without this object cannot be reliably rebuilt; do not guess choices from their rendered text.

File → Rebuild from Saved Choices opens the creator on Review with the stored selections. Current validation runs before replacement. The user can change selections and must confirm replacement of manual sheet edits. Current character/player names, portrait, appearance preferences and experience are retained. Other values are regenerated from current data.

Before creation or rebuilding, the previous sheet is saved in browser storage. File → Restore Before Creation / Rebuild restores that single recovery copy. This is local to the browser, not a substitute for exporting a character file.
