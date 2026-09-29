# Restaurante Sabor Casero

Página web de una sola página (*one page*) para un restaurante familiar. Muestra la bienvenida, el menú con precios, una sección "Sobre nosotros", los horarios de atención, los datos de contacto y un mapa. Los clientes pueden armar su pedido en la página y enviarlo por WhatsApp.

Está hecha con **HTML**, **CSS** y **JavaScript con jQuery**, sin herramientas de compilación: basta con abrir `index.html` en el navegador.

---

## Estructura del proyecto

```
Cafeteria/
├── index.html        → Contenido y estructura de la página
├── css/
│   └── estilos.css   → Todo el diseño (colores, tipografía, columnas, celulares)
├── js/
│   └── main.js       → Funcionalidad interactiva con jQuery
├── img/
│   └── favicon.svg   → Ícono de la pestaña del navegador
├── README.md         → Este documento
└── CAMBIOS.md        → Historial de cambios del proyecto
```

Cada archivo tiene una sola responsabilidad:

| Archivo | Se encarga de | Se edita cuando quieres... |
|---|---|---|
| `index.html` | **Qué** se muestra | Cambiar textos, platos, precios, horarios |
| `css/estilos.css` | **Cómo** se ve | Cambiar colores, tamaños, espacios |
| `js/main.js` | **Qué hace** al interactuar | Agregar o cambiar comportamientos |

---

## Cómo ejecutarlo

1. Abre la carpeta del proyecto.
2. Haz doble clic en `index.html` (o clic derecho → *Abrir con* → tu navegador).
3. Se necesita **conexión a internet** para cargar jQuery y las fotografías, que vienen de servicios externos.

Opcional: en VS Code puedes instalar la extensión **Live Server** y usar *Open with Live Server* para que la página se recargue sola cada vez que guardas.

---

## Cómo se hizo

### 1. HTML (`index.html`)

La página se escribió con **HTML semántico**, es decir, usando la etiqueta que corresponde a cada tipo de contenido en lugar de solo `<div>`:

| Etiqueta | Uso en la página |
|---|---|
| `<header>` | Nombre del restaurante y navegación |
| `<nav>` | Menú de enlaces a las secciones |
| `<main>` | Contenido principal (solo hay uno) |
| `<section>` | Cada bloque: Inicio, Menú, Nosotros, Horarios, Contacto |
| `<article class="plato">` | Cada plato del menú |
| `<dl>`, `<dt>`, `<dd>` | Lista de horarios (día → hora) |
| `<address>` | Datos de contacto |
| `<footer>` | Pie de página |

Otros detalles:

- **Navegación interna:** los enlaces del menú apuntan a los `id` de las secciones (`href="#menu"` → `<section id="menu">`).
- **Accesibilidad:** cada sección usa `aria-labelledby` apuntando a su título, todas las imágenes tienen texto alternativo (`alt`) y los enlaces y botones miden al menos 44 px de alto para tocarlos fácilmente en el celular.
- **Imágenes:** llevan `width` y `height` para que la página no "salte" mientras cargan, y las del menú usan `loading="lazy"` para cargarse solo cuando se acercan a la pantalla.
- **Llamar o escribir desde el celular:** "Llamar para pedir" usa `href="tel:+573003003000"` y "Escribir por WhatsApp" usa `https://wa.me/573003003000`.
- **Cómo llegar y mapa:** el botón "Cómo llegar" abre Google Maps con la ruta hasta la dirección. La sección "Cómo encontrarnos" muestra el mapa dentro de un `<iframe>` con `loading="lazy"`, así que solo se carga cuando la persona baja hasta él.
- **Menú hamburguesa:** en el encabezado hay un `<button class="boton-menu">` con `aria-expanded` (dice si el menú está abierto) y `aria-controls="menu-principal"` (dice qué lista controla).
- **Panel del pedido:** el bloque `<div id="pedido">` trae el título, la lista vacía, el total, los campos de nombre y notas y los botones. Viene con `hidden` y jQuery lo muestra y lo llena.
- **Atributos `data-*`:** son datos extra que no se ven en pantalla pero que lee jQuery:
  - `data-categoria` en cada plato (para el filtro del menú).
  - `data-id` y `data-precio` en cada plato (para el pedido). El precio va sin puntos: `18000`.
  - `data-filtro` en cada botón de filtro.
  - `data-whatsapp` en el panel del pedido: el número que recibe los pedidos.
  - `data-dias`, `data-abre` y `data-cierra` en cada horario (para saber si está abierto).

En el `<head>` también hay:

