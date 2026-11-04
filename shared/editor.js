// Shared editor tools for both dependency-free generators.
(() => {
  const panel = document.getElementById('controls');
  const capture = () => Object.fromEntries(Object.entries(controls).map(([key, input]) =>
    [key, input.type === 'checkbox' ? input.checked : input.value]));
  const restore = (state) => {
    Object.entries(state).forEach(([key, value]) => {
      if (controls[key].type === 'checkbox') controls[key].checked = value;
      else controls[key].value = value;
    });
    drawPreview();
  };
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const initial = capture();
  const presetStates = new Map();

  // Render real preset artwork instead of approximating it with decorations.
  document.querySelectorAll('[data-preset]').forEach(button => {
    applyPreset(button.dataset.preset);
    presetStates.set(button.dataset.preset, capture());
    const thumbnail = document.createElement('canvas');
    thumbnail.width = thumbnail.height = 180;
    const context = thumbnail.getContext('2d');
    context.scale(0.5, 0.5);
    renderToContext(context, 360, 360, getSettings());
    const image = document.createElement('img');
    image.src = thumbnail.toDataURL('image/png');
    image.alt = '';
    image.width = image.height = 90;
    const label = document.createElement('span');
    label.textContent = button.textContent;
    button.replaceChildren(image, label);
  });
  restore(initial);

  panel.querySelectorAll('.group').forEach(group => {
    const heading = group.querySelector('h3');
    const details = document.createElement('details');
    details.className = 'group control-section';
    details.open = heading.textContent === 'Presets';
    const summary = document.createElement('summary');
    summary.textContent = heading.textContent;
    heading.remove();
    details.append(summary, ...group.childNodes);
    group.replaceWith(details);
  });
  // Associate existing sibling labels with their controls.
  panel.querySelectorAll('label').forEach(label => {
    const input = label.nextElementSibling;
    if (input?.matches('input, select')) label.htmlFor = input.id;
  });

  const toolbar = document.createElement('div');
  toolbar.className = 'editor-toolbar';
  toolbar.setAttribute('role', 'toolbar');
  toolbar.setAttribute('aria-label', 'Artwork actions');
  const undo = document.createElement('button');
  undo.type = 'button';
  undo.id = 'undo';
  undo.textContent = '↶ Undo';
  undo.title = 'Undo (Ctrl/Cmd+Z)';
  const exportButton = document.getElementById('downloadPngTop');
  exportButton.textContent = 'Export PNG';
  exportButton.classList.add('primary-action');
  toolbar.append(undo, exportButton);
  document.querySelector('.preview-panel').prepend(toolbar);
  document.querySelector('.mobile-preview-actions').remove();

  const history = [initial];
  const artState = state => Object.fromEntries(Object.entries(state).filter(([key]) => key !== 'exportSize'));
  const sync = () => {
    const current = capture();
    undo.disabled = history.length === 1 && equal(current, history[0]);
    document.querySelectorAll('[data-preset]').forEach(button => {
      const active = equal(artState(current), artState(presetStates.get(button.dataset.preset)));
      button.setAttribute('aria-pressed', String(active));
    });
  };
  const commit = () => {
    const current = capture();
    if (!equal(current, history[history.length - 1])) {
      history.push(current);
      if (history.length > 100) history.shift();
    }
    sync();
  };
  undo.addEventListener('click', () => {
    // An unfinished slider gesture is also reversible in one step.
    if (equal(capture(), history[history.length - 1]) && history.length > 1) history.pop();
    restore(history[history.length - 1]);
    sync();
  });
  panel.addEventListener('input', sync);
  panel.addEventListener('change', commit);
  panel.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', commit));
  document.addEventListener('keydown', event => {
    if (!(event.ctrlKey || event.metaKey) || event.shiftKey || event.altKey || event.key.toLowerCase() !== 'z') return;
    if (event.target.matches('textarea, input:not([type=range]):not([type=checkbox]), [contenteditable=true]')) return;
    event.preventDefault();
    if (!undo.disabled) undo.click();
  });
  sync();
})();
