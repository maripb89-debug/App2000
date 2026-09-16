let diagram;
let viserNedbor = true;

fetch("værdata.json")
    .then((svar) => svar.json())
    .then((vaer) => {
        const maaneder = vaer.data.map((rad) => rad.maaned);
        const nedbor = vaer.data.map((rad) => rad.nedbor);
        const temperatur = vaer.data.map((rad) => rad.temperatur);

        document.querySelector("#overskrift").textContent =
            `Værdata for ${vaer.sted}`;

        diagram = new Chart(document.querySelector("#vaerDiagram"), {
            type: "bar",
            data: {
                labels: maaneder,
                datasets: [
                    {
                        label: "Nedbør i millimeter",
                        data: nedbor,
                        backgroundColor: "steelblue"
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        document.querySelector("#byttKnapp").addEventListener("click", () => {
            if (viserNedbor) {
                diagram.data.datasets[0].label =
                    "Gjennomsnittstemperatur i °C";
                diagram.data.datasets[0].data = temperatur;
                diagram.data.datasets[0].backgroundColor = "orange";

                document.querySelector("#byttKnapp").textContent =
                    "Vis nedbør";
            } else {
                diagram.data.datasets[0].label =
                    "Nedbør i millimeter";
                diagram.data.datasets[0].data = nedbor;
                diagram.data.datasets[0].backgroundColor = "steelblue";

                document.querySelector("#byttKnapp").textContent =
                    "Vis temperatur";
            }

            viserNedbor = !viserNedbor;
            diagram.update();
        });
    })
    .catch(() => {
        document.querySelector("#overskrift").textContent =
            "Kunne ikke laste værdataene.";
    });