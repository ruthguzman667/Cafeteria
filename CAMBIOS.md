# Historial de cambios

Registro de las mejoras del sitio del Restaurante Sabor Casero, de la más reciente a la más antigua.

---

## Versión 4 — 27 de septiembre de 2026

### Agregado
- **Navegación fija en computador.** En pantallas de más de 640 px, el encabezado se queda pegado arriba al hacer scroll (`position: sticky`), de modo que los enlaces siempre se ven y se nota cómo cambia el enlace resaltado (`.activo`). Solo queda a la vista la navegación; el nombre del restaurante se va con el scroll.
  - `iniciarHeaderFijo()` en `js/main.js` calcula el valor de `top` para lograrlo.
  - `alturaHeaderFijo()` devuelve la altura que ocupa el encabezado fijo (0 en celular).

### Cambiado
- El desplazamiento suave (enlaces del menú y botón flotante del pedido) ahora resta la altura del encabezado fijo, para que la sección no quede tapada debajo de la navegación.

---

## Versión 3 — 27 de septiembre de 2026

### Agregado
- **Pedido por WhatsApp.** Cada plato tiene un botón "Agregar". Un panel muestra el pedido con botones − / +, el subtotal de cada plato y el total, además de campos opcionales para el nombre y las notas o la dirección. El botón "Enviar pedido por WhatsApp" abre el chat del restaurante con el mensaje ya escrito.
  - El pedido se guarda en el navegador (`localStorage`) y no se pierde al recargar.
  - Un botón flotante ("Ver pedido (2) · $70.000") lleva al panel desde cualquier parte de la página.
- **Menú hamburguesa en celulares.** En pantallas de 640 px o menos, la navegación se oculta detrás del botón "☰ Menú". Se cierra al elegir una sección o con la tecla Esc.
- **Favicon** propio en `img/favicon.svg`.
- **Etiquetas Open Graph y `twitter:card`** para que el enlace se vea con título, descripción y foto al compartirlo.
- **`theme-color`** para la barra del navegador en Android.
- **Mapa de Google Maps** en la nueva sección "Cómo encontrarnos".
- **Botones "Escribir por WhatsApp" y "Cómo llegar"** en Contacto.
- Nuevo estilo de botón `.boton-secundario`.

### Cambiado
- Los platos ahora tienen `data-id` y `data-precio` (necesarios para el pedido).
- El texto "Para consultar o hacer un pedido…" cambió a "¿Prefieres hablar con alguien?", porque el pedido ya se hace en la página.
- Se reorganizó el encabezado: el nombre a la izquierda y el botón del menú a la derecha.

### Pendiente
- Cambiar el número de WhatsApp de ejemplo (`573003003000`) por el real, en los tres lugares que indica el README.
- Poner la ubicación exacta en el mapa y la ciudad en el enlace "Cómo llegar".
- Cambiar las fotos de Unsplash por fotos propias.
- Agregar `og:url` cuando el sitio esté publicado.

---

## Versión 2

### Agregado
- **jQuery 3.7.1** desde su CDN oficial, con verificación `integrity`.
- `js/main.js` con:
  - Desplazamiento suave a las secciones.
  - Resaltado en la navegación de la sección visible.
  - Filtro del menú por categoría (Todos / Comida rápida / Saludable).
  - Aviso de "Abierto ahora" o "Cerrado" y la marca "(hoy)" en los horarios.
  - Botón "volver arriba".
  - Año automático en el pie de página.
- `README.md` con la explicación del proyecto.

### Cambiado
- El CSS se separó del HTML y ahora está en `css/estilos.css`.
- Los colores pasaron a variables CSS (`:root`).

---

## Versión 1

- Página inicial en un solo archivo `index.html`, con los estilos incluidos.
