import dotenv from 'dotenv';
dotenv.config();
 
export const config = {
  runner: 'local',
 
  specs: ['./test/specs/**/*.spec.js'],
  exclude: [],
 
  maxInstances: 1,
 
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: [
        '--window-size=1920,1080',
        '--no-sandbox',
        '--disable-dev-shm-usage'
      ]
    }
  }],
 
  logLevel: 'warn',
  bail: 0,
  baseUrl: 'https://app.thecasework.com',
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
 
  framework: 'mocha',
  reporters: ['spec'],
 
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000
  }
};