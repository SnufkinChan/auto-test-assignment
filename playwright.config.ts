import { defineConfig, devices, ReporterDescription } from '@playwright/test';
import { env, storageStateFor, TEST_TRAFFIC_MARKER } from './src/config/env';

/** Desktop browser settings shared by a browser's setup and test projects. */
function desktop(deviceName: 'Desktop Chrome' | 'Desktop Firefox') {
  const device = devices[deviceName];
  return {
    ...device,
    viewport: { width: 1440, height: 900 },
    userAgent: `${device.userAgent} ${TEST_TRAFFIC_MARKER}`,
  };
}

const reporters: ReporterDescription[] = [
  ['list'],
  ['html', { open: 'never' }],
  ['junit', { outputFile: 'test-results/junit.xml' }],
];
if (env.isCI) reporters.push(['github']); // failures shown inline on the commit / pull request

export default defineConfig({
  testDir: './tests',
  forbidOnly: env.isCI,
  retries: env.isCI ? 1 : 0,
  // Per the assignment brief: one worker, to avoid Cloudflare throttling on production.
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: reporters,

  use: {
    baseURL: env.baseURL,
    headless: env.headless,
    locale: 'en-GB',
    timezoneId: 'Europe/Tallinn',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Each browser = a "setup" project (cookie consent, saved state) + the tests that depend on it.
  // Pick one with --project, e.g. `npx playwright test --project=firefox`; its setup runs automatically.
  projects: [
    {
      name: 'setup-chromium',
      testMatch: /.*\.setup\.ts/,
      use: desktop('Desktop Chrome'),
    },
    {
      name: 'chromium',
      use: { ...desktop('Desktop Chrome'), storageState: storageStateFor('chromium') },
      dependencies: ['setup-chromium'],
    },
    {
      name: 'setup-firefox',
      testMatch: /.*\.setup\.ts/,
      use: desktop('Desktop Firefox'),
    },
    {
      name: 'firefox',
      use: { ...desktop('Desktop Firefox'), storageState: storageStateFor('firefox') },
      dependencies: ['setup-firefox'],
    },
  ],
});
