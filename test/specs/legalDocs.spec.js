// test/specs/legalDocs.spec.js
// Legal Documents accessed from Account Settings page
// Covers Images 6 (DPA), 7 (Privacy Policy), 8 (Terms of Service)
//
// The legal doc links are BUTTONS (not anchors) in the page footer.
// They are also accessible via the User Account Menu popover.
// This spec tests them via the Account Settings page where they are
// rendered as standalone link buttons at the bottom of the page.

import LoginPage           from '../pageobjects/loginPage.js';
import UserAccountMenuPage from '../pageobjects/userAccountMenuPage.js';

const login = new LoginPage();
const menu  = new UserAccountMenuPage();

describe('Legal Documents (Terms of Service, Privacy Policy, DPA)', () => {

  before(async () => {
    await login.login();
    // Navigate to settings so the legal links are on screen
    await browser.url('https://app.thecasework.com/account/settings');
    await browser.pause(3000);
  });

  // ── Link visibility (bottom of Account Settings / popover) ────────────────

  it('LD-001: "Terms of Service" link/button is present on the settings page', async () => {
    const el = await $('[data-testid="menu-terms-of-service-link"]');
    // It may be in the always-visible footer or require opening the popover
    if (!(await el.isExisting())) {
      await menu.openPopover();
      await browser.pause(500);
    }
    const el2 = await $('[data-testid="menu-terms-of-service-link"]');
    await expect(el2).toBeExisting();
  });

  it('LD-002: "Privacy Policy" link/button is present', async () => {
    await menu.ensurePopoverOpen();
    const el = await $('[data-testid="menu-privacy-policy-link"]');
    await expect(el).toBeExisting();
  });

  it('LD-003: "Data Processing Agreement" link/button is present', async () => {
    await menu.ensurePopoverOpen();
    const el = await $('[data-testid="menu-data-processing-agreement-link"]');
    await expect(el).toBeExisting();
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  TERMS OF SERVICE (Image 8)
  // ══════════════════════════════════════════════════════════════════════════

  describe('Terms of Service modal', () => {

    before(async () => {
      await login.loginIfNeeded();
      await menu.clickTermsOfService();
    });

    it('LD-ToS-01: clicking Terms of Service opens a modal overlay', async () => {
      expect(await menu.isModalOpen()).toBe(true);
    });

    it('LD-ToS-02: modal displays "Terms of Service" as heading', async () => {
      expect(await menu.modalContains('Terms of Service')).toBe(true);
    });

    it('LD-ToS-03: modal shows "theCaseWork" branding', async () => {
      expect(await menu.modalContains('theCaseWork')).toBe(true);
    });

    it('LD-ToS-04: effective date is 2/23/2026', async () => {
      expect(await menu.modalContains('2/23/2026')).toBe(true);
    });

    it('LD-ToS-05: "Last Updated" date is shown', async () => {
      expect(await menu.modalContains('Last Updated')).toBe(true);
    });

    it('LD-ToS-06: Definitions section is present', async () => {
      expect(await menu.modalContains('Definitions')).toBe(true);
    });

    it('LD-ToS-07: "Service" term is defined', async () => {
      expect(await menu.modalContains('Service')).toBe(true);
    });

    it('LD-ToS-08: "Content" term is defined', async () => {
      expect(await menu.modalContains('Content')).toBe(true);
    });

    it('LD-ToS-09: "Confidential Information" is mentioned', async () => {
      expect(await menu.modalContains('Confidential Information')).toBe(true);
    });

    it('LD-ToS-10: "Third Party Services" is mentioned', async () => {
      expect(await menu.modalContains('Third Party Services')).toBe(true);
    });

    it('LD-ToS-11: "Beta Features" is mentioned', async () => {
      expect(await menu.modalContains('Beta Features')).toBe(true);
    });

    it('LD-ToS-12: binding agreement language is present', async () => {
      expect(await menu.modalContains('binding agreement')).toBe(true);
    });

    it('LD-ToS-13: Close button is present in the modal', async () => {
      let found = false;
      for (const btn of await $$('button')) {
        if ((await btn.getText().catch(() => '')).trim() === 'Close') { found = true; break; }
      }
      expect(found).toBe(true);
    });

    it('LD-ToS-14: clicking Close dismisses the Terms of Service modal', async () => {
      await menu.closeModal();
      expect(await menu.modalContains('Beta Features')).toBe(false);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  PRIVACY POLICY (Image 7)
  // ══════════════════════════════════════════════════════════════════════════

  describe('Privacy Policy modal', () => {

    before(async () => {
      await login.loginIfNeeded();
      await menu.clickPrivacyPolicy();
    });

    it('LD-PP-01: clicking Privacy Policy opens a modal overlay', async () => {
      expect(await menu.isModalOpen()).toBe(true);
    });

    it('LD-PP-02: modal displays "Privacy Policy" as heading', async () => {
      expect(await menu.modalContains('Privacy Policy')).toBe(true);
    });

    it('LD-PP-03: modal shows "theCaseWork" branding', async () => {
      expect(await menu.modalContains('theCaseWork')).toBe(true);
    });

    it('LD-PP-04: effective date is 2/23/2026', async () => {
      expect(await menu.modalContains('2/23/2026')).toBe(true);
    });

    it('LD-PP-05: "Last Updated" date is shown', async () => {
      expect(await menu.modalContains('Last Updated')).toBe(true);
    });

    it('LD-PP-06: section 1 "Information We Collect" is present', async () => {
      expect(await menu.modalContains('Information We Collect')).toBe(true);
    });

    it('LD-PP-07: section 2 "Use of Information" is present', async () => {
      expect(await menu.modalContains('Use of Information')).toBe(true);
    });

    it('LD-PP-08: mentions collecting registration and billing information', async () => {
      expect(await menu.modalContains('registration')).toBe(true);
    });

    it('LD-PP-09: mentions Third Party Services integration', async () => {
      expect(await menu.modalContains('Third Party Services')).toBe(true);
    });

    it('LD-PP-10: Close button is present', async () => {
      let found = false;
      for (const btn of await $$('button')) {
        if ((await btn.getText().catch(() => '')).trim() === 'Close') { found = true; break; }
      }
      expect(found).toBe(true);
    });

    it('LD-PP-11: clicking Close dismisses the Privacy Policy modal', async () => {
      await menu.closeModal();
      expect(await menu.modalContains('Information We Collect')).toBe(false);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  DATA PROCESSING AGREEMENT (Image 6)
  // ══════════════════════════════════════════════════════════════════════════

  describe('Data Processing Agreement modal', () => {

    before(async () => {
      await login.loginIfNeeded();
      await menu.clickDataProcessingAgreement();
    });

    it('LD-DPA-01: clicking Data Processing Agreement opens a modal overlay', async () => {
      expect(await menu.isModalOpen()).toBe(true);
    });

    it('LD-DPA-02: modal displays "Data Processing Agreement" as heading', async () => {
      expect(await menu.modalContains('Data Processing Agreement')).toBe(true);
    });

    it('LD-DPA-03: modal shows "theCaseWork" branding', async () => {
      expect(await menu.modalContains('theCaseWork')).toBe(true);
    });

    it('LD-DPA-04: effective date is 2/23/2026', async () => {
      expect(await menu.modalContains('2/23/2026')).toBe(true);
    });

    it('LD-DPA-05: "Last Updated" date is shown', async () => {
      expect(await menu.modalContains('Last Updated')).toBe(true);
    });

    it('LD-DPA-06: "Roles of the Parties" section is present', async () => {
      expect(await menu.modalContains('Roles of the Parties')).toBe(true);
    });

    it('LD-DPA-07: mentions GDPR', async () => {
      expect(await menu.modalContains('GDPR')).toBe(true);
    });

    it('LD-DPA-08: mentions CCPA', async () => {
      expect(await menu.modalContains('CCPA')).toBe(true);
    });

    it('LD-DPA-09: identifies Customer as "Controller"', async () => {
      expect(await menu.modalContains('Controller')).toBe(true);
    });

    it('LD-DPA-10: identifies Provider as "Processor"', async () => {
      expect(await menu.modalContains('Processor')).toBe(true);
    });

    it('LD-DPA-11: "Subject Matter and Duration" section is present', async () => {
      expect(await menu.modalContains('Subject Matter and Duration')).toBe(true);
    });

    it('LD-DPA-12: Close button is present', async () => {
      let found = false;
      for (const btn of await $$('button')) {
        if ((await btn.getText().catch(() => '')).trim() === 'Close') { found = true; break; }
      }
      expect(found).toBe(true);
    });

    it('LD-DPA-13: clicking Close dismisses the DPA modal', async () => {
      await menu.closeModal();
      expect(await menu.modalContains('Roles of the Parties')).toBe(false);
    });
  });
});