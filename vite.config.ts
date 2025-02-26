import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'Budget Tracker',
          short_name: 'BudgetApp',
          description: 'Track your expenses and lending',
          theme_color: '#317EFB',
          background_color: '#1a1a1a',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          orientation: 'portrait',
          categories: ['finance', 'productivity'],
          icons: [
            {
              src: '/icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            }
          ]
        },
        workbox: {
          cleanupOutdatedCaches: true,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/bhuwkdzcuyydqponxssf\.supabase\.co\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'supabase-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 24 * 60 * 60
                }
              }
            }
          ]
        },
        devOptions: {
          enabled: true
        }
      })
    ],
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: {
        overlay: false
      }
    },
    preview: {
      port: 4173,
      host: '0.0.0.0'
    },
    define: {
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'process.env.VITE_SUPABASE_REDIRECT_URI': JSON.stringify(env.VITE_SUPABASE_REDIRECT_URI),
      'process.env.GMAIL_USER': JSON.stringify(env.GMAIL_USER),
      'process.env.GMAIL_PASS': JSON.stringify(env.GMAIL_PASS),
    }
  };
});
