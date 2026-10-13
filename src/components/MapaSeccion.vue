<script setup>
import { restaurante } from '../data/restaurante.js';
</script>

<template>
    <!-- Mapa de Google Maps. La dirección del mapa se cambia en src/data/restaurante.js. -->
    <section id="mapa" class="mapa" aria-labelledby="titulo-mapa">
        <h2 id="titulo-mapa">Cómo encontrarnos</h2>
        <iframe
            :src="restaurante.mapa"
            :title="'Mapa con la ubicación del ' + restaurante.nombre"
            width="1000" height="320"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"></iframe>
    </section>
</template>
