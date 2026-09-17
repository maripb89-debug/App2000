"use strict";
/* Arbeidskrav 5 — Visning av JSON-hyttedata med TypeScript.
   Typene under beskriver nøyaktig hvilken form dataene i hyttedata.json har:
   Hytte er hovedobjektet, med to underobjekter (Posisjon, Kontakt) og to arrays
   (fasiliteter: string[], og rom: Rom[] — en array av underobjekter). */
/* ---------- Rene funksjoner (ingen DOM, lette å teste) ---------- */
// Summerer antall senger på tvers av alle rom-typene i en hytte.
function totalSengerForHytte(hytte) {
    return hytte.rom.reduce((sum, rom) => sum + rom.antallSenger, 0);
}
// Billigste rom-pris i hytta, brukes til "fra kr ..."-visning. Returnerer null
// hvis hytta ikke har noen rom registrert (bør egentlig aldri skje, men typen
// rom: Rom[] utelukker ikke en tom liste, så det sjekkes eksplisitt).
function laveastePris(hytte) {
    if (hytte.rom.length === 0)
        return null;
    return Math.min(...hytte.rom.map((rom) => rom.prisPerNatt));
}
// Bygger HTML-strengen for ÉTT hyttekort. Ren funksjon: tar inn data, returnerer
// tekst — ingen side-effekter, ingen avhengighet til dokumentet. Det gjør den
// enkel å enhetsteste (se testforslag i svar.md).
function hentHytteHtml(hytte) {
    const pris = laveastePris(hytte);
    const prisTekst = pris === null ? "Pris ikke oppgitt" : `fra kr ${pris},- / natt`;
    return `
    <article class="hytte-kort" data-slug="${hytte.slug}">
      <h3>${hytte.navn} <span class="badge">${hytte.type}</span></h3>
      <p>${hytte.kort}</p>
      <ul class="hytte-meta">
        <li>${hytte.region}</li>
        <li>${totalSengerForHytte(hytte)} senger totalt</li>
        <li>${prisTekst}</li>
      </ul>
      <p class="fasiliteter">Fasiliteter: ${hytte.fasiliteter.join(", ")}</p>
      <p class="kontakt">${hytte.kontakt.telefon} · ${hytte.kontakt.epost}</p>
    </article>`;
}
/* ---------- Selve visningsfunksjonen (DOM, "urent") ---------- */
// Tegner alle hyttene i `data` inn i elementet med gitt id. Denne funksjonen har en
// side-effekt (endrer DOM-en) og er derfor vanskeligere å enhetsteste enn funksjonene
// over — den er bevisst holdt tynn og delegerer selve HTML-byggingen til hentHytteHtml,
// slik at mesteparten av logikken likevel er testbar uten en nettleser.
function visHytter(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`Fant ikke noe element med id="${containerId}"`);
        return;
    }
    container.innerHTML = data.hytter.map(hentHytteHtml).join("");
}
/* ---------- Demo / manuell test ---------- */
// Samme data som hyttedata.json, skrevet direkte som et TS-objekt her slik at denne
// fila kan kjøres/testes helt for seg selv (uten en egen JSON-loader). I en ekte app
// ville denne heller kommet fra `fetch("hyttedata.json").then(r => r.json())`.
const eksempelData = {
    hytter: [
        {
            id: 1,
            slug: "gjendesheim",
            navn: "Gjendesheim",
            region: "Østlandet",
            type: "Betjent",
            kort: "Startpunkt for Besseggen, med full servering og god standard midt i Jotunheimen.",
            posisjon: { lat: 61.4708, lng: 8.7100 },
            kontakt: { telefon: "61 23 89 00", epost: "gjendesheim@dnt.no" },
            fasiliteter: ["Servering", "Dusj", "Bagasjeoppbevaring", "Butikk"],
            rom: [
                { type: "Dobbeltrom", antallSenger: 2, prisPerNatt: 890 },
                { type: "Sovesal", antallSenger: 8, prisPerNatt: 420 },
            ],
        },
        {
            id: 2,
            slug: "fondsbu",
            navn: "Fondsbu",
            region: "Østlandet",
            type: "Betjent",
            kort: "Vakkert plassert ved Bygdin, populært utgangspunkt for turer i Jotunheimen.",
            posisjon: { lat: 61.3944, lng: 8.4297 },
            kontakt: { telefon: "61 23 47 00", epost: "fondsbu@dnt.no" },
            fasiliteter: ["Servering", "Dusj", "Tørkerom"],
            rom: [
                { type: "Enkeltrom", antallSenger: 1, prisPerNatt: 650 },
                { type: "Sovesal", antallSenger: 6, prisPerNatt: 400 },
            ],
        },
    ],
};
// Kjøres i nettleser: tegner kortene inn i <div id="hytte-liste"> hvis den finnes.
// Kjøres i Node (f.eks. via ts-node, uten DOM): skriver ett formatert kort til
// konsollen i stedet, som en enkel manuell test av hentHytteHtml.
if (typeof document !== "undefined") {
    visHytter(eksempelData, "hytte-liste");
}
else {
    console.log(hentHytteHtml(eksempelData.hytter[0]));
    console.log("Totalt senger, Fondsbu:", totalSengerForHytte(eksempelData.hytter[1]));
}
