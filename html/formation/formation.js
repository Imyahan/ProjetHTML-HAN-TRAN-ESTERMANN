document.addEventListener("DOMContentLoaded", function () {
  var programmesData = [];
  var projetsData = [];
  var programmeActuel = "grandeEcole";
  var filiereActuelle = "Data Science";

  // Chargement JSON
  fetch("programme.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      programmesData = data;
      ProgrammeClick();
      updateProgramme(programmeActuel);
    })
    .catch(function (err) {
      console.error("Erreur programme.json :", err);
    });
  fetch("projets.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      projetsData = data;
      updateProgramme(programmeActuel);
    })
    .catch(function (err) {
      console.error("Erreur projets.json :", err);
    });

  // Changement Programme
  function ProgrammeClick() {
    var divs = document.querySelectorAll("#programmes > div");
    divs.forEach(function (div) {
      div.addEventListener("click", function () {
        var text = div.querySelector("h1").textContent.toLowerCase();
        if (text.includes("grande")) {
          if (programmeActuel === "grandeEcole") return;
          updateProgramme("grandeEcole");
        } else if (text.includes("technologie")) {
          if (programmeActuel === "technoNum") return;
          updateProgramme("technoNum");
        }
      });
    });
  }

  // Dropdown filière
  function FiliereDropdown() {
  var filiereWrapper = document.querySelector("#filières");
  if (!filiereWrapper) return;
  filiereWrapper.innerHTML = "";
  var programme = programmesData.find(function (p) {
    return p.programme === programmeActuel;
  });
  if (!programme) return;

  if (programmeActuel === "technoNum") {
    filiereWrapper.style.display = "none";
    return;
  } else {
    filiereWrapper.style.display = "block";
  }
  var parentLi = document.createElement("li");
  parentLi.classList.add("parent");
  parentLi.textContent = "Filière " + filiereActuelle + " ↓";
  var dropdownUl = document.createElement("ul");
  dropdownUl.classList.add("dropdown");
  programme.filières.forEach(function (f) {
    var nomFiliere = f["filière" + Object.keys(f)[0].slice(-1)];
    var li = document.createElement("li");
    li.textContent = "Filière " + nomFiliere;
    li.addEventListener("click", function (e) {
      filiereActuelle = nomFiliere;
      parentLi.textContent = "Filière " + filiereActuelle + " ↓";
      parentLi.appendChild(dropdownUl);
      afficherMajeures(programme.filières, filiereActuelle);
    });
    dropdownUl.appendChild(li);
  });
  parentLi.appendChild(dropdownUl);
  filiereWrapper.appendChild(parentLi);
}


  function updateProgramme(nomProgramme) {
    programmeActuel = nomProgramme;
    var programme = programmesData.find(function (p) {
      return p.programme === nomProgramme;
    });
    if (!programme) return;
    afficherDetails(programme.détailsProg);
    FiliereDropdown();
    if (programmeActuel === "grandeEcole") {
      filiereActuelle =
        programme.filières[0][
          "filière" + Object.keys(programme.filières[0])[0].slice(-1)
        ];
      afficherMajeures(programme.filières, filiereActuelle);
    } else {
      afficherMajeuresTechnoNum(programme.filières);
    }
    afficherProjets(projetsData, programmeActuel);
    updateCouleursProgramme();
  }

  // Détails du Programme
  function afficherDetails(detailsProg) {
    if (!detailsProg) return;
    document.getElementById("titreGauche").textContent =
    detailsProg[0].formation1;
    document.querySelectorAll(".descriptionGauche")[0].innerHTML = `
      <p>${detailsProg[0].descProg1}</p>
      <p class="objectifs">💡 Objectifs : ${detailsProg[0].objProg1}</p>
    `;
    document.getElementById("titreDroite").textContent =
    detailsProg[1].formation2;
    document.querySelectorAll(".descriptionGauche")[1].innerHTML = `
    <p>${detailsProg[1].descProg2}</p>
    <p class="objectifs">💡 Objectifs : ${detailsProg[1].objProg2}</p>
    `;
  }

  // Majeures Programme Grande École
  function afficherMajeures(filieres, filiereChoisie) {
    var container = document.querySelector(".body");
    if (!container) return;
    container.innerHTML = "";
    var filiere = filieres.find(function (f) {
      return (
        f["filière" + Object.keys(f)[0].slice(-1)] === filiereChoisie
      );
    });
      if (!filiere || !filiere.majeures) return;
      var link = filiere["link" + Object.keys(filiere)[0].slice(-1)];
      filiere.majeures.forEach(function (majeure, index) {
      var titre = majeure["majeure" + (index + 1)];
      var desc = majeure["descMajeure" + (index + 1)];
      var debouches = majeure["débouchés" + (index + 1)];
      if (!titre) return;
      var card = document.createElement("div");
      card.classList.add("card-majeure");
      card.innerHTML = `
      <div class="header">
        <div class="section">
          <h2>${titre}</h2>
        </div>
        <button href=${link}>></button>
      </div>
      <p class="descriptionMajeure">${desc}</p>
      `;
      if (debouches) {
        var pDebouches = document.createElement("p");
        pDebouches.classList.add("debouchesMajeure");
        pDebouches.innerHTML = "Débouchés possibles : " + debouches;
        card.appendChild(pDebouches);
      }
      var button = card.querySelector("button");
      if (button && link) {
        button.addEventListener("click", function() {
          window.open(link, "_blank");
      });
      }
      container.appendChild(card);
    });
  }

  // Majeures Technologie et Numérique
  function afficherMajeuresTechnoNum(majeures) {
    var container = document.querySelector(".body");
    if (!container) return;
    container.innerHTML = "";
    majeures.forEach(function (majeure, index) {
      var titre = majeure["majeure" + (index + 1)]
      var desc = majeure["descMajeure" + (index + 1)]
      var debouches = majeure["débouchés" + (index + 1)];
      var link = majeure["link" + (index + 1)];
      if (!titre) return;
      var card = document.createElement("div");
      card.classList.add("card-majeure");
      var descComplete = desc;
      card.innerHTML = `
      <div class="header">
        <div class="section">
          <h2>${titre}</h2>
        </div>
        <button>></button>
      </div>
      <p class="descriptionMajeure">${desc}</p>
    `;
    if (debouches) {
        var pDebouches = document.createElement("p");
        pDebouches.classList.add("debouchesMajeure");
        pDebouches.innerHTML = "Débouchés possibles : " + debouches;
        card.appendChild(pDebouches);
      }
      var button = card.querySelector("button");
      if (button && link) {
        button.addEventListener("click", function() {
          window.open(link, "_blank");
      });
      }
      container.appendChild(card);
    });
  }

  // Projets Étudiants
  function afficherProjets(data, programmeChoisi) {
  var projetsContainer = document.getElementById("projets");
  if (!projetsContainer) return;
  projetsContainer.innerHTML = "";
  var programme = data.find(p => p.programme === programmeChoisi);
  if (!programme || !programme.projets) return;
  programme.projets.forEach(projetsObj => {
    Object.values(projetsObj).forEach(projet => {
      if (!projet.titre || !projet.image || !projet.texte) return;
      var card = document.createElement("div");
      card.classList.add("card-projet");
      card.innerHTML = `
      <h3 style="color:black">${projet.titre}</h3>
      <img src="${projet.image}" alt="${projet.titre}" style="max-height:200px; width:auto; display:block; margin:0 auto;">
      <p>${projet.texte}</p>
      `;
      projetsContainer.appendChild(card);
    });
  });
  }

  function updateCouleursProgramme() {
    var cartesMajeures = document.querySelectorAll(".card-majeure");
    var projetsSection = document.getElementById("projetsEtudiants");
    var detailsEl = document.getElementById("détails");
    var titreMajeure= document.getElementById("titreMajeure");
    if (programmeActuel === "technoNum") {
      if(detailsEl) detailsEl.style.backgroundColor = "#38B6FF";
      cartesMajeures.forEach(card => card.style.backgroundColor = "#38B6FF");
      if(projetsSection) projetsSection.style.backgroundColor = "#38B6FF";
      titreMajeure.style.color="#38B6FF";
    } else {
      if(detailsEl) detailsEl.style.backgroundColor = "#163666";
      cartesMajeures.forEach(card => card.style.backgroundColor = "#163666");
      if(projetsSection) projetsSection.style.backgroundColor = "#163666";
      titreMajeure.style.color="#163666";
    }
  }
});