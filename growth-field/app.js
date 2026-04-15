const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const previewPanel = document.querySelector(".preview-panel");

const controls = {
  seedCount: document.getElementById("seedCount"),
  steps: document.getElementById("steps"),
  stepLength: document.getElementById("stepLength"),
  fieldScale: document.getElementById("fieldScale"),
  curl: document.getElementById("curl"),
  swirl: document.getElementById("swirl"),
  noise: document.getElementById("noise"),
  spread: document.getElementById("spread"),
  startJitter: document.getElementById("startJitter"),
  centerBias: document.getElementById("centerBias"),
  lineWidth: document.getElementById("lineWidth"),
  lineOpacity: document.getElementById("lineOpacity"),
  taper: document.getElementById("taper"),
  palette: document.getElementById("palette"),
  background: document.getElementById("background"),
  contrast: document.getElementById("contrast"),
  exportSize: document.getElementById("exportSize"),
};

const valueLabels = {
  seedCount: document.getElementById("seedCountVal"),
  steps: document.getElementById("stepsVal"),
  stepLength: document.getElementById("stepLengthVal"),
  fieldScale: document.getElementById("fieldScaleVal"),
  curl: document.getElementById("curlVal"),
  swirl: document.getElementById("swirlVal"),
  noise: document.getElementById("noiseVal"),
  spread: document.getElementById("spreadVal"),
  startJitter: document.getElementById("startJitterVal"),
  centerBias: document.getElementById("centerBiasVal"),
  lineWidth: document.getElementById("lineWidthVal"),
  lineOpacity: document.getElementById("lineOpacityVal"),
  taper: document.getElementById("taperVal"),
  contrast: document.getElementById("contrastVal"),
};

const presets = {
  roots: {
    seedCount: 900, steps: 120, stepLength: 2.2, fieldScale: 0.010, curl: 1.2, swirl: 0.35, noise: 0.45,
    spread: 0.92, startJitter: 0.18, centerBias: 0.15, lineWidth: 1.1, lineOpacity: 0.26, taper: 0.65,
    palette: "moss", background: "black", contrast: 1.0
  },
  drift: {
    seedCount: 700, steps: 180, stepLength: 1.6, fieldScale: 0.006, curl: 0.5, swirl: -0.2, noise: 0.82,
    spread: 1.0, startJitter: 0.4, centerBias: -0.2, lineWidth: 0.9, lineOpacity: 0.16, taper: 0.5,
    palette: "ocean", background: "black", contrast: 1.1
  },
  vortex: {
    seedCount: 1200, steps: 140, stepLength: 2.0, fieldScale: 0.014, curl: 1.0, swirl: 1.35, noise: 0.30,
    spread: 0.86, startJitter: 0.12, centerBias: 0.3, lineWidth: 1.0, lineOpacity: 0.2, taper: 0.72,
    palette: "ember", background: "black", contrast: 1.15
  },
  contour: {
    seedCount: 1000, steps: 110, stepLength: 2.8, fieldScale: 0.018, curl: 2.2, swirl: 0.0, noise: 0.18,
    spread: 1.05, startJitter: 0.08, centerBias: 0.0, lineWidth: 1.3, lineOpacity: 0.18, taper: 0.35,
    palette: "bone", background: "paper", contrast: 0.95
  },
  mono: {
    seedCount: 1100, steps: 130, stepLength: 2.1, fieldScale: 0.011, curl: 1.1, swirl: 0.2, noise: 0.52,
    spread: 0.95, startJitter: 0.16, centerBias: 0.05, lineWidth: 1.0, lineOpacity: 0.22, taper: 0.62,
    palette: "mono", background: "black", contrast: 1.0
  },
  paper: {
    seedCount: 680, steps: 160, stepLength: 1.8, fieldScale: 0.007, curl: 0.75, swirl: -0.1, noise: 0.7,
    spread: 1.0, startJitter: 0.3, centerBias: -0.1, lineWidth: 0.8, lineOpacity: 0.14, taper: 0.7,
    palette: "bone", background: "paper", contrast: 0.9
  }
};

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function mix(a, b, t) { return a + (b - a) * t; }

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function lerpColor(c1, c2, t) {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  return {
    r: Math.round(mix(a.r, b.r, t)),
    g: Math.round(mix(a.g, b.g, t)),
    b: Math.round(mix(a.b, b.b, t)),
  };
}

function rgbString(c, a = 1) {
  return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;
}

function getPaletteStops(name) {
  switch (name) {
    case "ember": return ["#28110c", "#7b2d16", "#d45a1d", "#f2ba6f"];
    case "ocean": return ["#0e1820", "#123b52", "#2e7c92", "#a7d8dd"];
    case "bone": return ["#41392f", "#83745f", "#c7b69a", "#f3eadc"];
    case "mono": return ["#141414", "#505050", "#9c9c9c", "#f0f0f0"];
    case "moss":
    default: return ["#11180f", "#31442c", "#6f8f4e", "#d8d69a"];
  }
}

