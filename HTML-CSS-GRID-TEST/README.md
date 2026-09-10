# Hvordan CSS-en fungerer her

Kort forklaring av [style.css](style.css), skrevet som øving i CSS Grid (ArbeidsKrav).

## Variabler (`:root`)

Farger og fonter er definert som CSS-variabler øverst (`--forest-900`, `--font-head` osv.) og hentes ut med `var(--navn)`. Endrer du en verdi her, endrer den seg overalt den brukes.

## Rot-skriftstørrelse

`html { font-size: 40px; }` setter grunnenheten alle `rem`-verdier regnes ut fra (`1rem` = 40px her). Det er derfor `font-size: 0.85rem` på navlenkene blir 34px i praksis, og `2.2rem` på overskriften blir 88px — samme prinsipp (og samme tall) som brukes på Stifinner-prosjektet, slik at tekststørrelsene matcher.

## Navbaren (`.main-nav`) — CSS Grid

Selve grid-øvelsen: `.main-nav` er en grid-container med tre kolonner:

```css
grid-template-columns: 1fr auto 1fr;
```

- Kolonne 1: logoen (`Sti.no`), plassert med `justify-self: start`
- Kolonne 2: `<ul>`-lista med navigasjonslenker, midtstilt siden den er `auto`-bred mellom to like `1fr`-kolonner
- Begge har `grid-row: 1` satt eksplisitt — uten det ville rekkefølgen i HTML-en avgjort hvilken rad de havnet på (en vanlig grid-fallgruve når elementer plasseres i kolonner "bakover" i forhold til hverandre)

Selve `<ul>`-en er *også* et grid (`display: grid; grid-auto-flow: column`), som legger listepunktene ved siden av hverandre i stedet for under hverandre.

## `.Topp` (header-boksen)

Bruker `display: grid` + `justify-items` for å plassere `h1`/`p` i boksen, og en `linear-gradient` (hvit→grønn) med et ekstra `repeating-linear-gradient`-lag oppå for de skrå hvite stripene. Høyden styres av `padding`, ikke en fast `height` — boksen blir da bare så høy som innholdet trenger.

## Aktivitetsbokser og turkort

To flere grid-eksempler, begge med `repeat(auto-fit, minmax(...))` slik at antall kolonner tilpasser seg bredden automatisk:

- `.activity-grid` — små runde ikon-bokser (Fottur, Skitur), sentrert med `justify-content: center`.
- `.card-grid` — turkort (`.card`) med farget bilde-topp, badge, tittel, region/distanse og beskrivelse — samme oppbygning som turkortene på Stifinner.

## Footer

`.footer-grid` er et tre-kolonners grid (logo/beskrivelse + to lenkelister), med en enkel `.footer-bottom`-rad nederst for copyright.
