// Utforsker-siden for hytter (hytter.html): søk + filtrering på region/type.
// Speiler turer.js nesten helt, bare med litt færre filtre (hytter har ikke aktivitet/sesong).
document.addEventListener("DOMContentLoaded", () => {
  // Leser eventuelle filtre som allerede ligger i URL-en (f.eks. hvis man kom hit via en lenke
  // fra forsiden med ?region=..., eller søkte fra søkefeltet på forsiden med ?q=...).
  const params = new URLSearchParams(window.location.search);

  // `state` holder ALT som er valgt akkurat nå: søketekst + hvilke chips (filterknapper) som er aktive.
  // region/type er Set-er (mengder) i stedet for vanlige array, fordi vi bare bryr oss om
  // "er denne verdien valgt eller ikke" — Set gjør add/delete/has raskt og enkelt.
  const state = {
    q: params.get("q") || "",
    region: new Set(params.get("region") ? [params.get("region")] : []),
    type: new Set(),
  };

  const searchInput = document.getElementById("f-search");
  const regionGroup = document.getElementById("f-region");
  const resultsEl = document.getElementById("results");
  const countEl = document.getElementById("result-count");
  const emptyEl = document.getElementById("empty-state");

  searchInput.value = state.q; // hvis vi kom hit med ?q=..., vis det i søkefeltet med det samme

  // Bygger én chip-knapp per region, ut fra REGIONER-listen i data.js.
  regionGroup.innerHTML = REGIONER.map((r) => `<button class="chip" data-value="${r}">${r}</button>`).join("");

  // Går gjennom alle chip-grupper på siden og setter/fjerner "active"-klassen ut fra
  // om verdien deres finnes i det tilhørende Set-et i `state`. Kalles etter enhver endring
  // slik at knappene alltid viser riktig valgt/ikke-valgt.
  function syncChipUI() {
    document.querySelectorAll(".chip-group").forEach((group) => {
      const key = group.dataset.group; // f.eks. "region" — matcher navnet i `state`
      group.querySelectorAll(".chip").forEach((chip) => {
        chip.classList.toggle("active", state[key].has(chip.dataset.value));
      });
    });
  }

  // Sjekker om ÉN hytte skal vises, ut fra alle filtrene som er valgt akkurat nå.
  // Returnerer false så fort ÉTT filter ikke stemmer (og hopper ut av funksjonen med en gang).
  function matches(c) {
    if (state.region.size && !state.region.has(c.region)) return false;
    if (state.type.size && !state.type.has(c.type)) return false;
    if (state.q) {
      const q = state.q.toLowerCase();
      // Slår sammen navn + region + kort-beskrivelse til én tekst vi kan søke i,
      // slik at søket treffer uansett hvilket av disse feltene teksten finnes i.
      const haystack = `${c.navn} ${c.region} ${c.kort}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  }

  // Selve "tegn siden på nytt"-funksjonen. Kjøres hver gang søk eller filter endres.
  function render() {
    const list = HYTTER.filter(matches); // kun hyttene som består ALLE filtrene
    countEl.textContent = `${list.length} ${list.length === 1 ? "hytte" : "hytter"} funnet`;
    resultsEl.innerHTML = list.map(cabinCardHtml).join(""); // fra app.js
    resultsEl.style.display = list.length ? "grid" : "none"; // skjul rutenettet hvis 0 treff …
    emptyEl.style.display = list.length ? "none" : "block"; // … og vis "ingen treff"-meldingen i stedet
    wireFavButtons(resultsEl);
    syncChipUI();
  }

  // Én felles klikk-lytter per chip-gruppe (i stedet for én per knapp) — fanger opp
  // klikk på HVILKEN som helst chip inni gruppa via e.target.closest(".chip").
  document.querySelectorAll(".chip-group").forEach((group) => {
    group.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return; // klikket traff ikke en chip (f.eks. bare tomrommet mellom dem)
      const key = group.dataset.group;
      const value = chip.dataset.value;
      // Vippe av/på: fjern fra Set-et hvis den alt er valgt, ellers legg den til.
      if (state[key].has(value)) state[key].delete(value);
      else state[key].add(value);
      render();
    });
  });

  // Søkefeltet oppdaterer state.q og tegner på nytt for HVER bokstav som skrives ("input"-hendelsen).
  searchInput.addEventListener("input", () => {
    state.q = searchInput.value.trim();
    render();
  });

  // Nullstiller alt tilbake til utgangspunktet: tomt søk, ingen filtre valgt.
  function resetAll() {
    state.q = "";
    state.region.clear();
    state.type.clear();
    searchInput.value = "";
    render();
  }

  document.getElementById("f-reset").addEventListener("click", resetAll);
  document.getElementById("empty-reset").addEventListener("click", resetAll); // knappen inni "ingen treff"-meldingen

  render(); // tegn resultatene med det samme siden lastes (med filtrene fra URL-en, om noen)
});