function samplePalette(name, t, contrast = 1) {
  const stops = getPaletteStops(name);
  const adjusted = clamp(Math.pow(clamp(t, 0, 1), 1 / contrast), 0, 1);
  if (adjusted <= 0.3333) return lerpColor(stops[0], stops[1], adjusted / 0.3333);
  if (adjusted <= 0.6666) return lerpColor(stops[1], stops[2], (adjusted - 0.3333) / 0.3333);
  return lerpColor(stops[2], stops[3], (adjusted - 0.6666) / 0.3334);
}

function getBackgroundColor(background) {
  switch (background) {
    case "paper": return "#efe7d3";
    case "charcoal": return "#111111";
    case "transparent": return null;
    case "black":
    default: return "#000000";
  }
}

function getSettings() {
  return {
    seedCount: parseInt(controls.seedCount.value, 10),
    steps: parseInt(controls.steps.value, 10),
    stepLength: parseFloat(controls.stepLength.value),
    fieldScale: parseFloat(controls.fieldScale.value),
    curl: parseFloat(controls.curl.value),
    swirl: parseFloat(controls.swirl.value),
    noise: parseFloat(controls.noise.value),
    spread: parseFloat(controls.spread.value),
    startJitter: parseFloat(controls.startJitter.value),
    centerBias: parseFloat(controls.centerBias.value),
    lineWidth: parseFloat(controls.lineWidth.value),
    lineOpacity: parseFloat(controls.lineOpacity.value),
    taper: parseFloat(controls.taper.value),
    palette: controls.palette.value,
    background: controls.background.value,
    contrast: parseFloat(controls.contrast.value),
    exportSize: controls.exportSize.value,
  };
}

function updateLabels() {
  const s = getSettings();
  valueLabels.seedCount.textContent = s.seedCount;
  valueLabels.steps.textContent = s.steps;
  valueLabels.stepLength.textContent = s.stepLength.toFixed(2);
  valueLabels.fieldScale.textContent = s.fieldScale.toFixed(3);
  valueLabels.curl.textContent = s.curl.toFixed(2);
  valueLabels.swirl.textContent = s.swirl.toFixed(2);
  valueLabels.noise.textContent = s.noise.toFixed(2);
  valueLabels.spread.textContent = s.spread.toFixed(2);
  valueLabels.startJitter.textContent = s.startJitter.toFixed(2);
  valueLabels.centerBias.textContent = s.centerBias.toFixed(2);
  valueLabels.lineWidth.textContent = s.lineWidth.toFixed(2);
  valueLabels.lineOpacity.textContent = s.lineOpacity.toFixed(2);
  valueLabels.taper.textContent = s.taper.toFixed(2);
  valueLabels.contrast.textContent = s.contrast.toFixed(2);
}

function resizeCanvas() {
  const isMobile = window.innerWidth <= 900;
  const dpr = Math.max(window.devicePixelRatio || 1, 1);
  if (isMobile) {
    const availableWidth = Math.max(280, Math.min(previewPanel?.clientWidth || window.innerWidth, 560));
    const cssWidth = Math.floor(availableWidth);
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssWidth * dpr);
  } else {
    const panelWidth = document.getElementById("controls").offsetWidth;
    const cssWidth = Math.max(320, window.innerWidth - panelWidth);
    const cssHeight = window.innerHeight;
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
  }
  drawPreview();
}

function randomFromSeed(seed) {
  const x = Math.sin(seed * 127.1) * 43758.5453123;
  return x - Math.floor(x);
}

function noise2D(x, y) {
  return Math.sin(x * 12.9898 + y * 78.233) * 0.5 + Math.cos(x * 7.123 + y * 19.313) * 0.5;
}

function fieldAngle(x, y, settings, width, height) {
  const nx = x * settings.fieldScale;
  const ny = y * settings.fieldScale;
  const base = Math.sin(nx * (1.5 + settings.curl)) + Math.cos(ny * (1.2 + settings.curl * 0.5));
  const n = noise2D(nx * 2.7, ny * 2.2);
  const cx = width / 2;
  const cy = height / 2;
  const dx = x - cx;
  const dy = y - cy;
  const radial = Math.atan2(dy, dx) + Math.PI * 0.5;
  const blended = (base * (1 - settings.noise)) + (n * settings.noise * 2.0);
  return blended * Math.PI * 0.5 + radial * settings.swirl;
}

function makeSeeds(settings, width, height) {
  const seeds = [];
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.5 * settings.spread;
  for (let i = 0; i < settings.seedCount; i++) {
    const a = randomFromSeed(i + 1) * Math.PI * 2;
    const rr = Math.pow(randomFromSeed((i + 1) * 1.83), 0.75 - settings.centerBias * 0.35);
    const jx = (randomFromSeed((i + 1) * 4.11) - 0.5) * radius * settings.startJitter;
    const jy = (randomFromSeed((i + 1) * 7.77) - 0.5) * radius * settings.startJitter;
    seeds.push({
      x: cx + Math.cos(a) * radius * rr + jx,
      y: cy + Math.sin(a) * radius * rr + jy,
      t: i / Math.max(settings.seedCount - 1, 1)
    });
  }
  return seeds;
}

