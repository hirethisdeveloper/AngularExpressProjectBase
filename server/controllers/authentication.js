var db_auth = require("../models/auth.js"),
    db_org  = require("../models/org.js"),
    utils   = require("../utils/utils.js"),
    inspect = require('util').inspect;
// ------------------------------------------------------
// SUPPORTING FUNCTIONS ---------------------------------
// ------------------------------------------------------
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
