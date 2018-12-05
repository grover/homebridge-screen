'use strict';

const EventEmitter = require('events').EventEmitter;
const rpio=require('rpio')

class GPIOScreen extends EventEmitter {
  constructor(log, config) {
    super();
    this.log = log;
    this.config = config;
    this.config.writeTime=this.config.writeTime || 1;
    this._setupPins();
    this.emit('reachable', true);
  }

  up() {
    this.log('Sending up command');
    return this._sendCommand(this.config.pinup);
  }

  down() {
    this.log('Sending down command');
    return this._sendCommand(this.config.pindown);
  }		      

  stop() {
    this.log('Sending stop command');
    return this._sendCommand(this.config.pinup,this.config.pindown);
  }

  _sendCommand(...commands) {
    commands.forEach(com => rpio.write(com,rpio.HIGH));
    return new Promise(resolve => {
      setTimeout(() => {
	commands.forEach(com => rpio.write(com,rpio.LOW));
	resolve();
      },this.config.writeTime * 1000);
    });
  }
 
  _setupPins() {
    rpio.open(this.config.pinup, rpio.OUTPUT, rpio.LOW);
    rpio.open(this.config.pindown, rpio.OUTPUT, rpio.LOW);
  }
}

module.exports = GPIOScreen;
