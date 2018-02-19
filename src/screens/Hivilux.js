'use strict';

const util = require('util');
const EventEmitter = require('events').EventEmitter;

const SerialPort = require('serialport');

const cmds = {
  'up': Buffer.from([0xFF, 0xEE, 0xEE, 0xEE, 0xDD]),
  'down': Buffer.from([0xFF, 0xEE, 0xEE, 0xEE, 0xEE]),
  'stop': Buffer.from([0xFF, 0xEE, 0xEE, 0xEE, 0xCC]),
};

const defaultPortSettings = {
  autoOpen: true,
  baudRate: 2400,
  dataBits: 8,
  stopBits: 1,
  parity: 'none'
};


class HiviluxScreen extends EventEmitter {

  constructor(log, config) {
    super();

    this.log = log;
    this.config = config;

    this._port = new SerialPort(
      config.port,
      defaultPortSettings);

    this._port
      .on('open', this._onSerialPortOpened.bind(this))
      .on('error', this._onSerialPortError.bind(this))
      .on('close', this._onSerialPortClose.bind(this))
      .on('data', this._onSerialPortDataReceived.bind(this));
  }

  up() {
    this.log('Sending up command');
    return this._sendCommand(cmds.up);
  }

  down() {
    this.log('Sending down command');
    return this._sendCommand(cmds.down);
  }

  stop() {
    this.log('Sending stop command');
    return this._sendCommand(cmds.stop);
  }

  _sendCommand(cmd) {
    if (!this._port.isOpen) {
      return Promise.reject('Port not open');
    }

    return new Promise((resolve, reject) => {
      this._port.write(cmd, (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  _onSerialPortOpened() {
    this.log('Serial port opened');
    this.emit('reachable', true);


    this._port.flush();
    this._port.drain();
  }

  _onSerialPortError(e) {
    this.log(`Serial port failed: ${util.inspect(e)}`);
    this.emit('reachable', false);
  }

  _onSerialPortClose(disconnectError) {
    this.log(`Serial port closed. disconnectError=${util.inspect(disconnectError)}`);
    this.emit('reachable', false);
  }

  _onSerialPortDataReceived() {
    this.log(`Serial port data received: ${util.inspect(this._port.read())}`);
  }
}

module.exports = HiviluxScreen;
