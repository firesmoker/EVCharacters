# EVCharacters Architecture Documentation

## Overview
**EVCharacters** is a lightweight, client-side single-page application (SPA) designed for managing "Eternal Valor" RPG character sheets. It is built with vanilla JavaScript and Vite, emphasizing a "DOM-as-state" architecture where the HTML document itself serves as the primary source of truth for character data.

## Core Technologies
*   **Framework:** Vanilla JavaScript (ES Modules).
*   **Build Tool:** Vite.
*   **Styling:** CSS (via `style.css`).
*   **Data Format:** CSV (for save/load persistence).

## Module Structure

### 1. Entry & Orchestration (`src/main.js`)
*   **Bootstrapping:** Initializes the application by calling `renderApp()` from `components.js`.
*   **Event Handling:** Implements a global event delegation strategy on the `#app` root to handle:
    *   **Autocomplete:** Manages suggestions for skills, spells, and bonuses.
    *   **Data Synchronization:** Updates all instances of a field (e.g., Character Name) when one is edited, using `data-sync-id`.
    *   **Dynamic UI:** Handles adding/removing rows for skills, actions, and spells.
    *   **File I/O:** Triggers CSV parsing logic when a file is uploaded.

### 2. Rendering System (`src/components.js`)
*   **Template Functions:** Uses pure functions that return HTML strings (e.g., `renderApp`, `renderSection`, `renderSkillRow`) to generate the UI.
*   **Layout:** Constructs a print-friendly A4 layout with specific sections for Attributes, Skills, Combat Actions, and Spellcasting.
*   **Component Composition:** High-level functions assemble smaller atomic components (like `renderHeaderField` or `renderAutocomplete`) into complete sections.

### 3. Data & Configuration (`src/data.js`)
*   **Static Constants:** Exports configuration arrays/objects used to populate autocomplete lists and dropdowns (e.g., `SKILLS_LIST`, `COMBAT_SKILLS_LIST`, `SPELLS_LIST`).

### 4. Input/Output (`src/io.js`)
*   **Persistence Strategy:** Since the state lives in the DOM, persistence is achieved by scraping or populating the HTML elements.
*   **`saveToCSV()`:** Traverses the DOM, identifying fields by their structure (headers, checkboxes, dynamic rows), and serializes them into a custom CSV format.
*   **`loadFromCSV(csv)`:** Parses the CSV, clears the current sheet, and reconstructs the DOM state. It dynamically creates necessary DOM elements (like skill rows) to match the saved data.

## Key Patterns
*   **DOM-as-State:** The application avoids a parallel JavaScript state object. `contenteditable` elements and `<input type="checkbox">` elements hold the active data.
*   **Event Delegation:** Interactions are captured at the root level to support dynamically added elements without needing to attach individual listeners.
*   **Content Synchronization:** Fields that appear in multiple places (like headers) are linked via `data-sync-id` attributes to ensure consistency.

## File Tree Summary
```text
src/
├── main.js         # Entry point, event listeners, and coordination
├── components.js   # HTML template generators and rendering logic
├── io.js           # CSV import/export logic and DOM scraping/population
├── data.js         # Static data lists for autocomplete and dropdowns
├── style.css       # Application styling
```
