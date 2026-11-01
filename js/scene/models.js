// Proceduralne modele sceny: telefon, rdzeń danych, węzły systemu, podłoże
// oraz elementy rozdziałów: karty wymagań, proces BPMN, ekrany, logi i znacznik testu.
import * as THREE from "three";
import { COLORS } from "./sceneConfig.js";

export const lineMat = (color, opacity) =>
  new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });

const edges = (geo, mat, threshold = 1) => new THREE.LineSegments(new THREE.EdgesGeometry(geo, threshold), mat);

export function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

export const outline = (shape, mat, z = 0) => {
  const pts = shape.getPoints(10).map((p) => new THREE.Vector3(p.x, p.y, z));
  return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), mat);
};

const polyline = (points, mat) =>
  new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(([x, y, z = 0]) => new THREE.Vector3(x, y, z))), mat);

const segments = (pairs, mat) =>
  new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pairs.flat().map(([x, y, z = 0]) => new THREE.Vector3(x, y, z))), mat);

function circle(r, y, mat, seg = 40, plane = "xz") {
  const pts = [];
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    pts.push(plane === "xz" ? new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r) : new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, y));
  }
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
}

export function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,255,255,0.5)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Ekran aplikacji sprzedażowej narysowany na <canvas> — abstrakcyjny, bez danych klientów.
function screenTexture() {
  const W = 256, H = 512;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#f1f4f7");
  bg.addColorStop(1, "#ffffff");
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);
  const rr = (x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };

  g.fillStyle = "rgba(177,79,31,0.10)";
  g.fillRect(0, 0, W, 64);
  g.fillStyle = "#18222e";
  g.font = "600 22px system-ui, sans-serif";
  g.fillText("Zamówienie", 20, 42);
  g.strokeStyle = "rgba(177,79,31,0.9)";
  g.lineWidth = 2;
  rr(206, 22, 30, 22, 6); g.stroke();
  g.strokeStyle = "rgba(107,129,153,0.45)";
  rr(16, 80, W - 32, 30, 8); g.stroke();
  for (let i = 0; i < 5; i++) {
    const y = 128 + i * 58;
    g.strokeStyle = i === 1 ? "rgba(47,74,107,1)" : "rgba(47,74,107,0.45)";
    rr(16, y, 40, 40, 6); g.stroke();
    g.fillStyle = "rgba(24,34,46,0.7)";
    g.fillRect(68, y + 6, 100 - (i % 3) * 18, 7);
    g.fillStyle = "rgba(77,90,104,0.4)";
    g.fillRect(68, y + 22, 70 + (i % 2) * 24, 6);
    g.fillStyle = i === 1 ? "#b14f1f" : "rgba(107,129,153,0.35)";
    rr(190, y + 10, 46, 18, 5); g.fill();
  }
  const btn = g.createLinearGradient(16, 0, W - 16, 0);
  btn.addColorStop(0, "#c96a35");
  btn.addColorStop(1, "#b14f1f");
  g.fillStyle = btn;
  rr(16, H - 76, W - 32, 48, 10); g.fill();
  g.fillStyle = "#ffffff";
  g.font = "600 20px system-ui, sans-serif";
  g.textAlign = "center";
  g.fillText("Wyślij do ERP", W / 2, H - 45);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export const PHONE = { W: 1.7, H: 3.3, D: 0.2 };

