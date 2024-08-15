import type { UserConfig } from 'vite'
import { coverageConfigDefaults } from 'vitest/config'

export default {
  test: {
    coverage: {
        exclude: ['**/main.ts', ...coverageConfigDefaults.exclude]
    }
  }
} satisfies UserConfig