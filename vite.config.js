import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // proxy: {
  //   '/socket.io': {
  //     target: 'http://192.168.81.148:5000',
  //     ws: true,
  //   },
  // },
});