function drawLine(seed, settings, width, height) {
  let x = seed.x;
  let y = seed.y;
  const path = [{ x, y }];
  for (let i = 0; i < settings.steps; i++) {
    const angle = fieldAngle(x, y, settings, width, height);
    x += Math.cos(angle) * settings.stepLength;
    y += Math.sin(angle) * settings.stepLength;
    if (x < -40 || x > width + 40 || y < -40 || y > height + 40) break;
    path.push({ x, y });
  }
  if (path.length < 2) return;

  const color = samplePalette(settings.palette, seed.t, settings.contrast);
  for (let i = 0; i < path.length - 1; i++) {
    const p0 = path[i];
    const p1 = path[i + 1];
    const tt = i / Math.max(path.length - 2, 1);
    const widthNow = settings.lineWidth * (1 - settings.taper * tt * 0.9);
    ctx.strokeStyle = rgbString(color, settings.lineOpacity);
    ctx.lineWidth = Math.max(0.1, widthNow);
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
  }
}

function renderToContext(ctx, width, height, settings) {
  const bg = getBackgroundColor(settings.background);
  ctx.clearRect(0, 0, width, height);
  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const seeds = makeSeeds(settings, width, height);
  for (const seed of seeds) drawLine(seed, settings, width, height);
}

function drawPreview() {
  updateLabels();
  renderToContext(ctx, canvas.width, canvas.height, getSettings());
}

function applyPreset(name) {
  const preset = presets[name];
  if (!preset) return;
  Object.entries(preset).forEach(([key, value]) => {
    if (controls[key]) controls[key].value = value;
  });
  drawPreview();
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPNG() {
  const settings = getSettings();
  const exportCanvas = document.createElement("canvas");
  const exportCtx = exportCanvas.getContext("2d");
  let width, height;
  if (settings.exportSize === "screen") {
    width = canvas.width;
    height = canvas.height;
  } else {
    const targetLongSide = parseInt(settings.exportSize, 10);
    const aspect = canvas.width / canvas.height;
    if (canvas.width >= canvas.height) {
      width = targetLongSide;
      height = Math.round(targetLongSide / aspect);
    } else {
      height = targetLongSide;
      width = Math.round(targetLongSide * aspect);
    }
  }
  exportCanvas.width = width;
  exportCanvas.height = height;
  renderToContext(exportCtx, width, height, settings);
  exportCanvas.toBlob((blob) => {
    if (!blob) return;
    downloadBlob(blob, "growth-field.png");
  }, "image/png");
}

Object.values(controls).forEach((control) => {
  control.addEventListener("input", drawPreview);
  control.addEventListener("change", drawPreview);
});

document.querySelectorAll("[data-preset]").forEach((button) => {
  button.addEventListener("click", () => applyPreset(button.dataset.preset));
});

document.getElementById("downloadPng").addEventListener("click", exportPNG);
document.getElementById("downloadPngTop").addEventListener("click", exportPNG);

let sliderTouch = null;

document.addEventListener("touchstart", (e) => {
  if (window.innerWidth > 900) return;
  const target = e.target;
  if (!(target instanceof HTMLInputElement) || target.type !== "range") return;
  const touch = e.touches[0];
  sliderTouch = { startX: touch.clientX, startY: touch.clientY, locked: false };
}, { passive: true });

document.addEventListener("touchmove", (e) => {
  if (!sliderTouch || window.innerWidth > 900) return;
  const touch = e.touches[0];
  const dx = Math.abs(touch.clientX - sliderTouch.startX);
  const dy = Math.abs(touch.clientY - sliderTouch.startY);
  if (!sliderTouch.locked && dy > 10 && dy > dx) {
    sliderTouch.locked = true;
    document.body.classList.add("is-scrolling-slider");
  }
}, { passive: true });

document.addEventListener("touchend", () => {
  sliderTouch = null;
  document.body.classList.remove("is-scrolling-slider");
}, { passive: true });

document.addEventListener("touchcancel", () => {
  sliderTouch = null;
  document.body.classList.remove("is-scrolling-slider");
}, { passive: true });

function updateMobileScrollState() {
  if (window.innerWidth <= 900 && window.scrollY > 110) document.body.classList.add("scrolled-mobile");
  else document.body.classList.remove("scrolled-mobile");
}

window.addEventListener("scroll", updateMobileScrollState, { passive: true });
window.addEventListener("resize", () => {
  resizeCanvas();
  updateMobileScrollState();
});

applyPreset("roots");
resizeCanvas();
updateMobileScrollState();
