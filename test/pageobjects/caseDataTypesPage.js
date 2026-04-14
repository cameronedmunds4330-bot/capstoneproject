
import { URLS, WAIT } from '../helpers/constants.js';

export default class CaseDataTypesPage {

  // ── Navigation ─────────────────────────────────────────────────────────────

  async goToCaseDataTypes() {
    await browser.url(URLS.SETTINGS);
    await browser.pause(WAIT.PAGE_LOAD);
    const allEls = await $$('a, button, [role="tab"], li, span');
    for (const el of allEls) {
      const text = await el.getText().catch(() => '');
      if (text.trim() === 'Case Data Types') {
        await el.click();
        await browser.pause(WAIT.LONG);
        return;
      }
    }
  }

  async getPageText() {
    return await browser.execute(() => document.body.innerText || '');
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  CASE TYPES
  // ══════════════════════════════════════════════════════════════════════════

  async getCaseTypeInput() {
    const el = await $('input[placeholder*="Case Type" i]');
    if (await el.isExisting()) return el;
    return await $('input[type="text"]');
  }

  async getCaseTypeAddButton() {
    const buttons = await $$('button');
    for (const btn of buttons) {
      if ((await btn.getText().catch(() => '')).trim() === 'Add') return btn;
    }
    return null;
  }

  async typeCaseType(value) {
    const input = await this.getCaseTypeInput();
    await input.clearValue();
    await input.setValue(value);
    await browser.pause(WAIT.SHORT);
  }

  async addCaseType(value) {
    await this.typeCaseType(value);
    const btn = await this.getCaseTypeAddButton();
    if (btn) {
      await btn.click();
      await browser.pause(WAIT.MEDIUM);
    }
  }

  async getCaseTypeList() {
    const text = await this.getPageText();
    const section = text.split('Case Statuses')[0] || '';
    return section;
  }

  async deleteCaseType(typeName) {
    const allEls = await $$('span, div, li');
    for (const el of allEls) {
      const text = await el.getText().catch(() => '');
      if (text.trim() === typeName) {
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

  // ══════════════════════════════════════════════════════════════════════════
  //  CASE STATUSES
  // ══════════════════════════════════════════════════════════════════════════

  async getGroupByCheckbox() {
    return await $('input[type="checkbox"]');
  }

  async isGroupByChecked() {
    const cb = await this.getGroupByCheckbox();
    return await cb.isSelected();
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

  // Click the + button next to a status group
  async clickPlusForGroup(groupName) {
    const groupOrder = ['New', 'Active', 'Completed', 'Closed', 'Removed'];
    const idx = groupOrder.indexOf(groupName);

    // Strategy 1: Try aria-label match
    const ariaMatches = await $$(`[aria-label*="${groupName}" i]`);
    for (const el of ariaMatches) {
      if ((await el.getTagName()) === 'button') {
        await el.click();
        await browser.pause(WAIT.LONG);
        return true;
      }
    }

    // Strategy 2: Collect all icon-only / + buttons in DOM order, pick by index
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

  // ── Dialog detection — polls via innerText ─────────────────────────────────

  async waitForDialog(ms = 8000) {
    const start = Date.now();
    while (Date.now() - start < ms) {
      const dialog = await $('[role="dialog"]');
      if (await dialog.isExisting()) return true;
      const text = await browser.execute(() => document.body.innerText || '');
      if (text.includes('System Status') || text.includes('Create new')) return true;
      await browser.pause(400);
    }
    return false;
  }

  async isDialogOpen() {
    const dialog = await $('[role="dialog"]');
    if (await dialog.isExisting()) return true;
    const text = await browser.execute(() => document.body.innerText || '');
    return text.includes('System Status') || text.includes('Create new');
  }

  // ── Dialog fields (with polling for slow renders) ──────────────────────────

  async getStatusInput() {
    const start = Date.now();
    while (Date.now() - start < 5000) {
      const byPlaceholder = await $('input[placeholder*="Enter the status" i]');
      if (await byPlaceholder.isExisting()) return byPlaceholder;
      const dialog = await $('[role="dialog"]');
      if (await dialog.isExisting()) {
        const inp = await dialog.$('input');
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
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  EXPENSE TYPES
  // ══════════════════════════════════════════════════════════════════════════

  async getExpenseTypeInput() {
    const el = await $('input[placeholder*="Expense Type" i]');
    if (await el.isExisting()) return el;
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

  async typeExpenseType(value) {
    const input = await this.getExpenseTypeInput();
    await input.clearValue();
    await input.setValue(value);
    await browser.pause(WAIT.SHORT);
  }

  async addExpenseType(value) {
    await this.typeExpenseType(value);
    const btn = await this.getExpenseTypeAddButton();
    if (btn) {
      await btn.click();
      await browser.pause(WAIT.MEDIUM);
    }
  }

  async getExpenseTypeList() {
    const text = await this.getPageText();
    const section = text.split('Expense Types')[1] || '';
    return section;
  }

  async deleteExpenseType(typeName) {
    const allEls = await $$('span, div, li');
    for (const el of allEls) {
      const text = await el.getText().catch(() => '');
      if (text.trim() === typeName) {
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
}
