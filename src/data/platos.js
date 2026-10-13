/* ==========================================================================
   Platos del menú
   - id: único, en minúsculas y sin espacios ni tildes (se usa en el pedido).
   - categoria: debe coincidir con el "valor" de uno de los filtros.
   - precio: sin puntos ni signo $. El texto "$18.000" se arma solo.
   ========================================================================== */

export const filtros = [
    { valor: 'todos', texto: 'Todos' },
    { valor: 'rapida', texto: 'Comida rápida' },
    { valor: 'saludable', texto: 'Saludable' }
];

export const platos = [
    {
        id: 'hamburguesa',
        nombre: 'Hamburguesa especial',
        descripcion: 'Pan artesanal, carne, queso, tomate y lechuga.',
        categoria: 'rapida',
        precio: 18000,
        imagen: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=450&q=80',
        alt: 'Hamburguesa con queso, tomate y lechuga'
    },
    {
        id: 'pizza',
        nombre: 'Pizza familiar',
        descripcion: 'Pizza con queso y diferentes ingredientes para compartir.',
        categoria: 'rapida',
        precio: 35000,
        imagen: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=450&q=80',
        alt: 'Pizza horneada con queso y diferentes ingredientes'
    },
    {
        id: 'ensalada',
        nombre: 'Ensalada',
        descripcion: 'Ensalada fresca con vegetales.',
        categoria: 'saludable',
        precio: 12000,
        imagen: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=450&q=80',
        alt: 'Ensalada de vegetales frescos en un recipiente'
    }
];
