// Interaktywna mapa powiązań: doświadczenie → kompetencje → projekty.
import { MAP } from "./data.js";
import { esc } from "./render.js";

const COLS = [
  { key: "experience", title: "Doświadczenie", cls: "exp" },
  { key: "skills", title: "Kompetencje", cls: "skill" },
  { key: "projects", title: "Projekty i obszary", cls: "proj" },
];

export function setupMap() {
  const root = document.getElementById("map");
  const panel = document.getElementById("map-panel");
  const byId = new Map();
  for (const c of COLS) for (const n of MAP[c.key]) byId.set(n.id, { ...n, col: c.key });

  root.innerHTML =
    `<svg class="map-wires" aria-hidden="true"></svg>` +
    COLS.map((c) => `<div class="map-col">
      <h3>${c.title}</h3>
      ${MAP[c.key].map((n) => `<button type="button" class="map-node ${n.area ? "area" : c.cls}" data-id="${n.id}" aria-pressed="false">
        <span class="mn-label">${esc(n.label)}</span>${n.sub || n.group ? `<span class="mn-sub">${esc(n.sub || n.group)}</span>` : ""}
      </button>`).join("")}
    </div>`).join("");

  const svg = root.querySelector(".map-wires");
  const nodeEl = (id) => root.querySelector(`[data-id="${id}"]`);
  const isMid = (id) => byId.get(id).col === "skills";

  function draw() {
    const r = root.getBoundingClientRect();
    // Na wąskim ekranie kolumny są jedna pod drugą — wtedy linie biegną pionowo.
    const vertical = nodeEl(MAP.skills[0].id).getBoundingClientRect().left - r.left < 40;
    svg.setAttribute("viewBox", `0 0 ${r.width} ${r.height}`);
    svg.innerHTML = MAP.edges.map(([a, b]) => {
      const A = nodeEl(a).getBoundingClientRect(), B = nodeEl(b).getBoundingClientRect();
      let d;
      if (vertical) {
        const x1 = A.left + A.width / 2 - r.left, y1 = A.bottom - r.top, x2 = B.left + B.width / 2 - r.left, y2 = B.top - r.top, m = (y1 + y2) / 2;
        d = `M${x1} ${y1}C${x1} ${m} ${x2} ${m} ${x2} ${y2}`;
      } else {
        const x1 = A.right - r.left, y1 = A.top + A.height / 2 - r.top, x2 = B.left - r.left, y2 = B.top + B.height / 2 - r.top, m = (x1 + x2) / 2;
        d = `M${x1} ${y1}C${m} ${y1} ${m} ${y2} ${x2} ${y2}`;
      }
      // Dwie warstwy: przewód (rysuje się) i iskra (punkt światła jadący po przewodzie).
      return `<path class="wire" pathLength="1" data-a="${a}" data-b="${b}" d="${d}"/><path class="spark" pathLength="1" data-a="${a}" data-b="${b}" d="${d}"/>`;
    }).join("");
    // Po przerysowaniu (zmiana rozmiaru) odtwórz aktualne podświetlenie.
    if (typeof current !== "undefined" && current) { const c = current; current = null; focus(c); }
  }

  // Ścieżka: kompetencja → jej sąsiedzi; firma → kompetencje → projekty i obszary, które powstały w tej firmie;
  // projekt/obszar → kompetencje → firmy z jego listy `at`.
  function reach(id) {
    const s = new Set([id]);
    const nb = (x) => MAP.edges.flatMap(([a, b]) => (a === x ? [b] : b === x ? [a] : []));
    const node = byId.get(id);
    if (isMid(id)) nb(id).forEach((x) => s.add(x));
    else if (node.col === "experience") {
      nb(id).filter(isMid).forEach((m) => {
        s.add(m);
        nb(m).filter((x) => byId.get(x).col === "projects" && byId.get(x).at.includes(id)).forEach((x) => s.add(x));
      });
    } else {
      nb(id).filter(isMid).forEach((m) => {
        s.add(m);
        nb(m).filter((x) => byId.get(x).col === "experience" && node.at.includes(x)).forEach((x) => s.add(x));
      });
    }
    return s;
  }

  // Czas jednego „skoku” światła (sekundy): źródło → kompetencje, potem kompetencje → cel.
  const STEP = 2.6;
  let pinned = null;
  let current = null;
  function focus(id) {
    if (id === current) return;
    current = id;
    if (!id) {
      root.classList.remove("is-focus");
      root.querySelectorAll(".map-node").forEach((n) => { n.classList.remove("on"); n.setAttribute("aria-pressed", "false"); });
      svg.querySelectorAll("path").forEach((p) => p.classList.remove("on"));
      showPanel(null);
      panel.classList.remove("is-open");
      return;
    }
    const s = reach(id);
    // Odległość od źródła: 0 = źródło, 1 = sąsiad, 2 = drugi skok.
    const adj = new Set(MAP.edges.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : [])));
    const hop = (x) => (x === id ? 0 : adj.has(x) ? 1 : 2);
    root.classList.add("is-focus");
    // Restart animacji: zdejmij klasy, wymuś przeliczenie układu, nałóż ponownie.
    svg.querySelectorAll("path").forEach((p) => p.classList.remove("on", "rev"));
    root.querySelectorAll(".map-node").forEach((n) => n.classList.remove("on"));
    void svg.getBoundingClientRect();
    root.querySelectorAll(".map-node").forEach((n) => {
      const h = hop(n.dataset.id);
      n.style.setProperty("--d", h === 0 ? "0s" : `${(h - 0.15) * STEP}s`);
      n.classList.toggle("on", s.has(n.dataset.id));
      n.classList.toggle("is-source", n.dataset.id === id);
      n.setAttribute("aria-pressed", String(n.dataset.id === pinned));
    });
    svg.querySelectorAll("path").forEach((p) => {
      const a = p.dataset.a, b = p.dataset.b;
      if (!(s.has(a) && s.has(b))) return;
      p.style.setProperty("--d", `${(Math.max(hop(a), hop(b)) - 1) * STEP}s`);
      p.style.setProperty("--t", `${STEP}s`);
      // Przewody są zapisane od lewej kolumny; światło ma iść od strony bliższej źródłu.
      p.classList.toggle("rev", hop(b) < hop(a));
      p.classList.add("on");
    });
    showPanel(id, s);
    panel.classList.add("is-open");
  }

  function showPanel(id, s) {
    if (!id) {
      panel.innerHTML = `<p class="label">Legenda</p>
        <ul class="legend"><li><i class="exp"></i>Doświadczenie</li><li><i class="skill"></i>Kompetencje</li><li><i class="proj"></i>Projekty (Comarch)</li><li><i class="area"></i>Obszary w handlu i logistyce</li></ul>
        <p class="hint">Wybierz element na mapie. „Comarch” pokaże kompetencje i projekty, a firmy handlowe — kompetencje i obszary, za które odpowiadałem. Kompetencja pokaże obie strony: skąd pochodzi i w których projektach pracuje.</p>`;
      return;
    }
    const n = byId.get(id);
    const rel = [...s].filter((x) => x !== id).map((x) => byId.get(x));
    const group = (col, t) => {
      const list = rel.filter((r) => r.col === col);
      return list.length ? `<p class="label">${t}</p><ul class="rel">${list.map((r) => `<li>${esc(r.label)}</li>`).join("")}</ul>` : "";
    };
    panel.innerHTML = `<p class="label">${COLS.find((c) => c.key === n.col).title}</p>
      <h3>${esc(n.label)}</h3>
      <p>${esc(n.note)}</p>
      ${group("experience", "Skąd")}${group("skills", "Przez kompetencje")}${group("projects", "Dokąd prowadzi")}`;
  }

  root.addEventListener("pointerover", (e) => { const b = e.target.closest(".map-node"); if (b && !pinned) focus(b.dataset.id); });
  root.addEventListener("pointerleave", () => { if (!pinned) focus(null); });
  root.addEventListener("click", (e) => {
    const b = e.target.closest(".map-node");
    if (!b) return;
    pinned = pinned === b.dataset.id ? null : b.dataset.id;
    focus(pinned || b.dataset.id);
  });
  root.addEventListener("focusin", (e) => { const b = e.target.closest(".map-node"); if (b && !pinned) focus(b.dataset.id); });
  root.addEventListener("keydown", (e) => { if (e.key === "Escape") { pinned = null; focus(null); } });

  draw();
  showPanel(null);
  new ResizeObserver(draw).observe(root);
}
