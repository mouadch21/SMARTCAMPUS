/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// En dev, les appels /api sont relayés vers le backend Spring Boot (port 8082).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { "/api": { target: "http://localhost:8082", changeOrigin: true } } },
  test: { globals: true, environment: "jsdom", setupFiles: "./src/test/setup.ts", css: false },
});
