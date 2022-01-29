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
            // const payload = AuthHandling.validateToken(req);
            var payload = authHandling_1["default"].validateSessionCookies(req);
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
                            return [2 /*return*/, next()];
                        }
                        ;
                        return [4 /*yield*/, sitePermissions_repository_1["default"].fetch_permissions_by_user_id(req.user.id)];
                    case 1:
                        sitePermissions = _b.sent();
                        req.user.site_permissions = sitePermissions;
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
                        // console.log("Loading Group Permissions");
                        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID) {
                            if (!req.user) {
                                req.user = undefined;
                            }
                            else {
                                req.user.group_permissions = undefined;
                            }
                            return [2 /*return*/, next()];
                        }
                        ;
                        return [4 /*yield*/, groupPermissions_repository_1["default"].fetch_user_group_permissions_by_user_id(req.user.id, req.groupID)];
                    case 1:
                        groupPermissions = _b.sent();
                        req.user.group_permissions = groupPermissions;
                        // console.log(req.user);
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
    /** Middleware: Validate Permissions Assigned - Comparing User's Assigned Site/Group Permissions to those Required for the endpoint */
    authMW.validatePermissions = function (req, res, next) {
        var _a;
        // console.log(req.user.group_permissions);
        // console.log(req.requiredPermissions.group);
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                return next({ status: 401, message: "Unauthorized" });
            }
            ;
            // If no permissions are defined for validating access throw an error
            if (!req.requiredPermissions.site) {
                return next({ status: 500, message: "Route Configuration Error - SP Def Missing" });
            }
            ;
            // Check for Group Permissions if they are defined
            if (req.requiredPermissions.group) {
                if (!req.user.group_permissions) {
                    return next({ status: 500, message: "Route Configuration Error - GP Def Missing" });
                }
                var permissionsOK = req.requiredPermissions.group.reduce(function (acc, val) {
                    var findResult = req.user.group_permissions.find(function (perm) {
                        return perm.permission_name === val;
                    });
                    return findResult !== undefined && acc;
                }, true);
                if (!permissionsOK) {
                    return next({ status: 401, message: "Unauthorized" });
                }
                ;
            }
            // Check for Site Permisisons if they are defined
            if (req.requiredPermissions.site) {
                if (!req.user.site_permissions) {
                    return next({ status: 401, message: "Unauthorized" });
                }
                var permissionsOK = req.requiredPermissions.site.reduce(function (acc, val) {
                    var findResult = req.user.site_permissions.find(function (perm) {
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
    ;
    /** Define Permissions Required to Access a Site Endpoint */
    authMW.defineSitePermissions = function (permList) {
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
    ;
    /** Move the GroupID from the Route Parameters into the Request Object */
    authMW.addGroupIDToRequest = function (req, res, next) {
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
    /** Define Permissions Required to Access a Group Endpoint */
    authMW.defineGroupPermissions = function (permList) {
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
                return next();
            }
            catch (err) {
                return next();
            }
        };
    };
    ;
    return authMW;
}());
exports["default"] = authMW;
//# sourceMappingURL=authorizationMW.js.map