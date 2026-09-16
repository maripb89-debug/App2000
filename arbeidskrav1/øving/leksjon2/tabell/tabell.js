// Gjør én verdi klar for visning i en tabellcelle.
function visningsverdi(verdi) {
	// Manglende verdier vises som tom tekst.
	if (verdi === null || verdi === undefined) {
		return "";
	}

	// Objekter gjøres om til tekst; andre verdier gjøres også om til tekst.
	return typeof verdi === "object" ? JSON.stringify(verdi) : String(verdi);
}

// Lager en tabell fra data og tabellen som skal fylles.
function visTabell(tabell, data) {
	// Stopper hvis JSON-resultatet ikke er en liste eller er tomt.
	if (!Array.isArray(data) || data.length === 0) {
		return;
	}

	// Finner tabellens overskriftsdel og innholdsdel i HTML-en.
	const tabellhode = tabell.querySelector("thead");
	const tabellkropp = tabell.querySelector("tbody");

	// Samler alle feltnavn, også hvis radene har litt ulike felter.
	// flatMap henter feltene fra alle objektene, Set fjerner gjentakelser.
	const felter = [...new Set(data.flatMap((rad) => Object.keys(rad)))];

	// Lager én HTML-rad for kolonneoverskriftene.
	const overskriftsrad = document.createElement("tr");
	felter.forEach((felt) => {
		// Lager én overskriftscelle for hvert feltnavn.
		const overskrift = document.createElement("th");
		// Setter feltnavnet, for eksempel "VNr", som synlig tekst.
		overskrift.textContent = felt;
		// Legger overskriftscellen inn i overskriftsraden.
		overskriftsrad.append(overskrift);
	});
	// Legger overskriftsraden inn i tabellens thead.
	tabellhode.append(overskriftsrad);

	// Går gjennom hvert objekt i JSON-listen.
	data.forEach((radData) => {
		// Lager en ny tabellrad for det aktuelle objektet.
		const rad = document.createElement("tr");

		// Går gjennom alle kolonnene i samme rekkefølge som overskriftene.
		felter.forEach((felt) => {
			// Lager en tabellcelle for verdien i det aktuelle feltet.
			const celle = document.createElement("td");
			// Henter feltverdien og gjør den om til trygg visningstekst.
			celle.textContent = visningsverdi(radData[felt]);
			// Legger cellen inn i den aktuelle raden.
			rad.append(celle);
		});

		// Legger den ferdige raden inn i tabellens tbody.
		tabellkropp.append(rad);
	});
}

// Finner alle tabeller som har data-json, slik at flere tabeller kan brukes.
const tabeller = document.querySelectorAll("table[data-json]");


// Gjentar innlasting og visning for hver tabell på siden.
tabeller.forEach((tabell) => {
	// Leser hvilken JSON-fil akkurat denne tabellen skal bruke.
	const jsonFil = tabell.dataset.json;

	// Leser JSON-filen og fyller den aktuelle tabellen.
	fetch(jsonFil)
		// Mottar svaret fra serveren eller den lokale serveren.
		.then((svar) => svar.json())
		// Gjør svaret om fra JSON-format til JavaScript-data.
		.then((data) => visTabell(tabell, data))
		// Kjører hvis filen ikke finnes eller ikke kan leses.
		.catch(() => {
			// Finner riktig tbody for akkurat denne tabellen.
			const tabellkropp = tabell.querySelector("tbody");
			// Viser en feilmelding i tabellen.
			tabellkropp.innerHTML = "<tr><td>Kunne ikke laste JSON-dataene.</td></tr>";
		});
});
