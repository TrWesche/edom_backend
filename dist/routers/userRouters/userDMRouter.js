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
var expresError_1 = require("../../utils/expresError");
// Model Imports
var equipModel_1 = require("../../models/equipModel");
var userModel_1 = require("../../models/userModel");
var groupModel_1 = require("../../models/groupModel");
var roomModel_1 = require("../../models/roomModel");
// Middleware Imports
var authorizationMW_1 = require("../../middleware/authorizationMW");
var userDeviceMasterRouter = express.Router();
/* ____  _____    _    ____
  |  _ \| ____|  / \  |  _ \
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/
*/
// Manually Tested 2022-03-22
/** Get User Profile Route - Based on Username */
userDeviceMasterRouter.get("/:username", authorizationMW_1["default"].defineRoutePermissions({
    user: ["site_read_user_self"],
    group: [],
    public: ["site_read_user_public"]
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, userSelf, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                queryData = void 0;
                userSelf = (_a = req.resolvedPerms) === null || _a === void 0 ? void 0 : _a.reduce(function (acc, val) {
                    return acc = acc || (val.permissions_name === "site_read_user_self");
                }, false);
                if (!userSelf) return [3 /*break*/, 2];
                return [4 /*yield*/, userModel_1["default"].retrieve_user_by_user_id((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
            case 1:
                queryData = _c.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, userModel_1["default"].retrieve_user_by_username(req.params.username)];
            case 3:
                queryData = _c.sent();
                _c.label = 4;
            case 4:
                ;
                if (!queryData) {
                    throw new expresError_1["default"]("Unable to find a user with provided username.", 404);
                }
                return [2 /*return*/, res.json({ user: queryData })];
            case 5:
                error_1 = _c.sent();
                next(error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Manually Tested 2022-03-22
/** Get User Groups Route - Based on Username */
userDeviceMasterRouter.get("/:username/group", authorizationMW_1["default"].defineRoutePermissions({
    user: ["site_read_group_self"],
    group: [],
    public: ["site_read_group_public"]
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, userSelf, error_2;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    throw new expresError_1["default"]("User ID Not Defined", 401);
                }
                ;
                queryData = void 0;
                userSelf = (_b = req.resolvedPerms) === null || _b === void 0 ? void 0 : _b.reduce(function (acc, val) {
                    return acc = acc || (val.permissions_name === "site_read_group_self");
                }, false);
                if (!userSelf) return [3 /*break*/, 2];
                return [4 /*yield*/, groupModel_1["default"].retrieve_user_groups_list_by_user_id((_c = req.user) === null || _c === void 0 ? void 0 : _c.id, "elevated", 10, 0)];
            case 1:
                queryData = _d.sent();
                return [3 /*break*/, 4];
            case 2:
                if (!req.targetUID) return [3 /*break*/, 4];
                return [4 /*yield*/, groupModel_1["default"].retrieve_user_groups_list_by_user_id(req.targetUID, "public", 10, 0)];
            case 3:
                queryData = _d.sent();
                _d.label = 4;
            case 4:
                ;
                if (!queryData) {
                    throw new expresError_1["default"]("Groups not found.", 404);
                }
                return [2 /*return*/, res.json({ group: queryData })];
            case 5:
                error_2 = _d.sent();
                next(error_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Manually Tested 2022-03-22
/** Get User Rooms Route - Based on Username */
userDeviceMasterRouter.get("/:username/room", authorizationMW_1["default"].defineRoutePermissions({
    user: ["site_read_room_self"],
    group: [],
    public: ["site_read_room_public"]
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, userSelf, error_3;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    throw new expresError_1["default"]("User ID Not Defined", 401);
                }
                ;
                queryData = void 0;
                userSelf = (_b = req.resolvedPerms) === null || _b === void 0 ? void 0 : _b.reduce(function (acc, val) {
                    return acc = acc || (val.permissions_name === "site_read_room_self");
                }, false);
                if (!userSelf) return [3 /*break*/, 2];
                return [4 /*yield*/, roomModel_1["default"].retrieve_user_rooms_list_by_user_id((_c = req.user) === null || _c === void 0 ? void 0 : _c.id, "user", 10, 0)];
            case 1:
                queryData = _d.sent();
                return [3 /*break*/, 4];
            case 2:
                if (!req.targetUID) return [3 /*break*/, 4];
                return [4 /*yield*/, roomModel_1["default"].retrieve_user_rooms_list_by_user_id(req.targetUID, "public", 10, 0)];
            case 3:
                queryData = _d.sent();
                _d.label = 4;
            case 4:
                ;
                if (!queryData) {
                    throw new expresError_1["default"]("Rooms not found.", 404);
                }
                return [2 /*return*/, res.json({ room: queryData })];
            case 5:
                error_3 = _d.sent();
                next(error_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Manually Tested 2022-03-22
/** Get User Equip Route */
userDeviceMasterRouter.get("/:username/equip", authorizationMW_1["default"].defineRoutePermissions({
    user: ["site_read_equip_self"],
    group: [],
    public: ["site_read_equip_public"]
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, userSelf, error_4;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 5, , 6]);
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    throw new expresError_1["default"]("User ID Not Defined", 401);
                }
                ;
                queryData = void 0;
                userSelf = (_b = req.resolvedPerms) === null || _b === void 0 ? void 0 : _b.reduce(function (acc, val) {
                    return acc = acc || (val.permissions_name === "site_read_equip_self");
                }, false);
                if (!userSelf) return [3 /*break*/, 2];
                return [4 /*yield*/, equipModel_1["default"].retrieve_user_equip_list_by_user_id((_c = req.user) === null || _c === void 0 ? void 0 : _c.id, "user", 10, 0)];
            case 1:
                queryData = _d.sent();
                return [3 /*break*/, 4];
            case 2:
                if (!req.targetUID) return [3 /*break*/, 4];
                return [4 /*yield*/, equipModel_1["default"].retrieve_user_equip_list_by_user_id(req.targetUID, "public", 10, 0)];
            case 3:
                queryData = _d.sent();
                _d.label = 4;
            case 4:
                ;
                if (!queryData) {
                    throw new expresError_1["default"]("Equip not found.", 404);
                }
                return [2 /*return*/, res.json({ equip: queryData })];
            case 5:
                error_4 = _d.sent();
                next(error_4);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports["default"] = userDeviceMasterRouter;
//# sourceMappingURL=userDMRouter.js.map