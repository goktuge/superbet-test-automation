import { Page } from '@playwright/test';
import { HeaderComponent } from '../../tests/ui/components/HeaderComponent';
import { SportPage } from '../../tests/ui/pages/SportPage';
import { LivePage } from '../../tests/ui/pages/LivePage';

/**
 * Navigation Facade
 * Simplifies complex navigation operations using Facade Pattern
 */
export class NavigationFacade {
  private readonly header: HeaderComponent;
  private readonly sportPage: SportPage;
  private readonly livePage: LivePage;

  /**
   * Constructor
   * @param page - Playwright page object
   */
  constructor(page: Page) {
    this.header = new HeaderComponent(page);
    this.sportPage = new SportPage(page);
    this.livePage = new LivePage(page);
  }

  /**
   * Navigate to Sport page via header
   * @returns SportPage instance
   */
  async navigateToSportViaHeader(): Promise<SportPage> {
    await this.header.clickSportLink();
    await this.sportPage.waitForPageLoad();
    return this.sportPage;
  }

  /**
   * Navigate to Live page via header
   * @returns LivePage instance
   */
  async navigateToLiveViaHeader(): Promise<LivePage> {
    await this.header.clickLiveLink();
    await this.livePage.waitForPageLoad();
    return this.livePage;
  }

  /**
   * Navigate to Sport page directly
   * @returns SportPage instance
   */
  async navigateToSportDirect(): Promise<SportPage> {
    await this.sportPage.navigate();
    return this.sportPage;
  }

  /**
   * Navigate to Live page directly
   * @returns LivePage instance
   */
  async navigateToLiveDirect(): Promise<LivePage> {
    await this.livePage.navigate();
    return this.livePage;
  }

  /**
   * Verify header navigation links
   * @returns Verification results
   */
  async verifyHeaderNavigation(): Promise<Record<string, boolean>> {
    return await this.header.verifyAllLinksPresent();
  }
}
