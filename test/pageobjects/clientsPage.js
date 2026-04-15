// test/pageobjects/clientsPage.js
//
// Key testids (from OUTPUT.TXT):
//   search-input              – "Search Clients/3rd Parties..." input
//   parties-create-button     – "Create" button (top right)
//   menu-logout-button        – also present on this page
//
// The import button has no testid – found by text "Import".
// The grid uses role="grid" / role="row" / role="gridcell".

import { WAIT } from '../helpers/constants.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default class ClientsPage {

  // ── Selectors ─────────────────────────────────────────────────────────────
  get searchInput()    { return $('[data-testid="search-input"]'); }
  get createButton()   { return $('[data-testid="parties-create-button"]'); }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async goToClients() {
    await browser.url('https://app.thecasework.com/account/clientsParties');
    await browser.pause(WAIT.PAGE_LOAD);
  }

  async getPageText() {
    return await browser.execute(() => document.body.innerText || '');
  }

  async getUrl() {
    return await browser.getUrl();
  }

  // ── Search ─────────────────────────────────────────────────────────────────

  async search(term) {
    const input = await this.searchInput;
    await input.waitForDisplayed({ timeout: 10000 });
    await input.clearValue();
    await input.setValue(term);
    await browser.pause(WAIT.LONG);
  }

  async clearSearch() {
    await this.goToClients();
  }

  // ── Grid ───────────────────────────────────────────────────────────────────

  async getDataRows() {
    const rows = await $$('[role="row"]');
    return rows.slice(1); // skip header
  }

  async getGridCells() {
    return await $$('[role="gridcell"]');
  }

  // ── Create form (Image 2) ──────────────────────────────────────────────────

  async clickCreate() {
    const btn = await this.createButton;
    await btn.waitForDisplayed({ timeout: 10000 });
    await btn.click();
    await browser.pause(WAIT.LONG);
  }

  async isCreateFormOpen() {
    const text = await this.getPageText();
    return text.includes('Create New Client') || text.includes('3rd Party Name') || text.includes('Client / 3rd Party Name');
  }

  // The name input: placeholder="Enter the name of the Client / 3rd Party"
  async getNameInput() {
    const byPh = await $('input[placeholder*="name of the Client" i]');
    if (await byPh.isExisting()) return byPh;
    return await $('input[placeholder*="Party Name" i]');
  }

  async getFormField(placeholder) {
    const el = await $(`input[placeholder*="${placeholder}" i]`);
    if (await el.isExisting()) return el;
    return null;
  }

  async fillCreateForm({ name, address, city, state, zip, url }) {
    if (name) {
      const el = await this.getNameInput();
      if (el) { await el.clearValue(); await el.setValue(name); }
    }
    for (const [ph, val] of [
      ['Address', address],
      ['City',    city],
      ['State',   state],
      ['Zip',     zip],
      ['Url',     url]
    ]) {
      if (val) {
        const el = await this.getFormField(ph);
        if (el) { await el.clearValue(); await el.setValue(val); }
      }
    }
    await browser.pause(WAIT.SHORT);
  }

  async submitCreateForm() {
    const buttons = await $$('button');
    for (const btn of buttons) {
      if ((await btn.getText().catch(() => '')).trim() === 'Create') {
        await btn.click();
        await browser.pause(WAIT.PAGE_LOAD);
        return;
      }
    }
  }

  async cancelCreateForm() {
    await this._clickButtonByText('Cancel');
  }

  // ── Phone Numbers section (inside Create form or Edit page) ───────────────
  // Image 2 shows a phone "+" button under the "Phone Numbers" label

  async hasPhoneNumbersSection() {
    const text = await this.getPageText();
    return text.includes('Phone Numbers');
  }

  async clickAddPhoneNumber() {
    // The + icon button under "Phone Numbers" – no testid, find by proximity
    const buttons = await $$('button');
    for (const btn of buttons) {
      const aria  = (await btn.getAttribute('aria-label').catch(() => '')) || '';
      const title = (await btn.getAttribute('title').catch(() => ''))      || '';
      const text  = (await btn.getText().catch(() => '')).trim();
      if (
        aria.toLowerCase().includes('phone') ||
        title.toLowerCase().includes('phone') ||
        text === '+' || text === ''
      ) {
        // Check nearby sibling text for "Phone Numbers"
        const html = await btn.getHTML(false).catch(() => '');
        if (html.includes('phone') || html.includes('Phone')) {
          await btn.click();
          await browser.pause(WAIT.LONG);
          return;
        }
      }
    }
    // Broader fallback: click any small icon-only button that appears after
    // the "Phone Numbers" heading
    const allBtns = await $$('button');
    for (let i = allBtns.length - 1; i >= 0; i--) {
      const t = (await allBtns[i].getText().catch(() => '')).trim();
      if (t === '') {
        const displayed = await allBtns[i].isDisplayed().catch(() => false);
        if (displayed) {
          await allBtns[i].click();
          await browser.pause(WAIT.LONG);
          return;
        }
      }
    }
  }

  async isAddPhoneModalOpen() {
    const text = await this.getPageText();
    return text.includes('Add Phone Number') || text.includes('Phone Number') && text.includes('Submit');
  }

  async getPhoneNumberInput() {
    const el = await $('input[placeholder*="phone" i]');
    if (await el.isExisting()) return el;
    const inputs = await $$('input[type="text"], input[type="tel"]');
    return inputs.length > 0 ? inputs[0] : null;
  }

  async getPhoneTypeDropdown() {
    const el = await $('[role="combobox"], select, input[placeholder*="Phone Type" i]');
    if (await el.isExisting()) return el;
    return null;
  }

  async getPrimaryToggle() {
    const sw = await $('[role="switch"]');
    if (await sw.isExisting()) return sw;
    const cb = await $('input[type="checkbox"]');
    if (await cb.isExisting()) return cb;
    return null;
  }

  async submitPhoneModal() {
    await this._clickButtonByText('Submit');
    await browser.pause(WAIT.MEDIUM);
  }

  async cancelPhoneModal() {
    await this._clickButtonByText('Cancel');
    await browser.pause(WAIT.MEDIUM);
  }

  // ── Import modal (Image 1) ─────────────────────────────────────────────────

  async clickImport() {
    // No testid – find by button text
    const buttons = await $$('button');
    for (const btn of buttons) {
      const text = (await btn.getText().catch(() => '')).trim();
      if (text === 'Import') {
        await btn.click();
        await browser.pause(WAIT.LONG);
        return;
      }
    }
    // Fallback: look for an element with Import text
    const allEls = await $$('[role="button"], a, span');
    for (const el of allEls) {
      const text = (await el.getText().catch(() => '')).trim();
      if (text === 'Import') {
        await el.click();
        await browser.pause(WAIT.LONG);
        return;
      }
    }
  }

  async isImportModalOpen() {
    const text = await this.getPageText();
    return text.includes('Import Clients') || text.includes('Upload a CSV') || text.includes('Drag & drop');
  }

  async hasDownloadTemplateLink() {
    const links = await $$('a, button');
    for (const el of links) {
      const text = (await el.getText().catch(() => '')).toLowerCase();
      if (text.includes('download') && text.includes('csv')) return true;
      if (text.includes('download csv template')) return true;
    }
    // Also check page text
    const pageText = (await this.getPageText()).toLowerCase();
    return pageText.includes('download csv template') || pageText.includes('download csv');
  }

  async hasDragDropArea() {
    const text = await this.getPageText();
    return text.includes('Drag') || text.includes('drop') || text.includes('browse');
  }

  async uploadCSVFile(filePath) {
    const resolved   = path.resolve(path.join(__dirname, '../../', filePath));
    const fileInput  = await $('input[type="file"]');
    if (await fileInput.isExisting()) {
      const remotePath = await browser.uploadFile(resolved);
      await fileInput.setValue(remotePath);
      await browser.pause(WAIT.LONG);
      return true;
    }
    return false;
  }

  async clickImportSubmitInsideModal() {
    const buttons = await $$('button');
    for (const btn of buttons) {
      if ((await btn.getText().catch(() => '')).trim() === 'Import') {
        await btn.click();
        await browser.pause(WAIT.PAGE_LOAD);
        return true;
      }
    }
    return false;
  }

  async cancelImportModal() {
    await this._clickButtonByText('Cancel');
    await browser.pause(WAIT.MEDIUM);
  }

  // ── 3-dot menu (⋮) on a client row ────────────────────────────────────────

  async clickThreeDotsForClient(clientName) {
    await this.search(clientName);
    await browser.pause(WAIT.MEDIUM);

    // Hover over the row first so the 3-dot button appears
    const rows = await $$('[role="row"]');
    for (const row of rows) {
      const rowText = (await row.getText().catch(() => '')).toLowerCase();
      if (rowText.includes(clientName.toLowerCase())) {
        await row.moveTo();
        await browser.pause(WAIT.SHORT);
        break;
      }
    }

    // Click the 3-dot / more-options button in that row
    const moreBtns = await $$('[aria-label*="more" i], [aria-label*="action" i], [aria-label*="option" i]');
    if (moreBtns.length > 0) {
      await moreBtns[0].click();
      await browser.pause(WAIT.MEDIUM);
      return true;
    }
    // Fallback: last button in the matching row
    const rows2 = await $$('[role="row"]');
    for (const row of rows2) {
      const rowText = (await row.getText().catch(() => '')).toLowerCase();
      if (rowText.includes(clientName.toLowerCase())) {
        const btns = await row.$$('button');
        if (btns.length > 0) {
          await btns[btns.length - 1].click();
          await browser.pause(WAIT.MEDIUM);
          return true;
        }
      }
    }
    return false;
  }

  async clickEditFromMenu() {
    const items = await $$('[role="menuitem"], li, button, a');
    for (const item of items) {
      const text = (await item.getText().catch(() => '')).trim().toLowerCase();
      if (text === 'edit') {
        await item.click();
        await browser.pause(WAIT.PAGE_LOAD);
        return true;
      }
    }
    return false;
  }

  async clickDeleteFromMenu() {
    const items = await $$('[role="menuitem"], li, button, a');
    for (const item of items) {
      const text = (await item.getText().catch(() => '')).trim().toLowerCase();
      if (text === 'delete') {
        await item.click();
        await browser.pause(WAIT.MEDIUM);
        return true;
      }
    }
    return false;
  }

  async confirmDeleteDialog() {
    // Confirm dialog – look for "Yes", "Confirm", "Delete" button
    const btns = await $$('button');
    for (const btn of btns) {
      const t = (await btn.getText().catch(() => '')).trim().toLowerCase();
      if (t === 'yes' || t === 'confirm' || t === 'delete') {
        await btn.click();
        await browser.pause(WAIT.PAGE_LOAD);
        return true;
      }
    }
    return false;
  }

  // ── Edit page (Image - edit view) ─────────────────────────────────────────

  async isEditPageOpen() {
    const text = await this.getPageText();
    return text.includes('Edit') || text.includes('Party Name');
  }

  async getEditField(label) {
    return await this.getFormField(label);
  }

  async getEditFieldValue(label) {
    const el = await this.getEditField(label);
    if (el) return await el.getValue().catch(() => '');
    return '';
  }

  async hasContactsSection() {
    const text = await this.getPageText();
    return text.includes('Contacts');
  }

  async clickAddContact() {
    const btns = await $$('button, a');
    for (const btn of btns) {
      const text = (await btn.getText().catch(() => '')).toLowerCase();
      if (text.includes('add contact')) {
        await btn.click();
        await browser.pause(WAIT.LONG);
        return true;
      }
    }
    return false;
  }

  async hasPreviewSizes() {
    const text = await this.getPageText();
    return text.includes('Preview') || text.includes('large') || text.includes('small');
  }

  // ── Shared private helper ──────────────────────────────────────────────────

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