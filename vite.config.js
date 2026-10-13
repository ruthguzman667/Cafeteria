import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    // Rutas relativas: el sitio funciona en cualquier carpeta del servidor
    // (por ejemplo, GitHub Pages en /Cafeteria/).
    base: './'
});
