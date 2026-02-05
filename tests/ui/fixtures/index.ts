import { test as base } from '@playwright/test';
import { HeaderComponent } from '../components/HeaderComponent';
import { SportPage } from '../pages/SportPage';
import { LivePage } from '../pages/LivePage';
import { NavigationFacade } from '../../../utils/facades/NavigationFacade';
import { PageFactory } from '../../../utils/facades/PageFactory';

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
