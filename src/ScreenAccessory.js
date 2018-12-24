'use strict';

const Screens = require('./screens/Screens');
const PositioningFactory = require('./positioning/Factory');

let Characteristic, Service;

class ScreenAccessory {
  constructor(api, log, config) {
    Characteristic = api.hap.Characteristic;
    Service = api.hap.Service;

    this.log = log;
    this.name = config.name;
    this.version = config.version;
    config.screenDeployTime=config.screenDeployTime || 20;
    this.config = config;
    
    this._screen = Screens.byName(this.config.model, this.log, this.config);
    this._screen.on('reachable', this._setReachable.bind(this));

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

    this._windowCovering.addOptionalCharacteristic(Characteristic.StatusFault);
    this._windowCovering.getCharacteristic(Characteristic.TargetPosition)
      .setProps({ minStep: 100 })
      .on('get', this._getTargetPosition.bind(this))
      .on('set', this._setTargetPosition.bind(this));

    this._windowCovering.getCharacteristic(Characteristic.CurrentPosition)
      .updateValue(0)
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

  _setReachable(reachable) {
    this._reachibility=reachable;
    this._windowCovering
      .getCharacteristic(Characteristic.StatusFault)
      .updateValue(reachable?
        Characteristic.StatusFault.NO_FAULT:
        Characteristic.StatusFault.GENERAL_FAULT);
  }
  
  async _setTargetPosition(value, callback) {
    this.log(`Setting new target position ${value}`);
    this._targetPosition=value;

    const direction = value > 0
      ? Characteristic.PositionState.INCREASING
      : Characteristic.PositionState.DECREASING;

    this._signalMoving(direction);
    this._moveTime = new Date();

    if (direction === Characteristic.PositionState.DECREASING) {
      await this._screen.up();
    } else {
      await this._screen.down();
    }

    setTimeout(() => {
      callback(null);
      this._position = value;
      this._signalMoving(Characteristic.PositionState.STOPPED);
      this._windowCovering
        .getCharacteristic(Characteristic.CurrentPosition)
        .updateValue(value);
      this._moveTime=null;
    }, 1000 * this.config.screenDeployTime);
  }

  async _setHold(value, callback) {
    if (value === 0) {
      callback(new Error('Illegal value'));
    }

    this.log(`Hold ${value}`);
    this._hold = true;
    await this._transmitStop();

    callback(null);
  }

  _resetHold() {
    this._hold = false;
    this._windowCovering
      .getCharacteristic(Characteristic.HoldPosition)
      .updateValue(false);
  }

  async _transmitStop() {
    await this._screen.stop();
    this._position=0;
    this._signalMoving(Characteristic.PositionState.STOPPED);
  }

  _callIfReachable(callback,value) {
    if (this._reachable===undefined || this._reachable) 
      callback(null,value);
    else
      callback(new Error('No connection.'));
  }

  _getPositionState(callback) {
    this._callIfReachable(callback, this._state);
  }
  
  _getCurrentPosition(callback) {
    if (this._state != Characteristic.PositionState.STOPPED && this._moveTime) {
      this._position=
        Math.floor(100 * Math.min((new Date() - this._MoveTime)/1000/
                                  this.config.screenDeployTime,1));
    }
    this._position=this._position || 0;
    this._callIfReachable(callback,this._position);
  }

  _getTargetPosition(callback) {
    this._callIfReachable(callback,this._targetPosition);
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
