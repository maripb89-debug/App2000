# Spesifikasjon: Forsiden (index.html) — Stifinner

| | |
|---|---|
| **Dokumenttype** | Kravspesifikasjon (spec-driven development) |
| **Komponent** | Forsiden (`index.html`) og delte komponenter den bruker (`css/style.css`, header, footer, kort) |
| **Status** | Utkast — klar for implementasjon |
| **Bakgrunn** | Skrevet i etterkant av en iterativ ("vibe coding") utviklingsrunde, som en øvelse i å formalisere ett av kravene — lesbarhet/typografi — som en presis, testbar spesifikasjon i stedet for løs tilbakemelding som «gjør teksten større» |

---

## 1. Formål

Forrige runde med forsiden ble bygget gjennom vibe coding: uformelle tilbakemeldinger («for smalt», «vanskelig å lese») ble tolket og rettet iterativt, uten en skriftlig spesifikasjon å teste mot. Det fungerte, men flere feil (manglende sidepadding, manglende overflow-kontroll) ble oppdaget i etterkant i stedet for å være dekket av krav på forhånd.

Dette dokumentet spesifiserer **neste forbedring — vesentlig større og mer lesbar tekst på forsiden** — på spec-driven-form: konkrete, målbare krav som kan verifiseres uavhengig av implementasjonen, før koden skrives.

## 2. Omfang

**Inkludert:**
- Forsiden (`index.html`): header/navigasjon, hero med søk, aktivitetskort, utvalgte turer, utvalgte hytter, CTA-kort, regionsnarveier, footer.
- Delte typografi-tokens i `css/style.css` som forsiden arver fra (root-skriftstørrelse, knapper, kort, footer).

**Ikke inkludert (egen spesifikasjon ved behov):**
- Innholdsstruktur, navigasjonsvalg eller sidefunksjonalitet — uendret.
- Utforsker-, detalj-, kart-, huskeliste- og om-sidene. De arver de delte tokenene og vil derfor også bli påvirket, men er ikke selv gjenstand for denne spesifikasjonen.
- Ekte kart-/API-integrasjon.

## 3. Nå-tilstand (baseline)

Målt i nåværende `css/style.css`:

| Element | Nåværende verdi | Effektiv størrelse (desktop, root 18px) |
|---|---|---|
| Root / brødtekst | `18px` (16,5px under 480px) | 18px |
| Navigasjonslenker | `1.2rem` | 21,6px |
| Hero-ingress | `1.1rem` | 19,8px |
| Kort-tittel (h3) | `1.15rem` | 20,7px |
| Kort-beskrivelse | `0,97rem` | 17,5px |
| Knapper | `1rem` | 18px |

## 4. Krav

### 4.1 Typografi — skriftstørrelser

**Første utkast av denne tabellen** (root 30px, nav 43px, osv.) ble implementert og testet i nettleser før den ble godkjent — og **feilet**. Header-raden (logo + 4 navigasjonslenker + «Logg inn») har en hard fysisk takhøyde: den har kun plass til étt tekstnivå på én linje. Testet empirisk med Playwright ved 861 px bredde (smaleste bredde der full navigasjon vises, rett over hamburger-grensen):

| Konfigurasjon | Resultat |
|---|---|
| Root 18px, nav 21,6px (dagens, uendret) | ✅ Får plass |
| Root 18px, nav 23px | ❌ «Mine turer» brekker over to linjer, overlapper hero |
| Root 30px, nav 43px (opprinnelig utkast) | ❌ Bryter sammen ved *alle* bredder 861–1440px |

Konklusjon: **root-skriftstørrelse og navigasjonstekst kan ikke økes vesentlig** uten å restrukturere header (f.eks. to rader, eller hamburger-meny ved en mye lavere terskel). Det er utenfor omfanget til denne spesifikasjonen (se punkt 6), så disse to forblir uendret. All økning er i stedet lagt på elementer uten denne begrensningen — hero-tekst, kort, knapper og footer — som har rikelig med plass og der den visuelle effekten uansett er størst siden de utgjør mesteparten av sideinnholdet.

**Endelige, testede mål** (effektiv pikselstørrelse på desktop, root uendret på 18px):

| Element | Nåværende | **Endelig krav** | Endring | Status |
|---|---|---|---|---|
| Root / brødtekst | 18px | 18px (uendret — se begrunnelse over) | 0 % | ⛔ Ikke i omfang |
| Navigasjonslenker | 21,6px | 21,6px (uendret — se begrunnelse over) | 0 % | ⛔ Ikke i omfang |
| Hero-overskrift (h1) | 34–52px (clamp) | 34–52px (uendret) | 0 % | ⛔ Ikke i omfang |
| Hero-ingress | 19,8px | **29,7px** | +50 % | ✅ Implementert |
| Kort-tittel (h3) | 20,7px | **27,9px** | +35 % | ✅ Implementert |
| Kort-beskrivelse | 17,5px | **24,3px** | +39 % | ✅ Implementert |
| Knapper | 18px | **23,4px** | +30 % | ✅ Implementert |
| Footer-lenker | 18px | **23,4px** | +30 % | ✅ Implementert |

