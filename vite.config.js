import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,
    hmr: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      filename: "sw.js",           // bu dist ichiga chiqadi
      strategies: "injectManifest",
      injectManifest: {
        swSrc: "src/sw.js",        // bu manba service worker
        swDest: "sw.js",           // build natijasida
      },
      manifest: {
        name: "WebSocket Chat",
        short_name: "Chat",
        description: "PWA чат с WebSocket, ролями, звонками",
        theme_color: "#111827",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "http://localhost:5173/public/asd.jpg",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "http://localhost:5173/public/asd.jpg",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "http://localhost:5173/public/asd.jpg",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
