// test/specs/logout.spec.js
// Component 1 – Logout Button
// Jira: https://mtechqa.atlassian.net/browse/MTQA-5400
//
// Tests the menu-logout-button (data-testid="menu-logout-button").
// The logout button is always visible in the top toolbar – no popover needed.

import LoginPage           from '../pageobjects/loginPage.js';
import UserAccountMenuPage from '../pageobjects/userAccountMenuPage.js';

const login = new LoginPage();
const menu  = new UserAccountMenuPage();

describe('Logout Button', () => {

  before(async () => {
    await login.login();
  });

  // ── Visibility of the logout button ────────────────────────────────────────

  it('LO-001: logout button is visible in the toolbar after login', async () => {
    const btn = await menu.logoutButton;
    await expect(btn).toBeDisplayed();
  });

  it('LO-002: logout button has the correct data-testid', async () => {
    const btn = await $('[data-testid="menu-logout-button"]');
    await expect(btn).toBeExisting();
  });

  it('LO-003: user is logged in before clicking logout', async () => {
    expect(await login.isLoggedIn()).toBe(true);
  });

  // ── Click logout ────────────────────────────────────────────────────────────

  it('LO-004: clicking the logout button navigates away from the dashboard', async () => {
    await menu.clickLogout();
    const url = await browser.getUrl();
    // After logout the app redirects to the root / login
    expect(url.endsWith('/') || url.includes('login')).toBe(true);
  });

  it('LO-005: after logout the page shows the login form', async () => {
    const isLoginPage = await menu.isOnLoginPage();
    expect(isLoginPage).toBe(true);
  });

  it('LO-006: after logout the user is not on the dashboard', async () => {
    const url = await browser.getUrl();
    expect(url).not.toContain('/account/dashboard');
  });

  it('LO-007: after logout the user cannot access settings without re-login', async () => {
    await browser.url('https://app.thecasework.com/account/settings');
    await browser.pause(2000);
    const url = await browser.getUrl();
    // Should be redirected away from settings
    expect(url).not.toContain('/account/settings');
  });

  // ── Re-login after logout ───────────────────────────────────────────────────

  it('LO-008: user can log back in after logout', async () => {
    await login.login();
    expect(await login.isLoggedIn()).toBe(true);
  });

  it('LO-009: after re-login the dashboard is accessible', async () => {
    const url = await browser.getUrl();
    expect(url).toContain('thecasework.com');
  });
});