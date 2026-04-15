const GOLDEN_ANGLE = 137.50776405003785;

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const previewPanel = document.querySelector(".preview-panel");

const controls = {
  points: document.getElementById("points"),
  angle: document.getElementById("angle"),
  lockGolden: document.getElementById("lockGolden"),
  framing: document.getElementById("framing"),
  radiusPower: document.getElementById("radiusPower"),
  seedProfile: document.getElementById("seedProfile"),
  size: document.getElementById("size"),
  sizeCurve: document.getElementById("sizeCurve"),
  shape: document.getElementById("shape"),
  stretch: document.getElementById("stretch"),
  showPetals: document.getElementById("showPetals"),
  petalType: document.getElementById("petalType"),
  petalCount: document.getElementById("petalCount"),
  petalLength: document.getElementById("petalLength"),
  petalWidth: document.getElementById("petalWidth"),
  petalOffset: document.getElementById("petalOffset"),
  petalOpacity: document.getElementById("petalOpacity"),
  showBackPetals: document.getElementById("showBackPetals"),
  backPetalLength: document.getElementById("backPetalLength"),
  backPetalWidth: document.getElementById("backPetalWidth"),
  backPetalOffset: document.getElementById("backPetalOffset"),
  backPetalOpacity: document.getElementById("backPetalOpacity"),
  backPetalRotation: document.getElementById("backPetalRotation"),
  palette: document.getElementById("palette"),
  background: document.getElementById("background"),
  contrast: document.getElementById("contrast"),
  exportSize: document.getElementById("exportSize"),
};

const valueLabels = {
  points: document.getElementById("pointsVal"),
  angle: document.getElementById("angleVal"),
  framing: document.getElementById("framingVal"),
  radiusPower: document.getElementById("radiusPowerVal"),
  size: document.getElementById("sizeVal"),
  sizeCurve: document.getElementById("sizeCurveVal"),
  stretch: document.getElementById("stretchVal"),
  petalCount: document.getElementById("petalCountVal"),
  petalLength: document.getElementById("petalLengthVal"),
  petalWidth: document.getElementById("petalWidthVal"),
  petalOffset: document.getElementById("petalOffsetVal"),
  petalOpacity: document.getElementById("petalOpacityVal"),
  backPetalLength: document.getElementById("backPetalLengthVal"),
  backPetalWidth: document.getElementById("backPetalWidthVal"),
  backPetalOffset: document.getElementById("backPetalOffsetVal"),
  backPetalOpacity: document.getElementById("backPetalOpacityVal"),
  backPetalRotation: document.getElementById("backPetalRotationVal"),
  contrast: document.getElementById("contrastVal"),
};

