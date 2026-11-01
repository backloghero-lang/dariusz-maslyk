// Buduje sekcje strony z obiektów w data.js.
import { PROFILE, FACTS, STORY, CASES, SKILL_GROUPS } from "./data.js";
import { projectVisual } from "./visuals.js";
import { artefactVisual } from "./artefacts.js";

export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const $ = (sel) => document.querySelector(sel);

function bindProfile() {
  const text = {
    name: PROFILE.name,
    role: PROFILE.role,
    statement: PROFILE.statement,
    focus: PROFILE.focus.join(" · "),
    lead: PROFILE.lead,
    city: PROFILE.city,
  };
  for (const el of document.querySelectorAll("[data-bind]")) {
    const key = el.dataset.bind;
    if (key in text) el.textContent = text[key];
    else if (key === "cv") el.setAttribute("href", PROFILE.cv);
    else if (key === "email") { el.href = "mailto:" + PROFILE.email; el.textContent = PROFILE.email; }
    else if (key === "emailCta") { el.href = "mailto:" + PROFILE.email; el.textContent = "Napisz: " + PROFILE.email; }
    else if (key === "phone") { el.href = PROFILE.phoneHref; el.textContent = PROFILE.phone; }
    else if (key === "linkedin") {
      el.href = PROFILE.linkedin;
      if (el.closest("dd")) el.textContent = PROFILE.linkedinLabel;
    }
  }
}

function renderFacts() {
  $("#facts").innerHTML = FACTS.map((f, i) => {
    let big;
    if (f.value != null) {
      const final = f.value.toLocaleString("pl-PL") + (f.suffix || "");
      big = `<span class="count" aria-hidden="true" data-to="${f.value}" data-suffix="${esc(f.suffix || "")}">${esc(final)}</span><span class="sr-only">${esc(final)}</span>`;
    } else if (f.word) {
      big = esc(f.word);
    } else {
      big = `${esc(f.from)}<i aria-hidden="true">→</i><span class="to">${esc(f.to)}</span>`;
    }
    return `<li class="fact" style="--i:${i}">
      <p class="fact-big">${big}</p>
      <p class="fact-text">${esc(f.unit)} ${esc(f.text)}</p>
    </li>`;
  }).join("");
}

function renderStory() {
  $("#chapters").innerHTML = STORY.map((c, i) => `
    <article class="chapter" data-scene="${c.scene}" id="krok-${c.code}" aria-labelledby="ch-${c.code}">
      <div class="chapter-card news ${i % 2 ? "media-right" : "media-left"}">
        <figure class="news-media">
          <img src="${c.photo}" alt="${esc(c.photoAlt)}" loading="lazy" width="1200" height="750">
          <span class="news-tag">${esc(c.tag)}</span>
        </figure>
        <div class="news-body">
          <h3 class="news-title" id="ch-${c.code}">${esc(c.title)}</h3>
          <p class="news-lead">${esc(c.lead)}</p>
          <blockquote class="news-quote">
            <p>${esc(c.analyst)}</p>
            <cite>Moja rola</cite>
          </blockquote>
        ${c.extra ? `<div class="chapter-extra">
          <p class="label">${esc(c.extra.title)}</p>
          <ul class="chips">${c.extra.items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        </div>` : ""}
          <p class="news-foot">${esc(c.proof)}</p>
        </div>
      </div>
    </article>`).join("");
  $("#story-progress").innerHTML = STORY.map((c) => `<span>${esc(c.title)}</span>`).join("");
  // Podpisy zdjęć w stopce (licencja Unsplash nie wymaga przypisu, ale go podajemy).
  $("#credits").innerHTML = "Zdjęcia w rozdziałach: Unsplash (" + STORY.map((c) => `<a href="${c.credit}" target="_blank" rel="noopener">${esc(c.tag)}</a>`).join(", ") + ")";
}

function renderCases() {
  $("#cases").innerHTML = CASES.map((c) => `
    <article class="case${CASES.indexOf(c) % 2 ? " is-flipped" : ""}" id="teczka-${c.id}" aria-labelledby="case-${c.id}">
      <div class="case-side">
        <div class="case-sticky">
          <h3 id="case-${c.id}">${esc(c.title)}</h3>
          <p class="case-area">${esc(c.area)}</p>
          <ul class="chips">${c.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
          <div class="case-cover glass" aria-hidden="true">${projectVisual(c.cover)}</div>
        </div>
      </div>
      <div class="case-deck">
        ${c.artefacts.map((a, i) => `
          <figure class="artefact glass reveal ${i === 0 || i === 3 ? "is-wide" : ""}" style="--i:${i}">
            <figcaption>
              <span class="art-label">${esc(a.label)}</span>
              <span class="art-title">${esc(a.title)}</span>
            </figcaption>
            <div class="art-body">${artefactVisual(a)}</div>
          </figure>`).join("")}
      </div>
    </article>`).join("");
}

function renderSkills() {
  $("#skills").innerHTML = SKILL_GROUPS.map((g) => `
    <section class="skill-group" aria-label="${esc(g.title)}">
      <h3>${esc(g.title)}</h3>
      <ul class="chips">${g.items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    </section>`).join("");
}

export function renderAll() {
  bindProfile();
  renderFacts();
  renderStory();
  renderCases();
  renderSkills();
}
