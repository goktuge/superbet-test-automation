import { BasePage } from '../base/BasePage';
import { LivePageSelectors } from '../selectors/selectors';

/**
 * Live Page Object Model
 * Handles interactions with the Live betting page
 */
export class LivePage extends BasePage {
  /**
   * Navigate to Live page
   * Uses modern Playwright navigation patterns
   * @param path - Optional path to append
   */
  async navigate(path = '/pariuri-sportive/live'): Promise<void> {
    // Use domcontentloaded instead of networkidle for live sites
    await this.page.goto(`${this.baseUrl}${path}`, {
      waitUntil: 'domcontentloaded',
    });
    await this.waitForPageLoad();
    // Wait for a key element to ensure page is interactive
    // This is better than networkidle for dynamic sites
    try {
      await this.page.locator('body').waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      // Continue if body is already visible
    }
  }

  /**
   * Verify left sidebar menu exists
   * @returns True if sidebar is visible
   */
  async verifySidebarExists(): Promise<boolean> {
    return await this.isVisible(LivePageSelectors.leftSidebar);
  }

  /**
   * Verify "Toate" link is present
   * @returns True if link is visible
   */
  async verifyToateLinkPresent(): Promise<boolean> {
    return await this.isVisible(LivePageSelectors.toateLink);
  }

  /**
   * Verify "Fotbal" link is present
   * @returns True if link is visible
   */
  async verifyFotbalLinkPresent(): Promise<boolean> {
    return await this.isVisible(LivePageSelectors.fotbalLink);
  }

  /**
   * Click "Toate" link
   * Uses auto-waiting - no need for explicit waits after click
   */
  async clickToateLink(): Promise<void> {
    await this.click(LivePageSelectors.toateLink);
    // Wait for navigation to complete (URL change)
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Click "Fotbal" link
   * Uses auto-waiting - no need for explicit waits after click
   */
  async clickFotbalLink(): Promise<void> {
    await this.click(LivePageSelectors.fotbalLink);
    // Wait for navigation to complete (URL change)
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Verify "Toate" link navigates to correct URL
   * @returns True if navigation is successful
   */
  async verifyToateLinkNavigation(): Promise<boolean> {
    try {
      await this.clickToateLink();
      return await this.verifyUrl('/pariuri-sportive/astazi');
    } catch {
      return false;
    }
  }

  /**
   * Verify URL is correct
   * @param expectedPath - Expected path pattern
   * @returns True if URL matches
   */
  async verifyUrl(expectedPath: string | RegExp): Promise<boolean> {
    const currentUrl = this.getCurrentUrl();
    if (typeof expectedPath === 'string') {
      return currentUrl.includes(expectedPath);
    }
    return expectedPath.test(currentUrl);
  }
}
