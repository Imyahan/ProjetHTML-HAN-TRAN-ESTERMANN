fetch("../../data/cours.json")
    .then(r => r.json())
    .then(data => genererEDT(data));


function genererEDT(data) {

    const edtHeader = document.getElementById("edt-jours-header");
    const edtHeures = document.getElementById("edt-heures");
    const edtJours = document.getElementById("edt-jours");

    const creneaux = ["08", "10", "12", "14", "16", "18"];

    /* --- JOURS --- */
    edtHeader.innerHTML = "<div></div>"; // case vide
    data.jours.forEach(j => {
        let div = document.createElement("div");
        div.classList.add("jour-header");
        div.textContent = j.date;
        edtHeader.appendChild(div);
    });

    /* --- HEURES --- */
    creneaux.forEach(h => {
        let div = document.createElement("div");
        div.classList.add("heure");
        div.textContent = h + "h";
        edtHeures.appendChild(div);
    });

    /* --- COURS --- */
    data.jours.forEach((jour, dayIndex) => {

        jour.cours.forEach(c => {
            const startHour = c.heureDebut.split(":")[0];

            // Ligne correspondante
            const row = creneaux.indexOf(startHour) + 1;

            const bloc = document.createElement("div");
            bloc.classList.add("cours");

            bloc.innerHTML = `
                <strong>${c.nom}</strong><br>
                ${c.prof}<br>
                Salle ${c.salle}<br>
                ${c.heureDebut} - ${c.heureFin}
            `;

            bloc.style.gridColumn = dayIndex + 2; /* +2 car col1 = heures */
            bloc.style.gridRow = row;

            edtJours.appendChild(bloc);
        });
    });
}

let semaineActuelle = 40;
let dataCache = null;

function chargerSemaine(num){
    fetch("../../data/cours.json")
        .then(r => r.json())
        .then(data => {
            dataCache = data;
            document.getElementById("edt-semaine-titre").textContent =
                "Semaine " + data.semaine;

            genererEDT(data);
        });
}

chargerSemaine(semaineActuelle);
document.getElementById("prev-week").addEventListener("click", () => {
    semaineActuelle--;
    chargerSemaine(semaineActuelle);
});

document.getElementById("next-week").addEventListener("click", () => {
    semaineActuelle++;
    chargerSemaine(semaineActuelle);
});

document.getElementById("view-select").addEventListener("change", (e) => {
    const mode = e.target.value;

    if(mode === "week"){
        document.getElementById("edt-jours-header").style.display = "grid";
        document.getElementById("edt-container").style.gridTemplateColumns = "50px repeat(7, 1fr)";
    } else {
        document.getElementById("edt-jours-header").style.display = "none";
        document.getElementById("edt-container").style.gridTemplateColumns = "50px 1fr";
    }

    genererEDT(dataCache);
});


