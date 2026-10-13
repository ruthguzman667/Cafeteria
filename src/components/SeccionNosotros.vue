<script setup>
import { restaurante } from '../data/restaurante.js';
</script>

<template>
    <section id="nosotros" aria-labelledby="titulo-nosotros">
        <h2 id="titulo-nosotros">Sobre nosotros</h2>
        <p>En Sabor Casero nos gusta la comida sencilla y el tiempo en familia. Nuestro menú reúne opciones para almorzar, cenar o compartir.</p>
        <p>Nos encuentras en la {{ restaurante.direccion }}. ¡Te esperamos!</p>
    </section>
</template>
