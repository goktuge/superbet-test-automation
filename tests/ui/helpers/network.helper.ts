import { Page } from '@playwright/test';

export class NetworkHelper {
  /** @deprecated Use waitForPageReady() or element-specific waits instead */
  static async waitForNetworkIdle(page: Page, timeout = 30000): Promise<void> {
    await page.waitForLoadState('domcontentloaded', { timeout });
  }

  static async waitForPageReady(page: Page, timeout = 30000): Promise<void> {
    await page.waitForLoadState('domcontentloaded', { timeout });
  }

  static async interceptRequests(page: Page, _urlPattern?: string | RegExp): Promise<void> {
    await Promise.resolve();
  }

  static async waitForRequest(
    page: Page,
    urlPattern: string | RegExp,
    timeout = 30000
  ): Promise<void> {
    await page.waitForRequest(urlPattern, { timeout });
  }

  static async waitForResponse(
    page: Page,
    urlPattern: string | RegExp,
    timeout = 30000
  ): Promise<void> {
    await page.waitForResponse(urlPattern, { timeout });
  }
}
