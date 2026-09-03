
const tekstOmråde = document.querySelector("#txtBoks");

function leggTilListe(e) { 
    const tekst = tekstOmråde.value;
    

    if (tekst.trim() !== "") {
        const liste = document.querySelector("ul");
        const listItem = document.createElement("li");
        listItem.textContent = tekst;
        listItem.addEventListener("click", function (e) {
        listItem.classList.toggle("ferdig");
        });
        const slettKnapp = document.createElement("button");
        slettKnapp.textContent = "x";
        slettKnapp.type = "button";
        slettKnapp.addEventListener("click", function(e) {
            e.stopPropagation();
            listItem.remove();
        });
        
        listItem.appendChild(slettKnapp);
        liste.appendChild(listItem);
        tekstOmråde.value = "";
    }
}

const knapp = document.querySelector("#leggTilKnapp");
tekstOmråde.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        knapp.click();
    }
});
knapp.addEventListener("click",leggTilListe);
