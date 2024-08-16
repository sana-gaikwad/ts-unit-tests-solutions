import type { UserConfig } from 'vite'
import { coverageConfigDefaults } from 'vitest/config'

export default {
  base: '/ts-unit-tests/',
  test: {
    coverage: {
        exclude: ['**/main.ts', ...coverageConfigDefaults.exclude]
    }
  }
} satisfies UserConfig