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
var expresError_1 = require("../utils/expresError");
var pgdb_1 = require("../databases/postgreSQL/pgdb");
var PermissionsRepo = /** @class */ (function () {
    function PermissionsRepo() {
    }
    PermissionsRepo.fetch_permissions_by_user_id = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT * FROM get_user_permissions($1)", [userID])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                    case 2:
                        error_1 = _a.sent();
                        // console.log(error);
                        throw new expresError_1["default"]("An Error Occured: Unable to get user permissions for the target user - ".concat(error_1), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    PermissionsRepo.fetch_group_permissions_by_userid_and_groupid = function (userID, groupID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    ;
    PermissionsRepo.fetch_equip_permissions_group = function (userID, equipID, permList) {
        return __awaiter(this, void 0, void 0, function () {
            var filterList, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        filterList = permList.join(",");
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT DISTINCT\n                    grouppermissions.name AS permissions_name\n                FROM equipment\n                LEFT JOIN group_equipment ON group_equipment.equip_id = equipment.id -- I want the group that is associated with this piece of equipment\n                LEFT JOIN groups ON groups.id = group_equipment.group_id -- So I can determine\n                LEFT JOIN grouproles ON grouproles.group_id = groups.id -- The role identifiers for that group\n                LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles.id -- And determine which the user has\n                LEFT JOIN users ON users.id = user_grouproles.user_id\n                LEFT JOIN grouproles_grouppermissions ON grouproles_grouppermissions.grouprole_id = user_grouproles.grouprole_id -- Such that when I filter\n                LEFT JOIN grouppermissions ON grouppermissions.id = grouproles_grouppermissions.grouppermission_id -- I only see what the user has for the target equip\n                WHERE users.id = $1 AND equipment.id = $2 AND grouppermissions.name IN ($3);", [userID, equipID, filterList])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                    case 2:
                        error_2 = _a.sent();
                        // console.log(error);
                        throw new expresError_1["default"]("An Error Occured: Unable to get user permissions for the target equip - ".concat(error_2), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    PermissionsRepo.fetch_equip_permissions_user = function (userID, equipID, permList) {
        return __awaiter(this, void 0, void 0, function () {
            var filterList, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        filterList = permList.join(",");
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT DISTINCT\n                    sitepermissions.name AS permissions_name\n                FROM equipment\n                LEFT JOIN user_equipment ON user_equipment.equip_id = equipment.id \n                LEFT JOIN users ON users.id = user_equipment.user_id\n                LEFT JOIN user_siteroles ON user_siteroles.user_id = users.id \n                LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id\n                LEFT JOIN siterole_sitepermissions ON siterole_sitepermissions.siterole_id = user_siteroles.siterole_id \n                LEFT JOIN sitepermissions ON sitepermissions.id = siterole_sitepermissions.sitepermission_id \n                WHERE users.id = $1 AND equipment.id = $2 AND sitepermissions.name IN ($3)", [userID, equipID, filterList])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                    case 2:
                        error_3 = _a.sent();
                        // console.log(error);
                        throw new expresError_1["default"]("An Error Occured: Unable to get user permissions for the target equip - ".concat(error_3), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    PermissionsRepo.fetch_room_permissions_by_userid_and_roomid = function (userID, roomID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    ;
    return PermissionsRepo;
}());
exports["default"] = PermissionsRepo;
//# sourceMappingURL=permissions.repository.js.map