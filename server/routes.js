var pmx        = require('pmx');
var app        = module.parent.exports.app,
    auth       = require("./controllers/authentication.js"),
    db_auth    = require("./models/auth.js"),
    getCtrl    = require("./controllers/get.js"),
    utils      = require("./utils/utils.js"),
    bodyParser = require('body-parser'),
    inspect    = require('util').inspect,
    jsonParser = bodyParser.json();
/*
 var middleware_post_deviceCheck = function (req, res, next) {
 var payload = utils.getQueryParams(req);
 if (payload.deviceId) {
 db_devices.deviceCheck(payload.deviceId, function (data) {
 if (data.status == 1) {
 next();
 }
 else {
 console.log(data);
 res.send(data);
 }
 });
 }
 else res.send({status: 0, error: "Invalid communication configuration"});
 };
 var middleware_get_deviceCheck  = function (req, res, next) {
 var deviceId = req.params.id;
 if (deviceId) {
 db_devices.deviceCheck(deviceId, function (data) {
 if (data.status == 1) {
 next();
 }
 else {
 console.log(data);
 res.send(data);
 }
 });
 }
 else res.send({status: 0, error: "Invalid communication configuration"});
 };
 var middleware_permissionCheck  = function (req, res, next) {
 //console.log(req.headers);
 var sessionId = req.headers.sessionid;
 if (sessionId) {
 db_devices.checkValidSessionId(sessionId, function (data) {
 if (data.status == 1) {
 if (data.results) {
 next();
 }
 else res.send(data);
 }
 else {
 //console.log(data);
 res.send(data);
 }
 });
 }
 else res.send({status: 0, error: "Invalid session"});
 };
 */
var middleware_session_check     = function (req, res, next) {
    var sessionId = req.headers.sessionid;
    if (sessionId) {
        var obj = {
            sessionId: sessionId
        };
        db_auth.checkValidSessionId(obj, function (data) {
            if (data.status == 1) {
                next();
            }
            else {
                console.log("middleware_session_check -> ", data);
                res.send(data);
            }
        });
    }
    else res.send({status: 0, error: "Invalid session"});
};
var middleware_tempSession_check = function (req, res, next) {
    //console.log(req.headers);
    var sessionId = req.headers.sessionid;
    if (sessionId) {
        var obj = {
            sessionId  : sessionId,
            sessionType: "temp"
        };
        db_auth.checkValidSessionId(obj, function (data) {
            if (data.status == 1) {
                next();
            }
            else {
                //console.log(data);
                res.send(data);
            }
        });
    }
    else res.send({status: 0, error: "Invalid session"});
};
if (app) {
    // MIDDLEWARE ====================================================
    app.use(pmx.expressErrorHandler());
    app.use("/api/login/org", middleware_tempSession_check);
    app.use("/api/logout", middleware_session_check);
    // GETS ====================================================
    app.get('/api/', getCtrl.index);
    app.get('/api/login/org', auth.loginGetOrgList);
    // POSTS ====================================================
    app.post('/api/login', jsonParser, auth.loginController);
    app.post('/api/login/org', jsonParser, auth.loginPostOrgList);
    app.post('/api/logout', auth.logoutController);
}
else {
    console.error("There was an error initializing the application.");
    process.exit(0);
}
