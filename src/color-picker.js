import { applyAccent, DEFAULT_ACCENT } from './accent.js';

export function initColorPicker(save) {
  const dialog = document.createElement('dialog');
  dialog.className = 'accent-picker';
  dialog.setAttribute('aria-labelledby', 'accent-picker-title');
  dialog.innerHTML = `<h2 id="accent-picker-title">Custom color</h2>
    <div class="accent-wheel" aria-hidden="true"><span></span></div>
    <label>Hue <input type="range" name="h" min="0" max="360" step="1"><output></output></label>
    <label>Saturation <input type="range" name="s" min="0" max="100" step="1"><output></output></label>
    <label>Brightness <input type="range" name="v" min="0" max="100" step="1"><output></output></label>
    <label>Hex <input name="hex" type="text" maxlength="7" spellcheck="false" aria-label="Hex color"><span class="accent-preview"></span></label>
    <div class="accent-picker-buttons"><button type="button" data-cancel>Cancel</button><button type="button" data-done>Done</button></div>`;
  document.body.append(dialog);
  const wheel = dialog.querySelector('.accent-wheel');
  const marker = wheel.querySelector('span');
  const hexInput = dialog.querySelector('[name="hex"]');
  const ranges = [...dialog.querySelectorAll('input[type="range"]')];
  let h = 0, s = 0, v = 1, original = DEFAULT_ACCENT;

  function readHex(hex) {
    const [r, g, b] = hex.slice(1).match(/../g).map(n => parseInt(n, 16) / 255);
    const max = Math.max(r, g, b), delta = max - Math.min(r, g, b);
    h = delta === 0 ? h : 60 * (max === r ? ((g - b) / delta + 6) % 6 : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4);
    s = max ? delta / max : 0;
    v = max;
  }
  function update(publish = true) {
    const channel = n => {
      const k = (n + h / 60) % 6;
      return Math.round(255 * v * (1 - s * Math.max(0, Math.min(k, 4 - k, 1)))).toString(16).padStart(2, '0');
    };
    const hex = `#${channel(5)}${channel(3)}${channel(1)}`;
    ranges.forEach((input, i) => {
      input.value = Math.round([h, s * 100, v * 100][i]);
      input.nextElementSibling.value = `${input.value}${i ? '%' : '°'}`;
    });
    hexInput.value = hex;
    hexInput.removeAttribute('aria-invalid');
    marker.style.left = `${50 + Math.cos(h * Math.PI / 180) * s * 50}%`;
    marker.style.top = `${50 + Math.sin(h * Math.PI / 180) * s * 50}%`;
    wheel.style.setProperty('--wheel-brightness', v);
    dialog.querySelector('.accent-preview').style.background = hex;
    if (publish) { applyAccent(hex); save(); }
  }
  function point(event) {
    const rect = wheel.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    h = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    s = Math.min(1, Math.hypot(x, y) * 2);
    update();
  }
  wheel.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    wheel.setPointerCapture(event.pointerId);
    point(event);
  });
  wheel.addEventListener('pointermove', event => { if (wheel.hasPointerCapture(event.pointerId)) point(event); });
  wheel.addEventListener('pointerup', event => { if (wheel.hasPointerCapture(event.pointerId)) wheel.releasePointerCapture(event.pointerId); });
  ranges.forEach(input => input.addEventListener('input', () => {
    h = +ranges[0].value; s = +ranges[1].value / 100; v = +ranges[2].value / 100;
    update();
  }));
  hexInput.addEventListener('input', () => {
    const hex = hexInput.value.startsWith('#') ? hexInput.value : `#${hexInput.value}`;
    if (!/^#[0-9a-f]{6}$/i.test(hex)) { hexInput.setAttribute('aria-invalid', 'true'); return; }
    readHex(hex); update();
  });
  const cancel = () => { applyAccent(original); save(); dialog.close(); };
  dialog.addEventListener('cancel', event => { event.preventDefault(); cancel(); });
  dialog.querySelector('[data-cancel]').addEventListener('click', cancel);
  dialog.querySelector('[data-done]').addEventListener('click', () => dialog.close());
  document.getElementById('color-custom').addEventListener('click', () => {
    original = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || DEFAULT_ACCENT;
    readHex(original); update(false); dialog.showModal();
  });
}
