import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' → funciona en local, en un subdirectorio y en GitHub Pages de proyecto.
export default defineConfig({
  plugins: [react()],
  base: './',
})
