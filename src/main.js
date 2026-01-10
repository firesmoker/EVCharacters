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
            <h1 class="editable-field" contenteditable="true" style="margin: 0; font-size: 24px; text-transform: uppercase; border-bottom: 1px dashed transparent;">Character Name</h1>
            <div style="display: flex; gap: 15px; margin-top: 10px;">
              <div style="font-size: 11px; border-bottom: 1px solid #ccc; flex: 2; display: flex;">
                <span style="color: #666; margin-right: 4px;">Player Name:</span>
                <span class="editable-field" contenteditable="true" style="flex-grow: 1; outline: none;"></span>
              </div>
              <div style="font-size: 11px; border-bottom: 1px solid #ccc; flex: 1; display: flex;">
                <span style="color: #666; margin-right: 4px;">Level:</span>
                <span class="editable-field" contenteditable="true" style="flex-grow: 1; outline: none;"></span>
              </div>
              <div style="font-size: 11px; border-bottom: 1px solid #ccc; flex: 1; display: flex;">
                <span style="color: #666; margin-right: 4px;">Experience:</span>
                <span class="editable-field" contenteditable="true" style="flex-grow: 1; outline: none;"></span>
              </div>
            </div>
            <div style="display: flex; gap: 15px; margin-top: 10px;">
              <div style="font-size: 11px; border-bottom: 1px solid #ccc; flex: 1; display: flex;">
                <span style="color: #666; margin-right: 4px;">Class:</span>
                <span class="editable-field" contenteditable="true" style="flex-grow: 1; outline: none;"></span>
              </div>
              <div style="font-size: 11px; border-bottom: 1px solid #ccc; flex: 1; display: flex;">
                <span style="color: #666; margin-right: 4px;">Species:</span>
                <span class="editable-field" contenteditable="true" style="flex-grow: 1; outline: none;"></span>
              </div>
            </div>
          </div>
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
                    <div style="display: flex; align-items: center; color: #cc0000; margin-right: 8px;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01z"/>
                      </svg>
                    </div>
                    <span style="font-size: 11px; color: #666; font-family: Inter, sans-serif; text-transform: uppercase; margin-right: 8px; font-weight: bold; white-space: nowrap;">Health Points (HP):</span>
                    <span class="editable-field" contenteditable="true" style="flex-grow: 1; font-size: 20px; padding-left: 5px;"></span>
                  </div>
                  <div style="display: flex; align-items: center; border-bottom: 1px solid #ccc; padding-bottom: 4px;">
                    <div style="display: flex; align-items: center; color: #444; margin-right: 8px;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7.2 7.2 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.2 7.2 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
                      </svg>
                    </div>
                    <span style="font-size: 11px; color: #666; font-family: Inter, sans-serif; text-transform: uppercase; margin-right: 8px; font-weight: bold; white-space: nowrap;">Damage Reduction (DR):</span>
                    <span class="editable-field" contenteditable="true" style="flex-grow: 1; font-size: 20px; padding-left: 5px;"></span>
                  </div>
                </div>
              </div>
            </div>
            <div class="section-box">
              <div class="section-header">Speed</div>
              <div class="section-content" contenteditable="true"></div>
            </div>
            <div class="section-box">
              <div class="section-header">Skills</div>
              <div class="section-content" contenteditable="true"></div>
            </div>
          </section>
          
          <section class="sheet-column">
            <div class="section-box">
              <div class="section-header">Main Actions</div>
              <div class="section-content" contenteditable="true"></div>
            </div>
            <div class="section-box">
              <div class="section-header">Features</div>
              <div class="section-content" contenteditable="true"></div>
            </div>
          </section>
        </main>
      </div>
    </div>
  </div>
`
