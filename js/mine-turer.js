// Fyller "Mine turer"-siden med turene/hyttene brukeren har lagret som favoritt
// (favorittene ligger i localStorage, håndtert av getFavorites() i app.js).
document.addEventListener("DOMContentLoaded", () => {
  const favs = getFavorites(); // henter HELE favorittlisten: [{type, slug, lagtTil}, ...]

  // Del listen i to: slug-ene (de unike navnene) til favoritt-turer og favoritt-hytter hver for seg.
  const tripSlugs = favs.filter((f) => f.type === "tur").map((f) => f.slug);
  const cabinSlugs = favs.filter((f) => f.type === "hytte").map((f) => f.slug);

  // Slå opp de fulle tur/hytte-objektene i data.js ut fra slug-ene over,
  // slik at vi har alt vi trenger (tittel, bilde, osv.) for å tegne kortene.
  const trips = TURER.filter((t) => tripSlugs.includes(t.slug));
  const cabins = HYTTER.filter((c) => cabinSlugs.includes(c.slug));

  // Ingen favoritter i det hele tatt → vis "tom liste"-melding og stopp her.
  if (!trips.length && !cabins.length) {
    document.getElementById("empty-favs").style.display = "block";
    return;
  }

  // Vis tur-seksjonen bare hvis det faktisk finnes favoritt-turer.
  if (trips.length) {
    document.getElementById("favs-trips-section").style.display = "block";
    const el = document.getElementById("favs-trips");
    el.innerHTML = trips.map(tripCardHtml).join("");
    wireFavButtons(el);
  }

  // Samme for hytte-seksjonen.
  if (cabins.length) {
    document.getElementById("favs-cabins-section").style.display = "block";
    const el = document.getElementById("favs-cabins");
    el.innerHTML = cabins.map(cabinCardHtml).join("");
    wireFavButtons(el);
  }
});
