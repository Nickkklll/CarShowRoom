import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'


export default defineConfig({
  base: '/CarShowRoom/',
  plugins: [
    react(),
  ],

  resolve:{
    alias:{
      '@':path.resolve(__dirname,'./src'),
    },
  },
  
  css:{
    preprocessorOptions:{
      scss:{
        additionalData: `@use "@/styles/global/index" as *;`,
      }
    }

  }
})


