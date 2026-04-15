// test/pageobjects/accountInfoPage.js
//
// Key testids (from OUTPUT.TXT diagnostic):
//   account-settings-account-info-tab
//   account-info-account-name-input
//   account-info-address1-input
//   account-info-address2-input
//   account-info-city-input
//   account-info-state-input
//   account-info-zip-input
//   account-info-upload-logo-button

import { WAIT } from '../helpers/constants.js';

export default class AccountInfoPage {

  // ── Selectors ─────────────────────────────────────────────────────────────
  get accountNameInput()  { return $('[data-testid="account-info-account-name-input"]'); }
  get address1Input()     { return $('[data-testid="account-info-address1-input"]'); }
  get address2Input()     { return $('[data-testid="account-info-address2-input"]'); }
  get cityInput()         { return $('[data-testid="account-info-city-input"]'); }
  get stateInput()        { return $('[data-testid="account-info-state-input"]'); }
  get zipInput()          { return $('[data-testid="account-info-zip-input"]'); }
  get uploadLogoButton()  { return $('[data-testid="account-info-upload-logo-button"]'); }
  get accountInfoTab()    { return $('[data-testid="account-settings-account-info-tab"]'); }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async goToAccountInfo() {
    await browser.url('https://app.thecasework.com/account/settings');
    await browser.pause(WAIT.PAGE_LOAD);
    const tab = await this.accountInfoTab;
    await tab.waitForDisplayed({ timeout: 10000 });
    await tab.click();
    await browser.pause(WAIT.LONG);
  }

  async getPageText() {
    return await browser.execute(() => document.body.innerText || '');
  }

  // ── Field helpers ──────────────────────────────────────────────────────────

  async getAccountNameValue() {
    return await (await this.accountNameInput).getValue();
  }

  async hasLogoSection() {
    const text = await this.getPageText();
    return text.includes('Account Logo') || text.includes('Upload');
  }

  async getUploadButton() {
    return await this.uploadLogoButton;
  }

  async getActiveAccountText() {
    const text = await this.getPageText();
    return text.includes('Active Account');
  }

  async hasSubscriptionSection() {
    const text = await this.getPageText();
    return text.includes('User Licenses') || text.includes('Storage Limit') || text.includes('Subscription');
  }

  async hasFeaturesSection() {
    const text = await this.getPageText();
    return text.includes('Basic Subscription') || text.includes('Professional Subscription') || text.includes('Features');
  }

  async isFeatureVisible(featureName) {
    const text = await this.getPageText();
    return text.includes(featureName);
  }
}