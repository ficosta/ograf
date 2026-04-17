import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
    // Source maps off in production to avoid shipping the full source to the CDN.
    // Flip to 'hidden' once error tracking is wired up.
    sourcemap: false,
  },
});
