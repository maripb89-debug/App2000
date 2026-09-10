# Stifinner — statisk demoside

En statisk nettside inspirert av [ut.no](https://www.ut.no/), bygget som øvingsoppgave (ArbeidsKrav 1). Ren HTML, CSS og vanilla JavaScript — ingen backend, database, byggeverktøy eller eksterne API-kall. Alt innhold ligger hardkodet i `js/data.js` og rendres i nettleseren.

Dette dokumentet forklarer hvordan CSS-en er bygget opp, hvordan JavaScript-en er delt opp, og hvordan HTML-sidene kobler alt sammen.

## Mappestruktur

```
├── index.html              Forside
├── turer.html               Utforsk turer (filter + resultatliste)
├── tur.html                 Turdetalj (?slug=... i URL)
├── hytter.html               Utforsk hytter (filter + resultatliste)
├── hytte.html                Hyttedetalj (?slug=... i URL)
├── kart.html                 Kart-plassholder
├── mine-turer.html           Lagrede favoritter
├── huskelister.html          Pakkelister
├── om.html                   Om siden / kontakt / personvern
├── css/
│   └── style.css             Hele stilarket — én fil, se under
└── js/
    ├── data.js                Alt innhold: turer, hytter, aktiviteter, regioner
    ├── app.js                 Delte funksjoner brukt av alle sider
    ├── home.js                 Rendrer forsiden
    ├── turer.js / hytter.js     Filter- og søkelogikk for utforsker-sidene
    ├── tur-detail.js / hytte-detail.js   Rendrer detaljsidene
    ├── mine-turer.js            Rendrer favoritt-listen
    └── huskelister.js           Pakkeliste-logikk (egen data i toppen av filen)
```

Ingen `package.json`, ingen `node_modules` — filene kan åpnes direkte i nettleseren eller serveres med hvilken som helst statisk filserver.

## CSS — `css/style.css`

Alt ligger i **én fil**, delt inn i tydelig merkede seksjoner (søk etter `/* ---- */`-kommentarene for å finne fram). Rekkefølgen ovenfra og ned:

1. **`:root` — design-tokens.** Alle farger (`--forest-900`, `--amber-500` osv.), radius-verdier, skygger, `--container` (sidens maks-bredde) og fontstabler er definert som CSS-variabler her. Endrer du en farge, endrer du den ett sted.
2. **Reset og base.** `*{box-sizing}`, `html{font-size}` (rot-størrelsen alt annet skaleres fra via `rem`), `body`, overskrifter, `.wrap` (den gjenbrukte innholds-kolonnen med `max-width: var(--container)`).
3. **Komponent-seksjoner, én per bruksområde:** Header/Nav → Buttons → Hero → Activity cards → Sections → Trip/cabin card → CTA cards → Filter layout → Detail page → Checklist page → Footer → Misc pages (kart/om) → Notice. Hver seksjon inneholder CSS-en for de HTML-klassene med samme navn (`.card`, `.filter-panel`, `.checklist-item` osv.) — du finner stilen til et element ved å søke på klassenavnet.
4. **`@media`-seksjonen nederst** håndterer responsivt design i to retninger:
   - **Smalere skjermer** (`max-width`): navigasjonen blir et hamburgermeny-ikon under 1650px (se egen forklaring i CSS-kommentaren), og layout går fra flerkolonne til én kolonne på telefon.
   - **Bredere skjermer** (`min-width`): `--container` vokser trinnvis opp mot 34"-skjermer, slik at innhold ikke drukner i tomrom på store monitorer.

### Gjennomgående mønstre verdt å vite om

- **Grid-kolonner bruker `repeat(auto-fit, minmax(min(Xpx, 100%), 1fr))`** i stedet for bare `minmax(Xpx, 1fr)`. `min(Xpx, 100%)` hindrer at et element krever mer plass enn skjermen faktisk har (unngår horisontal scroll på smale skjermer).
- **`min-width: 0`** er satt eksplisitt mange steder (grid-/flex-barn, overskrifter, `main`-elementer). Uten dette kan langt innhold (et langt ord, en lang tittel) tvinge boksen sin til å bli bredere enn den har plass til. Dette er den vanligste kilden til layout-feil i prosjektet, og fikset systematisk der det dukket opp.
- **`overflow-wrap: break-word`** er satt globalt på `body`, som en siste sikkerhet mot at et enkelt langt ord sprenger en smal boks.
- **Turkort/hyttekort** (`.card`) er låst til nøyaktig 4 per rad på forsiden og på Utforsker-sidene fra en viss skjermbredde (`repeat(4, 1fr)`), i stedet for å bli flere og smalere jo bredere skjermen er.

## JavaScript — `js/`

### `data.js` — innholdet

Ren data, ingen logikk. Definerer `AKTIVITETER`, `REGIONER`, `TURER` (array av turobjekter) og `HYTTER` (array av hytteobjekter). Dette er «databasen» — siden er statisk, så alt som normalt ville kommet fra et API eller en database ligger her som vanlige JavaScript-objekter. Hvert tur-/hytteobjekt har blant annet `slug` (brukt i URL-en), `koordinater` (klare for når et ekte kart kobles på) og `farge` (brukt som bakgrunn på kortet).

### `app.js` — delte funksjoner (lastes på alle sider)

- `ICONS` / `iconSvg()` — små innebygde SVG-ikoner (footer, kort, meny), ingen ikon-bibliotek.
- `getFavorites()` / `toggleFavorite()` / `isFavorite()` — leser og skriver til `localStorage` under nøkkelen `ut-favoritter`.
- `wireFavButtons()` — kobler klikk-hendelse til alle hjerte-knapper på siden.
- `tripCardHtml()` / `cabinCardHtml()` — bygger HTML-strengen for ett tur-/hyttekort. Brukes av `home.js`, `turer.js`, `hytter.js`, `mine-turer.js` og detalj-sidene (for «lignende turer»/«andre hytter»), slik at alle kort ser like ut uansett hvilken side de vises på.
- `initNav()` — kobler hamburgermeny-knappen, og setter `active`-klasse på riktig nav-lenke basert på `<body data-page="...">`.

### Side-spesifikke scripts

Hver side har ett script som gjør akkurat det den siden trenger:

| Fil | Side | Gjør |
|---|---|---|
| `home.js` | index.html | Rendrer aktivitetskort, 4 utvalgte turer, 4 utvalgte hytter, regionslenker |
| `turer.js` | turer.html | Filter (aktivitet/region/sesong/vanskelighet) + søk over `TURER` |
| `hytter.js` | hytter.html | Filter (region/type) + søk over `HYTTER` |
| `tur-detail.js` | tur.html | Leser `?slug=` fra URL, finner turen i `TURER`, fyller siden |
| `hytte-detail.js` | hytte.html | Samme, men for `HYTTER` |
| `mine-turer.js` | mine-turer.html | Leser favoritter fra `localStorage`, rendrer kortene |
| `huskelister.js` | huskelister.html | Egen `CHECKLISTS`-data øverst i filen + lagring til `localStorage` per liste (`ut-huskeliste-<id>`) |

`kart.html` har i tillegg et lite `<script>`-blokk inline nederst i filen (ikke en egen fil) som bygger forhåndsvisnings-listen over koordinater.

**Lasterekkefølge er viktig.** Alle sider som trenger data eller delte funksjoner laster i denne rekkefølgen nederst i `<body>`:

```html
<script src="js/data.js"></script>   <!-- 1. data må finnes først -->
<script src="js/app.js"></script>    <!-- 2. deler funksjoner som bruker dataen -->
<script src="js/turer.js"></script>  <!-- 3. siden sin egen logikk, bruker begge over -->
```

Sider uten kort/data (`om.html`) laster kun `app.js`, for menyen.

## Hvordan HTML-en kobler alt sammen

Hver side er en frittstående `.html`-fil (ingen templating eller server-side includes), men de deler nøyaktig samme oppbygning:

1. **`<head>`** peker på samme stilark på alle sider: `<link rel="stylesheet" href="css/style.css">`.
2. **`<body data-page="...">`** — attributtet forteller `app.js` hvilken nav-lenke som skal markeres som aktiv. Verdien matcher `data-page` på lenken i menyen (f.eks. `data-page="utforsker"` på både `<body>` på turer.html og på `<a>`-lenken «Utforsker»).
3. **Header og footer er kopiert inn i hver fil.** Siden det ikke finnes noe byggeverktøy, er `<header class="site-header">…</header>` og `<footer class="site-footer">…</footer>` identisk limt inn i alle ni HTML-filene. Endrer du menyen, må du endre den i alle filene (bevisst enkelt valg for et lite, statisk prosjekt).
4. **`<div class="page-body">`** pakker inn alt mellom header og footer på hver side — dette er det som gjør at footeren alltid ligger nederst på korte sider (se `.page-body { flex: 1 0 auto; }` i CSS).
5. **`id`-attributter er limet mellom HTML og JS.** Sidene inneholder tomme «stillaser» som JavaScript fyller ved sidelasting, f.eks.:
   - `<div id="activity-grid"></div>` → fylles av `home.js`
   - `<div id="results"></div>` → fylles av `turer.js` / `hytter.js`
   - `<div id="trip-content">…</div>` og `<div id="not-found">…</div>` → `tur-detail.js` viser den ene og skjuler den andre, avhengig av om `?slug=` finnes i `TURER`
   - `<span id="crumb-title">`, `<button id="side-fav">` osv. → enkeltfelter detalj-sidene fyller inn
6. **Klassenavn er kontrakten mellom HTML og CSS.** `tripCardHtml()` i `app.js` bygger opp nøyaktig den HTML-strukturen (`.card > .thumb > .badge + h3`, `.card > .body > .meta + .desc`) som CSS-seksjonen «Trip / cabin card» forventer — endrer du strukturen i én av dem, må den andre oppdateres tilsvarende.

### Én side i praksis: `turer.html`

1. Nettleseren laster `css/style.css` (styler alt, inkludert de tomme stillasene).
2. `<body data-page="utforsker">` gjør at «Utforsker» i menyen får `active`-klassen når `app.js` kjører.
3. `data.js` laster inn `TURER`-arrayet.
4. `app.js` laster inn `tripCardHtml()` og favoritt-funksjonene.
5. `turer.js` leser eventuelle filter fra URL-en (`?aktivitet=`, `?region=`), bygger filter-chipsene, og kaller `tripCardHtml()` for hver tur som matcher — resultatet settes inn i `<div id="results">`.
6. Klikker brukeren en chip, kjører samme filter-funksjon på nytt uten at siden lastes på nytt.
