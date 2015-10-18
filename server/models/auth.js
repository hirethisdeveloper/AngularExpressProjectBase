var mysql  = require("../utils/database"),
    db     = mysql.db,
    uuid   = require("node-uuid"),
    bcrypt = require("bcrypt-nodejs");
// ------------------------------------------------------
// SUPPORTING FUNCTIONS ---------------------------------
// ------------------------------------------------------
/**
 * METHOD: cryptPassword
 * PURPOSE: Take an entered password and encrypt it, return the hash
 *
 * @param password
 * @param callback
 */
var cryptPassword                        = function (password, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err) callback(err);
        bcrypt.hash(password, salt, null, function (err, hash) {
            callback(err, hash);
        });
    });
};
/**
 * METHOD: comparePassword
 * PURPOSE: Take a hashed password, entered raw password, compare them and callback the result.
 * @param password
 * @param userPassword
 * @param callback
 */
var comparePassword                      = function (password, userPassword, callback) {
    console.log("comparePassword init")
    bcrypt.compare(userPassword, password, function (err, isPasswordMatch) {
        console.log("compare error: ", err);
        console.log("compare isPasswordMatch: ", isPasswordMatch);
        if (err) callback(err);
        callback(null, isPasswordMatch);
    });
};
/**
 * EXPORTS METHOD: check_usernamePassword
 * PURPOSE: Authenticate an entered username and password, callback the status.
 * @param obj
 * @param callback
 */
exports.check_usernamePassword           = function (obj, callback) {
    db.query("select * from accounts where username=?", [obj.username], function (err, results) {
        console.log("query error: ", err);
        //console.log(results);
        if (!err) {
            if (results.length == 1) {
                var record = results[0];
                console.log(record);
                if (record.status == 1) {
                    // saved hash, entered password raw, callback
                    comparePassword(record.password, obj.password, function (err, isPasswordMatch) {
                        if (isPasswordMatch) {
                            callback(
                                {
                                    status: 1,
                                    meta  : {
                                        account_guid: record.guid
                                    }
                                }
                            );
                        }
                        // invalid username or password (no user found)
                        else callback({status: 0, code: 4001})
                    })
                }
                // account is not enabled
                else callback({status: 0, code: 4002});
            }
            else if (results.length > 1) {
                // error occurred where we have too many of the same username
                callback({status: 0, code: 5001})
            }
            // invalid username or password (no user found)
            else callback({status: 0, code: 4001})
        }
        // db error occurred
        else callback({status: 0, code: 5000, error: err});
    });
};
/**
 * EXPORTS METHOD: logout
 * PURPOSE: Performs logout on an account by the passed session
 * @param opts
 * @param callback
 */
exports.logout                           = function (opts, callback) {
    db.query("delete from sessions where sessionId=?", [opts.sessionId], function (err) {
        if (!err) callback({status: 1});
        else callback({status: 0, error: err});
    })
};
/**
 * EXPORTS METHOD: makeTempSession
 * PURPOSE: Create a temporary session, insert the record into the sessions table, and return the sessionHash
 *
 * @param opts
 * @param callback
 */
exports.makeTempSession                  = function (opts, callback) {
    // make a new guid for this session
    var session_guid = uuid.v4();
    // make a crypted hash of the session guid to store as the temp login session
    cryptPassword(session_guid, function (err, sessionHash) {
        db.query(
            "insert into sessions set guid=?, account_guid=?, sessionId=?, dateCreated=now(), ipaddress=?, sessionType='temp'",
            [session_guid, opts.account_guid, sessionHash, opts.remoteAddress],
            function (err) {
                if (!err) {
                    callback({status: 1, sessionHash: sessionHash});
                }
                // db error occurred
                else callback({status: 0, code: 5000, error: err});
            }
        )
    });
};
/**
 * EXPORTS METHOD: makeSession
 * PURPOSE: Create a session, insert the record into the sessions table, and return the sessionHash
 *
 * @param opts
 * @param callback
 */
exports.makeSession                      = function (opts, callback) {
    // make a new guid for this session
    var session_guid = uuid.v4();
    // make a crypted hash of the session guid to store as the temp login session
    cryptPassword(session_guid, function (err, sessionHash) {
        db.query(
            "insert into sessions set guid=?, account_guid=?, org_guid=?, sessionId=?, dateCreated=now(), ipaddress=?",
            [session_guid, opts.account_guid, opts.org_guid, sessionHash, opts.remoteAddress],
            function (err) {
                if (!err) {
                    callback({status: 1, sessionHash: sessionHash});
                }
                // db error occurred
                else callback({status: 0, code: 5000, error: err});
            }
        )
    });
};
/**
 * EXPORTS METHOD: clearSession
 * PURPOSE: Clears any sessions that match the passed parameters
 *
 * @param opts
 * @param callback
 */
exports.clearSession                     = function (opts, callback) {
    var sql, inserts;
    console.log("CLEAR SESSION: ", opts)
    if (opts.sessionId) {
        sql     = "delete from sessions where sessionId=?";
        inserts = [opts.sessionId]
    }
    else {
        sql     = "delete from sessions where account_guid=? and ipaddress=?";
        inserts = [opts.account_guid, opts.remoteAddress]
    }
    sql = db.format(sql, inserts);
    console.log("CLEAR SESSION: ", sql);
    db.query(
        sql,
        function (err) {
            if (!err) callback({status: 1});
            // db error occurred
            else callback({status: 0, code: 5000, error: err});
        }
    )
};
/**
 * EXPORTS METHOD: checkValidSessionId
 * PURPOSE: Returns status 1 if a matching session is found.
 *
 * @param opts
 * @param callback
 */
exports.checkValidSessionId              = function (opts, callback) {
    console.log("checkValidSessionId -> ", opts);
    var sessionType = "";
    if (opts.sessionType) sessionType = opts.sessionType;
    var sql     = "select guid,sessionType from sessions where sessionId=? and sessionType=?",
        inserts = [opts.sessionId, sessionType];
    sql = db.format(sql, inserts);
    console.log("checkValidSessionId SQL -> ", sql);
    db.query(
        sql,
        function (err, results) {
            if (!err) {
                if (results.length < 2) {
                    callback({status: 1});
                }
                else if (results.length > 1) {
                    // error occurred where we have too many of the same username
                    callback({status: 0, code: 5001, message: "Too many sessions returned"})
                }
                // invalid sessionId, none found
                //else callback({status: 0, code: 4003});
            }
            // db error occurred
            else callback({status: 0, code: 5000, error: err});
        }
    )
};
/**
 * EXPORTS METHOD: getCurrentSessionRecordBySession
 * PURPOSE: Returns the current session record from the passed session id
 *
 * @param opts
 * @param callback
 */
exports.getCurrentSessionRecordBySession = function (opts, callback) {
    db.query(
        "select * from sessions where sessionId=?",
        [opts.sessionId],
        function (err, results) {
            if (!err) {
                if (results.length == 1) {
                    callback({status: 1, session: results[0]});
                }
                else if (results.length > 1) {
                    // error occurred where we have too many of the same username
                    callback({status: 0, code: 5001, message: "Too many sessions returned"})
                }
                else callback({status: 0, code: 4003});
            }
            // db error occurred
            else callback({status: 0, code: 5000, error: err});
        }
    );
}
