import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // maplibre-gl spawns a module worker via `new Worker(new URL(...), {type:
  // 'module'})`. Dependency pre-bundling rewrites that specifier into
  // .vite/deps without emitting the worker chunk, so the worker 404s in dev
  // and the map renders an empty canvas with no error. Excluding it from
  // pre-bundling lets Vite resolve the worker URL from the package itself.
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },
  worker: {
    format: 'es',
  },
})
