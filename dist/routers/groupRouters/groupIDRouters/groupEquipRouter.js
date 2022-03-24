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
// Model Imports
var equipModel_1 = require("../../../models/equipModel");
// Middleware Imports
var authorizationMW_1 = require("../../../middleware/authorizationMW");
var groupEquipRouter = express.Router();
/* ____ ____  _____    _  _____ _____
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|
 | |___|  _ <| |___ / ___ \| | | |___
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 01/18/2022
// groupEquipRouter.post("/", authMW.defineGroupPermissions(["read_equip", "create_equip"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         console.log("Start Create Group Equip");
//         // Preflight
//         const reqValues: GroupEquipCreateProps = {
//             name: req.body.name,
//             category_id: req.body.category_id,
//             headline: req.body.headline,
//             description: req.body.description,
//             public: req.body.public,
//             configuration: req.body.configuration
//         }
//         if (!req.user?.id || !req.groupID) {
//             throw new ExpressError(`Must be logged in to create equipment || group not found`, 400);
//         }
//         if(!validateGroupEquipCreateSchema(reqValues)) {
//             console.log(validateGroupEquipCreateSchema.errors);
//             throw new ExpressError(`Unable to Create Group Equipment: ${validateGroupEquipCreateSchema.errors}`, 400);
//         }
//         // Process
//         const queryData = await EquipModel.create_group_equip(req.groupID, reqValues);
//         if (!queryData) {
//             throw new ExpressError("Create Equipment Failed", 400);
//         }
//         return res.json({equip: [queryData]})
//     } catch (error) {
//         next(error)
//     }
// });
// Manual Test - Basic Functionality: 01/19/2022
// Create Room - Equipment Association
groupEquipRouter.post("/:equipID/rooms", authorizationMW_1["default"].defineGroupPermissions(["read_room", "update_room", "read_equip", "update_equip"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var equipCheck, asscRooms, queryData, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                console.log("Start Create Association: Group Room -> Equipment");
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID || !req.body.roomID) {
                    throw new expresError_1["default"]("Must be logged in to create rooms / Missing Group Definition / Target Equip ID not provided", 400);
                }
                ;
                return [4 /*yield*/, equipModel_1["default"].retrieve_equip_by_group_and_equip_id(req.groupID, req.params.equipID)];
            case 1:
                equipCheck = _b.sent();
                if (!equipCheck.id) {
                    throw new expresError_1["default"]("This piece of equipment is not associated with the target group", 401);
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
                    throw new expresError_1["default"]("Create Group Room -> Equip Association Failed", 500);
                }
                ;
                return [2 /*return*/, res.json({ roomEquip: [queryData] })];
            case 4:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 5];
            case 5:
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
// Manual Test - Basic Functionality: 01/18/2022
groupEquipRouter.get("/list", authorizationMW_1["default"].defineGroupPermissions(["read_equip"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // Preflight
                if (!req.groupID) {
                    throw new expresError_1["default"]("Invalid Call: Get Group Equipment - All", 401);
                }
                ;
                return [4 /*yield*/, equipModel_1["default"].retrieve_group_equip_by_group_id(req.groupID)];
            case 1:
                queryData = _a.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Equipment Not Found: Get User Equipment - All", 404);
                }
                ;
                return [2 /*return*/, res.json({ equip: queryData })];
            case 2:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Manual Test - Basic Functionality: 01/19/2022
groupEquipRouter.get("/:equipID/rooms", authorizationMW_1["default"].defineGroupPermissions(["read_room", "read_equip"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
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
// Manual Test - Basic Functionality: 01/18/2022
// groupEquipRouter.get("/:equipID", authMW.defineGroupPermissions(["read_equip"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         const queryData = await EquipModel.retrieve_equip_by_equip_id(req.params.equipID);
//         if (!queryData) {
//             throw new ExpressError("Equipment Not Found.", 404);
//         }
//         return res.json({equip: [queryData]});
//     } catch (error) {
//         next(error)
//     }
// });
/* _   _ ____  ____    _  _____ _____
  | | | |  _ \|  _ \  / \|_   _| ____|
  | | | | |_) | | | |/ _ \ | | |  _|
  | |_| |  __/| |_| / ___ \| | | |___
   \___/|_|   |____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 01/18/2022
// groupEquipRouter.patch("/:equipID", authMW.defineGroupPermissions(["read_equip", "update_equip"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         // Preflight
//         if (!req.user?.id || !req.groupID) {
//             throw new ExpressError(`Must be logged in to update equipment || group not found`, 400);
//         }
//         const prevValues = await EquipModel.retrieve_equip_by_equip_id(req.params.equipID);
//         if (!prevValues) {
//             throw new ExpressError(`Update Failed: Equipment Not Found`, 404);
//         };
//         const updateValues: GroupEquipUpdateProps = {
//             name: req.body.name,
//             category_id: req.body.category_id,
//             headline: req.body.headline,
//             description: req.body.description,
//             public: req.body.public,
//             configuration: req.body.configuration
//         };
//         if(!validateGroupEquipUpdateSchema(updateValues)) {
//             throw new ExpressError(`Update Error: ${validateGroupEquipUpdateSchema.errors}`, 400);
//         };
//         // Build update list for patch query 
//         const itemsList = {};
//         const newKeys = Object.keys(req.body);
//         newKeys.map(key => {
//             if(updateValues[key] !== undefined && (updateValues[key] != prevValues[key]) ) {
//                 itemsList[key] = req.body[key];
//             }
//         })
//         // If no changes return original data
//         if(Object.keys(itemsList).length === 0) {
//             return res.json({equip: [prevValues]});
//         }
//         // Update the user data with the itemsList information
//         const newData = await EquipModel.modify_group_equip(req.params.equipID, itemsList);
//         return res.json({equip: [newData]})
//     } catch (error) {
//         next(error)
//     }
// });
/* ____  _____ _     _____ _____ _____
  |  _ \| ____| |   | ____|_   _| ____|
  | | | |  _| | |   |  _|   | | |  _|
  | |_| | |___| |___| |___  | | | |___
  |____/|_____|_____|_____| |_| |_____|
*/
// Manual Test - Basic Functionality: 01/18/2022
groupEquipRouter["delete"]("/:equipID", authorizationMW_1["default"].defineGroupPermissions(["read_equip", "delete_equip"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData;
    var _a;
    return __generator(this, function (_b) {
        try {
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID) {
                throw new expresError_1["default"]("Must be logged in to create equipment || group not found", 400);
            }
            queryData = equipModel_1["default"].delete_group_equip(req.groupID, req.params.equipID);
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
groupEquipRouter["delete"]("/:equipID/rooms", authorizationMW_1["default"].defineGroupPermissions(["read_room", "update_room", "read_equip", "update_equip"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var equipCheck, queryData, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                console.log("Start Delete Association: Group Room -> Equipment");
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID || !req.body.roomID) {
                    throw new expresError_1["default"]("Must be logged in to create rooms / Missing Group Definition / Target Equip ID not provided", 400);
                }
                ;
                return [4 /*yield*/, equipModel_1["default"].retrieve_equip_by_group_and_equip_id(req.groupID, req.params.equipID)];
            case 1:
                equipCheck = _b.sent();
                if (!equipCheck.id) {
                    throw new expresError_1["default"]("This piece of equipment is not associated with the target group", 401);
                }
                ;
                return [4 /*yield*/, equipModel_1["default"].delete_equip_room_assc_by_room_equip_id(req.body.roomID, req.params.equipID)];
            case 2:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Delete Group Room -> Equip Association Failed", 500);
                }
                ;
                return [2 /*return*/, res.json({ roomEquip: [queryData] })];
            case 3:
                error_4 = _b.sent();
                next(error_4);
                return [3 /*break*/, 4];
            case 4:
                ;
                return [2 /*return*/];
        }
    });
}); });
exports["default"] = groupEquipRouter;
//# sourceMappingURL=groupEquipRouter.js.map