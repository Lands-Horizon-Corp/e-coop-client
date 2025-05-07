import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import manifestSRI from "vite-plugin-manifest-sri";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, type PluginOption } from "vite";
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        manifestSRI(),
        TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
        react(),
        tsconfigPaths(),
        visualizer({
            filename: "bundle-analysis.html",
            template: "treemap",
            open: true,
            gzipSize: true,
            brotliSize: true,
        }) as PluginOption,
    ],
    build: {
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"],
                },
            },
        },
    },
    define: {
        "process.env": process.env,
    },
});
