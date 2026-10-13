<script setup>
/* Horarios de atención con el aviso de "Abierto ahora" o "Cerrado". */
import { horarios } from '../data/horarios.js';
import { useHorario } from '../composables/useHorario.js';

const { abierto, esHoy } = useHorario();
</script>

<template>
    <section id="horarios" aria-labelledby="titulo-horarios">
        <h2 id="titulo-horarios">Horarios</h2>
        <p class="estado" :class="abierto ? 'abierto' : 'cerrado'" aria-live="polite">
            {{ abierto ? 'Abierto ahora' : 'Cerrado en este momento' }}
        </p>
        <!-- Una lista descriptiva relaciona cada grupo de días con su horario. -->
        <dl class="horarios">
            <div v-for="horario in horarios" :key="horario.texto" :class="{ hoy: esHoy(horario) }">
                <dt>{{ horario.texto }}</dt>
                <dd>{{ horario.horas }}</dd>
            </div>
        </dl>
    </section>
</template>
