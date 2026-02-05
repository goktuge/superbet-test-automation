import { Page } from '@playwright/test';

import { BaseComponent } from '../base/BaseComponent';
import { HeaderSelectors } from '../selectors/selectors';

/**
 * Header Component Page Object
 * Handles all header navigation and interactions
 */
export class HeaderComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, 'header, [data-testid="header"], nav');
  }

  /**
   * Click Sport link
   */
  async clickSportLink(): Promise<void> {
    await this.click(HeaderSelectors.sportLink);
  }

  /**
   * Click Live link
   */
  async clickLiveLink(): Promise<void> {
    await this.click(HeaderSelectors.liveLink);
  }

  /**
   * Click Supersocial link
   */
  async clickSupersocialLink(): Promise<void> {
    await this.click(HeaderSelectors.supersocialLink);
  }

  /**
   * Click Biletele Mele link
   */
  async clickBileteleMeleLink(): Promise<void> {
    await this.click(HeaderSelectors.bileteleMeleLink);
  }

  /**
   * Click Casino link
   */
  async clickCasinoLink(): Promise<void> {
    await this.click(HeaderSelectors.casinoLink);
  }

  /**
   * Click Casino Live link
   */
  async clickCasinoLiveLink(): Promise<void> {
    await this.click(HeaderSelectors.casinoLiveLink);
  }

  /**
   * Click Search icon
   */
  async clickSearchIcon(): Promise<void> {
    await this.click(HeaderSelectors.searchIcon);
  }

  /**
   * Click User Profile icon
   */
  async clickUserProfileIcon(): Promise<void> {
    await this.click(HeaderSelectors.userProfileIcon);
  }

  /**
   * Click Register button
   */
  async clickRegisterButton(): Promise<void> {
    await this.click(HeaderSelectors.registerButton);
  }

  /**
   * Click Login button
   */
  async clickLoginButton(): Promise<void> {
    await this.click(HeaderSelectors.loginButton);
  }

  /**
   * Verify all header links are present
   * @returns Object with verification results for each link
   */
  async verifyAllLinksPresent(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    results.sport = await this.isSelectorVisible(HeaderSelectors.sportLink);
    results.live = await this.isSelectorVisible(HeaderSelectors.liveLink);
    results.supersocial = await this.isSelectorVisible(HeaderSelectors.supersocialLink);
    results.bileteleMele = await this.isSelectorVisible(HeaderSelectors.bileteleMeleLink);
    results.casino = await this.isSelectorVisible(HeaderSelectors.casinoLink);
    results.casinoLive = await this.isSelectorVisible(HeaderSelectors.casinoLiveLink);
    results.search = await this.isSelectorVisible(HeaderSelectors.searchIcon);
    results.userProfile = await this.isSelectorVisible(HeaderSelectors.userProfileIcon);
    results.register = await this.isSelectorVisible(HeaderSelectors.registerButton);
    results.login = await this.isSelectorVisible(HeaderSelectors.loginButton);

    return results;
  }

  /**
   * Verify link navigates to correct URL
   * @param linkSelector - Selector for the link
   * @param expectedUrl - Expected URL pattern
   * @returns True if URL matches, false otherwise
   */
  async verifyLinkNavigation(linkSelector: string, expectedUrl: string | RegExp): Promise<boolean> {
    try {
      await this.click(linkSelector);
      await this.page.waitForURL(expectedUrl, { timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }
}
