"use strict";
exports.__esModule = true;
exports.validatePermissions = exports.validateUserID = exports.ensureLoggedIn = exports.validateJWT = void 0;
/** Middleware for handling req authorization for routes. */
var authHandling_1 = require("../utils/authHandling");
/** Middleware: Authenticate user. */
function validateJWT(req, res, next) {
    try {
        var payload = authHandling_1["default"].validateToken(req);
        req.user = payload; // create a current user
        return next();
    }
    catch (err) {
        return next();
    }
}
exports.validateJWT = validateJWT;
/** Middleware: Requires user is authenticated. */
function ensureLoggedIn(req, res, next) {
    var _a;
    try {
        if ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) {
            return next();
        }
        return next({ status: 401, message: "Unauthorized" });
    }
    catch (error) {
        return next({ status: 401, message: "Unauthorized" });
    }
}
exports.ensureLoggedIn = ensureLoggedIn;
/** Middleware: Requires user type & correct user id. */
function validateUserID(req, res, next) {
    try {
        if (req.user.id === req.params.id && req.user.type === "user") {
            return next();
        }
        return next({ status: 401, message: "Unauthorized" });
    }
    catch (err) {
        return next({ status: 401, message: "Unauthorized" });
    }
}
exports.validateUserID = validateUserID;
/** Middleware: Requires user type & correct user id. */
function validatePermissions(req, res, next) {
    var _a, _b;
    try {
        if (((_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.permissions) === null || _b === void 0 ? void 0 : _b.role) === "user") {
            return next();
        }
        return next({ status: 401, message: "Unauthorized" });
    }
    catch (err) {
        // errors would happen here if we made a request and req.user is undefined
        return next({ status: 401, message: "Unauthorized" });
    }
}
exports.validatePermissions = validatePermissions;
//# sourceMappingURL=authorizationMW.js.map