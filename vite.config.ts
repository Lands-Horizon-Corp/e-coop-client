import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
// import manifestSRI from "vite-plugin-manifest-sri"; // Temporarily disabled due to plugin issue
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, type PluginOption } from "vite";
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import { compression } from 'vite-plugin-compression2'
import UnheadVite from '@unhead/addons/vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';
import createSitemap from 'vite-plugin-sitemap';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        UnheadVite(),
        // manifestSRI(), // Temporarily disabled due to plugin issue
        tanstackRouter({ target: 'react',autoCodeSplitting: true  }),
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
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
        createSitemap({
          hostname: 'https://ecoop-suite.com'
        }),
        VitePWA({
          registerType: 'autoUpdate',
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
            navigateFallback: '/index.html',
            navigateFallbackDenylist: [/^\/api\//],
            maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB limit
            skipWaiting: true,
            clientsClaim: true,
            // Reduce warnings in development
            globIgnores: ['**/node_modules/**/*', 'sw.js', 'workbox-*.js'],
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                  }
                }
              },
              {
                urlPattern: /^https:\/\/api\.ecoop-suite\.com\/.*/i,
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'api-cache',
                  networkTimeoutSeconds: 10,
                  expiration: {
                    maxEntries: 100,
                    maxAgeSeconds: 60 * 60 * 24 // 1 day
                  }
                }
              },
              {
                urlPattern: /^\/assets\/vendor-.*\.js$/,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'vendor-cache',
                  expiration: {
                    maxEntries: 5,
                    maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
                  }
                }
              },
              {
                urlPattern: /^\/assets\/.*\.(js|css)$/,
                handler: 'StaleWhileRevalidate',
                options: {
                  cacheName: 'assets-cache',
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
                  }
                }
              }
            ]
          },
          includeAssets: ['favicon.ico', 'e-coop-logo-*.webp', 'og-image.png'],
          manifest: {
            name: 'e-coop-suite | Empowering Cooperatives',
            short_name: 'e-coop-suite',
            description: 'Secure digital banking platform for Philippine cooperatives. Complete coop management solution with online banking, member portal, and analytics.',
            theme_color: '#1f2937',
            background_color: '#ffffff',
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
            ]
          }
        }),
    ],
    resolve: {
      alias: {
        stream: "stream-browserify",
        crypto: "crypto-browserify",
      },
    },
    build: {
      rollupOptions: {
        plugins: [rollupNodePolyFill()],
        output: {
          manualChunks(id) {
            // Split React into its own chunk
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
});
