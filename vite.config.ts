import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React stays small and shared by every route
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // Charts are heavy and only needed on analytics pages
          "charts": ["recharts"],
          // Animation lib used across pages
          "motion": ["framer-motion"],
          // Backend SDK
          "supabase": ["@supabase/supabase-js"],
          // Form/builder utilities
          "dnd": ["@dnd-kit/core", "@dnd-kit/sortable"],
        },
      },
    },
  },
}));
