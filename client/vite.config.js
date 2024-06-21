import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // build: {
  //   rollupOptions: {
  //     external: ['mock-aws-s3', 'aws-sdk', 'nock']
  //   }
  // },
  // optimizeDeps: {
  //   exclude: ["@mapbox"],
  // },
  // server: {
  //   fs: {
  //     allow: [
  //       // Add the absolute paths to the client and server directories
  //       // path.resolve(__dirname),
  //       // path.resolve(__dirname, '../server')
  //       '..'
  //     ]
  //   }
  // }
})
