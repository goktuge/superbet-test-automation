import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
const env = process.env.ENV || 'local';
dotenv.config({ path: path.resolve(__dirname, `config/environments/${env}.env`) });

/**
 * Playwright Test Configuration
 * Supports multiple environments and parallel execution
 * Configured to run tests on Chromium (Chrome) only
 */
export default defineConfig({
  testDir: './tests/ui/specs',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        suiteTitle: false,
        categories: [
          {
            name: 'Broken tests',
            matchedStatuses: ['broken', 'failed'],
          },
          {
            name: 'Skipped tests',
            matchedStatuses: ['skipped'],
          },
        ],
      },
    ],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://superbet.ro',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Modern timeout configuration (2024+)
    actionTimeout: 15000, // Timeout for actions (click, fill, etc.)
    navigationTimeout: 30000, // Timeout for navigation
    // Use domcontentloaded for live sites (not networkidle)
    // This is set per navigation, but we configure default here
    viewport: { width: 1920, height: 1080 },
    locale: 'ro-RO',
    timezoneId: 'Europe/Bucharest',
    ignoreHTTPSErrors: true,
    headless: process.env.HEADLESS !== 'false',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: undefined,
  timeout: 60000,
  expect: {
    timeout: 10000,
    toHaveScreenshot: { threshold: 0.2 },
    toMatchSnapshot: { threshold: 0.2 },
  },
});
