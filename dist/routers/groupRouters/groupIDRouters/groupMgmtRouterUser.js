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
var express = require("express");
// Utility Functions Import
var expresError_1 = require("../../../utils/expresError");
// Model Imports
var groupModel_1 = require("../../../models/groupModel");
// Middleware Imports
var authorizationMW_1 = require("../../../middleware/authorizationMW");
var groupMgmtSchemaUser_1 = require("../../../schemas/group/groupMgmtSchemaUser");
var groupMgmtRouterUser = express.Router({ mergeParams: true });
/* ____ ____  _____    _  _____ _____
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|
 | |___|  _ <| |___ / ___ \| | | |___
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Add User Role
groupMgmtRouterUser.post("/", authorizationMW_1["default"].defineRoutePermissions({
    user: [],
    group: ["group_create_user_role"],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var reqValues, queryData, _a, userIDs, _b, error_1;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 13, , 14]);
                // Preflight
                if (!((_c = req.user) === null || _c === void 0 ? void 0 : _c.id) || !req.groupID) {
                    throw new expresError_1["default"]("Unauthorized", 401);
                }
                ;
                reqValues = {
                    usernames: req.body.users,
                    groupID: req.groupID,
                    context: req.body.context,
                    action: req.body.action,
                    roles: req.body.roles ? req.body.roles : undefined
                };
                if (!(0, groupMgmtSchemaUser_1["default"])(reqValues)) {
                    throw new expresError_1["default"]("Unable to run Management Procedure, schema check failure: ".concat(groupMgmtSchemaUser_1["default"].errors), 400);
                }
                ;
                queryData = void 0;
                _a = reqValues.context;
                switch (_a) {
                    case "user": return [3 /*break*/, 1];
                }
                return [3 /*break*/, 11];
            case 1: return [4 /*yield*/, groupModel_1["default"].retrieve_user_id_by_username(reqValues.usernames, reqValues.groupID, "are_group_members")];
            case 2:
                userIDs = _d.sent();
                if (userIDs.length < 1) {
                    throw new expresError_1["default"]("No valid users found.", 400);
                }
                ;
                _b = reqValues.action;
                switch (_b) {
                    case "remove_from_group": return [3 /*break*/, 3];
                    case "add_roles": return [3 /*break*/, 5];
                    case "delete_roles": return [3 /*break*/, 7];
                }
                return [3 /*break*/, 9];
            case 3: return [4 /*yield*/, groupModel_1["default"].delete_group_user(reqValues.groupID, userIDs)];
            case 4:
                queryData = _d.sent();
                return [2 /*return*/, res.json({ message: "Users Removed" })];
            case 5: return [4 /*yield*/, groupModel_1["default"].create_request_group_to_user(reqValues.groupID, userIDs)];
            case 6:
                queryData = _d.sent();
                return [2 /*return*/, res.json({ reqSent: queryData })];
            case 7: return [4 /*yield*/, groupModel_1["default"].delete_request_user_group(userIDs, reqValues.groupID)];
            case 8:
                queryData = _d.sent();
                return [2 /*return*/, res.json({ reqRemove: queryData })];
            case 9: throw new expresError_1["default"]("Configuration Error - Invalid Action", 400);
            case 10:
                ;
                _d.label = 11;
            case 11: throw new expresError_1["default"]("Configuration Error - Invalid Context", 400);
            case 12:
                ;
                return [3 /*break*/, 14];
            case 13:
                error_1 = _d.sent();
                next(error_1);
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); });
/* ____  _____    _    ____
  |  _ \| ____|  / \  |  _ \
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/
*/
// Get User Group Data
groupMgmtRouterUser.get("/:username", authorizationMW_1["default"].defineRoutePermissions({
    user: [],
    group: ["group_read_user_role"],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID || !req.targetUID) {
                    throw new expresError_1["default"]("Must be logged in to view group user roles || target group missing", 400);
                }
                return [4 /*yield*/, groupModel_1["default"].retrieve_user_roles_by_user_id(req.targetUID, req.groupID)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Retrieving Group User Roles Failed", 400);
                }
                return [2 /*return*/, res.json({ GroupUserRoles: [queryData] })];
            case 2:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
groupMgmtRouterUser.get("/", authorizationMW_1["default"].defineRoutePermissions({
    user: [],
    group: ["group_read_group_user"],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID) {
                    throw new expresError_1["default"]("Unauthorized", 401);
                }
                ;
                return [4 /*yield*/, groupModel_1["default"].retrieve_users_by_group_id(req.groupID, "full")];
            case 1:
                queryData = _b.sent();
                // Processing
                if (!queryData) {
                    throw new expresError_1["default"]("Users Not Found: Get Group Users - All", 404);
                }
                ;
                return [2 /*return*/, res.json({ users: queryData })];
            case 2:
                error_3 = _b.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports["default"] = groupMgmtRouterUser;
//# sourceMappingURL=groupMgmtRouterUser.js.map