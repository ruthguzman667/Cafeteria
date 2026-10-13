<script setup>
import { restaurante } from '../data/restaurante.js';

// El año se calcula solo, para no tener que cambiarlo a mano cada año.
const anio = new Date().getFullYear();
</script>

<template>
    <footer class="contenedor">
        <p>&copy; {{ anio }} {{ restaurante.nombre }}. Todos los derechos reservados.</p>
    </footer>
</template>
