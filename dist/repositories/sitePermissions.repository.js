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
var createUpdateQueryPGSQL_1 = require("../utils/createUpdateQueryPGSQL");
var pgdb_1 = require("../databases/postgreSQL/pgdb");
var SitePermissionsRepo = /** @class */ (function () {
    function SitePermissionsRepo() {
    }
    // ROLE Management
    SitePermissionsRepo.create_new_role = function (siteRoleData) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("INSERT INTO siteroles\n                    (name) \n                VALUES ($1) \n                RETURNING id, name", [
                                siteRoleData.name
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_1 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create new site role - ".concat(error_1), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    SitePermissionsRepo.fetch_role_by_role_id = function (siteRoleID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT id, \n                        name\n                  FROM siteroles\n                  WHERE id = $1", [siteRoleID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_2 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate site role - ".concat(error_2), 500);
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    SitePermissionsRepo.fetch_role_by_role_name = function (siteRoleName) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT id, \n                        name\n                  FROM siteroles\n                  WHERE name = $1", [siteRoleName])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_3 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate site role - ".concat(error_3), 500);
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    SitePermissionsRepo.update_role_by_role_id = function (siteRoleID, siteRoleData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, values, result, rval, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = (0, createUpdateQueryPGSQL_1["default"])("siteroles", siteRoleData, "id", siteRoleID), query = _a.query, values = _a.values;
                        return [4 /*yield*/, pgdb_1["default"].query(query, values)];
                    case 1:
                        result = _b.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_4 = _b.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to update site role - ".concat(error_4), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    SitePermissionsRepo.delete_role_by_role_id = function (siteRoleID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM siteroles\n                WHERE id = $1\n                RETURNING id", [siteRoleID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_5 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete site role - ".concat(error_5), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    // User Role Management
    SitePermissionsRepo.create_user_site_role = function (userID, siteRoleID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("INSERT INTO user_siteroles\n                    (user_id, siterole_id) \n                VALUES ($1, $2) \n                RETURNING user_id, siterole_id", [
                                userID, siteRoleID
                            ])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                    case 2:
                        error_6 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to assign user site role - ".concat(error_6), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    SitePermissionsRepo.delete_user_site_roles_all = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM user_siteroles\n                WHERE user_id = $1", [userID])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_7 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete user site roles - ".concat(error_7), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    SitePermissionsRepo.delete_user_site_role_by_role_id = function (userID, roleID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM user_siteroles\n                WHERE user_id = $1 AND site_roleid = $2", [userID, roleID])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_8 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete user site roles - ".concat(error_8), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    SitePermissionsRepo.fetch_roles_by_user_id = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT users.id AS user_id,\n                        users.username AS username,\n                        siteroles.id AS role_id, \n                        siteroles.name AS role_name\n                    FROM users\n                    LEFT JOIN user_siteroles \n                        ON users.id = user_siteroles.user_id\n                    LEFT JOIN siteroles\n                        ON user_siteroles.role_id = siteroles.id\n                    WHERE user_id = $1", [userID])];
                    case 1:
                        result = _a.sent();
                        // const rval: Array<siteRoleProps> | undefined = result.rows;
                        return [2 /*return*/, result.rows];
                    case 2:
                        error_9 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to get site roles for the target user - ".concat(error_9), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    SitePermissionsRepo.fetch_permissions_by_user_id = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT DISTINCT\n                        permissiontypes.id AS permission_id,\n                        permissiontypes.name AS permission_name\n                    FROM permissiontypes\n                    LEFT JOIN siterole_permissiontypes\n                        ON siterole_permissiontypes.permission_id = permissiontypes.id\n                    LEFT JOIN user_siteroles\n                        ON user_siteroles.siterole_id = siterole_permissiontypes.siterole_id\n                    WHERE user_siteroles.user_id = $1", [userID])];
                    case 1:
                        result = _a.sent();
                        // const rval: Array<siteRoleProps> | undefined = result.rows;
                        return [2 /*return*/, result.rows];
                    case 2:
                        error_10 = _a.sent();
                        // console.log(error);
                        throw new expresError_1["default"]("An Error Occured: Unable to get site permissions for the target user - ".concat(error_10), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    // PERMISSIONS Management
    SitePermissionsRepo.create_new_permission = function (sitePermData) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("INSERT INTO permissiontypes\n                    (name) \n                VALUES ($1) \n                RETURNING id, name", [
                                sitePermData.name,
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_11 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create new site permission - ".concat(error_11), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    SitePermissionsRepo.fetch_permission_by_permission_id = function (sitePermID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT id, \n                        name\n                  FROM permissiontypes\n                  WHERE id = $1", [sitePermID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_12 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate site permission - ".concat(error_12), 500);
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    SitePermissionsRepo.update_permission_by_permission_id = function (sitePermID, sitePermData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, values, result, rval, error_13;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = (0, createUpdateQueryPGSQL_1["default"])("permissiontypes", sitePermData, "id", sitePermID), query = _a.query, values = _a.values;
                        return [4 /*yield*/, pgdb_1["default"].query(query, values)];
                    case 1:
                        result = _b.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_13 = _b.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to update site permission - ".concat(error_13), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    SitePermissionsRepo.delete_permission_by_permission_id = function (sitePermID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM permissiontypes\n                WHERE id = $1\n                RETURNING id", [sitePermID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_14 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete site permission - ".concat(error_14), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    // ROLE PERMISSIONS ASSOCIATIONS Management
    SitePermissionsRepo.create_role_permissions = function (siteRoleID, permissionList) {
        return __awaiter(this, void 0, void 0, function () {
            var valueExpressions, queryValues, _i, permissionList_1, permission, valueExpressionRows, result, rval, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        valueExpressions = [];
                        queryValues = [siteRoleID];
                        for (_i = 0, permissionList_1 = permissionList; _i < permissionList_1.length; _i++) {
                            permission = permissionList_1[_i];
                            if (permission) {
                                queryValues.push(permission);
                                valueExpressions.push("($1, $".concat(queryValues.length, ")"));
                            }
                        }
                        valueExpressionRows = valueExpressions.join(",");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, pgdb_1["default"].query("\n                INSERT INTO siterole_permissiontypes\n                    (role_id, permission_id)\n                VALUES\n                    ".concat(valueExpressionRows, "\n                RETURNING role_id, permission_id"), queryValues)];
                    case 2:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 3:
                        error_15 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create new site role permission(s) - ".concat(error_15), 500);
                    case 4:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    SitePermissionsRepo.fetch_role_permissions_by_role_id = function (siteRoleID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT siteroles.id AS role_id,\n                        siteroles.name AS role_name,\n                        permissiontypes.id AS permission_id,\n                        permissiontypes.name AS permission_name\n                  FROM siteroles\n                  LEFT JOIN siterole_permissiontypes AS joinTable\n                  ON siteroles.id = siterole_permissiontypes.role_id\n                  LEFT JOIN permissiontypes\n                  ON joinTable.permission_id = permissiontypes.id\n                  WHERE role_id = $1", [siteRoleID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_16 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate site role permissions - ".concat(error_16), 500);
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    SitePermissionsRepo.delete_role_permissions_by_role_permission_ids = function (siteRoleID, sitePermID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM siterole_permissiontypes\n                WHERE role_id = $1 AND permission_id = $2\n                RETURNING role_id", [siteRoleID, sitePermID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_17 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete site role permission - ".concat(error_17), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    return SitePermissionsRepo;
}());
exports["default"] = SitePermissionsRepo;
//# sourceMappingURL=sitePermissions.repository.js.map