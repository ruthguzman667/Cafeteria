<script setup>
/* Un plato del menú con su precio y el botón "Agregar". */
import { onUnmounted, ref } from 'vue';
import { usePedido } from '../composables/usePedido.js';
import { formatoPesos } from '../utils/formato.js';

const props = defineProps({
    plato: { type: Object, required: true }
});

const { cambiarCantidad } = usePedido();
const agregado = ref(false);
let temporizador = null;

function agregar() {
    cambiarCantidad(props.plato.id, 1);

    // Confirmación visual breve.
    agregado.value = true;
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
        agregado.value = false;
    }, 1200);
}

onUnmounted(() => clearTimeout(temporizador));
</script>

<template>
    <article class="plato">
        <img :src="plato.imagen" :alt="plato.alt" width="150" height="110" loading="lazy">
        <div>
            <h3>{{ plato.nombre }}</h3>
            <p>{{ plato.descripcion }}</p>
        </div>
        <div class="plato-compra">
            <p class="precio">{{ formatoPesos(plato.precio) }}</p>
            <button
                type="button"
                class="agregar"
                :class="{ agregado }"
                :aria-label="'Agregar ' + plato.nombre + ' al pedido'"
                @click="agregar">{{ agregado ? 'Agregado ✓' : 'Agregar' }}</button>
        </div>
    </article>
</template>
