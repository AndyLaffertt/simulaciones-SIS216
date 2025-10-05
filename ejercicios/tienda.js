document.addEventListener("DOMContentLoaded", () => {
  const simulateBtn = document.getElementById("simulate");
  const clearBtn = document.getElementById("clear");

  simulateBtn.addEventListener("click", (e) => {
    e.preventDefault();  // Evitar recarga
    runSimulation();
  });

  clearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearResults();
  });

  function simulateOnce(hours, costFixed, costArticle, priceArticle, probs) {
    let totalArticles = 0;
    const profitPerArticle = priceArticle - costArticle;

    for (let h = 0; h < hours; h++) {
      const arrivals = Math.floor(Math.random() * 5);
      for (let i = 0; i < arrivals; i++) {
        const r = Math.random();
        let articles = 0;
        if (r < probs[0]) articles = 0;
        else if (r < probs[0] + probs[1]) articles = 1;
        else if (r < probs[0] + probs[1] + probs[2]) articles = 2;
        else articles = 3;

        totalArticles += articles;
      }
    }

    const netGain = totalArticles * profitPerArticle - costFixed;
    return { netGain, totalArticles };
  }

  function runSimulation() {
    const simulations = parseInt(document.getElementById("inputSim").value); // ID corregido
    const hours = parseInt(document.getElementById("hours").value);
    const costFixed = parseFloat(document.getElementById("costFixed").value);
    const costArticle = parseFloat(document.getElementById("costArticle").value);
    const priceArticle = parseFloat(document.getElementById("priceArticle").value);
    const probs = [
      parseFloat(document.getElementById("p0").value),
      parseFloat(document.getElementById("p1").value),
      parseFloat(document.getElementById("p2").value),
      parseFloat(document.getElementById("p3").value)
    ];

    if ([simulations, hours, costFixed, costArticle, priceArticle, ...probs].some(x => isNaN(x))) {
      alert("⚠️ Todos los campos deben estar correctamente llenos.");
      return;
    }

    if (simulations <= 0 || hours <= 0 || costFixed < 0 || costArticle < 0 || priceArticle < 0) {
      alert("⚠️ Todos los valores deben ser positivos.");
      return;
    }

    const sumProbs = probs.reduce((a, b) => a + b, 0);
    if (Math.abs(sumProbs - 1) > 0.001) {
      alert("⚠️ Las probabilidades deben sumar 1.0");
      return;
    }

    const tbody = document.querySelector("#resultsTable tbody");
    tbody.innerHTML = "";

    let totalNet = 0;
    let totalArticles = 0;

    for (let i = 1; i <= simulations; i++) {
      const { netGain, totalArticles: sold } = simulateOnce(hours, costFixed, costArticle, priceArticle, probs);
      totalNet += netGain;
      totalArticles += sold;

      const row = `<tr>
        <td>${i}</td>
        <td>${netGain.toFixed(2)}</td>
        <td>${sold}</td>
      </tr>`;
      tbody.insertAdjacentHTML("beforeend", row);
    }

    const avgNet = (totalNet / simulations).toFixed(2);
    const avgArticles = (totalArticles / simulations).toFixed(2);

    const summary = document.getElementById("summary");
    summary.style.display = "block";
    summary.innerHTML = `
      <h2>Promedios Generales</h2>
      <p>Ganancia neta promedio: <strong>${avgNet} Bs</strong></p>
      <p>Artículos vendidos promedio: <strong>${avgArticles}</strong></p>
    `;
  }

  function clearResults() {
    document.getElementById("simulacion-form").reset();  // Limpiar form
    document.querySelector("#resultsTable tbody").innerHTML = "";
    document.getElementById("summary").style.display = "none";
  }
});
