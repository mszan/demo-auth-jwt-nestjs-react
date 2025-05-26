import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    allowedHosts: ["local.com"],
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
});
