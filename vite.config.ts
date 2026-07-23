import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { formatOverridesPlugin } from "./export-plugins/format-overrides-plugin.ts";
import { mediaAssetsPlugin } from "./export-plugins/media-assets-plugin.ts";

export default defineConfig(() => ({
  base: "/PathwayIQ/",
  envPrefix: ["VITE_", "SITE_"],
  plugins: [
    react({ babel: { plugins: [] } }),
    mediaAssetsPlugin(),
    formatOverridesPlugin(__dirname)
  ],
  resolve: {
    dedupe: ["react", "react-dom", "react-router-dom"],
    alias: {
      nothing: "./fallbacks/missingModule.ts",
      "@": path.resolve(__dirname, "./")
    }
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "motion/react"]
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    copyPublicDir: true
  }
}));
