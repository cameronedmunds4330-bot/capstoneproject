// test/specs/accountInfo.spec.js
import AccountInfoPage from '../pageobjects/accountInfoPage.js';
import { FEATURES } from '../helpers/constants.js';

const page = new AccountInfoPage();

describe('Account Info – Account Settings page', () => {

  before(async () => {
    await page.goToAccountInfo();
  });

  // ── Account Name ───────────────────────────────────────────────────────────

  it('should display the Account Name input', async () => {
    const input = await page.getAccountNameInput();
    await expect(input).toBeExisting();
  });

  it('should have a non-empty Account Name value', async () => {
    const value = await page.getAccountNameValue();
    expect(value.length).toBeGreaterThan(0);
  });

  // ── Address fields ─────────────────────────────────────────────────────────

  it('should display the Address field', async () => {
    const el = await page.getAddressInput();
    expect(el).not.toBeNull();
  });

  it('should display the Address 2 field', async () => {
    const el = await page.getAddress2Input();
    expect(el).not.toBeNull();
  });

  it('should display the City field', async () => {
    const el = await page.getCityInput();
    expect(el).not.toBeNull();
  });

  it('should display the State field', async () => {
    const el = await page.getStateInput();
    expect(el).not.toBeNull();
  });

  it('should display the Zip field', async () => {
    const el = await page.getZipInput();
    expect(el).not.toBeNull();
  });

  // ── Account Logo ───────────────────────────────────────────────────────────

  it('should show the Account Logo section', async () => {
    const visible = await page.hasLogoSection();
    expect(visible).toBe(true);
  });

  it('should display the Upload from file button', async () => {
    const btn = await page.getUploadButton();
    expect(btn).not.toBeNull();
  });

  // ── Active Account card ────────────────────────────────────────────────────

  it('should display Active Account text', async () => {
    const hasIt = await page.getActiveAccountText();
    expect(hasIt).toBe(true);
  });

  it('should display the Settings button', async () => {
    const btn = await page.getSettingsButton();
    expect(btn).not.toBeNull();
  });

  // ── Subscription ───────────────────────────────────────────────────────────

  it('should show User Licenses and Storage Limit', async () => {
    const visible = await page.hasSubscriptionSection();
    expect(visible).toBe(true);
  });

  // ── Features ───────────────────────────────────────────────────────────────

  it('should show the Features section', async () => {
    const visible = await page.hasFeaturesSection();
    expect(visible).toBe(true);
  });

  FEATURES.forEach((feature) => {
    it(`should list feature: ${feature}`, async () => {
      const visible = await page.isFeatureVisible(feature);
      expect(visible).toBe(true);
    });
  });

  // ── Legal document links ───────────────────────────────────────────────────

  it('should display Terms of Service link', async () => {
    const text = await page.getPageText();
    expect(text).toContain('Terms of Service');
  });

  it('should display Privacy Policy link', async () => {
    const text = await page.getPageText();
    expect(text).toContain('Privacy Policy');
  });

  it('should display Data Processing Agreement link', async () => {
    const text = await page.getPageText();
    expect(text).toContain('Data Processing Agreement');
  });
});
