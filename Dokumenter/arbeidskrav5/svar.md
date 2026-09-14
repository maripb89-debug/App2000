# Arbeidskrav 5 — Visning av JSON-hyttedata med TypeScript

Filene i denne mappa:

- [`hyttedata.json`](./hyttedata.json) — hardkodet eksempel på hyttedata.
- [`visHytter.ts`](./visHytter.ts) — TypeScript-funksjoner som viser dataene.
- [`index.html`](./index.html) — viser hyttekortene i nettleseren, ved å laste inn `dist/visHytter.js`.

Kompilert og kjørt for å bekrefte at koden faktisk fungerer (se «Hvordan kan koden testes» nederst).

**For å se resultatet i nettleseren:** åpne `index.html` — den laster `dist/visHytter.js`, som er lagt ved ferdig kompilert. Endrer du noe i `visHytter.ts`, må du kjøre kompileringskommandoen under punkt 4 på nytt for at `index.html` skal vise endringen (`dist/` er et bygg-resultat, ikke kildekoden i seg selv — `visHytter.ts` er fasiten).

## 1. Forslag til JSON-representasjon

Turappen trenger å vise en liste med hytter, der hver hytte har både enkle felt (navn, region), et par **underobjekter** (posisjon, kontaktinfo) og **arrays** (fasiliteter, og en liste med romtyper).

```
{
  "hytter": [
    {
      "id": number,
      "slug": string,
      "navn": string,
      "region": string,
      "type": "Betjent" | "Selvbetjent" | "Ubetjent",
      "kort": string,
      "posisjon": { "lat": number, "lng": number },
      "kontakt": { "telefon": string, "epost": string },
      "fasiliteter": string[],
      "rom": [
        { "type": string, "antallSenger": number, "prisPerNatt": number }
      ]
    }
  ]
}
```

- **Objekt**: selve hytte-objektet, og ytterst wrapper-objektet `{ "hytter": [...] }`.
- **Underobjekter**: `posisjon` (koordinater) og `kontakt` (telefon/e-post) — egne objekter inni hytte-objektet.
- **Arrays**: `fasiliteter` er en enkel liste med tekst, `rom` er en liste med *objekter* (romtype, sengeplasser, pris) — viser at en array også kan inneholde strukturerte data, ikke bare tekst/tall.

Et hardkodet eksempel med tre hytter ligger i [`hyttedata.json`](./hyttedata.json).

## 2. TypeScript-funksjon for visning

`visHytter.ts` definerer først typene som speiler JSON-strukturen over (`Posisjon`, `Kontakt`, `Rom`, `Hytte`, `HytteData`), og deler deretter visningslogikken i to:

- **`hentHytteHtml(hytte: Hytte): string`** — en ren funksjon som bygger HTML-strengen for ett hyttekort (regner også ut totalt antall senger og laveste pris ut fra `rom`-arrayet). Ingen avhengighet til nettleseren.
- **`visHytter(data: HytteData, containerId: string): void`** — finner elementet med gitt id i dokumentet og setter innholdet til alle hyttekortene. Dette er selve "visningen", og er den eneste funksjonen som faktisk rører DOM-en.

Denne oppdelingen er bevisst — se punktet om testing.

## 3. Fordeler og ulemper med TypeScript kontra JavaScript

**Fordeler for denne oppgaven:**

- Typene (`Hytte`, `Rom` osv.) dokumenterer nøyaktig hvordan JSON-dataene ser ut. Skriver man `hytte.regio` i stedet for `hytte.region`, eller glemmer `kontakt`-feltet på et hardkodet objekt, sier kompilatoren ifra **før** koden kjøres — i ren JavaScript ville feilen først dukket opp som `undefined` i nettleseren, kanskje ikke før man faktisk klikker seg til akkurat den hytta.
- `type Hyttetype = "Betjent" | "Selvbetjent" | "Ubetjent"` gjør ugyldige verdier umulige å skrive inn ved en feil — med vanlig JavaScript kan `type` inneholde hvilken som helst streng.
- Bedre autofullføring i editoren, siden den vet nøyaktig hvilke felt et `Hytte`-objekt har.
- Endrer man JSON-strukturen senere (f.eks. legger til et nytt felt på `Rom`), viser kompilatoren umiddelbart alle stedene i koden som må oppdateres.

**Ulemper for denne oppgaven:**

- Krever et kompileringssteg (`tsc`) før koden kan kjøre i en nettleser — resten av Stifinner-prosjektet er bevisst bygget uten noe build-verktøy (se README: rene HTML/CSS/JS-filer man kan åpne direkte). Å innføre TypeScript kun for hyttevisningen ville brutt med resten av arkitekturen, med mindre hele prosjektet settes opp med TS.
- Mer å sette seg inn i for en liten oppgave: interfaces, typer, og eventuelt `tsconfig.json`.
- Typene finnes bare ved kompilering — de er borte i JavaScript-koden som til slutt kjører. De hindrer **ikke** feil verdier i selve JSON-fila (f.eks. en feilstavet `"type": "Betjeent"` i `hyttedata.json`), siden JSON-filen ikke sjekkes mot typene med mindre man aktivt validerer den (f.eks. `data as HytteData` er egentlig bare en påstand til kompilatoren, ikke en runtime-sjekk).

**Konklusjon**: for en enkeltstående funksjon som dette gir TypeScript mest verdi når dataene har mange felt/underobjekter (nettopp fordi det er lett å gjøre en skrivefeil i strukturen), men kostnaden (build-steg, ny syntaks) er reell for et ellers byggeløst skoleprosjekt.

## 4. Hvordan kan koden testes ut?

1. **Enhetstesting av de rene funksjonene** (`hentHytteHtml`, `totalSengerForHytte`, `laveastePris`): siden de bare tar inn data og returnerer en verdi — ingen DOM, ingen side-effekter — kan de testes med f.eks. Jest/Vitest ved å sammenligne forventet mot faktisk resultat for noen eksempel-hytter, inkludert kantcaser som en hytte uten rom (`rom: []`).
2. **Typekontroll som automatisk test**: `tsc --strict --noEmit` feiler kompileringen hvis noen prøver å sende inn data som ikke matcher `Hytte`-typen (f.eks. et objekt uten `kontakt`-felt). Dette er gjort under utarbeidelsen av denne besvarelsen — filen kompilerer uten feil under `--strict`.
3. **Manuell test i nettleser** av selve `visHytter` (DOM-delen): en enkel HTML-fil med `<div id="hytte-liste"></div>` som laster den kompilerte JS-fila. Åpne i nettleser og sjekk i dev-verktøyene at riktig antall hyttekort vises, med riktig innhold.
4. **Manuell test i Node** av de rene funksjonene: kjøre den kompilerte JS-fila direkte med `node` (uten noe DOM tilgjengelig) og lese resultatet i konsollen — `visHytter.ts` har en `if (typeof document !== "undefined")`-sjekk nederst som gjør nøyaktig dette mulig, og som ble brukt til å verifisere tallene i denne besvarelsen (10 senger for Gjendesheim, 7 for Fondsbu — stemmer med `rom`-dataene).

**Faktisk kjørt under arbeidet med denne besvarelsen:**

```
npx typescript --strict --target es2020 --lib dom,es2020 --outDir dist visHytter.ts
node dist/visHytter.js
```

ga riktig, feilfri output — se punkt 4 over. `visHytter`-funksjonen ble i tillegg testet i en ekte (headless) nettleser mot en midlertidig testside, som bekreftet at begge hyttene fra `eksempelData` ble tegnet som `.hytte-kort`-elementer uten konsollfeil.
