let allDomaines = [];
let currentDepartement = "intelligenceArtificielle";

document.addEventListener("DOMContentLoaded", () => {

    fetch("département.json")
        .then(res => res.json())
        .then(data => {
            allDomaines = data;
            updateDomaine(currentDepartement);
        })
        .catch(err => console.error("Erreur JSON domaine :", err));

    function updateDomaine(departement) {
        currentDepartement = departement;
        const d = allDomaines.find(item => item.departement === departement);
        if (!d) return;
        const descriptionDiv = document.getElementById("descriptionDomaine");
        if (descriptionDiv && d.descriptionDomaine.length > 0) {
            const domaine = d.descriptionDomaine[0];
            const descGaucheElems = descriptionDiv.querySelectorAll(".descriptionGauche");
            const descDroiteElems = descriptionDiv.querySelectorAll(".descriptionDroite");
            if (descGaucheElems.length >= 2) {
                descGaucheElems[0].textContent = domaine.descriptionGauche1;
                descGaucheElems[1].textContent = domaine.descriptionGauche2;
            }
            if (descDroiteElems.length >= 2) {
                descDroiteElems[0].textContent = domaine.descriptionDroite1;
                descDroiteElems[1].textContent = domaine.descriptionDroite2;
            }
        }

        const couleur = d.couleur;
        const imageFond = d.fond;
        const fond = document.getElementById("logoDomaine");
        fond.style.backgroundImage = `url("${imageFond}")`;
        const titreQui = document.getElementById("titreQui");
        titreQui.style.color = couleur;
        const titreDomaine=document.getElementById("titreDomaine");
        titreDomaine.style.backgroundColor = couleur;
        const projetsDiv = document.getElementById("projetsDépartement");
        projetsDiv.style.backgroundColor = couleur;
    }

    document.querySelectorAll(".Nos_equipes .equipe").forEach(equipeDiv => {
        equipeDiv.addEventListener("click", () => {
            const département = equipeDiv.querySelector("img").alt;
            updateDomaine(département);
        });
    });
});
