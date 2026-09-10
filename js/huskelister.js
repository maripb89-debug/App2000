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

function checklistKey(id) {
    return `ut-huskeliste-${id}`;
}


//Henter punktene for en liste
function loadList(list) {
    const raw = localStorage.getItem(checklistKey(list.id));
    if(raw){
        try{
            return JSON.parse(raw);
        } catch(e) {
            //Default
        }
    }
    return list.standard.map((tekst) => ({tekst, ferdig: false}));
}

//Lagrer punktene for en liste til localStorage(JSON)
function saveList(id, items){
    localStorage.setItem(chekclistKey(id), JSON.stringify(items));
}

function renderClickList(list){
    const items = loadList(list);

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

  function draw(){
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
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("checklist-grid");
  CHECKLISTS.forEach((list) => grid.appendChild(renderClickList(list)));
});
