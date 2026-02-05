import { Page } from '@playwright/test';
import { ConsentSelectors } from '../selectors/selectors';

/**
 * Cookie Consent Helper
 * Handles Superbet.ro cookie consent popup
 * 
 * Note: Update ConsentSelectors in selectors.ts with actual Superbet.ro selectors
 * for better performance and reliability
 */
export class ConsentHelper {
  /**
   * Common cookie consent selectors
   * These are common patterns used by cookie consent libraries
   * Falls back to these if centralized selectors don't work
   */
  private static readonly CONSENT_SELECTORS = [
    // PRIMARY: OneTrust accept button (verified working for Superbet.ro)
    ConsentSelectors.acceptButton, // #onetrust-accept-btn-handler
    ConsentSelectors.acceptAllButton, // Same as above
    // Fallback selectors
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
    // PRIMARY: OneTrust popup selectors (verified working for Superbet.ro)
    ConsentSelectors.consentPopup, // #onetrust-consent-sdk, #onetrust-banner-sdk
    ConsentSelectors.consentOverlay,
    '#onetrust-consent-sdk',
    '#onetrust-banner-sdk',
    '.onetrust-pc-sdk',
    // Fallback selectors
    '[id*="onetrust"]',
    '[class*="onetrust"]',
    '[data-testid*="cookie"]',
    '[id*="cookie"]',
    '[class*="cookie"]',
    '[class*="consent"]',
  ];

  /**
   * Check if cookie consent popup is visible
   * @param page - Playwright page object
   * @param timeout - Maximum wait time in milliseconds
   * @returns True if popup is visible, false otherwise
   */
  static async isConsentPopupVisible(page: Page, timeout = 5000): Promise<boolean> {
    for (const selector of this.CONSENT_POPUP_SELECTORS) {
      try {
        const element = page.locator(selector).first();
        const count = await element.count();
        if (count > 0) {
          const isVisible = await element.isVisible({ timeout: Math.min(timeout, 2000) }).catch(() => false);
          if (isVisible) {
            console.log(`[ConsentHelper] Popup found with selector: ${selector}`);
            return true;
          }
        }
      } catch {
        // Continue to next selector
      }
    }
    return false;
  }

  /**
   * Find and click the accept button
   * @param page - Playwright page object
   * @param timeout - Maximum wait time in milliseconds
   * @returns True if button was found and clicked, false otherwise
   */
  static async clickAcceptButton(page: Page, timeout = 10000): Promise<boolean> {
    console.log(`[ConsentHelper] Trying ${this.CONSENT_SELECTORS.length} selectors...`);
    
    for (let i = 0; i < this.CONSENT_SELECTORS.length; i++) {
      const selector = this.CONSENT_SELECTORS[i];
      try {
        console.log(`[ConsentHelper] Trying selector ${i + 1}/${this.CONSENT_SELECTORS.length}: ${selector}`);
        const button = page.locator(selector).first();
        const count = await button.count();
        console.log(`[ConsentHelper]   Found ${count} element(s) with this selector`);
        
        if (count > 0) {
          const isVisible = await button.isVisible({ timeout: 2000 }).catch(() => false);
          console.log(`[ConsentHelper]   Element visible: ${isVisible}`);
          
          if (isVisible) {
            const text = await button.textContent().catch(() => '');
            console.log(`[ConsentHelper]   ✅ Clicking button with text: "${text}"`);
            await button.click({ timeout });
            console.log(`[ConsentHelper]   ✅ Successfully clicked!`);
            return true;
          }
        }
      } catch (error) {
        console.log(`[ConsentHelper]   ❌ Selector failed: ${(error as Error).message}`);
        // Continue to next selector
      }
    }
    
    console.log('[ConsentHelper] ❌ No working selector found after trying all options');
    return false;
  }

  /**
   * Wait for consent popup to disappear
   * @param page - Playwright page object
   * @param timeout - Maximum wait time in milliseconds
   */
  static async waitForPopupToDisappear(page: Page, timeout = 10000): Promise<void> {
    for (const selector of this.CONSENT_POPUP_SELECTORS) {
      try {
        const element = page.locator(selector).first();
        await element.waitFor({ state: 'hidden', timeout });
        return;
      } catch {
        // Continue to next selector
      }
    }
    // If no popup found, assume it's already gone
  }

