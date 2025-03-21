import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    host: '0.0.0.0', // Permite conexiones externas
    port: 3000, // El puerto en el que se ejecuta la aplicación
    strictPort: true, // Asegura que el puerto no se cambie
  },
});
