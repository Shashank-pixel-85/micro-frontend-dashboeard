import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'auth',
      filename: 'remoteEntry.js',
      exposes: { './Auth': './src/Auth.jsx' },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
  server: { port: 3001 },
  build: { target: 'esnext' },
});
