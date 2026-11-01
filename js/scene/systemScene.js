// Scena 3D przewodnia: jeden system, który zmienia się razem z rozdziałami historii.
// Stan 0 = otwarcie, 1 = chaos potrzeb, 2 = proces BPMN, 3 = ekrany aplikacji, 4 = integracja z ERP, 5 = testy i logi.
// Każdy obiekt („aktor”) ma pozę dla każdego stanu; scena płynnie interpoluje pozy według przewinięcia.
import * as THREE from "three";
import { NODES, MOBILE, LINKS, PULSE_CHAIN, COLORS, CAMERA } from "./sceneConfig.js";
import {
  buildPhone, buildCore, buildNode, buildFloor, glowTexture, buildFragment, buildBpmn, BPMN_SLOTS,
  buildGhostScreens, GHOST, buildLogs, buildCheck, PHONE,
} from "./models.js";

const STATES = 6;
const LABEL_OFFSET = new THREE.Vector3(0, 0.8, 0);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const damp = (cur, target, lambda, dt) => THREE.MathUtils.lerp(cur, target, 1 - Math.exp(-lambda * dt));
const smooth = (x) => x * x * (3 - 2 * x);

// Poza: pozycja, krycie, skala (liczba lub [x,y,z]), obrót.
const P = (p, o = 1, s = 1, r = [0, 0, 0]) => ({ p, o, s: Array.isArray(s) ? s : [s, s, s], r });

