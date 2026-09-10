// Fyller ut hytte.html (detaljsiden for én hytte) ut fra hvilken hytte som er valgt.
document.addEventListener("DOMContentLoaded", () => {
  // Hvilken hytte skal vises? Det står i URL-en, f.eks. hytte.html?slug=gjendesheim.
  // URLSearchParams gjør det enkelt å lese ut verdien av ?slug=... uten å parse teksten selv.
  const slug = new URLSearchParams(window.location.search).get("slug");
  const c = HYTTER.find((x) => x.slug === slug); // finn hytte-objektet i data.js med denne slugen

  // Ugyldig eller manglende slug (f.eks. noen skriver inn en tulle-URL) → vis "fant ikke"-melding og stopp.
  if (!c) {
    document.getElementById("not-found").style.display = "block";
    return;
  }

  // Fant hytta → vis selve innholdet, og sett fane-tittelen i nettleseren.
  document.getElementById("cabin-content").style.display = "block";
  document.getElementById("page-title").textContent = `${c.navn} — Stifinner`;

  // Toppbildet er ikke et ekte bilde, men en fargeovergang (gradient) satt direkte som inline style,
  // ut fra hyttens egen farge-verdi i data.js.
  const hero = document.getElementById("hero-bg");
  hero.style.background = `linear-gradient(135deg, ${c.farge}, ${c.farge}99)`;
  document.getElementById("hero-badge").textContent = c.type;
  document.getElementById("hero-title").textContent = c.navn;
  document.getElementById("hero-sub").textContent = c.region;

  // Nøkkeltallene i "stat-raden".
  document.getElementById("stat-senger").textContent = c.senger;
  document.getElementById("stat-type").textContent = c.type;
  document.getElementById("stat-region").textContent = c.region;

  // Selve beskrivelsen og fasilitetslisten.
  document.getElementById("cabin-desc").textContent = c.beskrivelse;
  document.getElementById("cabin-fasiliteter").innerHTML = c.fasiliteter.map((f) => `<li>${f}</li>`).join("");
  // toFixed(4) runder koordinatene til 4 desimaler, for en ryddig visning inntil et ekte kart kobles på.
  document.getElementById("cabin-coords").textContent = `${c.koordinater.lat.toFixed(4)}, ${c.koordinater.lng.toFixed(4)} — klar for kart-API`;

  // De samme opplysningene gjentatt i sidepanelet (mindre "faktaboks").
  document.getElementById("side-type").textContent = c.type;
  document.getElementById("side-region").textContent = c.region;
  document.getElementById("side-senger").textContent = c.senger;

  // "Lagre til Mine turer"-knappen: tekst og farge avhenger av om hytta allerede er favoritt.
  const favBtn = document.getElementById("side-fav");
  function paintFav() {
    const active = isFavorite("hytte", c.slug); // fra app.js — sjekker localStorage-favorittene
    favBtn.textContent = active ? "Lagret i Mine turer ✓" : "Lagre til Mine turer";
    // classList.toggle(klasse, betingelse) setter PÅ klassen hvis betingelsen er true, av hvis false.
    favBtn.classList.toggle("btn-primary", !active);
    favBtn.classList.toggle("btn-ghost", active);
  }
  paintFav(); // sett riktig utseende med det samme siden lastes
  favBtn.addEventListener("click", () => {
    toggleFavorite("hytte", c.slug); // fra app.js — legger til/fjerner i localStorage
    paintFav(); // og oppdater knappens utseende igjen etterpå
  });

  // "Andre hytter i samme region" nederst: samme region, men ikke hytta vi allerede er på,
  // og maks 3 stykker (.slice(0, 3)) så seksjonen ikke blir for lang.
  const related = HYTTER.filter((x) => x.slug !== c.slug && x.region === c.region).slice(0, 3);
  const relatedEl = document.getElementById("related-cabins");
  relatedEl.innerHTML = related.map(cabinCardHtml).join(""); // cabinCardHtml kommer fra app.js
  wireFavButtons(relatedEl); // koble hjerte-knappene på de nye kortene også
});
