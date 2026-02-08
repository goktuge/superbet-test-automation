import { BasePage } from '../base/BasePage';
import { SportPageSelectors } from '../selectors/selectors';

export class SportPage extends BasePage {
  async navigate(path = '/pariuri-sportive'): Promise<void> {
    await this.page.goto(`${this.baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
    await this.waitForPageLoad();
    try {
      await this.page.locator('body').waitFor({ state: 'visible', timeout: 5000 });
    } catch {}
  }

  async verifySidebarExists(): Promise<boolean> {
    return await this.isVisible(SportPageSelectors.leftSidebar);
  }

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

  async clickSubPageLink(index: number): Promise<void> {
    const links = this.page.locator(SportPageSelectors.subPageLinks);
    await links.nth(index).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

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

  async verifyUrl(expectedPath: string | RegExp): Promise<boolean> {
    const currentUrl = this.getCurrentUrl();
    if (typeof expectedPath === 'string') {
      return currentUrl.includes(expectedPath);
    }
    return expectedPath.test(currentUrl);
  }
}
