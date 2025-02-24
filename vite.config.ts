import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  server: {
    proxy: {
      "/api": {
        target: "http://149.50.146.106:3500", // Tu servidor HTTP
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // Elimina el prefijo /api
      },
    },
  },
});
