



const skjema = document.querySelector("#registreringsskjema");
const passord = document.querySelector("#passord");
const gjentaPassord = document.querySelector("#gjentaPassord");
const melding = document.querySelector("#melding");

skjema.addEventListener("submit", function (event) {
    event.preventDefault();

    if (passord.value !== gjentaPassord.value) {
        gjentaPassord.setCustomValidity("Passordene må være like.");
    } else {
        gjentaPassord.setCustomValidity("");
        melding.textContent = "Brukeren er registrert.";
    }

    skjema.reportValidity();
});