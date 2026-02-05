import { Page, expect } from '@playwright/test';

/**
 * Custom wait strategies for dynamic content
 * Follows Playwright 2024+ best practices:
 * - Uses auto-waiting assertions instead of manual waits
 * - Avoids networkidle (deprecated for live sites)
 * - Uses element-specific waits instead of timeouts
 */
export class WaitHelper {
  /**
   * Wait for element to be visible using Playwright's auto-waiting
   * Uses expect().toBeVisible() which auto-waits and retries
   * @param page - Playwright page object
   * @param selector - Element selector
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForElementVisible(
    page: Page,
    selector: string,
    timeout = 10000
  ): Promise<void> {
    // Use Playwright's built-in auto-waiting assertion
    await expect(page.locator(selector).first()).toBeVisible({ timeout });
  }

  /**
   * Wait for element to be clickable using Playwright's auto-waiting
   * @param page - Playwright page object
   * @param selector - Element selector
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForElementClickable(
    page: Page,
    selector: string,
    timeout = 10000
  ): Promise<void> {
    const locator = page.locator(selector).first();
    // Use auto-waiting assertions - Playwright handles retries automatically
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
  }

  /**
   * Wait for element to be attached to DOM
   * @param page - Playwright page object
   * @param selector - Element selector
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForElementAttached(
    page: Page,
    selector: string,
    timeout = 10000
  ): Promise<void> {
    await page.locator(selector).first().waitFor({ state: 'attached', timeout });
  }

  /**
   * Wait for URL to match pattern
   * @param page - Playwright page object
   * @param urlPattern - URL pattern or regex
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForUrl(
    page: Page,
    urlPattern: string | RegExp,
    timeout = 30000
  ): Promise<void> {
    await page.waitForURL(urlPattern, { timeout });
  }

  /**
   * Wait for page to be ready (DOM loaded)
   * For live betting sites, we wait for DOM, not network idle
   * @param page - Playwright page object
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForPageReady(page: Page, timeout = 30000): Promise<void> {
    await page.waitForLoadState('domcontentloaded', { timeout });
  }

  /**
   * Wait for specific element to appear (indicates page is ready)
   * Better than networkidle for dynamic sites
   * @param page - Playwright page object
   * @param selector - Element selector that indicates page readiness
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForPageIndicator(
    page: Page,
    selector: string,
    timeout = 30000
  ): Promise<void> {
    await expect(page.locator(selector).first()).toBeVisible({ timeout });
  }
}
