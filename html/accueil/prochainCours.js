fetch("../../data/cours.json")
    .then(r => r.json())
    .then(data => afficherProchainsCours(data))
    .catch(err => console.error("Erreur JSON :", err));

function afficherProchainsCours(data) {

    if (!data || !data.semaines || data.semaines.length === 0) {
        console.error("JSON mal formé :", data);
        return;
    }

    const semaine = data.semaines[0];

    if (!semaine.jours) {
        console.error("Les jours sont absents dans la semaine :", semaine);
        return;
    }

    const jours = semaine.jours;
    const container = document.getElementById("prochainCours");

    function parseDate(frDate) {
        const months = {
            "janvier": 0, "février": 1, "mars": 2, "avril": 3,
            "mai": 4, "juin": 5, "juillet": 6, "août": 7,
            "septembre": 8, "octobre": 9, "novembre": 10, "décembre": 11
        };
        const [day, month] = frDate.split(" ");
        return new Date(2025, months[month], parseInt(day));
    }

    jours.sort((a, b) => parseDate(a.date) - parseDate(b.date));

    container.innerHTML = "";

    jours.forEach(jour => {

        const bloc = document.createElement("div");
        bloc.classList.add("jourBloc");

        let html = `
            <h3>${jour.date}</h3>
            <hr>
        `;

       jour.cours.forEach(c => {
        html += `
            <div class="coursItem">
    
                <div><span class="label">Cours :</span> 
                     <span class="value">${c.nom}</span></div>
    
                <div><span class="label">Salle :</span> 
                     <span class="value salle">${c.salle}</span></div>
    
                <div><span class="label">Groupe :</span> 
                     <span class="value groupe">${c.groupe ?? "N/A"}</span></div>
    
                <div><span class="label">Prof :</span> 
                     <span class="value prof">${c.prof}</span></div>
    
                <div class="heureMini">${c.heureDebut} - ${c.heureFin}</div>
    
            </div>
            <hr>
        `;
       });


        bloc.innerHTML = html;
        container.appendChild(bloc);
    });
}
