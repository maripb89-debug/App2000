function deleteAvsnitt(e) {
    e.target.remove();
}

function leggTilTekst(e){
   
    const txtArea = document.querySelector("#txtBoks");
    const txt = txtArea.value;

    const body = document.body;
    const avsnitt = document.createElement("p");
    const txtNode = document.createTextNode(txt);
    avsnitt.appendChild(txtNode);
    body.appendChild(avsnitt);
    avsnitt.addEventListener("click", deleteAvsnitt);
}

const btn = document.querySelector("#btn");
btn.addEventListener("click", leggTilTekst);


