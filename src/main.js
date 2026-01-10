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
        <div style="text-align: center; border: 2px dashed #ccc; padding: 50px; height: 100%;">
          <h2>Character Sheet Page</h2>
          <p>This is where the character details will go.</p>
          <p>(A4 dimensions: 210mm x 297mm)</p>
        </div>
      </div>
    </div>
  </div>
`
