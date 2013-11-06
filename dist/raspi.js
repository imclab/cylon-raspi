/*
 * Cylonjs Raspi adaptor
 * http://cylonjs.com
 *
 * Copyright (c) 2013 The Hybrid Group
 * Licensed under the Apache 2.0 license.
*/


(function() {
  'use strict';
  var namespace,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  namespace = require('node-namespace');

  namespace("Cylon.Adaptor", function() {
    return this.Raspi = (function(_super) {
      var PINS;

      __extends(Raspi, _super);

      PINS = {
        3: {
          rev1: 0,
          rev2: 2
        },
        5: {
          rev1: 1,
          rev2: 3
        },
        7: 4,
        8: 14,
        10: 15,
        11: 17,
        12: 18,
        13: {
          rev1: 21,
          rev2: 27
        },
        15: 22,
        16: 23,
        18: 24,
        19: 10,
        21: 9,
        22: 25,
        23: 11,
        24: 8,
        26: 7
      };

      function Raspi(opts) {
        Raspi.__super__.constructor.apply(this, arguments);
        this.connection = opts.connection;
        this.name = opts.name;
        this.board = "";
        this.pins = {};
      }

      Raspi.prototype.commands = function() {
        return ['pins', 'pinMode', 'digitalRead', 'digitalWrite', 'pwmWrite', 'servoWrite', 'firmwareName'];
      };

      Raspi.prototype.connect = function(callback) {
        Logger.debug("Connecting to board '" + this.name + "'...");
        this.connection.emit('connect');
        callback(null);
        return this.proxyMethods(this.commands, this.board, Raspi);
      };

      Raspi.prototype.disconnect = function() {
        Logger.debug("Disconnecting from board '" + this.name + "'...");
        return this.connection.emit('disconnect');
      };

      Raspi.prototype.firmwareName = function() {
        return 'Raspberry Pi';
      };

      Raspi.prototype.digitalRead = function(pinNum, callback) {
        var pin,
          _this = this;
        pin = this.pins[this._translatePin(pinNum)];
        if ((pin != null) && (pin.mode === 'r')) {
          pin.digitalRead(value);
        } else {
          pin = this._setupDigitalPin(pin, pinNum, 'r', 'digitalRead');
          pin.on('connect', function(data) {
            return pin.digitalRead(0.1);
          });
          pin.connect();
        }
        return true;
      };

      Raspi.prototype.digitalWrite = function(pinNum, value) {
        var pin,
          _this = this;
        pin = this.pins[this._translatePin(pinNum)];
        if ((pin != null) && (pin.mode === 'w')) {
          pin.digitalWrite(value);
        } else {
          pin = this._setupDigitalPin(pin, pinNum, 'w', 'digitalWrite');
          pin.on('connect', function(data) {
            return pin.digitalWrite(value);
          });
          pin.connect();
        }
        return value;
      };

      Raspi.prototype.pwmWrite = function(pin, value) {};

      Raspi.prototype.servoWrite = function(pin, value) {};

      Raspi.prototype._raspiPin = function(pinNum, mode) {
        var gpioPinNum;
        gpioPinNum = this._translatePin(pinNum);
        if (this.pins[gpioPinNum] == null) {
          this.pins[gpioPinNum] = new Cylon.IO.DigitalPin({
            pin: gpioPinNum,
            mode: mode
          });
        }
        return this.pins[gpioPinNum];
      };

      Raspi.prototype._translatePin = function(pinNum) {
        return PINS[pinNum];
      };

      Raspi.prototype._setupDigitalPin = function(pin, pinNum, mode, eventName) {
        var _this = this;
        if ((pin != null)) {
          pin.close();
        }
        pin = this._raspiPin(pinNum, 'w');
        pin.on(eventName, function(val) {
          return _this.connection.emit(eventName, val);
        });
        return pin;
      };

      return Raspi;

    })(Cylon.Basestar);
  });

}).call(this);
