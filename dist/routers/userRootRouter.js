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
// Model Imports
var userModel_1 = require("../models/userModel");
var groupModel_1 = require("../models/groupModel");
// Middleware Imports
var authorizationMW_1 = require("../middleware/authorizationMW");
var userDMRouter_1 = require("./userRouters/userDMRouter");
var userRootRouter = express.Router();
userRootRouter.use("/dm", userDMRouter_1["default"]);
/*    _   _   _ _____ _   _
     / \ | | | |_   _| | | |
    / _ \| | | | | | | |_| |
   / ___ \ |_| | | | |  _  |
  /_/   \_\___/  |_| |_| |_|
*/
// Manually Tested 2022-03-22
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
// Manually Tested 2022-03-22
userRootRouter.post("/register", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var regValues, queryData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                regValues = {
                    password: req.body.password,
                    username: req.body.username,
                    email: req.body.email,
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
                ;
                return [4 /*yield*/, userModel_1["default"].register(regValues)];
            case 1:
                queryData = _a.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Registration Failed", 400);
                }
                ;
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
// Manual Tests - Already Invited, Send Request, Remove Request, Already Member, Accept Invite 2022-04-04
userRootRouter.post("/request", authorizationMW_1["default"].defineRoutePermissions({
    user: ["site_update_user_self"],
    group: [],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, _a, userIDs, _b, error_3;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 15, , 16]);
                if (!((_c = req.user) === null || _c === void 0 ? void 0 : _c.id)) {
                    throw new expresError_1["default"]("Unauthorized", 401);
                }
                ;
                if (!req.body.groupID || !req.body.context || !req.body.action) {
                    throw new expresError_1["default"]("Invalid Request", 400);
                }
                ;
                queryData = void 0;
                _a = req.body.context;
                switch (_a) {
                    case "group": return [3 /*break*/, 1];
                }
                return [3 /*break*/, 13];
            case 1:
                userIDs = void 0;
                _b = req.body.action;
                switch (_b) {
                    case "accept_request": return [3 /*break*/, 2];
                    case "send_request": return [3 /*break*/, 5];
                    case "remove_request": return [3 /*break*/, 8];
                }
                return [3 /*break*/, 11];
            case 2: return [4 /*yield*/, groupModel_1["default"].retrieve_filtered_user_ids([req.user.id], req.body.groupID, "group_request_active")];
            case 3:
                userIDs = _d.sent();
                if (userIDs.length < 1) {
                    throw new expresError_1["default"]("Unable to join group.", 400);
                }
                ;
                return [4 /*yield*/, groupModel_1["default"].create_group_user(req.body.groupID, userIDs)];
            case 4:
                queryData = _d.sent();
                return [2 /*return*/, res.json({ reqAccept: queryData })];
            case 5: return [4 /*yield*/, groupModel_1["default"].retrieve_filtered_user_ids([req.user.id], req.body.groupID, "user_request_permitted")];
            case 6:
                userIDs = _d.sent();
                if (userIDs.length < 1) {
                    throw new expresError_1["default"]("Unable to request to join this group.", 400);
                }
                ;
                return [4 /*yield*/, groupModel_1["default"].create_request_user_to_group(req.body.groupID, req.user.id)];
            case 7:
                queryData = _d.sent();
                return [2 /*return*/, res.json({ reqSent: queryData })];
            case 8: return [4 /*yield*/, groupModel_1["default"].retrieve_filtered_user_ids([req.user.id], req.body.groupID)];
            case 9:
                userIDs = _d.sent();
                if (userIDs.length < 1) {
                    throw new expresError_1["default"]("Unable to remove invite request.", 400);
                }
                ;
                return [4 /*yield*/, groupModel_1["default"].delete_request_user_group(userIDs, req.body.groupID)];
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
                error_3 = _d.sent();
                next(error_3);
                return [3 /*break*/, 16];
            case 16: return [2 /*return*/];
        }
    });
}); });
/* ____  _____    _    ____
  |  _ \| ____|  / \  |  _ \
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/
*/
// Manually Tested 2022-03-22
userRootRouter.get("/profile", authorizationMW_1["default"].defineRoutePermissions({
    user: ["site_read_user_self"],
    group: [],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
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
// Manually Tested 2022-04-04
userRootRouter.get("/request", authorizationMW_1["default"].defineRoutePermissions({
    user: ["site_read_user_self"],
    group: [],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_5;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    throw new expresError_1["default"]("Unauthorized", 401);
                }
                ;
                return [4 /*yield*/, userModel_1["default"].retrieve_group_requests_by_user_id((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
            case 1:
                queryData = _c.sent();
                return [2 /*return*/, res.json({ requests: queryData })];
            case 2:
                error_5 = _c.sent();
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Manually Tested 2022-03-22
userRootRouter.get("/list", authorizationMW_1["default"].defineRoutePermissions({
    user: [],
    group: [],
    public: ["site_read_user_public"]
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userModel_1["default"].retrieve_user_list_paginated(10, 0)];
            case 1:
                queryData = _a.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Unable to retrieve user list.", 404);
                }
                return [2 /*return*/, res.json({ user: queryData })];
            case 2:
                error_6 = _a.sent();
                next(error_6);
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
// Manually Tested 2022-03-22
userRootRouter.patch("/update", authorizationMW_1["default"].defineRoutePermissions({
    user: ["site_update_user_self"],
    group: [],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var prevValues, processedValues, incValues, pKey, cv1, updateValues, group, item, newData, error_7;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                return [4 /*yield*/, userModel_1["default"].retrieve_user_by_user_id((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                prevValues = _c.sent();
                if (!prevValues) {
                    throw new expresError_1["default"]("Update Failed: User Not Found", 404);
                }
                ;
                processedValues = {};
                incValues = req.body;
                for (pKey in prevValues) {
                    if (incValues[pKey] !== undefined && incValues[pKey] !== prevValues[pKey]) {
                        // Special Cases - Username Change, Email Change
                        if (pKey === "username" || pKey === "email") {
                            cv1 = prevValues[pKey] || "";
                            if (incValues[pKey].toLowerCase() !== cv1.toLowerCase()) {
                                processedValues[pKey] = incValues[pKey];
                                processedValues["".concat(pKey, "_clean")] = incValues[pKey].toLowerCase();
                            }
                            ;
                        }
                        else {
                            processedValues[pKey] = incValues[pKey];
                        }
                        ;
                    }
                }
                ;
                updateValues = {
                    user_account: {
                        password: processedValues.password
                    },
                    user_profile: {
                        username: processedValues.username,
                        username_clean: processedValues.username_clean,
                        headline: processedValues.headline,
                        about: processedValues.about,
                        image_url: processedValues.image_url,
                        public: processedValues.public
                    },
                    user_data: {
                        email: processedValues.email,
                        email_clean: processedValues.email_clean,
                        public_email: processedValues.public_email,
                        first_name: processedValues.first_name,
                        public_first_name: processedValues.public_first_name,
                        last_name: processedValues.last_name,
                        public_last_name: processedValues.public_last_name,
                        location: processedValues.location,
                        public_location: processedValues.public_location
                    }
                };
                if (!(0, userUpdateSchema_1["default"])(updateValues)) {
                    throw new expresError_1["default"]("Update Error: ".concat(userUpdateSchema_1["default"].errors), 400);
                }
                ;
                group = void 0;
                item = void 0;
                // Clean-Up Update List
                for (group in updateValues) {
                    for (item in updateValues[group]) {
                        if (updateValues[group][item] === undefined) {
                            delete updateValues[group][item];
                        }
                    }
                    ;
                    if (Object.keys(updateValues[group]).length === 0) {
                        delete updateValues[group];
                    }
                    ;
                }
                // If no changes return original data
                if (Object.keys(updateValues).length === 0) {
                    return [2 /*return*/, res.json({ user: prevValues })];
                }
                ;
                return [4 /*yield*/, userModel_1["default"].modify_user((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, updateValues)];
            case 2:
                newData = _c.sent();
                return [2 /*return*/, res.json({ user: newData })];
            case 3:
                error_7 = _c.sent();
                next(error_7);
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
// Manually Tested 2022-03-22
userRootRouter.post("/logout", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
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
// Manually Tested 2022-03-22
userRootRouter["delete"]("/delete", authorizationMW_1["default"].defineRoutePermissions({
    user: ["site_delete_user_self"],
    group: [],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_8;
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
                error_8 = _c.sent();
                return [2 /*return*/, next(error_8)];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports["default"] = userRootRouter;
//# sourceMappingURL=userRootRouter.js.map