import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

import { ConsentHelper } from '../helpers/consent.helper';
import { LivePage } from '../pages/LivePage';

/**
 * Live Page Test Suite
 * Validates Live page functionality and navigation
 */
test.describe('Live Page Tests', () => {
  let livePage: LivePage;

  test.beforeEach(async ({ page }) => {
    livePage = new LivePage(page);
    await livePage.navigate();
    
    // Handle cookie consent popup before any interactions
    await allure.step('Handle cookie consent', async () => {
      await ConsentHelper.handleCookieConsentWithRetry(page);
    });
  });

  test('@smoke @regression - Verify left sidebar menu exists', async () => {
    await allure.step('Verify sidebar is visible', async () => {
      const sidebarExists = await livePage.verifySidebarExists();
      expect(sidebarExists).toBe(true);
    });
  });

  test('@regression - Verify "Toate" link is present', async () => {
    await allure.step('Verify Toate link is visible', async () => {
      const toatePresent = await livePage.verifyToateLinkPresent();
      expect(toatePresent).toBe(true);
    });
  });

  test('@regression - Verify "Fotbal" link is present', async () => {
    await allure.step('Verify Fotbal link is visible', async () => {
      const fotbalPresent = await livePage.verifyFotbalLinkPresent();
      expect(fotbalPresent).toBe(true);
    });
  });

  test('@regression - Verify "Fotbal" link is functional', async ({ page: _page }) => {
    await allure.step('Click Fotbal link', async () => {
      await livePage.clickFotbalLink();
      // Verify URL contains fotbal or similar pattern
      const currentUrl = livePage.getCurrentUrl();
      expect(currentUrl).toMatch(/fotbal|football/i);
    });
  });
});
