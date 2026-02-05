import { Page } from '@playwright/test';

/**
 * Network helper utilities
 * Handles network-related operations and monitoring
 * 
 * NOTE: networkidle is DEPRECATED for live sites (like Superbet)
 * Use element-specific waits instead
 */
export class NetworkHelper {
  /**
   * @deprecated Use waitForPageReady() or element-specific waits instead
   * networkidle is discouraged for sites with continuous network activity
   * This method is kept for backward compatibility but should not be used
   */
  static async waitForNetworkIdle(page: Page, timeout = 30000): Promise<void> {
    console.warn(
      'waitForNetworkIdle is deprecated. Use waitForPageReady() or element-specific waits instead.'
    );
    // For live sites, just wait for DOM instead
    await page.waitForLoadState('domcontentloaded', { timeout });
  }

  /**
   * Wait for page to be ready (DOM loaded)
   * Recommended alternative to networkidle
   * @param page - Playwright page object
   * @param timeout - Maximum wait time
   */
  static async waitForPageReady(page: Page, timeout = 30000): Promise<void> {
    await page.waitForLoadState('domcontentloaded', { timeout });
  }

  /**
   * Intercept and log network requests
   * @param page - Playwright page object
   * @param urlPattern - URL pattern to intercept
   */
  static async interceptRequests(page: Page, urlPattern?: string | RegExp): Promise<void> {
    page.on('request', (request) => {
      if (!urlPattern || (typeof urlPattern === 'string' ? request.url().includes(urlPattern) : urlPattern.test(request.url()))) {
        console.log(`Request: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', (response) => {
      if (!urlPattern || (typeof urlPattern === 'string' ? response.url().includes(urlPattern) : urlPattern.test(response.url()))) {
        console.log(`Response: ${response.status()} ${response.url()}`);
      }
    });
  }

  /**
   * Wait for specific request to complete
   * @param page - Playwright page object
   * @param urlPattern - URL pattern to wait for
   * @param timeout - Maximum wait time
   */
  static async waitForRequest(
    page: Page,
    urlPattern: string | RegExp,
    timeout = 30000
  ): Promise<void> {
    await page.waitForRequest(urlPattern, { timeout });
  }

  /**
   * Wait for specific response
   * @param page - Playwright page object
   * @param urlPattern - URL pattern to wait for
   * @param timeout - Maximum wait time
   */
  static async waitForResponse(
    page: Page,
    urlPattern: string | RegExp,
    timeout = 30000
  ): Promise<void> {
    await page.waitForResponse(urlPattern, { timeout });
  }
}
