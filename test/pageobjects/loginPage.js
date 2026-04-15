// test/pageobjects/loginPage.js
// Uses data-testid selectors discovered via the diagnostics spec.

export default class LoginPage {

  // ── Selectors (from diagnostic output) ───────────────────────────────────
  get usernameInput() { return $('[data-testid="login-username"]'); }
  get passwordInput() { return $('[data-testid="login-password"]'); }
  get submitButton()  { return $('[data-testid="login-submit"]'); }

  // ── Actions ───────────────────────────────────────────────────────────────

  async login() {
    await browser.url('https://app.thecasework.com/');
    await browser.pause(2000);

    // Wait for the login form – fall back to label-based selectors if testids
    // haven't rendered yet
    const un = await this.usernameInput;
    if (await un.isExisting()) {
      await un.setValue(process.env.USERNAME);
      await (await this.passwordInput).setValue(process.env.PASSWORD);
      await (await this.submitButton).click();
    } else {
      // Fluent UI fallback: find by placeholder / name
      const inputs = await $$('input');
      for (const inp of inputs) {
        const name = await inp.getAttribute('name').catch(() => '');
        const ph   = await inp.getAttribute('placeholder').catch(() => '');
        if (name.toLowerCase().includes('user') || ph.toLowerCase().includes('user')) {
          await inp.setValue(process.env.USERNAME);
        }
        if (name.toLowerCase().includes('pass') || ph.toLowerCase().includes('pass')) {
          await inp.setValue(process.env.PASSWORD);
        }
      }
      const btns = await $$('button');
      for (const btn of btns) {
        const t = (await btn.getText().catch(() => '')).trim().toLowerCase();
        if (t === 'login' || t === 'sign in') { await btn.click(); break; }
      }
    }
    await browser.pause(3000);
  }

  async isLoggedIn() {
    const url = await browser.getUrl();
    return !url.includes('/login') && !url.endsWith('/');
  }

  async loginIfNeeded() {
    if (!(await this.isLoggedIn())) await this.login();
  }
}