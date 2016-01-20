var debug          = require("debug")('Prismatik');
var prismatik      = require("./lib/prismatik-client");

module.exports = function (homebridge)
{
  if(typeof homebridge !== "undefined")
  {
    Service         = homebridge.hap.Service;
    Characteristic  = homebridge.hap.Characteristic;
    Accessory       = homebridge.hap.Accessory;

    console.log("Prismatik initializing");
  }

  homebridge.registerAccessory("homebridge-prismatik", "Prismatik", PrismatikAccessory);
}

function PrismatikAccessory(log, config) {
  this.log    = log;

  this.host   = config['host'];
  this.port   = config['port'];
  this.apikey = config["apikey"];
}

PrismatikAccessory.prototype = {

  setPowerState: function(powerOn, callback) {
    var url;

    var options = {
       host: this.host,
       port: this.port,
       apikey: this.apikey
    };

    prismatik.connect(function(isConnected) {
       if (isConnected) {
          prismatik.lock(function(success) {
             if (success) {
                if (powerOn) {
                  prismatik.turnOn(function() {
                    this.log("Turning on!");
                    callback();
                  }.bind(this));
                } else {
                  prismatik.turnOff(function() {
                    this.log("Turning off!");
                    callback();
                  }.bind(this));
                }
             } else {
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

  setBrightness: function(level, callback) {
    
    this.log("Setting brightness to %s", level);

    var options = {
       host: this.host,
       port: this.port,
       apikey: this.apikey
    };

    prismatik.connect(function(isConnected) {
       if (isConnected) {
          prismatik.lock(function(success) {
             if (success) {
                prismatik.setBrightness(level, function() {
                  callback();
                }.bind(this));
             } else {
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

  
  identify: function(callback) {
    this.log("Identify requested!");
    callback(); // success
  },
  
  getServices: function() {

    // you can OPTIONALLY create an information service if you wish to override
    // the default values for things like serial number, model, etc.
    var informationService = new Service.AccessoryInformation();
    
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Prismatik Manufacturer")
      .setCharacteristic(Characteristic.Model, "Prismatik Model")
      .setCharacteristic(Characteristic.SerialNumber, "Prismatik Serial Number");
    
    var lightbulbService = new Service.Lightbulb();
    
    lightbulbService
      .getCharacteristic(Characteristic.On)
      .on('set', this.setPowerState.bind(this));
    
    
    lightbulbService
      .addCharacteristic(new Characteristic.Brightness())
      .on('set', this.setBrightness.bind(this));
        
    return [informationService, lightbulbService];
  }
};
