import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

import { ConsentHelper } from '../helpers/consent.helper';
import { SportPage } from '../pages/SportPage';

/**
 * Sport Page Test Suite
 * Validates Sport page functionality and navigation
 */
test.describe('Sport Page Tests', () => {
  let sportPage: SportPage;

  test.beforeEach(async ({ page }) => {
    sportPage = new SportPage(page);
    await sportPage.navigate();
    
    // Handle cookie consent popup before any interactions
    await allure.step('Handle cookie consent', async () => {
      await ConsentHelper.handleCookieConsentWithRetry(page);
    });
  });

  test('@smoke @regression - Verify left sidebar menu exists', async () => {
    await allure.step('Verify sidebar is visible', async () => {
      const sidebarExists = await sportPage.verifySidebarExists();
      expect(sidebarExists).toBe(true);
    });
  });

  test('@regression - Click first 5 sub-pages and validate', async ({ page: _page }) => {
    await allure.step('Get sub-page links', async () => {
      const subPages = await sportPage.getSubPageLinks();
      const pagesToTest = subPages.slice(0, 5);

      for (let i = 0; i < pagesToTest.length; i++) {
        await allure.step(`Test sub-page ${i + 1}: ${pagesToTest[i].text}`, async () => {
          // Navigate back to sport page if not already there
          if (i > 0) {
            await sportPage.navigate();
          }

          await allure.step('Click sub-page link', async () => {
            await sportPage.clickSubPageLink(i);
          });

          await allure.step('Verify page loads correctly', async () => {
            await sportPage.waitForPageLoad();
            const title = await sportPage.getTitle();
            expect(title).toBeTruthy();
          });

          await allure.step('Verify URL is correct', async () => {
            await Promise.resolve();
            const currentUrl = sportPage.getCurrentUrl();
            expect(currentUrl).toContain('superbet.ro');
          });

          await allure.step('Verify page contains required buttons', async () => {
            const buttons = await sportPage.verifyRequiredButtons();
            expect(buttons.socialNou || buttons.calendar || buttons.competitii).toBe(true);
          });

          await allure.step('Verify buttons are clickable', async () => {
            const areClickable = await sportPage.verifyButtonsAreClickable();
            // At least one button should be clickable
            expect(areClickable).toBe(true);
          });
        });
      }
    });
  });
});
