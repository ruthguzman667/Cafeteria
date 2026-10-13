/* ==========================================================================
   Aviso de "Abierto ahora" / "Cerrado" y día actual
   Usa la hora del dispositivo de quien visita la página.
   ========================================================================== */

import { horarios } from '../data/horarios.js';

function aMinutos(hora) {
    const [horas, minutos] = hora.split(':').map(Number);
    return horas * 60 + minutos;
}

export function useHorario() {
    const ahora = new Date();
    const hoy = ahora.getDay();
    const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();

    const horarioDeHoy = horarios.find((horario) => horario.dias.includes(hoy));
    const abierto = Boolean(horarioDeHoy)
        && minutosAhora >= aMinutos(horarioDeHoy.abre)
        && minutosAhora < aMinutos(horarioDeHoy.cierra);

    return {
        abierto,
        esHoy: (horario) => horario === horarioDeHoy
    };
}
