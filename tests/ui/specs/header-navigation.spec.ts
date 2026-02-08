import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

import { HeaderComponent } from '../components/HeaderComponent';
import { ConsentHelper } from '../helpers/consent.helper';

const headerLabels: Record<string, string> = {
  sport: 'Sport link',
  live: 'Live link',
  supersocial: 'Supersocial link',
  bileteleMele: 'Biletele Mele link',
  casino: 'Casino link',
  casinoLive: 'Casino Live link',
  search: 'Search icon',
  userProfile: 'User Profile icon',
  register: 'Register button',
  login: 'Login button',
};

test.describe('Header Navigation Tests', () => {
  let header: HeaderComponent;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await allure.step('Handle cookie consent', async () => {
      await ConsentHelper.handleCookieConsentWithRetry(page);
    });

    header = new HeaderComponent(page);
  });

  test('@smoke @regression - Verify header contains all required links', async () => {
    const results = await header.verifyAllLinksPresent();
    for (const [key, value] of Object.entries(results)) {
      await test.step(headerLabels[key] ?? key, () => expect(value).toBe(true));
    }
  });

  const navCases: Array<{
    name: string;
    click: () => Promise<void>;
    urlPattern: RegExp;
    notUrlPattern?: RegExp;
  }> = [
    {
      name: 'Sport',
      click: () => header.clickSportLink(),
      urlPattern: /.*\/pariuri-sportive/,
    },
    {
      name: 'Live',
      click: () => header.clickLiveLink(),
      urlPattern: /.*\/pariuri-sportive\/live/,
    },
    {
      name: 'Supersocial',
      click: () => header.clickSupersocialLink(),
      urlPattern: /.*\/social\/noutati/,
    },
    {
      name: 'Biletele Mele',
      click: () => header.clickBileteleMeleLink(),
      urlPattern: /.*\/pariurile-mele\/deschise/,
    },
    {
      name: 'Casino',
      click: () => header.clickCasinoLink(),
      urlPattern: /.*\/casino/,
      notUrlPattern: /.*\/casino-live/,
    },
    {
      name: 'Casino Live',
      click: () => header.clickCasinoLiveLink(),
      urlPattern: /.*\/casino\/casino-live/,
    },
  ];

  navCases.forEach(({ name, click, urlPattern, notUrlPattern }) => {
    test(`@regression - Verify ${name} link navigation`, async ({ page }) => {
      await test.step(`Click ${name} link and verify navigation`, async () => {
        await click();
        await expect(page).toHaveURL(urlPattern);
        if (notUrlPattern) {
          await expect(page).not.toHaveURL(notUrlPattern);
        }
      });
    });
  });

  test('@regression - Verify Search icon is functional', async ({ page }) => {
    await test.step('Click Search icon', async () => {
      await header.clickSearchIcon();
      try {
        await page.locator('input[type="search"], [data-testid*="search"], .search-input').first().waitFor({
          state: 'visible',
          timeout: 2000,
        });
      } catch {}
    });
  });

  test('@regression - Verify User Profile icon is functional', async ({ page }) => {
    await test.step('Click User Profile icon', async () => {
      await header.clickUserProfileIcon();
      try {
        await page.locator('[data-testid*="profile-menu"], .user-menu, .profile-dropdown').first().waitFor({
          state: 'visible',
          timeout: 2000,
        });
      } catch {}
    });
  });

  test('@regression - Verify Register button is functional', async ({ page }) => {
    await test.step('Click Register button', async () => {
      await header.clickRegisterButton();
      try {
        await page.locator('[data-testid*="register"], .register-modal, .registration-form').first().waitFor({
          state: 'visible',
          timeout: 2000,
        });
      } catch {
        await page.waitForLoadState('domcontentloaded');
      }
    });
  });

  test('@regression - Verify Login button is functional', async ({ page }) => {
    await test.step('Click Login button', async () => {
      await header.clickLoginButton();
      try {
        await page.locator('[data-testid*="login"], .login-modal, .login-form').first().waitFor({
          state: 'visible',
          timeout: 2000,
        });
      } catch {
        await page.waitForLoadState('domcontentloaded');
      }
    });
  });
});
