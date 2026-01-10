import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="top-bar">
    <div class="menu-item">
      File
      <div class="dropdown-content">
        <div>New Character</div>
        <div>Open...</div>
        <div>Save</div>
        <div>Export PDF</div>
      </div>
    </div>
    <div class="menu-item">
      Edit
      <div class="dropdown-content">
        <div>Undo</div>
        <div>Redo</div>
        <div>Cut</div>
        <div>Copy</div>
        <div>Paste</div>
      </div>
    </div>
    <div class="menu-item">
      View
      <div class="dropdown-content">
        <div>Zoom In</div>
        <div>Zoom Out</div>
        <div>Fit Width</div>
      </div>
    </div>
  </div>
  <div class="main-area">
    <div class="editor-canvas">
      <div class="a4-page">
        <header class="sheet-header">
          <div style="flex-grow: 1;">
            <h1 class="editable-field" contenteditable="true" data-placeholder="Character Name" style="margin: 0; font-size: 24px; text-transform: uppercase; border-bottom: 1px dashed transparent;"></h1>
                                    <div style="display: flex; gap: 15px; margin-top: 10px;">
                                      <div style="border-bottom: 1px solid #ccc; flex: 2; display: flex; align-items: baseline;">
                                        <span class="header-label">Player Name:</span>
                                        <span class="editable-field header-editable" contenteditable="true" data-placeholder="..." style="flex-grow: 1;"></span>
                                      </div>
                                      <div style="border-bottom: 1px solid #ccc; flex: 1; display: flex; align-items: baseline;">
                                        <span class="header-label">Level:</span>
                                        <span class="editable-field header-editable" contenteditable="true" data-placeholder="0" style="flex-grow: 1;"></span>
                                      </div>
                                      <div style="border-bottom: 1px solid #ccc; flex: 1; display: flex; align-items: baseline;">
                                        <span class="header-label">Experience:</span>
                                        <span class="editable-field header-editable" contenteditable="true" data-placeholder="0" style="flex-grow: 1;"></span>
                                      </div>
                                    </div>
                                    <div style="display: flex; gap: 15px; margin-top: 10px;">
                                      <div style="border-bottom: 1px solid #ccc; flex: 1; display: flex; align-items: baseline;">
                                        <span class="header-label">Class:</span>
                                        <span class="editable-field header-editable" contenteditable="true" data-placeholder="..." style="flex-grow: 1;"></span>
                                      </div>
                                      <div style="border-bottom: 1px solid #ccc; flex: 1; display: flex; align-items: baseline;">
                                        <span class="header-label">Species:</span>
                                        <span class="editable-field header-editable" contenteditable="true" data-placeholder="..." style="flex-grow: 1;"></span>
                                      </div>
                                    </div>          </div>
          <div style="width: 40mm; height: 18mm; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 10px; margin-left: 20px; flex-shrink: 0;">
            LOGO / RPG SYSTEM
          </div>
        </header>
        
        <main class="sheet-middle">
          <section class="sheet-column">
            <div class="section-box">
              <div class="section-header">Defenses</div>
              <div class="section-content">
                <div style="display: flex; flex-direction: column; gap: 12px;">
                  <div style="display: flex; align-items: center; border-bottom: 1px solid #ccc; padding-bottom: 4px;">
                    <div style="display: flex; align-items: center; margin-right: 8px;">
                      <img src="/icons/heart.svg" width="18" height="18" alt="Heart Icon">
                    </div>
                    <span style="font-size: 11px; color: #666; font-family: Inter, sans-serif; text-transform: uppercase; margin-right: 8px; font-weight: bold; white-space: nowrap;">Health Points (HP):</span>
                    <div style="display: flex; align-items: center; flex-grow: 1; font-size: 20px; gap: 5px;">
                      <span class="editable-field" contenteditable="true" data-placeholder="Cur" style="min-width: 25px; text-align: right; outline: none;"></span>
                      <span style="font-family: Inter, sans-serif; color: #999; font-size: 16px;">/</span>
                      <span class="editable-field" contenteditable="true" data-placeholder="Max" style="min-width: 25px; outline: none;"></span>
                    </div>
                  </div>
                  <div style="display: flex; align-items: center; border-bottom: 1px solid #ccc; padding-bottom: 4px;">
                    <div style="display: flex; align-items: center; margin-right: 8px;">
                      <img src="/icons/armor.svg" width="18" height="18" alt="Armor Icon">
                    </div>
                    <span style="font-size: 11px; color: #666; font-family: Inter, sans-serif; text-transform: uppercase; margin-right: 8px; font-weight: bold; white-space: nowrap;">Damage Reduction (DR):</span>
                    <span class="editable-field" contenteditable="true" data-placeholder="0" style="flex-grow: 1; font-size: 20px; padding-left: 5px;"></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="section-box">
              <div class="section-header">Speed</div>
              <div class="section-content editable-field" contenteditable="true" data-placeholder="Enter speed details..."></div>
            </div>
            <div class="section-box">
              <div class="section-header">Skills</div>
              <div class="section-content editable-field" contenteditable="true" data-placeholder="List skills and bonuses..."></div>
            </div>
          </section>
          
          <section class="sheet-column">
            <div class="section-box">
              <div class="section-header">Main Actions</div>
              <div class="section-content editable-field" contenteditable="true" data-placeholder="Attacks, spells, etc."></div>
            </div>
            <div class="section-box">
              <div class="section-header">Features</div>
              <div class="section-content editable-field" contenteditable="true" data-placeholder="Traits, feats, abilities..."></div>
            </div>
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
    // Some browsers leave a <br> or whitespace. 
    // If it's visually empty, make it truly empty for CSS :empty
    if (el.innerHTML === '<br>' || el.innerText === '\n' || el.innerText.trim() === '') {
      if (el.innerText.trim() === '') {
        el.replaceChildren();
      }
    }
  }
});

// Initial setup to ensure all empty fields are truly empty
document.querySelectorAll('.editable-field').forEach(el => {
  if (el.innerText.trim() === '') el.replaceChildren();
});
