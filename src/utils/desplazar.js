/* ==========================================================================
   Desplazamiento suave hacia una parte de la página
   ========================================================================== */

// Si la persona pidió menos animaciones en su sistema, se respetan.
function comportamiento() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
}

// Altura del encabezado fijo, para que la sección no quede tapada por la navegación.
function alturaHeader() {
    const header = document.querySelector('header');
    if (!header || getComputedStyle(header).position !== 'fixed') {
        return 0;
    }
    return header.offsetHeight;
}

// Mueve el foco sin volver a desplazar la página. Ayuda a quienes usan teclado
// o lector de pantalla a seguir en la sección a la que llegaron.
export function enfocar(elemento) {
    elemento.setAttribute('tabindex', '-1');
    elemento.focus({ preventScroll: true });
}

export function desplazarA(elemento) {
    const destino = elemento.getBoundingClientRect().top + window.scrollY - alturaHeader() - 20;
    window.scrollTo({ top: destino, behavior: comportamiento() });
    enfocar(elemento);
}

export function desplazarArriba() {
    window.scrollTo({ top: 0, behavior: comportamiento() });
}
