/* Delte funksjoner: ikoner, favoritter (localStorage), kort-rendering, meny.
   Alt kjører i nettleseren — ingen server, ingen fetch mot eksterne API-er.
   Denne fila lastes på HVER side (se <script src="js/app.js"> i HTML-en),
   slik at alle sidene kan bruke de samme funksjonene uten å skrive dem flere ganger. */

// Et oppslagsverk (object) fra ikon-navn til rå SVG-"innhold" (bare <path>/<circle>/... uten selve <svg>-taggen).
// Å holde disse som tekst-strenger gjør at vi enkelt kan lime dem inn i en <svg> senere med iconSvg().
const ICONS = {
  fottur: '<path d="M3 18l6-10 4 6 2-3 6 7z"/>',
  skitur: '<line x1="4" y1="20" x2="9" y2="5"/><line x1="15" y1="20" x2="20" y2="5"/><circle cx="6.5" cy="4" r="1.3"/><circle cx="17.5" cy="4" r="1.3"/>',
  topptur: '<path d="M2 19l7-12 4 7 3-4 6 9z"/><circle cx="18.3" cy="4.8" r="1.5"/>',
  sykkeltur: '<circle cx="6" cy="17" r="3.2"/><circle cx="18" cy="17" r="3.2"/><path d="M6 17l4-9h4l4 9M10 8h3M9 17h9"/>',
  padletur: '<line x1="5" y1="19" x2="19" y2="5"/><ellipse cx="5" cy="19" rx="2.3" ry="1.1" transform="rotate(45 5 19)"/><ellipse cx="19" cy="5" rx="2.3" ry="1.1" transform="rotate(45 19 5)"/>',
  hyttetur: '<path d="M4 11l8-7 8 7"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>',
  heart: '<path d="M12 20s-7-4.35-9.5-8.5C.5 8 2 4.5 5.5 4.5c2 0 3.4 1.2 4.5 2.7 1.1-1.5 2.5-2.7 4.5-2.7 3.5 0 5 3.5 3 7-2.5 4.15-9.5 8.5-9.5 8.5z"/>',
  hamburger: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M14.5 9.5l-2 5-5 2 2-5z"/>',
  pin: '<path d="M12 21s7-7.58 7-12a7 7 0 10-14 0c0 4.42 7 12 7 12z"/><circle cx="12" cy="9" r="2.3"/>',
  bunk: '<rect x="3" y="10" width="18" height="8" rx="1.5"/><path d="M3 10V6a1.5 1.5 0 011.5-1.5h4A1.5 1.5 0 0110 6v4M14 10V6a1.5 1.5 0 011.5-1.5h4A1.5 1.5 0 0121 6v4"/>',
  distance: '<path d="M4 19c4-10 12-10 16-14M4 19l3-1M4 19l1-3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  up: '<path d="M4 19h16M6 19V9l6-6 6 6v10"/>',
};

