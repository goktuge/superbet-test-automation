import { Page, Locator } from '@playwright/test';

/**
 * Base Component class for reusable UI components
 * All components should extend this class
 */
export abstract class BaseComponent {
  protected readonly page: Page;
  protected readonly rootLocator: Locator;

  /**
   * Constructor for BaseComponent
   * @param page - Playwright page object
   * @param rootSelector - Root selector for the component
   */
  constructor(page: Page, rootSelector: string) {
    this.page = page;
    this.rootLocator = page.locator(rootSelector).first();
  }

  /**
   * Wait for component to be visible
   * @param timeout - Maximum wait time
   */
  async waitForVisible(timeout = 10000): Promise<void> {
    await this.rootLocator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Check if component root is visible
   * @param timeout - Maximum wait time
   * @returns True if visible, false otherwise
   */
  async isVisible(timeout = 5000): Promise<boolean> {
    try {
      await this.waitForVisible(timeout);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element matching selector is visible within component
   * @param selector - Element selector relative to component root
   * @param timeout - Maximum wait time
   * @returns True if visible, false otherwise
   */
  async isSelectorVisible(selector: string, timeout = 5000): Promise<boolean> {
    try {
      await this.getLocator(selector).waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get locator within component scope
   * @param selector - Element selector relative to component root
   * @returns Playwright locator
   */
  protected getLocator(selector: string): Locator {
    return this.rootLocator.locator(selector).first();
  }

  /**
   * Click element within component
   * @param selector - Element selector
   * @param timeout - Maximum wait time
   */
  protected async click(selector: string, timeout = 10000): Promise<void> {
    const locator = this.getLocator(selector);
    await locator.waitFor({ state: 'visible', timeout });
    await locator.waitFor({ state: 'attached', timeout });
    await locator.click({ timeout });
  }

  /**
   * Get text content of element within component
   * @param selector - Element selector
   * @param timeout - Maximum wait time
   * @returns Text content
   */
  protected async getText(selector: string, timeout = 10000): Promise<string> {
    const locator = this.getLocator(selector);
    await locator.waitFor({ state: 'visible', timeout });
    return (await locator.textContent()) || '';
  }
}
