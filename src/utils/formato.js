// Convierte 18000 en "$18.000".
export function formatoPesos(valor) {
    return '$' + String(valor).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
