/**
 * Centralized selector constants for Superbet.ro
 * All selectors should be defined here for maintainability
 */

export const HeaderSelectors = {
  // Navigation links
  sportLink: 'a[href*="/pariuri-sportive"]:not([href*="/live"])',
  liveLink: 'a[href*="/pariuri-sportive/live"]',
  supersocialLink: 'a[href*="/social/noutati"]',
  bileteleMeleLink: 'a[href*="/pariurile-mele/deschise"]',
  casinoLink: 'a[href*="/casino"]:not([href*="/casino-live"])',
  casinoLiveLink: 'a[href*="/casino/casino-live"]',

  // Action buttons
  searchIcon: '[data-testid="search-icon"], .search-icon, button[aria-label*="search" i]',
  userProfileIcon: 'button[aria-label*="Toggle user dropdown"]',
  registerButton: '//*[text()="înregistrare"]',
  loginButton: '//*[text()="Intră în cont"]',
} as const;

export const SportPageSelectors = {
  leftSidebar: '.left-sidebar',
  subPageLinks: '.sidebar a, [data-testid="sidebar"] a, aside a',
  socialNouButton: 'button:has-text("Social Nou"), [data-testid="social-nou"]',
  calendarButton: 'button:has-text("Calendar"), [data-testid="calendar"]',
  competitiiButton: 'button:has-text("Competiții"), [data-testid="competitii"]',
} as const;

export const LivePageSelectors = {
  leftSidebar: '.left-sidebar',
  toateLink: 'a[href*="/pariuri-sportive/astazi"], a:has-text("Toate")',
  fotbalLink: 'a:has-text("Fotbal"), a[href*="/fotbal"]',
} as const;

export const ConsentSelectors = {
  // OneTrust cookie consent - PRIMARY SELECTORS (verified working)
  acceptButton: '#onetrust-accept-btn-handler',
  acceptAllButton: '#onetrust-accept-btn-handler',
  rejectAllButton: '#onetrust-reject-all-handler',
  cookieSettingsButton: '#onetrust-pc-btn-handler',
  
  // Cookie consent popup/overlay selectors (OneTrust)
  consentPopup: '#onetrust-consent-sdk, #onetrust-banner-sdk, .onetrust-pc-sdk',
  consentOverlay: '#onetrust-consent-sdk, #onetrust-banner-sdk',
  
  // Alternative selectors (fallback)
  alternativeAccept: 'button:has-text("Acceptați toate cookie-urile"), button:has-text("Acceptă toate")',
} as const;
