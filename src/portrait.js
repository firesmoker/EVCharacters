export function readPortrait() {
  return {
    enabled: document.querySelector('#portrait-enabled').checked,
    image: document.querySelector('.portrait-frame img').getAttribute('src') || '',
    crop: JSON.parse(document.querySelector('.portrait-frame').dataset.crop || '{"zoom":1,"x":50,"y":50}')
  };
}

function cropImage(img, crop) {
  img.style.objectPosition = `${crop.x}% ${crop.y}%`;
  img.style.transformOrigin = `${crop.x}% ${crop.y}%`;
  img.style.transform = `scale(${crop.zoom})`;
}

export function writePortrait({ enabled = false, image = '', crop = {} } = {}) {
  const frame = document.querySelector('.portrait-frame');
  const img = frame.querySelector('img');
  // Saved characters embed raster images; never load an arbitrary external URL.
  image = /^data:image\/(png|jpeg|webp|gif);base64,/.test(image) ? image : '';
  document.querySelector('#portrait-enabled').checked = Boolean(enabled);
  frame.hidden = !enabled;
  if (image) img.src = image;
  else img.removeAttribute('src');
  img.hidden = !image;
  frame.querySelector('.portrait-placeholder').hidden = Boolean(image);
  crop = {
    zoom: Math.max(1, Math.min(3, Number(crop?.zoom) || 1)),
    x: Math.max(0, Math.min(100, Number.isFinite(crop?.x) ? crop.x : 50)),
    y: Math.max(0, Math.min(100, Number.isFinite(crop?.y) ? crop.y : 50))
  };
  frame.dataset.crop = JSON.stringify(crop);
  cropImage(img, crop);
  document.querySelector('.portrait-crop-button').hidden = !enabled || !image;
}

export function initPortrait(onChange) {
  const input = document.querySelector('#portrait-upload');
  const toggle = document.querySelector('#portrait-enabled');
  const frame = document.querySelector('.portrait-frame');
  const dialog = document.createElement('dialog');
  dialog.className = 'portrait-crop-dialog';
  dialog.setAttribute('aria-label', 'Adjust portrait crop');
  dialog.innerHTML = `<h2>Adjust portrait</h2>
    <div class="portrait-crop-preview"><img alt="Portrait crop preview"></div>
    <label>Zoom <input name="zoom" type="range" min="1" max="3" step="0.05"></label>
    <label>Horizontal position <input name="x" type="range" min="0" max="100" step="1"></label>
    <label>Vertical position <input name="y" type="range" min="0" max="100" step="1"></label>
    <div class="portrait-crop-actions"><button type="button" data-crop="reset">Reset</button><button type="button" data-crop="cancel">Cancel</button><button type="button" data-crop="apply">Apply crop</button></div>`;
  document.body.append(dialog);
  const preview = dialog.querySelector('img');
  const cropInputs = [...dialog.querySelectorAll('input')];
  const previewCrop = () => Object.fromEntries(cropInputs.map(el => [el.name, Number(el.value)]));
  const setPreview = crop => {
    cropInputs.forEach(el => { el.value = crop[el.name]; });
    cropImage(preview, crop);
  };
  const openCrop = () => {
    const portrait = readPortrait();
    if (!portrait.image) return;
    preview.src = portrait.image;
    setPreview(portrait.crop);
    dialog.showModal();
  };
  document.querySelector('.portrait-crop-button').addEventListener('click', openCrop);
  dialog.addEventListener('input', () => cropImage(preview, previewCrop()));
  dialog.addEventListener('click', event => {
    const action = event.target.dataset.crop;
    if (action === 'reset') setPreview({ zoom: 1, x: 50, y: 50 });
    if (action === 'cancel') dialog.close();
    if (action === 'apply') {
      input.dispatchEvent(new Event('sheet-edit-start', { bubbles: true }));
      writePortrait({ ...readPortrait(), crop: previewCrop() });
      input.dispatchEvent(new Event('sheet-edit-end', { bubbles: true }));
      dialog.close(); onChange();
    }
  });
  let revision = 0;
  document.addEventListener('sheet-loaded', () => { revision++; dialog.close(); });
  toggle.addEventListener('change', () => {
    writePortrait(readPortrait());
    onChange();
    window.dispatchEvent(new Event('resize'));
  });
  frame.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); input.click();
    }
  });
  input.addEventListener('change', async () => {
    const file = input.files[0];
    input.value = '';
    if (!file) return;
    const currentRevision = ++revision;
    const url = URL.createObjectURL(file);
    try {
      if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) throw new Error('Choose a PNG, JPEG, WebP or GIF image.');
      const img = new Image(); img.src = url;
      await img.decode();
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 768 / Math.max(img.width, img.height));
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      if (currentRevision !== revision) return;
      input.dispatchEvent(new Event('sheet-edit-start', { bubbles: true }));
      writePortrait({ enabled: true, image: canvas.toDataURL('image/jpeg', .85) });
      input.dispatchEvent(new Event('sheet-edit-end', { bubbles: true }));
      onChange();
      openCrop();
    } catch (error) {
      alert(error.message || 'This image could not be opened.');
    } finally { URL.revokeObjectURL(url); }
  });
}
