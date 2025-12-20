document.querySelectorAll("[data-count]").forEach(el => {
  const target = +el.dataset.count;
  let count = 0;
  const step = target / 80;

  const interval = setInterval(() => {
    count += step;
    el.textContent = Math.floor(count);
    if (count >= target) {
      el.textContent = target;
      clearInterval(interval);
    }
  }, 20);
});

const buttons = document.querySelectorAll(".filter button");
const partners = document.querySelectorAll(".partner");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    partners.forEach(partner => {
      partner.style.display =
        filter === "all" || partner.classList.contains(filter)
          ? "block"
          : "none";
    });
  });
});

// Stats
const jobStatsData = {
  devops: { insertion: 94, salary: 45, contract: "CDI" },
  data: { insertion: 90, salary: 47, contract: "CDI / Conseil" },
  software: { insertion: 96, salary: 42, contract: "CDI" },
  scrum: { insertion: 88, salary: 44, contract: "CDI / Freelance" },
  cloud: { insertion: 91, salary: 50, contract: "CDI senior" },
  consultant: { insertion: 89, salary: 43, contract: "CDI" },
  pm: { insertion: 87, salary: 44, contract: "CDI" },
  cyber: { insertion: 93, salary: 48, contract: "CDI / Défense" }
};

const jobButtons = document.querySelectorAll(".job-btn");
const statsWrapper = document.querySelector(".job-stats-wrapper");

function updateJobStats(jobKey) {
  const data = jobStatsData[jobKey];

  statsWrapper.innerHTML = `
    <div class="job-stat-card">
      <span data-count="${data.insertion}">0</span>
      <p>% d’insertion à 6 mois</p>
    </div>

    <div class="job-stat-card">
      <span data-count="${data.salary}">0</span>
      <p>K€ salaire moyen</p>
    </div>

    <div class="job-stat-card">
      <span>${data.contract}</span>
      <p>Type de contrat</p>
    </div>
  `;

  statsWrapper.querySelectorAll("[data-count]").forEach(el => {
    const target = +el.dataset.count;
    let count = 0;
    const step = target / 60;

    const interval = setInterval(() => {
      count += step;
      el.textContent = Math.floor(count);
      if (count >= target) {
        el.textContent = target;
        clearInterval(interval);
      }
    }, 20);
  });
}

updateJobStats("devops");

jobButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    jobButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    updateJobStats(btn.dataset.job);
  });
});
