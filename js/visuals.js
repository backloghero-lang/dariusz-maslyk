// Geometryczne wizualizacje kart projektów (inline SVG, bez zewnętrznych assetów).
// Klasy: .v-line (przewód), .v-flow (animowany przepływ), .v-box/.v-node (elementy), .v-t (etykiety).

const grid = `<g class="v-grid"><path d="M0 50H320M0 100H320M0 150H320M80 0V200M160 0V200M240 0V200"/></g>`;

function promo() {
  // Karty produktów → reguła promocji → pakiet albo zwykły cennik.
  const cards = [30, 78, 126].map((y, i) => `
    <g class="v-box${i === 1 ? " v-accent" : ""}">
      <rect x="18" y="${y}" width="74" height="38" rx="5"/>
      <rect class="v-fill" x="26" y="${y + 9}" width="14" height="14" rx="2"/>
      <path class="v-in" d="M46 ${y + 12}h36M46 ${y + 22}h24"/>
    </g>`).join("");
  return `<svg viewBox="0 0 320 200" class="viz">
    ${grid}
    ${cards}
    <path class="v-line" d="M92 49C120 49 128 92 150 98M92 97H150M92 145C120 145 128 104 150 102"/>
    <path class="v-flow" d="M92 49C120 49 128 92 150 98M92 145C120 145 128 104 150 102"/>
    <g class="v-node v-amber"><path d="M176 74l26 26-26 26-26-26z"/><path class="v-in" d="M166 100h20M176 90v20"/></g>
    <path class="v-line" d="M202 100C226 100 228 58 250 58M202 100C226 100 228 142 250 142"/>
    <path class="v-flow v-flow-amber" d="M202 100C226 100 228 58 250 58"/>
    <g class="v-box"><rect x="250" y="40" width="56" height="36" rx="5"/></g>
    <g class="v-box"><rect x="250" y="124" width="56" height="36" rx="5"/></g>
    <g class="v-t">
      <text x="55" y="22" text-anchor="middle">Produkty</text>
      <text x="176" y="146" text-anchor="middle">Reguła</text>
      <text x="278" y="62" text-anchor="middle">Pakiet</text>
      <text x="278" y="146" text-anchor="middle">Cennik</text>
    </g>
  </svg>`;
}

function ai() {
  // Użytkownik → interfejs mobilny ⇄ węzeł asystenta; zamówienie powstaje po stronie użytkownika.
  return `<svg viewBox="0 0 320 200" class="viz">
    ${grid}
    <g class="v-node"><circle cx="34" cy="100" r="15"/><circle class="v-in" cx="34" cy="96" r="4"/><path class="v-in" d="M26 108c3-5 13-5 16 0"/></g>
    <path class="v-line" d="M49 100H96"/>
    <g class="v-box v-accent">
      <rect x="96" y="34" width="72" height="132" rx="12"/>
      <rect class="v-screen" x="104" y="48" width="56" height="100" rx="4"/>
      <path class="v-in" d="M110 60h30M110 72h44M110 84h36"/>
      <rect class="v-fill" x="110" y="96" width="44" height="22" rx="3"/>
      <rect class="v-in-box" x="110" y="128" width="44" height="12" rx="3"/>
    </g>
    <path class="v-line" d="M168 80C196 80 200 50 222 46M222 58C200 62 196 92 168 92"/>
    <path class="v-flow" d="M222 58C200 62 196 92 168 92"/>
    <g class="v-node v-teal"><path d="M240 22l20 11.5v23L240 68l-20-11.5v-23z"/><path class="v-in" d="M240 34l10 6v12l-10 6-10-6V40z"/></g>
    <path class="v-line" d="M168 134C206 134 220 150 244 150"/>
    <path class="v-flow v-flow-amber" d="M168 134C206 134 220 150 244 150"/>
    <g class="v-box v-amber"><path d="M244 130h40l12 12v34h-52z"/><path class="v-in" d="M252 150h32M252 160h24M252 170h28"/></g>
    <g class="v-t">
      <text x="34" y="132" text-anchor="middle">Użytkownik</text>
      <text x="240" y="86" text-anchor="middle">Asystent AI</text>
      <text x="270" y="122" text-anchor="middle">Zamówienie</text>
      <text x="132" y="184" text-anchor="middle">Mobile</text>
    </g>
  </svg>`;
}

