# Hybrid Architecture: Sync-on-Change Pattern

## 1. Concept
The **Hybrid Approach** (or "Sync-on-Change") sits between the current **DOM-as-State** model and a full **State-Driven** framework (like React). 

In this model, the DOM remains the primary way users interact with data, but a shadow **JavaScript State Object** is maintained in memory. Whenever a user edits a field, the State Object is updated. Whenever the State Object changes, specific "derived" fields (like totals or calculated stats) are updated in the DOM.

## 2. Why consider it?
This approach is best if you want the power of automated calculations and easy saving without the overhead of a full framework.
*   **Calculations:** You can perform complex math (e.g., `Max HP = (Level * 10) + Con`) without constantly scraping and parsing strings from HTML.
*   **Reliable Saving:** `saveToCSV` becomes a simple serialization of the JavaScript object, rather than a fragile crawl of the DOM tree.

## 3. How it works (Implementation)

### Step A: The State Object
A central object that mirrors the data fields:
```javascript
const state = {
  characterName: "",
  level: 1,
  stats: { strength: 10, dexterity: 10 },
  skills: [] // Array of objects
};
```

### Step B: The "Glue" Logic (Syncing)
You add a "Binding" layer to your global input handler:
```javascript
const handleInput = (e) => {
  const field = e.target.dataset.field; // Using data attributes to link DOM to State
  const value = e.target.innerText;

  // 1. Update State
  updateState(field, value);

  // 2. Trigger Calculations
  recalculateDerivedValues();
};
```

### Step C: Derived Updates
When the state changes, only the "calculated" parts of the UI are touched:
```javascript
const recalculateDerivedValues = () => {
  const totalAC = 10 + calculateModifier(state.stats.dexterity);
  document.querySelector('#ac-val').innerText = totalAC;
};
```

## 4. Pros and Cons

### Pros
*   **Robust Persistence:** Saving/Loading is 100% reliable because it uses a clean data object.
*   **Automated Math:** You can build a very "smart" character sheet that does the heavy lifting for the player.
*   **No Re-rendering:** Unlike React, it doesn't replace the HTML, so `contenteditable` fields don't lose focus or cursor position.

### Cons
*   **The "Split Brain" Risk:** If the UI and the State Object get out of sync (e.g., a field is missing a data-attribute), the "Save" file will be wrong even if the screen looks right.
*   **Boilerplate:** You have to manually write code to "bind" every single input field to a property in the state object.
*   **Maintenance:** Every time you add a new field to the HTML, you must remember to add it to the State Object and the Sync logic.

## 5. Summary Recommendation
For **EVCharacters**, the Hybrid approach is only recommended if you plan to add **automatic calculations** (e.g., auto-filling Armor Class or calculating Skill Bonuses based on Attributes). 

If the sheet remains a purely manual "digital piece of paper," the current **DOM-as-State** model is actually superior because it is simpler and has zero risk of data desynchronization.
