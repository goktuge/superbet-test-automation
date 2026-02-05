import { BasePage } from '../base/BasePage';
import { SportPageSelectors } from '../selectors/selectors';

/**
 * Sport Page Object Model
 * Handles interactions with the Sport betting page
 */
export class SportPage extends BasePage {
  /**
   * Navigate to Sport page
   * Uses modern Playwright navigation patterns
   * @param path - Optional path to append
   */
  async navigate(path = '/pariuri-sportive'): Promise<void> {
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
    return await this.isVisible(SportPageSelectors.leftSidebar);
  }

  /**
   * Get all sub-page links from sidebar
   * @returns Array of link texts and hrefs
   */
  async getSubPageLinks(): Promise<Array<{ text: string; href: string }>> {
    const links = this.page.locator(SportPageSelectors.subPageLinks);
    const count = await links.count();
    const subPages: Array<{ text: string; href: string }> = [];

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const text = (await link.textContent())?.trim() || '';
      const href = (await link.getAttribute('href')) || '';
      if (text && href) {
        subPages.push({ text, href });
      }
    }

    return subPages;
  }

  /**
   * Click sub-page link by index
   * Uses auto-waiting - no need for explicit waits after click
   * @param index - Index of the link (0-based)
   */
  async clickSubPageLink(index: number): Promise<void> {
    const links = this.page.locator(SportPageSelectors.subPageLinks);
    // Playwright auto-waits for element to be actionable before clicking
    await links.nth(index).click();
    // Wait for navigation to complete (URL change)
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Verify page contains required buttons
   * @returns Object with verification results
   */
  async verifyRequiredButtons(): Promise<{
    socialNou: boolean;
    calendar: boolean;
    competitii: boolean;
  }> {
    return {
      socialNou: await this.isVisible(SportPageSelectors.socialNouButton),
      calendar: await this.isVisible(SportPageSelectors.calendarButton),
      competitii: await this.isVisible(SportPageSelectors.competitiiButton),
    };
  }

  /**
   * Verify all three buttons are active/clickable
   * @returns True if all buttons are clickable
   */
  async verifyButtonsAreClickable(): Promise<boolean> {
    try {
      await this.waitForClickable(SportPageSelectors.socialNouButton);
      await this.waitForClickable(SportPageSelectors.calendarButton);
      await this.waitForClickable(SportPageSelectors.competitiiButton);
      return true;
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
