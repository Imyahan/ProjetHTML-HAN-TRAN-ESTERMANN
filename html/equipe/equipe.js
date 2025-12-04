let allDedicaces = [];
let filteredDedicaces = [];
let index = 0;
let currentEquipe = "relationEntreprise";
let autoScrollTimer = null;

document.addEventListener("DOMContentLoaded", () => {
    
    fetch("equipe.json")
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
        index = 0; 
        highlightEquipe();
    }

    function updateDedicace() {
        if (filteredDedicaces.length === 0) return;
        const d = filteredDedicaces[index];
        document.getElementById("citation").textContent = `"${d.citation}"`;
        document.getElementById("nom").textContent = d.nom;
        document.getElementById("role").textContent = d.role;
        
        document.getElementById("descriptionPrincipal").textContent = d.profil;
        document.getElementById("descriptionDiplomes").textContent = d.diplomes;
        document.getElementById("descriptionCours").textContent = d.coursProjets;

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
        const description = document.querySelector(".description");
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
            const equipeId = img.alt;
            if (equipeId === currentEquipe) {
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
            const equipeId = equipeDiv.querySelector("img").alt;
            filterEquipe(equipeId);
            updateDedicace(); 
            startAutoScroll();
        });
    });

    highlightEquipe();
});