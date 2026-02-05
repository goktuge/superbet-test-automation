import { Page } from '@playwright/test';

import { HeaderComponent } from '../../tests/ui/components/HeaderComponent';
import { LivePage } from '../../tests/ui/pages/LivePage';
import { SportPage } from '../../tests/ui/pages/SportPage';

/**
 * Page Factory
 * Implements Factory Pattern for page object instantiation
 */
export class PageFactory {
  /**
   * Create Header Component
   * @param page - Playwright page object
   * @returns HeaderComponent instance
   */
  static createHeaderComponent(page: Page): HeaderComponent {
    return new HeaderComponent(page);
  }

  /**
   * Create Sport Page
   * @param page - Playwright page object
   * @returns SportPage instance
   */
  static createSportPage(page: Page): SportPage {
    return new SportPage(page);
  }

  /**
   * Create Live Page
   * @param page - Playwright page object
   * @returns LivePage instance
   */
  static createLivePage(page: Page): LivePage {
    return new LivePage(page);
  }
}
