# Hivilux Motorized Tension Screens

The plugin supports RS485 or RS232 operated, motorized tension screens from Hivilux. I have tested the plugin using an RS485 connected TXN screen from [Hivilux](https://www.hivilux.de).

## Hivilux Command Protocol

Hivilux tension screens (but likely not all) are manufactured in China by Jampo. As such they likely share the serial command protocol with other rebranded projection screens:

| Command | Hex-Bytes |
|----|----|
| up | FFEEEEEEDD|
| down | FFEEEEEEEE |
| stop | FFEEEEEECC |

Unfortunately these screens lack positional feedback or command responses. As such it is impossible to determine if the command has been accepted, rejected, is in progress or has completed.  See below for an alternative positioning system.

## Hardware setup

I'm running the projection screen with a [Raspberry Pi Zero W](https://www.raspberrypi.org/products/raspberry-pi-zero-w/) and an [RS485 Pi](https://www.abelectronics.co.uk/p/77/RS485-Pi). The hardware setup is straightforward: Solder the RS485 Pi, connect it to the Zero and connect it
via a RS485 cable to the projection screen.

Make sure you disable the serial login shell on the RPi, but keep the serial port enabled.

## Software installation

I've already [written](https://github.com/grover/homebridge-ranger/blob/HEAD/docs/install/raspberrypi.md) a good tutorial on installing the Raspberry Pi Zero W from scratch. You can follow that guide until you get to the Bluetooth stuff. After that:

```bash
sudo npm install -g homebridge-screen --unsafe-perm
```

## Configure homebridge

In you config.json, add the following configuration for the projection screen:

```json
{
  "bridge": {
    "name": "Homebridge Screen Example",
    "username": "A9:B9:C9:D9:E9:F9",
    "port": 54732,
    "pin": "135-79-864"
  },
  "platforms": [
    {
      "platform": "Screen",
      "screens": [
        {
          "name": "Leinwand",
          "model": "Hivilux",
          "port": "/dev/serial0"
        }
      ]
    }
  ]
}
```

The above example is runnable with the hardware setup described above.

## What it looks like

If you've set up everything correctly, you'll see the projection screen as a window covering in HomeKit.

## Positioning

With the above configuration you'll be able to control the screen from HomeKit. 
It does, however, not update HomeKit if you use the remote control to move the screen
as the Hivilux protocol has no feedback channel. In order to enable automatic 
updates to the position information, you'll need to add a hall sensor (I've used 
a KY-003) to the setup, attaching a strong magnet to the back of the screen.

The hall sensor will update the screen on the actual position (up or down.) The following
setup works with the KY-003:

```json
{
  "bridge": {
    "name": "Homebridge Screen Example",
    "username": "A9:B9:C9:D9:E9:F9",
    "port": 54732,
    "pin": "135-79-864"
  },
  "platforms": [
    {
      "platform": "Screen",
      "screens": [
        {
          "name": "Leinwand",
          "model": "Hivilux",
          "port": "/dev/serial0",
          "positioning": {
            "mode": "gpio",
            "pin": 18,
            "pullUpDown": "up",
            "signal": "low"
          }
        }
      ]
    }
  ]
}
```

This should not depend upon the specific hall sensor or it actually being a hall sensor. Anything that
is able to drive a GPIO pin low will work with the above configuration.
