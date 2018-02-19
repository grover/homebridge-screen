'use strict';

if (process.argv.length === 1) {
  console.error('Missing command line argument. Must be \'up\', \'down\' or \'stop\'.');
}

const SerialPort = require('serialport');

const cmds = {
  'up': Buffer.from([0xFF, 0xEE, 0xEE, 0xEE, 0xDD]),
  'down': Buffer.from([0xFF, 0xEE, 0xEE, 0xEE, 0xEE]),
  'stop': Buffer.from([0xFF, 0xEE, 0xEE, 0xEE, 0xCC]),
  'login': Buffer.from([0xFF, 0xEE, 0xEE, 0xEE, 0xAA]),
  'what': Buffer.from([0xFF, 0xEE, 0xEE, 0xEE, 0xBB])
};


const port = new SerialPort(
  '/dev/serial0', {
    autoOpen: true,
    baudRate: 2400,
    dataBits: 8,
    stopBits: 1,
    parity: 'none'
  });

port.on('open', () => {
  const cmd = cmds[process.argv[2]];

  port.flush();
  port.drain();

  port.write(cmd, () => {
    console.log('Command sent.');
  });
});

port.on('error', () => {
  console.log('Serial port reported an error.');
});

port.on('close', () => {
  console.log('Serial port close.');
});

port.on('data', () => {
  const data = Buffer.from(port.read());
  console.log(`Serial port received data: ${data}`);
});

