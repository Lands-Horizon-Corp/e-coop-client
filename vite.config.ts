import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, normalizePath, type PluginOption } from "vite";
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression2'
import UnheadVite from '@unhead/addons/vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import createSitemap from 'vite-plugin-sitemap';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'node:fs';
import path from 'node:path';
import { nitro } from "nitro/vite"; 
import { createRequire } from 'node:module';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const require = createRequire(import.meta.url);
const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
const cMapsDir = normalizePath(path.join(pdfjsDistPath, 'cmaps'));
const pdfWorkerPath = normalizePath(path.join(pdfjsDistPath, 'build', 'pdf.worker.min.mjs'));

const pwaAssetManifest = () => ({
    name: 'pwa-asset-manifest',
    apply: 'build' as const,
    closeBundle() {
        const distDir = path.resolve(__dirname, '.output/public') 
        if (!fs.existsSync(distDir)) return
        const files = fs.readdirSync(distDir, { recursive: true })
            .filter((file) => /\.(js|css|html|ico|png|svg|jpg|jpeg|webp|mp4|woff2)$/.test(file as string))
            .map(file => `/${(file as string).replace(/\\/g, '/')}`)

        fs.writeFileSync(path.join(distDir, 'pwa-assets.json'), JSON.stringify(files))
    }
})

export default defineConfig({
  base: '/',
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    nitro({ 
        preset: "bun",
    }), 
    react(),
    tsconfigPaths(),
    tailwindcss(),
    UnheadVite(),
    viteStaticCopy({
      targets: [
        { src: cMapsDir, dest: 'cmaps' }, // It's usually safer to put cmaps in a subfolder
        { src: pdfWorkerPath, dest: '' }  // This drops the worker right into your root output
      ],
    }),
    NodeGlobalsPolyfillPlugin({
      buffer: true,
      process: true,
    }),
    createSitemap({
      hostname: 'https://e-coop-client.site',
      outDir: '.output/public',
      robots: [{ userAgent: '*', allow: '/' }] 
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globDirectory: '.output/public', 
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,mp4,woff2}'],
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
        runtimeCaching:  [
          {
            urlPattern: /\.(?:js|css)$/i,
            handler: 'CacheFirst',
            options: { cacheName: 'static-chunks' }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|mp4|woff2)$/i,
            handler: 'CacheFirst',
            options: { cacheName: 'media-assets' }
          }
        ]
      },
      manifest: {
        name: 'e-coop-suite',
        short_name: 'e-coop-suite',
        theme_color: '#1f2937',
        display: 'standalone',
        icons: [
          { src: '/e-coop-logo-1.webp', sizes: '192x192', type: 'image/webp' },
          { src: '/e-coop-logo-1.webp', sizes: '512x512', type: 'image/webp' }
        ],
      }
    }),
    pwaAssetManifest(),
  
    compression({
      include: [/\.(js|css|html)$/i, /assets\/.*\.svg$/i], 
      exclude: [/\.(map)$/i, 'manifest.json', 'pwa-assets.json'],
      deleteOriginalAssets: false,
    }),

    visualizer({
      filename: "bundle-analysis.html",
      template: "treemap",
      gzipSize: true,
    }) as PluginOption,
    {
      name: 'legal-notice',
      renderChunk(code) {
        return `/** © 2026 Lands Horizon Corp. */\n${code}`;
      }
    },
  ],
  resolve: {
    alias: {
      stream: "stream-browserify",
      crypto: "crypto-browserify",
    },
  },
  build: {
    outDir: '.output/public',
    emptyOutDir: true,
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
      output: {
        manualChunks(id) {
          if (id.includes('react')) return 'react-vendor';
          if (id.includes('@tanstack')) return 'tanstack-vendor';
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  },
  server : {
    allowedHosts : ['e-coop-client-development.up.railway.app']
  }
});