export function buildPhone() {
  const group = new THREE.Group();
  const { W, H, D } = PHONE;
  const shape = roundedRectShape(W, H, 0.26);

  const bodyMat = new THREE.MeshBasicMaterial({ color: COLORS.ink, transparent: true, opacity: 0.92 });
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: D, bevelEnabled: false, curveSegments: 10 }), bodyMat);
  body.position.z = -D / 2;
  group.add(body);

  const frameMat = lineMat(COLORS.frame, 0.7);
  group.add(outline(shape, frameMat, D / 2));
  group.add(outline(shape, frameMat, -D / 2));
  group.add(segments([[[-W / 2, 0.9, -D / 2], [-W / 2, 0.9, D / 2]], [[W / 2, 0.9, -D / 2], [W / 2, 0.9, D / 2]],
    [[-W / 2, -0.9, -D / 2], [-W / 2, -0.9, D / 2]], [[W / 2, -0.9, -D / 2], [W / 2, -0.9, D / 2]]], frameMat));

  const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture(), transparent: true, opacity: 0.95 });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.2, H - 0.5), screenMat);
  screen.position.z = D / 2 + 0.006;
  group.add(screen);
  group.add(polyline([[-0.2, H / 2 - 0.12, D / 2 + 0.01], [0.2, H / 2 - 0.12, D / 2 + 0.01]], frameMat));

  // Szklane panele „sprzedaż” (prawy) i „magazyn” (lewy).
  const panels = [];
  const makePanel = (w, h, color, pos, rotY, inner) => {
    const p = new THREE.Group();
    p.position.copy(pos);
    p.rotation.y = rotY;
    const shp = roundedRectShape(w, h, 0.08);
    const glassMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false });
    p.add(new THREE.Mesh(new THREE.ShapeGeometry(shp), glassMat));
    const m = lineMat(color, 0.8);
    p.add(outline(shp, m, 0.001));
    p.add(inner(m));
    group.add(p);
    panels.push({ p, m, glassMat, baseY: pos.y, phase: panels.length * 1.7 });
  };
  makePanel(1.4, 0.9, COLORS.accent, new THREE.Vector3(1.3, 0.75, 0.75), -0.42, (m) =>
    segments([[[-0.55, 0.22], [0.25, 0.22]], [[-0.55, 0.02], [0.4, 0.02]], [[-0.55, -0.18], [0.1, -0.18]], [[0.3, -0.25], [0.55, -0.25]], [[0.3, -0.12], [0.55, -0.12]]], m));
  makePanel(1.1, 0.8, COLORS.steel, new THREE.Vector3(-1.2, -0.75, 0.7), 0.45, (m) =>
    segments([0.18, 0.32, 0.12, 0.42, 0.26].map((hgt, i) => [[-0.38 + i * 0.19, -0.28], [-0.38 + i * 0.19, -0.28 + hgt]]).concat([[[-0.46, -0.28], [0.46, -0.28]]]), m));

  const hit = new THREE.Mesh(new THREE.BoxGeometry(W, H, 0.8), new THREE.MeshBasicMaterial({ visible: false }));
  group.add(hit);

  let screenK = 1;
  return {
    group,
    hit,
    setScreen(k) { screenK = k; },
    setGlow(gl, dim, fade = 1) {
      frameMat.opacity = ((dim ? 0.35 : 0.7) + gl * 0.3) * fade;
      screenMat.opacity = ((dim ? 0.6 : 0.95) + gl * 0.05) * fade * screenK;
      bodyMat.opacity = 0.92 * fade;
      for (const { m, glassMat } of panels) {
        m.opacity = ((dim ? 0.35 : 0.8) + gl * 0.2) * fade * screenK;
        glassMat.opacity = (0.08 + gl * 0.06) * fade * screenK;
      }
    },
    update(t) {
      for (const pn of panels) pn.p.position.y = pn.baseY + Math.sin(t * 0.5 + pn.phase) * 0.06;
    },
  };
}

