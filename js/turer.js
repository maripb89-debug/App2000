// Utforsker-siden for turer (turer.html): søk + filtrering på aktivitet/region/sesong/vanskelighet.
// Samme oppskrift som hytter.js, bare med flere filtre siden turer har flere egenskaper å filtrere på.
document.addEventListener("DOMContentLoaded", () => {
  // Les eventuelle filtre som allerede ligger i URL-en, f.eks. fra en lenke på forsiden
  // (turer.html?aktivitet=fottur) eller et søk i søkeboksen (turer.html?q=...).
  const params = new URLSearchParams(window.location.search);

  // Faste turer fra data.js + eventuelle turer brukeren selv har lagt til (localStorage, app.js).
  const alleTurer = TURER.concat(getEgneTurer());

  // `state` er "alt som er valgt akkurat nå". aktivitet/region/sesong/vanskelighet er Set-er
  // (mengder) — de sier bare "er denne verdien valgt eller ikke", og gjør det raskt å
  // legge til/fjerne/sjekke uten å lete gjennom et vanlig array selv.
  const state = {
    q: params.get("q") || "",
    aktivitet: new Set(params.get("aktivitet") ? [params.get("aktivitet")] : []),
    region: new Set(params.get("region") ? [params.get("region")] : []),
    sesong: new Set(),
    vanskelighet: new Set(),
  };

  const searchInput = document.getElementById("f-search");
  const aktivitetGroup = document.getElementById("f-aktivitet");
  const regionGroup = document.getElementById("f-region");
  const resultsEl = document.getElementById("results");
  const countEl = document.getElementById("result-count");
  const emptyEl = document.getElementById("empty-state");

  searchInput.value = state.q; // gjenspeil ?q=... fra URL-en i selve søkefeltet

  // Bygger chip-knappene for aktivitet ut fra AKTIVITETER-objektet i data.js …
  aktivitetGroup.innerHTML = Object.keys(AKTIVITETER)
    .map((key) => `<button class="chip" data-value="${key}">${AKTIVITETER[key].navn}</button>`)
    .join("");

  // … og chip-knappene for region ut fra REGIONER-listen.
  regionGroup.innerHTML = REGIONER.map((r) => `<button class="chip" data-value="${r}">${r}</button>`).join("");

  // Setter/fjerner "active" på hver chip ut fra om verdien dens ligger i tilhørende Set i `state`.
  // Kjøres etter enhver endring, slik at knappene alltid viser det som faktisk er valgt.
  function syncChipUI() {
    document.querySelectorAll(".chip-group").forEach((group) => {
      const key = group.dataset.group; // f.eks. "aktivitet", "region", "sesong" — matcher `state`
      group.querySelectorAll(".chip").forEach((chip) => {
        chip.classList.toggle("active", state[key].has(chip.dataset.value));
      });
    });
  }

  // Avgjør om ÉN tur skal vises, ut fra alle filtrene. Returnerer false med en gang
  // et filter ikke stemmer — resten av sjekkene kjøres da ikke i det hele tatt.
  function matches(t) {
    if (state.aktivitet.size && !state.aktivitet.has(t.aktivitet)) return false;
    if (state.region.size && !state.region.has(t.region)) return false;
    if (state.vanskelighet.size && !state.vanskelighet.has(t.vanskelighet)) return false;
    // t.sesong er selv en liste (en tur kan passe flere sesonger) — .some() sjekker om
    // MINST ÉN av turens sesonger er blant dem brukeren har valgt.
    if (state.sesong.size && !t.sesong.some((s) => state.sesong.has(s))) return false;
    if (state.q) {
      const q = state.q.toLowerCase();
      const haystack = `${t.tittel} ${t.region} ${t.startpunkt} ${t.kort}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  }

  // Tegner resultatlisten på nytt. Kalles etter alle endringer (søk, chip-klikk, nullstill).
  function render() {
    const list = alleTurer.filter(matches);
    countEl.textContent = `${list.length} ${list.length === 1 ? "tur" : "turer"} funnet`;
    resultsEl.innerHTML = list.map(tripCardHtml).join(""); // fra app.js
    resultsEl.style.display = list.length ? "grid" : "none";
    emptyEl.style.display = list.length ? "none" : "block";
    wireFavButtons(resultsEl);
    syncChipUI();
  }

  // Én klikk-lytter per chip-gruppe fanger klikk på hvilken som helst chip i gruppa.
  document.querySelectorAll(".chip-group").forEach((group) => {
    group.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      const key = group.dataset.group;
      const value = chip.dataset.value;
      if (state[key].has(value)) state[key].delete(value); // var valgt → fjern
      else state[key].add(value); // var ikke valgt → legg til
      render();
    });
  });

  // Oppdaterer søket for hver bokstav som tastes ("input"-hendelsen, ikke bare ved Enter).
  searchInput.addEventListener("input", () => {
    state.q = searchInput.value.trim();
    render();
  });

  // Nullstiller absolutt alt: tomt søk og ingen filtre valgt i noen av gruppene.
  function resetAll() {
    state.q = "";
    state.aktivitet.clear();
    state.region.clear();
    state.sesong.clear();
    state.vanskelighet.clear();
    searchInput.value = "";
    render();
  }

  document.getElementById("f-reset").addEventListener("click", resetAll);
  document.getElementById("empty-reset").addEventListener("click", resetAll);

  render(); // vis resultatene med det samme siden åpnes (med ev. filtre fra URL-en)
});