function data() {
  // Oferta → zamówienie → faktura, spinacz nagłówkowy FV i synchronizacja aplikacji z ERP.
  const doc = (x, label, cls = "") => `
    <g class="v-box ${cls}"><path d="M${x} 30h46l12 12v58h-58z"/><path class="v-in" d="M${x + 8} 52h36M${x + 8} 64h28M${x + 8} 76h40M${x + 8} 88h22"/></g>
    <text class="v-t-doc" x="${x + 29}" y="22" text-anchor="middle">${label}</text>`;
  return `<svg viewBox="0 0 320 200" class="viz">
    ${grid}
    ${doc(22, "Oferta")}
    ${doc(130, "Zamówienie", "v-accent")}
    ${doc(238, "Faktura", "v-amber")}
    <path class="v-line" d="M80 66H130M188 66H238"/>
    <path class="v-flow" d="M80 66H130M188 66H238"/>
    <path class="v-bracket" d="M232 108v6h70v-6M267 114v8"/>
    <text class="v-t-small" x="267" y="134" text-anchor="middle">Spinacz FV</text>
    <path class="v-line v-dash" d="M51 100V140M159 100V140M267 122V140"/>
    <g class="v-box"><rect x="22" y="140" width="110" height="30" rx="5"/></g>
    <g class="v-box v-accent"><rect x="188" y="140" width="110" height="30" rx="5"/></g>
    <path class="v-line" d="M132 155H188"/>
    <path class="v-flow" d="M132 155H188"/>
    <g class="v-t">
      <text x="77" y="159" text-anchor="middle">Comarch Mobile</text>
      <text x="243" y="159" text-anchor="middle">Comarch ERP</text>
    </g>
  </svg>`;
}

function tele() {
  // Telefon wysyła zdarzenia → kolektor OpenTelemetry → Azure → dashboard Grafany.
  return `<svg viewBox="0 0 320 200" class="viz">
    ${grid}
    <g class="v-box v-accent"><rect x="18" y="50" width="52" height="96" rx="10"/><rect class="v-screen" x="24" y="62" width="40" height="66" rx="3"/></g>
    <path class="v-line" d="M70 98H104M140 98H174M222 98H232"/>
    <path class="v-flow" d="M70 98H104M140 98H174M222 98H232"/>
    <g class="v-node v-teal"><path d="M122 78l18 10v20l-18 10-18-10V88z"/><path class="v-in" d="M122 90l7 4v8l-7 4-7-4v-8z"/></g>
    <g class="v-box"><path d="M178 112a14 14 0 0 1 4-27 18 18 0 0 1 34 4 12 12 0 0 1 2 23z"/></g>
    <g class="v-box v-amber"><rect x="232" y="56" width="74" height="86" rx="6"/></g>
    ${[0, 1, 2, 3, 4].map((i) => `<rect class="v-bar" x="${242 + i * 12}" y="${126 - [18, 30, 24, 44, 36][i]}" width="8" height="${[18, 30, 24, 44, 36][i]}" rx="1"/>`).join("")}
    <path class="v-wave" d="M242 74l12 6 12-4 12 5 12-7"/>
    <g class="v-t">
      <text x="44" y="166" text-anchor="middle">Aplikacja</text>
      <text x="122" y="140" text-anchor="middle">OTel</text>
      <text x="198" y="134" text-anchor="middle">Azure</text>
      <text x="269" y="166" text-anchor="middle">Grafana</text>
    </g>
  </svg>`;
}

const VISUALS = { promo, ai, data, tele };

export function projectVisual(kind) {
  return VISUALS[kind] ? VISUALS[kind]() : "";
}
