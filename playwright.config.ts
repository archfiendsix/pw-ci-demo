import { defineConfig, devices } from '@playwright/test';

/**
 * Demo Playwright config showing the common "tests inside the frontend repo" setup.
 * - webServer: Playwright boots the site itself (no manual start in CI).
 * - CI-only retries + richer reporters.
 * - A `setup` project that logs in once and saves auth state for reuse.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,        // fail the build if someone left test.only in
  retries: process.env.CI ? 2 : 0,     // absorb flake in CI, fail fast locally
  workers: process.env.CI ? 2 : undefined,

  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['github'], ['list']]
    : [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',           // trace viewer = best CI debugging artifact
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // 1) Logs in once, saves storageState to disk.
    { name: 'setup', testMatch: /auth\.setup\.ts/ },

    // 2) Main run, reuses the saved auth state. Depends on setup.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
  ],

  // Playwright starts the website before tests, kills it after.
  webServer: {
    command: 'node server.js',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
