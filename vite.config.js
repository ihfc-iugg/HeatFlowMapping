import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import viteCompression from 'vite-plugin-compression'
import { polyfillNode } from 'esbuild-plugin-polyfill-node'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  // const env = loadEnv(mode, process.cwd(), '')
  return {
    // define: {
    //   'process.env': env
    // },
    assetsInclude: ['**/*.yaml', '**/*.geojson'],
    plugins: [vue(), VueDevTools(), viteCompression()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      minify: false,
      target: 'esnext'
      // sourcemap: true
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis

        define: {
          global: 'globalThis'
        },
        // Enable esbuild polyfill plugins
        plugins: [
          polyfillNode({
            buffer: true
          })
        ]
      }
    }
    // test: {
    //   // enable jest-like global test APIs
    //   globals: true,
    //   // simulate DOM with happy-dom
    //   // (requires installing happy-dom as a peer dependency)
    //   environment: 'happy-dom'
    // }
  }
})
