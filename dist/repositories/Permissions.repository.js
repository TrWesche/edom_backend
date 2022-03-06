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
    // static async fetch_site_permissions(userID: string, permList: Array<string>) {
    //     try {
    //         const filterList = permList.join(",");
    //         // ,
    //         // user_siteroles.user_id AS user_id
    //         const result = await pgdb.query(
    //             `SELECT DISTINCT
    //                 sitepermissions.name AS permissions_name
    //             FROM users
    //             LEFT JOIN user_siteroles ON user_siteroles.user_id = users.id 
    //             LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
    //             LEFT JOIN siterole_sitepermissions ON siterole_sitepermissions.siterole_id = user_siteroles.siterole_id 
    //             LEFT JOIN sitepermissions ON sitepermissions.id = siterole_sitepermissions.sitepermission_id 
    //             WHERE users.id = $1 AND sitepermissions.name IN ($2)
    //             `,
    //                 [userID, filterList]
    //         );
    //         return result.rows;
    //     } catch (error) {
    //         // console.log(error);
    //         throw new ExpressError(`An Error Occured: Unable to get user group permissions for the target equip - ${error}`, 500);
    //     }  
    // };
    // static async fetch_group_permissions(userID: string, groupID: string, permList: Array<string>) {
    //     try {
    //         const filterList = permList.join(",");
    //         // ,
    //         //         user_grouproles.user_id AS user_id,
    //         //         groups.id AS group_id
    //         const result = await pgdb.query(
    //             `SELECT DISTINCT
    //                 grouppermissions.name AS permissions_name
    //             FROM groups
    //             LEFT JOIN grouproles ON grouproles.group_id = groups.id 
    //             LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles.id
    //             LEFT JOIN users ON users.id = user_grouproles.user_id
    //             LEFT JOIN grouproles_grouppermissions ON grouproles_grouppermissions.grouprole_id = user_grouproles.grouprole_id 
    //             LEFT JOIN grouppermissions ON grouppermissions.id = grouproles_grouppermissions.grouppermission_id
    //             WHERE users.id = $1 AND groups.id = $2 AND grouppermissions.name IN ($3)            
    //             `,
    //                 [userID, groupID, filterList]
    //         );
    //         return result.rows;
    //     } catch (error) {
    //         // console.log(error);
    //         throw new ExpressError(`An Error Occured: Unable to get user group permissions for the target equip - ${error}`, 500);
    //     }  
    // };
    // static async fetch_equip_permissions_group(userID: string, equipID: string, permList: Array<string>) {
    //     try {
    //         const filterList = permList.join(",");
    //         // ,
    //         //         user_grouproles.user_id AS user_id,
    //         //         groups.id AS group_id,
    //         //         equipment.id AS equipment_id
    //         const result = await pgdb.query(
    //             `SELECT DISTINCT
    //                 grouppermissions.name AS permissions_name
    //             FROM equipment
    //             LEFT JOIN group_equipment ON group_equipment.equip_id = equipment.id -- I want the group that is associated with this piece of equipment
    //             LEFT JOIN groups ON groups.id = group_equipment.group_id -- So I can determine
    //             LEFT JOIN grouproles ON grouproles.group_id = groups.id -- The role identifiers for that group
    //             LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles.id -- And determine which the user has
    //             LEFT JOIN users ON users.id = user_grouproles.user_id
    //             LEFT JOIN grouproles_grouppermissions ON grouproles_grouppermissions.grouprole_id = user_grouproles.grouprole_id -- Such that when I filter
    //             LEFT JOIN grouppermissions ON grouppermissions.id = grouproles_grouppermissions.grouppermission_id -- I only see what the user has for the target equip
    //             WHERE users.id = $1 AND equipment.id = $2 AND grouppermissions.name IN ($3)
    //             `,
    //                 [userID, equipID, filterList]
    //         );
    //         return result.rows;
    //     } catch (error) {
    //         // console.log(error);
    //         throw new ExpressError(`An Error Occured: Unable to get user group permissions for the target equip - ${error}`, 500);
    //     }  
    // };
    // static async fetch_equip_permissions_user(userID: string, equipID: string, permList: Array<string>) {
    //     try {
    //         const filterList = permList.join(",");
    //         // ,
    //         // user_siteroles.user_id AS user_id,
    //         // equipment.id AS equipment_id
    //         const result = await pgdb.query(
    //             `SELECT DISTINCT
    //                 sitepermissions.name AS permissions_name
    //             FROM equipment
    //             LEFT JOIN user_equipment ON user_equipment.equip_id = equipment.id 
    //             LEFT JOIN users ON users.id = user_equipment.user_id
    //             LEFT JOIN user_siteroles ON user_siteroles.user_id = users.id 
    //             LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
    //             LEFT JOIN siterole_sitepermissions ON siterole_sitepermissions.siterole_id = user_siteroles.siterole_id 
    //             LEFT JOIN sitepermissions ON sitepermissions.id = siterole_sitepermissions.sitepermission_id 
    //             WHERE users.id = $1 AND equipment.id = $2 AND sitepermissions.name IN ($3)
    //             `,
    //                 [userID, equipID, filterList]
    //         );
    //         return result.rows;
    //     } catch (error) {
    //         // console.log(error);
    //         throw new ExpressError(`An Error Occured: Unable to get user permissions for the target equip - ${error}`, 500);
    //     }  
    // };
    PermissionsRepo.fetch_user_equip_permissions = function (userID, equipID, permissions) {
        return __awaiter(this, void 0, void 0, function () {
            var permListUser, permListGroup, permListPublic, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        permListUser = permissions.user ? permissions.user : ["NotApplicable"];
                        permListGroup = permissions.group ? permissions.group : ["NotApplicable"];
                        permListPublic = permissions.public ? permissions.public : ["NotApplicable"];
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT * FROM retrieve_user_auth_for_equipment($1, $2, $3, $4, $5)", [userID, equipID, permListGroup, permListUser, permListPublic])
                            // const result = await pgdb.query(
                            //         `SELECT DISTINCT
                            //             grouppermissions.name AS permissions_name
                            //         FROM equipment
                            //         LEFT JOIN group_equipment ON group_equipment.equip_id = equipment.id
                            //         LEFT JOIN groups ON groups.id = group_equipment.group_id
                            //         LEFT JOIN grouproles ON grouproles.group_id = groups.id
                            //         LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles.id
                            //         LEFT JOIN users ON users.id = user_grouproles.user_id
                            //         LEFT JOIN grouproles_grouppermissions ON grouproles_grouppermissions.grouprole_id = user_grouproles.grouprole_id
                            //         LEFT JOIN grouppermissions ON grouppermissions.id = grouproles_grouppermissions.grouppermission_id
                            //         WHERE users.id = $1 AND equipment.id = $2 AND grouppermissions.name IN ($3)
                            //         UNION
                            //         SELECT DISTINCT
                            //             sitepermissions.name AS permissions_name
                            //         FROM equipment
                            //         LEFT JOIN user_equipment ON user_equipment.equip_id = equipment.id 
                            //         LEFT JOIN users ON users.id = user_equipment.user_id
                            //         LEFT JOIN user_siteroles ON user_siteroles.user_id = users.id 
                            //         LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
                            //         LEFT JOIN siterole_sitepermissions ON siterole_sitepermissions.siterole_id = user_siteroles.siterole_id 
                            //         LEFT JOIN sitepermissions ON sitepermissions.id = siterole_sitepermissions.sitepermission_id 
                            //         WHERE users.id = $1 AND equipment.id = $2 AND sitepermissions.name IN ($4)
                            //     `,
                            //         [userID, equipID, permListGroup, permListUser]
                            // );
                        ];
                    case 1:
                        result = _a.sent();
                        // const result = await pgdb.query(
                        //         `SELECT DISTINCT
                        //             grouppermissions.name AS permissions_name
                        //         FROM equipment
                        //         LEFT JOIN group_equipment ON group_equipment.equip_id = equipment.id
                        //         LEFT JOIN groups ON groups.id = group_equipment.group_id
                        //         LEFT JOIN grouproles ON grouproles.group_id = groups.id
                        //         LEFT JOIN user_grouproles ON user_grouproles.grouprole_id = grouproles.id
                        //         LEFT JOIN users ON users.id = user_grouproles.user_id
                        //         LEFT JOIN grouproles_grouppermissions ON grouproles_grouppermissions.grouprole_id = user_grouproles.grouprole_id
                        //         LEFT JOIN grouppermissions ON grouppermissions.id = grouproles_grouppermissions.grouppermission_id
                        //         WHERE users.id = $1 AND equipment.id = $2 AND grouppermissions.name IN ($3)
                        //         UNION
                        //         SELECT DISTINCT
                        //             sitepermissions.name AS permissions_name
                        //         FROM equipment
                        //         LEFT JOIN user_equipment ON user_equipment.equip_id = equipment.id 
                        //         LEFT JOIN users ON users.id = user_equipment.user_id
                        //         LEFT JOIN user_siteroles ON user_siteroles.user_id = users.id 
                        //         LEFT JOIN siteroles ON siteroles.id = user_siteroles.siterole_id
                        //         LEFT JOIN siterole_sitepermissions ON siterole_sitepermissions.siterole_id = user_siteroles.siterole_id 
                        //         LEFT JOIN sitepermissions ON sitepermissions.id = siterole_sitepermissions.sitepermission_id 
                        //         WHERE users.id = $1 AND equipment.id = $2 AND sitepermissions.name IN ($4)
                        //     `,
                        //         [userID, equipID, permListGroup, permListUser]
                        // );
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
    PermissionsRepo.fetch_user_room_permissions = function (userID, equipID, permissions) {
        return __awaiter(this, void 0, void 0, function () {
            var permListUser, permListGroup, permListPublic, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        permListUser = permissions.user ? permissions.user : ["NotApplicable"];
                        permListGroup = permissions.group ? permissions.group : ["NotApplicable"];
                        permListPublic = permissions.public ? permissions.public : ["NotApplicable"];
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT * FROM retrieve_user_auth_for_room($1, $2, $3, $4, $5)", [userID, equipID, permListGroup, permListUser, permListPublic])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                    case 2:
                        error_3 = _a.sent();
                        // console.log(error);
                        throw new expresError_1["default"]("An Error Occured: Unable to get user permissions for the target room - ".concat(error_3), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    PermissionsRepo.fetch_user_group_permissions = function (userID, equipID, permissions) {
        return __awaiter(this, void 0, void 0, function () {
            var permListGroup, permListPublic, result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        permListGroup = permissions.group ? permissions.group : ["NotApplicable"];
                        permListPublic = permissions.public ? permissions.public : ["NotApplicable"];
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT * FROM retrieve_user_auth_for_group($1, $2, $3, $4,)", [userID, equipID, permListGroup, permListPublic])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                    case 2:
                        error_4 = _a.sent();
                        // console.log(error);
                        throw new expresError_1["default"]("An Error Occured: Unable to get user permissions for the target room - ".concat(error_4), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    return PermissionsRepo;
}());
exports["default"] = PermissionsRepo;
//# sourceMappingURL=permissions.repository.js.map