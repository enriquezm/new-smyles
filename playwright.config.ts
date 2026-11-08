import { defineConfig, devices } from '@playwright/test'

// UI checks against the generated static site. Run `npm run test:ui`, which
// generates first; in CI the workflow generates once, then runs `playwright test`.
const PORT = 4173
const isCI = !!process.env.CI

export default defineConfig({
  testDir: 'tests/ui',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    // Card animations finish instantly, so layout checks never race them.
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
  },

  // The four breakpoints from DESIGN_SPEC.md.
  projects: [
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, hasTouch: true } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 834, height: 1194 } } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'wide', use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } } },
  ],

  webServer: {
    command: `node tests/ui/serve.mjs .output/public ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !isCI,
  },
})
