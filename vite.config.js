import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["vite.svg", "illustr.png"],
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
            src: "/websocket-client-01/public/0fc978aba29e466e8eb4ffc946532d5e.max-1200x800.jpg",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/websocket-client-01/public/0fc978aba29e466e8eb4ffc946532d5e.max-1200x800.jpg",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/websocket-client-01/public/0fc978aba29e466e8eb4ffc946532d5e.max-1200x800.jpg",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
