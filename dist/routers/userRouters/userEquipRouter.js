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
var userEquipUpdateSchema_1 = require("../../schemas/equipment/userEquipUpdateSchema");
// Model Imports
var equipModel_1 = require("../../models/equipModel");
// Middleware Imports
var authorizationMW_1 = require("../../middleware/authorizationMW");
var userEquipRouter = express.Router();
/* ____ ____  _____    _  _____ _____
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|
 | |___|  _ <| |___ / ___ \| | | |___
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 01/15/2022
// userEquipRouter.post("/create", authMW.defineSitePermissions(["read_equip_self", "create_equip_self"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         // console.log(req.body);
//         // Preflight
//         const reqValues: UserEquipCreateProps = {
//             name: req.body.name,
//             category_id: req.body.category_id,
//             headline: req.body.headline,
//             description: req.body.description,
//             public: req.body.public,
//             configuration: req.body.configuration
//         };
//         if (!req.user?.id) {
//             throw new ExpressError(`Must be logged in to create equipment`, 400);
//         };
//         if(!validateUserEquipCreateSchema(reqValues)) {
//             throw new ExpressError(`Unable to Create User Equipment: ${validateUserEquipCreateSchema.errors}`, 400);
//         };
//         // Processing
//         const queryData = await EquipModel.create_user_equip(req.user.id, reqValues);
//         if (!queryData) {
//             throw new ExpressError("Create Equipment Failed", 400);
//         };
//         return res.json({equip: [queryData]});
//     } catch (error) {
//         next(error)
//     }
// });
// Manual Test - Basic Functionality: 01/20/2022
userEquipRouter.post("/:equipID/rooms", authorizationMW_1["default"].defineSitePermissions(["read_equip_self", "update_equip_self", "update_room_self"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var equipCheck, asscRooms, queryData, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.body.roomID) {
                    throw new expresError_1["default"]("Must be logged in to create rooms / Target Room ID not provided", 400);
                }
                ;
                return [4 /*yield*/, equipModel_1["default"].retrieve_equip_by_user_and_equip_id(req.user.id, req.params.equipID)];
            case 1:
                equipCheck = _b.sent();
                if (!equipCheck.id) {
                    throw new expresError_1["default"]("This piece of equipment is not associated with the target user", 401);
                }
                ;
                return [4 /*yield*/, equipModel_1["default"].retrieve_equip_rooms_by_equip_id(req.params.equipID)];
            case 2:
                asscRooms = _b.sent();
                if (asscRooms.length > 0) {
                    throw new expresError_1["default"]("This piece of equipment is already associated with a room, a piece of equipment can only be associated with one room.", 400);
                }
                ;
                return [4 /*yield*/, equipModel_1["default"].create_equip_room_association(req.body.roomID, req.params.equipID)];
            case 3:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Assoicate Equipment to Room Failed", 500);
                }
                ;
                return [2 /*return*/, res.json({ roomEquip: [queryData] })];
            case 4:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
