import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import manifestSRI from "vite-plugin-manifest-sri";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, type PluginOption } from "vite";
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import viteImagemin from 'vite-plugin-imagemin'
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
        viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 20,
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      }),
    ],
    build: {
        sourcemap: false,
        rollupOptions: {
            output: {
                advancedChunks: {
                    groups: [{ name: 'vendor', test: /\/react(?:-dom)?/ }],
                },
            },
        },
    },
    // define: {
    //     "process.env": process.env,
    // },
});
