import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  // Use the repo name for GitHub Pages or './' for relative paths
  base: '/Smart-Lab-Management/', 
  
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // Helps with performance on mobile/tablet devices
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router'],
          ui: ['lucide-react', '@mui/material', '@emotion/react'],
        },
      },
    },
  },

  assetsInclude: ['**/*.svg', '**/*.csv'],

  server: {
    // Useful for testing on physical mobile devices in the same Wi-Fi
    host: true, 
    port: 5173,
  },
})