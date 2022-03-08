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
var expresError_1 = require("../utils/expresError");
var authHandling_1 = require("../utils/authHandling");
// Schema Imports
var userAuthSchema_1 = require("../schemas/user/userAuthSchema");
var userRegisterSchema_1 = require("../schemas/user/userRegisterSchema");
var userUpdateSchema_1 = require("../schemas/user/userUpdateSchema");
// Router Imports
var userRoomRouter_1 = require("./userRouters/userRoomRouter");
var userEquipRouter_1 = require("./userRouters/userEquipRouter");
// Model Imports
var userModel_1 = require("../models/userModel");
// Middleware Imports
var authorizationMW_1 = require("../middleware/authorizationMW");
var userGroupRouter_1 = require("./userRouters/userGroupRouter");
var userDMRouter_1 = require("./userRouters/userDMRouter");
var userRootRouter = express.Router();
userRootRouter.use("/rooms", userRoomRouter_1["default"]);
userRootRouter.use("/equips", userEquipRouter_1["default"]);
userRootRouter.use("/groups", userGroupRouter_1["default"]);
userRoomRouter_1["default"].use("/dm", userDMRouter_1["default"]);
/*    _   _   _ _____ _   _
     / \ | | | |_   _| | | |
    / _ \| | | | | | | |_| |
   / ___ \ |_| | | | |  _  |
  /_/   \_\___/  |_| |_| |_|
*/
// Manual Test - Basic Functionality: 01/13/2022
userRootRouter.post("/auth", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authValues, queryData, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                authValues = {
                    username: req.body.username,
                    password: req.body.password
                };
                if (!(0, userAuthSchema_1["default"])(authValues)) {
                    throw new expresError_1["default"]("Username & Password Required: ".concat(userAuthSchema_1["default"].errors), 400);
                }
                return [4 /*yield*/, userModel_1["default"].authenticate(authValues)];
            case 1:
                queryData = _a.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Invalid Email/Password", 400);
                }
                // AuthHandling.generateToken(res, queryData);
                authHandling_1["default"].generateSessionCookies(res, queryData);
                return [2 /*return*/, res.json({ "message": "Login successful." })];
            case 2:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/* ____ ____  _____    _  _____ _____
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|
 | |___|  _ <| |___ / ___ \| | | |___
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 01/13/2022
userRootRouter.post("/register", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var regValues, queryData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                regValues = {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name
                };
                if (!(0, userRegisterSchema_1["default"])(regValues)) {
                    console.log(userRegisterSchema_1["default"].errors);
                    // TODO: Create Error Message Based on Schema Output
                    // [
                    //     [1]   {
                    //     [1]     instancePath: '',
                    //     [1]     schemaPath: '#/required',
                    //     [1]     keyword: 'required',
                    //     [1]     params: { missingProperty: 'username' },
                    //     [1]     message: "must have required property 'username'"
                    //     [1]   }
                    //     [1] ]
                    throw new expresError_1["default"]("Username & Password Required: ".concat(userRegisterSchema_1["default"].errors), 400);
                }
                return [4 /*yield*/, userModel_1["default"].register(regValues)];
            case 1:
                queryData = _a.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Registration Failed", 400);
                }
                // AuthHandling.generateToken(res, queryData);
                authHandling_1["default"].generateSessionCookies(res, queryData);
                return [2 /*return*/, res.json({ "message": "Registration Success!" })];
            case 2:
                error_2 = _a.sent();
                next(error_2);
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
// Manual Test - Basic Functionality: 01/13/2022
userRootRouter.get("/profile", authorizationMW_1["default"].defineSitePermissions(['read_user_self']), authorizationMW_1["default"].loadSitePermissions, authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userModel_1["default"].retrieve_user_by_user_id((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Unable to find user account.", 404);
                }
                return [2 /*return*/, res.json({ user: queryData })];
            case 2:
                error_3 = _b.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
userRootRouter.get("/list", authorizationMW_1["default"].defineSitePermissions(['view_user_public']), authorizationMW_1["default"].loadSitePermissions, authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userModel_1["default"].retrieve_user_by_user_id((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Unable to find user account.", 404);
                }
                return [2 /*return*/, res.json({ user: queryData })];
            case 2:
                error_4 = _b.sent();
                next(error_4);
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
// Manual Test - Basic Functionality: 01/13/2022
userRootRouter.patch("/update", authorizationMW_1["default"].defineSitePermissions(['update_user_self']), authorizationMW_1["default"].loadSitePermissions, authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var prevValues_1, updateValues_1, itemsList_1, newKeys, newData, error_5;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                return [4 /*yield*/, userModel_1["default"].retrieve_user_by_user_id((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                prevValues_1 = _c.sent();
                if (!prevValues_1) {
                    throw new expresError_1["default"]("Update Failed: User Not Found", 404);
                }
                ;
                updateValues_1 = {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name
                };
                if (!(0, userUpdateSchema_1["default"])(updateValues_1)) {
                    throw new expresError_1["default"]("Update Error: ".concat(userUpdateSchema_1["default"].errors), 400);
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
                    return [2 /*return*/, res.json({ user: prevValues_1 })];
                }
                return [4 /*yield*/, userModel_1["default"].modify_user((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, itemsList_1)];
            case 2:
                newData = _c.sent();
                return [2 /*return*/, res.json({ user: newData })];
            case 3:
                error_5 = _c.sent();
                next(error_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/* _     ___   ____  ___  _   _ _____
  | |   / _ \ / ___|/ _ \| | | |_   _|
  | |  | | | | |  _| | | | | | | | |
  | |__| |_| | |_| | |_| | |_| | | |
  |_____\___/ \____|\___/ \___/  |_|
*/
// Manual Test - Basic Functionality: 01/13/2022
userRootRouter.post("/logout", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("Logging Out");
        try {
            res.header("auth-token", "");
            return [2 /*return*/, res.json({ "message": "Logout successful." })];
        }
        catch (error) {
            next(error);
        }
        return [2 /*return*/];
    });
}); });
/* ___  _____ _     _____ _____ _____
  |  _ \| ____| |   | ____|_   _| ____|
  | | | |  _| | |   |  _|   | | |  _|
  | |_| | |___| |___| |___  | | | |___
  |____/|_____|_____|_____| |_| |_____|
*/
// Manual Test - Basic Functionality: 01/13/2022
userRootRouter["delete"]("/delete", authorizationMW_1["default"].defineSitePermissions(['delete_user_self']), authorizationMW_1["default"].loadSitePermissions, authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_6;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    throw new expresError_1["default"]("Delete user failed, userid not provided.", 400);
                }
                return [4 /*yield*/, userModel_1["default"].delete_user((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
            case 1:
                queryData = _c.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Unable to delete target user account", 404);
                }
                res.setHeader("Authorization", "");
                return [2 /*return*/, res.json({ message: "Your account has been deleted." })];
            case 2:
                error_6 = _c.sent();
                return [2 /*return*/, next(error_6)];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports["default"] = userRootRouter;
//# sourceMappingURL=userRootRouter.js.map