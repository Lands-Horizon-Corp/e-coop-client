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

// Custom plugin to create an asset manifest for the PWA
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
  plugins: [
    // 1. Core Framework & Routing
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tsconfigPaths(),
    tailwindcss(),
    UnheadVite(),

    // 2. Static Assets & Polyfills
    viteStaticCopy({
      targets: [{ src: cMapsDir, dest: '' }],
    }),
    NodeGlobalsPolyfillPlugin({
      buffer: true,
      process: true,
    }),

    // 3. Nitro - Handles the SSR/Deployment output
    nitro({ 
      preset: "bun",
      output: { dir: '.output', publicDir: '.output/public' } 
    }), 

    // 4. PWA - Generates manifest and service worker
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
            options: {
              cacheName: 'static-chunks',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|mp4|woff2)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'media-assets',
              expiration: { maxEntries: 150, maxAgeSeconds: 60 * 60 * 24 * 60 }
            }
          },
          {
            urlPattern: ({ url }) => !url.pathname.includes('.'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
            }
          }
        ]
      },
      manifest: {
        name: 'e-coop-suite | Empowering Cooperatives',
        short_name: 'e-coop-suite',
        description: 'Secure digital banking platform for Philippine cooperatives.',
        theme_color: '#1f2937',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['finance', 'business', 'productivity'],
        lang: 'en',
        icons: [
          { src: '/e-coop-logo-1.webp', sizes: '192x192', type: 'image/webp', purpose: 'any' },
          { src: '/e-coop-logo-1.webp', sizes: '512x512', type: 'image/webp', purpose: 'any' },
          { src: '/e-coop-logo-1.webp', sizes: '192x192', type: 'image/webp', purpose: 'maskable' },
          { src: '/e-coop-logo-1.webp', sizes: '512x512', type: 'image/webp', purpose: 'maskable' }
        ],
      },
      devOptions: { enabled: false }
    }),

    // 5. Post-build Utilities
    createSitemap({
      hostname: 'https://e-coop-client.site',
      outDir: '.output/public',
      robots: [{ userAgent: '*', allow: '/' }] 
    }),
    pwaAssetManifest(),

    // 6. Finalization (Place Compression LAST to avoid ENOENT errors)
    compression({
      include: /\.(js|css|html|svg)$/i, // Removed generic .json to avoid manifest race condition
      exclude: [/\.(map)$/i, 'manifest.json', 'pwa-assets.json'],
      deleteOriginalAssets: false,
    }),

    // 7. Analysis (Optional)
    visualizer({
      filename: "bundle-analysis.html",
      template: "treemap",
      gzipSize: true,
      brotliSize: true,
    }) as PluginOption,

    {
      name: 'legal-notice',
      renderChunk(code) {
        return `/** * © 2026 Lands Horizon Corp. All Rights Reserved. */\n${code}`;
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
          if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
          if (id.includes('@tanstack')) return 'tanstack-vendor';
          if (id.includes('lucide-react') || id.includes('@radix-ui')) return 'ui-vendor';
          if (id.includes('node_modules')) return 'vendor';
        }
      }
    }
  },
  server : {
    allowedHosts : ['e-coop-client.site']
  }
});