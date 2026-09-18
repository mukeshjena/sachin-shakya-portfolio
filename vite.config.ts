import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      // Manifest and icons will be finalized in Step 26
      manifest: {
        name: "Sachin Shakya — AI-Native CloudOps Lead",
        short_name: "Sachin Shakya",
        description:
          "Portfolio of Sachin Shakya — AI-Native CloudOps Technical Lead with ~9 years of Azure/AWS, FinOps, and SRE expertise.",
        theme_color: "#0a0e1a",
        background_color: "#0a0e1a",
        display: "standalone",
        orientation: "portrait-primary",
        start_url: "/",
        icons: [], // Icons added in Step 26
      },
      devOptions: {
        enabled: false, // Enable in Step 26 when icons are ready
      },
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules/three")) {
            return "three";
          }
          if (id.includes("node_modules/framer-motion")) {
            return "framer";
          }
          if (id.includes("node_modules/firebase") || id.includes("node_modules/@firebase")) {
            return "firebase";
          }
        },
      },
    },
  },
});