function seeded(i) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function mountScene(host, { reducedMotion = false, onReady, onFail, getState, watchdog: useWatchdog = true } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) {
    onFail?.("webgl");
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  const target = new THREE.Vector3();

  const world = new THREE.Group();
  scene.add(world);
  const glowTex = glowTexture();
  const actors = [];

  // Aktor: obiekt z pozami. `managed` = krycie ustawia sam obiekt (setGlow), aktor podaje tylko `op`.
  function actor(obj, poses, managed = false) {
    const mats = [];
    if (!managed) {
      obj.traverse((o) => {
        const m = o.material;
        if (!m) return;
        for (const x of Array.isArray(m) ? m : [m]) if (x.visible !== false) mats.push([x, x.opacity]);
      });
    }
    const a = { obj, poses, mats, op: 1 };
    actors.push(a);
    world.add(obj);
    return a;
  }

  // --- Telefon, rdzeń, podłoże ------------------------------------------------
  const phone = buildPhone();
  const phonePose = [
    P([0, 0.35, 0]), P([0, 0.35, -0.6], 0.14, 0.85), P([0, 0.35, -1.6], 0, 0.7),
    P([0, 0.3, 0.6], 1, 1.18, [0, -0.12, 0]), P([0, 0.35, 0]), P([-0.7, 0.35, 0]),
  ];
  const phoneActor = actor(phone.group, phonePose, true);

  const core = buildCore();
  actor(core.group, [1, 0.35, 0.12, 0.3, 1, 0.7].map((o) => P([0, 0.35, -0.3], o)));
  actor(buildFloor(), [1, 0.6, 0.35, 0.6, 1, 1].map((o) => P([0, -2.25, 0], o)));

  // --- Węzły systemu ------------------------------------------------------------
  const nodes = new Map();
  for (const def of NODES) {
    const n = buildNode(def, glowTex);
    const p = def.pos.toArray();
    n.actor = actor(n.group, [P(p), P(p, 0, 0.01), P(p, 0, 0.01), P(p, 0, 0.01), P(p), P(p, 0.22)], true);
    nodes.set(def.id, n);
  }
  nodes.set("mobile", { def: MOBILE, group: phone.group, hit: phone.hit, setGlow: phone.setGlow, glow: 0, target: 0, actor: phoneActor, anchor: new THREE.Vector3(0, 0.35, 0) });

  // --- Połączenia i cząsteczki danych ----------------------------------------
  const linkFade = [1, 0, 0, 0, 1, 0.55].map((o) => P([0, 0, 0], o));
  const links = LINKS.map(([a, b, color]) => {
    const pa = nodes.get(a).anchor.clone();
    const pb = nodes.get(b).anchor.clone();
    const mid = pa.clone().lerp(pb, 0.5);
    mid.y += 0.6;
    mid.multiplyScalar(1.08);
    const curve = new THREE.QuadraticBezierCurve3(pa, mid, pb);
    const mat = new THREE.LineBasicMaterial({ color: COLORS.wire, transparent: true, opacity: 0.3, depthWrite: false });
    world.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)), mat));
    return { a, b, curve, mat, color: new THREE.Color(color), lit: 0, err: a === "api" && b === "erp" };
  });

  const PER_LINK = 3;
  const pPos = new Float32Array(links.length * PER_LINK * 3);
  const pCol = new Float32Array(links.length * PER_LINK * 3);
  const particles = [];
  links.forEach((l, li) => {
    for (let k = 0; k < PER_LINK; k++) {
      const back = k === 2;
      const c = back ? new THREE.Color(COLORS.warm) : l.color;
      pCol.set([c.r, c.g, c.b], (li * PER_LINK + k) * 3);
      particles.push({ link: l, t: (k / PER_LINK + li * 0.17) % 1, speed: 0.08 + ((li * 7 + k * 3) % 5) * 0.012, back });
    }
  });
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
  const pMat = new THREE.PointsMaterial({ size: 0.2, map: glowTex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.NormalBlending });
  world.add(new THREE.Points(pGeo, pMat));

  // --- Rozdziały: karty wymagań, BPMN, ekrany, logi ---------------------------
  const toWorld = (pose, local) => {
    const m = new THREE.Matrix4().compose(new THREE.Vector3(...pose.p), new THREE.Quaternion().setFromEuler(new THREE.Euler(...pose.r)), new THREE.Vector3(...pose.s));
    return local.clone().applyMatrix4(m).toArray();
  };
  const rowLocal = (k) => new THREE.Vector3(0, 1.12 - k * 0.42, PHONE.D / 2 + 0.03);
  const fragColors = [COLORS.accent, COLORS.accent, COLORS.accent, COLORS.accent, COLORS.accent, COLORS.navy, COLORS.navy, COLORS.navy, COLORS.navy, COLORS.steel, COLORS.steel, COLORS.steel];
  const fragments = fragColors.map((color, i) => {
    const r = 2.4 + seeded(i) * 1.8, th = seeded(i + 20) * Math.PI * 2, ph = (seeded(i + 40) - 0.5) * 1.6;
    const scatter = [Math.cos(th) * r, 0.4 + Math.sin(ph) * 2.2, Math.sin(th) * r * 0.6];
    const rot = [(seeded(i + 60) - 0.5) * 0.9, (seeded(i + 80) - 0.5) * 1.2, (seeded(i + 90) - 0.5) * 0.8];
    const [bx, by, bs, bo] = BPMN_SLOTS[i];
    let s3;
    if (i < 6) {
      s3 = P(toWorld(phonePose[3], rowLocal(i)), 1, [1.25 * 1.18, 0.3 * 1.18, 1], phonePose[3].r);
    } else {
      const gs = GHOST[i < 9 ? 0 : 1], k = (i - 6) % 3;
      const pose = { p: [gs.x, gs.y, gs.z], r: [0, gs.ry, 0], s: [1, 1, 1] };
      s3 = P(toWorld(pose, new THREE.Vector3(0, 0.75 - k * 0.6, 0.02)), 1, [1.05, 0.42, 1], pose.r);
    }
    const inPhone = (pi) => P(toWorld(phonePose[pi], rowLocal(i % 6)), 0, [1.25, 0.3, 1], phonePose[pi].r);
    const poses = [inPhone(0), P(scatter, 0.95, 0.9, rot), P([bx, by, 0], bo, [bs, bs, 1]), s3, inPhone(4), inPhone(5)];
    return actor(buildFragment(color), poses);
  });

  const bpmnModel = buildBpmn(glowTex);
  const bpmn = actor(bpmnModel.group, [0, 0, 1, 0, 0, 0].map((o) => P([0, 0, -0.05], o)));
  actor(buildGhostScreens(), [0, 0, 0, 1, 0, 0].map((o) => P([0, 0, 0], o)));
  const logs = buildLogs();
  const logsActor = actor(logs.group, [0, 0, 0, 0, 0, 1].map((o) => P([3.3, 0.45, 1.0], o, 1, [0, -0.3, 0])));
  const check = buildCheck();
  const checkActor = actor(check, [0, 0, 0, 0, 0, 1].map((o, i) => P([0.75, 1.95, 0.6], o, i === 5 ? 1 : 0.4)));

  // --- Etykiety HTML -------------------------------------------------------------
  const labelLayer = document.createElement("div");
  labelLayer.className = "scene-labels";
  host.appendChild(labelLayer);
  const labels = [];
  const addLabel = (html, cls, getPos, getOp) => {
    const el = document.createElement("div");
    el.className = "scene-label " + cls;
    el.innerHTML = html;
    labelLayer.appendChild(el);
    const l = { el, getPos, getOp, below: cls.includes("below") };
    labels.push(l);
    return l;
  };
  for (const n of nodes.values()) {
    if (n.def.id === "mobile") continue;
    const off = n.def.labelOffset || LABEL_OFFSET;
    n.label = addLabel(`<b>${n.def.label}</b><span>${n.def.sub}</span>`, (n.def.id === "mobile" ? "is-main" : "") + (n.def.labelBelow ? " below" : ""),
      (v) => n.group.localToWorld(v.copy(off)), () => n.actor.op);
  }
  addLabel("<b>Logi integracji</b><span>API · SQL · JSON · XML</span>", "is-main", (v) => logs.group.localToWorld(v.set(0, 1.85, 0)), () => logsActor.op);
  addLabel("<b>Test projektancki</b>", "ok", (v) => check.localToWorld(v.set(0, 0.55, 0)), () => checkActor.op);

  // --- Interakcja ------------------------------------------------------------------
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2(9, 9);
  const parallax = { x: 0, y: 0, tx: 0, ty: 0 };
  let hovered = null;
  const nodeList = [...nodes.values()];

  function onPointerMove(e) {
    const r = host.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    parallax.tx = pointer.x;
    parallax.ty = pointer.y;
    raycaster.setFromCamera(pointer, camera);
    const live = nodeList.filter((n) => n.actor.op > 0.6);
    const hit = raycaster.intersectObjects(live.map((n) => n.hit), false)[0];
    hovered = hit ? live.find((n) => n.hit === hit.object) : null;
    requestRender();
  }
  addEventListener("pointermove", onPointerMove, { passive: true });

  // --- Rozmiar ---------------------------------------------------------------------
  let width = 1, height = 1;
  function resize() {
    width = Math.max(1, host.clientWidth);
    height = Math.max(1, host.clientHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, width < 700 ? 1.5 : 2));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.userData.k = camera.aspect < 0.6 ? 1.8 : camera.aspect < 0.8 ? 1.5 : camera.aspect < 1.2 ? 1.15 : 1;
    camera.updateProjectionMatrix();
    requestRender();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  // --- Pętla -------------------------------------------------------------------------
  const clock = new THREE.Clock();
  let elapsed = 0, rafId = 0, active = true;
  let frames = 0, slowTime = 0, watchdog = useWatchdog;
  const v3 = new THREE.Vector3();
  const lerpArr = (a, b, t) => a.map((x, i) => x + (b[i] - x) * t);

  function poseAt(poses, s) {
    const i = Math.min(STATES - 2, Math.floor(s));
    let t = clamp(s - i, 0, 1);
    t = reducedMotion ? (t < 0.5 ? 0 : 1) : smooth(clamp((t - 0.15) / 0.7, 0, 1));
    const A = poses[i], B = poses[i + 1];
    return { p: lerpArr(A.p, B.p, t), r: lerpArr(A.r, B.r, t), s: lerpArr(A.s, B.s, t), o: A.o + (B.o - A.o) * t };
  }
  const weight = (s, k) => clamp(1 - Math.abs(s - k) * 1.6, 0, 1);

  function update(dt) {
    if (!reducedMotion) elapsed += dt;
    const s = clamp(getState?.() ?? 0, 0, STATES - 1);

    for (const a of actors) {
      const q = poseAt(a.poses, s);
      a.obj.position.set(...q.p);
      a.obj.rotation.set(...q.r);
      a.obj.scale.set(...q.s);
      a.op = q.o;
      a.obj.visible = q.o > 0.004;
      for (const [m, base] of a.mats) m.opacity = base * q.o;
    }
    // Delikatne unoszenie kart w stanie „chaos”.
    const w1 = weight(s, 1);
    if (w1 > 0 && !reducedMotion) fragments.forEach((f, i) => {
      f.obj.position.y += Math.sin(elapsed * 0.7 + i) * 0.14 * w1;
      f.obj.rotation.z += Math.sin(elapsed * 0.4 + i * 2) * 0.08 * w1;
    });

    // Kamera
    const ci = Math.min(STATES - 2, Math.floor(s));
    let ct = clamp(s - ci, 0, 1);
    ct = reducedMotion ? (ct < 0.5 ? 0 : 1) : smooth(ct);
    const A = CAMERA[ci], B = CAMERA[ci + 1];
    parallax.x = damp(parallax.x, parallax.tx, 3, dt);
    parallax.y = damp(parallax.y, parallax.ty, 3, dt);
    const sway = reducedMotion ? 0 : Math.sin(elapsed * 0.12) * 0.22 * (weight(s, 0) + weight(s, 4));
    const az = A.az + (B.az - A.az) * ct + sway + parallax.x * 0.1;
    const el = A.el + (B.el - A.el) * ct + parallax.y * 0.04;
    const dist = (A.dist + (B.dist - A.dist) * ct) * (camera.userData.k || 1);
    target.set(...lerpArr(A.target, B.target, ct));
    camera.position.set(target.x + Math.sin(az) * Math.cos(el) * dist, target.y + Math.sin(el) * dist, target.z + Math.cos(az) * Math.cos(el) * dist);
    camera.lookAt(target);
    // Na szerokim ekranie scena przesuwa się w prawo, zostawiając miejsce na tekst po lewej (w otwarciu bardziej).
    if (width > 900) camera.setViewOffset(width, height, -width * (0.2 + 0.045 * weight(s, 0)), 0, width, height);
    // Na telefonie scena zajmuje górną część ekranu, a karty rozdziałów dolną.
    else camera.setViewOffset(width, height, 0, height * 0.2, width, height);

    if (!reducedMotion) {
      core.update(elapsed);
      phone.update(elapsed);
      logs.update(elapsed);
      for (const n of nodes.values()) n.update?.(elapsed);
      for (const p of particles) p.t = (p.t + p.speed * dt) % 1;
      check.scale.multiplyScalar(1 + Math.sin(elapsed * 2) * 0.04 * weight(s, 5));
    }

    // Rozdział procesu: kropka rysuje proces od startu do końca.
    const w2 = weight(s, 2);
    if (w2 > 0) {
      const f = reducedMotion ? 1 : Math.min(1, (elapsed % 7.5) / 6);
      const at = bpmnModel.update(f);
      fragments.slice(0, 5).forEach((fr) => {
        const near = Math.max(0, 1 - Math.hypot(fr.obj.position.x - at.x, fr.obj.position.y - at.y) / 0.8);
        fr.obj.scale.multiplyScalar(1 + near * 0.08 * w2);
      });
    }

    // W rozdziale ekranów karty wymagań zastępują interfejs telefonu.
    phone.setScreen(1 - 0.85 * weight(s, 3));

    // Węzły: hover ma pierwszeństwo, w otwarciu i integracji biegnie fala.
    const wave = weight(s, 0) + weight(s, 4) > 0.5;
    const idx = Math.floor((elapsed % 7.5) / 0.75);
    const pulseId = wave && !hovered && !reducedMotion && idx < PULSE_CHAIN.length ? PULSE_CHAIN[idx] : null;
    for (const [id, n] of nodes) {
      n.target = hovered ? (hovered === n ? 1 : 0) : id === pulseId ? 0.75 : 0;
      n.glow = reducedMotion ? n.target : damp(n.glow, n.target, 6, dt);
      n.setGlow(n.glow, hovered && hovered !== n, n.actor.op);
    }

    // Połączenia i cząsteczki; w rozdziale testów jedno połączenie sygnalizuje błąd.
    const lf = poseAt(linkFade, s).o;
    const errPhase = weight(s, 5) > 0.3 && Math.sin(elapsed * 2.2) > -0.2;
    for (const l of links) {
      const a = nodes.get(l.a), b = nodes.get(l.b);
      const t = hovered ? (hovered === a || hovered === b ? 1 : 0) : Math.max(a.glow, b.glow) * 0.8;
      l.lit = reducedMotion ? t : damp(l.lit, t, 5, dt);
      if (l.err && errPhase) { l.mat.color.setHex(COLORS.warm); l.mat.opacity = 0.9 * lf; continue; }
      l.mat.opacity = ((hovered ? 0.15 : 0.32) + l.lit * 0.6) * lf;
      l.mat.color.copy(COLORS.wireColor).lerp(l.color, Math.max(l.lit, 0.25));
    }
    particles.forEach((p, i) => {
      p.link.curve.getPointAt(p.back ? 1 - p.t : p.t, v3);
      pPos.set([v3.x, v3.y, v3.z], i * 3);
    });
    pGeo.attributes.position.needsUpdate = true;
    pMat.opacity = (hovered ? 0.5 : 0.95) * lf;

    // Etykiety
    for (const l of labels) {
      const op = l.getOp();
      if (op < 0.05) { l.el.style.opacity = "0"; continue; }
      l.getPos(v3).project(camera);
      // Etykieta zostaje w marginesie ekranu (16 px), nawet gdy węzeł jest przy krawędzi.
      const half = l.el.offsetWidth / 2 + 16;
      const x = Math.min(width - half, Math.max(half, (v3.x * 0.5 + 0.5) * width)), y = (-v3.y * 0.5 + 0.5) * height;
      l.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, ${l.below ? "0" : "-100%"})`;
      l.el.style.opacity = (v3.z > 1 ? 0 : op).toFixed(2);
    }
    for (const n of nodes.values()) n.label?.el.classList.toggle("is-lit", n.glow > 0.5);
  }

  function frame() {
    rafId = 0;
    const dt = Math.min(clock.getDelta(), 0.1);
    update(dt);
    renderer.render(scene, camera);
    if (watchdog && !reducedMotion) {
      frames++;
      if (frames > 30) slowTime += dt;
      if (frames === 150) {
        watchdog = false;
        if (slowTime / 120 > 1 / 22) { dispose(); onFail?.("slow"); return; }
      }
    }
    if (active && !reducedMotion) rafId = requestAnimationFrame(frame);
  }
  function requestRender() {
    if (!rafId && active) rafId = requestAnimationFrame(frame);
  }
  const onScroll = () => requestRender();
  addEventListener("scroll", onScroll, { passive: true });

  resize();
  frame();
  requestAnimationFrame(() => onReady?.());

  function dispose() {
    active = false;
    cancelAnimationFrame(rafId);
    ro.disconnect();
    removeEventListener("scroll", onScroll);
    removeEventListener("pointermove", onPointerMove);
    scene.traverse((o) => {
      o.geometry?.dispose?.();
      const m = o.material;
      if (m) (Array.isArray(m) ? m : [m]).forEach((x) => { x.map?.dispose?.(); x.dispose?.(); });
    });
    renderer.dispose();
    renderer.domElement.remove();
    labelLayer.remove();
  }

  return {
    setReducedMotion(v) { reducedMotion = v; clock.getDelta(); requestRender(); },
    setActive(v) {
      if (v === active) return;
      active = v;
      if (v) { clock.getDelta(); requestRender(); } else { cancelAnimationFrame(rafId); rafId = 0; }
    },
    dispose,
  };
}
