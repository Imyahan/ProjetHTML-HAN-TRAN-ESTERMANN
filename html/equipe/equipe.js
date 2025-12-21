document.addEventListener("DOMContentLoaded", function () {
    var allDomaines = [];
    var allDedicaces = [];
    var currentDepartement = "intelligenceArtificielle";
    var filteredDedicaces = [];
    var index = 0;
    var autoScrollTimer = null;

    // Chargement JSON départements
    fetch("département.json")
        .then(function (res) { return res.json(); })
        .then(function (data) {
            allDomaines = data;
            updateDomaine(currentDepartement);
        })
        .catch(function (err) {
            console.error("Erreur départements.json :", err);
        });
    fetch("équipe.json")
        .then(function (res) { return res.json(); })
        .then(function (data) {
            allDedicaces = data;
            filterEquipe(currentDepartement);
            updateDedicace();
            startAutoScroll();
        })
        .catch(function (err) {
            console.error("Erreur équipe.json :", err);
        });

    // Domaine d'expertise & Projets
    function updateDomaine(departement) {
        currentDepartement = departement;
        var d = allDomaines.find(function (item) {
            return item.departement === departement;
        });
        if (!d) return;

        // Domaine
        var descriptionDiv = document.getElementById("descriptionDomaine");
        if (descriptionDiv) {
            var domaine = d.descriptionDomaine[0];
            var descGaucheElems = descriptionDiv.querySelectorAll(".descriptionGauche");
            var descDroiteElems = descriptionDiv.querySelectorAll(".descriptionDroite");
            descGaucheElems[0].textContent = domaine.descriptionGauche1;
            descGaucheElems[1].textContent = domaine.descriptionGauche2;
            descDroiteElems[0].textContent = domaine.descriptionDroite1;
            descDroiteElems[1].textContent = domaine.descriptionDroite2;
        }

        // Styles
        var fond = document.getElementById("logoDomaine");
        fond.style.backgroundImage = 'url("' + d.fond + '")';
        document.getElementById("titreQui").style.color = d.couleur;
        document.getElementById("titreDomaine").style.backgroundColor = d.couleur;
        document.getElementById("projetsDépartement").style.backgroundColor = d.couleur;

        // Projets
        var projetsContainer = document.getElementById("projets");
        var cards = projetsContainer.querySelectorAll(".card-projet");
        var projets = [];
        d.projets.forEach(function (groupe) {
            Object.values(groupe).forEach(function (projet) {
                projets.push(projet);
            });
        });
        cards.forEach(function (card, i) {
            if (projets[i]) {
                card.innerHTML =
                    '<h2 style="text-align:center;">' + projets[i].titre + '</h2>' +
                    '<img src="' + projets[i].image + '" alt="Projet ' + (i + 1) + '" style="max-height:200px; width:auto; display:block; margin:0 auto;">' +
                    '<p style="text-align:center;">' + projets[i].texte + '</p>';
                card.style.display = "block";
            }
        });
    }

    // Dédicaces
    function filterEquipe(departement) {
        currentDepartement = departement;
        filteredDedicaces = allDedicaces.filter(function (d) {
            return d.département === departement;
        });
        index = 0;
        highlightEquipe();
    }

    function updateDedicace() {
        var d = filteredDedicaces[index];
        document.getElementById("citation").textContent = '"' + d.citation + '"';
        document.getElementById("nom").textContent = d.nom;
        document.getElementById("role").textContent = d.role;
        document.getElementById("descriptionGauche").textContent = d.role_description;
        document.getElementById("descriptionDroite").textContent = d.mission;
        var imgDiv = document.getElementById("imageEquipe");
        var imagePath = "../../img/equipe/" + d.nom + ".jpg";
        var testImg = new Image();
        testImg.onload = function () {
            imgDiv.style.backgroundImage = 'url("' + imagePath + '")';
        };
        testImg.onerror = function () {
            imgDiv.style.backgroundImage = 'url("../../img/equipe/Meunier.jpg")';
        };
        testImg.src = imagePath;
        adjustCitationSize();
    }

    function adjustCitationSize() {
        var citation = document.getElementById("citation");
        var description = document.getElementById("légende");
        var fontSize = 20;
        citation.style.fontSize = fontSize + "px";
        var maxHeight = description.clientHeight;
        while (citation.scrollHeight > maxHeight && fontSize > 10) {
            fontSize--;
            citation.style.fontSize = fontSize + "px";
        }
    }

    function highlightEquipe() {
        document.querySelectorAll(".Nos_equipes .equipe").forEach(function (div) {
            var img = div.querySelector("img");
            var departement = img.alt;
            div.classList.toggle("selected", departement === currentDepartement);
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

    document.getElementById("prevButton").addEventListener("click", function () {
        prevDedicace();
        startAutoScroll();
    });

    document.getElementById("nextButton").addEventListener("click", function () {
        nextDedicace();
        startAutoScroll();
    });

    document.querySelectorAll(".Nos_equipes .equipe").forEach(function (div) {
        div.addEventListener("click", function () {
            var departement = div.querySelector("img").alt;
            updateDomaine(departement);
            filterEquipe(departement);
            updateDedicace();
            startAutoScroll();
        });
    });
});