Mobil (≤ 480px): root er 18px (opp fra 16,5px), samme verdi som desktop — ingen nav-begrensning der siden hamburger-menyen skjuler navigasjonen under 861px.

### 4.2 Linjelengde og linjeavstand

- Brødtekst (hero-ingress, kortbeskrivelser) skal ha `line-height` mellom **1,5 og 1,6**.
- Ingen avsnitt skal ha en linjebredde over **~70 tegn** ved noen skjermbredde (håndheves via eksisterende `max-width` på tekstblokker).

### 4.3 Kontrast (WCAG 2.1 AA)

Alle tekst/bakgrunn-kombinasjoner på forsiden skal ha kontrastforhold **≥ 4,5:1** for normal tekst og **≥ 3:1** for stor tekst (≥ 24px eller ≥ 19px fet). Verifisert på eksisterende fargepalett — ingen fargeendring kreves:

| Kombinasjon | Kontrastforhold | Krav | Status |
|---|---|---|---|
| `--ink` (#21281f) på `--paper` (#fbfaf6) | 14,49 : 1 | ≥ 4,5 : 1 | ✅ Bestått |
| `--ink-soft` (#4c5548) på hvit (#ffffff) | 7,78 : 1 | ≥ 4,5 : 1 | ✅ Bestått |
| `--ink-soft` (#4c5548) på `--paper` (#fbfaf6) | 7,45 : 1 | ≥ 4,5 : 1 | ✅ Bestått |
| Hvit tekst på `--forest-900` (hero/footer) | 13,53 : 1 | ≥ 4,5 : 1 | ✅ Bestått |
| `--forest-900` på `--forest-100` (aktiv nav) | 11,23 : 1 | ≥ 4,5 : 1 | ✅ Bestått |

### 4.4 Responsivitet (uendret prinsipp, nye tall verifiseres på nytt)

Typografi-økningen skal ikke introdusere horisontal overflow ved noen av følgende referansebredder:

`320, 375, 390, 480, 600, 768, 861, 980, 1024, 1280, 1366, 1440, 1600, 1920, 2560, 3440` px.

### 4.5 Ikke-funksjonelle krav

- Footer skal fortsatt ligge nederst på skjermen når innholdet er kortere enn viewporten (eksisterende sticky-footer-oppførsel skal ikke brytes).
- Ingen endring i sidestruktur, klassenavn eller JavaScript-avhengigheter — kun typografi-verdier i `css/style.css`.

## 5. Akseptansekriterier

Verifisert i nettleser (Playwright) mot de endelige tallene i 4.1:

- [x] Root `font-size` er 18px ved alle bredder (bevisst uendret — se 4.1)
- [x] Navigasjonslenker måler 21,6px effektiv skriftstørrelse, ingen linjebrudd ned til 861px
- [x] Hero-ingress måler 29,7px effektiv skriftstørrelse
- [x] Kort-titler måler 27,9px, kort-beskrivelser 24,3px
- [x] Alle tekst/bakgrunn-par på forsiden har kontrastforhold ≥ 4,5:1 (se 4.3 — uendret fargepalett)
- [x] Ingen horisontal scroll ved noen av de 16 referansebreddene i 4.4 (testet på alle 9 sider, 216 kombinasjoner)
- [x] Footer forblir nederst på skjermen på forsiden ved kort innhold og høy viewport
- [x] Visuell kontroll (skjermbilde) på mobil- og laptop-bredde viser lesbar, balansert typografi uten avkutting eller overlapp

**Bifunn under verifisering:** de større kort-/statistikk-tekstene avdekket to eksisterende CSS Grid-«blowout»-feil (et grid-spor definert som ren `1fr` i stedet for `minmax(0, 1fr)` lar innhold med lange ord som «Krevende» presse elementet bredere enn skjermen, ved 280px bredde på tur-/hyttedetaljsider). Rettet i `css/style.css` (`.detail-layout`, `.stat-row`) som del av denne verifiseringen — et konkret eksempel på hvorfor «test mot akseptansekriteriene før de krysses av» (punkt 7) er selve poenget, ikke en formalitet.

## 6. Ikke-mål

- Denne spesifikasjonen dekker **ikke** en fullstendig redesign av forsiden — kun typografisk lesbarhet.
- Fargepalett, layout-struktur og innhold endres ikke.
- Andre sider enn forsiden spesifiseres ikke her, selv om delte tokens vil påvirke dem.

## 7. Teknisk tilnærming (for implementasjon)

1. Oppdater `--root font-size` og komponent-spesifikke `font-size`-verdier i `css/style.css` i tråd med tabellen i 4.1.
2. Kjør automatisert overflow-sweep (Playwright, alle bredder i 4.4) mot alle punkt i akseptansekriteriene.
3. Ta skjermbilder ved representative bredder (mobil, laptop, 27", 34") for manuell visuell kontroll.
4. Marker punktene i seksjon 5 som bestått først når de er verifisert — ikke anta.

---

*Dette dokumentet er ment som eksempel på forskjellen mellom vibe coding og spec-driven development, omtalt tidligere i samme prosjekt: kravene under er skrevet **før** koden endres, slik at implementasjonen kan testes mot en fast fasit i stedet for mot en følelse.*
