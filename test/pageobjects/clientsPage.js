// test/pageobjects/clientsPage.js
// Page object for Clients / 3rd Parties – list, create, edit, import, phone, contacts

import { URLS, WAIT } from '../helpers/constants.js';
import path from 'path';

export default class ClientsPage {

  // ── Navigation ─────────────────────────────────────────────────────────────

  async goToClients() {
    await browser.url(URLS.CLIENTS);
    await browser.pause(WAIT.PAGE_LOAD);
  }

  async getPageText() {
    return await browser.execute(() => document.body.innerText || '');
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  CLIENT LIST
  // ══════════════════════════════════════════════════════════════════════════

  async getSearchInput() {
    const el = await $('input[placeholder*="Search" i]');
    if (await el.isExisting()) return el;
    return await $('input[type="text"]');
  }

  async searchClients(query) {
    const input = await this.getSearchInput();
    await input.clearValue();
    await input.setValue(query);
    await browser.pause(WAIT.LONG);
  }

  async clearSearch() {
    const input = await this.getSearchInput();
    await input.clearValue();
    await browser.pause(WAIT.MEDIUM);
    // Also click the X if it exists
    const closeBtn = await $('[aria-label="clear" i], .clear-search');
    if (await closeBtn.isExisting()) {
      await closeBtn.click();
      await browser.pause(WAIT.MEDIUM);
    }
  }

  async getClientListText() {
    const text = await this.getPageText();
    return text;
  }

  async clickClientByName(name) {
    const allEls = await $$('a, div, span, tr, li');
    for (const el of allEls) {
      const text = await el.getText().catch(() => '');
      if (text.trim() === name || text.includes(name)) {
        await el.click();
        await browser.pause(WAIT.PAGE_LOAD);
        return;
      }
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  CREATE CLIENT FORM
  // ══════════════════════════════════════════════════════════════════════════

  async clickCreateButton() {
    await this._clickButtonByText('Create');
  }

  async isCreateFormOpen() {
    const text = await this.getPageText();
    return text.includes('Create New Client') || text.includes('3rd Party Name');
  }

  async getFormField(placeholder) {
    const el = await $(`input[placeholder*="${placeholder}" i]`);
    if (await el.isExisting()) return el;
    // Fallback: search by nearby label
    const inputs = await $$('input');
    for (const inp of inputs) {
      const ph = await inp.getAttribute('placeholder').catch(() => '');
      if (ph.toLowerCase().includes(placeholder.toLowerCase())) return inp;
    }
    return null;
  }

  async fillCreateForm({ name, address, address2, city, state, zip, url, phone }) {
    if (name) {
      const el = await this.getFormField('Name') || await this.getFormField('Party');
      if (el) { await el.clearValue(); await el.setValue(name); }
    }
    if (address) {
      const el = await this.getFormField('Address');
      if (el) { await el.clearValue(); await el.setValue(address); }
    }
    if (address2) {
      const el = await this.getFormField('Address 2');
      if (el) { await el.clearValue(); await el.setValue(address2); }
    }
    if (city) {
      const el = await this.getFormField('City');
      if (el) { await el.clearValue(); await el.setValue(city); }
    }
    if (state) {
      const el = await this.getFormField('State');
      if (el) { await el.clearValue(); await el.setValue(state); }
    }
    if (zip) {
      const el = await this.getFormField('Zip');
      if (el) { await el.clearValue(); await el.setValue(zip); }
    }
    if (url) {
      const el = await this.getFormField('Url');
      if (el) { await el.clearValue(); await el.setValue(url); }
    }
    await browser.pause(WAIT.SHORT);
  }

  async submitCreateForm() {
    // Click the "Create" button inside the form (not the top-level one)
    const buttons = await $$('button');
    for (const btn of buttons) {
      const text = await btn.getText().catch(() => '');
      if (text.trim() === 'Create') {
        await btn.click();
        await browser.pause(WAIT.PAGE_LOAD);
        return;
      }
    }
  }

  async cancelCreateForm() {
    await this._clickButtonByText('Cancel');
  }

  async isCreateButtonDisabled() {
    const buttons = await $$('button');
    for (const btn of buttons) {
      const text = await btn.getText().catch(() => '');
      if (text.trim() === 'Create') {
        return await btn.getAttribute('disabled') !== null;
      }
    }
    return false;
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  EDIT CLIENT PAGE
  // ══════════════════════════════════════════════════════════════════════════

  async isEditPageOpen() {
    const text = await this.getPageText();
    return text.includes('Edit -') || text.includes('Party Name');
  }

  async getEditField(label) {
    return this.getFormField(label);
  }

  async getEditFieldValue(label) {
    const el = await this.getEditField(label);
    if (el) return await el.getValue();
    return '';
  }

  // ── Contacts section on edit page ──────────────────────────────────────────

  async hasContactsSection() {
    const text = await this.getPageText();
    return text.includes('Contacts');
  }

  async clickAddContact() {
    await this._clickButtonByText('Add Contact');
  }

  // ── Phone number modal ─────────────────────────────────────────────────────

  async hasPhoneSection() {
    const text = await this.getPageText();
    return text.includes('Phone Numbers') || text.includes('Add Phone');
  }

  async openAddPhoneModal() {
    // Look for an "Add" or "+" button near the Phone Numbers section
    const allEls = await $$('button, a, span');
    for (const el of allEls) {
      const text = await el.getText().catch(() => '');
      if (text.includes('Add Phone') || text.includes('add phone')) {
        await el.click();
        await browser.pause(WAIT.LONG);
        return;
      }
    }
    // Fallback: click a + icon near "Phone Numbers"
    const buttons = await $$('button');
    for (const btn of buttons) {
      const label = await btn.getAttribute('aria-label').catch(() => '');
      if (label.toLowerCase().includes('phone') || label.includes('add')) {
        await btn.click();
        await browser.pause(WAIT.LONG);
        return;
      }
    }
  }

  async isPhoneModalOpen() {
    const text = await this.getPageText();
    return text.includes('Add Phone Number');
  }

  async getPhoneNumberInput() {
    const el = await $('input[placeholder*="phone" i]');
    if (await el.isExisting()) return el;
    // Fallback: look for input near "Phone number" label
    const inputs = await $$('input[type="text"], input[type="tel"]');
    return inputs.length > 0 ? inputs[0] : null;
  }

  async getPhoneTypeSelect() {
    const el = await $('select, [role="combobox"], input[placeholder*="Phone Type" i]');
    if (await el.isExisting()) return el;
    return null;
  }

  async getPrimaryToggle() {
    // The "Primary?" toggle switch
    const el = await $('input[type="checkbox"]');
    if (await el.isExisting()) return el;
    const toggle = await $('[role="switch"]');
    if (await toggle.isExisting()) return toggle;
    return null;
  }

  async fillPhoneModal(phoneNumber, phoneType = '') {
    const phoneInput = await this.getPhoneNumberInput();
    if (phoneInput) {
      await phoneInput.clearValue();
      await phoneInput.setValue(phoneNumber);
    }
    if (phoneType) {
      const typeEl = await this.getPhoneTypeSelect();
      if (typeEl) {
        const tag = await typeEl.getTagName();
        if (tag === 'select') {
          await typeEl.selectByVisibleText(phoneType);
        } else {
          await typeEl.clearValue();
          await typeEl.setValue(phoneType);
        }
      }
    }
    await browser.pause(WAIT.SHORT);
  }

  async submitPhoneModal() {
    await this._clickButtonByText('Submit');
  }

  async cancelPhoneModal() {
    await this._clickButtonByText('Cancel');
  }

  // ══════════════════════════════════════════════════════════════════════════
  //  IMPORT MODAL
  // ══════════════════════════════════════════════════════════════════════════

  async clickImportButton() {
    await this._clickButtonByText('Import');
  }

  async isImportModalOpen() {
    const text = await this.getPageText();
    return text.includes('Import Clients') || text.includes('Upload a CSV');
  }

  async hasDownloadTemplateLink() {
    const links = await $$('a');
    for (const link of links) {
      const text = await link.getText().catch(() => '');
      if (text.toLowerCase().includes('download csv template')) return true;
    }
    return false;
  }

  async hasDragDropArea() {
    const text = await this.getPageText();
    return text.includes('Drag') || text.includes('drop') || text.includes('browse');
  }

  async uploadCSV(filePath) {
    // The import modal usually has a hidden <input type="file">
    const fileInput = await $('input[type="file"]');
    if (await fileInput.isExisting()) {
      const resolvedPath = path.resolve(filePath);
      const remotePath = await browser.uploadFile(resolvedPath);
      await fileInput.setValue(remotePath);
      await browser.pause(WAIT.LONG);
    }
  }

  async clickImportSubmit() {
    // The "Import" button inside the modal
    const buttons = await $$('button');
    for (const btn of buttons) {
      const text = await btn.getText().catch(() => '');
      if (text.trim() === 'Import') {
        await btn.click();
        await browser.pause(WAIT.PAGE_LOAD);
        return;
      }
    }
  }

  async cancelImportModal() {
    await this._clickButtonByText('Cancel');
  }

  // ── Shared helper ──────────────────────────────────────────────────────────

  async _clickButtonByText(label) {
    const buttons = await $$('button');
    for (const btn of buttons) {
      if ((await btn.getText().catch(() => '')).trim() === label) {
        await btn.click();
        await browser.pause(WAIT.LONG);
        return;
      }
    }
  }
}
