import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

import { ConsentHelper } from '../helpers/consent.helper';
import { SportPage } from '../pages/SportPage';

test.describe('Sport Page Tests', () => {
  let sportPage: SportPage;

  test.beforeEach(async ({ page }) => {
    sportPage = new SportPage(page);
    await sportPage.navigate();

    await allure.step('Handle cookie consent', async () => {
      await ConsentHelper.handleCookieConsentWithRetry(page);
    });
  });

  test('@smoke @regression - Verify left sidebar menu exists', async () => {
    await test.step('Verify sidebar is visible', async () => {
      const sidebarExists = await sportPage.verifySidebarExists();
      expect(sidebarExists).toBe(true);
    });
  });

  test('@regression - Click first 5 sub-pages and validate', async () => {
    const subPages = await sportPage.getSubPageLinks();
    const pagesToTest = subPages.slice(0, 5);

    for (let i = 0; i < pagesToTest.length; i++) {
      const pageLabel = `${pagesToTest[i].text}`;

      await test.step(`Sub-page ${i + 1}: ${pageLabel}`, async () => {
        if (i > 0) {
          await sportPage.navigate();
        }

        await test.step('Click sub-page link', async () => await sportPage.clickSubPageLink(i));

        await test.step('Verify page loads correctly', async () => {
          await sportPage.waitForPageLoad();
          const title = await sportPage.getTitle();
          expect(title).toBeTruthy();
        });

        await test.step('Verify URL is correct', () => {
          const currentUrl = sportPage.getCurrentUrl();
          expect(currentUrl).toContain('superbet.ro');
        });

        await test.step('Verify page contains required buttons', async () => {
          const buttons = await sportPage.verifyRequiredButtons();
          expect(buttons.socialNou || buttons.calendar || buttons.competitii).toBe(true);
        });

        await test.step('Verify buttons are clickable', async () => {
          const areClickable = await sportPage.verifyButtonsAreClickable();
          expect(areClickable).toBe(true);
        });
      });
    }
  });
});
