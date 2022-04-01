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
// Library Imports
var express = require("express");
// Utility Functions Import
var expresError_1 = require("../../../utils/expresError");
// Schema Imports
var groupUserCreateSchema_1 = require("../../../schemas/group/groupUserCreateSchema");
// Model Imports
var groupModel_1 = require("../../../models/groupModel");
// Middleware Imports
var authorizationMW_1 = require("../../../middleware/authorizationMW");
// Router Imports
var groupUserRoleRouter_1 = require("./groupUserRoleRouter");
var groupUserRouter = express.Router();
groupUserRouter.use("/:username", groupUserRoleRouter_1["default"]);
/* ____ ____  _____    _  _____ _____
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|
 | |___|  _ <| |___ / ___ \| | | |___
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// TODO: This needs to be adjusted to a new procedure.  If User has requested access, check group_invite table and then create the connection.
// If user has not requested access create an entry in the group_invite table.  The complementary User routes will need to be created.
// Add User
groupUserRouter.post("/", authorizationMW_1["default"].defineRoutePermissions({
    user: [],
    group: ["group_create_group_user"],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var reqValues, uidgidpairs, addUserList_1, addReqList_1, addUserQueryData, addReqQueryData, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.body.userID || !req.groupID) {
                    throw new expresError_1["default"]("Must be logged in to add group user || target users missing || target group missing", 400);
                }
                ;
                reqValues = {
                    usernames: req.body.usernames,
                    groupID: req.groupID
                };
                if (!(0, groupUserCreateSchema_1["default"])(reqValues)) {
                    throw new expresError_1["default"]("Unable to create group user, schema check failure: ".concat(groupUserCreateSchema_1["default"].errors), 400);
                }
                ;
                return [4 /*yield*/, groupModel_1["default"].retrieve_group_membership_requests(reqValues.groupID, reqValues.usernames)];
            case 1:
                uidgidpairs = _b.sent();
                addUserList_1 = [];
                addReqList_1 = [];
                if (uidgidpairs.length > 0) {
                    uidgidpairs.forEach(function (val) {
                        if (val.user_request) {
                            addUserList_1.push(val.user_id);
                        }
                        else if (val.group_request) {
                            // If group request is already set to true an invite has already been sent, do nothing.
                        }
                        else {
                            addReqList_1.push(val.user_id);
                        }
                        ;
                    });
                }
                ;
                addUserQueryData = void 0;
                addReqQueryData = void 0;
                if (!(addUserList_1.length > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, groupModel_1["default"].create_group_user(reqValues.groupID, addUserList_1)];
            case 2:
                addUserQueryData = _b.sent();
                if (!addUserQueryData) {
                    throw new expresError_1["default"]("Create Group User Failed", 400);
                }
                ;
                _b.label = 3;
            case 3:
                ;
                if (!(addReqList_1.length > 0)) return [3 /*break*/, 5];
                return [4 /*yield*/, groupModel_1["default"].create_request_group_to_user(reqValues.groupID, addReqList_1)];
            case 4:
                addReqQueryData = _b.sent();
                if (!addUserQueryData) {
                    throw new expresError_1["default"]("Create Invite Group to User Failed", 400);
                }
                ;
                _b.label = 5;
            case 5:
                ;
                return [2 /*return*/, res.json({ GroupUsersAdded: addUserQueryData, GroupInvitesSent: addReqQueryData })];
            case 6:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 7];
            case 7:
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
// Manual Test - Basic Functionality: 03/25/2022
// Get User List
groupUserRouter.get("/", authorizationMW_1["default"].defineRoutePermissions({
    user: [],
    group: ["group_read_room"],
    public: ["site_read_group_public"]
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, groupReadPermitted_1, error_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID) {
                    throw new expresError_1["default"]("Unauthorized", 401);
                }
                ;
                queryData = void 0;
                groupReadPermitted_1 = 0;
                (_b = req.resolvedPerms) === null || _b === void 0 ? void 0 : _b.forEach(function (val) {
                    // Set Delete Permission Level
                    if (val.permissions_name === "group_read_room") {
                        groupReadPermitted_1 = 1;
                    }
                    ;
                });
                if (!(groupReadPermitted_1 === 1)) return [3 /*break*/, 2];
                return [4 /*yield*/, groupModel_1["default"].retrieve_users_by_group_id(req.groupID, "full")];
            case 1:
                queryData = _c.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, groupModel_1["default"].retrieve_users_by_group_id(req.groupID, "public")];
            case 3:
                queryData = _c.sent();
                _c.label = 4;
            case 4:
                ;
                // Processing
                if (!queryData) {
                    throw new expresError_1["default"]("Users Not Found: Get Group Users - All", 404);
                }
                ;
                return [2 /*return*/, res.json({ users: queryData })];
            case 5:
                error_2 = _c.sent();
                next(error_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
/* ____  _____ _     _____ _____ _____
  |  _ \| ____| |   | ____|_   _| ____|
  | | | |  _| | |   |  _|   | | |  _|
  | |_| | |___| |___| |___  | | | |___
  |____/|_____|_____|_____| |_| |_____|
*/
// Remove user
groupUserRouter["delete"]("/:username", authorizationMW_1["default"].defineRoutePermissions({
    user: [],
    group: ["group_delete_group_user"],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.params.username || !req.groupID) {
                    throw new expresError_1["default"]("Must be logged in to delete group user || target user missing || target group missing", 400);
                }
                return [4 /*yield*/, groupModel_1["default"].delete_group_user(req.groupID, req.params.username)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Delete Group User Failed", 400);
                }
                ;
                return [2 /*return*/, res.json({ GroupUser: [queryData] })];
            case 2:
                error_3 = _b.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3:
                ;
                return [2 /*return*/];
        }
    });
}); });
exports["default"] = groupUserRouter;
//# sourceMappingURL=groupUserRouter.js.map