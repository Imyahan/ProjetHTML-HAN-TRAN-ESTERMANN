let semaineActuelle = 0;   // INDEX dans data.semaines
let jourActuel = 0;
let modeActuel = "week";
let dataCache = null;

/* ------------------ CHARGEMENT ------------------ */

function chargerSemaine(index){
    fetch("../../data/cours.json")
        .then(r => r.json())
        .then(data => {

            // Charge toutes les semaines
            dataCache = data.semaines;

            // Sécurise l’index
            if (index < 0) index = 0;
            if (index >= dataCache.length) index = dataCache.length - 1;

            semaineActuelle = index;

            const semaineData = dataCache[semaineActuelle];

            // Affiche le titre : Semaine 39-40
            document.getElementById("edt-semaine-titre").textContent =
                "Semaine " + semaineData.num;

            // Affiche la vue
            if(modeActuel === "week"){
                genererEDT(semaineData);
            } else {
                genererJour(semaineData, jourActuel);
            }
        });
}

/* ------------------ OUTIL : calcul du créneau ------------------ */

function obtenirCreneau(heureDebut){
    const creneaux = ["08","10","12","14","16","18"];

    let [hStr] = heureDebut.split(":");
    let hour = parseInt(hStr, 10);

    if(hour % 2 !== 0){
        hour++; // arrondi vers 14h, 16h, 18h...
    }

    const hFormatee = hour.toString().padStart(2, "0");
    return creneaux.indexOf(hFormatee) + 1;
}

/* Synchronisation du scroll entre les dates et la grille */
function syncScroll() {
    const header = document.getElementById("edt-jours-header");
    const container = document.getElementById("edt-container");

    let isSyncing = false;

    header.addEventListener("scroll", () => {
        if (isSyncing) return;
        isSyncing = true;
        container.scrollLeft = header.scrollLeft;
        isSyncing = false;
    });

    container.addEventListener("scroll", () => {
        if (isSyncing) return;
        isSyncing = true;
        header.scrollLeft = container.scrollLeft;
        isSyncing = false;
    });
}

syncScroll();

/* ----------------- VUE SEMAINE ------------------ */

function genererEDT(semaineData) {

    document.body.classList.remove("mode-jour");

    const edtHeader = document.getElementById("edt-jours-header");
    const edtHeures = document.getElementById("edt-heures");
    const edtJours = document.getElementById("edt-jours");

    edtHeader.innerHTML = "<div></div>";
    edtHeures.innerHTML = "";
    edtJours.innerHTML = "";

    const creneaux = ["08","10","12","14","16","18"];

    // Header des jours
    semaineData.jours.forEach(j => {
        let div = document.createElement("div");
        div.classList.add("jour-header");
        div.textContent = j.date;
        edtHeader.appendChild(div);
    });

    // Heures
    creneaux.forEach(h => {
        let div = document.createElement("div");
        div.classList.add("heure");
        div.textContent = h + "h";
        edtHeures.appendChild(div);
    });

    // Cours
    semaineData.jours.forEach((jour, dayIndex) => {
        jour.cours.forEach(c => {

            const row = obtenirCreneau(c.heureDebut);

            const bloc = document.createElement("div");
            bloc.classList.add("cours");
            bloc.style.background = semaineData.jours[dayIndex].color;


            bloc.innerHTML = `
                <strong>${c.nom}</strong><br>
                ${c.prof}<br>
                Salle ${c.salle}<br>
                ${c.heureDebut} - ${c.heureFin}
            `;

            bloc.style.gridColumn = dayIndex + 2;
            bloc.style.gridRow = row;

            edtJours.appendChild(bloc);
        });
    });

    // grille 7 colonnes
    document.getElementById("edt-container").style.gridTemplateColumns =
        "50px repeat(7, 1fr)";

    edtHeader.style.display = "grid";
}

/* ------------------ VUE JOUR ------------------ */

function genererJour(semaineData, indexJour){

    document.body.classList.add("mode-jour");

    const edtHeader = document.getElementById("edt-jours-header");
    const edtHeures = document.getElementById("edt-heures");
    const edtJours = document.getElementById("edt-jours");

    edtHeader.innerHTML = "<div></div>";
    edtHeures.innerHTML = "";
    edtJours.innerHTML = "";

    const creneaux = ["08","10","12","14","16","18"];

    // Header du jour
    let h = document.createElement("div");
    h.classList.add("jour-header");
    h.textContent = semaineData.jours[indexJour].date;
    edtHeader.appendChild(h);

    // Heures
    creneaux.forEach(hh => {
        let div = document.createElement("div");
        div.classList.add("heure");
        div.textContent = hh + "h";
        edtHeures.appendChild(div);
    });

    // Cours du jour
    semaineData.jours[indexJour].cours.forEach(c => {

        const row = obtenirCreneau(c.heureDebut);

        const bloc = document.createElement("div");
        bloc.classList.add("cours");
        bloc.style.background = semaineData.jours[indexJour].color;

        bloc.innerHTML = `
            <strong>${c.nom}</strong><br>
            ${c.prof}<br>
            Salle ${c.salle}<br>
            ${c.heureDebut} - ${c.heureFin}
        `;

        bloc.style.gridColumn = 2;
        bloc.style.gridRow = row;

        edtJours.appendChild(bloc);
    });

    // grille 1 jour
    document.getElementById("edt-container").style.gridTemplateColumns =
        "50px 1fr";

    edtHeader.style.display = "flex";
    edtHeader.style.justifyContent = "center";
}

/* ------------ CHANGEMENT DE VUE ------------------ */

document.getElementById("view-select").addEventListener("change", (e) => {
    modeActuel = e.target.value;

    const semaineData = dataCache[semaineActuelle];

    if(modeActuel === "week"){
        genererEDT(semaineData);
    } else {
        genererJour(semaineData, jourActuel);
    }
});

/* ------------ FLÈCHES ------------------ */

document.getElementById("prev-week").addEventListener("click", () => {
    if(modeActuel === "week"){
        chargerSemaine(semaineActuelle - 1);
    } else {
        jourActuel--;
        if(jourActuel < 0){
            chargerSemaine(semaineActuelle - 1);
            jourActuel = dataCache[semaineActuelle].jours.length - 1;
        }
        genererJour(dataCache[semaineActuelle], jourActuel);
    }
});

document.getElementById("next-week").addEventListener("click", () => {
    if(modeActuel === "week"){
        chargerSemaine(semaineActuelle + 1);
    } else {
        jourActuel++;
        if(jourActuel >= dataCache[semaineActuelle].jours.length){
            chargerSemaine(semaineActuelle + 1);
            jourActuel = 0;
        }
        genererJour(dataCache[semaineActuelle], jourActuel);
    }
});

/* ---------------- START ---------------- */

chargerSemaine(semaineActuelle);
