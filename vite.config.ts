import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    server: {
      port: 3000,
      hmr: {
        overlay: false
      }
    },
    define: {
      // Expose env variables to your app
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      'process.env.VITE_SUPABASE_REDIRECT_URI': JSON.stringify(env.VITE_SUPABASE_REDIRECT_URI),
      'process.env.GMAIL_USER': JSON.stringify(env.GMAIL_USER),
      'process.env.GMAIL_PASS': JSON.stringify(env.GMAIL_PASS),
    }
  };
});
