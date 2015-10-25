var db_auth = require("../models/auth.js"),
    db_org  = require("../models/org.js"),
    utils   = require("../utils/utils.js"),
    _       = require("underscore-node"),
    inspect = require('util').inspect;
// ------------------------------------------------------
// SUPPORTING FUNCTIONS ---------------------------------
// ------------------------------------------------------
var check_required_fields = function (data, list) {
    var lack = [];
    _.each(list, function (item) {
        var i          = item.split(":"),
            itemName   = i[0],
            itemLength = i[1];
        if (!_.contains(_.keys(data), itemName)) {
            lack.push(item);
        }
        else {
            var val = data[itemName];
            if (val.length < itemLength) {
                lack.push(item);
            }
        }
    });
    return lack;
};
var getRemoteAddress      = function (req) {
    var ipaddr = req.connection.remoteAddress;
    if (req.headers['x-forwarded-for']) ipaddr = req.headers['x-forwarded-for'];
    return ipaddr;
};
// ------------------------------------------------------
// CONTROLLERS ------------------------------------------
// ------------------------------------------------------
/**
 * CONTROLLER: POST : loginController
 *
 * PURPOSE: Take external input (username, password) and return the status of the authentication
 *
 * @param req
 * @param res
 * @param next
 */
exports.loginController  = function (req, res, next) {
    console.log("LOGINCONTROLLER ----------------------------------------------")
    var opts = req.body;
    console.log(opts, "loginController")
    if (opts.username && opts.password) {
        db_auth.check_usernamePassword(opts, function (data) {
            if (data.status > 0) {
                var tempObj = {
                    remoteAddress: req.connection.remoteAddress,
                    account_guid : data.meta.account_guid
                };
                console.log(tempObj);
                // this allows us to see the ipaddress if the remote is behind a proxy
                if (req.headers['x-forwarded-for']) tempObj.remoteAddress = req.headers['x-forwarded-for'];
                // clear any temp sessions for this tempObj
                db_auth.clearSession(tempObj, function (clearSession) {
                    if (clearSession.status > 0) {
                        // make a new temp session
                        db_auth.makeTempSession(tempObj, function (tempSession) {
                            if (tempSession.status > 0) {
                                var returnData = {
                                    status: 1,
                                    meta  : {
                                        account_guid: data.meta.account_guid,
                                        sessionId   : tempSession.sessionHash
                                    }
                                }
                                res.send(returnData);
                            }
                            else res.send(tempSession);
                        })
                    }
                    else res.send(clearSession);
                })
            }
            else res.send(data);
        })
    }
    else res.send({status: 0, error: 4001});
};
/**
 * CONTROLLER: GET : loginGetOrgList
 * PURPOSE: Second phase of login, takes temp session and returns list of orgs the user has access to.
 * @param req
 * @param res
 * @param next
 */
exports.loginGetOrgList  = function (req, res, next) {
    console.log("LOGINGETORGLIST ----------------------------------------------")
    var sessionId    = req.headers.sessionid,
        account_guid = req.headers.account_guid,
        opts         = {
            account_guid: account_guid
        };
    if (sessionId && account_guid) {
        db_org.listOrgsByUserGuid(opts, function (data) {
            res.send(data);
        })
    }
    else res.send({status: 0, error: 4003});
};
/**
 * CONTROLLER: POST : loginPostOrgList
 * PURPOSE: Third phase of login, takes temp session and chosen org, replaces temp session with actual session,
 * returns new session.
 * @param req
 * @param res
 * @param next
 */
exports.loginPostOrgList = function (req, res, next) {
    console.log("LOGINPOSTORGLIST ----------------------------------------------")
    var sessionId    = req.headers.sessionid,
        account_guid = req.headers.account_guid,
        body         = req.body;
    console.log("loginpostOrgList: ", body);
    if (sessionId && account_guid && body.org_guid) {
        var opts = {
            account_guid: account_guid,
            sessionId   : sessionId,
            org_guid    : body.org_guid
        };
        // get our current(temp) session record
        db_auth.getCurrentSessionRecordBySession(opts, function (sessionData) {
            console.log("getCurrentSessionRecordBySession: ", sessionData)
            if (sessionData.status == 1) {
                var tempObj = {
                    sessionId: sessionData.session.sessionId
                };
                // clear the temp session
                db_auth.clearSession(tempObj, function (clearSession) {
                    if (clearSession.status > 0) {
                        var newRealObj = {
                            remoteAddress: req.connection.remoteAddress,
                            account_guid : req.headers.account_guid,
                            org_guid     : body.org_guid
                        };
                        console.log(newRealObj)
                        // make a new real session
                        db_auth.makeSession(newRealObj, function (realSession) {
                            if (realSession.status > 0) {
                                var returnObj = {
                                    status: 1,
                                    meta  : {
                                        account_guid: req.headers.account_guid,
                                        org_guid    : body.org_guid,
                                        sessionId   : realSession.sessionHash
                                    }
                                };
                                console.log("REAL SESSION SEND: ", returnObj);
                                res.send(returnObj);
                            }
                            else res.send(realSession);
                        });
                    }
                    else res.send(clearSession);
                });
            }
            else res.send(sessionData);
        });
    }
    else res.send({status: 0, error: 4003});
};
/**
 * CONTROLLER: POST : logoutController
 * PURPOSE: Executes a logout from the sessionId in the header
 * @param req
 * @param res
 */
exports.logoutController = function (req, res) {
    console.log("LOGOUTCONTROLLER ----------------------------------------------")
    var sessionId = req.headers.sessionid;
    db_auth.logout({sessionId: sessionId}, function (data) {
        res.send(data);
    });
};
exports.validateSession  = function (req, res) {
};
/**
 * EXPORTS METHOD: registerOrg
 * PURPOSE: Accepts a post payload to create an org in the system. Must have an API key to accept.
 * @param req
 * @param res
 */
exports.registerOrg      = function (req, res) {
    var opts = req.body;
};
/**
 * EXPORT METHOD: reqApiKey
 * PURPOSE: Accepts a post payload to insert a request for an api account.
 * @param req
 * @param res
 */
exports.reqApiKey        = function (req, res) {
    var opts              = req.body,
        requiredFields    = [
            "siteTitle:10", "siteUrl:10", "contactEmail:10",
            "address1:10", "city:5", "state:2", "postalCode:5",
            "firstName:2", "lastName:2"
        ],
        missingFieldsList = check_required_fields(opts, requiredFields),
        ipaddr            = getRemoteAddress(req);
    opts.remoteAddress    = ipaddr;
    if (missingFieldsList.length < 1) {
        db_auth.createApiAccountRecord(opts, function (data) {
            //var admin_email_functions = require("../utils/admin_email_functions");
            // add sending of the api account email verification here
            res.send(data);
        });
    }
    else {

        var mfl = [];
        _.each(missingFieldsList, function(item) {
            var i = item.split(":"),
                itemName = i[0],
                itemLength = i[1],
                obj = { fieldName: itemName, requiredLength: itemLength};
            mfl.push(obj);
        });

        res.send({status: 0, code: 5002, requiredFields: mfl});
    }
};


