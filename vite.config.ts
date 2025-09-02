import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import manifestSRI from "vite-plugin-manifest-sri";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, type PluginOption } from "vite";
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression2'
import UnheadVite from '@unhead/addons/vite'


// https://vite.dev/config/
export default defineConfig({
    plugins: [
        UnheadVite(),
        manifestSRI(),
        tanstackRouter({ target: 'react', autoCodeSplitting: true }),
        react(),
        tsconfigPaths(),
        tailwindcss(),
        visualizer({
            filename: "bundle-analysis.html",
            template: "treemap",
            open: true,
            gzipSize: true,
            brotliSize: true,
        }) as PluginOption,
       compression(),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return "vendor";
            }
          }
        }
      }
    }
    // define: {
    //     "process.env": process.env,
    // },
});
