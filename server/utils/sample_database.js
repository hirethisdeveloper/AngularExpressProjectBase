var mysql = require('mysql'),
    utils = require("./utils.js");
// =========================================== //
var settings = {
    user    : '',
    password: '',
    database: '',
    host    : ""
};
exports.db   = mysql.createConnection(settings);
