'use strict';

const EventEmitter = require('events').EventEmitter;
const rpio=require('rpio-pi')

class GPIOScreen extends EventEmitter {
  constructor(log, config) {
    super();
    this.log = log;
    this.config = config;
    this._setupPins();
    this.emit('reachable', true);
  }

  up() {
    this.log('Sending up command');
    rpio.write(this.config.pinup,rpio.HIGH);
    setTimeout(() => {
      rpio.write(this.config.pinup,rpio.LOW)
    },this.config.writetime || 1000);
  }

  down() {
    this.log('Sending down command');
    rpio.write(this.config.pindown,rpio.HIGH);
    setTimeout(() => {
      rpio.write(this.config.pindown,rpio.LOW)
    },this.config.writetime || 1000);

  }

  stop() {
    this.log('Sending stop command');
    rpio.write(this.config.pinup,rpio.HIGH);
    rpio.write(this.config.pindown,rpio.HIGH);
    setTimeout(() => {
      rpio.write(this.config.pindown,rpio.LOW);
      rpio.write(this.config.pinup,rpio.LOW);
    },this.config.writetime || 1000);
  }
  
  _setupPins() {
    rpio.open(this.config.pinup, rpio.OUTPUT, rpi.LOW);
    rpio.open(this.config.pindown, rpio.OUTPUT, rpi.LOW);
  }
}

module.exports = GPIOScreen;
