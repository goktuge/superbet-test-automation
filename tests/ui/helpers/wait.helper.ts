import { Page, expect } from '@playwright/test';

export class WaitHelper {
  static async waitForElementVisible(
    page: Page,
    selector: string,
    timeout = 10000
  ): Promise<void> {
    await expect(page.locator(selector).first()).toBeVisible({ timeout });
  }

  static async waitForElementClickable(
    page: Page,
    selector: string,
    timeout = 10000
  ): Promise<void> {
    const locator = page.locator(selector).first();
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
  }

  static async waitForElementAttached(
    page: Page,
    selector: string,
    timeout = 10000
  ): Promise<void> {
    await page.locator(selector).first().waitFor({ state: 'attached', timeout });
  }

  static async waitForUrl(
    page: Page,
    urlPattern: string | RegExp,
    timeout = 30000
  ): Promise<void> {
    await page.waitForURL(urlPattern, { timeout });
  }

  static async waitForPageReady(page: Page, timeout = 30000): Promise<void> {
    await page.waitForLoadState('domcontentloaded', { timeout });
  }

  static async waitForPageIndicator(
    page: Page,
    selector: string,
    timeout = 30000
  ): Promise<void> {
    await expect(page.locator(selector).first()).toBeVisible({ timeout });
  }
}
