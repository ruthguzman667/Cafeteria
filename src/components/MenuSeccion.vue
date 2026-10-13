<script setup>
/* Menú con filtro por categoría y el panel del pedido. */
import { computed, ref } from 'vue';
import { filtros, platos } from '../data/platos.js';
import PlatoCard from './PlatoCard.vue';
import PedidoPanel from './PedidoPanel.vue';

const filtroActivo = ref('todos');
// Mensaje que leen los lectores de pantalla al cambiar de filtro.
const resultadoFiltro = ref('');

const platosVisibles = computed(() =>
    filtroActivo.value === 'todos'
        ? platos
        : platos.filter((plato) => plato.categoria === filtroActivo.value)
);

function elegirFiltro(valor) {
    filtroActivo.value = valor;
    resultadoFiltro.value = 'Mostrando ' + platosVisibles.value.length + ' plato(s).';
}
</script>

<template>
    <section id="menu" aria-labelledby="titulo-menu">
        <h2 id="titulo-menu">Nuestro menú</h2>
        <p class="nota">Precios en pesos colombianos. Fotografías de referencia.</p>

        <div class="filtros" role="group" aria-label="Filtrar el menú por categoría">
            <button
                v-for="filtro in filtros"
                :key="filtro.valor"
                type="button"
                class="filtro"
                :aria-pressed="filtroActivo === filtro.valor ? 'true' : 'false'"
                @click="elegirFiltro(filtro.valor)">{{ filtro.texto }}</button>
        </div>
        <p class="solo-lectores" aria-live="polite">{{ resultadoFiltro }}</p>

        <!-- TransitionGroup hace aparecer suavemente los platos al cambiar de filtro. -->
        <TransitionGroup name="aparecer" tag="div" class="platos">
            <PlatoCard v-for="plato in platosVisibles" :key="plato.id" :plato="plato" />
        </TransitionGroup>

        <PedidoPanel />

        <p>¿Prefieres hablar con alguien? <a href="#contacto">Comunícate con nosotros</a>.</p>
    </section>
</template>
