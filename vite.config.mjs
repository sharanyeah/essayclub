import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Only use Replit-specific plugins in dev on Replit
const plugins = [react()];

if (process.env.NODE_ENV !== "production" && process.env.REPL_ID) {
  // Replit plugins will only load on Replit
  const runtimeErrorOverlay = require("@replit/vite-plugin-runtime-error-modal").default;
  plugins.push(runtimeErrorOverlay());
}

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