/* ____  _____    _    ____
  |  _ \| ____|  / \  |  _ \
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/
*/
// Manual Test - Basic Functionality: 01/15/2022
userEquipRouter.get("/list", authorizationMW_1["default"].defineSitePermissions(["read_equip_self"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                    throw new expresError_1["default"]("Invalid Call: Get User Equipment - All", 401);
                }
                ;
                return [4 /*yield*/, equipModel_1["default"].retrieve_user_equip_by_user_id((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)];
            case 1:
                queryData = _c.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Equipment Not Found: Get User Equipment - All", 404);
                }
                ;
                return [2 /*return*/, res.json({ equip: queryData })];
            case 2:
                error_2 = _c.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Manual Test - Basic Functionality: 01/19/2022
userEquipRouter.get("/:equipID/rooms", authorizationMW_1["default"].defineSitePermissions(["read_room_self", "read_equip_self"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, equipModel_1["default"].retrieve_equip_rooms_by_equip_id(req.params.equipID)];
            case 1:
                queryData = _a.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Equipment Not Found.", 404);
                }
                return [2 /*return*/, res.json({ rooms: queryData })];
            case 2:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Manual Test - Basic Functionality: 01/15/2022
userEquipRouter.get("/:equipID", authorizationMW_1["default"].defineSitePermissions(["read_equip_self"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, equipModel_1["default"].retrieve_equip_by_equip_id(req.params.equipID)];
            case 1:
                queryData = _a.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Equipment Not Found.", 404);
                }
                return [2 /*return*/, res.json({ equip: [queryData] })];
            case 2:
                error_4 = _a.sent();
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
// Manual Test - Basic Functionality: 01/15/2022
userEquipRouter.patch("/:equipID", authorizationMW_1["default"].defineSitePermissions(["read_equip_self", "update_equip_self"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var prevValues_1, updateValues_1, itemsList_1, newKeys, newData, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, equipModel_1["default"].retrieve_equip_by_equip_id(req.params.equipID)];
            case 1:
                prevValues_1 = _a.sent();
                if (!prevValues_1) {
                    throw new expresError_1["default"]("Update Failed: Equipment Not Found", 404);
                }
                ;
                updateValues_1 = {
                    name: req.body.name,
                    category_id: req.body.category_id,
                    headline: req.body.headline,
                    description: req.body.description,
                    public: req.body.public,
                    configuration: req.body.configuration
                };
                if (!(0, userEquipUpdateSchema_1["default"])(updateValues_1)) {
                    throw new expresError_1["default"]("Update Error: ".concat(userEquipUpdateSchema_1["default"].errors), 400);
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
                    return [2 /*return*/, res.json({ equip: [prevValues_1] })];
                }
                return [4 /*yield*/, equipModel_1["default"].modify_group_equip(req.params.equipID, itemsList_1)];
            case 2:
                newData = _a.sent();
                return [2 /*return*/, res.json({ equip: [newData] })];
            case 3:
                error_5 = _a.sent();
                next(error_5);
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
// Manual Test - Basic Functionality: 01/15/2022
userEquipRouter["delete"]("/:equipID", authorizationMW_1["default"].defineSitePermissions(["read_equip_self", "delete_equip_self"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData;
    var _a;
    return __generator(this, function (_b) {
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
                throw new expresError_1["default"]("Must be logged in to delete equipment", 400);
            }
            queryData = equipModel_1["default"].delete_user_equip(req.user.id, req.params.equipID);
            if (!queryData) {
                throw new expresError_1["default"]("Unable to delete target equipment", 404);
            }
            return [2 /*return*/, res.json({ message: "Equipment deleted." })];
        }
        catch (error) {
            return [2 /*return*/, next(error)];
        }
        return [2 /*return*/];
    });
}); });
// Manual Test - Basic Functionality: 01/19/2022
userEquipRouter["delete"]("/:equipID/rooms", authorizationMW_1["default"].defineSitePermissions(["read_equip_self", "update_equip_self", "update_room_self"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var equipCheck, queryData, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.body.roomID) {
                    throw new expresError_1["default"]("Must be logged in to create rooms / Missing Group Definition / Target Equip ID not provided", 400);
                }
                ;
                return [4 /*yield*/, equipModel_1["default"].retrieve_equip_by_user_and_equip_id(req.user.id, req.params.equipID)];
            case 1:
                equipCheck = _b.sent();
                if (!equipCheck.id) {
                    throw new expresError_1["default"]("This piece of equipment is not associated with the target user", 401);
                }
                ;
                return [4 /*yield*/, equipModel_1["default"].delete_equip_room_assc_by_room_equip_id(req.body.roomID, req.params.equipID)];
            case 2:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Disassociate Equipment from Room Failed", 500);
                }
                ;
                return [2 /*return*/, res.json({ roomEquip: [queryData] })];
            case 3:
                error_6 = _b.sent();
                next(error_6);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// export default userEquipRouter;
//# sourceMappingURL=userEquipRouter.js.map