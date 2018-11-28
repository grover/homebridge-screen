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
    write: () => { }
  };
}
module.exports.rpio = rpio;
