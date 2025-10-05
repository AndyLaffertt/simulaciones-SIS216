document.addEventListener("DOMContentLoaded", () => {
  const simulateBtn = document.getElementById("simulateBtn");
  const resultsBody = document.getElementById("resultsBody");
  const resumenTexto = document.getElementById("resumenTexto");

  simulateBtn.addEventListener("click", () => {
    // Leer inputs
    const K = parseFloat(document.getElementById("K").value);
    const T = parseInt(document.getElementById("T").value);
    const i = parseFloat(document.getElementById("i").value);

    // Validar inputs
    if (
      isNaN(K) || K <= 0 ||
      isNaN(T) || T <= 0 ||
      isNaN(i) || i < 0
    ) {
      alert("Por favor, ingrese valores válidos y positivos.");
      return;
    }

    // Limpiar resultados anteriores
    resultsBody.innerHTML = "";
    resumenTexto.innerHTML = "";

    let capitalInicial = K;
    let interesPorPeriodo = capitalInicial * i;
    let totalInteres = 0;

    for (let periodo = 1; periodo <= T; periodo++) {
      const interes = capitalInicial * i;
      const capitalFinal = capitalInicial + interes;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${periodo}</td>
        <td>${capitalInicial.toFixed(2)}</td>
        <td>${interes.toFixed(2)}</td>
        <td>${capitalFinal.toFixed(2)}</td>
      `;
      resultsBody.appendChild(row);

      totalInteres += interes;
      capitalInicial = capitalFinal; // para el siguiente período
    }

    resumenTexto.innerHTML = 
    `<b>Resumen de resultados:</b><br>
      <p>Luego de <strong>${T}</strong> años con un capital inicial de <strong>Bs. ${K}</strong>, una tasa de interés de <strong>${i}</strong>, el capital final es <strong>Bs. ${capitalInicial.toFixed(2)}</strong> y el interés total acumulado es <strong>Bs. ${totalInteres.toFixed(2)}</strong>.</p>
    `;
  });
});
