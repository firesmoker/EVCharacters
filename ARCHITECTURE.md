# EVCharacters Architecture Documentation

## Overview
**EVCharacters** is a lightweight, single-page application (SPA) for managing "Eternal Valor" RPG character sheets. 

It is designed with a **"DOM-as-State"** philosophy: instead of maintaining a complex JavaScript object for the character data, the HTML DOM itself is the source of truth. The application reads from and writes directly to the DOM elements (`contenteditable` spans, inputs, checkboxes).

## Core Technologies
*   **Language:** Vanilla JavaScript (ES Modules).
*   **Build System:** Vite.
*   **Storage:** CSV files (the app imports/exports character data to local CSV files).
*   **Styling:** Native CSS.

## Architecture & Modules

The application is structured into four primary responsibilities:

### 1. Orchestration (`src/main.js`)
This module acts as the application's entry point and "controller."
*   **Initialization:** Bootstraps the application by rendering the initial UI layout.
*   **Event Delegation:** Instead of attaching listeners to every button or input, it attaches global listeners (`input`, `click`, `keydown`) to the root `#app` element. This allows the app to handle events for dynamic elements (like new skill rows) without needing to re-attach listeners.
*   **User Interaction:** It routes user actions (like clicking "Save", editing a field, or selecting an autocomplete suggestion) to the appropriate logic.

### 2. Rendering System (`src/components.js`)
This module serves as the "view" layer. It contains a collection of pure functions that return HTML strings.
*   **Stateless Components:** Components (like `renderHeader`, `renderSkillRow`) do not hold state. They simply return the HTML structure required for that section.
*   **Dynamic Row Factory:** It centralizes the logic for creating new dynamic items (e.g., adding a new Skill or Spell), ensuring that the View layer controls the HTML structure, not the Controller.
*   **A4 Layout:** The main app layout is designed to mimic a physical A4 paper sheet for easy printing.

### 3. Persistence (`src/io.js`)
This module handles data serialization and deserialization. Since there is no central state object, this module interfaces directly with the DOM.
*   **Saving (Scraping):** To save a file, it traverses the DOM, "scraping" values from headers, checkboxes, and dynamic lists, and serializes them into a CSV format.
*   **Loading (Populating):** To load a file, it parses the CSV and reconstructs the DOM state. It is smart enough to clear the current sheet and dynamically generate the correct number of rows (e.g., if the saved character has 5 spells, it creates 5 spell rows) before populating them.

### 4. Configuration (`src/data.js`)
A simple data file containing static constants, such as the lists of available skills, spells, and autocomplete options.

## Key Design Patterns

### DOM-as-State
The most distinct feature of this architecture. If a user types into a field, the state is updated because the state *is* the field.
*   **Pros:** Extremely simple, no state synchronization bugs, easy "What you see is what you get."
*   **Cons:** Business logic (like calculating total hit points) requires reading from the DOM, parsing the text, calculating, and writing back.

### Global Event Delegation
Because rows for skills and actions are added and removed dynamically by the user, we use event delegation on the root container. This avoids the complexity of managing thousands of individual event listeners.

### Data Synchronization
Some data appears in multiple places (e.g., the Character Name appears in the header of both pages). Elements share a `data-sync-id` attribute. When one is updated, the `main.js` controller automatically updates all other elements with the same ID.

## Directory Structure
```text
src/
├── main.js         # Controller: Handles events and coordination.
├── components.js   # View: Generates HTML templates.
├── io.js           # Model/Persistence: Reads/Writes DOM state to CSV.
├── data.js         # Config: Static lists and options.
├── style.css       # Visual styling.
```
