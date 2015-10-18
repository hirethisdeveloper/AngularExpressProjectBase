require('pmx').init();

var db_devices = require("../models/devices.js"),
    utils      = require("../utils/utils.js"),
    db_auth    = require("../models/auth.js"),
    inspect    = require('util').inspect;
// GET - INDEX ROUTE CONTROLLER
exports.index                = function (req, res) {
    var json    = {"app": "APP", "version": "0.0.1"},
        jsonStr = JSON.stringify(json);
    console.log(jsonStr);
    res.send(jsonStr);
};
