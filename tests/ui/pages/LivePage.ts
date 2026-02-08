import { BasePage } from '../base/BasePage';
import { LivePageSelectors } from '../selectors/selectors';

export class LivePage extends BasePage {
  async navigate(path = '/pariuri-sportive/live'): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
    try {
      await this.page.locator('body').waitFor({ state: 'visible', timeout: 5000 });
    } catch {}
  }

  async verifySidebarExists(): Promise<boolean> {
    return await this.isVisible(LivePageSelectors.leftSidebar);
  }

  async verifyToateLinkPresent(): Promise<boolean> {
    return await this.isVisible(LivePageSelectors.toateLink);
  }

  async verifyFotbalLinkPresent(): Promise<boolean> {
    return await this.isVisible(LivePageSelectors.fotbalLink);
  }

  async clickToateLink(): Promise<void> {
    await this.click(LivePageSelectors.toateLink);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickFotbalLink(): Promise<void> {
    await this.click(LivePageSelectors.fotbalLink);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyToateLinkNavigation(): Promise<boolean> {
    try {
      await this.clickToateLink();
      return await this.verifyUrl('/pariuri-sportive/astazi');
    } catch {
      return false;
    }
  }

  async verifyUrl(expectedPath: string | RegExp): Promise<boolean> {
    const currentUrl = this.getCurrentUrl();
    if (typeof expectedPath === 'string') {
      return currentUrl.includes(expectedPath);
    }
    return expectedPath.test(currentUrl);
  }


  
}
