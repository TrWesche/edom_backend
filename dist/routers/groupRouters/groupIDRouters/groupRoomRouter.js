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
var roomModel_1 = require("../../../models/roomModel");
var equipModel_1 = require("../../../models/equipModel");
// Middleware Imports
var authorizationMW_1 = require("../../../middleware/authorizationMW");
var groupRoomRouter = express.Router();
/* ____ ____  _____    _  _____ _____
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|
 | |___|  _ <| |___ / ___ \| | | |___
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 01/19/2022
// Create Room
// groupRoomRouter.post("/", authMW.defineGroupPermissions(["read_room", "create_room"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         console.log("Start Create Group Room");
//         // Preflight
//         const reqValues: GroupRoomCreateProps = {
//             name: req.body.name,
//             category_id: req.body.category_id,
//             headline: req.body.headline,
//             description: req.body.description,
//             public: req.body.public
//         };
//         if (!req.user?.id || !req.groupID) {
//             throw new ExpressError(`Must be logged in to create rooms / Missing Group Definition`, 400);
//         };
//         if(!validateGroupRoomCreateSchema(reqValues)) {
//             throw new ExpressError(`Unable to Create Group Room: ${validateGroupRoomCreateSchema.errors}`, 400);
//         };
//         // Processing
//         const queryData = await RoomModel.create_group_room(req.groupID, reqValues);
//         if (!queryData) {
//             throw new ExpressError("Create Room Failed", 500);
//         };
//         return res.json({rooms: [queryData]});
//     } catch (error) {
//         next(error);
//     };
// });
/* ____  _____    _    ____
  |  _ \| ____|  / \  |  _ \
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/
*/
// Manual Test - Basic Functionality: 01/19/2022
// Get Room List
groupRoomRouter.get("/list", authorizationMW_1["default"].defineGroupPermissions(["read_room"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID) {
                    throw new expresError_1["default"]("Invalid Call: Get Group Rooms - All", 401);
                }
                ;
                return [4 /*yield*/, roomModel_1["default"].retrieve_group_rooms_by_group_id_all(req.groupID)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Equipment Not Found: Get Group Rooms - All", 404);
                }
                ;
                return [2 /*return*/, res.json({ rooms: queryData })];
            case 2:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Manual Test - Basic Functionality: 01/19/2022
// Get List of Equipment Assigned to a Particular Room
groupRoomRouter.get("/:roomID/equips", authorizationMW_1["default"].defineGroupPermissions(["read_room", "read_equip"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, equipModel_1["default"].retrieve_room_equip_by_room_id(req.params.roomID)];
            case 1:
                queryData = _a.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Room Not Found.", 404);
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
// Manual Test - Basic Functionality: 01/19/2022
// Get Details of an Individual Room
// groupRoomRouter.get("/:roomID", authMW.defineGroupPermissions(["read_room"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         const queryData = await RoomModel.retrieve_room_by_room_id(req.params.roomID);
//         if (!queryData) {
//             throw new ExpressError("Room Not Found.", 404);
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
// Manual Test - Basic Functionality: 01/19/2022
// Update Details of an Individual Room
// groupRoomRouter.patch("/:roomID", authMW.defineGroupPermissions(["read_room", "update_room"]), authMW.validatePermissions, async (req, res, next) => {
//     try {
//         // Preflight
//         const prevValues = await RoomModel.retrieve_room_by_room_id(req.params.roomID, "elevated");
//         if (!prevValues) {
//             throw new ExpressError(`Update Failed: Room Not Found`, 404);
//         };
//         const updateValues: GroupRoomUpdateProps = {
//             name: req.body.name,
//             category_id: req.body.category_id,
//             headline: req.body.headline,
//             description: req.body.description,
//             public: req.body.public
//         };
//         if(!validateGroupRoomUpdateSchema(updateValues)) {
//             throw new ExpressError(`Update Error: ${validateGroupRoomUpdateSchema.errors}`, 400);
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
//         const newData = await RoomModel.modify_group_room(req.params.roomID, itemsList);
//         return res.json({rooms: [newData]})
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
// Manual Test - Basic Functionality: 01/19/2022
// Delete an Individual Room
groupRoomRouter["delete"]("/:roomID", authorizationMW_1["default"].defineGroupPermissions(["read_room", "delete_room"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData;
    var _a;
    return __generator(this, function (_b) {
        try {
            // Preflight
            if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID) {
                throw new expresError_1["default"]("Must be logged in to create rooms / Missing Group Definition", 400);
            }
            ;
            queryData = roomModel_1["default"].delete_group_room(req.groupID, req.params.roomID);
            if (!queryData) {
                throw new expresError_1["default"]("Unable to delete target room", 404);
            }
            return [2 /*return*/, res.json({ message: "Room deleted." })];
        }
        catch (error) {
            return [2 /*return*/, next(error)];
        }
        return [2 /*return*/];
    });
}); });
exports["default"] = groupRoomRouter;
//# sourceMappingURL=groupRoomRouter.js.map