/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // Lógica pura → ambiente node basta (sem jsdom/testing-library).
    environment: 'node',
    // Só testes em src/. O test/Guestbook.ts é Hardhat/mocha e quebraria aqui.
    include: ['src/**/*.{test,spec}.ts'],
    exclude: ['test/**', 'node_modules/**', 'dist/**', 'artifacts/**'],
  },
})