- **Favicon:** `<link rel="icon" href="img/favicon.svg">`. Es un SVG, así que se ve nítido en cualquier tamaño.
- **`theme-color`:** pinta la barra del navegador en Android con el color del restaurante.
- **Open Graph (`og:title`, `og:description`, `og:image`...):** es lo que usan WhatsApp, Facebook y otras redes para mostrar una tarjeta con título, texto y foto cuando alguien comparte el enlace. `og:image` debe ser una dirección completa (`https://...`). La etiqueta `twitter:card` hace lo mismo en X (Twitter).

Al final del `<body>` se cargan los scripts, **en este orden**:

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="..." crossorigin="anonymous"></script>
<script src="js/main.js"></script>
```

Primero jQuery y luego nuestro código, porque `main.js` usa jQuery. El atributo `integrity` es una huella digital del archivo: si alguien modificara jQuery en el servidor, el navegador se negaría a ejecutarlo.

### 2. CSS (`css/estilos.css`)

Antes el CSS estaba dentro de una etiqueta `<style>` en el HTML. Ahora está en un archivo aparte y se enlaza desde el `<head>`:

```html
<link rel="stylesheet" href="css/estilos.css">
```

Ventajas de separarlo: el HTML queda más limpio, el navegador guarda el CSS en caché y se pueden reutilizar los estilos en otras páginas.

El archivo está dividido en bloques comentados:

1. **Variables de color (`:root`)** — todos los colores se definen una vez, por ejemplo `--color-principal: #843d29;`, y luego se usan con `var(--color-principal)`. Para cambiar el color de la marca en todo el sitio basta con editar una línea.
2. **Base** — `box-sizing`, tipografía (Arial para textos y Georgia para títulos, que ya vienen en todos los equipos), márgenes y enlaces.
3. **Cabecera y navegación** — `.cabecera-fila` pone el nombre a la izquierda y el botón del menú a la derecha. Los enlaces van en fila con `display: flex`, y la clase `.activo` (la pone jQuery) resalta la sección visible. En pantallas grandes el encabezado es fijo (`position: sticky`) y jQuery ajusta su `top` para que solo la navegación quede pegada arriba.
4. **Secciones y botones** — la bienvenida usa `display: grid` con dos columnas (texto y foto). `.enlace-menu` es el botón principal (con fondo) y `.boton-secundario` el de menor importancia (solo borde).
5. **Menú y filtros** — cada plato es una cuadrícula de tres columnas: foto, descripción y `.plato-compra` (precio con el botón "Agregar"). El botón de filtro seleccionado se pinta según su atributo `aria-pressed="true"`.
6. **Pedido por WhatsApp** — el panel `.pedido`, las filas `.pedido-item` (nombre, botones − / + y subtotal), los campos del formulario, el botón verde `.boton-whatsapp` y el botón flotante `.boton-pedido`, que usa `position: fixed` en la esquina inferior izquierda.
7. **Horarios, contacto y mapa** — dos columnas; estilos para el aviso "Abierto ahora" (verde) o "Cerrado" (rojo) y la marca "(hoy)". El mapa ocupa todo el ancho.
8. **Pie de página y botón "volver arriba"** — el botón usa `position: fixed` para quedarse en la esquina inferior derecha.
9. **Celulares (`@media (max-width: 640px)`)** — en pantallas de 640 px o menos, las columnas se apilan, las fotos del menú se achican y el precio con el botón "Agregar" pasa debajo de la descripción. Aquí también está el **menú hamburguesa**: solo cuando `<html>` tiene la clase `js` (la pone jQuery), la lista de enlaces se oculta y aparece el botón ☰. Sin JavaScript, la navegación se sigue viendo completa.

Dos clases utilitarias:

- `[hidden] { display: none !important; }` — asegura que lo que tenga el atributo `hidden` siempre quede oculto.
- `.solo-lectores` — oculta un texto en pantalla, pero los lectores de pantalla (para personas ciegas) sí lo leen.

### 3. JavaScript con jQuery (`js/main.js`)

Todo el código arranca dentro de:

```js
$(function () {
    // ...
});
```

Esto le dice a jQuery: "ejecuta esto cuando el HTML ya esté cargado". Así nos aseguramos de que los elementos existan antes de buscarlos.

Cada funcionalidad está en su propia función, para que sea fácil de leer, modificar o desactivar (basta con borrar o comentar su llamada dentro de `$(function () { ... })`):

