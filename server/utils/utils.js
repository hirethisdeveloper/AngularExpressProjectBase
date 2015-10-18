var fs = require('fs');
// =======
exports.dbg            = function (str) {
    var dbgVar    = process.env.DBG,
        debugging = false;
    if (dbgVar == "true") console.log(str);
};
exports.getQueryParams = function (req) {
    var data;
    try {
        if (req) {
            if (req.query) {
                if (typeof req.query == "string") data = JSON.parse(req.query);
                else if (typeof req.query == "object") data = req.query;
                return data;
            }
            else return "POST no req query";
        }
    } catch (err) {
        return err
    }
};