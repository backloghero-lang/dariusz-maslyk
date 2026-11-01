// Linia kariery jako schemat metra: handel i logistyka zbiegają się w analizie systemowej.
import { METRO } from "./data.js";
import { esc } from "./render.js";

const W = 1240, H = 360;
const Y = { trade: 110, logistics: 190, analysis: 270 };
// Oś lat z przerwą między 2011 a 2016.
const X0 = 220, X1 = 1060, Y0 = 2016, Y1 = 2026;
const x = (year) => X0 + ((year - Y0) / (Y1 - Y0)) * (X1 - X0);
const MERGE = x(2022);

export function setupMetro() {
  const host = document.getElementById("metro");
  const [trade, logistics, analysis] = METRO.lines;
  const years = [];
  for (let y = Y0; y <= Y1; y++) years.push(y);

  const station = (cx, cy, s, cls, below) => `
    <g class="m-station ${cls}" tabindex="0" role="img" aria-label="${esc(s.label)}, ${esc(s.sub)}, ${s.from === s.to ? s.from : s.from + "–" + s.to}">
      ${s.from !== s.to ? `<rect class="m-span" x="${x(s.from)}" y="${cy - 9}" width="${x(s.to) - x(s.from)}" height="18" rx="9"/>` : ""}
      <circle class="m-dot" cx="${cx}" cy="${cy}" r="${s.main ? 11 : 8}"/>
      <text class="m-label" x="${cx}" y="${below ? cy + 36 : cy - 38}" text-anchor="middle">${esc(s.label)}</text>
      <text class="m-sub" x="${cx}" y="${below ? cy + 52 : cy - 22}" text-anchor="middle">${esc(s.sub)}</text>
    </g>`;

  const mid = (s) => (x(s.from) + x(s.to)) / 2;

  host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" class="metro-svg" role="group" aria-label="Linia kariery 2011–${Y1}">
    <g class="m-years">${years.map((y) => `<text x="${x(y)}" y="${H - 14}" text-anchor="middle">${y === Y1 ? "dziś" : y}</text><path d="M${x(y)} 70V${H - 34}"/>`).join("")}</g>

    <g class="m-origin">
      <circle class="m-dot" cx="60" cy="${Y.analysis}" r="9"/>
      <text class="m-label" x="60" y="${Y.analysis + 34}" text-anchor="middle">${esc(METRO.origin.label)}</text>
      <text class="m-sub" x="60" y="${Y.analysis + 50}" text-anchor="middle">${METRO.origin.year}</text>
      <path class="m-line logic" d="M70 ${Y.analysis}H${MERGE - 40}"/>
      <text class="m-break" x="105" y="${H - 14}" text-anchor="middle">${METRO.origin.year} ···</text>
    </g>

    <path class="m-line amber draw" pathLength="1" d="M${x(2016) - 30} ${Y.trade}H${MERGE - 70}C${MERGE - 20} ${Y.trade} ${MERGE - 30} ${Y.analysis} ${MERGE + 20} ${Y.analysis}"/>
    <path class="m-line violet draw" pathLength="1" d="M${x(2019) - 30} ${Y.logistics}H${MERGE - 70}C${MERGE - 25} ${Y.logistics} ${MERGE - 30} ${Y.analysis} ${MERGE + 20} ${Y.analysis}"/>
    <path class="m-line cyan draw" pathLength="1" d="M${MERGE - 40} ${Y.analysis}H${X1 + 20}"/>
    <path class="m-train" d="M${MERGE - 40} ${Y.analysis}H${X1 + 20}"/>

    <text class="m-line-label amber" x="${x(2016) - 44}" y="${Y.trade + 4}" text-anchor="end">${esc(trade.label)}</text>
    <text class="m-line-label violet" x="${x(2019) - 44}" y="${Y.logistics + 4}" text-anchor="end">${esc(logistics.label)}</text>
    <text class="m-line-label cyan" x="${X1 + 20}" y="${Y.analysis + 36}" text-anchor="end">${esc(analysis.label)}</text>

    ${trade.stations.map((s) => station(mid(s), Y.trade, s, "amber", false)).join("")}
    ${logistics.stations.map((s) => station(mid(s), Y.logistics, s, "violet", true)).join("")}
    ${station(x(2022), Y.analysis, analysis.stations[0], "cyan main", true)}

    <g class="m-certs">
      ${analysis.certs.map((c, i) => {
        const cx = x(c.year) - 20 + analysis.certs.filter((d) => d.year === c.year).indexOf(c) * 26;
        // Schodki: wcześniejszy certyfikat ma etykietę wyżej, więc linie odniesienia nie przecinają tekstu.
        const ly = Y.analysis - 34 - (analysis.certs.length - 1 - i) * 24;
        return `<g class="m-cert" tabindex="0" role="img" aria-label="Certyfikat ${esc(c.label)}, ${c.year}">
          <rect x="${cx - 6}" y="${Y.analysis - 6}" width="12" height="12" rx="2" transform="rotate(45 ${cx} ${Y.analysis})"/>
          <path d="M${cx} ${Y.analysis - 12}V${ly - 4}H${cx + 6}"/>
          <text x="${cx + 10}" y="${ly}">${esc(c.label)} <tspan class="m-year">${c.year}</tspan></text>
        </g>`;
      }).join("")}
    </g>
  </svg>
  <ol class="metro-list" aria-label="Linia kariery, od najstarszej stacji">
    ${(() => {
      // Ta sama treść co schemat, ułożona chronologicznie w pionie (telefon).
      const span = (st) => (st.from === st.to ? `${st.from}` : `${st.from} – ${st.to}`);
      const items = [
        { y: METRO.origin.year, when: `${METRO.origin.year}`, cls: "logic", label: METRO.origin.label, sub: METRO.origin.sub },
        ...trade.stations.map((st) => ({ y: st.from, when: span(st), cls: "amber", label: st.label, sub: st.sub })),
        ...logistics.stations.map((st) => ({ y: st.from + 0.1, when: span(st), cls: "violet", label: st.label, sub: st.sub })),
        ...analysis.stations.map((st) => ({ y: st.from, when: `${st.from} – dziś`, cls: "cyan main", label: st.label, sub: st.sub + ". Tu zbiegają się wszystkie linie." })),
        ...analysis.certs.map((c, i) => ({ y: c.year + 0.01 * i, when: `${c.year}`, cls: "cert", label: c.label, sub: "Certyfikat" })),
      ].sort((a, b) => a.y - b.y);
      return items.map((it) => `<li class="ml-item ${it.cls}"><span class="ml-when">${esc(it.when)}</span><span class="ml-what"><b>${esc(it.label)}</b><span>${esc(it.sub)}</span></span></li>`).join("");
    })()}
  </ol>
  <ul class="metro-legend">
    <li><i class="amber"></i>${esc(trade.label)}</li>
    <li><i class="violet"></i>${esc(logistics.label)}</li>
    <li><i class="cyan"></i>${esc(analysis.label)}</li>
    <li><i class="cert"></i>Certyfikaty</li>
    <li><i class="logic"></i>Fundament: logika (KUL, ${METRO.origin.year})</li>
  </ul>`;
}
