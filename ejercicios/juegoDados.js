(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);

  // Elementos del DOM
  const resultsBody = $('#resultsBody');
  const avgGNC = $('#avgGNC');
  const avgNJGC = $('#avgNJGC');
  const avgPJC = $('#avgPJC');

  const inputNumSim = $('#numSim');
  const inputNMJ = $('#nmj');
  const inputPUJ = $('#puj');
  const inputCUS7 = $('#cus7');
  const simulateBtn = $('#simulateBtn');
  const clearBtn = $('#clearBtn');

  // Simula un dado de 6 caras
  function lanzarDado() {
    return 1 + Math.floor(Math.random() * 6);
  }

  // Formatea con decimales
  function formatear(num, dec = 2) {
    return Number(num).toFixed(dec);
  }

  // Limpia los resultados anteriores
  function limpiarResultados() {
    resultsBody.innerHTML = '<tr><td colspan="4">Sin datos aún</td></tr>';
    avgGNC.textContent = '—';
    avgNJGC.textContent = '—';
    avgPJC.textContent = '—';
    const resumen = document.getElementById('resumenTexto');
    if (resumen) resumen.innerHTML = '';
  }

  // Valida los inputs del usuario
  function validarInputs(simulaciones, juegos, precio, premio) {
    if (
      simulaciones <= 0 || juegos <= 0 ||
      precio <= 0 || premio <= 0 ||
      isNaN(simulaciones) || isNaN(juegos) ||
      isNaN(precio) || isNaN(premio)
    ) {
      alert("Todos los valores deben ser números positivos mayores que cero.");
      return false;
    }

    if (!Number.isInteger(simulaciones) || !Number.isInteger(juegos)) {
      alert("El número de simulaciones y juegos debe ser un número entero.");
      return false;
    }

    return true;
  }

  // Simula una corrida individual
  function simularUnaCorrida(NMJ, PUJ, CUS7) {
    let CJ = 0, NJGC = 0, GNC = 0;

    while (CJ < NMJ) {
      CJ++;
      const D1 = lanzarDado();
      const D2 = lanzarDado();
      const suma = D1 + D2;

      GNC += PUJ; // La casa cobra siempre
      if (suma === 7) {
        GNC -= CUS7; // La casa paga si sale 7
      } else {
        NJGC++;
      }
    }

    const PJC = (NJGC / NMJ) * 100;
    return { GNC, NJGC, PJC };
  }

  // Simulación principal
  function simular() {
    const numSim = parseInt(inputNumSim.value, 10);
    const NMJ = parseInt(inputNMJ.value, 10);
    const PUJ = parseFloat(inputPUJ.value);
    const CUS7 = parseFloat(inputCUS7.value);

    if (!validarInputs(numSim, NMJ, PUJ, CUS7)) return;

    limpiarResultados();

    let sumGNC = 0, sumNJGC = 0, sumPJC = 0;
    resultsBody.innerHTML = ''; // Vacía tabla

    for (let i = 1; i <= numSim; i++) {
      const { GNC, NJGC, PJC } = simularUnaCorrida(NMJ, PUJ, CUS7);
      sumGNC += GNC;
      sumNJGC += NJGC;
      sumPJC += PJC;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${i}</td>
        <td>${formatear(GNC)}</td>
        <td>${NJGC}</td>
        <td>${formatear(PJC)}%</td>
      `;
      resultsBody.appendChild(row);
    }

    // Mostrar promedios
    const promedioGNC = sumGNC / numSim;
    const promedioNJGC = sumNJGC / numSim;
    const promedioPJC = sumPJC / numSim;

    avgGNC.textContent = formatear(promedioGNC);
    avgNJGC.textContent = formatear(promedioNJGC);
    avgPJC.textContent = formatear(promedioPJC);

    // Mostrar resumen textual
    const resumen = `
    <b>Resumen de resultados:</b><br>
    Se realizaron <b>${numSim}</b> simulaciones, cada una con <b>${NMJ}</b> juegos.<br>
    La <b>ganancia neta promedio</b> de la casa fue de <b>${formatear(promedioGNC)} Bs.</b><br>
    En promedio, la casa ganó <b>${formatear(promedioNJGC)}</b> juegos por simulación.<br>
    Esto representa un <b>${formatear(promedioPJC)}%</b> de juegos ganados por la casa.
    `;

    document.getElementById('resumenTexto').innerHTML = resumen;

  }

  // Eventos
  simulateBtn?.addEventListener('click', simular);
  clearBtn?.addEventListener('click', limpiarResultados);
})();
