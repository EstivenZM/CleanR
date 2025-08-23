import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // 👈 permite acceso desde la red
    port: 5173       // opcional, usa 5173 por defecto
  }
});
