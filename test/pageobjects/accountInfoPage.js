// test/pageobjects/accountInfoPage.js
// Page object for the Account Info tab inside Account Settings

import { URLS, WAIT } from '../helpers/constants.js';

export default class AccountInfoPage {

  // ── Navigation ─────────────────────────────────────────────────────────────

  async goToAccountInfo() {
    await browser.url(URLS.SETTINGS);
    await browser.pause(WAIT.PAGE_LOAD);
    // "Account Info" is typically the default tab, but click it to be safe
    await this.clickSidebarItem('Account Info');
  }

  async clickSidebarItem(label) {
    const allEls = await $$('a, button, [role="tab"], li, span');
    for (const el of allEls) {
      const text = await el.getText().catch(() => '');
      if (text.trim() === label) {
        await el.click();
        await browser.pause(WAIT.LONG);
        return;
      }
    }
  }

  // ── Page text helper (works even when $('body').getText() returns '') ──────

  async getPageText() {
    return await browser.execute(() => document.body.innerText || '');
  }

  // ── Account Name ───────────────────────────────────────────────────────────

  async getAccountNameInput() {
    // Try placeholder first, then fall back to the first text input
    const el = await $('input[placeholder*="Account Name" i]');
    if (await el.isExisting()) return el;
    return await $('input[type="text"]');
  }

  async getAccountNameValue() {
    const input = await this.getAccountNameInput();
    return await input.getValue();
  }

  // ── Address fields ─────────────────────────────────────────────────────────

  async getFieldByLabel(labelText) {
    // Searches all inputs by checking nearby label / placeholder text
    const inputs = await $$('input');
    for (const input of inputs) {
      const ph = await input.getAttribute('placeholder').catch(() => '');
      if (ph && ph.toLowerCase().includes(labelText.toLowerCase())) return input;
    }
    // Fallback: look for a label element whose text matches
    const labels = await $$('label');
    for (const lbl of labels) {
      const txt = await lbl.getText().catch(() => '');
      if (txt.toLowerCase().includes(labelText.toLowerCase())) {
        const forId = await lbl.getAttribute('for').catch(() => '');
        if (forId) {
          const el = await $(`#${forId}`);
          if (await el.isExisting()) return el;
        }
      }
    }
    return null;
  }

  async getAddressInput()  { return this.getFieldByLabel('Address');   }
  async getAddress2Input() { return this.getFieldByLabel('Address 2'); }
  async getCityInput()     { return this.getFieldByLabel('City');      }
  async getStateInput()    { return this.getFieldByLabel('State');     }
  async getZipInput()      { return this.getFieldByLabel('Zip');       }

  // ── Account Logo ───────────────────────────────────────────────────────────

  async getUploadButton() {
    const buttons = await $$('button');
    for (const btn of buttons) {
      const text = await btn.getText().catch(() => '');
      if (text.toLowerCase().includes('upload')) return btn;
    }
    return null;
  }

  async hasLogoSection() {
    const text = await this.getPageText();
    return text.includes('Account Logo');
  }

  // ── Active Account card ────────────────────────────────────────────────────

  async getActiveAccountText() {
    const text = await this.getPageText();
    return text.includes('Active Account');
  }

  async getSettingsButton() {
    const buttons = await $$('button');
    for (const btn of buttons) {
      if ((await btn.getText().catch(() => '')).trim() === 'Settings') return btn;
    }
    return null;
  }

  // ── Subscription & Features ────────────────────────────────────────────────

  async hasSubscriptionSection() {
    const text = await this.getPageText();
    return text.includes('User Licenses') && text.includes('Storage Limit');
  }

  async hasFeaturesSection() {
    const text = await this.getPageText();
    return text.includes('Basic Subscription') || text.includes('Professional Subscription');
  }

  async isFeatureVisible(featureName) {
    const text = await this.getPageText();
    return text.includes(featureName);
  }

  // ── Legal document links ───────────────────────────────────────────────────

  async clickLegalLink(linkText) {
    const allEls = await $$('a, button, span');
    for (const el of allEls) {
      const text = await el.getText().catch(() => '');
      if (text.trim() === linkText) {
        await el.click();
        await browser.pause(WAIT.LONG);
        return;
      }
    }
  }
}
