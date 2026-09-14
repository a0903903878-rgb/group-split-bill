import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fullstackVitePreset } from '@lark-apaas/fullstack-presets/vite';

export default defineConfig(() => {
  return {
    plugins: [react(), fullstackVitePreset()],
    resolve: {
      alias: {
        '@client': path.resolve(__dirname, './client'),
        '@shared': path.resolve(__dirname, './shared'),
      },
    },
    server: {
      port: 8080,
      host: '0.0.0.0',
    },
    build: {
      outDir: 'dist/client',
      emptyOutDir: true,
    },
  };
});
