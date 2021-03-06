var color     = require('color');
var prismatik = require("./lib/prismatik-client");

module.exports = function (homebridge)
{
    if(typeof homebridge !== "undefined")
    {
        console.log("Prismatik initializing");

        Service         = homebridge.hap.Service;
        Characteristic  = homebridge.hap.Characteristic;
        Accessory       = homebridge.hap.Accessory;

        homebridge.registerAccessory("homebridge-prismatik", "Prismatik", PrismatikAccessory);
    }
}

function PrismatikAccessory(log, config)
{
    this.log    = log;

    this.host   = config['host'];
    this.port   = config['port'];
    this.apikey = config["apikey"];

    this.hue    = 0;
    this.sat    = 100;
    this.bri    = 50;
}

PrismatikAccessory.prototype =
{
    getPowerState: function(callback)
    {
        var options = {
            host: this.host,
            port: this.port,
            apikey: this.apikey
        };

        prismatik.connect(function(isConnected)
        {
            if (isConnected)
            {
                prismatik.getStatus(function(power)
                {
                    this.log("Getting power status: %s", power);
                    callback(null, power);

                    prismatik.disconnect();
                }.bind(this));
            }
            else
            {
                this.log("Failed to connect to Prismatik");
                callback(null, false);
            }
        }.bind(this), options);
    },

    setPowerState: function(powerOn, callback)
    {
        var options =
        {
            host: this.host,
            port: this.port,
            apikey: this.apikey
        };

        prismatik.connect(function(isConnected)
        {
            if (isConnected)
            {
                prismatik.lock(function(success)
                {
                    if (success)
                    {
                        if (powerOn)
                        {
                            prismatik.turnOn(function()
                            {
                                this.log("Turning on!");
                                callback();
                            }.bind(this));
                        }
                        else
                        {
                            prismatik.turnOff(function()
                            {
                                this.log("Turning off!");
                                callback();
                            }.bind(this));
                        }
                    }
                    else
                    {
                        this.log("Could not lock, something else has already connected.");
                        prismatik.disconnect();
                        callback();
                    }
                }.bind(this));
            }
            else
            {
                this.log("Failed to connect to Prismatik");
                callback();
            }
        }.bind(this), options);
    },

    getBrightness: function(callback)
    {
        var brightness = 100;

        this.log("Getting brightness status: %s", brightness);
        callback(null, brightness);
    },

    setBrightness: function(level, callback)
    {
        this.log("Setting brightness to %s", level);

        var options =
        {
            host: this.host,
            port: this.port,
            apikey: this.apikey
        };

        prismatik.connect(function(isConnected)
        {
            if (isConnected)
            {
                prismatik.lock(function(success)
                {
                    if (success)
                    {
                        prismatik.setBrightness(level, function()
                        {
                            callback();
                        }.bind(this));
                    }
                    else
                    {
                        this.log("Could not lock, something else has already connected.");
                        prismatik.disconnect();
                        callback();
                    }
                }.bind(this));
            }
            else
            {
                this.log("Failed to connect to Prismatik");
                callback();
            }
        }.bind(this), options);
    },

    setHue: function(hue, callback)
    {
        this.log("Setting hue to %s", hue);
        this.hue = Math.round(hue);

        var hsl = color(
        {
            h: this.hue,
            s: this.sat,
            l: this.bri
        });

        var options =
        {
            host: this.host,
            port: this.port,
            apikey: this.apikey
        };

        prismatik.connect(function(isConnected)
        {
            if (isConnected)
            {
                prismatik.lock(function(success)
                {
                    if (success)
                    {
                        prismatik.setColorToAll(hsl.red(), hsl.green(), hsl.blue(), function()
                        {
                            callback();
                        }.bind(this));
                    }
                    else
                    {
                        this.log("Could not lock, something else has already connected.");
                        prismatik.disconnect();
                        callback();
                    }
                }.bind(this));
            }
            else
            {
                this.log("Failed to connect to Prismatik");
                callback();
            }
        }.bind(this), options);
    },

    setSaturation: function(saturation, callback)
    {
        this.log("Setting saturation to %s", saturation);
        this.sat = Math.round(saturation);

        var hsl = color(
        {
            h: this.hue,
            s: this.sat,
            l: this.bri
        });

        var options =
        {
            host: this.host,
            port: this.port,
            apikey: this.apikey
        };

        prismatik.connect(function(isConnected)
        {
            if (isConnected)
            {
                prismatik.lock(function(success)
                {
                    if (success)
                    {
                        prismatik.setColorToAll(hsl.red(), hsl.green(), hsl.blue(), function()
                        {
                            callback();
                        }.bind(this));
                    }
                    else
                    {
                        this.log("Could not lock, something else has already connected.");
                        prismatik.disconnect();
                        callback();
                    }
                }.bind(this));
            } else {
                this.log("Failed to connect to Prismatik");
                callback();
            }
        }.bind(this), options);
    },

    identify: function(callback)
    {
        this.log("Identify requested!");
        callback();
    },

    getServices: function()
    {
        var lightbulbService   = new Service.Lightbulb();
        var informationService = new Service.AccessoryInformation();

        informationService
            .setCharacteristic(Characteristic.Manufacturer, "Prismatik Manufacturer")
            .setCharacteristic(Characteristic.Model, "Prismatik Model")
            .setCharacteristic(Characteristic.SerialNumber, this.host);

        lightbulbService
            .getCharacteristic(Characteristic.On)
            .on('set', this.setPowerState.bind(this))
            .on('get', this.getPowerState.bind(this));

        lightbulbService
            .addCharacteristic(Characteristic.Brightness)
            .on('set', this.setBrightness.bind(this))
            .on('get', this.getBrightness.bind(this));

        lightbulbService
            .addCharacteristic(Characteristic.Hue)
            .on('set', this.setHue.bind(this));

        lightbulbService
            .addCharacteristic(Characteristic.Saturation)
            .on('set', this.setSaturation.bind(this));

        return [informationService, lightbulbService];
    }
};