| Función | Qué hace | Métodos de jQuery que usa |
|---|---|---|
| `iniciarMenuCelular` | En celular, abre y cierra la lista de enlaces con el botón ☰. Se cierra al elegir una sección o con la tecla Esc. | `.slideDown()`, `.slideUp()`, `.attr('aria-expanded')` |
| `iniciarDesplazamientoSuave` | Al pulsar un enlace interno (`#menu`, `#contacto`...), la página se desliza suavemente en vez de saltar. | `.on('click')`, `.animate()`, `.offset()` |
| `iniciarNavegacionActiva` | Mientras bajas, resalta en la navegación la sección que estás viendo. | `$(window).on('scroll')`, `.addClass()`, `.removeClass()` |
| `iniciarFiltroMenu` | Muestra los botones *Todos / Comida rápida / Saludable* y filtra los platos según su `data-categoria`. | `.filter()`, `.hide()`, `.fadeIn()`, `.data()` |
| `iniciarPedido` | Agrega el botón "Agregar" a cada plato, lleva la cuenta del pedido, calcula el total, lo guarda en el navegador y arma el mensaje de WhatsApp. | `.wrap()`, `.after()`, `.empty()`, `.append()`, `$.each()`, `$.grep()`, `.prop('disabled')` |
| `iniciarEstadoHorario` | Compara la hora del visitante con los horarios y muestra "Abierto ahora" o "Cerrado en este momento". Además marca el día de hoy. | `.each()`, `.data()`, `.text()` |
| `iniciarVolverArriba` | Crea un botón ↑ que aparece al bajar 400 px y lleva al inicio de la página. | `$('<button>')`, `.appendTo()`, `.fadeIn()`, `.fadeOut()` |
| `actualizarAnio` | Escribe el año actual en el pie de página, para no tener que cambiarlo a mano cada año. | `.text()` |

Decisiones importantes:

- **La página funciona sin JavaScript.** Todo el contenido está escrito en el HTML. Los elementos que solo sirven con jQuery (los botones de filtro, el panel del pedido y el aviso de abierto/cerrado) vienen con el atributo `hidden` y jQuery los muestra con `.removeAttr('hidden')`. Si jQuery no carga, no quedan botones que no hacen nada.
- **Menos movimiento si se pide.** Si la persona configuró su sistema para reducir animaciones (`prefers-reduced-motion`), la duración de las animaciones pasa a 0.
- **Accesibilidad:** los botones de filtro usan `aria-pressed` para indicar cuál está activo, y los mensajes que cambian (resultado del filtro, estado del horario) tienen `aria-live="polite"` para que los lectores de pantalla los anuncien.
- **La clase `js` en `<html>`:** es lo primero que hace el código. Así el CSS sabe que JavaScript está funcionando y solo en ese caso esconde la navegación detrás del botón ☰.
- **Hora del visitante:** el aviso de abierto/cerrado usa la hora del dispositivo de quien visita la página. Si alguien la abre desde otro país con otra zona horaria, el resultado puede no coincidir con la hora de Colombia.

#### Cómo funciona el pedido por WhatsApp

1. **El pedido es un arreglo** de objetos `{ id, nombre, precio, cantidad }`. Cada vez que cambia, la función `dibujar()` borra la lista del panel y la vuelve a crear desde el arreglo. Así la pantalla y los datos nunca se desincronizan.
2. **El nombre y el precio salen del HTML** (`<h3>` y `data-precio`). Si cambias un precio en el HTML, el pedido lo toma automáticamente.
3. **Se guarda en `localStorage`**, un pequeño espacio del navegador. Si la persona recarga la página, su pedido sigue ahí. Solo se guardan el `id` y la `cantidad`, nunca el precio, y va dentro de `try/catch` porque en modo incógnito puede fallar. Si falla, el pedido funciona igual, pero no se recuerda al recargar.
4. **Se arma el mensaje** con una línea por plato, el total y, si los escribieron, el nombre y las notas. Luego se convierte con `encodeURIComponent()` (que transforma espacios, tildes y saltos de línea al formato de una dirección web) y se abre `https://wa.me/NUMERO?text=MENSAJE`. WhatsApp abre el chat con el texto listo y la persona solo pulsa enviar.
5. **Seguridad:** los textos se insertan con `.text()` y no con `.html()`, para que nada escrito se interprete como código.
6. **Accesibilidad:** cada botón − y + tiene `aria-label` ("Quitar una unidad de Pizza familiar"), y los cambios se anuncian en `#aviso-pedido`, que tiene `aria-live`.

No hay pago en línea ni servidor. El restaurante recibe el pedido como un mensaje normal de WhatsApp y lo confirma por ahí.

