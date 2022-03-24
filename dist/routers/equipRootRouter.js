"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var expresError_1 = require("../utils/expresError");
// Model Imports
var equipModel_1 = require("../models/equipModel");
// Middleware Imports
var authorizationMW_1 = require("../middleware/authorizationMW");
var equipCreateSchema_1 = require("../schemas/equipment/equipCreateSchema");
var equipRootRouter = express.Router();
/* ____ ____  _____    _  _____ _____
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|
 | |___|  _ <| |___ / ___ \| | | |___
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 03/19/2022
equipRootRouter.post("/create", authorizationMW_1["default"].addContextToRequest, authorizationMW_1["default"].defineRoutePermissions({
    user: ["site_create_equip_self"],
    group: ["group_create_equip"],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var reqValues, queryData, permCheck, _a, error_1;
    var _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _e.trys.push([0, 8, , 9]);
                // Preflight
                if (!((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
                    throw new expresError_1["default"]("Must be logged in to create equip", 401);
                }
                ;
                reqValues = {
                    context: req.body.context ? req.body.context : "user",
                    ownerid: req.body.ownerid ? req.body.ownerid : req.user.id,
                    name: req.body.name,
                    category_id: req.body.category_id,
                    headline: req.body.headline,
                    description: req.body.description,
                    image_url: req.body.image_url,
                    public: req.body.public,
                    configuration: req.body.configuration
                };
                if (!(0, equipCreateSchema_1["default"])(reqValues)) {
                    throw new expresError_1["default"]("Unable to Create Equip - Schema Validation Error: ".concat(equipCreateSchema_1["default"].errors), 400);
                }
                ;
                queryData = void 0;
                permCheck = void 0;
                _a = reqValues.context;
                switch (_a) {
                    case "user": return [3 /*break*/, 1];
                    case "group": return [3 /*break*/, 3];
                }
                return [3 /*break*/, 7];
            case 1:
                permCheck = (_c = req.resolvedPerms) === null || _c === void 0 ? void 0 : _c.reduce(function (acc, val) {
                    return acc = acc || (val.permissions_name === "site_create_equip_self");
                }, false);
                return [4 /*yield*/, equipModel_1["default"].create_user_equip(reqValues)];
            case 2:
                // idcheck = await UserModel.retrieve_user_by_user_id(reqValues.ownerid);
                // if (!idcheck)  {throw new ExpressError(`Value is not a valid userid`, 401);};
                queryData = _e.sent();
                return [3 /*break*/, 7];
            case 3:
                permCheck = (_d = req.resolvedPerms) === null || _d === void 0 ? void 0 : _d.reduce(function (acc, val) {
                    return acc = acc || (val.permissions_name === "group_create_equip");
                }, false);
                if (!permCheck) return [3 /*break*/, 5];
                return [4 /*yield*/, equipModel_1["default"].create_group_equip(reqValues)];
            case 4:
                // idcheck = await GroupModel.retrieve_group_by_group_id(reqValues.ownerid, "elevated");
                // if (!idcheck)  {throw new ExpressError(`Value is not a valid groupid`, 401);};
                queryData = _e.sent();
                return [3 /*break*/, 6];
            case 5: throw new expresError_1["default"]("Unauthorized", 401);
            case 6:
                ;
                return [3 /*break*/, 7];
            case 7:
                ;
                if (!queryData) {
                    throw new expresError_1["default"]("Create Equip Failed", 500);
                }
                ;
                return [2 /*return*/, res.json({ equip: queryData })];
            case 8:
                error_1 = _e.sent();
                next(error_1);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
