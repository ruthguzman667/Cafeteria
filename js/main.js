/* ==========================================================================
   Restaurante Sabor Casero - Funcionalidad con jQuery
   Cada bloque es independiente: si uno falla, la página sigue funcionando
   porque todo el contenido ya está escrito en el HTML.
   ========================================================================== */

// $(function () { ... }) espera a que el HTML esté cargado antes de ejecutarse.
$(function () {
    // Marca que JavaScript está activo. El CSS usa esta clase para el menú de celular.
    $('html').addClass('js');

    // Si la persona pidió menos animaciones en su sistema, se respetan.
    var reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var duracion = reducirMovimiento ? 0 : 500;

    iniciarMenuCelular(duracion);
    iniciarHeaderFijo();
    iniciarDesplazamientoSuave(duracion);
    iniciarNavegacionActiva();
    iniciarFiltroMenu(duracion);
    iniciarPedido(duracion);
    iniciarEstadoHorario();
    iniciarVolverArriba(duracion);
    actualizarAnio();
});

/* --------------------------------------------------------------------------
   1. Menú hamburguesa en celulares
   -------------------------------------------------------------------------- */
function iniciarMenuCelular(duracion) {
    var $boton = $('.boton-menu');
    var $lista = $('#menu-principal');
    // Debe coincidir con el @media del CSS.
    var celular = window.matchMedia('(max-width: 640px)');

    function abrir() {
        $boton.attr('aria-expanded', 'true');
        // hide() evita un salto; slideDown lo despliega con animación.
        $lista.hide().addClass('abierta').slideDown(duracion / 2, function () {
            $lista.removeAttr('style');
        });
    }

    function cerrar(animar) {
        $boton.attr('aria-expanded', 'false');
        $lista.slideUp(animar ? duracion / 2 : 0, function () {
            $lista.removeClass('abierta').removeAttr('style');
        });
    }

    $boton.on('click', function () {
        if ($boton.attr('aria-expanded') === 'true') {
            cerrar(true);
        } else {
            abrir();
        }
    });

    // Al elegir una sección, el menú se cierra para dejar ver el contenido.
    $lista.on('click', 'a', function () {
        if (celular.matches) {
            cerrar(false);
        }
    });

    // La tecla Esc cierra el menú y devuelve el foco al botón.
    $(document).on('keydown', function (evento) {
        if (evento.key === 'Escape' && $boton.attr('aria-expanded') === 'true') {
            cerrar(true);
            $boton.trigger('focus');
        }
    });

    // Si la pantalla pasa a tamaño computador, se limpia el estado del menú.
    celular.addEventListener('change', function () {
        $boton.attr('aria-expanded', 'false');
        $lista.stop(true, true).removeClass('abierta').removeAttr('style');
    });
}

/* --------------------------------------------------------------------------
   Encabezado fijo (solo en pantallas grandes; el CSS lo pega arriba con sticky)
   -------------------------------------------------------------------------- */
function iniciarHeaderFijo() {
    var $header = $('header');
    var $titulo = $header.find('.cabecera-fila');

    // Con un "top" negativo, el nombre del restaurante se va con el scroll
    // y solo queda pegada a la parte de arriba la navegación.
    function ajustar() {
        var oculto = parseFloat($header.css('padding-top')) + $titulo.outerHeight(true);
        //$header.css('top', -oculto + 'px');
    }

    ajustar();
    $(window).on('resize load', ajustar);
}

// Altura del encabezado que queda a la vista mientras se hace scroll.
// En celular el encabezado no es fijo, así que devuelve 0.
function alturaHeaderFijo() {
    var $header = $('header');
    if ($header.css('position') !== 'sticky') {
        return 0;
    }
    return $header.outerHeight() + parseFloat($header.css('top'));
}

/* --------------------------------------------------------------------------
   2. Desplazamiento suave al pulsar enlaces internos (#menu, #contacto...)
   -------------------------------------------------------------------------- */
function iniciarDesplazamientoSuave(duracion) {
    $('a[href^="#"]').on('click', function (evento) {
        var destino = $(this.getAttribute('href'));

        // Si el destino no existe, se deja el comportamiento normal del enlace.
        if (!destino.length) {
            return;
        }

        evento.preventDefault();
        $('html, body').stop().animate({ scrollTop: destino.offset().top - alturaHeaderFijo() - 20 }, duracion, function () {
            // Actualiza la dirección (#seccion) y mueve el foco para teclado y lectores de pantalla.
            history.pushState(null, '', '#' + destino.attr('id'));
            destino.attr('tabindex', '-1').trigger('focus');
        });
    });
}

