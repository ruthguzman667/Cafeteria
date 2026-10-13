<script setup>
/* Botón flotante con el resumen del pedido: lleva al panel desde cualquier parte. */
import { usePedido } from '../composables/usePedido.js';
import { formatoPesos } from '../utils/formato.js';
import { desplazarA } from '../utils/desplazar.js';

const { totalPlatos, totalPesos } = usePedido();

function irAlPedido() {
    desplazarA(document.getElementById('titulo-pedido'));
}
</script>

<template>
    <Transition name="fade">
        <button v-if="totalPlatos > 0" type="button" class="boton-pedido" @click="irAlPedido">
            Ver pedido ({{ totalPlatos }}) · {{ formatoPesos(totalPesos) }}
        </button>
    </Transition>
</template>
