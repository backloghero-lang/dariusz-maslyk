// Ilustracje artefaktów analityka w teczkach projektów.
// Wszystko to proceduralne SVG/HTML — bez zewnętrznych plików.
import { esc } from "./render.js";

const svg = (body, vb = "0 0 300 170") => `<svg viewBox="${vb}" class="art-svg">${body}</svg>`;

const ARTEFACTS = {
  story: (a) => `<blockquote class="art-story">
      <p>${esc(a.text)}</p>
    </blockquote>
    <p class="art-caption">format: jako… chcę… żeby…</p>`,

  test: (a) => `<ol class="art-steps">${a.steps.map((s, i) => `<li style="--d:${i}"><span class="tick" aria-hidden="true"></span>${esc(s)}</li>`).join("")}</ol>`,

  decision: () => {
    const rows = [["tak", "tak", "pakiet"], ["tak", "nie", "cennik"], ["nie", "tak", "cennik"], ["nie", "nie", "cennik"]];
    return `<table class="art-table">
      <thead><tr><th>Komplet produktów</th><th>Pakiet aktywny</th><th>Wynik</th></tr></thead>
      <tbody>${rows.map((r, i) => `<tr style="--d:${i}"><td>${r[0]}</td><td>${r[1]}</td><td class="${r[2] === "pakiet" ? "hit" : ""}">${r[2]}</td></tr>`).join("")}</tbody>
    </table>`;
  },

  screen: () => svg(`
    <rect class="s-dev" x="96" y="6" width="108" height="158" rx="14"/>
    <rect class="s-bar" x="104" y="16" width="92" height="16" rx="3"/>
    ${[40, 62, 84].map((y, i) => `<g class="s-row${i < 2 ? " in-pack" : ""}"><rect x="104" y="${y}" width="92" height="18" rx="3"/><rect class="s-thumb" x="108" y="${y + 4}" width="10" height="10" rx="2"/><path d="M124 ${y + 7}h40M124 ${y + 12}h26"/></g>`).join("")}
    <rect class="s-pack" x="100" y="36" width="100" height="48" rx="5"/>
    <text class="s-tag" x="196" y="33" text-anchor="end">Pakiet</text>
    <rect class="s-cta" x="104" y="138" width="92" height="16" rx="4"/>
    <path class="a-flow" d="M210 60C240 60 250 40 270 40"/>
    <text class="s-note" x="272" y="36">reguła</text>`),

  "screen-ai": () => svg(`
    <rect class="s-dev" x="96" y="6" width="108" height="158" rx="14"/>
    <rect class="s-bar" x="104" y="16" width="92" height="16" rx="3"/>
    ${[40, 60].map((y) => `<g class="s-row"><rect x="104" y="${y}" width="92" height="16" rx="3"/><path d="M110 ${y + 8}h48"/></g>`).join("")}
    <g class="s-hint"><rect x="104" y="84" width="92" height="40" rx="6"/><path d="M112 96h56M112 106h40"/><rect class="s-chip" x="112" y="112" width="30" height="8" rx="4"/><rect class="s-chip ghost" x="146" y="112" width="30" height="8" rx="4"/></g>
    <rect class="s-cta" x="104" y="138" width="92" height="16" rx="4"/>
    <g class="s-ai"><path d="M250 50l18 10.4v20.8L250 91.6 232 81.2V60.4z"/><path class="in" d="M250 62l8 4.6v9.2l-8 4.6-8-4.6v-9.2z"/></g>
    <path class="a-flow" d="M232 76C220 90 214 100 200 104"/>
    <text class="s-note" x="250" y="110" text-anchor="middle">asystent</text>`),

  sequence: () => {
    const cols = [[40, "Użytkownik"], [120, "Aplikacja"], [200, "Asystent"], [270, "ERP"]];
    const msgs = [[40, 120, 46, "przygotowuje"], [120, 200, 72, "kontekst"], [200, 120, 98, "podpowiedź"], [120, 40, 122, "propozycja"], [120, 270, 148, "zapis"]];
    return svg(`
      ${cols.map(([x, l]) => `<text class="q-h" x="${x}" y="14" text-anchor="middle">${l}</text><path class="q-life" d="M${x} 22V166"/>`).join("")}
      ${msgs.map(([a, b, y, l], i) => `<g class="q-msg" style="--d:${i}"><path d="M${a} ${y}H${b}" class="${b < a ? "back" : ""}"/><path class="q-head" d="M${b + (b > a ? -6 : 6)} ${y - 4}L${b} ${y}L${b + (b > a ? -6 : 6)} ${y + 4}"/><text x="${(a + b) / 2}" y="${y - 5}" text-anchor="middle">${l}</text></g>`).join("")}`);
  },

  erd: () => {
    const box = (x, y, t, f) => `<g class="e-box"><rect x="${x}" y="${y}" width="78" height="64" rx="5"/><rect class="e-head" x="${x}" y="${y}" width="78" height="18" rx="5"/><text class="e-t" x="${x + 39}" y="${y + 13}" text-anchor="middle">${t}</text>${f.map((r, i) => `<text class="e-f" x="${x + 8}" y="${y + 32 + i * 12}">${r}</text>`).join("")}</g>`;
    return svg(`
      ${box(8, 20, "Oferta", ["id", "klient", "data"])}
      ${box(111, 20, "Zamówienie", ["id", "oferta_id", "status"])}
      ${box(214, 20, "Faktura", ["id", "zam_id", "spinacz"])}
      <path class="e-rel" d="M86 52H111M189 52H214"/>
      <text class="e-card" x="90" y="46">1</text><text class="e-card" x="104" y="46">N</text>
      <text class="e-card" x="193" y="46">1</text><text class="e-card" x="207" y="46">N</text>
      <path class="a-flow" d="M47 92V120H253V92"/>
      <text class="e-note" x="150" y="138" text-anchor="middle">łańcuch dokumentów</text>`);
  },

  sql: () => `<pre class="art-code"><code><span class="k">SELECT</span> z.id, z.status, f.id <span class="k">AS</span> faktura
<span class="k">FROM</span> zamowienia z
<span class="k">LEFT JOIN</span> faktury f <span class="k">ON</span> f.zam_id = z.id
<span class="k">WHERE</span> f.id <span class="k">IS NULL</span>
  <span class="k">AND</span> z.status = <span class="s">'zrealizowane'</span>;</code></pre>
    <p class="art-caption">→ zamówienia bez faktury: tu szukamy przerwanego powiązania</p>`,

  telemetry: () => {
    const pts = [30, 42, 38, 55, 48, 70, 62, 84, 58, 66, 92, 74, 80];
    const d = pts.map((v, i) => `${i ? "L" : "M"}${12 + i * 23} ${150 - v}`).join("");
    return svg(`
      <path class="t-grid" d="M12 40H288M12 80H288M12 120H288"/>
      <path class="t-area" d="${d}L288 150L12 150Z"/>
      <path class="t-line a-draw" d="${d}"/>
      <circle class="t-dot" cx="242" cy="58" r="4"/>
      <text class="t-note" x="240" y="44" text-anchor="end">zdarzenie: wysłano zamówienie</text>
      <text class="t-axis" x="12" y="166">sesje użytkowników</text>`);
  },

  pipeline: () => {
    const steps = [["Aplikacja", "zapisuje zdarzenie"], ["OpenTelemetry", "zbiera i wysyła"], ["Azure", "przechowuje dane"], ["Grafana", "pokazuje na wykresach"]];
    return `<ol class="art-pipe">${steps.map(([t, d], i) => `<li style="--d:${i}"><b>${t}</b><span>${d}</span></li>`).join("")}</ol>`;
  },

  events: () => {
    const rows = [["zamowienie_wyslane", "zapis i wysyłka zamówienia", "czas, liczba pozycji"], ["synchronizacja", "koniec synchronizacji z ERP", "czas trwania, wynik"], ["podpowiedz_ai", "pokazanie podpowiedzi", "przyjęta / pominięta"]];
    return `<table class="art-table">
      <thead><tr><th>Zdarzenie</th><th>Kiedy</th><th>Atrybuty</th></tr></thead>
      <tbody>${rows.map((r, i) => `<tr style="--d:${i}"><td class="hit">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</tbody>
    </table>`;
  },

  period: () => svg(`
    <path class="p-axis" d="M14 120H290"/>
    ${["I", "II", "III", "IV", "V", "VI"].map((m, i) => `<text class="p-m" x="${30 + i * 46}" y="138" text-anchor="middle">${m}</text><path class="p-tick" d="M${30 + i * 46} 116v8"/>`).join("")}
    <rect class="p-bar a" x="20" y="40" width="120" height="22" rx="4"/><text class="p-t" x="28" y="55">wartość A</text>
    <rect class="p-bar b" x="140" y="40" width="96" height="22" rx="4"/><text class="p-t" x="148" y="55">wartość B</text>
    <rect class="p-bar c" x="236" y="40" width="50" height="22" rx="4"/><text class="p-t" x="242" y="55">C</text>
    <path class="p-now" d="M190 28V128"/><text class="p-nt" x="194" y="94">data dokumentu</text>
    <text class="p-cap" x="14" y="20">atrybut: wartość zależna od daty</text>`),
};

export function artefactVisual(a) {
  return ARTEFACTS[a.kind] ? ARTEFACTS[a.kind](a) : "";
}
