'use strict';

const EventEmitter = require('events').EventEmitter;
const process = require('process');
const debounce = require('debounce');

const isPi = require('detect-rpi');
let rpio;

if (isPi()) {
  rpio = require('rpio');

  const options = {
    gpiomem: true,          /* Use /dev/gpiomem */
    mapping: 'physical'     /* Use the P1-P40 numbering scheme */
  };

  rpio.init(options);
}
else {
  rpio = {
    open: () => { },
    poll: () => { },
    read: () => { }
  };
}


class GpioPositioning extends EventEmitter {
  constructor(log, config) {
    super();

    this.log = log;

    this.config = config;
    this.config.pullUpDown = this.config.pullUpDown || 'off';

    this._updatePosition = debounce(this._updatePosition.bind(this), 250);

    this._setupPin();
    process.nextTick(this._refreshPosition.bind(this));
  }

  _setupPin() {
    const PullUpDownModes = {
      up: rpio.PULL_UP,
      down: rpio.PULL_DOWN,
      off: rpio.PULL_OFF
    };

    if (!PullUpDownModes.hasOwnProperty(this.config.pullUpDown)) {
      throw new Error('Invalid pull up/down gpio configuration');
    }

    let pullOption = PullUpDownModes[this.config.pullUpDown];
    rpio.open(this.config.pin, rpio.INPUT, pullOption);
    rpio.poll(this.config.pin, pin => {
      if (pin !== this.config.pin) {
        return;
      }

      this._refreshPosition();
    });
  }

  _refreshPosition() {
    this.log('Update position information');

    let pinValue = rpio.read(this.config.pin);
    if (pinValue != this._pinValue) {
      this._pinValue = pinValue;

      if (this.config.signal === 'high') {
        pinValue = !pinValue;
      }

      const state = pinValue ? 'down' : 'up';
      this._updatePosition(state);
    }
  }

  _updatePosition(state) {
    this.log(`Change on pin ${this.config.pin}: Read value ${this._pinValue} - reporting state: ${state}`);
    this.emit('position', state);
  }
}

module.exports = GpioPositioning;
