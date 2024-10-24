import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
// import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'

export default defineConfig(({ mode }) => {
  return {
    assetsInclude: ['**/*.yaml', '**/*.geojson', "data/**"],
    plugins: [
      vue(),
      // Compression for production builds
      viteCompression({ algorithm: 'gzip' }),

      // Visualizer to analyze bundle size (optional, useful for optimizing build)
      // mode === 'production' && visualizer(),
    ],

    // Set the base URL for production
    // base: mode === 'production' ? '/production-base/' : '/',

    // Optimize the build
    build: {
      // Output directory for production builds
      outDir: 'dist',

      // Optimize chunk size for performance (code splitting)
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          },
        },
      },

      // Minify JavaScript and CSS
      minify: 'terser',

      // Source maps only in non-production environments
      // sourcemap: mode !== 'production',
      sourcemap: true,

      // Brotli compression for modern browsers
      brotliSize: true,

      // Target modern browsers (ES2015+)
      target: 'esnext',

      // Enable terser options for additional minification
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },

    // Aliases for easy imports
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),

        // '@': path.resolve(__dirname, 'src'),
        // 'components': path.resolve(__dirname, 'src/components'),
      },
    },

    // Server configuration for local development
    server: {
      port: 3000, // Default port
      open: true, // Opens browser window automatically
      // proxy: {
      //   // Proxy API requests to backend during development
      //   '/api': {
      //     target: 'http://localhost:8000',
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ''),
      //   },
      // },
    },

    // Define environment variables
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },

    // CSS Preprocessor options (for handling global styles, etc.)
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/global.scss";`
        }
      }
    },
  }
})
