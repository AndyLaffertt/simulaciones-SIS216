(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  ready(init);

  function init() {
    const $ = (id) => document.getElementById(id);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));

    const simulaciones = $('simulaciones');
    const dias = $('dias');
    const lambda = $('lambda');
    const precioHuevo = $('precioHuevo');
    const precioPollo = $('precioPollo');

    const btnSimular = $('btnSimular');
    const btnLimpiar = $('btnLimpiar');

    const tabla = $('tablaResultados');
    const resumen = {
      ingresoTotal: $('ingresoTotal'),
      ingresoProm: $('ingresoProm'),
      huevosSanos: $('huevosSanos'),
      huevosRotos: $('huevosRotos'),
      pollosVivos: $('pollosVivos'),
      pollitosMuertos: $('pollitosMuertos'),
    };

    const errHuevo = $('err-huevo');
    const errPollito = $('err-pollito');
    const mensajeError = $('mensajeError');
    const probInputs = $$('.prob');

    probInputs.forEach(input => {
      input.addEventListener('input', () => validarProbabilidades());
    });

    btnSimular.addEventListener('click', simular);
    btnLimpiar.addEventListener('click', limpiar);

    function validarGrupo(grupo) {
      const inputs = probInputs.filter(i => i.dataset.group === grupo);
      let suma = 0;
      let ok = true;
      for (const input of inputs) {
        const val = parseFloat(input.value) || 0;
        if (val < 0 || val > 1) {
          input.classList.add('error');
          ok = false;
        } else {
          input.classList.remove('error');
        }
        suma += val;
      }
      const sumaOk = Math.abs(suma - 1) < 1e-6;
      const err = grupo === 'huevo' ? errHuevo : errPollito;
      err.hidden = ok && sumaOk;
      if (!ok) {
        err.textContent = '⚠️ Valores deben estar entre 0 y 1.';
      } else if (!sumaOk) {
        err.textContent = `⚠️ Suma actual: ${suma.toFixed(2)} (debe ser 1.00)`;
      }
      return ok && sumaOk;
    }

    function validarProbabilidades() {
      return validarGrupo('huevo') && validarGrupo('pollito');
    }

    function poisson(lambda) {
      const L = Math.exp(-lambda);
      let k = 0, p = 1;
      do {
        k++;
        p *= Math.random();
      } while (p > L);
      return k - 1;
    }

    function binomial(n, p) {
      let x = 0;
      for (let i = 0; i < n; i++) {
        if (Math.random() < p) x++;
      }
      return x;
    }

    function simular() {
      if (!validarProbabilidades()) return;

      const nsim = parseInt(simulaciones.value);
      const ndias = parseInt(dias.value);
      const λ = parseFloat(lambda.value);
      const pHuevo = parseFloat(precioHuevo.value);
      const pPollo = parseFloat(precioPollo.value);

      const pRoto = parseFloat($('pRoto').value);
      const pPollito = parseFloat($('pPollito').value);
      const pHuevoFinal = parseFloat($('pHuevoFinal').value);
      const pMuere = parseFloat($('pMuere').value);
      const pSobrevive = parseFloat($('pSobrevive').value);

      // Limpiar tabla
        const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = '';


      // Acumuladores globales
    let totalIngreso = 0;
    let totalHuevosSanos = 0;
    let totalHuevosRotos = 0;
    let totalPollitos = 0;
    let totalPollitosMuertos = 0;
    let totalPollos = 0;


      for (let sim = 1; sim <= nsim; sim++) {
        let huevos = 0;
        let rotos = 0;
        let pollitos = 0;
        let muertos = 0;
        let pollos = 0;
        let huevosFinales = 0;
        let ingreso = 0;

        for (let d = 0; d < ndias; d++) {
          const nuevosHuevos = poisson(λ);
          huevos += nuevosHuevos;

          const nRotos = binomial(nuevosHuevos, pRoto);
          const nPollitos = binomial(nuevosHuevos - nRotos, pPollito / (pPollito + pHuevoFinal));
          const nHuevosFinales = nuevosHuevos - nRotos - nPollitos;

          const nMuertos = binomial(nPollitos, pMuere);
          const nPollos = nPollitos - nMuertos;

          rotos += nRotos;
          pollitos += nPollitos;
          muertos += nMuertos;
          pollos += nPollos;
          huevosFinales += nHuevosFinales;

          ingreso += nPollos * pPollo + nHuevosFinales * pHuevo;
        }

        totalIngreso += ingreso;
        totalHuevosSanos += huevosFinales;
        totalHuevosRotos += rotos;
        totalPollos += pollos;
        totalPollitos += pollitos;
        totalPollitosMuertos += muertos;


        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${sim}</td>
          <td>${huevos}</td>
          <td>${rotos}</td>
          <td>${pollitos}</td>
          <td>${muertos}</td>
          <td>${pollos}</td>
          <td>${huevosFinales}</td>
          <td>$${ingreso.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
      }

      const ingresoProm = totalIngreso / (nsim * ndias);

      const totalSim = nsim;
        const huevosSanosProm = Math.round(totalHuevosSanos / totalSim);
        const huevosRotosProm = Math.round(totalHuevosRotos / totalSim);
        const pollosVivosProm = Math.round(totalPollos / totalSim);
        const pollitosMuertosProm = Math.round(totalPollitosMuertos / totalSim);
        const ingresoTotalProm = totalIngreso / totalSim;

        resumen.ingresoTotal.textContent = `$${totalIngreso.toFixed(2)}`;
        resumen.ingresoProm.textContent = `$${ingresoProm.toFixed(2)}`;
        resumen.huevosSanos.textContent = huevosSanosProm;
        resumen.huevosRotos.textContent = huevosRotosProm;
        resumen.pollosVivos.textContent = pollosVivosProm;
        resumen.pollitosMuertos.textContent = pollitosMuertosProm;

        // Mostrar el bloque
        document.getElementById('summary').style.display = 'block';

    }

    function limpiar() {
      const tbody = tabla.querySelector('tbody');
        tbody.innerHTML = '<tr><td colspan="8">Sin resultados aún.</td></tr>';
      Object.values(resumen).forEach((el) => (el.textContent = '—'));
      mensajeError.hidden = true;
      errHuevo.hidden = true;
      errPollito.hidden = true;
    }
  }
})();
