// Huskelister (pakkelister) for dagstur og overnattingstur.
// Hver liste lagres i sin egen nøkkel i localStorage, slik at avkryssing og
// egne tillegg huskes neste gang siden åpnes.

// Beskriver de to listene vi tilbyr og hva de starter med ("standard"-punktene).
// id-en brukes til å bygge en unik localStorage-nøkkel per liste (se checklistKey).
const CHECKLISTS = [
  {
    id: "dagstur",
    navn: "Dagstur",
    standard: [
      "Kart og kompass / GPS",
      "Regntøy",
      "Ekstra klærlag",
      "Mat og drikke",
      "Førstehjelpsskrin",
      "Hodelykt",
      "Fulladet mobil",
      "Solkrem",
    ],
  },
  {
    id: "overnatting",
    navn: "Hytte- eller telttur",
    standard: [
      "Sovepose",
      "Liggeunderlag",
      "Kokeapparat og gass",
      "Nøkkelkort til DNT-hytte",
      "Ekstra klær",
      "Toalettsaker",
      "Lader og powerbank",
      "Vanndunk",
    ],
  },
];

// Bygger localStorage-nøkkelen for én bestemt liste, f.eks. "ut-huskeliste-dagstur".
function checklistKey(id) {
  return `ut-huskeliste-${id}`;
}

// Henter punktene for én liste. Hvert punkt er et objekt: { tekst, ferdig } (ferdig = avhuket eller ikke).
// Hvis brukeren aldri har lagret noe for denne listen (eller lagringen er ødelagt),
// bygger vi startlisten fra list.standard i stedet, alle satt til "ikke ferdig".
function loadList(list) {
  const raw = localStorage.getItem(checklistKey(list.id));
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      /* falls through to default below */
    }
  }
  return list.standard.map((tekst) => ({ tekst, ferdig: false }));
}

// Lagrer punktene for én liste tilbake til localStorage (som JSON-tekst).
function saveList(id, items) {
  localStorage.setItem(checklistKey(id), JSON.stringify(items));
}

// Bygger og "kobler til" ett komplett huskeliste-kort (checkbokser, "legg til"-felt, nullstill-knapp).
// Returnerer selve DOM-elementet (<div class="checklist-card">...), klart til å settes inn i siden.
function renderChecklistCard(list) {
  const items = loadList(list); // items holdes i minnet mens siden er åpen, og lagres på nytt ved hver endring

  // Bygger selve kortets "skall" med document.createElement + innerHTML,
  // med tomme plassholdere (#items-... og et input-felt) som fylles/oppdateres av draw() under.
  const card = document.createElement("div");
  card.className = "checklist-card";
  card.innerHTML = `
    <h3>${list.navn} <button class="reset-link" data-reset="${list.id}">Nullstill</button></h3>
    <div class="checklist-items" id="items-${list.id}"></div>
    <div class="add-item-row">
      <input type="text" placeholder="Legg til punkt …" id="input-${list.id}" />
      <button class="btn btn-primary btn-sm" data-add="${list.id}">Legg til</button>
    </div>
  `;

  // Tegner selve punktene på nytt ut fra `items`-arrayet. Kalles hver gang noe endres
  // (avkrysning, fjerning, tillegg, nullstilling) slik at det som vises alltid stemmer med dataene.
  function draw() {
    const itemsEl = card.querySelector(`#items-${list.id}`);
    itemsEl.innerHTML = items
      .map(
        (it, i) => `
        <div class="checklist-item ${it.ferdig ? "done" : ""}">
          <input type="checkbox" id="chk-${list.id}-${i}" ${it.ferdig ? "checked" : ""} data-idx="${i}" />
          <label for="chk-${list.id}-${i}">${it.tekst}</label>
          <button class="remove" data-remove="${i}" aria-label="Fjern">&times;</button>
        </div>`
      )
      .join("");
  }

  // "change"-hendelsen fyres når en checkbox blir krysset av/fjernet.
  // e.target.matches(...) sjekker at det faktisk var en checkbox som utløste hendelsen
  // (siden hendelsen kan boble opp fra hva som helst inni kortet).
  card.addEventListener("change", (e) => {
    if (e.target.matches("input[type=checkbox]")) {
      const idx = Number(e.target.dataset.idx); // data-idx forteller hvilket punkt i items-arrayet dette er
      items[idx].ferdig = e.target.checked;
      saveList(list.id, items);
      draw();
    }
  });

  // Ett samlet "click"-lyttepunkt for alle tre knappe-typene (fjern, legg til, nullstill),
  // i stedet for én lytter per knapp — enklere når knappene tegnes på nytt hele tiden.
  card.addEventListener("click", (e) => {
    if (e.target.matches("[data-remove]")) {
      const idx = Number(e.target.dataset.remove);
      items.splice(idx, 1); // fjerner ett element fra arrayet på gitt posisjon
      saveList(list.id, items);
      draw();
    }
    if (e.target.matches("[data-add]")) {
      const input = card.querySelector(`#input-${list.id}`);
      const val = input.value.trim();
      if (val) {
        items.push({ tekst: val, ferdig: false });
        saveList(list.id, items);
        input.value = ""; // tøm feltet igjen etter at punktet er lagt til
        draw();
      }
    }
    if (e.target.matches("[data-reset]")) {
      // Nullstill: tøm arrayet helt, og fyll det på nytt med standard-punktene (alle uavhuket).
      items.length = 0;
      list.standard.forEach((tekst) => items.push({ tekst, ferdig: false }));
      saveList(list.id, items);
      draw();
    }
  });

  // Gjør at man kan trykke Enter i tekstfeltet for å legge til punktet,
  // i stedet for å måtte klikke "Legg til"-knappen med musa.
  card.querySelector(`#input-${list.id}`).addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      card.querySelector(`[data-add="${list.id}"]`).click(); // "trykker" på Legg til-knappen for oss
    }
  });

  draw(); // tegn punktene med det samme, før kortet vises
  return card;
}

// Lager ett kort per liste i CHECKLISTS, og setter dem inn i rutenettet på siden.
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("checklist-grid");
  CHECKLISTS.forEach((list) => grid.appendChild(renderChecklistCard(list)));
});
