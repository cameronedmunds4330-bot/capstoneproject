// test/pageobjects/caseDataTypesPage.js
//
// Key testids (from OUTPUT.TXT):
//   account-settings-case-data-tab           – tab button
//   (case-data-types panel has no testids – use text-based selectors inside)

import { WAIT } from '../helpers/constants.js';

export default class CaseDataTypesPage {

  // ── Navigation ─────────────────────────────────────────────────────────────

  async goToCaseDataTypes() {
    await browser.url('https://app.thecasework.com/account/settings');
    await browser.pause(WAIT.PAGE_LOAD);
    // Click the Case Data Types tab using its testid
    const tab = await $('[data-testid="account-settings-case-data-tab"]');
    await tab.waitForDisplayed({ timeout: 10000 });
    await tab.click();
    await browser.pause(WAIT.LONG);
  }

  async getPageText() {
    return await browser.execute(() => document.body.innerText || '');
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  CASE TYPES
  // ══════════════════════════════════════════════════════════════════════════

  async getCaseTypeInput() {
    // placeholder="New Case Type" or similar
    const byPh = await $('input[placeholder*="Case Type" i]');
    if (await byPh.isExisting()) return byPh;
    const all = await $$('input[type="text"]');
    return all[0] || null;
  }

  async getCaseTypeAddButton() {
    // First "Add" button on the page
    const buttons = await $$('button');
    for (const btn of buttons) {
      if ((await btn.getText().catch(() => '')).trim() === 'Add') return btn;
    }
    return null;
  }

  async addCaseType(value) {
    const input = await this.getCaseTypeInput();
    await input.clearValue();
    await input.setValue(value);
    await browser.pause(WAIT.SHORT);
    const btn = await this.getCaseTypeAddButton();
    await btn.click();
    await browser.pause(WAIT.MEDIUM);
  }

  async deleteCaseType(typeName) {
    // Each tag has a close/delete button next to it
    const allEls = await $$('span, div, li, button');
    for (const el of allEls) {
      const text = (await el.getText().catch(() => '')).trim();
      if (text === typeName) {
        const parent = await el.$('..');
        const closeBtn = await parent.$('button');
        if (closeBtn && await closeBtn.isExisting()) {
          await closeBtn.click();
          await browser.pause(WAIT.MEDIUM);
          return true;
        }
      }
    }
    return false;
  }

  async caseTypeListContains(value) {
    const text = await this.getPageText();
    // Only look in the Case Types section (before Case Statuses)
    const section = text.split('Case Statuses')[0] || text;
    return section.includes(value);
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  CASE STATUSES
  // ══════════════════════════════════════════════════════════════════════════

  async getGroupByCheckbox() {
    // The checkbox has no testid; find by role or type
    const cb = await $('input[type="checkbox"]');
    if (await cb.isExisting()) return cb;
    const sw = await $('[role="checkbox"]');
    return sw;
  }

  async isGroupByChecked() {
    const cb = await this.getGroupByCheckbox();
    return await cb.isSelected().catch(async () => {
      const aria = await cb.getAttribute('aria-checked');
      return aria === 'true';
    });
  }

  async toggleGroupByCheckbox() {
    const cb = await this.getGroupByCheckbox();
    await cb.click();
    await browser.pause(WAIT.MEDIUM);
  }

  async isStatusGroupVisible(groupName) {
    const text = await this.getPageText();
    return text.includes(groupName);
  }

  // Click the ⊞ / + button next to a status group label
  async clickPlusForGroup(groupName) {
    const groupOrder = ['New', 'Active', 'Completed', 'Closed', 'Removed'];
    const idx = groupOrder.indexOf(groupName);

    // Strategy 1: aria-label contains the group name
    const ariaMatches = await $$(`[aria-label*="${groupName}" i]`);
    for (const el of ariaMatches) {
      if ((await el.getTagName()) === 'button') {
        await el.click();
        await browser.pause(WAIT.LONG);
        return true;
      }
    }

    // Strategy 2: collect all icon-only / add buttons in DOM order
    const allBtns = await $$('button');
    const plusBtns = [];
    for (const btn of allBtns) {
      const text  = (await btn.getText().catch(() => '')).trim();
      const aria  = (await btn.getAttribute('aria-label').catch(() => '')) || '';
      const title = (await btn.getAttribute('title').catch(() => '')) || '';
      if (
        text === '' || text === '+' ||
        aria.toLowerCase().includes('add') ||
        title.toLowerCase().includes('add')
      ) {
        plusBtns.push(btn);
      }
    }
    if (idx >= 0 && plusBtns.length > idx) {
      await plusBtns[idx].click();
      await browser.pause(WAIT.LONG);
      return true;
    }
    return false;
  }

  // ── Dialog polling ────────────────────────────────────────────────────────

  async waitForDialog(ms = 8000) {
    const start = Date.now();
    while (Date.now() - start < ms) {
      const dlg = await $('[role="dialog"]');
      if (await dlg.isExisting()) return true;
      const text = await browser.execute(() => document.body.innerText || '');
      if (text.includes('System Status') || text.includes('Create new')) return true;
      await browser.pause(400);
    }
    return false;
  }

  async isDialogOpen() {
    const dlg = await $('[role="dialog"]');
    if (await dlg.isExisting()) return true;
    const text = await browser.execute(() => document.body.innerText || '');
    return text.includes('System Status') || text.includes('Create new');
  }

  // ── Dialog fields ─────────────────────────────────────────────────────────

  async getStatusInput() {
    const start = Date.now();
    while (Date.now() - start < 5000) {
      const byPh = await $('input[placeholder*="Enter the status" i]');
      if (await byPh.isExisting()) return byPh;
      const dlg = await $('[role="dialog"]');
      if (await dlg.isExisting()) {
        const inp = await dlg.$('input');
        if (await inp.isExisting()) return inp;
      }
      await browser.pause(300);
    }
    return await $('input[type="text"]');
  }

  async getDescriptionTextarea() {
    const start = Date.now();
    while (Date.now() - start < 5000) {
      const ta = await $('textarea');
      if (await ta.isExisting()) return ta;
      await browser.pause(300);
    }
    return await $('textarea');
  }

  async getSaveButton() {
    const buttons = await $$('button');
    for (const btn of buttons) {
      if ((await btn.getText().catch(() => '')).trim() === 'Save') return btn;
    }
    return null;
  }

  async getCancelButton() {
    const buttons = await $$('button');
    for (const btn of buttons) {
      if ((await btn.getText().catch(() => '')).trim() === 'Cancel') return btn;
    }
    return null;
  }

  async closeDialog() {
    const cancel = await this.getCancelButton();
    if (cancel && await cancel.isDisplayed().catch(() => false)) {
      await cancel.click();
      await browser.pause(WAIT.MEDIUM);
      return;
    }
    await browser.keys('Escape');
    await browser.pause(WAIT.MEDIUM);
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  EXPENSE TYPES
  // ══════════════════════════════════════════════════════════════════════════

  async getExpenseTypeInput() {
    const byPh = await $('input[placeholder*="Expense Type" i]');
    if (await byPh.isExisting()) return byPh;
    const all = await $$('input[type="text"]');
    return all.length >= 2 ? all[1] : all[0];
  }

  async getExpenseTypeAddButton() {
    const buttons = await $$('button');
    const adds = [];
    for (const btn of buttons) {
      if ((await btn.getText().catch(() => '')).trim() === 'Add') adds.push(btn);
    }
    return adds.length >= 2 ? adds[1] : adds[0];
  }

  async addExpenseType(value) {
    const input = await this.getExpenseTypeInput();
    await input.clearValue();
    await input.setValue(value);
    await browser.pause(WAIT.SHORT);
    const btn = await this.getExpenseTypeAddButton();
    await btn.click();
    await browser.pause(WAIT.MEDIUM);
  }

  async deleteExpenseType(typeName) {
    const allEls = await $$('span, div, li, button');
    for (const el of allEls) {
      const text = (await el.getText().catch(() => '')).trim();
      if (text === typeName) {
        const parent = await el.$('..');
        const closeBtn = await parent.$('button');
        if (closeBtn && await closeBtn.isExisting()) {
          await closeBtn.click();
          await browser.pause(WAIT.MEDIUM);
          return true;
        }
      }
    }
    return false;
  }

  async expenseTypeListContains(value) {
    const text = await this.getPageText();
    const section = text.split('Expense Types')[1] || '';
    return section.includes(value);
  }
}