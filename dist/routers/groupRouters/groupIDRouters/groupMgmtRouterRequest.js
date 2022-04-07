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
// Schema Imports
var groupUserCreateSchema_1 = require("../../../schemas/group/groupUserCreateSchema");
// Model Imports
var groupModel_1 = require("../../../models/groupModel");
// Middleware Imports
var authorizationMW_1 = require("../../../middleware/authorizationMW");
var groupMgmtRouterRequest = express.Router({ mergeParams: true });
/* ____ ____  _____    _  _____ _____
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|
 | |___|  _ <| |___ / ___ \| | | |___
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Manually Tested - 2022-04-04
// Send Request, Remove Reqeust, Accept Request, Filter Existing Users, Filter Existing Requests
// Add User / Request User Membership
groupMgmtRouterRequest.post("/", authorizationMW_1["default"].defineRoutePermissions({
    user: [],
    group: ["group_create_group_user"],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, _a, reqValues, userIDs, _b, error_1;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 15, , 16]);
                // Preflight
                if (!((_c = req.user) === null || _c === void 0 ? void 0 : _c.id) || !req.groupID) {
                    throw new expresError_1["default"]("Unauthorized", 401);
                }
                ;
                if (!req.body.context || !req.body.action) {
                    throw new expresError_1["default"]("Invalid Request", 400);
                }
                ;
                queryData = void 0;
                _a = req.body.context;
                switch (_a) {
                    case "user": return [3 /*break*/, 1];
                }
                return [3 /*break*/, 13];
            case 1:
                reqValues = {
                    usernames: req.body.users,
                    groupID: req.groupID
                };
                if (!(0, groupUserCreateSchema_1["default"])(reqValues)) {
                    throw new expresError_1["default"]("Unable to create group user, schema check failure: ".concat(groupUserCreateSchema_1["default"].errors), 400);
                }
                ;
                userIDs = void 0;
                _b = req.body.action;
                switch (_b) {
                    case "accept_request": return [3 /*break*/, 2];
                    case "send_request": return [3 /*break*/, 5];
                    case "remove_request": return [3 /*break*/, 8];
                }
                return [3 /*break*/, 11];
            case 2: return [4 /*yield*/, groupModel_1["default"].retrieve_user_id_by_username(reqValues.usernames, reqValues.groupID, "user_request_active")];
            case 3:
                userIDs = _d.sent();
                if (userIDs.length < 1) {
                    throw new expresError_1["default"]("Unable to add users.", 400);
                }
                ;
                return [4 /*yield*/, groupModel_1["default"].create_group_user(reqValues.groupID, userIDs)];
            case 4:
                queryData = _d.sent();
                return [2 /*return*/, res.json({ reqAccept: queryData })];
            case 5: return [4 /*yield*/, groupModel_1["default"].retrieve_user_id_by_username(reqValues.usernames, reqValues.groupID, "group_request_permitted")];
            case 6:
                userIDs = _d.sent();
                if (userIDs.length < 1) {
                    throw new expresError_1["default"]("Unable to invite user to join group.", 400);
                }
                ;
                return [4 /*yield*/, groupModel_1["default"].create_request_group_to_user(reqValues.groupID, userIDs)];
            case 7:
                queryData = _d.sent();
                return [2 /*return*/, res.json({ reqSent: queryData })];
            case 8: return [4 /*yield*/, groupModel_1["default"].retrieve_user_id_by_username(reqValues.usernames, reqValues.groupID)];
            case 9:
                userIDs = _d.sent();
                if (userIDs.length < 1) {
                    throw new expresError_1["default"]("Unable to remove invite request.", 400);
                }
                ;
                return [4 /*yield*/, groupModel_1["default"].delete_request_user_group(userIDs, reqValues.groupID)];
            case 10:
                queryData = _d.sent();
                return [2 /*return*/, res.json({ reqRemove: queryData })];
            case 11: throw new expresError_1["default"]("Configuration Error - Invalid Action", 400);
            case 12:
                ;
                _d.label = 13;
            case 13: throw new expresError_1["default"]("Configuration Error - Invalid Context", 400);
            case 14:
                ;
                return [3 /*break*/, 16];
            case 15:
                error_1 = _d.sent();
                next(error_1);
                return [3 /*break*/, 16];
            case 16:
                ;
                return [2 /*return*/];
        }
    });
}); });
/* ____  _____    _    ____
  |  _ \| ____|  / \  |  _ \
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/
*/
// Manually Tested 2022-04-04
// Get Active Requests
groupMgmtRouterRequest.get("/", authorizationMW_1["default"].defineRoutePermissions({
    user: [],
    group: ["group_create_group_user"],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_2;
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
                queryData = void 0;
                return [4 /*yield*/, groupModel_1["default"].retrieve_group_membership_requests(req.groupID)];
            case 1:
                queryData = _b.sent();
                // Processing
                if (!queryData) {
                    throw new expresError_1["default"]("Users Not Found: Get Group Users - All", 404);
                }
                ;
                return [2 /*return*/, res.json({ users: queryData })];
            case 2:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports["default"] = groupMgmtRouterRequest;
//# sourceMappingURL=groupMgmtRouterRequest.js.map