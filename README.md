# Restaurante Sabor Casero

Página web de una sola página (*one page*) para un restaurante familiar. Muestra la bienvenida, el menú con precios, una sección "Sobre nosotros", los horarios de atención, los datos de contacto y un mapa. Los clientes pueden armar su pedido en la página y enviarlo por WhatsApp.

Está hecha con **Vue 3** y **Vite**. Antes usaba HTML con jQuery (ver `CAMBIOS.md`).

---

## Cómo ejecutarlo

Se necesita tener instalado [Node.js](https://nodejs.org) (versión 20 o más reciente).

1. Abre una terminal en la carpeta del proyecto.
2. Instala las dependencias (solo la primera vez):
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre en el navegador la dirección que aparece (normalmente http://localhost:5173). La página se recarga sola cada vez que guardas un archivo.

Se necesita **conexión a internet** para cargar las fotografías y el mapa, que vienen de servicios externos.

### Publicar el sitio

```bash
npm run build     # crea la carpeta dist/ con el sitio listo para subir
npm run preview   # muestra en el navegador cómo queda dist/
```

Lo que se sube al servidor (o a GitHub Pages) es el contenido de `dist/`. Como `vite.config.js` usa `base: './'`, el sitio funciona en cualquier carpeta del servidor.

> Ya no basta con hacer doble clic en `index.html`: el navegador no puede ejecutar los archivos `.vue` directamente. Siempre se usa `npm run dev` para trabajar y `npm run build` para publicar.

---

## Estructura del proyecto

```
Cafeteria/
├── index.html               → Página base: <head>, meta etiquetas y <div id="app">
├── vite.config.js           → Configuración de Vite
├── package.json             → Dependencias y comandos (dev, build, preview)
├── public/
│   └── favicon.svg          → Ícono de la pestaña (se copia tal cual)
└── src/
    ├── main.js              → Punto de entrada: monta la app de Vue
    ├── App.vue              → Arma la página con todas las secciones
    ├── assets/
    │   └── estilos.css      → Todo el diseño (colores, tipografía, columnas, celulares)
    ├── data/                → Contenido editable: platos, horarios y contacto
    │   ├── platos.js
    │   ├── horarios.js
    │   └── restaurante.js
    ├── composables/         → Lógica reutilizable
    │   ├── usePedido.js     → Pedido, total, localStorage y enlace de WhatsApp
    │   └── useHorario.js    → Aviso de abierto / cerrado
    ├── utils/
    │   ├── formato.js       → formatoPesos(18000) → "$18.000"
    │   └── desplazar.js     → Desplazamiento suave y manejo del foco
    └── components/          → Una pieza de la página por archivo
        ├── AppHeader.vue
        ├── SeccionBienvenida.vue
        ├── MenuSeccion.vue
        ├── PlatoCard.vue
        ├── PedidoPanel.vue
        ├── BotonPedido.vue
        ├── SeccionNosotros.vue
        ├── HorariosSeccion.vue
        ├── ContactoSeccion.vue
        ├── MapaSeccion.vue
        ├── AppFooter.vue
        └── BotonVolverArriba.vue
```

| Carpeta / archivo | Se encarga de | Se edita cuando quieres... |
|---|---|---|
| `src/data/` | **Qué datos** se muestran | Cambiar platos, precios, horarios, teléfonos |
| `src/components/` | **Qué estructura** tiene cada parte | Cambiar textos fijos o agregar elementos |
| `src/assets/estilos.css` | **Cómo** se ve | Cambiar colores, tamaños, espacios |
| `src/composables/` | **Qué hace** al interactuar | Cambiar la lógica del pedido o del horario |

---

## Cómo está hecho

### Componentes

Cada archivo `.vue` tiene tres partes:

- `<script setup>`: los datos y funciones del componente.
- `<template>`: el HTML, con instrucciones de Vue como `v-for` (repetir), `v-if` (mostrar u ocultar), `:atributo` (atributo calculado) y `@click` (evento).
- (Los estilos están todos en `src/assets/estilos.css`, igual que antes, para no cambiar el diseño).

| Componente | Qué hace | Reemplaza en jQuery a |
|---|---|---|
| `AppHeader.vue` | Nombre, navegación, menú hamburguesa (se cierra con Esc o al elegir sección) y resaltado de la sección visible. | `iniciarMenuCelular`, `iniciarNavegacionActiva` |
| `App.vue` | Arma la página y da desplazamiento suave a todos los enlaces internos (`#menu`, `#contacto`...). | `iniciarDesplazamientoSuave` |
| `MenuSeccion.vue` + `PlatoCard.vue` | Muestra los platos desde `platos.js`, el filtro por categoría y el botón "Agregar". | `iniciarFiltroMenu` y parte de `iniciarPedido` |
| `PedidoPanel.vue` + `BotonPedido.vue` | Panel del pedido con − / +, total, nombre, notas, envío por WhatsApp y botón flotante. | `iniciarPedido` |
| `HorariosSeccion.vue` | Lista de horarios, "(hoy)" y aviso de abierto o cerrado. | `iniciarEstadoHorario` |
| `BotonVolverArriba.vue` | Botón ↑ que aparece al bajar 400 px. | `iniciarVolverArriba` |
| `AppFooter.vue` | Pie de página con el año actual. | `actualizarAnio` |

### La diferencia principal con jQuery

Con jQuery había que **buscar elementos y cambiarlos a mano** (`$('.pedido-lista').empty().append(...)`). Con Vue se cambian **los datos** y la pantalla se actualiza sola. Por ejemplo, el pedido es un arreglo dentro de `usePedido.js`; cuando se agrega un plato, el panel, el total y el botón flotante se redibujan automáticamente.

### Cómo funciona el pedido por WhatsApp

1. **El estado se comparte.** `usePedido()` guarda el pedido fuera de la función, así que `PlatoCard`, `PedidoPanel` y `BotonPedido` usan el mismo pedido.
2. **El nombre y el precio salen de `src/data/platos.js`.** Si cambias un precio ahí, el pedido lo toma automáticamente.
3. **Se guarda en `localStorage`.** Si la persona recarga la página, su pedido sigue ahí. Solo se guardan el `id` y la `cantidad`, nunca el precio, y va dentro de `try/catch` porque en modo incógnito puede fallar.
4. **Se arma el mensaje** con una línea por plato, el total y, si los escribieron, el nombre y las notas. Se convierte con `encodeURIComponent()` y se abre `https://wa.me/NUMERO?text=MENSAJE`.
5. **Seguridad:** Vue inserta los textos con `{{ }}`, que nunca los interpreta como HTML.

No hay pago en línea ni servidor. El restaurante recibe el pedido como un mensaje normal de WhatsApp.

### Accesibilidad

Se mantiene todo lo que tenía la versión anterior:

- HTML semántico (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<dl>`, `<address>`, `<footer>`).
- `aria-expanded` en el botón del menú, `aria-pressed` en los filtros y `aria-current` en el enlace activo.
- Mensajes con `aria-live="polite"` para el filtro, el pedido y el horario.
- El foco se mueve a la sección o al título del pedido para quienes usan teclado o lector de pantalla.
- Si el sistema pide menos movimiento (`prefers-reduced-motion`), se quitan las animaciones.
- Botones y enlaces de al menos 44 px de alto.

---

## Cómo hacer cambios comunes

### Agregar un plato

Agrega un objeto al arreglo `platos` en `src/data/platos.js`:

```js
{
    id: 'limonada',
    nombre: 'Limonada natural',
    descripcion: 'Descripción corta.',
    categoria: 'saludable',
    precio: 6000,
    imagen: 'URL-DE-LA-FOTO',
    alt: 'Descripción de la foto'
}
```

- `id` debe ser **único**, en minúsculas y sin espacios ni tildes.
- `categoria` debe coincidir con el `valor` de uno de los `filtros`.
- `precio` va **sin puntos ni signo $**. El texto "$6.000" se arma solo.

### Agregar una categoría nueva

1. Agrega un filtro en `src/data/platos.js`: `{ valor: 'bebidas', texto: 'Bebidas' }`.
2. Ponle `categoria: 'bebidas'` a los platos correspondientes.

### Cambiar un horario

Edita `src/data/horarios.js`. Los días se numeran así: `0` domingo, `1` lunes ... `6` sábado. `abre` y `cierra` van en formato de 24 horas.

### Cambiar los números de WhatsApp, el teléfono o el mapa

Todo está en `src/data/restaurante.js`:

- `whatsappPedidos`: número que recibe los pedidos (código de país, sin espacios ni `+`).
- `whatsappContacto`: botón "Escribir por WhatsApp".
- `telefono`: enlace "Llamar para pedir" (este sí lleva `+`).
- `mapa`: en Google Maps → **Compartir** → **Insertar un mapa** → copia solo lo que está dentro de `src="..."`.
- `comoLlegar`: cambia `destination=` por la dirección con la ciudad (`%23` es el signo `#`).

### Cambiar la vista previa al compartir el enlace

Edita las etiquetas `og:` del `<head>` en `index.html`. Lo ideal es una foto propia de 1200 × 630 px.

### Cambiar los colores

Edita las variables al inicio de `src/assets/estilos.css`:

```css
:root {
    --color-principal: #843d29;   /* botones, precios, enlaces */
    --color-fondo: #faf7f2;       /* fondo de la página */
    ...
}
```

---

## Recursos externos

- **Vue 3** y **Vite** — se instalan con `npm install`.
- **Google Maps** — mapa embebido y enlace "Cómo llegar" (no requieren clave de API).
- **WhatsApp** — enlaces `wa.me` para abrir un chat con un mensaje ya escrito.
- **Fotografías** — [Unsplash](https://unsplash.com), usadas como referencia. Para publicar el sitio conviene reemplazarlas por fotos propias.
