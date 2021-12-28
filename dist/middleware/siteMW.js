"use strict";
exports.__esModule = true;
var siteMW = /** @class */ (function () {
    function siteMW() {
    }
    siteMW.defineActionPermissions = function (permList) {
        return function (req, res, next) {
            try {
                if (req.requiredPermissions) {
                    req.requiredPermissions.site = permList;
                }
                else {
                    req.requiredPermissions = {
                        site: permList
                    };
                }
                return next();
            }
            catch (err) {
                return next();
            }
        };
    };
    return siteMW;
}());
exports["default"] = siteMW;
//# sourceMappingURL=siteMW.js.map