import type { UserConfig } from 'vite'
import { coverageConfigDefaults } from 'vitest/config'

export default {
  base: '/',
  test: {
    coverage: {
        exclude: ['**/main.ts', ...coverageConfigDefaults.exclude]
    }
  }
} satisfies UserConfig