export function buildCore() {
  const group = new THREE.Group();
  group.position.set(0, 0.35, -0.3);
  const shell = edges(new THREE.IcosahedronGeometry(2.2, 1), lineMat(COLORS.navy, 0.16));
  group.add(shell);

  const ringMat = lineMat(COLORS.accent, 0.3);
  const ring = circle(2.75, 0, ringMat, 96);
  const ringTilt = new THREE.Group();
  ringTilt.rotation.set(1.2, 0, 0.35);
  ringTilt.add(ring);
  const ticks = [];
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const r1 = 2.75, r2 = i % 6 === 0 ? 2.98 : 2.86;
    ticks.push([[Math.cos(a) * r1, 0, Math.sin(a) * r1], [Math.cos(a) * r2, 0, Math.sin(a) * r2]]);
  }
  ring.add(segments(ticks, ringMat));
  group.add(ringTilt);

  const base = new THREE.Group();
  base.position.set(0, -2.45, 0.3);
  base.add(edges(new THREE.CylinderGeometry(1.5, 1.5, 0.12, 6), lineMat(COLORS.navy, 0.5)));
  base.add(edges(new THREE.CylinderGeometry(0.9, 0.9, 0.12, 6), lineMat(COLORS.accent, 0.45)));
  const crystal = edges(new THREE.OctahedronGeometry(0.32, 0), lineMat(COLORS.warm, 0.9));
  crystal.position.y = 0.48;
  base.add(crystal);
  group.add(base);

  return {
    group,
    update(t) {
      shell.rotation.y = t * 0.04;
      shell.rotation.x = Math.sin(t * 0.05) * 0.1;
      ring.rotation.y = t * 0.08;
      crystal.rotation.y = -t * 0.35;
      crystal.position.y = 0.48 + Math.sin(t * 0.8) * 0.04;
    },
  };
}

export function buildFloor() {
  const m = lineMat(0x9aa8b6, 0.1);
  const g = new THREE.Group();
  g.position.y = -2.25;
  for (const r of [2.2, 3.7, 5.2]) g.add(circle(r, 0, m, 128));
  const spokes = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    spokes.push([[Math.cos(a) * 1.6, 0, Math.sin(a) * 1.6], [Math.cos(a) * 5.6, 0, Math.sin(a) * 5.6]]);
  }
  g.add(segments(spokes, m));

  // Światło odbite od podłoża pod rdzeniem.
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d");
  const grd = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, "rgba(177,79,31,0.22)");
  grd.addColorStop(0.35, "rgba(47,74,107,0.10)");
  grd.addColorStop(1, "rgba(47,74,107,0)");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const bounce = new THREE.Mesh(new THREE.PlaneGeometry(9, 9),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.NormalBlending }));
  bounce.rotation.x = -Math.PI / 2;
  bounce.position.y = -0.01;
  g.add(bounce);
  return g;
}

const SHAPES = {
  // Okno przeglądarki: pasek z kropkami, tabela zadań i mały wykres raportu.
  web(m) {
    const g = new THREE.Group();
    const W = 1.15, H = 0.78;
    g.add(outline(roundedRectShape(W, H, 0.06), m));
    g.add(segments([[[-W / 2, H / 2 - 0.14], [W / 2, H / 2 - 0.14]]], m));
    [-0.48, -0.4, -0.32].forEach((x) => { const d = circle(0.025, 0, m, 10, "xy"); d.position.set(x, H / 2 - 0.07, 0); g.add(d); });
    g.add(segments([[[-0.48, 0.12], [-0.08, 0.12]], [[-0.48, 0.0], [-0.14, 0.0]], [[-0.48, -0.12], [-0.1, -0.12]], [[-0.48, -0.24], [-0.18, -0.24]]], m));
    g.add(segments([0.12, 0.22, 0.16, 0.3].map((h, i) => [[0.08 + i * 0.12, -0.28], [0.08 + i * 0.12, -0.28 + h]]).concat([[[0.02, -0.28], [0.48, -0.28]]]), m));
    return { g, sway: g };
  },
  user(m) {
    const g = new THREE.Group();
    const head = edges(new THREE.IcosahedronGeometry(0.2, 1), m);
    head.position.y = 0.32;
    g.add(head);
    const body = edges(new THREE.CylinderGeometry(0.14, 0.34, 0.42, 8, 1, true), m);
    body.position.y = -0.08;
    g.add(body);
    return { g, spin: head };
  },
  api(m) {
    const g = new THREE.Group();
    const hex = edges(new THREE.CylinderGeometry(0.44, 0.44, 0.16, 6), m);
    hex.rotation.x = Math.PI / 2;
    g.add(hex);
    g.add(segments([[[-0.1, 0.13, 0.1], [-0.22, 0, 0.1]], [[-0.22, 0, 0.1], [-0.1, -0.13, 0.1]],
      [[0.1, 0.13, 0.1], [0.22, 0, 0.1]], [[0.22, 0, 0.1], [0.1, -0.13, 0.1]], [[0.05, 0.16, 0.1], [-0.05, -0.16, 0.1]]], m));
    return { g, sway: g };
  },
  erp(m) {
    const g = new THREE.Group();
    [-0.27, 0, 0.27].forEach((y) => {
      const b = edges(new THREE.BoxGeometry(0.95, 0.2, 0.62), m);
      b.position.y = y;
      g.add(b);
    });
    g.add(segments([-0.27, 0, 0.27].map((y) => [[0.26, y, 0.32], [0.38, y, 0.32]]), m));
    return { g };
  },
  sql(m) {
    const g = new THREE.Group();
    [-0.32, -0.08, 0.16, 0.36].forEach((y) => g.add(circle(0.42, y, m)));
    g.add(segments([[[-0.42, -0.32, 0], [-0.42, 0.36, 0]], [[0.42, -0.32, 0], [0.42, 0.36, 0]], [[0, -0.32, 0.42], [0, 0.36, 0.42]]], m));
    return { g };
  },
  process(m) {
    const g = new THREE.Group();
    const gate = edges(new THREE.OctahedronGeometry(0.44, 0), m);
    g.add(gate);
    const inner = edges(new THREE.BoxGeometry(0.2, 0.2, 0.2), m);
    g.add(inner);
    return { g, spin: gate, spin2: inner };
  },
};

