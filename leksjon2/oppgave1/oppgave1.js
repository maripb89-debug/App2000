alert("Hei"); 

// lytte funksjon
function slettAvsnitt(e) {
    alert("slett..."); 
    e.target.remove()
}

function leggTilTekst(e) { 
    const tekstOmråde = document.querySelector("#txtBoks");
    const tekst = tekstOmråde.value;
    const kroppen = document.body;
    const avsnitt = document.createElement("p");
    const tekstNode = document.createTextNode(tekst);
    avsnitt.appendChild(tekstNode);
    kroppen.appendChild(avsnitt);
    avsnitt.addEventListener("click", slettAvsnitt);

}
// få tak i tekst området, få tak i teksten
// lage p noder og få teksten 
// vise teksten i en p element lengre ned på nettsiden

// få tak i knappen, vi skal ikke endre knapper derfor skriver vi cons. 
const knapp = document.querySelector("#leggTilKnapp");
knapp.addEventListener("click",leggTilTekst);
