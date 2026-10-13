/* ==========================================================================
   Datos de contacto del restaurante
   Los números de WhatsApp van con el código de país (57) y sin espacios ni +.
   ========================================================================== */

export const restaurante = {
    nombre: 'Restaurante Sabor Casero',
    direccion: 'Calle 1 # 2 - 3',
    telefonoVisible: '300 300 3000',
    // Para el enlace "Llamar para pedir" (este sí lleva +).
    telefono: '+573003003000',
    // Botón "Escribir por WhatsApp" de la sección Contacto.
    whatsappContacto: '573003003000',
    // Número que recibe los pedidos armados en la página.
    whatsappPedidos: '573052778896',
    // Enlace "Cómo llegar" (%23 es el signo #).
    comoLlegar: 'https://www.google.com/maps/dir/?api=1&destination=Calle+1+%232-3',
    // Para la ubicación exacta: Google Maps → Compartir → Insertar un mapa → copiar el src.
    mapa: 'https://www.google.com/maps?q=Calle+1+%232-3&output=embed'
};
