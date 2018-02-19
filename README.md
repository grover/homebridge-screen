# homebridge-screen

A homebridge plugin for motorized projection screens that are connected via RS232 or RS485.

## Status

[![HitCount](http://hits.dwyl.io/grover/homebridge-screen.svg)](https://github.com/grover/homebridge-screen)
[![Build Status](https://travis-ci.org/grover/homebridge-screen.png?branch=master)](https://travis-ci.org/grover/homebridge-screen)
[![Node version](https://img.shields.io/node/v/homebridge-screen.svg?style=flat)](http://nodejs.org/download/)
[![NPM Version](https://badge.fury.io/js/homebridge-screen.svg?style=flat)](https://npmjs.org/package/homebridge-screen)

## Installation instructions

After [Homebridge](https://github.com/nfarina/homebridge) has been installed:

 ```sudo npm install -g homebridge-screen```

### Configuration

The configuration depends upon the supported projection screen. At the moment the following projection screens are supported:

* [Hivilux Motorized Tension Screens](docs/config/hivilux.md)

The platform can operate any number of screens that have to be predefined in the homebridge config.json.

## Supported clients

This platform and the screens it creates have been verified to work with the following apps on iOS 11:

* Home
* Elgato Eve

## Some asks for friendly gestures

If you use this and like it - please leave a note by staring this package here or on GitHub.

If you use it and have a problem, file an issue at [GitHub](https://github.com/grover/homebridge-screen/issues) - I'll try to help.

If you tried this, but don't like it: tell me about it in an issue too. I'll try my best
to address these in my spare time.

If you fork this, go ahead - I'll accept pull requests for enhancements, additional screens etc.

## License

MIT License

Copyright (c) 2017 Michael Fröhlich

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

