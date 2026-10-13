/* ==========================================================================
   Horarios de atención
   - dias: 0 = domingo, 1 = lunes ... 6 = sábado.
   - abre / cierra: hora de 24 horas (HH:MM). Se usan para el aviso de abierto.
   - texto / horas: lo que se ve en pantalla.
   ========================================================================== */

export const horarios = [
    { texto: 'Lunes a viernes', horas: '11:00 a. m. – 9:00 p. m.', dias: [1, 2, 3, 4, 5], abre: '11:00', cierra: '21:00' },
    { texto: 'Sábados', horas: '11:00 a. m. – 10:00 p. m.', dias: [6], abre: '11:00', cierra: '22:00' },
    { texto: 'Domingos', horas: '12:00 p. m. – 8:00 p. m.', dias: [0], abre: '12:00', cierra: '20:00' }
];
