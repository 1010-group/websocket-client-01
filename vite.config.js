import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const manifest = {
  name: "Mars Chat",
  short_name: "Mars Chat",
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#8936FF",
  icons: [
    {
      src: "/logo.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any"
    },
    {
      src: "/icon512_maskable.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable"
    }
  ],
  version: "1.0.0"
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // ✅ faqat plugin, postcss keremas
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      manifest,
      devOptions: {
        enabled: true
      },
      injectManifest: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2,woff,ttf}'
        ],
        rollupFormat: 'iife',
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024
      }
    })
  ],
  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,
    hmr: true,
    proxy: {
      '/socket.io': {
        target: 'https://websocket-server-01.onrender.com',
        changeOrigin: true,
        ws: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  }
});
