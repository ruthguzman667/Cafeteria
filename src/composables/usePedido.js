/* ==========================================================================
   Pedido por WhatsApp
   El estado vive fuera de la función, así que todos los componentes que
   llaman a usePedido() comparten el mismo pedido.
   Solo se guarda { id, cantidad }; el nombre y el precio siempre salen de
   src/data/platos.js, para que un cambio de precio se refleje en el pedido.
   ========================================================================== */

import { computed, ref, watch } from 'vue';
import { platos } from '../data/platos.js';
import { restaurante } from '../data/restaurante.js';
import { formatoPesos } from '../utils/formato.js';

const CLAVE_GUARDADO = 'saborCaseroPedido';

function buscarPlato(id) {
    return platos.find((plato) => plato.id === id);
}

// localStorage guarda el pedido en el navegador para que no se pierda al recargar.
// try/catch: en modo incógnito o con el almacenamiento bloqueado puede fallar.
function cargar() {
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE_GUARDADO)) || [];
        return guardado
            .map((item) => ({ id: item.id, cantidad: parseInt(item.cantidad, 10) }))
            // Se ignoran platos que ya no existen en el menú o cantidades inválidas.
            .filter((item) => buscarPlato(item.id) && item.cantidad > 0);
    } catch (error) {
        return [];
    }
}

function guardar(lista) {
    try {
        localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(lista));
    } catch (error) {
        // Sin almacenamiento el pedido funciona igual, solo que no se recuerda.
    }
}

const seleccion = ref(cargar());
// Mensaje que anuncian los lectores de pantalla ("Pizza familiar: 2...").
const aviso = ref('');

watch(seleccion, guardar, { deep: true });

// Une lo elegido con los datos del menú: [{ id, nombre, precio, cantidad, subtotal }]
const items = computed(() =>
    seleccion.value.map((item) => {
        const plato = buscarPlato(item.id);
        return {
            id: item.id,
            nombre: plato.nombre,
            precio: plato.precio,
            cantidad: item.cantidad,
            subtotal: plato.precio * item.cantidad
        };
    })
);

const totalPlatos = computed(() => items.value.reduce((suma, item) => suma + item.cantidad, 0));
const totalPesos = computed(() => items.value.reduce((suma, item) => suma + item.subtotal, 0));

// Cambia la cantidad de un plato; si llega a 0 se quita del pedido.
function cambiarCantidad(id, cambio) {
    const plato = buscarPlato(id);
    let item = seleccion.value.find((otro) => otro.id === id);

    if (!plato || (!item && cambio < 0)) {
        return;
    }
    if (!item) {
        seleccion.value.push({ id, cantidad: 0 });
        item = seleccion.value[seleccion.value.length - 1];
    }

    item.cantidad += cambio;
    if (item.cantidad <= 0) {
        seleccion.value = seleccion.value.filter((otro) => otro.id !== id);
        aviso.value = plato.nombre + ' se quitó del pedido.';
    } else {
        aviso.value = plato.nombre + ': ' + item.cantidad + '. Total ' + formatoPesos(totalPesos.value) + '.';
    }
}

function vaciar() {
    seleccion.value = [];
    aviso.value = 'El pedido quedó vacío.';
}

// Arma el enlace de WhatsApp con el pedido ya escrito.
function enlaceWhatsApp(nombre, notas) {
    const lineas = ['Hola, quiero hacer un pedido:', ''];
    items.value.forEach((item) => {
        lineas.push('• ' + item.cantidad + ' x ' + item.nombre + ' — ' + formatoPesos(item.subtotal));
    });
    lineas.push('', 'Total: ' + formatoPesos(totalPesos.value));

    if (nombre.trim()) {
        lineas.push('Nombre: ' + nombre.trim());
    }
    if (notas.trim()) {
        lineas.push('Notas: ' + notas.trim());
    }

    // encodeURIComponent convierte espacios, tildes y saltos de línea al formato de una URL.
    return 'https://wa.me/' + restaurante.whatsappPedidos + '?text=' + encodeURIComponent(lineas.join('\n'));
}

export function usePedido() {
    return { items, totalPlatos, totalPesos, aviso, cambiarCantidad, vaciar, enlaceWhatsApp };
}
