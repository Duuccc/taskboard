import { defineConfig } from "vitest/config"
import { loadEnv } from "vite"

export default defineConfig(({ mode }) => ({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/tests/setup.ts'],
    env: loadEnv('test', process.cwd(), ''),
    fileParallelism: false,  // 👈 run test files sequentially in Vitest 4
  },
}));