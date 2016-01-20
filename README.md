# Prismatik plugin for Homebridge

This is a basic plugin to enable Prismatik support for Homebridge. It allows you to turn Prismatik on and off and set the brightness as a percentage. To use with Homebridge, you'll need to update your config file like so:

## Configuration

	"accessories": [
        {
            "accessory": "Prismatik",
            "name": "TV lights",
            "host": "x.x.x.x",
            "port": 3636,
            "apikey": "key"
        }
    ]

If `host` and `port` are not specified, **localhost (127.0.0.1)** and **3636** will be used as defaults.

You will need to go to the _Experimental_ tab in the Prismatik software, enable the API server, and set the Key (the code above assumes a Key of "key")

## Notes

Special thanks to [Ben Dodson](https://github.com/bendodson/) for his original prismatik plugin @ [homebridge-prismatik](https://github.com/bendodson/homebridge-prismatik) /  [8c02c54](https://github.com/bendodson/homebridge-prismatik/commit/8c02c542e540934ef62a6c90eead72a1c811f30c)