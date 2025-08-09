import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    root: 'src/iframe',
    base: './',
    publicDir: '../../public',
    plugins: [react()],
    build: {
        outDir: '../../public/iframe',
        emptyOutDir: true,
        copyPublicDir: false,
        rollupOptions: {
            input: 'src/iframe/index.html',
        },
    },
});
