
const version = require('../package.json').version;

const ScreenAccessory = require('./ScreenAccessory');


const HOMEBRIDGE = {
  Accessory: null,
  Service: null,
  Characteristic: null,
  UUIDGen: null
};

const platformName = 'homebridge-screen';
const platformPrettyName = 'Screen';

module.exports = (homebridge) => {
  HOMEBRIDGE.Accessory = homebridge.platformAccessory;
  HOMEBRIDGE.Service = homebridge.hap.Service;
  HOMEBRIDGE.Characteristic = homebridge.hap.Characteristic;
  HOMEBRIDGE.UUIDGen = homebridge.hap.uuid;

  homebridge.registerPlatform(platformName, platformPrettyName, ScreenPlatform, true);
};

const ScreenPlatform = class {
  constructor(log, config, api) {
    this.log = log;
    this.log('ScreenPlatform Plugin Loaded');
    this.config = config;
    this.api = api;
  }

  accessories(callback) {
    this.config.version = version;

    const accessories = [
      new ScreenAccessory(this.api, this.log, this.config)
    ];

    callback(accessories);
  }
};
