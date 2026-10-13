<script setup>
/* Panel del pedido: lista con botones − / +, total, nombre, notas y envío por WhatsApp. */
import { nextTick, ref } from 'vue';
import { usePedido } from '../composables/usePedido.js';
import { formatoPesos } from '../utils/formato.js';
import { enfocar } from '../utils/desplazar.js';

const { items, totalPesos, aviso, cambiarCantidad, vaciar, enlaceWhatsApp } = usePedido();

const nombre = ref('');
const notas = ref('');
const titulo = ref(null);

async function cambiar(id, cambio) {
    cambiarCantidad(id, cambio);

    // Si el plato se quitó, sus botones desaparecen: el foco pasa al título del pedido.
    await nextTick();
    if (!items.value.some((item) => item.id === id)) {
        enfocar(titulo.value);
    }
}

function vaciarPedido() {
    if (window.confirm('¿Quieres vaciar el pedido?')) {
        vaciar();
        enfocar(titulo.value);
    }
}

function enviar() {
    if (items.value.length) {
        window.open(enlaceWhatsApp(nombre.value, notas.value), '_blank', 'noopener');
    }
}
</script>

<template>
    <div id="pedido" class="pedido" aria-labelledby="titulo-pedido" role="region">
        <h3 id="titulo-pedido" ref="titulo">Tu pedido</h3>
        <p v-if="!items.length" class="pedido-vacio">Aún no has agregado platos. Usa el botón «Agregar» de cada plato.</p>
        <ul class="pedido-lista">
            <li v-for="item in items" :key="item.id" class="pedido-item">
                <span class="pedido-nombre">{{ item.nombre }}</span>
                <div class="cantidad">
                    <button
                        type="button"
                        :aria-label="'Quitar una unidad de ' + item.nombre"
                        @click="cambiar(item.id, -1)">&minus;</button>
                    <span>{{ item.cantidad }}</span>
                    <button
                        type="button"
                        :aria-label="'Agregar una unidad de ' + item.nombre"
                        @click="cambiar(item.id, 1)">+</button>
                </div>
                <span class="pedido-subtotal">{{ formatoPesos(item.subtotal) }}</span>
            </li>
        </ul>
        <p class="pedido-total">Total: <strong>{{ formatoPesos(totalPesos) }}</strong></p>

        <label for="pedido-nombre">Tu nombre (opcional)</label>
        <input id="pedido-nombre" v-model="nombre" type="text" autocomplete="name">

        <label for="pedido-notas">Dirección de entrega o notas (opcional)</label>
        <textarea id="pedido-notas" v-model="notas" rows="3" placeholder="Ej.: Para recoger a las 7 p. m., sin cebolla."></textarea>

        <div class="pedido-acciones">
            <button type="button" class="boton-whatsapp" :disabled="!items.length" @click="enviar">Enviar pedido por WhatsApp</button>
            <button type="button" class="boton-secundario" :disabled="!items.length" @click="vaciarPedido">Vaciar pedido</button>
        </div>
        <p class="nota">Se abrirá WhatsApp con tu pedido ya escrito. Solo tienes que enviarlo.</p>
        <!-- Avisos del pedido para lectores de pantalla ("Pizza familiar: 2..."). -->
        <p class="solo-lectores" aria-live="polite">{{ aviso }}</p>
    </div>
</template>
