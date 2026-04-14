// test/specs/caseDataTypes.spec.js
import CaseDataTypesPage from '../pageobjects/caseDataTypesPage.js';
import { TEST_DATA, STATUS_GROUPS } from '../helpers/constants.js';

const page = new CaseDataTypesPage();

describe('Case Data Types – Case Types, Statuses, Expense Types', () => {

  before(async () => {
    await page.goToCaseDataTypes();
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  CASE TYPES
  // ══════════════════════════════════════════════════════════════════════════

  describe('Case Types', () => {

    it('should display the Case Types section', async () => {
      const text = await page.getPageText();
      expect(text).toContain('Case Types');
    });

    it('should display the New Case Type input', async () => {
      const input = await page.getCaseTypeInput();
      await expect(input).toBeExisting();
    });

    it('should display the Add button', async () => {
      const btn = await page.getCaseTypeAddButton();
      expect(btn).not.toBeNull();
    });

    it('should add a new case type and see it on the page', async () => {
      await page.addCaseType(TEST_DATA.CASE_TYPE);
      const text = await page.getCaseTypeList();
      expect(text).toContain(TEST_DATA.CASE_TYPE);
    });

    it('should delete the test case type', async () => {
      const deleted = await page.deleteCaseType(TEST_DATA.CASE_TYPE);
      expect(deleted).toBe(true);
      const text = await page.getCaseTypeList();
      expect(text).not.toContain(TEST_DATA.CASE_TYPE);
    });

    // Safety net: remove AUTOTEST data even if the delete test failed
    after(async () => {
      try {
        const text = await page.getCaseTypeList();
        if (text.includes(TEST_DATA.CASE_TYPE)) {
          await page.deleteCaseType(TEST_DATA.CASE_TYPE);
        }
      } catch (e) { /* already clean */ }
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  CASE STATUSES
  // ══════════════════════════════════════════════════════════════════════════

  describe('Case Statuses', () => {

    it('should display the Group By checkbox', async () => {
      const cb = await page.getGroupByCheckbox();
      await expect(cb).toBeExisting();
    });

    it('should toggle the Group By checkbox', async () => {
      const before = await page.isGroupByChecked();
      await page.toggleGroupByCheckbox();
      const after = await page.isGroupByChecked();
      expect(after).not.toBe(before);
      // toggle back to original state
      await page.toggleGroupByCheckbox();
    });

    STATUS_GROUPS.forEach((group) => {
      it(`should display the "${group}" status group`, async () => {
        const visible = await page.isStatusGroupVisible(group);
        expect(visible).toBe(true);
      });
    });

    // ── Status dialog tests ────────────────────────────────────────────────
    // Each it() is self-contained: open → verify → close
    // beforeEach/afterEach guarantee the dialog is clean between tests

    STATUS_GROUPS.forEach((group) => {
      describe(`Create Status modal – ${group}`, () => {

        beforeEach(async () => {
          // Close any leftover dialog from a previous failed test
          if (await page.isDialogOpen()) {
            await page.closeDialog();
          }
        });

        it(`should open the modal when clicking + for "${group}"`, async () => {
          await page.clickPlusForGroup(group);
          const open = await page.waitForDialog();
          expect(open).toBe(true);
          await page.closeDialog();
        });

        it(`should show "System Status" and "${group}" in the modal`, async () => {
          await page.clickPlusForGroup(group);
          await page.waitForDialog();
          const text = await page.getPageText();
          expect(text).toContain('System Status');
          expect(text).toContain(group);
          await page.closeDialog();
        });

        it('should show the Status name input', async () => {
          await page.clickPlusForGroup(group);
          await page.waitForDialog();
          const input = await page.getStatusInput();
          expect(await input.isExisting()).toBe(true);
          await page.closeDialog();
        });

        it('should show the Description textarea', async () => {
          await page.clickPlusForGroup(group);
          await page.waitForDialog();
          const ta = await page.getDescriptionTextarea();
          expect(await ta.isExisting()).toBe(true);
          await page.closeDialog();
        });

        it('should show Save and Cancel buttons', async () => {
          await page.clickPlusForGroup(group);
          await page.waitForDialog();
          expect(await page.getSaveButton()).not.toBeNull();
          expect(await page.getCancelButton()).not.toBeNull();
          await page.closeDialog();
        });

        it('should allow typing in the Status input', async () => {
          await page.clickPlusForGroup(group);
          await page.waitForDialog();
          const input = await page.getStatusInput();
          await input.setValue(`Test${group}Status`);
          expect(await input.getValue()).toBe(`Test${group}Status`);
          await page.closeDialog();
        });

        it('should close the modal with Cancel', async () => {
          await page.clickPlusForGroup(group);
          await page.waitForDialog();
          await page.closeDialog();
          expect(await page.isDialogOpen()).toBe(false);
        });

        afterEach(async () => {
          // Always ensure dialog is closed no matter what
          try {
            if (await page.isDialogOpen()) {
              await page.closeDialog();
            }
          } catch (e) { /* dialog already closed */ }
        });
      });
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  EXPENSE TYPES
  // ══════════════════════════════════════════════════════════════════════════

  describe('Expense Types', () => {

    it('should display the Expense Types section', async () => {
      const text = await page.getPageText();
      expect(text).toContain('Expense Types');
    });

    it('should display the New Expense Type input', async () => {
      const input = await page.getExpenseTypeInput();
      await expect(input).toBeExisting();
    });

    it('should display the Expense Type Add button', async () => {
      const btn = await page.getExpenseTypeAddButton();
      expect(btn).not.toBeNull();
    });

    it('should add a new expense type and see it on the page', async () => {
      await page.addExpenseType(TEST_DATA.EXPENSE_TYPE);
      const text = await page.getExpenseTypeList();
      expect(text).toContain(TEST_DATA.EXPENSE_TYPE);
    });

    it('should delete the test expense type', async () => {
      const deleted = await page.deleteExpenseType(TEST_DATA.EXPENSE_TYPE);
      expect(deleted).toBe(true);
      const text = await page.getExpenseTypeList();
      expect(text).not.toContain(TEST_DATA.EXPENSE_TYPE);
    });

    // Safety net: remove AUTOTEST data even if the delete test failed
    after(async () => {
      try {
        const text = await page.getExpenseTypeList();
        if (text.includes(TEST_DATA.EXPENSE_TYPE)) {
          await page.deleteExpenseType(TEST_DATA.EXPENSE_TYPE);
        }
      } catch (e) { /* already clean */ }
    });
  });
});
