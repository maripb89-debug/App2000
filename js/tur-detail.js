// Fyller ut tur.html (detaljsiden for én tur) ut fra hvilken tur som er valgt.
// Speiler oppbyggingen i hytte-detail.js nesten linje for linje, bare med TURER i stedet for HYTTER.
document.addEventListener("DOMContentLoaded", () => {
  // Hvilken tur skal vises? Står i URL-en, f.eks. tur.html?slug=besseggen.
  const slug = new URLSearchParams(window.location.search).get("slug");
  // Faste turer fra data.js + eventuelle turer brukeren selv har lagt til (localStorage, app.js).
  const alleTurer = TURER.concat(getEgneTurer());
  const t = alleTurer.find((x) => x.slug === slug);

  // Ingen tur med denne slugen finnes → vis "fant ikke"-melding og stopp her.
  if (!t) {
    document.getElementById("not-found").style.display = "block";
    return;
  }

  // Fant turen → vis innholdet, og sett fane-tittelen.
  document.getElementById("trip-content").style.display = "block";
  document.getElementById("page-title").textContent = `${t.tittel} — Stifinner`;

  // Toppbildet som en fargeovergang basert på turens egen farge, samme triks som på hyttesiden.
  const hero = document.getElementById("hero-bg");
  hero.style.background = `linear-gradient(135deg, ${t.farge}, ${t.farge}99)`;
  document.getElementById("hero-badge").textContent = aktivitetNavn(t.aktivitet); // "fottur" -> "Fottur" (app.js)
  document.getElementById("hero-title").textContent = t.tittel;
  document.getElementById("hero-sub").textContent = `${t.region} · Start: ${t.startpunkt}`;

  // Nøkkeltallene i stat-raden. Noen turer mangler varighet/stigning (flerdagersturer) —
  // da vises en fornuftig tekst i stedet for "0" eller tomt.
  document.getElementById("stat-lengde").textContent = `${t.lengdeKm} km`;
  document.getElementById("stat-varighet").textContent = t.varighetTimer ? `${t.varighetTimer} t` : "Flere dager";
  document.getElementById("stat-stigning").textContent = t.stigningM ? `${t.stigningM} m` : "—";
  document.getElementById("stat-vanskelighet").textContent = t.vanskelighet;

  // Beskrivelse og tips-liste.
  document.getElementById("trip-desc").textContent = t.beskrivelse;
  document.getElementById("trip-tips").innerHTML = t.tips.map((tip) => `<li>${tip}</li>`).join("");
  document.getElementById("trip-coords").textContent = `${t.koordinater.lat.toFixed(4)}, ${t.koordinater.lng.toFixed(4)} — klar for kart-API`;

  // Sidepanelets faktaboks.
  document.getElementById("side-aktivitet").textContent = aktivitetNavn(t.aktivitet);
  document.getElementById("side-region").textContent = t.region;
  document.getElementById("side-start").textContent = t.startpunkt;
  document.getElementById("side-sesong").textContent = sesongNavn(t.sesong); // fra app.js

  // "Lagre til Mine turer"-knappen, samme oppskrift som på hyttesiden.
  const favBtn = document.getElementById("side-fav");
  function paintFav() {
    const active = isFavorite("tur", t.slug);
    favBtn.textContent = active ? "Lagret i Mine turer ✓" : "Lagre til Mine turer";
    favBtn.classList.toggle("btn-primary", !active);
    favBtn.classList.toggle("btn-ghost", active);
  }
  paintFav();
  favBtn.addEventListener("click", () => {
    toggleFavorite("tur", t.slug);
    paintFav();
  });

  // "Lignende turer" nederst: samme aktivitet ELLER samme region som denne turen,
  // uten å telle med turen selv, og maks 3 stykker.
  const related = alleTurer.filter(
    (x) => x.slug !== t.slug && (x.aktivitet === t.aktivitet || x.region === t.region)
  ).slice(0, 3);
  const relatedEl = document.getElementById("related-trips");
  relatedEl.innerHTML = related.map(tripCardHtml).join("");
  wireFavButtons(relatedEl);
});