/* --------------------------------------------------------------------------
   3. Resalta en la navegación la sección que se está viendo
   -------------------------------------------------------------------------- */
function iniciarNavegacionActiva() {
    var $enlaces = $('nav a');

    function marcarSeccion() {
        var posicion = $(window).scrollTop() + $(window).height() / 3;
        var actual = null;

        $enlaces.each(function () {
            var $seccion = $($(this).attr('href'));
            if ($seccion.length && $seccion.offset().top <= posicion) {
                actual = this;
            }
        });

        // Al llegar al final de la página se marca el último enlace (Contacto),
        // porque esa sección puede ser muy corta para llegar a la posición de referencia.
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 2) {
            actual = $enlaces.last()[0];
        }

        $enlaces.removeClass('activo').removeAttr('aria-current');
        if (actual) {
            $(actual).addClass('activo').attr('aria-current', 'location');
        }
    }

    $(window).on('scroll resize', marcarSeccion);
    marcarSeccion();
}

/* --------------------------------------------------------------------------
   4. Filtro del menú por categoría (usa el atributo data-categoria)
   -------------------------------------------------------------------------- */
function iniciarFiltroMenu(duracion) {
    var $filtros = $('.filtros');
    var $platos = $('.plato');

    // Los botones están ocultos en el HTML; solo se muestran si jQuery cargó.
    $filtros.removeAttr('hidden');

    function marcarUltimoVisible() {
        $platos.removeClass('ultimo-visible');
        $platos.filter(':visible').last().addClass('ultimo-visible');
    }

    $filtros.on('click', '.filtro', function () {
        var categoria = $(this).data('filtro');

        $filtros.find('.filtro').attr('aria-pressed', 'false');
        $(this).attr('aria-pressed', 'true');

        var $mostrar = categoria === 'todos' ? $platos : $platos.filter('[data-categoria="' + categoria + '"]');

        $platos.not($mostrar).stop(true, true).hide();
        $mostrar.stop(true, true).fadeIn(duracion);
        marcarUltimoVisible();

        // Anuncia el resultado a quienes usan lector de pantalla.
        $('#resultado-filtro').text('Mostrando ' + $mostrar.length + ' plato(s).');
    });

    marcarUltimoVisible();
}

/* --------------------------------------------------------------------------
   5. Pedido por WhatsApp
   El pedido se guarda en un arreglo: [{ id, nombre, precio, cantidad }, ...]
   Los precios siempre se leen del HTML (data-precio), nunca de lo guardado,
   para que un cambio de precio en la página se refleje en el pedido.
   -------------------------------------------------------------------------- */
