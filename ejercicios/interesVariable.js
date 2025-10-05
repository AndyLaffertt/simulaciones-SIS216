document.addEventListener("DOMContentLoaded", () => {
  const simulateBtn = document.getElementById("simulateBtn");
  const resultsBody = document.getElementById("resultsBody");
  const resumenTexto = document.getElementById("resumenTexto");
  const tasaMostrada = document.getElementById("tasaMostrada");

  simulateBtn.addEventListener("click", () => {
    // Leer inputs
    const K = parseFloat(document.getElementById("K").value);
    const T = parseInt(document.getElementById("T").value);

    const limite1 = parseFloat(document.getElementById("limite1").value);
    const limite2 = parseFloat(document.getElementById("limite2").value);

    const tasa1 = parseFloat(document.getElementById("tasa1").value);
    const tasa2 = parseFloat(document.getElementById("tasa2").value);
    const tasa3 = parseFloat(document.getElementById("tasa3").value);

    // Validaciones básicas
    if (
      isNaN(K) || K <= 0 ||
      isNaN(T) || T <= 0 ||
      isNaN(limite1) || limite1 <= 0 ||
      isNaN(limite2) || limite2 <= limite1 ||
      isNaN(tasa1) || tasa1 < 0 ||
      isNaN(tasa2) || tasa2 < 0 ||
      isNaN(tasa3) || tasa3 < 0
    ) {
      alert("Por favor, ingresa todos los valores correctamente.");
      return;
    }

    // Determinar la tasa a aplicar
    let tasa;
    if (K <= limite1) {
      tasa = tasa1;
    } else if (K <= limite2) {
      tasa = tasa2;
    } else {
      tasa = tasa3;
    }

    // Mostrar la tasa aplicada
    tasaMostrada.textContent = `Tasa aplicada: ${(tasa * 100).toFixed(2)}%`;

    // Limpiar resultados anteriores
    resultsBody.innerHTML = "";

    // Simulación
    let capital = K;
    for (let c = 1; c <= T; c++) {
      const capitalInicial = capital;
      const interes = capitalInicial * tasa;
      capital += interes;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${c}</td>
        <td>${capitalInicial.toFixed(2)}</td>
        <td>${interes.toFixed(2)}</td>
        <td>${capital.toFixed(2)}</td>
      `;
      resultsBody.appendChild(row);
    }

    resumenTexto.innerHTML = `
      <p>Con un capital inicial de <strong>Bs. ${K}</strong> y una duración de <strong>${T} años</strong>, aplicando una tasa del <strong>${(tasa * 100).toFixed(2)}%</strong>, el capital final es de <strong>Bs. ${capital.toFixed(2)}</strong>.</p>
    `;
  });
});
