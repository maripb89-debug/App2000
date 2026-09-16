// const lager en variabel som ikke skal få en ny verdi.
// querySelector finner HTML-elementet med id-en "hytteListe".
const hytteListe = document.querySelector("#hytteListe");

/**
 * Viser alle hyttene i HTML-dokumentet.
 * @param {Array<Object>} hytter Parameteren er verdien funksjonen mottar.
 * Array<Object> betyr et array som inneholder objekter.
 */
function visHytter(hytter) {
	// Fjerner meldingen "Laster inn hyttedata ..." før nye elementer legges til.
	hytteListe.replaceChildren();

	// forEach går gjennom hvert element i arrayet.
	// hytte er en parameter i callback-funksjonen og inneholder én hytte om gangen.
	hytter.forEach((hytte) => {
		// Lager HTML-elementene som skal inneholde informasjon om hytta.
		const hyttekort = document.createElement("article");
		const tittel = document.createElement("h2");
		const sted = document.createElement("p");
		const detaljer = document.createElement("p");
		const fasiliteterTittel = document.createElement("h3");
		const fasiliteter = document.createElement("ul");

		// textContent legger inn tekst i HTML-elementet.
		tittel.textContent = hytte.navn;
		// Template literals (`...`) gjør det mulig å sette variabler inn i tekst.
		sted.textContent = `${hytte.sted} - ${hytte.beliggenhet.område}`;
		detaljer.textContent = `${hytte.sengeplasser} sengeplasser | ${hytte.prisPerNatt} kr per natt | ${hytte.beliggenhet.type}`;
		fasiliteterTittel.textContent = "Fasiliteter";

		// Dette er en ny forEach-løkke som går gjennom fasilitets-arrayet.
		// fasilitet er parameteren som inneholder én verdi om gangen.
		hytte.fasiliteter.forEach((fasilitet) => {
			const listepunkt = document.createElement("li");
			listepunkt.textContent = fasilitet;
			// Legger listepunktet inn i ul-elementet.
			fasiliteter.append(listepunkt);
		});

		// Setter sammen hyttekortet og legger det inn på siden.
		hyttekort.append(tittel, sted, detaljer, fasiliteterTittel, fasiliteter);
		hytteListe.append(hyttekort);
	});
}

// fetch() henter JSON-filen fra samme mappe og returnerer et Promise.
// Et Promise representerer et resultat som blir klart senere.
fetch("hyttedata.json")
	.then((respons) => {
		// .then() kjører når Promise-et er ferdig. respons er svaret fra serveren.
		// Kontrollerer at serveren svarte uten en HTTP-feil.
		if (!respons.ok) {
			// throw avbryter kjøringen og sender feilen videre til catch().
			throw new Error("Kunne ikke hente hyttedata.");
		}
		// Gjør svaret om fra JSON-tekst til JavaScript-objekter og arrays.
		return respons.json();
	})
	// Viser hyttene når JSON-dataene er ferdig lest.
	.then((hytter) => visHytter(hytter))
	// Viser en feilmelding dersom innlasting eller behandling mislykkes.
	// catch() fanger opp feil fra fetch() eller fra en av then()-metodene.
	.catch((feil) => {
		hytteListe.textContent = feil.message;
	});
