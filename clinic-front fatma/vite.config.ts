import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': '/src' } },
  server: {
    port: 5173,
    proxy: {
      // All /api/* paths → Spring Boot API Gateway on :8080
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // Do NOT rewrite — paths already include /api
      },
    },
  },
});