export function buildNode(def, glowTex) {
  const group = new THREE.Group();
  group.position.copy(def.pos);
  const m = lineMat(def.color, 0.85);
  const shape = SHAPES[def.kind](m);
  group.add(shape.g);

  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTex, color: def.color, transparent: true, opacity: 0, depthWrite: false, blending: THREE.NormalBlending,
  }));
  glow.scale.setScalar(2.2);
  group.add(glow);

  const hit = new THREE.Mesh(new THREE.SphereGeometry(0.75, 8, 6), new THREE.MeshBasicMaterial({ visible: false }));
  group.add(hit);

  const phase = def.pos.x * 0.7;
  return {
    def, group, hit, anchor: def.pos.clone(), glow: 0, target: 0,
    setGlow(g, dim, fade = 1) {
      m.opacity = ((dim ? 0.3 : 0.85) + g * 0.15) * fade;
      glow.material.opacity = g * 0.45 * fade;
      shape.g.scale.setScalar(1 + g * 0.1);
    },
    update(t) {
      if (shape.spin) shape.spin.rotation.y = t * 0.3 + phase;
      if (shape.spin2) shape.spin2.rotation.x = t * 0.4;
      if (shape.sway) shape.sway.rotation.y = Math.sin(t * 0.4 + phase) * 0.35;
    },
  };
}

// --- Elementy rozdziałów -------------------------------------------------------

// Karta wymagania: wypełnienie, obrys i dwie „linijki tekstu”.
export function buildFragment(color) {
  const group = new THREE.Group();
  const shp = roundedRectShape(1, 0.6, 0.08);
  group.add(new THREE.Mesh(new THREE.ShapeGeometry(shp), new THREE.MeshBasicMaterial({ color: COLORS.ink, transparent: true, opacity: 0.88, side: THREE.DoubleSide, depthWrite: false })));
  group.add(outline(shp, lineMat(color, 0.95), 0.002));
  group.add(segments([[[-0.36, 0.1, 0.004], [0.22, 0.1, 0.004]], [[-0.36, -0.08, 0.004], [0.06, -0.08, 0.004]]], lineMat(0x9aa8b6, 0.55)));
  const dot = new THREE.Mesh(new THREE.CircleGeometry(0.05, 12), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 }));
  dot.position.set(0.36, 0.16, 0.004);
  group.add(dot);
  return group;
}

