// test/specs/userAccountMenu.spec.js
// Component – User Account Menu
// Jira: https://mtechqa.atlassian.net/browse/MTQA-5429
//
// Covers (Image 5):
//   • MTECH-QA popover button
//   • Active Account card
//   • Settings button → navigates to settings
//   • Terms of Service link → modal (Image 8)
//   • Privacy Policy link   → modal (Image 7)
//   • Data Processing Agreement link → modal (Image 6)
//   • Close button on each modal

import LoginPage           from '../pageobjects/loginPage.js';
import UserAccountMenuPage from '../pageobjects/userAccountMenuPage.js';

const login = new LoginPage();
const menu  = new UserAccountMenuPage();

describe('User Account Menu', () => {

  before(async () => {
    await login.login();
  });

  // ── Popover button ─────────────────────────────────────────────────────────

  it('UAM-001: account popover button is visible (data-testid=menu-account-popover-button)', async () => {
    const btn = await menu.popoverButton;
    await expect(btn).toBeDisplayed();
  });

  it('UAM-002: account popover button displays "MTECH-QA" label', async () => {
    const btn  = await menu.popoverButton;
    const text = await btn.getText();
    expect(text).toContain('MTECH');
  });

  // ── Open popover ───────────────────────────────────────────────────────────

  it('UAM-003: clicking the account button opens the popover', async () => {
    await menu.openPopover();
    expect(await menu.isPopoverOpen()).toBe(true);
  });

  it('UAM-004: popover shows "Accounts" section header', async () => {
    await menu.ensurePopoverOpen();
    const text = await menu.getPageText();
    expect(text).toContain('Accounts');
  });

  it('UAM-005: popover shows "Active Account" label', async () => {
    await menu.ensurePopoverOpen();
    const text = await menu.getPageText();
    expect(text).toContain('Active Account');
  });

  it('UAM-006: popover shows "MTECH-QA" account name', async () => {
    await menu.ensurePopoverOpen();
    const text = await menu.getPageText();
    expect(text).toContain('MTECH');
  });

  it('UAM-007: Settings button is visible inside the popover', async () => {
    await menu.ensurePopoverOpen();
    const btn = await menu.settingsButton;
    await expect(btn).toBeDisplayed();
  });

  // ── Settings navigation ────────────────────────────────────────────────────

  it('UAM-008: clicking Settings navigates to account/settings', async () => {
    await menu.ensurePopoverOpen();
    await menu.clickSettings();
    expect(await browser.getUrl()).toContain('settings');
  });

  // ── Legal links visible in popover ────────────────────────────────────────

  it('UAM-009: re-open popover to check footer links', async () => {
    await menu.openPopover();
    expect(await menu.isPopoverOpen()).toBe(true);
  });

  it('UAM-010: "Terms of Service" link is in the popover footer', async () => {
    await menu.ensurePopoverOpen();
    const el = await menu.tosLink;
    await expect(el).toBeDisplayed();
  });

  it('UAM-011: Terms of Service link text contains "Terms"', async () => {
    await menu.ensurePopoverOpen();
    const el   = await menu.tosLink;
    const text = (await el.getText()).toLowerCase();
    expect(text).toContain('terms');
  });

  it('UAM-012: "Privacy Policy" link is in the popover footer', async () => {
    await menu.ensurePopoverOpen();
    const el = await menu.privacyLink;
    await expect(el).toBeDisplayed();
  });

  it('UAM-013: Privacy Policy link text contains "Privacy"', async () => {
    await menu.ensurePopoverOpen();
    const el   = await menu.privacyLink;
    const text = (await el.getText()).toLowerCase();
    expect(text).toContain('privacy');
  });

  it('UAM-014: "Data Processing Agreement" link is in the popover footer', async () => {
    await menu.ensurePopoverOpen();
    const el = await menu.dpaLink;
    await expect(el).toBeDisplayed();
  });

  it('UAM-015: Data Processing Agreement link text is correct', async () => {
    await menu.ensurePopoverOpen();
    const el   = await menu.dpaLink;
    const text = (await el.getText()).toLowerCase();
    expect(text).toContain('data processing');
  });

  it('UAM-016: all three footer links exist simultaneously', async () => {
    await menu.ensurePopoverOpen();
    expect(await (await menu.tosLink).isDisplayed()).toBe(true);
    expect(await (await menu.privacyLink).isDisplayed()).toBe(true);
    expect(await (await menu.dpaLink).isDisplayed()).toBe(true);
  });

  // ── Close popover ──────────────────────────────────────────────────────────

  it('UAM-017: clicking outside the popover closes it', async () => {
    await menu.ensurePopoverOpen();
    await menu.closePopoverByClickingOutside();
    expect(await menu.isPopoverOpen()).toBe(false);
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  TERMS OF SERVICE MODAL (Image 8)
  // ══════════════════════════════════════════════════════════════════════════

  describe('Terms of Service modal', () => {

    it('UAM-018: clicking Terms of Service opens a modal', async () => {
      await login.loginIfNeeded();
      await menu.clickTermsOfService();
      expect(await menu.isModalOpen()).toBe(true);
    });

    it('UAM-019: modal heading contains "Terms of Service"', async () => {
      expect(await menu.modalContains('Terms of Service')).toBe(true);
    });

    it('UAM-020: modal shows effective date 2/23/2026', async () => {
      expect(await menu.modalContains('2/23/2026')).toBe(true);
    });

    it('UAM-021: modal contains "Service" definition', async () => {
      expect(await menu.modalContains('Service')).toBe(true);
    });

    it('UAM-022: modal contains "Content" definition', async () => {
      expect(await menu.modalContains('Content')).toBe(true);
    });

    it('UAM-023: modal contains "Confidential Information"', async () => {
      expect(await menu.modalContains('Confidential Information')).toBe(true);
    });

    it('UAM-024: modal contains "Third Party Services"', async () => {
      expect(await menu.modalContains('Third Party Services')).toBe(true);
    });

    it('UAM-025: modal contains "Beta Features"', async () => {
      expect(await menu.modalContains('Beta Features')).toBe(true);
    });

    it('UAM-026: Close button is present in the modal', async () => {
      const buttons = await $$('button');
      let found = false;
      for (const btn of buttons) {
        if ((await btn.getText().catch(() => '')).trim() === 'Close') { found = true; break; }
      }
      expect(found).toBe(true);
    });

    it('UAM-027: clicking Close dismisses the Terms of Service modal', async () => {
      await menu.closeModal();
      // After close the modal content should be gone
      const text = await menu.getPageText();
      expect(text.includes('Beta Features')).toBe(false);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  PRIVACY POLICY MODAL (Image 7)
  // ══════════════════════════════════════════════════════════════════════════

  describe('Privacy Policy modal', () => {

    it('UAM-028: clicking Privacy Policy opens a modal', async () => {
      await login.loginIfNeeded();
      await menu.clickPrivacyPolicy();
      expect(await menu.isModalOpen()).toBe(true);
    });

    it('UAM-029: modal heading contains "Privacy Policy"', async () => {
      expect(await menu.modalContains('Privacy Policy')).toBe(true);
    });

    it('UAM-030: modal shows effective date 2/23/2026', async () => {
      expect(await menu.modalContains('2/23/2026')).toBe(true);
    });

    it('UAM-031: modal mentions "Information We Collect"', async () => {
      expect(await menu.modalContains('Information We Collect')).toBe(true);
    });

    it('UAM-032: modal mentions "Use of Information"', async () => {
      expect(await menu.modalContains('Use of Information')).toBe(true);
    });

    it('UAM-033: Close button is present in the Privacy Policy modal', async () => {
      const buttons = await $$('button');
      let found = false;
      for (const btn of buttons) {
        if ((await btn.getText().catch(() => '')).trim() === 'Close') { found = true; break; }
      }
      expect(found).toBe(true);
    });

    it('UAM-034: clicking Close dismisses the Privacy Policy modal', async () => {
      await menu.closeModal();
      const text = await menu.getPageText();
      expect(text.includes('Information We Collect')).toBe(false);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  DATA PROCESSING AGREEMENT MODAL (Image 6)
  // ══════════════════════════════════════════════════════════════════════════

  describe('Data Processing Agreement modal', () => {

    it('UAM-035: clicking Data Processing Agreement opens a modal', async () => {
      await login.loginIfNeeded();
      await menu.clickDataProcessingAgreement();
      expect(await menu.isModalOpen()).toBe(true);
    });

    it('UAM-036: modal heading contains "Data Processing Agreement"', async () => {
      expect(await menu.modalContains('Data Processing Agreement')).toBe(true);
    });

    it('UAM-037: modal shows effective date 2/23/2026', async () => {
      expect(await menu.modalContains('2/23/2026')).toBe(true);
    });

    it('UAM-038: modal mentions GDPR', async () => {
      expect(await menu.modalContains('GDPR')).toBe(true);
    });

    it('UAM-039: modal mentions CCPA', async () => {
      expect(await menu.modalContains('CCPA')).toBe(true);
    });

    it('UAM-040: modal identifies Customer as Controller', async () => {
      expect(await menu.modalContains('Controller')).toBe(true);
    });

    it('UAM-041: modal identifies Provider as Processor', async () => {
      expect(await menu.modalContains('Processor')).toBe(true);
    });

    it('UAM-042: modal mentions "Roles of the Parties"', async () => {
      expect(await menu.modalContains('Roles of the Parties')).toBe(true);
    });

    it('UAM-043: Close button is present in the DPA modal', async () => {
      const buttons = await $$('button');
      let found = false;
      for (const btn of buttons) {
        if ((await btn.getText().catch(() => '')).trim() === 'Close') { found = true; break; }
      }
      expect(found).toBe(true);
    });

    it('UAM-044: clicking Close dismisses the DPA modal', async () => {
      await menu.closeModal();
      const text = await menu.getPageText();
      expect(text.includes('Roles of the Parties')).toBe(false);
    });
  });
});