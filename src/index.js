/*!
 * Copyright (c) 2016 Nanchao Inc.
 * All rights reserved.
 */

'use strict';

var driver = require('ruff-driver');
var mdelay = driver.mdelay;

module.exports = driver({
    attach: function (inputs, context) {
        this._gpio = inputs['gpio'];
        this._uart = inputs['uart'];
        this._baudRate = this._uart.baudRate;
        this._stopBits = this._uart.stopBits;
        this._dataBits = this._uart.dataBits;
        this._parity = this._uart.parity;
        this._charLength = 1 + this._dataBits + this._stopBits + (!!this._parity - 0);

        var args = context.args;

        this._txEnableControl = args.txEnableControl;
        this._txActiveLevel = args.txActiveLevel;
    },
    exports: {
        read: function (callback) {
            this._uart.read(function (error, data) {
                if (error) {
                    callback(error);
                    return;
                }
                callback(undefined, data);
            });
        },
        write: function (data, callback) {
            var that = this;
            this._gpio.write(this._txActiveLevel, function (error) {
                if (error) {
                    callback(error);
                    return;
                }
                rxToTxSwitchDelay.call(that);
                // console.log('uart data is ', data);
                that._uart.write(data, function (error) {
                    txToRxSwitchDelay.call(that, data);
                    that._gpio.write(1 - that._txActiveLevel, function () {
                        callback && callback(error);
                    });
                });
            });
        }
    }
});

function txToRxSwitchDelay(data) {
    if (this._txEnableControl) {
        var dataLength = data.length;
        var delay = 1000 / this._baudRate * this._charLength * dataLength;
        mdelay(delay);
    }
}
function rxToTxSwitchDelay() {
    if (this._txEnableControl) {
        mdelay(1);
    }
}
// function test (){
// var data = new Buffer(256);for (var i = 0 ; i < data.length; i++) {data[i]= i;};
// }
