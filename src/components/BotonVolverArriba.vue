<script setup>
/* Botón "volver arriba": aparece después de bajar 400 px. */
import { onMounted, onUnmounted, ref } from 'vue';
import { desplazarArriba, enfocar } from '../utils/desplazar.js';

const visible = ref(false);

function alDesplazar() {
    visible.value = window.scrollY > 400;
}

function volver() {
    desplazarArriba();
    enfocar(document.querySelector('h1'));
}

onMounted(() => {
    window.addEventListener('scroll', alDesplazar, { passive: true });
    alDesplazar();
});

onUnmounted(() => window.removeEventListener('scroll', alDesplazar));
</script>

<template>
    <Transition name="fade">
        <button v-if="visible" type="button" class="volver-arriba" aria-label="Volver arriba" @click="volver">&uarr;</button>
    </Transition>
</template>
