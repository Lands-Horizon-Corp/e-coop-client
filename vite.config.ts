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

const pwaAssetManifest = () => ({
    name: 'pwa-asset-manifest',
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
  viteStaticCopy({
     targets: [
       {
         src: cMapsDir,
         dest: '',
       },
     ],
   }),
    UnheadVite(),
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    nitro({ preset: "bun" }), 
    react(),
    tsconfigPaths(),
    tailwindcss(),
    !visualizer({
      filename: "bundle-analysis.html",
      template: "treemap",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }) as PluginOption,
    {
    name: 'legal-notice',
      renderChunk(code) {
        return `/** * © 2026 Lands Horizon Corp. All Rights Reserved.
          * Unauthorized copying, modification, or distribution 
          * of this software is strictly prohibited.
          * Proprietary to e-coop-suite.
          */\n${code}`;
      }
    },
    compression({
      include: /\.(js|css|html|svg|json)$/i,
      deleteOriginalAssets: false,
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
    pwaAssetManifest(),
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
        description: 'Secure digital banking platform for Philippine cooperatives. Complete coop management solution with online banking, member portal, and analytics.',
        theme_color: '#1f2937',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['finance', 'business', 'productivity'],
        lang: 'en',
        icons: [
                {
                  src: '/e-coop-logo-1.webp',
                  sizes: '192x192',
                  type: 'image/webp',
                  purpose: 'any'
                },
                {
                  src: '/e-coop-logo-1.webp',
                  sizes: '512x512',
                  type: 'image/webp',
                  purpose: 'any'
                },
                {
                  src: '/e-coop-logo-1.webp',
                  sizes: '192x192',
                  type: 'image/webp',
                  purpose: 'maskable'
                },
                {
                  src: '/e-coop-logo-1.webp',
                  sizes: '512x512',
                   type: 'image/webp',
                  purpose: 'maskable'
                }
        ],
      },
      devOptions: { 
        enabled: false,
        type: 'module',
     }
    }),
  ],
  optimizeDeps : {
    include : []
  },
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
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 3,
      },
      mangle: {
        toplevel: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
      output: {
        manualChunks(id) {
          // Split React into its own chun
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }

          // Split React Query into its own chunk
          if (id.includes('@tanstack/react-query')) {
            return 'query-vendor';
          }

          // Split Router into its own chunk
          if (id.includes('@tanstack/router')) {
            return 'router-vendor';
          }

          // Split UI libraries
          if (id.includes('lucide-react') || id.includes('@radix-ui')) {
            return 'ui-vendor';
          }

          // Split other large libraries
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  server : {
    allowedHosts : ['e-coop-client-development.up.railway.app']
  }
});
