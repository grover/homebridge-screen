'use strict';

const Screens = require('./screens/Screens');
const PositioningFactory = require('./positioning/Factory');

let Accessory, Characteristic, Service;

class ScreenAccessory {
  constructor(api, log, config) {
    Accessory = api.hap.Accessory;
    Characteristic = api.hap.Characteristic;
    Service = api.hap.Service;

    this.log = log;
    this.name = config.name;
    this.version = config.version;
    this.config = config;

    this._screen = Screens.byName(this.config.model, this.log, this.config);

    this._positioning = PositioningFactory.create(this.log, this._screen, this.config.positioning);
    this._positioning.on('position', this._positionChanged.bind(this));

    this._services = this.createServices();
  }

  getServices() {
    return this._services;
  }

  createServices() {
    return [
      this.getWindowCoveringService(),
      this.getAccessoryInformationService()
    ];
  }

  getAccessoryInformationService() {
    return new Service.AccessoryInformation()
      .setCharacteristic(Characteristic.Name, this.name)
      .setCharacteristic(Characteristic.Manufacturer, 'Michael Froehlich')
      .setCharacteristic(Characteristic.Model, `${this.config.model} Projection Screen`)
      .setCharacteristic(Characteristic.SerialNumber, '99')
      .setCharacteristic(Characteristic.FirmwareRevision, this.version)
      .setCharacteristic(Characteristic.HardwareRevision, this.version);
  }

  getWindowCoveringService() {
    this._windowCovering = new Service.WindowCovering(this.name);

    this._windowCovering.getCharacteristic(Characteristic.TargetPosition)
      .setProps({ minStep: 100 })
      .on('set', this._setTargetPosition.bind(this));

    this._windowCovering.getCharacteristic(Characteristic.HoldPosition)
      .updateValue(false)
      .on('set', this._setHold.bind(this));
      
    this._windowCovering.getCharacteristic(Characteristic.CurrentPosition)
      .updateValue(0);
      .on('get', this._getCurrentPosition.bind(this));

    this._windowCovering.getCharacteristic(Characteristic.PositionState)
      .updateValue(Characteristic.PositionState.STOPPED)
      .on('get', this._getPositionState.bind(this));

    return this._windowCovering;
  }

  identify(callback) {
    this.log(`Identify requested on ${this.name}`);
    callback();
  }

  async _setTargetPosition(value, callback) {
    this.log(`New target position ${value}`);

    this._resetHold();

    const direction = value > 0
      ? Characteristic.PositionState.INCREASING
      : Characteristic.PositionState.DECREASING;

    this._signalMoving(direction);

    this._MoveTime = new Date();
    this.log("Starting Move at :" + this._moveTime);
    if (direction === Characteristic.PositionState.DECREASING) {
      await this._screen.up();
    }
    else {
      await this._screen.down();
    }

    setTimeout(() => {
      this._signalMoving(Characteristic.PositionState.STOPPED);
      this._MoveTime=null;
    }, 1000 * this.config.screenDeployTime);
    callback(undefined);
  }

  async _setHold(value, callback) {
    if (value === 0) {
      callback(new Error('Illegal value'));
    }

    this.log(`Hold ${value}`);
    this._hold = true;
    await this._transmitStop();

    callback(undefined);
  }

  _resetHold() {
    this._hold = false;
    this._windowCovering
      .getCharacteristic(Characteristic.HoldPosition)
      .updateValue(false);
  }

  async _transmitStop() {
    await this._screen.stop();
    this._signalMoving(Characteristic.PositionState.STOPPED);
  }

  _getPositionState(callback) {
    this.log("Returning state: " + this._state);
    callback(null, this._state);
  }
  
  _getCurrentPosition(callback) {
    this.log("Returning position");
    callback(null,this._MoveTime?
	     Math.floor((new Date() - this._MoveTime)/1000/
			this.config.screenDeployTime):);
  }
  
  _signalMoving(state) {
    this._state=state;
    this._windowCovering
      .getCharacteristic(Characteristic.PositionState)
      .updateValue(state);
  }

  _positionChanged(state) {
    const value = state === 'up' ? 0 : 100;

    this._windowCovering
      .getCharacteristic(Characteristic.CurrentPosition)
      .updateValue(value);

    this._windowCovering
      .getCharacteristic(Characteristic.TargetPosition)
      .updateValue(value);

    this._signalMoving(Characteristic.PositionState.STOPPED);
  }
}

module.exports = ScreenAccessory;