  /**
   * Handle cookie consent popup
   * Accepts all cookies and waits for popup to disappear
   * Handles gracefully if popup doesn't appear (already accepted)
   * @param page - Playwright page object
   * @param timeout - Maximum wait time in milliseconds
   * @returns True if consent was handled, false if popup didn't appear
   */
  static async handleCookieConsent(page: Page, timeout = 10000): Promise<boolean> {
    console.log('[ConsentHelper] Starting cookie consent handling...');
    
    try {
      // Wait for popup to appear using element wait instead of timeout
      console.log('[ConsentHelper] Waiting for consent popup to appear...');
      // Try to wait for popup element instead of fixed timeout
      try {
        await page.locator('#onetrust-consent-sdk, #onetrust-banner-sdk').first().waitFor({
          state: 'visible',
          timeout: 2000,
        });
      } catch {
        // Popup might not appear, continue
      }

      // Check if popup is visible
      console.log('[ConsentHelper] Checking if consent popup is visible...');
      const isVisible = await this.isConsentPopupVisible(page, 3000);
      console.log(`[ConsentHelper] Popup visible: ${isVisible}`);

      if (!isVisible) {
        // Popup doesn't appear - cookies already accepted or no popup
        console.log('[ConsentHelper] Popup not visible - may already be accepted or not present');
        return false;
      }

      // Try to click accept button
      console.log('[ConsentHelper] Attempting to click accept button...');
      const clicked = await this.clickAcceptButton(page, timeout);
      console.log(`[ConsentHelper] Accept button clicked: ${clicked}`);

      if (clicked) {
        // Wait for popup to disappear using element wait
        console.log('[ConsentHelper] Waiting for popup to disappear...');
        await this.waitForPopupToDisappear(page, timeout);
        // Wait for popup to be hidden instead of fixed timeout
        try {
          await page.locator('#onetrust-consent-sdk, #onetrust-banner-sdk').first().waitFor({
            state: 'hidden',
            timeout: 2000,
          });
        } catch {
          // Popup might already be gone
        }
        console.log('[ConsentHelper] ✅ Cookie consent handled successfully');
        return true;
      }

      // If we couldn't click, try pressing Escape key as fallback
      console.log('[ConsentHelper] ⚠️ Button click failed, trying Escape key...');
      await page.keyboard.press('Escape');
      // Wait for popup to disappear after Escape
      try {
        await page.locator('#onetrust-consent-sdk, #onetrust-banner-sdk').first().waitFor({
          state: 'hidden',
          timeout: 2000,
        });
      } catch {
        // Popup might already be gone
      }
      console.log('[ConsentHelper] Escape key pressed');

      return true;
    } catch (error) {
      // Log error but don't fail the test
      console.error('[ConsentHelper] ❌ Cookie consent handling failed:', error);
      return false;
    }
  }

  /**
   * Force accept cookies by setting cookie directly
   * Use this as a fallback if UI interaction doesn't work
   * @param page - Playwright page object
   */
  static async forceAcceptCookies(page: Page): Promise<void> {
    // Set common cookie consent cookies
    const cookies = [
      { name: 'cookie_consent', value: 'accepted', domain: '.superbet.ro', path: '/' },
      { name: 'cookieConsent', value: 'true', domain: '.superbet.ro', path: '/' },
      { name: 'consent', value: 'accepted', domain: '.superbet.ro', path: '/' },
    ];

    for (const cookie of cookies) {
      try {
        await page.context().addCookies([cookie]);
      } catch {
        // Ignore errors - cookie might not be valid for current domain
      }
    }
  }

  /**
   * Handle cookie consent with retry logic
   * @param page - Playwright page object
   * @param maxRetries - Maximum number of retries
   * @returns True if consent was handled successfully
   */
  static async handleCookieConsentWithRetry(
    page: Page,
    maxRetries = 3
  ): Promise<boolean> {
    for (let i = 0; i < maxRetries; i++) {
      const handled = await this.handleCookieConsent(page);
      if (handled) {
        return true;
      }

      if (i < maxRetries - 1) {
        // Wait for popup to potentially appear before retry
        try {
          await page.locator('#onetrust-consent-sdk, #onetrust-banner-sdk').first().waitFor({
            state: 'visible',
            timeout: 1000,
          });
        } catch {
          // Continue retry
        }
      }
    }

    // If UI interaction failed, try forcing cookies
    await this.forceAcceptCookies(page);
    return false;
  }
}
