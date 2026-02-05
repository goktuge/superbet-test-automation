import { test as base } from '@playwright/test';

import { NavigationFacade } from '../../../utils/facades/NavigationFacade';
import { PageFactory } from '../../../utils/facades/PageFactory';
import { HeaderComponent } from '../components/HeaderComponent';
import { LivePage } from '../pages/LivePage';
import { SportPage } from '../pages/SportPage';

/**
 * Extended test fixtures
 * Provides page objects and facades to all tests
 */
type TestFixtures = {
  header: HeaderComponent;
  sportPage: SportPage;
  livePage: LivePage;
  navigationFacade: NavigationFacade;
};

export const test = base.extend<TestFixtures>({
  header: async ({ page }, use) => {
    const header = PageFactory.createHeaderComponent(page);
    await use(header);
  },

  sportPage: async ({ page }, use) => {
    const sportPage = PageFactory.createSportPage(page);
    await use(sportPage);
  },

  livePage: async ({ page }, use) => {
    const livePage = PageFactory.createLivePage(page);
    await use(livePage);
  },

  navigationFacade: async ({ page }, use) => {
    const facade = new NavigationFacade(page);
    await use(facade);
  },
});

export { expect } from '@playwright/test';
