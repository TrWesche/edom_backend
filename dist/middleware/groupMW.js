"use strict";
exports.__esModule = true;
var groupMW = /** @class */ (function () {
    function groupMW() {
    }
    groupMW.addGroupIDToRequest = function (req, res, next) {
        try {
            if (req.params.groupID) {
                req.groupID = req.params.groupID;
            }
            else {
                req.groupID = undefined;
            }
            return next();
        }
        catch (err) {
            return next();
        }
    };
    ;
    groupMW.defineActionPermissions = function (permList) {
        return function (req, res, next) {
            try {
                if (req.requiredPermissions) {
                    req.requiredPermissions.group = permList;
                }
                else {
                    req.requiredPermissions = {
                        group: permList
                    };
                }
                console.log("Permission Definitions");
                console.log(req.requiredPermissions);
                return next();
            }
            catch (err) {
                return next();
            }
        };
    };
    ;
    return groupMW;
}());
exports["default"] = groupMW;
//# sourceMappingURL=groupMW.js.map