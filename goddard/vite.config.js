<<<<<<< HEAD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
=======
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
>>>>>>> 6c4b420564277bc06b1badc3f187bb6f47dd2c1f

export default defineConfig({
<<<<<<< HEAD
  plugins: [react()],
=======
  plugins: [react(), tailwindcss()],
>>>>>>> 6c4b420564277bc06b1badc3f187bb6f47dd2c1f
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
<<<<<<< HEAD
})
=======
})
>>>>>>> 6c4b420564277bc06b1badc3f187bb6f47dd2c1f
