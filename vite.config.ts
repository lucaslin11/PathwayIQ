import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { formatOverridesPlugin } from "./export-plugins/format-overrides-plugin.ts";
import { mediaAssetsPlugin } from "./export-plugins/media-assets-plugin.ts";

export default defineConfig(({ mode, isSsrBuild }) => ({
   base: './',
  envPrefix: ["VITE_", "SITE_"],
  plugins: [
    react(),
    formatOverridesPlugin(),
    mediaAssetsPlugin()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"), // Maps your shortcuts straight to your root files
    },
  },
}));
