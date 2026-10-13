<script setup>
/* Componente principal: arma la página con todas las secciones. */
import { onMounted, onUnmounted } from 'vue';
import { desplazarA } from './utils/desplazar.js';
import AppHeader from './components/AppHeader.vue';
import SeccionBienvenida from './components/SeccionBienvenida.vue';
import MenuSeccion from './components/MenuSeccion.vue';
import SeccionNosotros from './components/SeccionNosotros.vue';
import HorariosSeccion from './components/HorariosSeccion.vue';
import ContactoSeccion from './components/ContactoSeccion.vue';
import MapaSeccion from './components/MapaSeccion.vue';
import AppFooter from './components/AppFooter.vue';
import BotonPedido from './components/BotonPedido.vue';
import BotonVolverArriba from './components/BotonVolverArriba.vue';

// Desplazamiento suave para todos los enlaces internos (#menu, #contacto...),
// estén en el componente que estén.
function alHacerClic(evento) {
    const enlace = evento.target.closest('a[href^="#"]');
    if (!enlace) {
        return;
    }

    const destino = document.getElementById(enlace.getAttribute('href').slice(1));
    // Si el destino no existe, se deja el comportamiento normal del enlace.
    if (!destino) {
        return;
    }

    evento.preventDefault();
    history.pushState(null, '', '#' + destino.id);
    desplazarA(destino);
}

onMounted(() => document.addEventListener('click', alHacerClic));
onUnmounted(() => document.removeEventListener('click', alHacerClic));
</script>

<template>
    <AppHeader />

    <!-- Contenido principal. Solo se utiliza un elemento main en la página. -->
    <main class="contenedor contenedor_main">
        <SeccionBienvenida />
        <MenuSeccion />
        <SeccionNosotros />

        <div class="informacion">
            <HorariosSeccion />
            <ContactoSeccion />
        </div>

        <MapaSeccion />
    </main>

    <AppFooter />
    <BotonPedido />
    <BotonVolverArriba />
</template>
