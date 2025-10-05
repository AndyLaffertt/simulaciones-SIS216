// Funciones auxiliares
function randUniformInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randExponential(mean) {
  const u = Math.random();
  return -mean * Math.log(1 - u);
}

function format(num, dec = 2) {
  return num.toLocaleString("es-VE", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec
  });
}

// Validación de parámetros
function validarParametros(v) {
  const errores = [];

  const isPosInt = (n) => Number.isInteger(n) && n > 0;
  const isPosNum = (n) => typeof n === "number" && n > 0;

  if (!isPosInt(v.sim)) errores.push("Nº simulaciones debe ser entero positivo");
  if (!isPosInt(v.days)) errores.push("Días a simular debe ser entero positivo");
  if (!isPosInt(v.review)) errores.push("Días de revisión debe ser entero positivo");
  if (!isPosInt(v.uMin)) errores.push("Uniforme mínimo debe ser entero positivo");
  if (!isPosInt(v.uMax)) errores.push("Uniforme máximo debe ser entero positivo");

  if (!isPosNum(v.cap)) errores.push("Capacidad debe ser número positivo");
  if (v.cOrder < 0) errores.push("Costo ordenar debe ser ≥ 0");
  if (!isPosNum(v.cInv)) errores.push("Costo inventario debe ser positivo");
  if (!isPosNum(v.cAcq)) errores.push("Costo adquisición debe ser positivo");
  if (!isPosNum(v.pSale)) errores.push("Precio venta debe ser positivo");
  if (!isPosNum(v.lambda)) errores.push("Media exponencial debe ser > 0");

  if (v.uMin > v.uMax) errores.push("Mínimo uniforme no puede ser mayor al máximo");
  if (v.uMax > v.days) errores.push("Máximo uniforme no puede superar los días simulados");

  return errores;
}

// Simulación individual
function simularUnaVez(v) {
  let CD = 0, TENT = 0, PAZU = 0;
  let IAZU = v.cap;
  let CTADQ = v.cap * v.cAcq;
  let CORDT = v.cOrder;
  let CTIN = 0, DIT = 0, IBRU = 0;

  while (CD < v.days) {
    CD++;

    if (TENT === 0) {
      if (CD % v.review === 0) {
        PAZU = v.cap - IAZU;
        CORDT += v.cOrder;
        CTADQ += PAZU * v.cAcq;
        TENT = randUniformInt(v.uMin, v.uMax);
      }
    } else {
      TENT--;
      if (TENT === 0) {
        IAZU += PAZU;
      }
    }

    const DAZU = Math.round(randExponential(v.lambda));
    if (DAZU > IAZU) {
      DIT += DAZU - IAZU;
      IBRU += IAZU * v.pSale;
      IAZU = 0;
    } else {
      IBRU += DAZU * v.pSale;
      IAZU -= DAZU;
      CTIN += IAZU * v.cInv;
    }
  }

  const CTOT = CTADQ + CTIN + CORDT;
  const GNETA = IBRU - CTOT;

  return {
    CTOT, GNETA, DIT, CTADQ, CTIN, CORDT
  };
}

// Ejecutar múltiples simulaciones
function ejecutarSimulaciones() {
  const v = {
    sim: +document.getElementById("inputSim").value,
    days: +document.getElementById("inputDays").value,
    cap: +document.getElementById("inputCap").value,
    cOrder: +document.getElementById("inputCord").value,
    cInv: +document.getElementById("inputCui").value,
    cAcq: +document.getElementById("inputCua").value,
    pSale: +document.getElementById("inputPuv").value,
    lambda: +document.getElementById("inputLambda").value,
    review: +document.getElementById("inputReview").value,
    uMin: +document.getElementById("inputUniformMin").value,
    uMax: +document.getElementById("inputUniformMax").value
  };

  const errores = validarParametros(v);
  const errDiv = document.getElementById("errorMsg");

  if (errores.length) {
    errDiv.style.display = "block";
    errDiv.textContent = errores.join(". ");
    return;
  } else {
    errDiv.style.display = "none";
  }

  const tbody = document.querySelector("#resultsTable tbody");
  tbody.innerHTML = "";

  let gCTOT = 0, gGNETA = 0, gDIT = 0;

  for (let i = 1; i <= v.sim; i++) {
    const r = simularUnaVez(v);
    gCTOT += r.CTOT;
    gGNETA += r.GNETA;
    gDIT += r.DIT;

    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${i}</td>
        <td>${format(r.CTOT)}</td>
        <td>${format(r.GNETA)}</td>
        <td>${format(r.DIT)}</td>
        <td>${format(r.CTADQ)}</td>
        <td>${format(r.CTIN)}</td>
        <td>${format(r.CORDT)}</td>
      </tr>
    `);
  }

  document.getElementById("globalSummary").style.display = "block";
  document.getElementById("avgCTOT").textContent = `Costo total promedio: ${format(gCTOT / v.sim)} Bs`;
  document.getElementById("avgGNETA").textContent = `Ganancia neta promedio: ${format(gGNETA / v.sim)} Bs`;
  document.getElementById("avgDIT").textContent = `Demanda insatisfecha promedio: ${format(gDIT / v.sim)} Kg`;
}

// Limpiar resultados
function limpiarResultados() {
  document.querySelector("#resultsTable tbody").innerHTML = "<tr><td colspan='7'>Sin datos</td></tr>";
  document.getElementById("globalSummary").style.display = "none";
}

// Inicializar eventos
function inicializar() {
  document.getElementById("run").addEventListener("click", ejecutarSimulaciones);
  document.getElementById("clear").addEventListener("click", limpiarResultados);
}

document.addEventListener("DOMContentLoaded", inicializar);
