import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Enable code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'vendor-react': ['react', 'react-dom'],
          'vendor-lasereyes': ['@omnisat/lasereyes-react', '@omnisat/lasereyes-core'],
        },
      },
    },
    // Set a reasonable chunk size warning limit
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 5173,
  },
  // Enable source maps for debugging in development
  css: {
    devSourcemap: true,
  },
});
