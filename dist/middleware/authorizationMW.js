"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
/** Middleware for handling req authorization for routes. */
var authHandling_1 = require("../utils/authHandling");
var groupPermissions_repository_1 = require("../repositories/groupPermissions.repository");
var sitePermissions_repository_1 = require("../repositories/sitePermissions.repository");
var authMW = /** @class */ (function () {
    function authMW() {
    }
    /** Middleware: Load JWT Data Into Request & Authenticate user. */
    authMW.loadJWT = function (req, res, next) {
        try {
            var payload = authHandling_1["default"].validateToken(req);
            req.user = payload; // create a current user
            return next();
        }
        catch (err) {
            return next();
        }
    };
    ;
    /** Middleware: Load User's Permissions for the site into the request. */
    authMW.loadSitePermissions = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var sitePermissions, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                            req.sitePermissions = undefined;
                            return [2 /*return*/, next()];
                        }
                        ;
                        return [4 /*yield*/, sitePermissions_repository_1["default"].fetch_permissions_by_user_id(req.user.id)];
                    case 1:
                        sitePermissions = _b.sent();
                        req.sitePermissions = sitePermissions;
                        return [2 /*return*/, next()];
                    case 2:
                        error_1 = _b.sent();
                        return [2 /*return*/, next({ status: 401, message: "Unauthorized" })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    /** Middleware: Load User's Permissions for the group into the request. */
    authMW.loadGroupPermissions = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var groupPermissions, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                            req.groupPermissions = undefined;
                            return [2 /*return*/, next()];
                        }
                        ;
                        return [4 /*yield*/, groupPermissions_repository_1["default"].fetch_permissions_by_user_id(req.user.id)];
                    case 1:
                        groupPermissions = _b.sent();
                        req.groupPermissions = groupPermissions;
                        return [2 /*return*/, next()];
                    case 2:
                        error_2 = _b.sent();
                        return [2 /*return*/, next({ status: 401, message: "Unauthorized" })];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    /** Validate Permissions Assigned */
    authMW.validatePermissions = function (req, res, next) {
        var _a;
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                return next({ status: 401, message: "Unauthorized" });
            }
            ;
            // If no permissions are defined for validating access throw an error
            if (!req.requiredPermissions.site) {
                return next({ status: 400, message: "Unable to Process Request" });
            }
            ;
            // Check for Group Permissions if they are defined
            if (req.requiredPermissions.group) {
                if (!req.groupPermissions) {
                    return next({ status: 401, message: "Unauthorized" });
                }
                var permissionsOK = req.requiredPermissions.group.reduce(function (acc, val) {
                    req.groupPermissions.find(val) && acc;
                }, true);
                if (!permissionsOK) {
                    return next({ status: 401, message: "Unauthorized" });
                }
                ;
            }
            // Check for Site Permisisons if they are defined
            if (req.requiredPermissions.site) {
                if (!req.sitePermissions) {
                    return next({ status: 401, message: "Unauthorized" });
                }
                var permissionsOK = req.requiredPermissions.site.reduce(function (acc, val) {
                    var findResult = req.sitePermissions.find(function (perm) {
                        return perm.permission_name === val;
                    });
                    return findResult !== undefined && acc;
                }, true);
                if (!permissionsOK) {
                    return next({ status: 401, message: "Unauthorized" });
                }
                ;
                return next();
            }
        }
        catch (error) {
            return next({ status: 401, message: "Unauthorized" });
        }
    };
    return authMW;
}());
// /** Middleware: Requires user is authenticated. */
// function ensureLoggedIn(req, res, next) {
//   try {
//     if (req.user?.id) {
//       return next();
//     }
//     return next({ status: 401, message: "Unauthorized" });
//   } catch (error) {
//     return next({ status: 401, message: "Unauthorized" });
//   }
// }
// /** Middleware: Requires user type & correct user id. */
// function validateUserID(req, res, next) {
//   try {
//     if (req.user.id === req.params.id && req.user.type === "user") {
//       return next();
//     }
//     return next({ status: 401, message: "Unauthorized" });
//   } catch (err) {
//     return next({ status: 401, message: "Unauthorized" });
//   }
// }
exports["default"] = authMW;
//# sourceMappingURL=authorizationMW.js.map