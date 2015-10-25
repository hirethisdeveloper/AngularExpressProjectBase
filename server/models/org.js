var mysql                  = require("../utils/database"),
    db                     = mysql.db,
    uuid                   = require("node-uuid");
/**
 * EXPORT METHOD: listOrgsByUserGuid
 * PURPOSE: Returns a list of orgs that the passed user_guid has access to.
 * @param opts
 * @param callback
 */
exports.listOrgsByUserGuid = function (opts, callback) {
    db.getConnection(function (connErr, conn) {
        if (!connErr) {
            conn.query(
                "select c.guid, c.title, c.comments from accounts a inner join account_org_relation b on (b.account_guid=a.guid) inner join organizations c on (b.org_guid=c.guid) where a.guid=?",
                [opts.account_guid],
                function (err, results) {
                    if (!err) callback({status: 1, orgs: results});
                    // db error occurred
                    else callback({status: 0, code: 5000, error: err});
                }
            )
        }
    });
};
