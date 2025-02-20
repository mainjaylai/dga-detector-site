import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/dga-detector-site/',
  build: {
    copyPublicDir: true,
  },
  server: {
    headers: {
      "*.json": {
        "Content-Type": "application/json",
      },
      "*.bin": {
        "Content-Type": "application/octet-stream",
      },
    },
  },
});
