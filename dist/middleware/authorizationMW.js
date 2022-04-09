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
var permissions_repository_1 = require("../repositories/permissions.repository");
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
    /** Parse Context and Add Context Sensitive Information to Request */
    authMW.addContextToRequest = function (req, res, next) {
        try {
            if (req.body.context) {
                switch (req.body.context) {
                    case "group":
                        req.groupID = req.body.ownerid ? req.body.ownerid : "";
                        break;
                    default:
                }
                ;
            }
            ;
            return next();
        }
        catch (err) {
            return next();
        }
    };
    ;
    /** Define Permissions Required to Access a Site Endpoint */
    authMW.defineRoutePermissions = function (permissions) {
        return function (req, res, next) {
            try {
                req.reqPerms = permissions;
                return next();
            }
            catch (err) {
                return next();
            }
        };
    };
    ;
    authMW.validateRoutePermissions = function (req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var permissions, foundPermissions, foundPermissions, foundPermissions, comparisonUID, foundPermissions, foundPermissions, foundPermissions, foundPermissions, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 16, , 17]);
                        // console.log("Validating Route Permissions");
                        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                            return [2 /*return*/, next({ status: 401, message: "Unauthorized" })];
                        }
                        ;
                        if (!req.reqPerms) {
                            return [2 /*return*/, next({ status: 500, message: "Route Configuration Error - Permissions Definition Missing" })];
                        }
                        ;
                        permissions = [];
                        if (!req.params.equipID) return [3 /*break*/, 2];
                        return [4 /*yield*/, permissions_repository_1["default"].fetch_user_equip_permissions(req.user.id, req.params.equipID, req.reqPerms)];
                    case 1:
                        foundPermissions = _b.sent();
                        permissions.push.apply(permissions, foundPermissions);
                        _b.label = 2;
                    case 2:
                        ;
                        if (!req.params.roomID) return [3 /*break*/, 4];
                        return [4 /*yield*/, permissions_repository_1["default"].fetch_user_room_permissions(req.user.id, req.params.roomID, req.reqPerms)];
                    case 3:
                        foundPermissions = _b.sent();
                        permissions.push.apply(permissions, foundPermissions);
                        _b.label = 4;
                    case 4:
                        ;
                        if (!req.groupID) return [3 /*break*/, 6];
                        return [4 /*yield*/, permissions_repository_1["default"].fetch_user_group_permissions(req.user.id, req.groupID, req.reqPerms)];
                    case 5:
                        foundPermissions = _b.sent();
                        permissions.push.apply(permissions, foundPermissions);
                        _b.label = 6;
                    case 6:
                        ;
                        if (!req.params.username) return [3 /*break*/, 11];
                        return [4 /*yield*/, permissions_repository_1["default"].fetch_user_id_by_username(req.params.username)];
                    case 7:
                        comparisonUID = _b.sent();
                        if (!(comparisonUID !== undefined)) return [3 /*break*/, 11];
                        req.targetUID = comparisonUID.user_id;
                        if (!(req.user.id === req.targetUID)) return [3 /*break*/, 9];
                        return [4 /*yield*/, permissions_repository_1["default"].fetch_user_account_permissions_all(req.user.id, req.reqPerms)];
                    case 8:
                        foundPermissions = _b.sent();
                        permissions.push.apply(permissions, foundPermissions);
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, permissions_repository_1["default"].fetch_user_account_permissions_public(req.targetUID ? req.targetUID : "", req.reqPerms)];
                    case 10:
                        foundPermissions = _b.sent();
                        permissions.push.apply(permissions, foundPermissions);
                        _b.label = 11;
                    case 11:
                        ;
                        if (!(req.reqPerms.user && req.reqPerms.user.length > 0 && permissions.length <= 0)) return [3 /*break*/, 13];
                        return [4 /*yield*/, permissions_repository_1["default"].fetch_user_account_permissions_all(req.user.id, req.reqPerms)];
                    case 12:
                        foundPermissions = _b.sent();
                        permissions.push.apply(permissions, foundPermissions);
                        return [3 /*break*/, 15];
                    case 13: return [4 /*yield*/, permissions_repository_1["default"].fetch_user_site_permissions_public(req.user.id, req.reqPerms)];
                    case 14:
                        foundPermissions = _b.sent();
                        permissions.push.apply(permissions, foundPermissions);
                        _b.label = 15;
                    case 15:
                        ;
                        if (permissions.length === 0) {
                            return [2 /*return*/, next({ status: 401, message: "Unauthorized" })];
                        }
                        ;
                        req.resolvedPerms = permissions;
                        return [2 /*return*/, next()];
                    case 16:
                        error_3 = _b.sent();
                        return [2 /*return*/, next({ status: 401, message: "Error - Unauthorized" })];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    ;
    return authMW;
}());
exports["default"] = authMW;
//# sourceMappingURL=authorizationMW.js.map