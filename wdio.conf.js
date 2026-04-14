// wdio.conf.js – ES Module config for theCaseWork automation

export const config = {
  runner: 'local',
  specs: ['./test/specs/**/*.spec.js'],
  exclude: [],

  maxInstances: 1,

  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['--window-size=1920,1080']
    }
  }],

  logLevel: 'warn',
  bail: 0,
  baseUrl: 'https://app.thecasework.com',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  framework: 'mocha',
  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 120000
  }

  // ── Authentication ───────────────────────────────────────────────────────
  // If your app requires login, add a before hook here:
  //
  // before: async function () {
  //   await browser.url('/login');
  //   await $('input[name="email"]').setValue('your-email');
  //   await $('input[name="password"]').setValue('your-password');
  //   await $('button[type="submit"]').click();
  //   await browser.pause(3000);
  // }
};
