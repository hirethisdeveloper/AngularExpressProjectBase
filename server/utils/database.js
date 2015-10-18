var mysql = require('mysql'),
    utils = require("./utils.js");
// =========================================== //
var settings = {
    user    : 'projectblockdb',
    password: 'Pr0j#cT8l0cK',
    database: 'projectblockdb',
    host    : "71.191.193.34"
};
exports.db   = mysql.createConnection(settings);
