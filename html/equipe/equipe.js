document.addEventListener("DOMContentLoaded", () => {
    let allDomaines = [];
    let allDedicaces = [];
    let currentDepartement = "intelligenceArtificielle";
    let filteredDedicaces = [];
    let index = 0;
    let autoScrollTimer = null;

    // Chargement JSON départements
    fetch("département.json")
        .then(res => res.json())
        .then(data => {
            allDomaines = data;
            updateDomaine(currentDepartement);
        })
        .catch(err => console.error("Erreur JSON domaine :", err));

    // Chargement JSON équipe
    fetch("équipe.json")
        .then(res => res.json())
        .then(data => {
            allDedicaces = data;
            filterEquipe(currentDepartement);
            updateDedicace();
            startAutoScroll();
        })
        .catch(err => console.error("Erreur JSON équipe :", err));

    // Domaine d'expertise & Projets
    function updateDomaine(departement) {
        currentDepartement = departement;
        const d = allDomaines.find(item => item.departement === departement);
        if (!d) return;

        // Domaine
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

        // Styles
        const fond = document.getElementById("logoDomaine");
        fond.style.backgroundImage = `url("${d.fond}")`;
        document.getElementById("titreQui").style.color = d.couleur;
        document.getElementById("titreDomaine").style.backgroundColor = d.couleur;
        document.getElementById("projetsDépartement").style.backgroundColor = d.couleur;

        // Projets
        const projetsContainer = document.getElementById("projets");
        const cards = projetsContainer.querySelectorAll(".card-projet");
        cards.forEach(card => {
            card.innerHTML = "";
            card.style.display = "none";
        });

        const projets = [];
        d.projets.forEach(groupe => {
            Object.values(groupe).forEach(projet => projets.push(projet));
        });

        cards.forEach((card, index) => {
            if (projets[index]) {
                card.innerHTML = `
                    <h2 style="text-align:center;">${projets[index].titre}</h2>
                    <img src="${projets[index].image}" alt="Projet ${index + 1}" style="max-height:200px; width:auto; display:block; margin:0 auto;">
                    <p style="text-align:center;">${projets[index].texte}</p>
                `;
                card.style.display = "block";
            }
        });
    }

    // Dédicaces

    function filterEquipe(département) {
        currentDepartement = département;
        filteredDedicaces = allDedicaces.filter(d => d.département === département);
        index = 0;
        highlightEquipe();
    }

    function updateDedicace() {
        if (filteredDedicaces.length === 0) return;
        const d = filteredDedicaces[index];
        document.getElementById("citation").textContent = `"${d.citation}"`;
        document.getElementById("nom").textContent = d.nom;
        document.getElementById("role").textContent = d.role;
        document.getElementById("descriptionGauche").textContent = d.role_description;
        document.getElementById("descriptionDroite").textContent = d.mission;
        const imgDiv = document.getElementById("imageEquipe");
        const imagePath = `../../img/equipe/${d.nom}.jpg`;
        const testImg = new Image();
        testImg.onload = () => imgDiv.style.backgroundImage = `url("${imagePath}")`;
        testImg.onerror = () => imgDiv.style.backgroundImage = `url("../../img/equipe/Meunier.jpg")`;
        testImg.src = imagePath;
        adjustCitationSize();
    }

    function adjustCitationSize() {
        const citation = document.getElementById("citation");
        const description = document.getElementById("légende");
        let fontSize = 20; 
        citation.style.fontSize = fontSize + "px";
        const maxHeight = description.clientHeight;
        while (citation.scrollHeight > maxHeight && fontSize > 10) {
            fontSize--;
            citation.style.fontSize = fontSize + "px";
        }
    }
    
    function highlightEquipe() {
        document.querySelectorAll(".Nos_equipes .equipe").forEach(div => {
            const img = div.querySelector("img");
            const département = img.alt;
            div.classList.toggle("selected", département === currentDepartement);
        });
    }

    function startAutoScroll() {
        stopAutoScroll();
        autoScrollTimer = setInterval(nextDedicace, 5000);
    }

    function stopAutoScroll() {
        if (autoScrollTimer) clearInterval(autoScrollTimer);
    }

    function nextDedicace() {
        index = (index + 1) % filteredDedicaces.length;
        updateDedicace();
    }

    function prevDedicace() {
        index = (index - 1 + filteredDedicaces.length) % filteredDedicaces.length;
        updateDedicace();
    }

    document.getElementById("prevButton").addEventListener("click", () => {
        prevDedicace();
        startAutoScroll();
    });

    document.getElementById("nextButton").addEventListener("click", () => {
        nextDedicace();
        startAutoScroll();
    });

    document.querySelectorAll(".Nos_equipes .equipe").forEach(div => {
        div.addEventListener("click", () => {
            const departement = div.querySelector("img").alt;
            updateDomaine(departement);   
            filterEquipe(departement);
            updateDedicace();
            startAutoScroll();
        });
    });

});
