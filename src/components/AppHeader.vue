<script setup>
/* Encabezado: nombre del restaurante, menú hamburguesa en celulares
   y resaltado de la sección que se está viendo. */
import { onMounted, onUnmounted, ref } from 'vue';
import { restaurante } from '../data/restaurante.js';

const enlaces = [
    { id: 'inicio', texto: 'Inicio' },
    { id: 'menu', texto: 'Menú' },
    { id: 'nosotros', texto: 'Nosotros' },
    { id: 'contacto', texto: 'Contacto' }
];

const menuAbierto = ref(false);
const activo = ref(null);
const botonMenu = ref(null);
// Debe coincidir con el @media del CSS.
const celular = window.matchMedia('(max-width: 640px)');

function alternarMenu() {
    menuAbierto.value = !menuAbierto.value;
}

// Al elegir una sección en el celular, el menú se cierra para dejar ver el contenido.
function alElegirEnlace() {
    if (celular.matches) {
        menuAbierto.value = false;
    }
}

// La tecla Esc cierra el menú y devuelve el foco al botón.
function alPresionarTecla(evento) {
    if (evento.key === 'Escape' && menuAbierto.value) {
        menuAbierto.value = false;
        botonMenu.value.focus();
    }
}

// Si la pantalla pasa a tamaño computador, se limpia el estado del menú.
function alCambiarPantalla() {
    menuAbierto.value = false;
}

function marcarSeccion() {
    const posicion = window.scrollY + window.innerHeight / 3;
    let actual = null;

    enlaces.forEach((enlace) => {
        const seccion = document.getElementById(enlace.id);
        if (seccion && seccion.getBoundingClientRect().top + window.scrollY <= posicion) {
            actual = enlace.id;
        }
    });

    // Al llegar al final de la página se marca el último enlace (Contacto),
    // porque esa sección puede ser muy corta para llegar a la posición de referencia.
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        actual = enlaces[enlaces.length - 1].id;
    }

    activo.value = actual;
}

onMounted(() => {
    document.addEventListener('keydown', alPresionarTecla);
    celular.addEventListener('change', alCambiarPantalla);
    window.addEventListener('scroll', marcarSeccion, { passive: true });
    window.addEventListener('resize', marcarSeccion);
    marcarSeccion();
});

onUnmounted(() => {
    document.removeEventListener('keydown', alPresionarTecla);
    celular.removeEventListener('change', alCambiarPantalla);
    window.removeEventListener('scroll', marcarSeccion);
    window.removeEventListener('resize', marcarSeccion);
});
</script>

<template>
    <header>
        <div class="contenedor">
            <div class="cabecera-fila">
                <div>
                    <h1>{{ restaurante.nombre }}</h1>
                    <p class="descripcion">Comida casera para compartir en familia.</p>
                </div>
                <!-- aria-expanded indica si el menú está abierto. -->
                <button
                    ref="botonMenu"
                    type="button"
                    class="boton-menu"
                    :aria-expanded="menuAbierto ? 'true' : 'false'"
                    aria-controls="menu-principal"
                    @click="alternarMenu">
                    <span aria-hidden="true">&#9776;</span> Menú
                </button>
            </div>
            <nav aria-label="Navegación principal">
                <ul id="menu-principal" :class="{ abierta: menuAbierto }">
                    <li v-for="enlace in enlaces" :key="enlace.id">
                        <a
                            :href="'#' + enlace.id"
                            :class="{ activo: activo === enlace.id }"
                            :aria-current="activo === enlace.id ? 'location' : null"
                            @click="alElegirEnlace">{{ enlace.texto }}</a>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
</template>
