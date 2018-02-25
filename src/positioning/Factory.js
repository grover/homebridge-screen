'use strict';

const EventEmitter = require('events').EventEmitter;

const GpioPositioning = require('./GpioPositioning');

function create(log, screen, config) {
  if (config) {
    if (config.mode === 'gpio') {
      return new GpioPositioning(log, config);
    }
  }

  return new EventEmitter();
}

module.exports = {
  create: create
};
