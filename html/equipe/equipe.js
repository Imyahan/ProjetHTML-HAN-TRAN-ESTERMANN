let allDedicaces = [];
let filteredDedicaces = [];
let currentEquipe = "intelligenceArtificielle";
let index = 0;
let autoScrollTimer = null;

document.addEventListener("DOMContentLoaded", () => {
    
    fetch("équipe.json")
        .then(res => res.json())
        .then(data => {
            allDedicaces = data;
            filterEquipe(currentEquipe);
            updateDedicace();
            startAutoScroll();
        })
        .catch(err => console.error("Erreur JSON :", err));
    
    function filterEquipe(equipe) {
        currentEquipe = equipe;
        filteredDedicaces = allDedicaces.filter(d => d.equipe === equipe);
        highlightEquipe();
    }

    function updateDedicace() {
        if (filteredDedicaces.length === 0) return;
        const d = filteredDedicaces[index];
        document.getElementById("citation").textContent = `"${d.citation}"`;
        document.getElementById("nom").textContent = d.nom;
        document.getElementById("role").textContent = d.role;

        const descGauche = document.getElementById("descriptionGauche");
        const descDroite = document.getElementById("descriptionDroite");
        descGauche.textContent = d.role_description || "";
        descDroite.textContent = d.mission || "";

        const imgDiv = document.getElementById("imageEquipe");
        const imagePath = `../../img/equipe/${d.nom}.jpg`;
        const testImg = new Image();
        testImg.onload = () => {
            imgDiv.style.backgroundImage = `url("${imagePath}")`;
        };
        testImg.onerror = () => {
            imgDiv.style.backgroundImage = `url("../../img/equipe/Meunier.jpg")`;
        };
        testImg.src = imagePath;
        DescriptionSize();
    }

    function DescriptionSize() {
        const citation = document.getElementById("citation");
        const description = document.getElementById("légende");
        let fontSize = 20; 
        citation.style.fontSize = fontSize + "px";
        const maxHeight = description.clientHeight 
        while (citation.scrollHeight > maxHeight && fontSize > 10) {
            fontSize--;
            citation.style.fontSize = fontSize + "px";
        }  
    }

    function highlightEquipe() {
        document.querySelectorAll(".Nos_equipes .equipe").forEach(div => {
            const img = div.querySelector("img");
            const département= img.alt;
            if (département === currentEquipe) {
                div.classList.add("selected");
            } else {
                div.classList.remove("selected"); 
            }
        });
    }

    function nextDedicace() {
        index = (index + 1) % filteredDedicaces.length;
        updateDedicace();
    }

    function prevDedicace() {
        index = (index - 1 + filteredDedicaces.length) % filteredDedicaces.length;
        updateDedicace();
    }

    function startAutoScroll() {
        stopAutoScroll();
        autoScrollTimer = setInterval(nextDedicace, 5000);
    }

    function stopAutoScroll() {
        if (autoScrollTimer) clearInterval(autoScrollTimer);
    }

    document.getElementById("prevButton").addEventListener("click", () => {
        prevDedicace();
        startAutoScroll();
    });

    document.getElementById("nextButton").addEventListener("click", () => {
        nextDedicace();
        startAutoScroll();
    });

    document.querySelectorAll(".Nos_equipes .equipe").forEach(equipeDiv => {
        equipeDiv.addEventListener("click", () => {
            const département = equipeDiv.querySelector("img").alt;
            filterEquipe(département);
            updateDedicace(); 
            startAutoScroll();
        });
    });

    highlightEquipe();
});