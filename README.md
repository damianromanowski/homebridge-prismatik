# Prismatik plugin for Homebridge

This is a basic plugin to enable Prismatik support for Homebridge. It allows you to turn Prismatik on and off, and adjust the brightness, hue and saturation levels.

## Installation

1. Install homebridge using: 
  * `npm install -g homebridge`

2. Install this plugin using:
  * `npm install -g homebridge-prismatik`

3. Update your configuration file. See the sample below.

## Configuration

To use with Homebridge, you'll need to update your config file like so:

	"accessories": [
        {
            "accessory": "Prismatik",
            "name": "TV lights",
            "host": "x.x.x.x",
            "port": 3636,
            "apikey": "key"
        }
    ]

**Note:** If `host` and `port` are not specified, `localhost (127.0.0.1)` and `3636` will be used as the default values.

You will need to go to the _Experimental_ tab in the Prismatik software, enable the API server, and set the Key (the code above assumes a Key of "key")


## Known issues

* The Prismatik API sometimes freezes in a _busy_ state and requires a restart, not sure the reason behind this yet.
* The Prismatik API does not provide a way to retrieve the current brightneess level. I don't see a way of getting around this.
* Hue and saturation values are set to the default values of _0_ and _100_ respectively until i figure out a way to retrieve a proper value. But since the LED's can be set to individual colors, this is somewhat problematic.


## Credits

Special thanks to [Ben Dodson](https://github.com/bendodson/) for his work on the original prismatik plugin @ [homebridge-prismatik](https://github.com/bendodson/homebridge-prismatik) /  [8c02c54](https://github.com/bendodson/homebridge-prismatik/commit/8c02c542e540934ef62a6c90eead72a1c811f30c)