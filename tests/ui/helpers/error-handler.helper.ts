import { Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Custom error handling with screenshot capture
 */
export class ErrorHandler {
  /**
   * Capture screenshot with meaningful name
   * @param page - Playwright page object
   * @param testName - Name of the test
   * @param errorMessage - Error message for context
   */
  static async captureScreenshot(
    page: Page,
    testName: string,
    errorMessage: string
  ): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const sanitizedTestName = testName.replace(/[^a-zA-Z0-9]/g, '_');
    const screenshotName = `${sanitizedTestName}_${timestamp}.png`;
    const screenshotPath = path.join('test-results', 'screenshots', screenshotName);

    // Ensure directory exists
    const dir = path.dirname(screenshotPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await page.screenshot({ path: screenshotPath, fullPage: true });
    return screenshotPath;
  }

  /**
   * Create custom error with context
   * @param message - Error message
   * @param context - Additional context information
   */
  static createError(message: string, context?: Record<string, unknown>): Error {
    const error = new Error(message);
    if (context) {
      Object.assign(error, { context });
    }
    return error;
  }
}
