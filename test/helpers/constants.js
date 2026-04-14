export const URLS = {
  SETTINGS: 'https://app.thecasework.com/account/settings',
  CLIENTS:  'https://app.thecasework.com/clients'
};

// ── Pause durations (ms) ─────────────────────────────────────────────────────
export const WAIT = {
  SHORT:     500,
  MEDIUM:   1000,
  LONG:     2000,
  PAGE_LOAD: 3000
};

// ── AUTOTEST-prefixed data so tests are easy to identify and clean up ────────
export const TEST_DATA = {
  CASE_TYPE:    'AUTOTEST_CaseType',
  EXPENSE_TYPE: 'AUTOTEST_ExpenseType',
  STATUS_NAME:  'AUTOTEST_Status',
  STATUS_DESC:  'Created by automated test',

  CLIENT_NAME:    'AUTOTEST_Client',
  CLIENT_ADDRESS: '999 Test Blvd',
  CLIENT_CITY:    'Lehi',
  CLIENT_STATE:   'Utah',
  CLIENT_ZIP:     '84043',
  CLIENT_URL:     'https://autotest.example.com',
  CLIENT_PHONE:   '555-000-9999',

  CONTACT_NAME:   'Test Contact',
  CONTACT_TITLE:  'QA Engineer',
  CONTACT_EMAIL:  'test.contact@autotest.com',
  CONTACT_PHONE:  '555-000-8888',

  PHONE_TYPE:     'Mobile'
};

// ── The five system-level status groups ──────────────────────────────────────
export const STATUS_GROUPS = ['New', 'Active', 'Completed', 'Closed', 'Removed'];

// ── Feature list shown under Subscription on Account Info ────────────────────
export const FEATURES = [
  'Clients/Contacts', 'Case Management', 'Engagements', 'Tasks',
  'Events', 'Notes', 'Documents', 'Milestones', 'Templates',
  'Time Tracking', 'Expense Management', 'Invoices', 'Insights'
];

// ── Legal document titles ────────────────────────────────────────────────────
export const LEGAL_DOCS = [
  'Terms of Service',
  'Privacy Policy',
  'Data Processing Agreement'
];
