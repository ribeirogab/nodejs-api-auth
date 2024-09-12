import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  {
    extends: 'vitest.config.ts',
    test: {
      include: ['**/*.spec.ts'],
      name: 'unit',
      environment: 'node',
    },
  },
  {
    extends: 'vitest.config.ts',
    test: {
      include: ['**/*.test.ts'],
      name: 'integration',
      environment: 'node',
    },
  },
]);
