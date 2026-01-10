import './style.css'

const renderHeaderField = (label, placeholder, flex = 1) => `
  <div class="header-field-container" style="flex: ${flex};
">
    <span class="header-label">${label}:</span>
    <span class="editable-field header-editable" contenteditable="true" data-placeholder="${placeholder}" style="flex-grow: 1;"></span>
  </div>
`

const renderDefenseRow = (label, placeholder, icon = null) => `
  <div class="defense-row">
    <div class="stat-icon">
      ${icon ? `<img src="/icons/${icon}.svg" width="18" height="18" alt="${label} Icon">` : ''}
    </div>
    <span class="defense-label">${label}:</span>
    <span class="editable-field defense-editable" contenteditable="true" data-placeholder="${placeholder}" style="flex-grow: 1; padding-left: 5px;"></span>
  </div>
`

const renderSection = (title, content, isStructured = false) => `
  <div class="section-box">
    <div class="section-header">${title}</div>
    <div class="section-content ${isStructured ? 'section-content-structured' : 'editable-field'}" 
         ${isStructured ? '' : 'contenteditable="true"'} 
         data-placeholder="Enter ${title.toLowerCase()}...">
      ${content}
    </div>
  </div>
`

const defenseContent = `
  <div class="defense-container">
    <div class="defense-row">
      <div class="stat-icon"><img src="/icons/heart.svg" width="18" height="18" alt="HP Icon"></div>
      <span class="defense-label">Health Points (HP):</span>
      <div class="hp-split">
        <span class="editable-field defense-editable" contenteditable="true" data-placeholder="Cur" style="min-width: 25px; text-align: right;"></span>
        <span class="hp-slash">/</span>
        <span class="editable-field defense-editable" contenteditable="true" data-placeholder="Max" style="min-width: 25px;"></span>
      </div>
    </div>
    ${renderDefenseRow('Damage Reduction (DR)', '0', 'armor')}
    <div class="defense-separator"></div>
    ${renderDefenseRow('Deflection', '0')}
    ${renderDefenseRow('Fortitude', '0')}
    ${renderDefenseRow('Will', '0')}
    <div class="defense-separator"></div>
    <div style="margin-top: 6px;">
      <div class="defense-subsection-label">Armor Training:</div>
      <div class="checkbox-group">
        <label class="checkbox-item"><input type="checkbox"> Light</label>
        <label class="checkbox-item"><input type="checkbox"> Medium</label>
        <label class="checkbox-item"><input type="checkbox"> Heavy</label>
      </div>
    </div>
    <div style="margin-top: 6px;">
      <div class="defense-subsection-label">Shield Training:</div>
      <div class="checkbox-group">
        <label class="checkbox-item"><input type="checkbox"> Heavy Shields</label>
        <label class="checkbox-item"><input type="checkbox"> Tower Shields</label>
      </div>
    </div>
  </div>
`

const renderSkillRow = () => `
  <div class="skill-row">
    <span class="editable-field skill-name" contenteditable="true" data-placeholder="Skill"></span>
    <span class="editable-field skill-bonus" contenteditable="true" data-placeholder="+0"></span>
  </div>
`

const skillsContent = `
  <div class="skills-container">
    ${renderSkillRow()}
    ${renderSkillRow()}
    ${renderSkillRow()}
    ${renderSkillRow()}
    ${renderSkillRow()}
    ${renderSkillRow()}
    ${renderSkillRow()}
    ${renderSkillRow()}
  </div>
`

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
            ${renderSection('Defenses', defenseContent, true)}
            ${renderSection('Speed', '')}
            ${renderSection('Skills', skillsContent, true)}
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

// Helper to handle placeholders in contenteditable
document.querySelector('#app').addEventListener('input', (e) => {
  const el = e.target;
  if (el.classList.contains('editable-field')) {
    if (el.innerHTML === '<br>' || el.innerText === '\n' || el.innerText.trim() === '') {
      if (el.innerText.trim() === '') el.replaceChildren();
    }
  }
});

// Initial cleanup
document.querySelectorAll('.editable-field').forEach(el => {
  if (el.innerText.trim() === '') el.replaceChildren();
});