// Prosty proces BPMN bez torów: start → zadania → bramka → dwie gałęzie → zadanie → koniec.
// Kropka danych przejeżdża proces od startu do końca, a linia „rysuje się” za nią.
const Y0 = 0.3;
const MAIN = [[-4.0, Y0], [-2.9, Y0], [-1.4, Y0], [0, Y0], [0, 1.2], [1.4, 1.2], [2.9, 1.2], [2.9, Y0], [4.0, Y0]];
const ALT = [[0, Y0], [0, -0.6], [1.4, -0.6], [2.9, -0.6], [2.9, Y0]];

// Gęste próbkowanie łamanej: pozwala rysować linię płynnie (setDrawRange) i liczyć pozycję kropki.
function sampled(points, step = 0.05) {
  const out = [];
  const lens = [0];
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i], [x2, y2] = points[i + 1];
    const n = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / step));
    for (let k = i ? 1 : 0; k <= n; k++) {
      const t = k / n;
      out.push(new THREE.Vector3(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, 0));
      if (out.length > 1) lens.push(lens[lens.length - 1] + out[out.length - 1].distanceTo(out[out.length - 2]));
    }
  }
  return { pts: out, lens, total: lens[lens.length - 1] };
}

export function buildBpmn(glowTex) {
  const g = new THREE.Group();
  const main = sampled(MAIN), alt = sampled(ALT);
  // Ślad całego procesu (przygaszony) i linia rysowana za kropką.
  for (const p of [main, alt]) g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p.pts), lineMat(0xb7c2cd, 0.22)));
  const drawMain = new THREE.Line(new THREE.BufferGeometry().setFromPoints(main.pts), lineMat(COLORS.accent, 1));
  const drawAlt = new THREE.Line(new THREE.BufferGeometry().setFromPoints(alt.pts), lineMat(COLORS.accent, 1));
  g.add(drawMain, drawAlt);

  const start = circle(0.2, 0, lineMat(COLORS.accent, 0.95), 32, "xy");
  start.position.set(-4.0, Y0, 0);
  const end = circle(0.2, 0, lineMat(COLORS.warm, 0.95), 32, "xy");
  end.position.set(4.0, Y0, 0);
  const end2 = circle(0.14, 0, lineMat(COLORS.warm, 0.95), 32, "xy");
  end2.position.set(4.0, Y0, 0);
  g.add(start, end, end2);
  g.add(polyline([[0, Y0 + 0.36], [0.36, Y0], [0, Y0 - 0.36], [-0.36, Y0], [0, Y0 + 0.36]], lineMat(COLORS.warm, 0.95)));
  g.add(segments([[[-0.13, Y0], [0.13, Y0]], [[0, Y0 + 0.13], [0, Y0 - 0.13]]], lineMat(COLORS.warm, 0.95)));

  const dotMat = new THREE.SpriteMaterial({ map: glowTex, color: 0xb14f1f, transparent: true, depthWrite: false, blending: THREE.NormalBlending });
  const dot = new THREE.Sprite(dotMat);
  dot.scale.setScalar(0.7);
  g.add(dot);
  const core = new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), new THREE.MeshBasicMaterial({ color: 0x18222e, transparent: true }));
  g.add(core);

  // Druga gałąź rusza, gdy kropka dojdzie do bramki.
  const gwAt = main.lens[main.pts.findIndex((p) => p.x === 0 && p.y === Y0)] / main.total;
  const pointAt = (path, f, out) => {
    const d = f * path.total;
    let i = path.lens.findIndex((l) => l >= d);
    if (i <= 0) return out.copy(path.pts[0]);
    const t = (d - path.lens[i - 1]) / (path.lens[i] - path.lens[i - 1] || 1);
    return out.copy(path.pts[i - 1]).lerp(path.pts[i], t);
  };
  const tmp = new THREE.Vector3();

  return {
    group: g,
    // f: 0–1 postęp przejazdu; zwraca pozycję kropki (w układzie procesu).
    update(f) {
      drawMain.geometry.setDrawRange(0, Math.max(2, Math.ceil(main.pts.length * f)));
      const fa = Math.max(0, Math.min(1, (f - gwAt) / (1 - gwAt)));
      drawAlt.geometry.setDrawRange(0, fa > 0 ? Math.max(2, Math.ceil(alt.pts.length * fa)) : 0);
      pointAt(main, f, tmp);
      dot.position.set(tmp.x, tmp.y, 0.05);
      core.position.set(tmp.x, tmp.y, 0.06);
      return tmp;
    },
  };
}

