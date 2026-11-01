import { renderAll } from "./render.js";
import { setupMap } from "./map.js";
import { setupMetro } from "./metro.js";

const reducedMQ = matchMedia("(prefers-reduced-motion: reduce)");
let reduced = reducedMQ.matches;
let sceneCtl = null;
document.documentElement.classList.add("js");

renderAll();
setupMap();
setupMetro();
setupNav();
setupReveal();
setupCounters();
const story = setupStory();
setupScene();

reducedMQ.addEventListener("change", (e) => {
  reduced = e.matches;
  sceneCtl?.setReducedMotion(reduced);
});

// --- Nawigacja ---------------------------------------------------------------
function setupNav() {
  const bar = document.getElementById("topbar");
  const toggle = bar.querySelector(".nav-toggle");
  const nav = document.getElementById("nav");
  const close = () => { toggle.setAttribute("aria-expanded", "false"); bar.classList.remove("nav-open"); };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    bar.classList.toggle("nav-open", open);
  });
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && bar.classList.contains("nav-open")) { close(); toggle.focus(); }
  });
  const onScroll = () => bar.classList.toggle("is-scrolled", scrollY > 24);
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  const links = new Map([...nav.querySelectorAll('a[href^="#"]')].map((a) => [a.getAttribute("href").slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    for (const en of entries) {
      const a = links.get(en.target.id);
      if (a && en.isIntersecting) {
        links.forEach((x) => x.removeAttribute("aria-current"));
        a.setAttribute("aria-current", "true");
      }
    }
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
}

// --- Pojawianie się i animacje w polu widzenia -------------------------------
function setupReveal() {
  const els = document.querySelectorAll(".reveal, .chapter, .case, .metro, .tool, .facts");
  if (reduced || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in-view", "is-live"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      // in-view: jednorazowe pojawienie się; is-live: animacje działają tylko na ekranie.
      if (en.isIntersecting) en.target.classList.add("in-view");
      en.target.classList.toggle("is-live", en.isIntersecting);
    }
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.15 });
  els.forEach((el) => io.observe(el));
}

// --- Liczniki ------------------------------------------------------------------
function setupCounters() {
  const els = document.querySelectorAll(".count[data-to]");
  const fmt = (n, suffix) => Math.round(n).toLocaleString("pl-PL") + suffix;
  if (reduced) return;
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      io.unobserve(en.target);
      const el = en.target;
      const to = +el.dataset.to, suffix = el.dataset.suffix || "";
      const t0 = performance.now(), dur = 1600;
      const tick = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)), p === 1 ? suffix : "");
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.6 });
  els.forEach((el) => { el.textContent = "0"; io.observe(el); });
}

// --- Historia: stan sceny wyliczany z pozycji rozdziałów ----------------------
function setupStory() {
  const stage = document.getElementById("stage");
  const chapters = [...document.querySelectorAll(".chapter")];
  const progress = document.getElementById("story-progress");
  const dots = [...progress.children];
  let centers = [];
  const measure = () => {
    centers = chapters.map((c) => { const r = c.getBoundingClientRect(); return r.top + scrollY + r.height / 2; });
  };
  measure();
  addEventListener("resize", measure);
  addEventListener("load", measure);
  new ResizeObserver(measure).observe(document.body);

  const state = { s: 0, fade: 1, active: -1 };
  const compute = () => {
    const vc = scrollY + innerHeight / 2;
    let s;
    if (vc <= centers[0]) {
      const start = innerHeight / 2;
      s = Math.max(0, Math.min(1, (vc - start) / (centers[0] - start)));
    } else if (vc >= centers[centers.length - 1]) {
      s = chapters.length;
    } else {
      const i = centers.findIndex((c, k) => vc >= c && vc < centers[k + 1]);
      s = i + 1 + (vc - centers[i]) / (centers[i + 1] - centers[i]);
    }
    state.s = s;
    // Po ostatnim rozdziale scena wygasa, a dalsze sekcje mają własne tło.
    const after = vc - centers[centers.length - 1];
    state.fade = 1 - Math.max(0, Math.min(1, after / (innerHeight * 0.7)));
    stage.style.opacity = state.fade.toFixed(3);
    stage.classList.toggle("is-off", state.fade <= 0.001);
    sceneCtl?.setActive(state.fade > 0.001);

    const active = s >= 0.5 && state.fade > 0.3 ? Math.min(chapters.length - 1, Math.round(s) - 1) : -1;
    if (active !== state.active) {
      state.active = active;
      chapters.forEach((c, k) => c.classList.toggle("is-active", k === active));
      dots.forEach((d, k) => d.classList.toggle("on", k === active));
      progress.classList.toggle("show", active >= 0);
      stage.dataset.chapter = String(active + 1);
    }
  };
  let ticking = false;
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; compute(); }); } }, { passive: true });
  addEventListener("resize", compute);
  compute();
  return { get s() { return state.s; } };
}

// --- Scena 3D ----------------------------------------------------------------

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch { return false; }
}

function setupScene() {
  const stage = document.getElementById("stage");
  const host = document.getElementById("scene-host");
  const param = new URLSearchParams(location.search).get("scene");
  const lowPower =
    navigator.connection?.saveData ||
    (navigator.deviceMemory && navigator.deviceMemory < 2) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 3);

  if (param === "off" || (param !== "on" && (lowPower || !webglAvailable()))) {
    stage.classList.add("is-static");
    return;
  }

  const start = () =>
    import("./scene/systemScene.js")
      .then(({ mountScene }) => {
        sceneCtl = mountScene(host, {
          reducedMotion: reduced,
          watchdog: param !== "on",
          getState: () => story.s,
          onReady: () => stage.classList.add("scene-ready"),
          onFail: () => {
            sceneCtl = null;
            stage.classList.remove("scene-ready");
            stage.classList.add("is-static");
          },
        });
      })
      .catch((e) => { console.error(e); stage.classList.add("is-static"); });

  if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 800 });
  else setTimeout(start, 150);
}
