
import { URLS, WAIT } from '../helpers/constants.js';

export default class LegalDocsPage {

  // ── Navigation ─────────────────────────────────────────────────────────────

  async goToAccountSettings() {
    await browser.url(URLS.SETTINGS);
    await browser.pause(WAIT.PAGE_LOAD);
  }

  async getPageText() {
    return await browser.execute(() => document.body.innerText || '');
  }

  // ── Link helpers ───────────────────────────────────────────────────────────

  async isLinkVisible(linkText) {
    const allEls = await $$('a, button, span');
    for (const el of allEls) {
      const text = await el.getText().catch(() => '');
      if (text.trim() === linkText) return true;
    }
    return false;
  }

  async clickLink(linkText) {
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

  // ── Modal helpers ──────────────────────────────────────────────────────────

  async isModalOpen() {
    // Check for a modal / dialog overlay
    const dialog = await $('[role="dialog"], .modal, [class*="modal"]');
    if (await dialog.isExisting()) return true;
    // Fallback: look for a Close button (present in all three modals)
    const text = await this.getPageText();
    return text.includes('Close') && (
      text.includes('Terms of Service') ||
      text.includes('Privacy Policy') ||
      text.includes('Data Processing Agreement')
    );
  }

  async getModalText() {
    // Try to read from the dialog element first
    const dialog = await $('[role="dialog"], .modal, [class*="modal"]');
    if (await dialog.isExisting()) {
      return await dialog.getText().catch(() => '');
    }
    return await this.getPageText();
  }

  async modalContains(expectedText) {
    const text = await this.getModalText();
    return text.includes(expectedText);
  }

  async closeModal() {
    // Click the "Close" button
    const buttons = await $$('button');
    for (const btn of buttons) {
      const text = await btn.getText().catch(() => '');
      if (text.trim() === 'Close') {
        await btn.click();
        await browser.pause(WAIT.MEDIUM);
        return;
      }
    }
  }

  // ── Convenience methods for each document ──────────────────────────────────

  async openTermsOfService() {
    await this.clickLink('Terms of Service');
  }

  async openPrivacyPolicy() {
    await this.clickLink('Privacy Policy');
  }

  async openDataProcessingAgreement() {
    await this.clickLink('Data Processing Agreement');
  }
}