function iniciarPedido(duracion) {
    var CLAVE_GUARDADO = 'saborCaseroPedido';
    var $panel = $('#pedido');
    var $lista = $panel.find('.pedido-lista');
    var $aviso = $('#aviso-pedido');
    var pedido = [];

    // Muestra el panel (viene oculto en el HTML).
    $panel.removeAttr('hidden');

    // Convierte 18000 en "$18.000".
    function formatoPesos(valor) {
        return '$' + String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    // Busca en el HTML los datos de un plato por su data-id.
    function datosPlato(id) {
        var $plato = $('.plato[data-id="' + id + '"]');
        if (!$plato.length) {
            return null;
        }
        return {
            id: id,
            nombre: $plato.find('h3').text(),
            precio: Number($plato.data('precio'))
        };
    }

    function buscar(id) {
        for (var i = 0; i < pedido.length; i++) {
            if (pedido[i].id === id) {
                return pedido[i];
            }
        }
        return null;
    }

    function totalPlatos() {
        return pedido.reduce(function (suma, item) { return suma + item.cantidad; }, 0);
    }

    function totalPesos() {
        return pedido.reduce(function (suma, item) { return suma + item.precio * item.cantidad; }, 0);
    }

    // localStorage guarda el pedido en el navegador para que no se pierda al recargar.
    // try/catch: en modo incógnito o con el almacenamiento bloqueado puede fallar.
    function guardar() {
        try {
            localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(pedido.map(function (item) {
                return { id: item.id, cantidad: item.cantidad };
            })));
        } catch (error) {
            // Sin almacenamiento el pedido funciona igual, solo que no se recuerda.
        }
    }

    function cargar() {
        try {
            var guardado = JSON.parse(localStorage.getItem(CLAVE_GUARDADO)) || [];
            $.each(guardado, function (i, item) {
                var plato = datosPlato(item.id);
                var cantidad = parseInt(item.cantidad, 10);
                // Se ignoran platos que ya no existen en el menú o cantidades inválidas.
                if (plato && cantidad > 0) {
                    plato.cantidad = cantidad;
                    pedido.push(plato);
                }
            });
        } catch (error) {
            pedido = [];
        }
    }

    // Vuelve a dibujar la lista del pedido a partir del arreglo.
    function dibujar() {
        $lista.empty();

        $.each(pedido, function (i, item) {
            // .text() inserta el texto tal cual, sin interpretarlo como HTML.
            var $fila = $('<li class="pedido-item"></li>').attr('data-id', item.id);
            $('<span class="pedido-nombre"></span>').text(item.nombre).appendTo($fila);

            var $cantidad = $('<div class="cantidad"></div>').appendTo($fila);
            $('<button type="button" data-accion="restar">&minus;</button>')
                .attr('aria-label', 'Quitar una unidad de ' + item.nombre)
                .appendTo($cantidad);
            $('<span></span>').text(item.cantidad).appendTo($cantidad);
            $('<button type="button" data-accion="sumar">+</button>')
                .attr('aria-label', 'Agregar una unidad de ' + item.nombre)
                .appendTo($cantidad);

            $('<span class="pedido-subtotal"></span>')
                .text(formatoPesos(item.precio * item.cantidad))
                .appendTo($fila);

            $lista.append($fila);
        });

        var vacio = pedido.length === 0;
        $panel.find('.pedido-vacio').toggle(vacio);
        $panel.find('.pedido-total strong').text(formatoPesos(totalPesos()));
        $panel.find('.boton-whatsapp, .vaciar-pedido').prop('disabled', vacio);

        actualizarBotonFlotante();
        guardar();
    }

    // Cambia la cantidad de un plato; si llega a 0 se quita del pedido.
    function cambiarCantidad(id, cambio) {
        var item = buscar(id);

        if (!item && cambio > 0) {
            item = datosPlato(id);
            item.cantidad = 0;
            pedido.push(item);
        }
        if (!item) {
            return;
        }

        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            pedido = $.grep(pedido, function (otro) { return otro.id !== id; });
            $aviso.text(item.nombre + ' se quitó del pedido.');
        } else {
            $aviso.text(item.nombre + ': ' + item.cantidad + '. Total ' + formatoPesos(totalPesos()) + '.');
        }

        dibujar();
    }

    // --- Botón "Agregar" en cada plato ---
    $('.plato').each(function () {
        var $plato = $(this);
        var $boton = $('<button type="button" class="agregar">Agregar</button>')
            .attr('aria-label', 'Agregar ' + $plato.find('h3').text() + ' al pedido');

        // Se agrupa el precio con el botón para que queden juntos en la cuadrícula.
        $plato.find('.precio').wrap('<div class="plato-compra"></div>').after($boton);
    });

    $('#menu').on('click', '.agregar', function () {
        var $boton = $(this);
        cambiarCantidad($boton.closest('.plato').data('id'), 1);

        // Confirmación visual breve.
        $boton.text('Agregado ✓').addClass('agregado');
        clearTimeout($boton.data('temporizador'));
        $boton.data('temporizador', setTimeout(function () {
            $boton.text('Agregar').removeClass('agregado');
        }, 1200));
    });

    // --- Botones + y − dentro del panel ---
    $lista.on('click', 'button', function () {
        var accion = $(this).data('accion');
        var id = $(this).closest('.pedido-item').data('id');

        cambiarCantidad(id, accion === 'sumar' ? 1 : -1);

        // Al redibujar se pierden los botones; se devuelve el foco al mismo botón
        // o, si el plato se quitó, al título del pedido.
        var $mismo = $lista.find('.pedido-item[data-id="' + id + '"] [data-accion="' + accion + '"]');
        if ($mismo.length) {
            $mismo.trigger('focus');
        } else {
            $('#titulo-pedido').attr('tabindex', '-1').trigger('focus');
        }
    });

    $panel.find('.vaciar-pedido').on('click', function () {
        if (window.confirm('¿Quieres vaciar el pedido?')) {
            pedido = [];
            $aviso.text('El pedido quedó vacío.');
            dibujar();
            $('#titulo-pedido').attr('tabindex', '-1').trigger('focus');
        }
    });

    // --- Enviar por WhatsApp ---
    $panel.find('.boton-whatsapp').on('click', function () {
        if (!pedido.length) {
            return;
        }

        var lineas = ['Hola, quiero hacer un pedido:', ''];
        $.each(pedido, function (i, item) {
            lineas.push('• ' + item.cantidad + ' x ' + item.nombre + ' — ' + formatoPesos(item.precio * item.cantidad));
        });
        lineas.push('', 'Total: ' + formatoPesos(totalPesos()));

        var nombre = $.trim($('#pedido-nombre').val());
        var notas = $.trim($('#pedido-notas').val());
        if (nombre) {
            lineas.push('Nombre: ' + nombre);
        }
        if (notas) {
            lineas.push('Notas: ' + notas);
        }

        // encodeURIComponent convierte espacios, tildes y saltos de línea al formato de una URL.
        var url = 'https://wa.me/' + $panel.data('whatsapp') + '?text=' + encodeURIComponent(lineas.join('\n'));
        window.open(url, '_blank', 'noopener');
    });

    // --- Botón flotante con el resumen ---
    var $flotante = $('<button type="button" class="boton-pedido"></button>').hide().appendTo('body');

    function actualizarBotonFlotante() {
        var cantidad = totalPlatos();
        if (cantidad > 0) {
            $flotante.text('Ver pedido (' + cantidad + ') · ' + formatoPesos(totalPesos())).fadeIn(200);
        } else {
            $flotante.fadeOut(200);
        }
    }

    $flotante.on('click', function () {
        $('html, body').stop().animate({ scrollTop: $panel.offset().top - alturaHeaderFijo() - 20 }, duracion, function () {
            $('#titulo-pedido').attr('tabindex', '-1').trigger('focus');
        });
    });

    cargar();
    dibujar();
}

