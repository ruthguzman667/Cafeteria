<script setup>
import { restaurante } from '../data/restaurante.js';
</script>

<template>
    <!-- El enlace tel permite llamar desde un dispositivo compatible. -->
    <section id="contacto" aria-labelledby="titulo-contacto">
        <h2 id="titulo-contacto">Contacto</h2>
        <address>
            <p><strong>Dirección:</strong><br>{{ restaurante.direccion }}</p>
            <p><strong>Teléfono:</strong><br>{{ restaurante.telefonoVisible }}</p>
            <div class="contacto-acciones">
                <a class="enlace-menu" :href="'tel:' + restaurante.telefono">Llamar para pedir</a>
                <a class="enlace-menu" :href="'https://wa.me/' + restaurante.whatsappContacto" target="_blank" rel="noopener">Escribir por WhatsApp</a>
                <a class="boton-secundario" :href="restaurante.comoLlegar" target="_blank" rel="noopener">Cómo llegar</a>
            </div>
        </address>
    </section>
</template>
