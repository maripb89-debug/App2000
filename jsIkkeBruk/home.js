// Denne fila fyller inn innholdet på forsiden (index.html) etter at siden er lastet.
// HTML-en har noen tomme <div id="..."></div>-bokser, og her henter vi data fra
// data.js og bruker innerHTML til å tegne innholdet inn i dem — samme mønster
// (data -> map -> join("") -> innerHTML) går igjen i alle de andre js-filene.
document.addEventListener("DOMContentLoaded", () => {
  // --- Aktivitetsboksene øverst (Fottur, Skitur, osv.) ---
  const activityGrid = document.getElementById("activity-grid");
  if (activityGrid) {
    // Object.keys(AKTIVITETER) gir oss en liste med nøklene ("fottur", "skitur", ...).
    // .map() bygger én HTML-snutt per aktivitet, .join("") limer dem sammen til én lang streng.
    activityGrid.innerHTML = Object.keys(AKTIVITETER)
      .map((key) => {
        const a = AKTIVITETER[key];
        // Hyttetur peker til hytter.html, alle andre aktiviteter peker til utforskeren
        // med aktiviteten forhåndsvalgt via URL-parameter (?aktivitet=...).
        const href = key === "hyttetur" ? "hytter.html" : `turer.html?aktivitet=${key}`;
        return `
        <a class="activity-card" href="${href}">
          <span class="ico">${iconSvg(a.ikon)}</span>
          <span class="label">${a.navn}</span>
        </a>`;
      })
      .join("");
  }

  // --- Utvalgte turer ---
  // Vi plukker fire bestemte turer (etter id) i stedet for å vise alt, for å holde forsiden kort.
  const featuredIds = [1, 2, 5, 6];
  const featuredTrips = document.getElementById("featured-trips");
  if (featuredTrips) {
    featuredTrips.innerHTML = featuredIds
      .map((id) => TURER.find((t) => t.id === id)) // finn hele tur-objektet for hver id
      .filter(Boolean) // fjerner eventuelle "undefined" (hvis en id ikke skulle finnes)
      .map(tripCardHtml) // gjør hvert tur-objekt om til HTML (funksjon fra app.js)
      .join("");
    wireFavButtons(featuredTrips); // kobler på hjerte-knappene i de nye kortene (fra app.js)
  }

  // --- Utvalgte hytter ---
  // .slice(0, 4) henter bare de fire første hyttene i listen.
  const featuredCabins = document.getElementById("featured-cabins");
  if (featuredCabins) {
    featuredCabins.innerHTML = HYTTER.slice(0, 4).map(cabinCardHtml).join("");
    wireFavButtons(featuredCabins);
  }

  // --- Region-lenker nederst ---
  const regionList = document.getElementById("region-list");
  if (regionList) {
    // encodeURIComponent gjør regionnavn med æøå/mellomrom trygge å bruke i en URL.
    regionList.innerHTML = REGIONER.map(
      (r) => `<a class="chip" href="turer.html?region=${encodeURIComponent(r)}">${r}</a>`
    ).join("");
  }
});
