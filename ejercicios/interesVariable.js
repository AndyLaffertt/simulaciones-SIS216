document.addEventListener("DOMContentLoaded", () => {
  const simulateBtn = document.getElementById("simulateBtn");
  const resultsBody = document.getElementById("resultsBody");
  const resumenTexto = document.getElementById("resumenTexto");

  simulateBtn.addEventListener("click", () => {
    // Leer y validar inputs
    const K = parseFloat(document.getElementById("K").value);
    const T = parseInt(document.getElementById("T").value);

    if (isNaN(K) || K <= 0 || isNaN(T) || T <= 0) {
      alert("Por favor, ingrese valores válidos y positivos.");
      return;
    }

    // Limpiar resultados anteriores
    resultsBody.innerHTML = "";
    resumenTexto.innerHTML = "";

    let capital = K;
    let tasa;

    // Tasa fija según capital inicial (una sola vez)
    if (capital >= 100 && capital <= 10000) {
      tasa = 0.035;
    } else if (capital > 10000 && capital <= 100000) {
      tasa = 0.037;
    } else {
      tasa = 0.04;
    }
    document.getElementById("tasaMostrada").textContent = 
  `Tasa aplicada: ${(tasa * 100).toFixed(2)}%`;

    let totalInteres = 0;

    for (let periodo = 1; periodo <= T; periodo++) {
      const interes = capital * tasa;
      const capitalFinal = capital + interes;

      // Agregar fila a la tabla
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${periodo}</td>
        <td>${capital.toFixed(2)}</td>
        <td>${interes.toFixed(2)}</td>
        <td>${capitalFinal.toFixed(2)}</td>
      `;
      resultsBody.appendChild(row);

      totalInteres += interes;
      capital = capitalFinal;
    }

    // Mostrar resumen
    resumenTexto.innerHTML = `
      <p>Con un capital inicial de <strong>Bs. ${K.toFixed(2)}</strong> y una tasa fija de <strong>${(tasa * 100).toFixed(2)}%</strong>, 
      después de <strong>${T}</strong> años el capital final es <strong>Bs. ${capital.toFixed(2)}</strong> y se generó un interés total de <strong>Bs. ${totalInteres.toFixed(2)}</strong>.</p>
    `;
  });
});
