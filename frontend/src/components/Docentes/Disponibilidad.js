//FUSIONAR HORAS CONSECUTIVAS EN DOCENTES
export function agruparDisponibilidadPorDia(disponibilidad) {
  const agrupado = {};

  disponibilidad.forEach(item => {
    const key = `${item.dia}|${item.salon}|${item.edificio}|${item.nombre_asignatura}`;
    if (!agrupado[key]) {
      agrupado[key] = [];
    }
    agrupado[key].push(item);
  });

  return agrupado;
}

// FUSIONAR HORAS CONSECUTIVAS EN GRUPOS
export function agruparDisponibilidadPorDiaenGrupos(disponibilidad) {
  const agrupado = {};

  disponibilidad.forEach(item => {
    const key = `${item.dia}|${item.grupo}|${item.nombre}|${item.proyecto}|${item.inscritos}`;
    if (!agrupado[key]) {
      agrupado[key] = [];
    }
    agrupado[key].push(item);
  });

  return agrupado;
}

export function fusionarFranjasConsecutivas(agrupado) {
  const resultadoFusionado = [];

  Object.entries(agrupado).forEach(([key, items]) => {
    // Ordenar por hora
    const ordenado = items.sort((a, b) => convertirA24Horas(a.hora) - convertirA24Horas(b.hora));
    let actual = {
      ...ordenado[0], 
      hora_inicio: ordenado[0].hora,
      hora_fin: sumarUnaHora(ordenado[0].hora)
    };

    for (let i = 1; i < ordenado.length; i++) {
      const siguiente = ordenado[i];
      const horaFinActual = convertirA24Horas(actual.hora_fin);
      const horaInicioSiguiente = convertirA24Horas(siguiente.hora);

      if (horaInicioSiguiente === horaFinActual) {
        // Expandir franja
        actual.hora_fin = sumarUnaHora(siguiente.hora);
      } else {
        resultadoFusionado.push({...actual});
        actual = {
          ...siguiente, 
          hora_inicio: siguiente.hora,
          hora_fin: sumarUnaHora(siguiente.hora)
        };
      }
    }
    resultadoFusionado.push({...actual});
  });
  //console.log("Fusionado:", resultadoFusionado);

  return resultadoFusionado;
}

export function convertirA24Horas(horaStr) {
  if (!horaStr) return null;

  // Elimina espacios y símbolos extra (como en "12PM - 1PM")
  const limpio = horaStr.trim().split(/[^A-Za-z0-9]/)[0]; // solo toma la primera hora

  const match = limpio.match(/^(\d{1,2})(AM|PM)$/i);
  if (!match) return null;

  let [, hora, periodo ] = match;
  hora = parseInt(hora, 10);

  if (periodo.toUpperCase() === 'PM' && hora !== 12) {
    hora += 12;
  } else if (periodo.toUpperCase() === 'AM' && hora === 12) {
    hora = 0;
  }

  return hora; // En formato 24h
}

export function convertirAAMPM(hora24) {
  const ampm = hora24 >= 12 ? 'PM' : 'AM';
  const hora12 = hora24 % 12 === 0 ? 12 : hora24 % 12;
  return `${hora12}${ampm}`;
}

export function sumarUnaHora(horaStr) {
  const hora24 = convertirA24Horas(horaStr);
  if (hora24 === null || isNaN(hora24)) return ''; // evita errores
  const siguiente = (hora24 + 1) % 24;
  return convertirAAMPM(siguiente);
}

export function extraerHoraInicial(horaInicioStr) {
  if (!horaInicioStr) return '';
  const match = horaInicioStr.trim().match(/^(\d{1,2}(AM|PM))/i);
  return match ? match[1] : horaInicioStr;
}