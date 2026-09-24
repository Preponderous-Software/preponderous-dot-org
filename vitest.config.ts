import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // jsdom so component tests can render and query the DOM; the pure
        // util tests are environment-agnostic and pass here too.
        environment: 'jsdom',
        include: ['__tests__/**/*.test.{ts,tsx}'],
        setupFiles: ['./vitest.setup.ts'],
        // No test ever reports to trace: the ones that exercise reporting build
        // their own client against a stub.
        env: { USAGE_REPORTING_ENABLED: 'false' },
    },
});
