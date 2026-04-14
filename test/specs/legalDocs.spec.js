// test/specs/legalDocs.spec.js
import LegalDocsPage from '../pageobjects/legalDocsPage.js';
import { LEGAL_DOCS } from '../helpers/constants.js';

const page = new LegalDocsPage();

describe('Legal Documents – Terms of Service, Privacy Policy, DPA', () => {

  before(async () => {
    await page.goToAccountSettings();
  });

  // ── Link visibility ────────────────────────────────────────────────────────

  LEGAL_DOCS.forEach((doc) => {
    it(`should display the "${doc}" link`, async () => {
      const visible = await page.isLinkVisible(doc);
      expect(visible).toBe(true);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  TERMS OF SERVICE
  // ══════════════════════════════════════════════════════════════════════════

  describe('Terms of Service modal', () => {

    it('should open the Terms of Service modal', async () => {
      await page.openTermsOfService();
      const open = await page.isModalOpen();
      expect(open).toBe(true);
    });

    it('should contain "Terms of Service" in the modal text', async () => {
      const has = await page.modalContains('Terms of Service');
      expect(has).toBe(true);
    });

    it('should show the effective date 2/23/2026', async () => {
      const has = await page.modalContains('2/23/2026');
      expect(has).toBe(true);
    });

    it('should mention "Service" definition', async () => {
      const has = await page.modalContains('Service');
      expect(has).toBe(true);
    });

    it('should mention "Content" definition', async () => {
      const has = await page.modalContains('Content');
      expect(has).toBe(true);
    });

    it('should mention "Confidential Information"', async () => {
      const has = await page.modalContains('Confidential Information');
      expect(has).toBe(true);
    });

    it('should mention "Third Party Services"', async () => {
      const has = await page.modalContains('Third Party Services');
      expect(has).toBe(true);
    });

    it('should mention "Beta Features"', async () => {
      const has = await page.modalContains('Beta Features');
      expect(has).toBe(true);
    });

    it('should close the modal', async () => {
      await page.closeModal();
      const open = await page.isModalOpen();
      expect(open).toBe(false);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  PRIVACY POLICY
  // ══════════════════════════════════════════════════════════════════════════

  describe('Privacy Policy modal', () => {

    it('should open the Privacy Policy modal', async () => {
      await page.openPrivacyPolicy();
      const open = await page.isModalOpen();
      expect(open).toBe(true);
    });

    it('should contain "Privacy Policy" in the modal text', async () => {
      const has = await page.modalContains('Privacy Policy');
      expect(has).toBe(true);
    });

    it('should show the effective date 2/23/2026', async () => {
      const has = await page.modalContains('2/23/2026');
      expect(has).toBe(true);
    });

    it('should mention information collection', async () => {
      const has = await page.modalContains('Information We Collect');
      expect(has).toBe(true);
    });

    it('should mention use of information', async () => {
      const has = await page.modalContains('Use of Information');
      expect(has).toBe(true);
    });

    it('should close the modal', async () => {
      await page.closeModal();
      const open = await page.isModalOpen();
      expect(open).toBe(false);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  DATA PROCESSING AGREEMENT
  // ══════════════════════════════════════════════════════════════════════════

  describe('Data Processing Agreement modal', () => {

    it('should open the Data Processing Agreement modal', async () => {
      await page.openDataProcessingAgreement();
      const open = await page.isModalOpen();
      expect(open).toBe(true);
    });

    it('should contain "Data Processing Agreement" in the modal text', async () => {
      const has = await page.modalContains('Data Processing Agreement');
      expect(has).toBe(true);
    });

    it('should show the effective date 2/23/2026', async () => {
      const has = await page.modalContains('2/23/2026');
      expect(has).toBe(true);
    });

    it('should mention GDPR', async () => {
      const has = await page.modalContains('GDPR');
      expect(has).toBe(true);
    });

    it('should mention CCPA', async () => {
      const has = await page.modalContains('CCPA');
      expect(has).toBe(true);
    });

    it('should identify Customer as Controller', async () => {
      const has = await page.modalContains('Controller');
      expect(has).toBe(true);
    });

    it('should identify Provider as Processor', async () => {
      const has = await page.modalContains('Processor');
      expect(has).toBe(true);
    });

    it('should close the modal', async () => {
      await page.closeModal();
      const open = await page.isModalOpen();
      expect(open).toBe(false);
    });
  });
});