const presets = {
  sunflower: {
    points: 1800,
    angle: GOLDEN_ANGLE,
    lockGolden: true,
    framing: 0.78,
    radiusPower: 0.50,
    seedProfile: "natural",
    size: 2.4,
    sizeCurve: 0.55,
    shape: "ellipse",
    stretch: 1.45,
    showPetals: true,
    petalType: "classic",
    petalCount: 34,
    petalLength: 90,
    petalWidth: 26,
    petalOffset: 10,
    petalOpacity: 0.95,
    showBackPetals: true,
    backPetalLength: 120,
    backPetalWidth: 32,
    backPetalOffset: 24,
    backPetalOpacity: 0.72,
    backPetalRotation: 0.50,
    palette: "sunflower",
    background: "black",
    contrast: 1.00,
  },
  dense: {
    points: 4200,
    angle: GOLDEN_ANGLE,
    lockGolden: true,
    framing: 0.90,
    radiusPower: 0.50,
    seedProfile: "outerFlare",
    size: 2.0,
    sizeCurve: 1.10,
    shape: "circle",
    stretch: 1.4,
    showPetals: false,
    petalType: "classic",
    petalCount: 34,
    petalLength: 90,
    petalWidth: 26,
    petalOffset: 10,
    petalOpacity: 0.95,
    showBackPetals: false,
    backPetalLength: 120,
    backPetalWidth: 32,
    backPetalOffset: 24,
    backPetalOpacity: 0.72,
    backPetalRotation: 0.50,
    palette: "amber",
    background: "black",
    contrast: 1.15,
  },
  minimal: {
    points: 700,
    angle: GOLDEN_ANGLE,
    lockGolden: true,
    framing: 0.78,
    radiusPower: 0.50,
    seedProfile: "even",
    size: 4.6,
    sizeCurve: 0.35,
    shape: "circle",
    stretch: 1.4,
    showPetals: false,
    petalType: "classic",
    petalCount: 34,
    petalLength: 90,
    petalWidth: 26,
    petalOffset: 10,
    petalOpacity: 0.95,
    showBackPetals: false,
    backPetalLength: 120,
    backPetalWidth: 32,
    backPetalOffset: 24,
    backPetalOpacity: 0.72,
    backPetalRotation: 0.50,
    palette: "bone",
    background: "paper",
    contrast: 0.90,
  },
  study: {
    points: 1600,
    angle: GOLDEN_ANGLE,
    lockGolden: true,
    framing: 0.82,
    radiusPower: 0.50,
    seedProfile: "even",
    size: 2.2,
    sizeCurve: 0.0,
    shape: "circle",
    stretch: 1.0,
    showPetals: false,
    petalType: "classic",
    petalCount: 34,
    petalLength: 90,
    petalWidth: 26,
    petalOffset: 10,
    petalOpacity: 0.95,
    showBackPetals: false,
    backPetalLength: 120,
    backPetalWidth: 32,
    backPetalOffset: 24,
    backPetalOpacity: 0.72,
    backPetalRotation: 0.50,
    palette: "charcoal",
    background: "paper",
    contrast: 1.00,
  },
  amber: {
    points: 2000,
    angle: GOLDEN_ANGLE,
    lockGolden: true,
    framing: 0.84,
    radiusPower: 0.50,
    seedProfile: "outerFlare",
    size: 2.7,
    sizeCurve: 0.75,
    shape: "ellipse",
    stretch: 1.55,
    showPetals: true,
    petalType: "rounded",
    petalCount: 34,
    petalLength: 100,
    petalWidth: 28,
    petalOffset: 12,
    petalOpacity: 0.95,
    showBackPetals: true,
    backPetalLength: 130,
    backPetalWidth: 34,
    backPetalOffset: 28,
    backPetalOpacity: 0.70,
    backPetalRotation: 0.50,
    palette: "amber",
    background: "black",
    contrast: 1.20,
  },
  mono: {
    points: 1800,
    angle: GOLDEN_ANGLE,
    lockGolden: true,
    framing: 0.84,
    radiusPower: 0.50,
    seedProfile: "natural",
    size: 2.3,
    sizeCurve: 0.55,
    shape: "circle",
    stretch: 1.0,
    showPetals: false,
    petalType: "classic",
    petalCount: 34,
    petalLength: 90,
    petalWidth: 26,
    petalOffset: 10,
    petalOpacity: 0.95,
    showBackPetals: false,
    backPetalLength: 120,
    backPetalWidth: 32,
    backPetalOffset: 24,
    backPetalOpacity: 0.72,
    backPetalRotation: 0.50,
    palette: "mono",
    background: "black",
    contrast: 1.00,
  }
};

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function mix(a, b, t) {
  return a + (b - a) * t;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
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

function rgbString(c) {
  return `rgb(${c.r}, ${c.g}, ${c.b})`;
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

function getPaletteStops(name) {
  switch (name) {
    case "sunflower":
      return ["#2a1a10", "#7a4420", "#c57a1d", "#f2c14e"];
    case "charcoal":
      return ["#151515", "#353535", "#777777", "#e6e6e6"];
    case "bone":
      return ["#3b352d", "#8a7b66", "#cdbda2", "#f5eee2"];
    case "copper":
      return ["#1a1412", "#6d4024", "#b96f3a", "#f0bc7a"];
    case "mono":
      return ["#1c1c1c", "#555555", "#aaaaaa", "#f4f4f4"];
    case "amber":
    default:
      return ["#120c08", "#4a2412", "#9a4d19", "#d98c2b"];
  }
}

function samplePalette(name, t, contrast = 1) {
  const stops = getPaletteStops(name);
  const adjusted = clamp(Math.pow(t, 1 / contrast), 0, 1);

  if (adjusted <= 0.3333) {
    return lerpColor(stops[0], stops[1], adjusted / 0.3333);
  } else if (adjusted <= 0.6666) {
    return lerpColor(stops[1], stops[2], (adjusted - 0.3333) / 0.3333);
  } else {
    return lerpColor(stops[2], stops[3], (adjusted - 0.6666) / 0.3334);
  }
}

function getSettings() {
  const lockGolden = controls.lockGolden.checked;
  const angleDeg = lockGolden ? GOLDEN_ANGLE : parseFloat(controls.angle.value);

  return {
    points: parseInt(controls.points.value, 10),
    angleDeg,
    framing: parseFloat(controls.framing.value),
    radiusPower: parseFloat(controls.radiusPower.value),
    seedProfile: controls.seedProfile.value,
    size: parseFloat(controls.size.value),
    sizeCurve: parseFloat(controls.sizeCurve.value),
    shape: controls.shape.value,
    stretch: parseFloat(controls.stretch.value),
    showPetals: controls.showPetals.checked,
    petalType: controls.petalType.value,
    petalCount: parseInt(controls.petalCount.value, 10),
    petalLength: parseFloat(controls.petalLength.value),
    petalWidth: parseFloat(controls.petalWidth.value),
    petalOffset: parseFloat(controls.petalOffset.value),
    petalOpacity: parseFloat(controls.petalOpacity.value),
    showBackPetals: controls.showBackPetals.checked,
    backPetalLength: parseFloat(controls.backPetalLength.value),
    backPetalWidth: parseFloat(controls.backPetalWidth.value),
    backPetalOffset: parseFloat(controls.backPetalOffset.value),
    backPetalOpacity: parseFloat(controls.backPetalOpacity.value),
    backPetalRotation: parseFloat(controls.backPetalRotation.value),
    palette: controls.palette.value,
    background: controls.background.value,
    contrast: parseFloat(controls.contrast.value),
    exportSize: controls.exportSize.value,
    lockGolden,
  };
}

function applySeedProfile(profile) {
  const profileMap = {
    natural: 0.55,
    even: 0.00,
    denseCore: -0.85,
    outerFlare: 1.10,
    custom: parseFloat(controls.sizeCurve.value)
  };
  if (profile !== "custom") {
    controls.sizeCurve.value = profileMap[profile].toFixed(2);
  }
}

function inferSeedProfileFromSizeCurve(value) {
  const profiles = [
    ["natural", 0.55],
    ["even", 0.00],
    ["denseCore", -0.85],
    ["outerFlare", 1.10]
  ];
  for (const [name, target] of profiles) {
    if (Math.abs(value - target) < 0.03) return name;
  }
  return "custom";
}

function updateLabels() {
  const s = getSettings();
  valueLabels.points.textContent = s.points;
  valueLabels.angle.textContent = s.angleDeg.toFixed(1);
  valueLabels.framing.textContent = s.framing.toFixed(2);
  valueLabels.radiusPower.textContent = s.radiusPower.toFixed(2);
  valueLabels.size.textContent = s.size.toFixed(1);
  valueLabels.sizeCurve.textContent = s.sizeCurve.toFixed(2);
  valueLabels.stretch.textContent = s.stretch.toFixed(2);
  valueLabels.petalCount.textContent = s.petalCount;
  valueLabels.petalLength.textContent = s.petalLength.toFixed(0);
  valueLabels.petalWidth.textContent = s.petalWidth.toFixed(0);
  valueLabels.petalOffset.textContent = s.petalOffset.toFixed(0);
  valueLabels.petalOpacity.textContent = s.petalOpacity.toFixed(2);
  valueLabels.backPetalLength.textContent = s.backPetalLength.toFixed(0);
  valueLabels.backPetalWidth.textContent = s.backPetalWidth.toFixed(0);
  valueLabels.backPetalOffset.textContent = s.backPetalOffset.toFixed(0);
  valueLabels.backPetalOpacity.textContent = s.backPetalOpacity.toFixed(2);
  valueLabels.backPetalRotation.textContent = s.backPetalRotation.toFixed(2);
  valueLabels.contrast.textContent = s.contrast.toFixed(2);

  controls.angle.disabled = s.lockGolden;
  if (document.activeElement !== controls.seedProfile) {
    const inferred = inferSeedProfileFromSizeCurve(s.sizeCurve);
    if (controls.seedProfile.value !== "custom" || inferred !== "custom") {
      controls.seedProfile.value = inferred;
    }
  }
}

function resizeCanvas() {
  const isMobile = window.innerWidth <= 900;
  const dpr = Math.max(window.devicePixelRatio || 1, 1);

  if (isMobile) {
    const availableWidth = Math.max(280, Math.min((previewPanel?.clientWidth || window.innerWidth), 560));
    const cssWidth = Math.floor(availableWidth);
    const cssHeight = cssWidth;
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
  } else {
    const panelWidth = document.getElementById("controls").offsetWidth;
    const cssWidth = Math.max(320, window.innerWidth - panelWidth);
    const cssHeight = window.innerHeight;
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
  }

  drawPreview();
}

function computePoints(settings, width, height) {
  const points = [];
  const angle = settings.angleDeg * Math.PI / 180;
  const cx = width / 2;
  const cy = height / 2;

  const maxRadiusRaw = Math.pow(settings.points, settings.radiusPower);
  const targetRadius = Math.min(width, height) * 0.5 * settings.framing;
  const scale = targetRadius / maxRadiusRaw;

  for (let i = 1; i <= settings.points; i++) {
    const t = i / settings.points;
    const r = scale * Math.pow(i, settings.radiusPower);
    const theta = i * angle;
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);

    let sizeFactor = 1 + settings.sizeCurve * (t - 0.5);
    sizeFactor = clamp(sizeFactor, 0.15, 3);
    const radius = settings.size * sizeFactor;

    const color = samplePalette(settings.palette, t, settings.contrast);

    points.push({ x, y, theta, t, radius, color });
  }

  return { points, cx, cy, targetRadius };
}

function drawSeed(ctx, point, settings) {
  ctx.fillStyle = rgbString(point.color);

  if (settings.shape === "square") {
    const side = point.radius * 2;
    ctx.fillRect(point.x - side / 2, point.y - side / 2, side, side);
    return;
  }

  if (settings.shape === "ellipse") {
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(point.theta);
    ctx.beginPath();
    ctx.ellipse(0, 0, point.radius * settings.stretch, point.radius, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    return;
  }

  ctx.beginPath();
  ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawPetalPath(ctx, type, length, width) {
  const halfL = length / 2;

  ctx.beginPath();

  if (type === "needle") {
    ctx.moveTo(0, -halfL);
    ctx.bezierCurveTo(width * 0.12, -length * 0.35, width * 0.18, length * 0.22, 0, halfL);
    ctx.bezierCurveTo(-width * 0.18, length * 0.22, -width * 0.12, -length * 0.35, 0, -halfL);
  } else if (type === "rounded") {
    ctx.moveTo(0, -halfL);
    ctx.bezierCurveTo(width * 0.9, -length * 0.2, width * 0.92, length * 0.18, 0, halfL);
    ctx.bezierCurveTo(-width * 0.92, length * 0.18, -width * 0.9, -length * 0.2, 0, -halfL);
  } else if (type === "stub") {
    const stubL = length * 0.62;
    const stubHalfL = stubL / 2;
    ctx.moveTo(0, -stubHalfL);
    ctx.bezierCurveTo(width * 0.95, -stubL * 0.18, width * 0.85, stubL * 0.2, 0, stubHalfL);
    ctx.bezierCurveTo(-width * 0.85, stubL * 0.2, -width * 0.95, -stubL * 0.18, 0, -stubHalfL);
  } else {
    ctx.moveTo(0, -halfL);
    ctx.bezierCurveTo(width * 0.5, -length * 0.25, width * 0.5, length * 0.25, 0, halfL);
    ctx.bezierCurveTo(-width * 0.5, length * 0.25, -width * 0.5, -length * 0.25, 0, -halfL);
  }

  ctx.closePath();
}

function getPetalDimensions(type, length, width, isBackRing = false) {
  let l = length;
  let w = width;
  if (type === "needle") {
    l *= isBackRing ? 1.18 : 1.3;
    w *= isBackRing ? 0.58 : 0.48;
  } else if (type === "rounded") {
    l *= isBackRing ? 0.96 : 0.92;
    w *= isBackRing ? 1.22 : 1.35;
  } else if (type === "stub") {
    l *= isBackRing ? 0.7 : 0.62;
    w *= isBackRing ? 1.4 : 1.55;
  }
  return { length: l, width: w };
}

function drawPetalRing(ctx, options) {
  const {
    cx,
    cy,
    baseRadius,
    count,
    length,
    width,
    opacity,
    rotationOffset = 0,
    colors,
    petalType = "classic",
    isBackRing = false
  } = options;

  const dims = getPetalDimensions(petalType, length, width, isBackRing);

  for (let i = 0; i < count; i++) {
    const theta = ((i + rotationOffset) / count) * Math.PI * 2;
    const x = cx + baseRadius * Math.cos(theta);
    const y = cy + baseRadius * Math.sin(theta);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(theta + Math.PI / 2);

    const grad = ctx.createLinearGradient(0, -dims.length * 0.5, 0, dims.length * 0.5);
    grad.addColorStop(0, `rgba(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]}, ${opacity})`);
    grad.addColorStop(0.55, `rgba(${colors[1][0]}, ${colors[1][1]}, ${colors[1][2]}, ${opacity})`);
    grad.addColorStop(1, `rgba(${colors[2][0]}, ${colors[2][1]}, ${colors[2][2]}, ${opacity * 0.92})`);

    ctx.fillStyle = grad;
    drawPetalPath(ctx, petalType, dims.length, dims.width);
    ctx.fill();

    ctx.restore();
  }
}

function drawPetals(ctx, settings, width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const targetRadius = Math.min(width, height) * 0.5 * settings.framing;

  function darken(color, factor) {
    return [
      Math.round(color.r * factor),
      Math.round(color.g * factor),
      Math.round(color.b * factor)
    ];
  }

  const frontTop = samplePalette(settings.palette, 0.95, settings.contrast);
  const frontMid = samplePalette(settings.palette, 0.70, settings.contrast);
  const frontBase = samplePalette(settings.palette, 0.40, settings.contrast);

  const backTop = darken(frontTop, 0.65);
  const backMid = darken(frontMid, 0.55);
  const backBase = darken(frontBase, 0.45);

  if (settings.showBackPetals) {
    drawPetalRing(ctx, {
      cx,
      cy,
      baseRadius: targetRadius + settings.backPetalOffset,
      count: settings.petalCount,
      length: settings.backPetalLength,
      width: settings.backPetalWidth,
      opacity: settings.backPetalOpacity,
      rotationOffset: settings.backPetalRotation,
      colors: [backTop, backMid, backBase],
      petalType: settings.petalType,
      isBackRing: true
    });
  }

  if (settings.showPetals) {
    drawPetalRing(ctx, {
      cx,
      cy,
      baseRadius: targetRadius + settings.petalOffset,
      count: settings.petalCount,
      length: settings.petalLength,
      width: settings.petalWidth,
      opacity: settings.petalOpacity,
      rotationOffset: 0,
      colors: [
        [frontTop.r, frontTop.g, frontTop.b],
        [frontMid.r, frontMid.g, frontMid.b],
        [frontBase.r, frontBase.g, frontBase.b]
      ],
      petalType: settings.petalType,
      isBackRing: false
    });
  }
}

function renderToContext(ctx, width, height, settings) {
  const bg = getBackgroundColor(settings.background);

  ctx.clearRect(0, 0, width, height);

  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);
  }

  drawPetals(ctx, settings, width, height);

  const { points } = computePoints(settings, width, height);

  for (const point of points) {
    drawSeed(ctx, point, settings);
  }
}

function drawPreview() {
  updateLabels();
  const settings = getSettings();
  renderToContext(ctx, canvas.width, canvas.height, settings);
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

  exportCtx.imageSmoothingEnabled = true;
  exportCtx.imageSmoothingQuality = "high";
  exportCtx.clearRect(0, 0, width, height);
  exportCtx.drawImage(canvas, 0, 0, width, height);

  exportCanvas.toBlob((blob) => {
    if (!blob) return;
    downloadBlob(blob, "helioform.png");
  }, "image/png");
}

function applyPreset(name) {
  const preset = presets[name];
  if (!preset) return;

  controls.points.value = preset.points;
  controls.angle.value = preset.angle;
  controls.lockGolden.checked = preset.lockGolden;
  controls.framing.value = preset.framing;
  controls.radiusPower.value = preset.radiusPower;
  controls.seedProfile.value = preset.seedProfile || inferSeedProfileFromSizeCurve(preset.sizeCurve);
  controls.size.value = preset.size;
  controls.sizeCurve.value = preset.sizeCurve;
  controls.shape.value = preset.shape;
  controls.stretch.value = preset.stretch;
  controls.showPetals.checked = preset.showPetals;
  controls.petalType.value = preset.petalType || "classic";
  controls.petalCount.value = preset.petalCount;
  controls.petalLength.value = preset.petalLength;
  controls.petalWidth.value = preset.petalWidth;
  controls.petalOffset.value = preset.petalOffset;
  controls.petalOpacity.value = preset.petalOpacity;
  controls.showBackPetals.checked = preset.showBackPetals;
  controls.backPetalLength.value = preset.backPetalLength;
  controls.backPetalWidth.value = preset.backPetalWidth;
  controls.backPetalOffset.value = preset.backPetalOffset;
  controls.backPetalOpacity.value = preset.backPetalOpacity;
  controls.backPetalRotation.value = preset.backPetalRotation;
  controls.palette.value = preset.palette;
  controls.background.value = preset.background;
  controls.contrast.value = preset.contrast;

  drawPreview();
}

Object.values(controls).forEach((control) => {
  control.addEventListener("input", drawPreview);
  control.addEventListener("change", drawPreview);
});

controls.seedProfile.addEventListener("change", () => {
  applySeedProfile(controls.seedProfile.value);
  drawPreview();
});

controls.sizeCurve.addEventListener("input", () => {
  controls.seedProfile.value = inferSeedProfileFromSizeCurve(parseFloat(controls.sizeCurve.value));
});
controls.sizeCurve.addEventListener("change", () => {
  controls.seedProfile.value = inferSeedProfileFromSizeCurve(parseFloat(controls.sizeCurve.value));
});

document.querySelectorAll("[data-preset]").forEach((button) => {
  button.addEventListener("click", () => {
    applyPreset(button.dataset.preset);
  });
});

document.getElementById("downloadPng").addEventListener("click", exportPNG);
document.getElementById("downloadPngTop").addEventListener("click", exportPNG);

let sliderTouch = null;

document.addEventListener("touchstart", (e) => {
  if (window.innerWidth > 900) return;
  const target = e.target;
  if (!(target instanceof HTMLInputElement) || target.type !== "range") return;

  const touch = e.touches[0];
  sliderTouch = {
    target,
    startX: touch.clientX,
    startY: touch.clientY,
    locked: false
  };
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
  if (window.innerWidth <= 900 && window.scrollY > 110) {
    document.body.classList.add("scrolled-mobile");
  } else {
    document.body.classList.remove("scrolled-mobile");
  }
}

window.addEventListener("scroll", updateMobileScrollState, { passive: true });
window.addEventListener("resize", () => {
  resizeCanvas();
  updateMobileScrollState();
});

applyPreset("sunflower");
resizeCanvas();
updateMobileScrollState();
