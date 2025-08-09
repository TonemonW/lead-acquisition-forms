// vite.config.widget.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'public/widget',
    emptyOutDir: true,

    lib: {
      entry: './src/main-widget.tsx',
      name: 'LeadFormWidget',
      fileName: () => `lead-form-widget.js`,
      formats: ['umd'],
    },
    rollupOptions: {
      // external: ['react', 'react-dom'],
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
      },
    },
  },
})
