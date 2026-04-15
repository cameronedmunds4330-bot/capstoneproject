// test/specs/caseDataTypes.spec.js
// Component – Account Settings / Case Data Types  (Image 4)
//
// Covers:
//   • Settings tab navigation (account-settings-case-data-tab testid)
//   • Case Types panel – add / delete
//   • Case Statuses panel – Group By checkbox + all 5 status groups + dialogs
//   • Expense Types panel – add / delete
import LoginPage        from '../pageobjects/loginPage.js';import CaseDataTypesPage from '../pageobjects/casedatatypespage.js';
import { TEST_DATA, STATUS_GROUPS } from '../helpers/constants.js';

const login = new LoginPage();

const cdt   = new CaseDataTypesPage();

describe('Case Data Types (Account Settings)', () => {

  before(async () => {
    await login.login();
    await cdt.goToCaseDataTypes();
  });

  // ── Page structure ─────────────────────────────────────────────────────────

  it('CDT-001: URL contains "settings"', async () => {
    expect(await browser.getUrl()).toContain('settings');
  });

  it('CDT-002: sidebar shows "Account Settings"', async () => {
    expect(await cdt.getPageText()).toContain('Account Settings');
  });

  it('CDT-003: sidebar shows "MTECH" account name', async () => {
    expect(await cdt.getPageText()).toContain('MTECH');
  });

  it('CDT-004: sidebar shows "Account Info" tab', async () => {
    expect(await cdt.getPageText()).toContain('Account Info');
  });

  it('CDT-005: sidebar shows "Case Data Types" as active', async () => {
    expect(await cdt.getPageText()).toContain('Case Data Types');
  });

  it('CDT-006: sidebar shows "Users" tab', async () => {
    expect(await cdt.getPageText()).toContain('Users');
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  CASE TYPES (Image 4 – left panel)
  // ══════════════════════════════════════════════════════════════════════════

  describe('Case Types panel', () => {

    it('CDT-007: "Case Types" heading is visible', async () => {
      expect(await cdt.getPageText()).toContain('Case Types');
    });

    it('CDT-008: New Case Type input is present', async () => {
      const input = await cdt.getCaseTypeInput();
      await expect(input).toBeExisting();
    });

    it('CDT-009: Case Types "Add" button is present', async () => {
      const btn = await cdt.getCaseTypeAddButton();
      expect(btn).not.toBeNull();
    });

    it('CDT-010: existing type "Class Action" is shown', async () => {
      expect(await cdt.getPageText()).toContain('Class Action');
    });

    it('CDT-011: existing type "Samsonite" is shown', async () => {
      expect(await cdt.getPageText()).toContain('Samsonite');
    });

    it('CDT-012: existing type "Uncivil Litigation" is shown', async () => {
      expect(await cdt.getPageText()).toContain('Uncivil Litigation');
    });

    it('CDT-013: can add a new case type and see it on the page', async () => {
      await cdt.addCaseType(TEST_DATA.CASE_TYPE);
      expect(await cdt.caseTypeListContains(TEST_DATA.CASE_TYPE)).toBe(true);
    });

    it('CDT-014: can delete the test case type', async () => {
      const deleted = await cdt.deleteCaseType(TEST_DATA.CASE_TYPE);
      expect(deleted).toBe(true);
    });

    it('CDT-015: deleted case type is no longer on the page', async () => {
      expect(await cdt.caseTypeListContains(TEST_DATA.CASE_TYPE)).toBe(false);
    });

    after(async () => {
      // Safety cleanup
      try {
        if (await cdt.caseTypeListContains(TEST_DATA.CASE_TYPE)) {
          await cdt.deleteCaseType(TEST_DATA.CASE_TYPE);
        }
      } catch { /* already clean */ }
    });
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  CASE STATUSES (Image 4 – middle panel)
  // ══════════════════════════════════════════════════════════════════════════

  describe('Case Statuses panel', () => {

    it('CDT-016: "Case Statuses" heading is visible', async () => {
      expect(await cdt.getPageText()).toContain('Case Statuses');
    });

    it('CDT-017: "Group Custom Statuses" checkbox is present', async () => {
      const cb = await cdt.getGroupByCheckbox();
      await expect(cb).toBeExisting();
    });

    it('CDT-018: checkbox is checked by default', async () => {
      expect(await cdt.isGroupByChecked()).toBe(true);
    });

    it('CDT-019: can toggle Group By checkbox off then back on', async () => {
      await cdt.toggleGroupByCheckbox();
      expect(await cdt.isGroupByChecked()).toBe(false);
      await cdt.toggleGroupByCheckbox();
      expect(await cdt.isGroupByChecked()).toBe(true);
    });

    for (const group of STATUS_GROUPS) {
      it(`CDT-020-${group}: "${group}" status group label is visible`, async () => {
        expect(await cdt.isStatusGroupVisible(group)).toBe(true);
      });
    }

    // ── Status creation dialogs ──────────────────────────────────────────────
    // Each group gets its own describe block with beforeEach/afterEach cleanup

    for (const group of STATUS_GROUPS) {
      describe(`Create Status modal – ${group}`, () => {

        beforeEach(async () => {
          await login.loginIfNeeded();
          await cdt.goToCaseDataTypes();
          if (await cdt.isDialogOpen()) await cdt.closeDialog();
        });

        afterEach(async () => {
          try {
            if (await cdt.isDialogOpen()) await cdt.closeDialog();
          } catch { /* already closed */ }
        });

        it(`CDT-DLG-${group}-01: clicking + opens the Create Status dialog`, async () => {
          await cdt.clickPlusForGroup(group);
          expect(await cdt.waitForDialog()).toBe(true);
          await cdt.closeDialog();
        });

        it(`CDT-DLG-${group}-02: dialog contains "System Status" label`, async () => {
          await cdt.clickPlusForGroup(group);
          await cdt.waitForDialog();
          expect(await cdt.getPageText()).toContain('System Status');
          await cdt.closeDialog();
        });

        it(`CDT-DLG-${group}-03: dialog contains "${group}" group name`, async () => {
          await cdt.clickPlusForGroup(group);
          await cdt.waitForDialog();
          expect(await cdt.getPageText()).toContain(group);
          await cdt.closeDialog();
        });

        it(`CDT-DLG-${group}-04: dialog has a Status name input`, async () => {
          await cdt.clickPlusForGroup(group);
          await cdt.waitForDialog();
          const input = await cdt.getStatusInput();
          expect(await input.isExisting()).toBe(true);
          await cdt.closeDialog();
        });

        it(`CDT-DLG-${group}-05: dialog has a Description textarea`, async () => {
          await cdt.clickPlusForGroup(group);
          await cdt.waitForDialog();
          const ta = await cdt.getDescriptionTextarea();
          expect(await ta.isExisting()).toBe(true);
          await cdt.closeDialog();
        });

        it(`CDT-DLG-${group}-06: dialog has Save and Cancel buttons`, async () => {
          await cdt.clickPlusForGroup(group);
          await cdt.waitForDialog();
          expect(await cdt.getSaveButton()).not.toBeNull();
          expect(await cdt.getCancelButton()).not.toBeNull();
          await cdt.closeDialog();
        });

        it(`CDT-DLG-${group}-07: can type in the Status name input`, async () => {
          await cdt.clickPlusForGroup(group);
          await cdt.waitForDialog();
          const input = await cdt.getStatusInput();
          await input.setValue(`Test${group}Status`);
          expect(await input.getValue()).toBe(`Test${group}Status`);
          await cdt.closeDialog();
        });

        it(`CDT-DLG-${group}-08: Cancel closes the dialog`, async () => {
          await cdt.clickPlusForGroup(group);
          await cdt.waitForDialog();
          await cdt.closeDialog();
          expect(await cdt.isDialogOpen()).toBe(false);
        });
      });
    }
  });

  // ══════════════════════════════════════════════════════════════════════════
  //  EXPENSE TYPES (Image 4 – right panel)
  // ══════════════════════════════════════════════════════════════════════════

  describe('Expense Types panel', () => {

    before(async () => {
      await login.loginIfNeeded();
      await cdt.goToCaseDataTypes();
    });

    it('CDT-ET-001: "Expense Types" heading is visible', async () => {
      expect(await cdt.getPageText()).toContain('Expense Types');
    });

    it('CDT-ET-002: New Expense Type input is present', async () => {
      const input = await cdt.getExpenseTypeInput();
      await expect(input).toBeExisting();
    });

    it('CDT-ET-003: Expense Types "Add" button is present', async () => {
      const btn = await cdt.getExpenseTypeAddButton();
      expect(btn).not.toBeNull();
    });

    it('CDT-ET-004: existing type "Car" is shown', async () => {
      expect(await cdt.getPageText()).toContain('Car');
    });

    it('CDT-ET-005: existing type "Traveling" is shown', async () => {
      expect(await cdt.getPageText()).toContain('Traveling');
    });

    it('CDT-ET-006: can add a new expense type and see it on the page', async () => {
      await cdt.addExpenseType(TEST_DATA.EXPENSE_TYPE);
      expect(await cdt.expenseTypeListContains(TEST_DATA.EXPENSE_TYPE)).toBe(true);
    });

    it('CDT-ET-007: can delete the test expense type', async () => {
      const deleted = await cdt.deleteExpenseType(TEST_DATA.EXPENSE_TYPE);
      expect(deleted).toBe(true);
    });

    it('CDT-ET-008: deleted expense type is no longer on the page', async () => {
      expect(await cdt.expenseTypeListContains(TEST_DATA.EXPENSE_TYPE)).toBe(false);
    });

    after(async () => {
      try {
        if (await cdt.expenseTypeListContains(TEST_DATA.EXPENSE_TYPE)) {
          await cdt.deleteExpenseType(TEST_DATA.EXPENSE_TYPE);
        }
      } catch { /* already clean */ }
    });
  });
});