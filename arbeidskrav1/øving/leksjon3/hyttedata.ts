interface Beliggenhet {
	område: string;
	type: string;
}

interface Hytte {
	id: number;
	navn: string;
	sted: string;
	beliggenhet: Beliggenhet;
	sengeplasser: number;
	prisPerNatt: number;
	fasiliteter: string[];
}

const hytteListe = document.querySelector<HTMLElement>("#hytteListe");

/**
 * Viser hyttene på nettsiden.
 * @param hytter Et array med hytteobjekter.
 * @returns {void} Funksjonen returnerer ingen verdi.
 */
function visHytter(hytter: Hytte[]): void {
	if (!hytteListe) {
		return;
	}

	hytteListe.replaceChildren();

	hytter.forEach((hytte: Hytte): void => {
		const hyttekort = document.createElement("article");
		const tittel = document.createElement("h2");
		const sted = document.createElement("p");
		const detaljer = document.createElement("p");
		const fasiliteterTittel = document.createElement("h3");
		const fasiliteter = document.createElement("ul");

		tittel.textContent = hytte.navn;
		sted.textContent = `${hytte.sted} - ${hytte.beliggenhet.område}`;
		detaljer.textContent = `${hytte.sengeplasser} sengeplasser | ${hytte.prisPerNatt} kr per natt | ${hytte.beliggenhet.type}`;
		fasiliteterTittel.textContent = "Fasiliteter";

		hytte.fasiliteter.forEach((fasilitet: string): void => {
			const listepunkt = document.createElement("li");
			listepunkt.textContent = fasilitet;
			fasiliteter.append(listepunkt);
		});

		hyttekort.append(tittel, sted, detaljer, fasiliteterTittel, fasiliteter);
		hytteListe.append(hyttekort);
	});
}

fetch("hyttedata.json")
	.then((respons: Response): Promise<Hytte[]> => {
		if (!respons.ok) {
			throw new Error("Kunne ikke hente hyttedata.");
		}
		return respons.json() as Promise<Hytte[]>;
	})
	.then((hytter: Hytte[]): void => visHytter(hytter))
	.catch((feil: Error): void => {
		if (hytteListe) {
			hytteListe.textContent = feil.message;
		}
	});
