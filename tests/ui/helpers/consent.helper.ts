import { Page } from '@playwright/test';

import { ConsentSelectors } from '../selectors/selectors';

export class ConsentHelper {
  private static readonly CONSENT_SELECTORS = [
    ConsentSelectors.acceptButton,
    ConsentSelectors.acceptAllButton,
    ConsentSelectors.alternativeAccept,
    'button:has-text("Acceptați toate cookie-urile")',
    'button:has-text("Acceptă toate")',
    'button:has-text("Accept All")',
    'button:has-text("Accept")',
    'button:has-text("Acceptă")',
    '[id*="onetrust-accept"]',
    '[id*="accept"]',
  ];

  private static readonly CONSENT_POPUP_SELECTORS = [
    ConsentSelectors.consentPopup,
    ConsentSelectors.consentOverlay,
    '#onetrust-consent-sdk',
    '#onetrust-banner-sdk',
    '.onetrust-pc-sdk',
    '[id*="onetrust"]',
    '[class*="onetrust"]',
    '[data-testid*="cookie"]',
    '[id*="cookie"]',
    '[class*="cookie"]',
    '[class*="consent"]',
  ];

  static async isConsentPopupVisible(page: Page, timeout = 5000): Promise<boolean> {
    for (const selector of this.CONSENT_POPUP_SELECTORS) {
      try {
        const element = page.locator(selector).first();
        const count = await element.count();
        if (count > 0) {
          const isVisible = await element.isVisible({ timeout: Math.min(timeout, 2000) }).catch(() => false);
          if (isVisible) return true;
        }
      } catch {}
    }
    return false;
  }

  static async clickAcceptButton(page: Page, timeout = 10000): Promise<boolean> {
    for (let i = 0; i < this.CONSENT_SELECTORS.length; i++) {
      const selector = this.CONSENT_SELECTORS[i];
      try {
        const button = page.locator(selector).first();
        const count = await button.count();
        if (count > 0) {
          const isVisible = await button.isVisible({ timeout: 2000 }).catch(() => false);
          if (isVisible) {
            await button.click({ timeout });
            return true;
          }
        }
      } catch {}
    }
    return false;
  }

  static async waitForPopupToDisappear(page: Page, timeout = 10000): Promise<void> {
    for (const selector of this.CONSENT_POPUP_SELECTORS) {
      try {
        const element = page.locator(selector).first();
        await element.waitFor({ state: 'hidden', timeout });
        return;
      } catch {}
    }
  }

  static async handleCookieConsent(page: Page, timeout = 10000): Promise<boolean> {
    try {
      try {
        await page.locator('#onetrust-consent-sdk, #onetrust-banner-sdk').first().waitFor({
          state: 'visible',
          timeout: 2000,
        });
      } catch {}

      const isVisible = await this.isConsentPopupVisible(page, 3000);
      if (!isVisible) return false;

      const clicked = await this.clickAcceptButton(page, timeout);
      if (clicked) {
        await this.waitForPopupToDisappear(page, timeout);
        try {
          await page.locator('#onetrust-consent-sdk, #onetrust-banner-sdk').first().waitFor({
            state: 'hidden',
            timeout: 2000,
          });
        } catch {}
        return true;
      }

      await page.keyboard.press('Escape');
      try {
        await page.locator('#onetrust-consent-sdk, #onetrust-banner-sdk').first().waitFor({
          state: 'hidden',
          timeout: 2000,
        });
      } catch {}
      return true;
    } catch {
      return false;
    }
  }

  static async forceAcceptCookies(page: Page): Promise<void> {
    const cookies = [
      { name: 'cookie_consent', value: 'accepted', domain: '.superbet.ro', path: '/' },
      { name: 'cookieConsent', value: 'true', domain: '.superbet.ro', path: '/' },
      { name: 'consent', value: 'accepted', domain: '.superbet.ro', path: '/' },
    ];
    for (const cookie of cookies) {
      try {
        await page.context().addCookies([cookie]);
      } catch {}
    }
  }

  static async handleCookieConsentWithRetry(page: Page, maxRetries = 3): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
      const handled = await this.handleCookieConsent(page);
      if (handled) return true;
      if (i < maxRetries - 1) {
        try {
          await page.locator('#onetrust-consent-sdk, #onetrust-banner-sdk').first().waitFor({
            state: 'visible',
            timeout: 1000,
          });
        } catch {}
      }
    }
    await this.forceAcceptCookies(page);
    return false;
  }
}
