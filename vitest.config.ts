import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html']
    },
    includeSource: ['questions/**/*.{js,ts}']
  }
})
