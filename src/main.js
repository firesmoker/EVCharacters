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
            <h1 style="margin: 0; font-size: 24px; text-transform: uppercase;">Character Name</h1>
            <div style="display: flex; gap: 15px; margin-top: 10px;">
              <span style="font-size: 11px; border-bottom: 1px solid #ccc; flex: 2;">Player Name:</span>
              <span style="font-size: 11px; border-bottom: 1px solid #ccc; flex: 1;">Level:</span>
              <span style="font-size: 11px; border-bottom: 1px solid #ccc; flex: 1;">Experience:</span>
            </div>
            <div style="display: flex; gap: 15px; margin-top: 10px;">
              <span style="font-size: 11px; border-bottom: 1px solid #ccc; flex: 1;">Class:</span>
              <span style="font-size: 11px; border-bottom: 1px solid #ccc; flex: 1;">Species:</span>
            </div>
          </div>
          <div style="width: 40mm; height: 18mm; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; font-size: 10px; margin-left: 20px; flex-shrink: 0;">
            LOGO / RPG SYSTEM
          </div>
        </header>
        
        <main class="sheet-middle">
          <section class="sheet-column">
            <div class="placeholder-box">Defenses</div>
            <div class="placeholder-box">Speed</div>
            <div class="placeholder-box">Skills</div>
          </section>
          
          <section class="sheet-column">
            <div class="placeholder-box">Main Actions</div>
            <div class="placeholder-box">Features</div>
          </section>
        </main>
      </div>
    </div>
  </div>
`
