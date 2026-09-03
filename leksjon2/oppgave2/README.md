# Huskeliste

En enkel huskeliste-applikasjon laget med HTML, CSS og JavaScript. Brukeren kan skrive inn oppgaver, legge dem til i listen, markere dem som utført og slette dem.

## Filer

- `Huskeliste.html` bygger opp innholdet og strukturen på siden.
- `Huskeliste.css` bestemmer utseendet og tilpasser siden til ulike skjermstørrelser.
- `Huskeliste.js` gir siden funksjonalitet og håndterer brukerens klikk og tastetrykk.

## HTML-oppbygging

- `<!DOCTYPE html>` og `lang="no"` sørger for korrekt HTML5-struktur og riktig språk.
- `<meta name="viewport">` gjør at siden kan tilpasses mobilvisning.
- `<header>` inneholder sidens hovedoverskrift, `Huskeliste`.
- `<main>` inneholder selve applikasjonen.
- `<textarea>` brukes til å skrive inn en oppgave.
- `<button>` brukes til å legge oppgaven til i listen.
- `<ul id="huskeliste">` er en tom liste som får nye `<li>`-elementer gjennom JavaScript.
- `id`-verdiene brukes av JavaScript for å finne riktige HTML-elementer.
- `<label>` er koblet til tekstområdet med `for="txtBoks"` og `id="txtBoks"`. Labelen er skjult visuelt, men er fortsatt tilgjengelig for skjermlesere.

## JavaScript-funksjoner

Funksjonen `leggTilListe()` kjøres når brukeren trykker på knappen.

1. Teksten hentes fra tekstområdet.
2. `trim()` kontrollerer at brukeren faktisk har skrevet noe mer enn mellomrom.
3. Et nytt `<li>`-element opprettes.
4. Teksten legges inn i listeelementet med `textContent`.
5. Et `x`-element opprettes som en slett-knapp.
6. Klikk på raden legger til eller fjerner klassen `ferdig`.
7. Klikk på `x` sletter det aktuelle listeelementet.
8. Tekstområdet tømmes etter at oppgaven er lagt til.

`event.stopPropagation()` brukes på slett-knappen. Det hindrer at klikket på `x` også registreres som et klikk på hele listeelementet og markerer oppgaven som ferdig.

Når brukeren trykker `Enter` i tekstområdet, aktiveres legg-til-knappen. `preventDefault()` hindrer at tekstområdet lager en ny linje.

## CSS og brukergrensesnitt

- Hovedoverskriften har stor skrift og en mørk farge for god lesbarhet.
- Listeelementene får vekslende bakgrunnsfarger med `:nth-child(odd)` og `:nth-child(even)`.
- `:hover` fremhever raden som markøren er over.
- `cursor: pointer` viser at listeelementene og slett-knappen kan klikkes.
- Klassen `.ferdig` gjennomstreker utførte oppgaver og gjør teksten grå.
- Flexbox plasserer legg-til-knappen ved siden av tekstområdet.
- Slett-knappen skyves til høyre med `margin-left: auto`.
- Lange oppgaver brytes slik at de ikke går utenfor skjermen.
- `@media (max-width: 600px)` gjør tekstområdet og legg-til-knappen bredere på små skjermer.
- `max-width: 100%` hindrer innholdet i å bli bredere enn skjermen.

## Tilgjengelighet

- HTML-en bruker semantiske elementer som `header`, `main`, `ul` og `li`.
- Tekstområdet har et tilgjengelig navn gjennom `label`.
- Knappene er ekte `<button>`-elementer og kan brukes med tastatur.
- Tydelig hover-effekt og pekermarkør viser hvilke elementer som er klikkbare.
- Farge og tekst brukes sammen for å vise at en oppgave er utført, slik at informasjonen ikke bare formidles gjennom farge.

## Slik kjører du siden

Åpne `Huskeliste.html` i en nettleser. Filene må ligge i samme mappe, slik at koblingene til `Huskeliste.css` og `Huskeliste.js` fungerer.

## Testing

Test disse handlingene i nettleseren:

- Legg til en oppgave med knappen.
- Legg til en oppgave ved å trykke `Enter`.
- Trykk på en oppgave for å gjennomstreke den.
- Trykk på samme oppgave igjen for å fjerne gjennomstrekingen.
- Trykk på `x` for å slette oppgaven.
- Trykk på Legg til uten tekst for å kontrollere at en tom oppgave ikke blir lagt til.
- Test siden i smal nettleservindu eller mobilvisning.
