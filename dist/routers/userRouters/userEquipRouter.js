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
// Middleware Imports
var authorizationMW_1 = require("../../middleware/authorizationMW");
var userEquipRouter = express.Router();
// Manual Test - Basic Functionality: 01/20/2022
userEquipRouter.post("/:equipID/rooms", authorizationMW_1["default"].defineSitePermissions(["read_equip_self", "update_equip_self", "update_room_self"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var equipCheck, queryData, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
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
                return [4 /*yield*/, equipModel_1["default"].create_equip_room_association(req.body.roomID, req.params.equipID)];
            case 2:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Assoicate Equipment to Room Failed", 500);
                }
                ;
                return [2 /*return*/, res.json({ roomEquip: [queryData] })];
            case 3:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Manual Test - Basic Functionality: 01/19/2022
userEquipRouter["delete"]("/:equipID/rooms", authorizationMW_1["default"].defineSitePermissions(["read_equip_self", "update_equip_self", "update_room_self"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var equipCheck, queryData, error_2;
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
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// export default userEquipRouter;
//# sourceMappingURL=userEquipRouter.js.map