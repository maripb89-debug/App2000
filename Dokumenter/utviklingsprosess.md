# Oppsummering: Hvordan koden ble til

Kort tilbakeblikk på prosessen bak Stifinner-nettsiden, til bruk som dokumentasjon på ArbeidsKrav 1.

## 1. Utgangspunkt

Målet var en statisk nettside inspirert av [ut.no](https://www.ut.no/) — ren HTML/CSS/vanilla JS, uten backend, database eller byggeverktøy. All "database"-funksjonalitet skulle løses med hardkodet data i `js/data.js`, rendret i nettleseren.

## 2. Første runde: vibe coding

Strukturen ble bygget iterativt gjennom uformell dialog:
- Ni HTML-sider (forside, utforsker for turer/hytter, detaljsider, kart, mine turer, huskelister, om) med identisk kopiert header/footer, siden det ikke finnes noe byggeverktøy.
- Ett samlet stilark (`css/style.css`) med design-tokens i `:root`, delt inn i komponentseksjoner.
- JavaScript delt i data (`data.js`), delte funksjoner (`app.js`, bl.a. favoritter via `localStorage` og kortbygging), og side-spesifikk logikk per side.
- Tilbakemeldinger ble gitt løst ("for smalt", "vanskelig å lese") og rettet fortløpende. Dette fungerte, men noen feil — som manglende overflow-kontroll på grid-elementer — ble først oppdaget i etterkant, fordi det ikke fantes noen skriftlig fasit å teste mot.

## 3. Andre runde: spec-driven development

For neste forbedring (større, mer lesbar typografi på forsiden) ble tilnærmingen endret bevisst: kravene ble skrevet ned og gjort målbare *før* koden ble endret, se [spesifikasjon-forside.md](spesifikasjon-forside.md).

Dette avdekket noe konkret: et første forslag til skriftstørrelser (root 30px, nav 43px) ble testet empirisk med Playwright og feilet — navigasjonsraden hadde ikke fysisk plass til teksten ved flere skjermbredder. Kravene ble justert til å øke tekst der det var plass (hero, kort, knapper, footer) og la nav/root stå urørt.

Verifiseringen mot akseptansekriteriene (kontrast, linjebredde, 16 responsive breddepunkt, sticky footer) avdekket i tillegg to eksisterende CSS-grid-feil (`.detail-layout`, `.stat-row`) som ble rettet som en direkte konsekvens av å teste systematisk — ikke noe som ville blitt fanget opp med bare en visuell titt.

## 4. Poenget med de to rundene

De to rundene illustrerer bevisst forskjellen mellom:
- **Vibe coding** — rask iterasjon på løs tilbakemelding, effektivt for å komme i gang, men sårbart for at feil glipper gjennom.
- **Spec-driven development** — krav skrevet og testet før implementasjon, som gjorde at både en feilslått antagelse (nav-størrelse) og skjulte feil (grid-overflow) ble fanget *som del av* prosessen, ikke i etterkant.

Se [README.md](README.md) i samme mappe for den tekniske dokumentasjonen av hvordan CSS, JS og HTML faktisk henger sammen.