// Pozycje kart w procesie (x, y, skala, krycie). Karty poza procesem znikają w tym rozdziale.
export const BPMN_SLOTS = [
  [-2.9, Y0, 1, 1], [-1.4, Y0, 1, 1], [1.4, 1.2, 1, 1], [1.4, -0.6, 1, 1], [2.9, Y0, 1, 1],
  [-2.4, -1.6, 0.6, 0], [-0.8, -1.6, 0.6, 0], [0.8, -1.6, 0.6, 0], [2.4, -1.6, 0.6, 0],
  [-1.6, -2.2, 0.5, 0], [0, -2.2, 0.5, 0], [1.6, -2.2, 0.5, 0],
];

// Dwa dodatkowe ekrany aplikacji (rozdział „Ekran w dłoni użytkownika”).
export function buildGhostScreens() {
  const g = new THREE.Group();
  const shp = roundedRectShape(1.4, 2.7, 0.22);
  for (const side of [-1, 1]) {
    const s = new THREE.Group();
    s.position.set(side * 2.35, 0.25, -0.3);
    s.rotation.y = -side * 0.38;
    s.add(new THREE.Mesh(new THREE.ShapeGeometry(shp), new THREE.MeshBasicMaterial({ color: COLORS.ink, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false })));
    s.add(outline(shp, lineMat(side < 0 ? COLORS.steel : COLORS.accent, 0.8), 0.002));
    g.add(s);
  }
  return g;
}
export const GHOST = [
  { x: -2.35, y: 0.25, z: -0.3, ry: 0.38 },
  { x: 2.35, y: 0.25, z: -0.3, ry: -0.38 },
];

// Panel logów z przewijanymi wpisami; jeden wpis to błąd, który po chwili znika.
export function buildLogs() {
  const g = new THREE.Group();
  g.position.set(3.1, 0.5, 0.4);
  g.rotation.y = -0.35;
  const shp = roundedRectShape(2.4, 3.1, 0.12);
  g.add(new THREE.Mesh(new THREE.ShapeGeometry(shp), new THREE.MeshBasicMaterial({ color: COLORS.ink, transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false })));
  g.add(outline(shp, lineMat(COLORS.navy, 0.8), 0.002));
  g.add(segments([[[-1.2, 1.25, 0.003], [1.2, 1.25, 0.003]]], lineMat(COLORS.navy, 0.6)));
  const rows = [];
  for (let i = 0; i < 11; i++) {
    const err = i === 4;
    const mat = new THREE.MeshBasicMaterial({ color: err ? COLORS.warm : 0x9aa8b6, transparent: true, opacity: err ? 1 : 0.5, depthWrite: false });
    const len = 0.7 + ((i * 37) % 11) / 10;
    const line = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.07), mat);
    line.position.set(-0.95 + len / 2, 0, 0.004);
    g.add(line);
    rows.push({ line, mat, err, i });
  }
  return {
    group: g,
    update(t) {
      for (const r of rows) {
        const y = 1.05 - (((r.i * 0.26 + t * 0.32) % 2.75));
        r.line.position.y = y;
        if (r.err) r.mat.color.setHex(Math.sin(t * 2.2) > -0.2 ? COLORS.warm : COLORS.accent);
      }
    },
  };
}

export function buildCheck() {
  const g = new THREE.Group();
  g.position.set(0.55, 2.45, 0.4);
  g.add(circle(0.34, 0, lineMat(COLORS.accent, 1), 40, "xy"));
  g.add(polyline([[-0.15, 0.0], [-0.04, -0.12], [0.17, 0.12]], lineMat(COLORS.accent, 1)));
  return g;
}
