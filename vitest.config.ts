import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    forceRerunTriggers: [...configDefaults.forceRerunTriggers, '**/src/**'],
    exclude: [...configDefaults.exclude],
    coverage: {
      reportsDirectory: './test-output/coverage',
      reporter: ['cobertura', 'lcov'],
      provider: 'v8',
    },
    env: {},
  },
});
