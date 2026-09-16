// querySelector finner HTML-elementer ved hjelp av id-ene deres.
const innloggingsskjema = document.querySelector("#innloggingsskjema");
const turSkjema = document.querySelector("#tur-skjema");
const loggUt = document.querySelector("#logg-ut");

// Gjør datoformatet leselig på turkortet.
function formaterDato(dato) {
    return new Intl.DateTimeFormat("no-NO", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(new Date(`${dato}T12:00:00`));
}

// Henter turene som er lagret lokalt i nettleseren.
function hentTurer() {
    return JSON.parse(localStorage.getItem("utsiktTurer")) || [];
}

// Lagrer turene som JSON slik at de kan hentes senere.
function lagreTurer(turer) {
    localStorage.setItem("utsiktTurer", JSON.stringify(turer));
}

// Bygger turkort på nytt etter innlasting, lagring eller sletting.
function visTurer() {
    const turkortListe = document.querySelector("#turkort-liste");
    const tomListe = document.querySelector("#tom-liste");
    const turAntall = document.querySelector("#tur-antall");

    if (!turkortListe) {
        return;
    }

    const turer = hentTurer();
    turkortListe.replaceChildren();
    tomListe.hidden = turer.length > 0;
    turAntall.textContent = `${turer.length} ${turer.length === 1 ? "tur" : "turer"}`;

    turer.forEach((tur, indeks) => {
        // Lager HTML-elementene for én tur.
        const kort = document.createElement("article");
        kort.className = "turkort";

        const innhold = document.createElement("div");
        const tittel = document.createElement("h3");
        const sted = document.createElement("p");
        const dato = document.createElement("p");

        tittel.textContent = tur.navn;
        sted.textContent = tur.sted;
        dato.textContent = `${formaterDato(tur.dato)} · ${tur.vanskelighet}`;
        sted.className = "turkort-sted";
        dato.className = "turkort-detaljer";
        innhold.append(tittel, sted, dato);

        if (tur.beskrivelse) {
            const beskrivelse = document.createElement("p");
            beskrivelse.textContent = tur.beskrivelse;
            beskrivelse.className = "turkort-beskrivelse";
            innhold.append(beskrivelse);
        }

        const slettKnapp = document.createElement("button");
        slettKnapp.type = "button";
        slettKnapp.className = "slett-knapp";
        slettKnapp.textContent = "Slett";
        slettKnapp.addEventListener("click", () => {
            // Fjerner turen og oppdaterer listen.
            const oppdaterteTurer = hentTurer();
            oppdaterteTurer.splice(indeks, 1);
            lagreTurer(oppdaterteTurer);
            visTurer();
        });

        kort.append(innhold, slettKnapp);
        turkortListe.append(kort);
    });
}

if (innloggingsskjema) {
    // Sender brukeren videre etter godkjent HTML-validering.
    innloggingsskjema.addEventListener("submit", (event) => {
        event.preventDefault();

        const epost = document.querySelector("#innloggings-epost").value;
        localStorage.setItem("utsiktBruker", epost.split("@")[0]);
        window.location.href = "mine-turer.html";
    });
}

if (turSkjema) {
    const datoFelt = document.querySelector("#tur-dato");
    const navnFelt = document.querySelector("#tur-navn");
    const stedFelt = document.querySelector("#tur-sted");
    const vanskelighetFelt = document.querySelector("#tur-vanskelighet");
    const beskrivelseFelt = document.querySelector("#tur-beskrivelse");
    const iDag = new Date().toISOString().split("T")[0];
    datoFelt.min = iDag;

    const bruker = localStorage.getItem("utsiktBruker");
    document.querySelector("#brukernavn").textContent = bruker || "Turvenn";

    // Ekstra regler som HTML alene ikke kan kontrollere.
    function validerTurSkjema() {
        navnFelt.setCustomValidity("");
        stedFelt.setCustomValidity("");
        datoFelt.setCustomValidity("");
        beskrivelseFelt.setCustomValidity("");

        if (navnFelt.value.trim().length < 2) {
            navnFelt.setCustomValidity("Skriv inn navnet på turen.");
        }

        if (stedFelt.value.trim().length === 0) {
            stedFelt.setCustomValidity("Skriv inn hvor turen går.");
        }

        if (datoFelt.value < iDag) {
            datoFelt.setCustomValidity("Turen må planlegges i dag eller senere.");
        }

        if (vanskelighetFelt.value === "Krevende" && beskrivelseFelt.value.trim().length < 20) {
            beskrivelseFelt.setCustomValidity(
                "Krevende turer må ha en beskrivelse på minst 20 tegn."
            );
        }

        return turSkjema.checkValidity();
    }

    [navnFelt, stedFelt, datoFelt, vanskelighetFelt, beskrivelseFelt].forEach((felt) => {
        felt.addEventListener("input", validerTurSkjema);
        felt.addEventListener("change", validerTurSkjema);
    });

    turSkjema.addEventListener("submit", (event) => {
        if (!validerTurSkjema()) {
            event.preventDefault();
            turSkjema.reportValidity();
            return;
        }

        event.preventDefault();

        // FormData henter alle verdiene fra skjemaet samlet.
        const formData = new FormData(turSkjema);
        const nyTur = {
            navn: formData.get("turNavn").trim(),
            sted: formData.get("turSted").trim(),
            dato: formData.get("turDato"),
            vanskelighet: formData.get("turVanskelighet"),
            beskrivelse: formData.get("turBeskrivelse").trim()
        };

        lagreTurer([...hentTurer(), nyTur]);
        turSkjema.reset();
        document.querySelector("#tur-melding").textContent = "Turen er lagt til.";
        visTurer();
    });

    visTurer();
}

if (loggUt) {
    loggUt.addEventListener("click", () => {
        localStorage.removeItem("utsiktBruker");
    });
}