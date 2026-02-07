import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['html'],
    ['./utils/metrics/InfluxDBReporter.ts'],
    ['allure-playwright', { 
      outputFolder: 'allure-results',
      video: 'retain-on-failure',
      screenshot: 'only-on-failure'
    }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://superbet.ro',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    headless: !!process.env.CI,
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] },
  ],
});
