// test/helpers/constants.js

export const URLS = {
  BASE:      'https://app.thecasework.com',
  SETTINGS:  'https://app.thecasework.com/account/settings',
  CLIENTS:   'https://app.thecasework.com/account/clientsParties'
};

export const WAIT = {
  SHORT:     500,
  MEDIUM:   1000,
  LONG:     2000,
  PAGE_LOAD: 3000
};

// All AUTOTEST-prefixed so they're easy to find and clean up
export const TEST_DATA = {
  // Case data types
  CASE_TYPE:    'AUTOTEST_CaseType',
  EXPENSE_TYPE: 'AUTOTEST_ExpenseType',
  STATUS_NAME:  'AUTOTEST_Status',
  STATUS_DESC:  'Created by automated test',

  // Client create form
  CLIENT_NAME:    'AUTOTEST_Client',
  CLIENT_ADDRESS: '999 Test Blvd',
  CLIENT_CITY:    'Lehi',
  CLIENT_STATE:   'Utah',
  CLIENT_ZIP:     '84043',
  CLIENT_URL:     'https://autotest.example.com',
  CLIENT_PHONE:   '5550009999',
  PHONE_TYPE:     'Mobile',

  // Contact
  CONTACT_NAME:  'AUTOTEST Contact',
  CONTACT_TITLE: 'QA Engineer',
  CONTACT_EMAIL: 'autotest@example.com'
};

export const STATUS_GROUPS = ['New', 'Active', 'Completed', 'Closed', 'Removed'];

export const FEATURES = [
  'Clients/Contacts', 'Case Management', 'Engagements', 'Tasks',
  'Events', 'Notes', 'Documents', 'Milestones', 'Templates',
  'Time Tracking', 'Expense Management', 'Invoices', 'Insights'
];

export const LEGAL_DOCS = [
  'Terms of Service',
  'Privacy Policy',
  'Data Processing Agreement'
];

// CSV files relative to project root
export const CSV_FILES = [
  './test-data/clients_5.csv',
  './test-data/clients_50.csv',
  './test-data/clients_100.csv'
];