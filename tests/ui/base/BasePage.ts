import { Page, Locator } from '@playwright/test';

import { WaitHelper } from '../helpers/wait.helper';

/**
 * Base Page Object Model class
 * All page objects should extend this class
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly baseUrl: string;

  /**
   * Constructor for BasePage
   * @param page - Playwright page object
   * @param baseUrl - Base URL for the page
   */
  constructor(page: Page, baseUrl?: string) {
    this.page = page;
    this.baseUrl = baseUrl || process.env.BASE_URL || 'https://superbet.ro';
  }

  /**
   * Navigate to the page
   * @param path - Optional path to append to base URL
   */
  abstract navigate(path?: string): Promise<void>;

  /**
   * Wait for page to load
   * Uses modern Playwright patterns: domcontentloaded + element wait
   * Avoids networkidle (deprecated for live sites like Superbet)
   */
  async waitForPageLoad(): Promise<void> {
    // Wait for DOM to be ready
    await this.page.waitForLoadState('domcontentloaded');
    // For live betting sites, wait for a key element instead of network idle
    // This is more reliable as Superbet has continuous network activity
  }

  /**
   * Get page title
   * @returns Page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   * @returns Current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for element to be visible
   * @param selector - Element selector
   * @param timeout - Maximum wait time
   */
  protected async waitForVisible(selector: string, timeout = 10000): Promise<void> {
    await WaitHelper.waitForElementVisible(this.page, selector, timeout);
  }

  /**
   * Wait for element to be clickable
   * @param selector - Element selector
   * @param timeout - Maximum wait time
   */
  protected async waitForClickable(selector: string, timeout = 10000): Promise<void> {
    await WaitHelper.waitForElementClickable(this.page, selector, timeout);
  }

  /**
   * Click element with retry logic
   * @param selector - Element selector
   * @param timeout - Maximum wait time
   */
  protected async click(selector: string, timeout = 10000): Promise<void> {
    await this.waitForClickable(selector, timeout);
    await this.page.locator(selector).first().click();
  }

  /**
   * Fill input field
   * @param selector - Element selector
   * @param value - Value to fill
   * @param timeout - Maximum wait time
   */
  protected async fill(selector: string, value: string, timeout = 10000): Promise<void> {
    await this.waitForVisible(selector, timeout);
    await this.page.locator(selector).first().fill(value);
  }

  /**
   * Get text content of element
   * @param selector - Element selector
   * @param timeout - Maximum wait time
   * @returns Text content
   */
  protected async getText(selector: string, timeout = 10000): Promise<string> {
    await this.waitForVisible(selector, timeout);
    return (await this.page.locator(selector).first().textContent()) || '';
  }

  /**
   * Check if element is visible
   * @param selector - Element selector
   * @param timeout - Maximum wait time
   * @returns True if visible, false otherwise
   */
  protected async isVisible(selector: string, timeout = 5000): Promise<boolean> {
    try {
      await this.waitForVisible(selector, timeout);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get locator for element
   * @param selector - Element selector
   * @returns Playwright locator
   */
  protected getLocator(selector: string): Locator {
    return this.page.locator(selector).first();
  }

  /**
   * Take screenshot
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}_${Date.now()}.png`,
      fullPage: true,
    });
  }
}
