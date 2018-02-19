'use strict';

const ScreenTypes = {
  'Hivilux': require('./Hivilux')
};


function createScreenByName(name, log, config) {
  const screenType = ScreenTypes[name];
  if (screenType === undefined) {
    const message = `Unknown screen model: ${name}`;
    log(message);
    throw new Error(message);
  }

  return new screenType(log, config);
}

module.exports = {
  byName: createScreenByName
};