// Bygger en komplett, klar-til-bruk <svg>-tag som streng, for et gitt ikon-navn (nøkkel i ICONS).
// `cls` er en valgfri CSS-klasse man kan gi ikonet (f.eks. for å style størrelse et bestemt sted).
// Malen (template literal med backticks) setter alltid samme faste attributter (viewBox, stroke osv.),
// og limer inn riktig <path>-innhold fra ICONS midt i. Ligger navnet ikke i ICONS, blir det bare et tomt ikon.
function iconSvg(name, cls) {
  return `<svg class="${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

/* ---------- Favoritter (localStorage) ----------
   Samme mønster som innlogging i auth.js: en liste lagres som JSON-tekst
   under én nøkkel i localStorage, og hentes/oppdateres via noen hjelpefunksjoner. */

const FAV_KEY = "ut-favoritter"; // nøkkelen favorittlisten ligger under i localStorage

// Henter hele favorittlisten. Hver favoritt er et lite objekt: { type, slug, lagtTil }.
// Returnerer tomt array hvis ingenting er lagret ennå, eller hvis dataene er ødelagt.
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch (e) {
    return [];
  }
}

// Sjekker om ÉN bestemt tur/hytte allerede er lagret som favoritt.
// `type` er "tur" eller "hytte", `slug` er den unike id-en/"webadresse-vennlige navnet" til den.
// .some() returnerer true hvis MINST ett element i listen matcher begge feltene.
function isFavorite(type, slug) {
  return getFavorites().some((f) => f.type === type && f.slug === slug);
}

// Legger til ELLER fjerner en favoritt, avhengig av om den allerede finnes ("toggle" = "vippebryter").
// Returnerer true/false for om den NÅ er favoritt etter operasjonen (brukes til å style knappen riktig).
function toggleFavorite(type, slug) {
  const favs = getFavorites();
  // findIndex gir posisjonen (0, 1, 2 ...) til treffet i listen, eller -1 hvis den ikke finnes.
  const idx = favs.findIndex((f) => f.type === type && f.slug === slug);
  if (idx >= 0) {
    // Fantes allerede → fjern den ett element fra og med posisjon idx.
    favs.splice(idx, 1);
  } else {
    // Fantes ikke → legg til en ny favoritt bakerst i listen.
    favs.push({ type, slug, lagtTil: new Date().toISOString() });
  }
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  return idx < 0; // true hvis den IKKE fantes fra før (altså: den er favoritt nå, etter at vi la den til)
}

// Kobler klikk-funksjonalitet til alle hjerte-knapper (.fav-btn) inni et gitt element (eller hele
// siden, hvis ingenting sendes inn). Kalles hver gang vi har tegnet nye kort med innerHTML,
// siden innerHTML lager helt nye DOM-elementer som ikke har noen "lyttere" ennå.
function wireFavButtons(root) {
  (root || document).querySelectorAll(".fav-btn").forEach((btn) => {
    // data-type og data-slug ligger som data-attributter på knappen i HTML-malen (se tripCardHtml).
    const { type, slug } = btn.dataset;
    if (isFavorite(type, slug)) btn.classList.add("active");
    btn.addEventListener("click", (e) => {
      e.preventDefault(); // knappen ligger inni en <a>-lenke — ikke naviger bort når vi bare klikker hjertet
      e.stopPropagation(); // og ikke la klikket "boble opp" til lenken rundt heller
      const nowActive = toggleFavorite(type, slug);
      btn.classList.toggle("active", nowActive);
    });
  });
}

/* ---------- Meny (mobil) ---------- */

// Kjøres én gang når siden lastes (se DOMContentLoaded nederst).
// Gjør to ting: (1) kobler hamburger-knappen til å åpne/lukke mobilmenyen,
// og (2) markerer riktig lenke i menyen som "aktiv" ut fra hvilken side vi er på.
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      // Legger til/fjerner CSS-klassen "nav-open" på <body> — selve visningen av menyen
      // styres av CSS ut fra om denne klassen finnes eller ikke.
      document.body.classList.toggle("nav-open");
    });
  }
  // data-page="..." står på <body> i hver HTML-fil (f.eks. data-page="hjem") og forteller
  // hvilken side vi er på nå, slik at riktig menylenke kan få .active-styling.
  const current = document.body.dataset.page;
  if (current) {
    document.querySelectorAll(`.main-nav a[data-page="${current}"]`).forEach((a) => a.classList.add("active"));
  }
}

/* ---------- Innlogget/utlogget i header ----------
   #header-auth er "Logg inn"/"Registrer deg"-knappen i toppmenyen på HVER side (se HTML-en).
   currentUser()/logoutUser() kommer fra auth.js, som nå også lastes inn på hver side. */

// Bytter ut header-knappen med "Logg ut" hvis noen er innlogget, ellers lar den stå som den er
// (vanlig lenke til Login.html, eller Register.html på selve innloggingssiden).
function initAuthUI() {
  const btn = document.getElementById("header-auth");
  // typeof-sjekken er en ekstra sikkerhet i tilfelle auth.js av en eller annen grunn ikke er lastet.
  if (!btn || typeof currentUser !== "function") return;

  const user = currentUser();
  if (!user) return; // ingen innlogget → ikke gjør noe, la Logg inn/Registrer deg stå som normalt

  btn.textContent = "Logg ut";
  btn.href = "#"; // ikke en ekte side å navigere til — knappen skal bare logge ut når man klikker
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    logoutUser();
    window.location.href = "index.html"; // send brukeren til forsiden etter utlogging
  });
}

/* ---------- Formattering ---------- */

// Slår opp det "pene" visningsnavnet for en aktivitetsnøkkel (f.eks. "fottur" -> "Fottur"),
// ved å se i AKTIVITETER-objektet fra data.js. Faller tilbake til selve nøkkelen hvis den mangler.
function aktivitetNavn(key) {
  return (AKTIVITETER[key] && AKTIVITETER[key].navn) || key;
}

// Gjør om en liste med sesong-nøkler (f.eks. ["sommer","høst"]) til en lesbar,
// komma-separert tekst med stor forbokstav ("Sommer, Høst").
function sesongNavn(list) {
  const map = { sommer: "Sommer", vinter: "Vinter", høst: "Høst", vår: "Vår" };
  return list.map((s) => map[s] || s).join(", ");
}

/* ---------- Kort-rendering ----------
   Disse funksjonene tar inn ETT tur/hytte-objekt (fra TURER/HYTTER i data.js)
   og returnerer en ferdig HTML-streng for "kortet" som vises i rutenettene.
   Sidene limer så disse sammen med .map(...).join("") og setter dem inn med innerHTML. */

function tripCardHtml(t) {
  return `
  <a class="card" href="tur.html?slug=${t.slug}">
    <button class="fav-btn" data-type="tur" data-slug="${t.slug}" aria-label="Lagre ${t.tittel}">${iconSvg("heart")}</button>
    <div class="thumb" style="background: linear-gradient(135deg, ${t.farge}, ${t.farge}cc);">
      <span class="badge">${aktivitetNavn(t.aktivitet)}</span>
      <h3>${t.tittel}</h3>
    </div>
    <div class="body">
      <div class="meta">
        <span>${iconSvg("pin")} ${t.region}</span>
        <span>${iconSvg("distance")} ${t.lengdeKm} km</span>
      </div>
      <p class="desc">${t.kort}</p>
      <div class="foot">
        <span class="meta"><span>${t.vanskelighet}</span></span>
      </div>
    </div>
  </a>`;
}

function cabinCardHtml(c) {
  return `
  <a class="card" href="hytte.html?slug=${c.slug}">
    <button class="fav-btn" data-type="hytte" data-slug="${c.slug}" aria-label="Lagre ${c.navn}">${iconSvg("heart")}</button>
    <div class="thumb" style="background: linear-gradient(135deg, ${c.farge}, ${c.farge}cc);">
      <span class="badge">${c.type}</span>
      <h3>${c.navn}</h3>
    </div>
    <div class="body">
      <div class="meta">
        <span>${iconSvg("pin")} ${c.region}</span>
        <span>${iconSvg("bunk")} ${c.senger} senger</span>
      </div>
      <p class="desc">${c.kort}</p>
    </div>
  </a>`;
}

// Starter menyen og header-knappen så snart HTML-en er ferdig lastet inn i nettleseren
// (DOMContentLoaded = "dokumentet er klart", uten å vente på bilder osv.).
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initAuthUI();
});
