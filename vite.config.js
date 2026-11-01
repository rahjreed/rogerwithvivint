import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { VitePWA } from 'vite-plugin-pwa';
import { pwaOptions } from './src/pwa-config.js';

export default defineConfig({
  plugins: [react(), {
    name: 'truck-html-alias',
    enforce: 'post',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        if (/^\/truck(?:\?|$)/.test(request.url || '')) {
          request.url = request.url.replace(/^\/truck/, '/truck/index.html');
        }
        next();
      });
    },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const truck = bundle['truck/index.html'];
        if (truck?.type === 'asset') {
          // Serve both clean-URL and directory-index conventions from the same source.
          this.emitFile({ type: 'asset', fileName: 'truck.html', source: truck.source });
        }
      },
    },
  }, VitePWA(pwaOptions)],
  build: {
    rollupOptions: {
      input: {
        hub: fileURLToPath(new URL('./index.html', import.meta.url)),
        truck: fileURLToPath(new URL('./truck/index.html', import.meta.url)),
      },
    },
  },
});
