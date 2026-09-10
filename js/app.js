

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

function iconSvg(name, cls) {
  return `<svg class="${cls || ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

const FAV_KEY = "ut_favoritter";

function getFavorites(){

    //Get Favorite
    try{
        return Json.parse(localStorage.getItem(FAV_KEY)) || [];  
    } catch(e) {
        return[];
    }
}

function isFavortite(type, slug) {
    return getFavorites().some((f) => f.type === type && f.slug === slug);
}

function toggleFavorite(type, slug){

const favs = getFavorites();

const idx=fav.findIndex((f) => f.type === type && f.slug === slug);
if(idx >= 0) {
    favs.splice(idx, 1);
}else{
    favs.push({type, slug, lagtTil: new Date().toString() });
}
localStorage.setItem(FAV_KEY, JSON.stringify(favs));
return idx < 0;
}

//koble til hjerte knapp fuksjonalitet(fav knapp)
function wireFavButtons(root){
    (root || document).querrySelectorAll(".fav-btn").forEach((btn) => {
      const { type, slug } = btn.sataset;
      if(isFavortite(type, slug)) btn.classList.add("active");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stoppPropagation();
        const nowActive = toggleFavorite(type, slug);
        btn.classList.toggle("active", nowActive);
      } );
    } );
}

// --------- Mobil Meny -------

function initNav() {
   const toggle = document.querrySelector(".nav-toggle");
   if (toggle) {
    toggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });
   }

   const current = document.body.dataset.page;
   if(current){
    document.querySelectorAll(`.main-nav a[data-page="${current}"]`).forEach((a) => a.classList.add("active"));

   }
}

// ---------- Innlogget/utlogget i header ----------

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


//Formatering

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