/* --------------------------------------------------------------------------
   6. Aviso de "Abierto ahora" / "Cerrado" y resaltado del día actual
   Cada fila del horario tiene data-dias (0 = domingo ... 6 = sábado),
   data-abre y data-cierra en formato de 24 horas (HH:MM).
   -------------------------------------------------------------------------- */
function iniciarEstadoHorario() {
    var ahora = new Date();
    var hoy = ahora.getDay();
    var minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
    var abierto = false;

    function aMinutos(hora) {
        var partes = hora.split(':');
        return parseInt(partes[0], 10) * 60 + parseInt(partes[1], 10);
    }

    $('.horarios [data-dias]').each(function () {
        var $fila = $(this);
        var dias = String($fila.data('dias')).split(',').map(Number);

        if (dias.indexOf(hoy) === -1) {
            return;
        }

        $fila.addClass('hoy');
        abierto = minutosAhora >= aMinutos($fila.data('abre')) && minutosAhora < aMinutos($fila.data('cierra'));
    });

    $('#estado-horario')
        .text(abierto ? 'Abierto ahora' : 'Cerrado en este momento')
        .addClass(abierto ? 'abierto' : 'cerrado')
        .removeAttr('hidden');
}

/* --------------------------------------------------------------------------
   7. Botón "volver arriba": aparece después de bajar un poco
   -------------------------------------------------------------------------- */
function iniciarVolverArriba(duracion) {
    var $boton = $('<button type="button" class="volver-arriba" aria-label="Volver arriba">&uarr;</button>');
    $boton.hide().appendTo('body');

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 400) {
            $boton.fadeIn(200);
        } else {
            $boton.fadeOut(200);
        }
    });

    $boton.on('click', function () {
        $('html, body').stop().animate({ scrollTop: 0 }, duracion);
        $('h1').attr('tabindex', '-1').trigger('focus');
    });
}

/* --------------------------------------------------------------------------
   8. Año del pie de página siempre actualizado
   -------------------------------------------------------------------------- */
function actualizarAnio() {
    $('#anio').text(new Date().getFullYear());
}
