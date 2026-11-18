import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { unplugin as stylex } from "@stylexjs/unplugin";

export default defineConfig({
  resolve: { dedupe: ["react", "react-dom"] },
  optimizeDeps: {
    exclude: ["@lenso/ui", "@lenso/tokens", "@lenso/glass"],
    include: ["use-sync-external-store/shim", "use-sync-external-store/shim/with-selector"],
  },
  plugins: [
    stylex.vite({ dev: false, runtimeInjection: false, useCSSLayers: false,
      lightningcssOptions: { exclude: 4 },
      unstable_moduleResolution: { type: "commonJS", rootDir: import.meta.dirname } }),
    react(),
  ],
});
