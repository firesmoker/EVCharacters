import './style.css'

/**
 * Renders a header field (e.g., Player Name, Level).
 */
const renderHeaderField = (label, placeholder, flex = 1) => `
  <div class="header-field-container" style="flex: ${flex};"><span class="header-label">${label}:</span><span class="editable-field header-editable" contenteditable="true" data-placeholder="${placeholder}" style="flex-grow: 1;"></span></div>
`

/**
 * Renders a row in the Defense section.
 */
const renderDefenseRow = (label, placeholder, icon = null) => `
  <div class="defense-row"><div class="stat-icon">${icon ? `<img src="/icons/${icon}.svg" width="18" height="18" alt="${label} Icon">` : ''}</div><span class="defense-label">${label}:</span><span class="editable-field defense-editable" contenteditable="true" data-placeholder="${placeholder}" style="flex-grow: 1; padding-left: 5px;"></span></div>
`

const SKILLS_LIST = [

  "Bartering", "Charm", "Deception", "Diplomacy", "Intimidation", "Leadership",

  "Manipulation", "Reasoning", "Knowledge", "Arcana", "History", "Nature",

  "Occult", "Politics", "Religion", "Warfare", "Perception", "Notice",

  "Movement", "Find Hidden Paths", "Find Hidden Objects", "Detect Traps",

  "Other", "Acrobatics", "Animal Handling", "Athletics", "Cooking", "Deduction",

  "Disguise", "Insight", "Mechanics", "Medicine", "Performance",

  "Sleight of Hand", "Sneak", "Survival"

];

const COMBAT_SKILLS_LIST = [
  "Melee Strike", "Ranged Strike", "Weapon Throw", "Magic", "Arcane Magic",
  "Bardic Magic", "Divine Magic", "Nature Magic", "Occult Magic",
  "Unarmed", "Unarmed Strike", "Grapple"
];

/**
 * Renders a standard dropdown menu.
 */
const renderDropdown = (options, className) => `
  <select class="${className}">
    <option value=""></option>
    ${options.map(opt => {
  const val = typeof opt === 'object' ? opt.value : opt;
  const label = typeof opt === 'object' ? opt.label : opt;
  return `<option value="${val}">${label}</option>`;
}).join('')}
  </select>
`

/**
 * Renders a skill row for Combat Skills and Skills sections.
 * @param {string[]|null} dropdownList - Array of strings for dropdown options, or null for text field.
 */
const renderSkillRow = (dropdownList = null) => {
  const nameField = dropdownList
    ? renderDropdown(dropdownList, "skill-name")
    : `<span class="editable-field skill-name" contenteditable="true" data-placeholder="Skill"></span>`;

  const bonusOptions = [
    { value: "5", label: "Trained (+5)" },
    { value: "10", label: "Expert (+10)" },
    { value: "15", label: "Master (+15)" },
    { value: "20", label: "Legend (+20)" }
  ];

  return `
    <div class="skill-row">
      ${nameField}
      ${renderDropdown(bonusOptions, "skill-bonus")}
      <button class="remove-row-btn" title="Remove Row">-</button>
    </div>
  `;
}



/**

 * Renders a generic section box.

 */
const renderSection = (title, content, options = {}) => {
  const { isStructured = false, isDynamic = false } = options;
  const contentClasses = [
    'section-content',
    isStructured ? 'section-content-structured' : 'editable-field',
    isDynamic ? 'dynamic-rows' : ''
  ].filter(Boolean).join(' ');

  return `
    <div class="section-box"><div class="section-header">${title}</div><div class="${contentClasses}" ${isStructured ? '' : 'contenteditable="true"'} data-placeholder="Enter ${title.toLowerCase()}...">${content}</div>${isDynamic ? '<button class="add-row-btn" title="Add Row">+</button>' : ''}</div>
  `
}

