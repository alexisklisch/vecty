import { defineConfig } from 'vitest/config'
import { resolve, dirname } from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})