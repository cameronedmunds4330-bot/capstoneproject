// test/pageobjects/userAccountMenuPage.js
// All selectors sourced from the diagnostic output (OUTPUT.TXT).
//
// Key testids:
//   menu-account-popover-button   – the MTECH-QA avatar button (top right)
//   account-control-settings-button – "Settings" inside the popover
//   menu-logout-button            – logout icon (top bar, always visible)
//   menu-terms-of-service-link    – ToS button in popover footer
//   menu-privacy-policy-link      – Privacy Policy button
//   menu-data-processing-agreement-link – DPA button

import { WAIT } from '../helpers/constants.js';

export default class UserAccountMenuPage {

  // ── Selectors ─────────────────────────────────────────────────────────────
  get popoverButton()   { return $('[data-testid="menu-account-popover-button"]'); }
  get settingsButton()  { return $('[data-testid="account-control-settings-button"]'); }
  get logoutButton()    { return $('[data-testid="menu-logout-button"]'); }
  get tosLink()         { return $('[data-testid="menu-terms-of-service-link"]'); }
  get privacyLink()     { return $('[data-testid="menu-privacy-policy-link"]'); }
  get dpaLink()         { return $('[data-testid="menu-data-processing-agreement-link"]'); }

  // ── Helpers ───────────────────────────────────────────────────────────────

  async getPageText() {
    return await browser.execute(() => document.body.innerText || '');
  }

  // ── Open / close the account popover ─────────────────────────────────────

  async openPopover() {
    const btn = await this.popoverButton;
    await btn.waitForDisplayed({ timeout: 10000 });
    await btn.click();
    await browser.pause(WAIT.MEDIUM);
  }

  async isPopoverOpen() {
    // The popover contains the Settings button when open
    const el = await this.settingsButton;
    return await el.isDisplayed().catch(() => false);
  }

  async ensurePopoverOpen() {
    if (!(await this.isPopoverOpen())) await this.openPopover();
  }

  async closePopoverByClickingOutside() {
    await $('body').click();
    await browser.pause(WAIT.MEDIUM);
  }

  // ── Navigation via Settings ───────────────────────────────────────────────

  async clickSettings() {
    await this.ensurePopoverOpen();
    const btn = await this.settingsButton;
    await btn.waitForDisplayed({ timeout: 5000 });
    await btn.click();
    await browser.pause(WAIT.LONG);
  }

  // ── Legal document links (in popover footer) ──────────────────────────────

  async clickTermsOfService() {
    await this.ensurePopoverOpen();
    await (await this.tosLink).click();
    await browser.pause(WAIT.LONG);
  }

  async clickPrivacyPolicy() {
    await this.ensurePopoverOpen();
    await (await this.privacyLink).click();
    await browser.pause(WAIT.LONG);
  }

  async clickDataProcessingAgreement() {
    await this.ensurePopoverOpen();
    await (await this.dpaLink).click();
    await browser.pause(WAIT.LONG);
  }

  // ── Modal helpers (legal docs open in a modal overlay) ────────────────────

  async isModalOpen() {
    const text = await this.getPageText();
    return (
      text.includes('Terms of Service') ||
      text.includes('Privacy Policy')   ||
      text.includes('Data Processing Agreement')
    ) && text.includes('Close');
  }

  async modalContains(phrase) {
    const text = await this.getPageText();
    return text.includes(phrase);
  }

  async closeModal() {
    const buttons = await $$('button');
    for (const btn of buttons) {
      const t = (await btn.getText().catch(() => '')).trim();
      if (t === 'Close') {
        await btn.click();
        await browser.pause(WAIT.MEDIUM);
        return;
      }
    }
    // Fallback: press Escape
    await browser.keys('Escape');
    await browser.pause(WAIT.MEDIUM);
  }

  // ── Logout ─────────────────────────────────────────────────────────────────

  async clickLogout() {
    const btn = await this.logoutButton;
    await btn.waitForDisplayed({ timeout: 10000 });
    await btn.click();
    await browser.pause(WAIT.LONG);
  }

  // Check whether we are on the login page after logout
  async isOnLoginPage() {
    const url  = await browser.getUrl();
    const text = await this.getPageText();
    return url.endsWith('/') || text.includes('Login') || text.includes('Username');
  }
}