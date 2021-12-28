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
// Library Imports
var express = require("express");
// Utility Functions Import
var expresError_1 = require("../utils/expresError");
// Schema Imports
var robotCreateSchema_1 = require("../schemas/robot/robotCreateSchema");
var robotUpdateSchema_1 = require("../schemas/robot/robotUpdateSchema");
// Model Imports
var robotModel_1 = require("../models/robotModel");
// Middleware Imports
var authorizationMW_1 = require("../middleware/authorizationMW");
var groupMW_1 = require("../middleware/groupMW");
var groupRobotRouter = express.Router();
/* ____ ____  _____    _  _____ _____
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|
 | |___|  _ <| |___ / ___ \| | | |___
  \____|_| \_\_____/_/   \_\_| |_____|
*/
groupRobotRouter.post("/create", groupMW_1["default"].defineActionPermissions(["view", "create"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var regValues, queryData, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                regValues = {
                    name: req.body.name,
                    description: req.body.description,
                    config: req.body.config
                };
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID) {
                    throw new expresError_1["default"]("Must be logged in to create a robot || group not found", 400);
                }
                if (!(0, robotCreateSchema_1["default"])(regValues)) {
                    throw new expresError_1["default"]("Unable to Create User Robot: ".concat(robotCreateSchema_1["default"].errors), 400);
                }
                return [4 /*yield*/, robotModel_1["default"].create_group_robot((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, req === null || req === void 0 ? void 0 : req.groupID, regValues)];
            case 1:
                queryData = _c.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Create Robot Failed", 400);
                }
                return [2 /*return*/, res.json({ robot: queryData })];
            case 2:
                error_1 = _c.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/* ____  _____    _    ____
  |  _ \| ____|  / \  |  _ \
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/
*/
groupRobotRouter.get("/p/:robotID", groupMW_1["default"].defineActionPermissions(["view"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, robotModel_1["default"].retrieve_robot_by_robot_id(req.params.robotID)];
            case 1:
                queryData = _a.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Robot Not Found.", 404);
                }
                return [2 /*return*/, res.json({ robot: queryData })];
            case 2:
                error_2 = _a.sent();
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
groupRobotRouter.patch("/p/:robotID", groupMW_1["default"].defineActionPermissions(["view", "update"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var prevValues_1, updateValues_1, itemsList_1, newKeys, newData, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, robotModel_1["default"].retrieve_robot_by_robot_id(req.params.robotID)];
            case 1:
                prevValues_1 = _a.sent();
                if (!prevValues_1) {
                    throw new expresError_1["default"]("Update Failed: Robot Not Found", 404);
                }
                ;
                updateValues_1 = {
                    name: req.body.name,
                    description: req.body.description,
                    config: req.body.config
                };
                if (!(0, robotUpdateSchema_1["default"])(updateValues_1)) {
                    throw new expresError_1["default"]("Update Error: ".concat(robotUpdateSchema_1["default"].errors), 400);
                }
                ;
                itemsList_1 = {};
                newKeys = Object.keys(req.body);
                newKeys.map(function (key) {
                    if (updateValues_1[key] && (updateValues_1[key] != prevValues_1[key])) {
                        itemsList_1[key] = req.body[key];
                    }
                });
                // If no changes return original data
                if (Object.keys(itemsList_1).length === 0) {
                    return [2 /*return*/, res.json({ robot: prevValues_1 })];
                }
                return [4 /*yield*/, robotModel_1["default"].modify_robot(req.params.robotID, itemsList_1)];
            case 2:
                newData = _a.sent();
                return [2 /*return*/, res.json({ robot: newData })];
            case 3:
                error_3 = _a.sent();
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
groupRobotRouter["delete"]("/:robotID", groupMW_1["default"].defineActionPermissions(["view", "delete"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData;
    var _a, _b;
    return __generator(this, function (_c) {
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                throw new expresError_1["default"]("Must be logged in to delete a robot", 400);
            }
            queryData = robotModel_1["default"].delete_user_robot((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, req.params.robotID);
            if (!queryData) {
                throw new expresError_1["default"]("Unable to delete target robot", 404);
            }
            return [2 /*return*/, res.json({ message: "Robot deleted." })];
        }
        catch (error) {
            return [2 /*return*/, next(error)];
        }
        return [2 /*return*/];
    });
}); });
module.exports = groupRobotRouter;
//# sourceMappingURL=groupRobotRouter.js.map