/* ____  _____    _    ____
  |  _ \| ____|  / \  |  _ \
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/
*/
// Manual Test - Basic Functionality: 03/19/2022
equipRootRouter.get("/list", authorizationMW_1["default"].defineRoutePermissions({
    user: [],
    group: [],
    public: ["site_read_equip_public"]
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var limit, offset, queryData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                limit = req.query.limit ? req.query.limit : 25;
                offset = req.query.offset ? req.query.offset : 0;
                // const ftserach = req.query.ftsearch;
                // const catid = req.query.catid;
                // const uid = req.query.uid;
                // const gid = req.query.gid;
                if (typeof limit !== "number" || typeof offset !== "number") {
                    throw new expresError_1["default"]("One or more query parameters is of an invalid type", 404);
                }
                ;
                return [4 /*yield*/, equipModel_1["default"].retrieve_equip_list_paginated(limit, offset)];
            case 1:
                queryData = _a.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Equipment Not Found.", 404);
                }
                return [2 /*return*/, res.json({ equip: queryData })];
            case 2:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Manual Test - Basic Functionality: 01/15/2022
// equipRootRouter.get("/users/:userID", authMW.defineSitePermissions(["site_read_equip_public"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         // Processing
//         const queryData = await EquipModel.retrieve_user_equip_by_user_id(req.params.userID, true);
//         if (!queryData) {
//             throw new ExpressError("Equipment Not Found: Get User Equipment - Public", 404);
//         };
//         return res.json({equip: queryData});
//     } catch (error) {
//         next(error)
//     }
// });
// Manual Test - Basic Functionality: 01/18/2022
// equipRootRouter.get("/groups/:groupID", authMW.defineSitePermissions(["site_read_equip_public"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         // Processing
//         const queryData = await EquipModel.retrieve_group_equip_by_group_id(req.params.groupID, true);
//         if (!queryData) {
//             throw new ExpressError("Equipment Not Found: Get Group Equipment - Public", 404);
//         };
//         return res.json({equip: queryData});
//     } catch (error) {
//         next(error)
//     }
// });
// Manual Test - Basic Functionality: 01/15/2022
// equipRootRouter.get("/rooms/:roomID", authMW.defineSitePermissions(["site_read_equip_public"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         // Processing
//         const queryData = await EquipModel.retrieve_room_equip_by_room_id(req.params.roomID, true);
//         if (!queryData) {
//             throw new ExpressError("Equipment Not Found: Get Group Equipment - Public", 404);
//         };
//         return res.json({equip: queryData});
//     } catch (error) {
//         next(error)
//     }
// });
// Manual Test - Basic Functionality: 03/19/2022
// Check for elevated permissions through user id
equipRootRouter.get("/:equipID", authorizationMW_1["default"].defineRoutePermissions({
    user: ["site_read_equip_self", "site_update_equip_self", "site_delete_equip_self"],
    group: ["group_read_equip", "group_update_equip", "group_delete_equip"],
    public: ["site_read_equip_public"]
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, readPermitted_1, updatePermitted_1, deletePermitted_1, output, error_3;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 5, , 6]);
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    throw new expresError_1["default"]("User ID Not Defined", 401);
                }
                ;
                queryData = void 0;
                readPermitted_1 = 0;
                updatePermitted_1 = 0;
                deletePermitted_1 = 0;
                (_b = req.resolvedPerms) === null || _b === void 0 ? void 0 : _b.forEach(function (val) {
                    // Set Read Pemission Level
                    if (((val.permissions_name === "site_read_equip_self") || (val.permissions_name === "group_read_equip"))) {
                        readPermitted_1 = 2;
                    }
                    ;
                    if (val.permissions_name === "site_read_equip_public" && readPermitted_1 !== 2) {
                        readPermitted_1 = 1;
                    }
                    ;
                    // Set Update Permission Level
                    if (((val.permissions_name === "site_update_equip_self") || (val.permissions_name === "group_update_equip"))) {
                        updatePermitted_1 = 1;
                    }
                    ;
                    // Set Delete Permission Level
                    if (((val.permissions_name === "site_delete_equip_self") || (val.permissions_name === "group_delete_equip"))) {
                        deletePermitted_1 = 1;
                    }
                    ;
                });
                console.log(readPermitted_1, updatePermitted_1, deletePermitted_1);
                if (!(readPermitted_1 === 2)) return [3 /*break*/, 2];
                return [4 /*yield*/, equipModel_1["default"].retrieve_equip_by_equip_id(req.params.equipID, "elevated")];
            case 1:
                queryData = _c.sent();
                return [3 /*break*/, 4];
            case 2:
                if (!(readPermitted_1 === 1)) return [3 /*break*/, 4];
                return [4 /*yield*/, equipModel_1["default"].retrieve_equip_by_equip_id(req.params.equipID, "public")];
            case 3:
                queryData = _c.sent();
                _c.label = 4;
            case 4:
                ;
                if (!queryData) {
                    throw new expresError_1["default"]("Equip not found.", 404);
                }
                output = __assign(__assign({}, queryData), { canUpdate: updatePermitted_1, canDelete: deletePermitted_1 });
                return [2 /*return*/, res.json({ equip: output })];
            case 5:
                error_3 = _c.sent();
                next(error_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
exports["default"] = equipRootRouter;
//# sourceMappingURL=equipRootRouter.js.map