const serialport = require('.');

module.exports = {
    targets: function () {
        return serialport.getSerialPortTargets();
    }
};
