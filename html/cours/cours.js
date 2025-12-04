let semaineActuelle = 40;
let jourActuel = 0;
let modeActuel = "week";
let dataCache = null;

/* ------------------ CHARGEMENT ------------------ */

function chargerSemaine(num){
    fetch("../../data/cours.json")
        .then(r => r.json())
        .then(data => {
            dataCache = data;

            document.getElementById("edt-semaine-titre").textContent =
                "Semaine " + data.semaine;

            if(modeActuel === "week"){
                genererEDT(data);
            } else {
                genererJour(data, jourActuel);
            }
        });
}

/* ------------------ OUTIL : calcul du créneau ------------------ */

function obtenirCreneau(heureDebut){
    const creneaux = ["08","10","12","14","16","18"];

    const [hStr, mStr] = heureDebut.split(":");
    let hour = parseInt(hStr, 10);

    // arrondi vers l'heure paire supérieure : 13→14, 17→18
    if(hour % 2 !== 0){
        hour++;
    }

    const hFormatee = hour.toString().padStart(2, "0");
    return creneaux.indexOf(hFormatee) + 1;
}

/* ----------------- VUE SEMAINE ------------------ */

function genererEDT(data) {

    document.body.classList.remove("mode-jour");

    const edtHeader = document.getElementById("edt-jours-header");
    const edtHeures = document.getElementById("edt-heures");
    const edtJours = document.getElementById("edt-jours");

    edtHeader.innerHTML = "<div></div>";
    edtHeures.innerHTML = "";
    edtJours.innerHTML = "";

    const creneaux = ["08","10","12","14","16","18"];

    // Header des jours
    data.jours.forEach(j => {
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
    data.jours.forEach((jour, dayIndex) => {
        jour.cours.forEach(c => {

            const row = obtenirCreneau(c.heureDebut);

            const bloc = document.createElement("div");
            bloc.classList.add("cours");

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

    document.getElementById("edt-container").style.gridTemplateColumns =
        "50px repeat(7, 1fr)";

    edtHeader.style.display = "grid";
}

/* ------------------ VUE JOUR ------------------ */

function genererJour(data, indexJour){

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
    h.textContent = data.jours[indexJour].date;
    edtHeader.appendChild(h);

    // Heures
    creneaux.forEach(hh => {
        let div = document.createElement("div");
        div.classList.add("heure");
        div.textContent = hh + "h";
        edtHeures.appendChild(div);
    });

    // Cours
    data.jours[indexJour].cours.forEach(c => {

        const row = obtenirCreneau(c.heureDebut);

        const bloc = document.createElement("div");
        bloc.classList.add("cours");

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

    document.getElementById("edt-container").style.gridTemplateColumns =
        "50px 1fr";

    edtHeader.style.display = "flex";
    edtHeader.style.justifyContent = "center";
}

/* ------------ CHANGEMENT DE VUE ------------------ */

document.getElementById("view-select").addEventListener("change", (e) => {
    modeActuel = e.target.value;

    if(modeActuel === "week"){
        genererEDT(dataCache);
    } else {
        genererJour(dataCache, jourActuel);
    }
});

/* ------------ FLÈCHES ------------------ */

document.getElementById("prev-week").addEventListener("click", () => {
    if(modeActuel === "week"){
        semaineActuelle--;
        chargerSemaine(semaineActuelle);
    } else {
        jourActuel--;
        if(jourActuel < 0){
            semaineActuelle--;
            jourActuel = dataCache.jours.length - 1;
            chargerSemaine(semaineActuelle);
        } else {
            genererJour(dataCache, jourActuel);
        }
    }
});

document.getElementById("next-week").addEventListener("click", () => {
    if(modeActuel === "week"){
        semaineActuelle++;
        chargerSemaine(semaineActuelle);
    } else {
        jourActuel++;
        if(jourActuel >= dataCache.jours.length){
            semaineActuelle++;
            jourActuel = 0;
            chargerSemaine(semaineActuelle);
        } else {
            genererJour(dataCache, jourActuel);
        }
    }
});

/* ---------------- START ---------------- */

chargerSemaine(semaineActuelle);