// Content for the structured Defense section
const defenseContent = `
  <div class="defense-container"><div class="defense-row"><div class="stat-icon"><img src="/icons/heart.svg" width="18" height="18" alt="HP Icon"></div><span class="defense-label">Health Points (HP):</span><div class="hp-split"><span class="editable-field defense-editable" contenteditable="true" data-placeholder="Cur" style="min-width: 25px; text-align: right;"></span><span class="hp-slash">/</span><span class="editable-field defense-editable" contenteditable="true" data-placeholder="Max" style="min-width: 25px;"></span></div></div>${renderDefenseRow('Damage Reduction (DR)', '0', 'armor')}<div class="defense-separator"></div>${renderDefenseRow('Deflection', '0')}${renderDefenseRow('Fortitude', '0')}${renderDefenseRow('Will', '0')}<div class="defense-separator"></div><div style="margin-top: 6px;"><div class="defense-subsection-label">Armor Training:</div><div class="checkbox-group"><label class="checkbox-item"><input type="checkbox"> Light</label><label class="checkbox-item"><input type="checkbox"> Medium</label><label class="checkbox-item"><input type="checkbox"> Heavy</label></div></div><div style="margin-top: 6px;"><div class="defense-subsection-label">Shield Training:</div><div class="checkbox-group"><label class="checkbox-item"><input type="checkbox"> Heavy Shields</label><label class="checkbox-item"><input type="checkbox"> Tower Shields</label></div></div></div>
`

// Initial state for dynamic sections
const initialCombatSkillRow = renderSkillRow(COMBAT_SKILLS_LIST);
const initialSkillRow = renderSkillRow(SKILLS_LIST);



// Render the application

document.querySelector('#app').innerHTML = `

  <div class="top-bar">

    <div class="menu-item">File<div class="dropdown-content"><div>New</div><div>Open</div><div>Save</div></div></div>

    <div class="menu-item">Edit<div class="dropdown-content"><div>Undo</div><div>Redo</div></div></div>

    <div class="menu-item">View<div class="dropdown-content"><div>Zoom In</div><div>Zoom Out</div></div></div>

  </div>

  <div class="main-area">

    <div class="editor-canvas">

      <div class="a4-page">

        <header class="sheet-header">

          <div style="flex-grow: 1;">

            <h1 class="editable-field sheet-title" contenteditable="true" data-placeholder="Character Name"></h1>

            <div class="header-row">

              ${renderHeaderField('Player Name', '...', 2)}

              ${renderHeaderField('Level', '0', 1)}

              ${renderHeaderField('Experience', '0', 1)}

            </div>

            <div class="header-row">

              ${renderHeaderField('Class', '...', 1)}

              ${renderHeaderField('Species', '...', 1)}

            </div>

          </div>

          <div class="logo-box">

            <img src="/Logo.png" alt="Eternal Valor Logo">

          </div>

        </header>

        

        <main class="sheet-middle">

          <section class="sheet-column">

            ${renderSection('Defenses', defenseContent, { isStructured: true })}

            ${renderSection('Speed', '')}

            ${renderSection('Combat Skills', initialCombatSkillRow, { isStructured: true, isDynamic: true })}

            ${renderSection('Skills', initialSkillRow, { isStructured: true, isDynamic: true })}

          </section>

          

          <section class="sheet-column">

            ${renderSection('Main Actions', '')}

            ${renderSection('Features', '')}

          </section>

        </main>

      </div>

    </div>

  </div>

`



// Event Listener: Handle truly empty contenteditable fields so placeholders appear

document.querySelector('#app').addEventListener('input', (e) => {

  const el = e.target;

  if (el.classList.contains('editable-field')) {

    if (el.innerHTML === '<br>' || el.innerText === '\n' || el.innerText.trim() === '') {

      if (el.innerText.trim() === '') el.replaceChildren();

    }

  }

});



// Event Listener: Handle dynamic row addition via "+" button and removal via "-" button

document.querySelector('#app').addEventListener('click', (e) => {

      // Add Row

      if (e.target.classList.contains('add-row-btn')) {

        const sectionBox = e.target.closest('.section-box');

        // Use textContent to get the actual text in the DOM, ignoring CSS text-transform

        const title = sectionBox.querySelector('.section-header').textContent.trim();

        const container = sectionBox ? sectionBox.querySelector('.dynamic-rows') : null;

        

        if (container) {

          let listToUse = null;

          if (title === 'Skills') listToUse = SKILLS_LIST;

          if (title === 'Combat Skills') listToUse = COMBAT_SKILLS_LIST;

    

          const tempDiv = document.createElement('div');

          tempDiv.innerHTML = renderSkillRow(listToUse);

          container.appendChild(tempDiv.firstElementChild);

        }

      }

  // Remove Row
  if (e.target.classList.contains('remove-row-btn')) {
    const row = e.target.closest('.skill-row');
    if (row) {
      row.remove();
    }
  }
});

// Initial cleanup: Ensure empty fields are truly empty on load
document.querySelectorAll('.editable-field').forEach(el => {
  if (el.innerText.trim() === '') el.replaceChildren();
});