---

## Cómo hacer cambios comunes

### Agregar un plato

Copia un bloque `<article>` dentro de la sección `#menu` en `index.html` y cambia sus datos:

```html
<article class="plato" data-categoria="saludable" data-id="limonada" data-precio="6000">
    <img src="URL-DE-LA-FOTO" alt="Descripción de la foto" width="150" height="110" loading="lazy">
    <div>
        <h3>Limonada natural</h3>
        <p>Descripción corta.</p>
    </div>
    <p class="precio">$6.000</p>
</article>
```

- `data-categoria` debe coincidir con el `data-filtro` de uno de los botones (`rapida` o `saludable`).
- `data-id` debe ser **único**, en minúsculas y sin espacios ni tildes.
- `data-precio` es el precio **sin puntos ni signo $**. Debe coincidir con el precio visible.
- Ponlo **antes** del bloque `<div id="pedido">`. El botón "Agregar" aparece solo.

### Cambiar el número de WhatsApp

El número aparece en tres lugares de `index.html`. Escríbelo con el código de país (57 para Colombia) y sin espacios ni `+`:

1. `data-whatsapp="573003003000"` en `<div id="pedido">`.
2. `href="https://wa.me/573003003000"` en el botón "Escribir por WhatsApp".
3. `href="tel:+573003003000"` en "Llamar para pedir" (este sí lleva `+`).

### Poner la ubicación exacta en el mapa

1. Busca el restaurante en [Google Maps](https://maps.google.com).
2. Pulsa **Compartir** → **Insertar un mapa** → **Copiar HTML**.
3. Del código copiado, toma solo lo que está entre las comillas de `src="..."` y pégalo en el `src` del `<iframe>` de la sección `#mapa`.
4. Cambia también el `destination=` del enlace "Cómo llegar" por la dirección con la ciudad, por ejemplo `destination=Calle+1+%232-3,+Bogotá` (`%23` es el signo `#`).

### Cambiar la vista previa al compartir el enlace

Edita las etiquetas `og:` del `<head>`. Lo ideal es una foto propia de 1200 × 630 px. Cuando el sitio esté publicado, agrega `<meta property="og:url" content="https://tu-dominio.com/">`. Para ver cómo queda, usa el [depurador de Facebook](https://developers.facebook.com/tools/debug/).

### Agregar una categoría nueva

1. Agrega un botón en el bloque `.filtros` del HTML:
   ```html
   <button type="button" class="filtro" data-filtro="bebidas" aria-pressed="false">Bebidas</button>
   ```
2. Ponle `data-categoria="bebidas"` a los platos correspondientes.

No hay que tocar el JavaScript: el filtro funciona con cualquier categoría.

### Cambiar un horario

Modifica el texto visible **y** los atributos de la misma fila, usando formato de 24 horas:

```html
<div data-dias="1,2,3,4,5" data-abre="11:00" data-cierra="21:00">
    <dt>Lunes a viernes</dt>
    <dd>11:00 a. m. – 9:00 p. m.</dd>
</div>
```

Los días se numeran así: `0` domingo, `1` lunes, `2` martes, `3` miércoles, `4` jueves, `5` viernes, `6` sábado.

### Cambiar los colores

Edita las variables al inicio de `css/estilos.css`:

```css
:root {
    --color-principal: #843d29;   /* botones, precios, enlaces */
    --color-fondo: #faf7f2;       /* fondo de la página */
    ...
}
```

### Agregar tu propia funcionalidad con jQuery

1. Crea una función nueva en `js/main.js`, por ejemplo:
   ```js
   function iniciarMiFuncion() {
       $('.plato').on('click', function () {
           $(this).toggleClass('seleccionado');
       });
   }
   ```
2. Llámala dentro del bloque inicial:
   ```js
   $(function () {
       // ...
       iniciarMiFuncion();
   });
   ```
3. Si necesita estilos, agrégalos en `css/estilos.css` (por ejemplo `.plato.seleccionado { ... }`).

---

## Recursos externos

- **jQuery 3.7.1** — https://code.jquery.com (CDN oficial).
- **Google Maps** — mapa embebido y enlace "Cómo llegar" (no requieren clave de API).
- **WhatsApp** — enlaces `wa.me` para abrir un chat con un mensaje ya escrito.
- **Fotografías** — [Unsplash](https://unsplash.com), usadas como referencia. Para publicar el sitio conviene reemplazarlas por fotos propias del restaurante y guardarlas en una carpeta `img/`.
