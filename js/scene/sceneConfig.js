// Układ sceny: paleta, węzły, połączenia i stany kamery dla rozdziałów historii.
// Podpisy (sub) pochodzą z CV — zmieniaj je razem z data.js.
import * as THREE from "three";

// Paleta ze zdjęcia (jasna) — zgodna z tokenami w css/style.css.
export const COLORS = {
  accent: 0xb14f1f,
  navy: 0x2f4a6b,
  steel: 0x6b8199,
  warm: 0xd08b3e,
  frame: 0x1f2d3d,
  wire: 0xa3b0bd,
  wireColor: new THREE.Color(0xa3b0bd),
  ink: 0xffffff,
};

const R = 3.7;
const at = (deg, y) => {
  const a = THREE.MathUtils.degToRad(deg);
  return new THREE.Vector3(Math.sin(a) * R, y, Math.cos(a) * R);
};

export const MOBILE = {
  id: "mobile",
  label: "Mobile",
  sub: "Comarch Mobile",
  labelOffset: new THREE.Vector3(0, 2.0, 0),
};

export const NODES = [
  { id: "user", label: "Użytkownik", sub: "UI/UX", kind: "user", color: COLORS.accent, pos: at(-72, 0.95) },
  { id: "api", label: "API", sub: "REST · JSON · XML", kind: "api", color: COLORS.navy, pos: at(55, 1.4) },
  { id: "erp", label: "Comarch ERP", sub: "XL · Altum · Optima", kind: "erp", color: COLORS.warm, pos: at(98, -0.1), labelOffset: new THREE.Vector3(0, -0.55, 0), labelBelow: true },
  { id: "sql", label: "SQL", sub: "T-SQL · MS SQL Server", kind: "sql", color: COLORS.steel, pos: at(135, -1.75), labelOffset: new THREE.Vector3(0, -0.6, 0), labelBelow: true },
  { id: "www", label: "Moduł Zarządzania", sub: "WWW · kierownicy", kind: "web", color: COLORS.navy, pos: at(-148, 1.95) },
  { id: "proc", label: "Proces", sub: "BPMN · UML", kind: "process", color: COLORS.accent, pos: at(-122, -1.2) },
];

// [od, do, kolor przepływu]
export const LINKS = [
  ["user", "mobile", COLORS.accent],
  ["mobile", "api", COLORS.accent],
  ["api", "erp", COLORS.navy],
  ["erp", "sql", COLORS.steel],
  ["mobile", "proc", COLORS.accent],
  ["proc", "erp", COLORS.navy],
  ["www", "api", COLORS.accent],
];

export const PULSE_CHAIN = ["user", "mobile", "api", "erp", "sql"];

// Kamera w stanach 0–5: 0 = otwarcie, 1–5 = rozdziały historii.
export const CAMERA = [
  { az: -0.35, el: 0.2, dist: 16.5, target: [0, -0.15, 0] },
  { az: 0.25, el: 0.12, dist: 12.5, target: [0, 0.2, 0] },
  { az: 0, el: 0.03, dist: 15.5, target: [0.1, 0.3, 0] },
  { az: 0.16, el: 0.08, dist: 12.8, target: [0, 0.3, 0] },
  { az: -0.45, el: 0.22, dist: 15.5, target: [0, -0.15, 0] },
  { az: 0.3, el: 0.12, dist: 13.5, target: [0.9, 0.2, 0] },
];
