// test/specs/clients.spec.js
import ClientsPage from '../pageobjects/clientsPage.js';
import { TEST_DATA } from '../helpers/constants.js';

const page = new ClientsPage();

describe('Clients / 3rd Parties – list, create, edit, import, phone', () => {

  before(async () => {
    await page.goToClients();
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  PAGE LAYOUT
  // ══════════════════════════════════════════════════════════════════════════

  it('should display "Clients / 3rd Parties" heading', async () => {
    const text = await page.getPageText();
    expect(text).toContain('Clients');
  });

  it('should display the search bar', async () => {
    const input = await page.getSearchInput();
    await expect(input).toBeExisting();
  });

  it('should display Create and Import buttons', async () => {
    const text = await page.getPageText();
    expect(text).toContain('Create');
    expect(text).toContain('Import');
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  CREATE CLIENT
  // ══════════════════════════════════════════════════════════════════════════

  describe('Create New Client form', () => {

    it('should open the create form when clicking Create', async () => {
      await page.clickCreateButton();
      const open = await page.isCreateFormOpen();
      expect(open).toBe(true);
    });

    it('should show the Name field', async () => {
      const el = await page.getFormField('Name');
      expect(el).not.toBeNull();
    });

    it('should show Address, City, State, Zip fields', async () => {
      for (const label of ['Address', 'City', 'State', 'Zip']) {
        const el = await page.getFormField(label);
        expect(el).not.toBeNull();
      }
    });

    it('should show the Url field', async () => {
      const el = await page.getFormField('Url');
      expect(el).not.toBeNull();
    });

    it('should fill the form and create a client', async () => {
      await page.fillCreateForm({
        name:    TEST_DATA.CLIENT_NAME,
        address: TEST_DATA.CLIENT_ADDRESS,
        city:    TEST_DATA.CLIENT_CITY,
        state:   TEST_DATA.CLIENT_STATE,
        zip:     TEST_DATA.CLIENT_ZIP,
        url:     TEST_DATA.CLIENT_URL
      });
      await page.submitCreateForm();
      const text = await page.getPageText();
      expect(text).toContain(TEST_DATA.CLIENT_NAME);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  SEARCH
  // ══════════════════════════════════════════════════════════════════════════

  describe('Search', () => {

    before(async () => {
      await page.goToClients();
    });

    it('should find the created client by name', async () => {
      await page.searchClients(TEST_DATA.CLIENT_NAME);
      const text = await page.getClientListText();
      expect(text).toContain(TEST_DATA.CLIENT_NAME);
    });

    it('should show no results for a nonsense query', async () => {
      await page.searchClients('ZZZZNOTEXIST999');
      const text = await page.getClientListText();
      expect(text).not.toContain('ZZZZNOTEXIST999');
    });

    after(async () => {
      await page.clearSearch();
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  EDIT CLIENT
  // ══════════════════════════════════════════════════════════════════════════

  describe('Edit Client page', () => {

    before(async () => {
      await page.goToClients();
      await page.searchClients(TEST_DATA.CLIENT_NAME);
      await page.clickClientByName(TEST_DATA.CLIENT_NAME);
    });

    it('should open the edit page', async () => {
      const open = await page.isEditPageOpen();
      expect(open).toBe(true);
    });

    it('should show Party Name field with the client name', async () => {
      const val = await page.getEditFieldValue('Party Name');
      expect(val).toContain(TEST_DATA.CLIENT_NAME);
    });

    it('should show Url, Address, City, State, Zip fields', async () => {
      for (const label of ['Url', 'Address', 'City', 'State', 'Zip']) {
        const el = await page.getEditField(label);
        expect(el).not.toBeNull();
      }
    });

    it('should show the Contacts section', async () => {
      const has = await page.hasContactsSection();
      expect(has).toBe(true);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  ADD PHONE NUMBER MODAL
  // ══════════════════════════════════════════════════════════════════════════

  describe('Add Phone Number modal', () => {

    it('should show the Phone Numbers section', async () => {
      const has = await page.hasPhoneSection();
      expect(has).toBe(true);
    });

    it('should open the Add Phone Number modal', async () => {
      await page.openAddPhoneModal();
      const open = await page.isPhoneModalOpen();
      expect(open).toBe(true);
    });

    it('should show Phone number and Phone type fields', async () => {
      const phone = await page.getPhoneNumberInput();
      expect(phone).not.toBeNull();
      const type = await page.getPhoneTypeSelect();
      expect(type).not.toBeNull();
    });

    it('should show the Primary toggle', async () => {
      const toggle = await page.getPrimaryToggle();
      expect(toggle).not.toBeNull();
    });

    it('should cancel the modal without saving', async () => {
      await page.cancelPhoneModal();
      const open = await page.isPhoneModalOpen();
      expect(open).toBe(false);
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  IMPORT MODAL
  // ══════════════════════════════════════════════════════════════════════════

  describe('Import Clients modal', () => {

    before(async () => {
      await page.goToClients();
    });

    it('should open the import modal when clicking Import', async () => {
      await page.clickImportButton();
      const open = await page.isImportModalOpen();
      expect(open).toBe(true);
    });

    it('should show the Download CSV template link', async () => {
      const has = await page.hasDownloadTemplateLink();
      expect(has).toBe(true);
    });

    it('should show the drag-and-drop upload area', async () => {
      const has = await page.hasDragDropArea();
      expect(has).toBe(true);
    });

    it('should cancel the import modal', async () => {
      await page.cancelImportModal();
      const open = await page.isImportModalOpen();
      expect(open).toBe(false);
    });
  });
});
