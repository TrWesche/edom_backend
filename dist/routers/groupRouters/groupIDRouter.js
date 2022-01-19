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
var expresError_1 = require("../../utils/expresError");
// Schema Imports
// import validateCreateGroupSchema, { GroupCreateProps } from "../../schemas/group/groupCreateSchema";
var groupUpdateSchema_1 = require("../../schemas/group/groupUpdateSchema");
// Model Imports
var groupModel_1 = require("../../models/groupModel");
// Middleware Imports
var authorizationMW_1 = require("../../middleware/authorizationMW");
var groupMgmtRouter_1 = require("./groupIDRouters/groupMgmtRouter");
var groupRoomRouter_1 = require("./groupIDRouters/groupRoomRouter");
var groupEquipRouter_1 = require("./groupIDRouters/groupEquipRouter");
var groupIDRouter = express.Router();
groupIDRouter.use("/mgmt", groupMgmtRouter_1["default"]);
groupIDRouter.use("/rooms", groupRoomRouter_1["default"]);
groupIDRouter.use("/equips", groupEquipRouter_1["default"]);
/* ____  _____    _    ____
  |  _ \| ____|  / \  |  _ \
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/
*/
// Manual Test - Basic Functionality: 01/17/2022
groupIDRouter.get("/", authorizationMW_1["default"].defineSitePermissions(["view_group_public"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID) {
                    throw new expresError_1["default"]("Must be logged in to view groups || group not found", 400);
                }
                return [4 /*yield*/, groupModel_1["default"].retrieve_group_by_group_id(req.groupID)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Unable to find group.", 404);
                }
                ;
                if (queryData.public !== true) {
                    console.log("Group Not Public, Forward to Group MW Check");
                    // req.fwdData = queryData;
                    return [2 /*return*/, next()];
                }
                ;
                return [2 /*return*/, res.json({ group: queryData })];
            case 2:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Manual Test - Basic Functionality: 01/17/2022
groupIDRouter.get("/", authorizationMW_1["default"].defineGroupPermissions(["read_group"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID) {
                    throw new expresError_1["default"]("Must be logged in to view groups || group not found", 400);
                }
                return [4 /*yield*/, groupModel_1["default"].retrieve_group_by_group_id(req.groupID)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Unable to find group.", 404);
                }
                ;
                return [2 /*return*/, res.json({ group: queryData })];
            case 2:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/* _   _ ____  ____    _  _____ _____
  | | | |  _ \|  _ \  / \|_   _| ____|
  | | | | |_) | | | |/ _ \ | | |  _|
  | |_| |  __/| |_| / ___ \| | | |___
   \___/|_|   |____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 01/16/2022
groupIDRouter.patch("/", authorizationMW_1["default"].loadGroupPermissions, authorizationMW_1["default"].defineSitePermissions(["update_group_self"]), authorizationMW_1["default"].defineGroupPermissions(["read_group", "update_group"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var prevValues_1, updateValues_1, itemsList_1, newKeys, newData, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID) {
                    throw new expresError_1["default"]("Must be logged in to update group || group not found", 400);
                }
                return [4 /*yield*/, groupModel_1["default"].retrieve_group_by_group_id(req.groupID)];
            case 1:
                prevValues_1 = _b.sent();
                if (!prevValues_1) {
                    throw new expresError_1["default"]("Update Failed: Group Not Found", 404);
                }
                ;
                updateValues_1 = {
                    name: req.body.name,
                    headline: req.body.headline,
                    description: req.body.description,
                    public: req.body.public
                };
                if (!(0, groupUpdateSchema_1["default"])(updateValues_1)) {
                    throw new expresError_1["default"]("Update Error: ".concat(groupUpdateSchema_1["default"].errors), 400);
                }
                ;
                itemsList_1 = {};
                newKeys = Object.keys(req.body);
                newKeys.map(function (key) {
                    if (updateValues_1[key] !== undefined && (updateValues_1[key] != prevValues_1[key])) {
                        itemsList_1[key] = req.body[key];
                    }
                });
                // If no changes return original data
                if (Object.keys(itemsList_1).length === 0) {
                    return [2 /*return*/, res.json({ group: [prevValues_1] })];
                }
                return [4 /*yield*/, groupModel_1["default"].modify_group(req.groupID, itemsList_1)];
            case 2:
                newData = _b.sent();
                return [2 /*return*/, res.json({ group: [newData] })];
            case 3:
                error_3 = _b.sent();
                next(error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/* ____  _____ _     _____ _____ _____
  |  _ \| ____| |   | ____|_   _| ____|
  | | | |  _| | |   |  _|   | | |  _|
  | |_| | |___| |___| |___  | | | |___
  |____/|_____|_____|_____| |_| |_____|
*/
// Manual Test - Basic Functionality: 01/17/2022
groupIDRouter["delete"]("/", authorizationMW_1["default"].loadGroupPermissions, authorizationMW_1["default"].defineSitePermissions(["delete_group_self"]), authorizationMW_1["default"].defineGroupPermissions(["read_group", "delete_group"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID) {
                    throw new expresError_1["default"]("Must be logged in to delete groups || target group not specified", 400);
                }
                return [4 /*yield*/, groupModel_1["default"].delete_group(req.groupID)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Unable to delete target group", 404);
                }
                return [2 /*return*/, res.json({ message: "Group deleted." })];
            case 2:
                error_4 = _b.sent();
                return [2 /*return*/, next(error_4)];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports["default"] = groupIDRouter;
//# sourceMappingURL=groupIDRouter.js.map