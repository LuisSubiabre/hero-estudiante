import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  server: {
    proxy: {
      "/api": {
        target: "http://149.50.146.106:3500", // Tu API sin HTTPS
        changeOrigin: true,
        secure: false, // Permite HTTP en lugar de HTTPS
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
