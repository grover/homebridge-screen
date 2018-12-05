'use strict';
const ScreenTypes = {
  'Hivilux': true,
  'GPIOScreen': true
};

function createScreenByName(name, log, config) {
  if (ScreenTypes[name] === undefined) {
    const message = `Unknown screen model: ${name}`;
    log(message);
    throw new Error(message);
  } 
  var screenType=require(`./${name}`);
  return new screenType(log, config);
}

module.exports = {
  byName: createScreenByName
};
