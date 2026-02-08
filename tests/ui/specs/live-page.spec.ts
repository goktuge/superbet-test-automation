import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

import { ConsentHelper } from '../helpers/consent.helper';
import { LivePage } from '../pages/LivePage';

const livePageLabels: Record<string, string> = {
  toate: 'Toate link',
  fotbal: 'Fotbal link',
};

test.describe('Live Page Tests', () => {
  let livePage: LivePage;

  test.beforeEach(async ({ page }) => {
    livePage = new LivePage(page);
    await livePage.navigate();

    await allure.step('Handle cookie consent', async () => {
      await ConsentHelper.handleCookieConsentWithRetry(page);
    });
  });

  test('@smoke @regression - Verify left sidebar menu exists', async () => {
    await test.step('Verify sidebar is visible', async () => {
      const sidebarExists = await livePage.verifySidebarExists();
      expect(sidebarExists).toBe(true);
    });
  });

  test('@regression - Verify sidebar links are present', async () => {
    const toatePresent = await livePage.verifyToateLinkPresent();
    const fotbalPresent = await livePage.verifyFotbalLinkPresent();
    const results = { toate: toatePresent, fotbal: fotbalPresent };

    for (const [key, value] of Object.entries(results)) {
      await test.step(livePageLabels[key], () => expect(value).toBe(true));
    }
  });

  test('@regression - Verify "Fotbal" link is functional', async () => {
    await test.step('Click Fotbal link', async () => {
      await livePage.clickFotbalLink();
      const currentUrl = livePage.getCurrentUrl();
      expect(currentUrl).toMatch(/fotbal|football/i);
    });
  });
});
