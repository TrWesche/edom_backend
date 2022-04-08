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
;
var GroupPermissionsRepo = /** @class */ (function () {
    function GroupPermissionsRepo() {
    }
    // ROLE Management
    GroupPermissionsRepo.create_role = function (groupRoleData) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("INSERT INTO grouproles\n                    (name, group_id) \n                VALUES ($1, $2) \n                RETURNING id, name, group_id", [
                                groupRoleData.name,
                                groupRoleData.group_id
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_1 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create new group role - ".concat(error_1), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.create_roles_init_new_group = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var newGroupRoles, queryColumns, queryColIdxs_1, queryParams_1, idx_1, query, result, rval, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        newGroupRoles = ["owner", "admin", "manage_room", "manage_equip", "user"];
                        queryColumns = ["name", "group_id"];
                        queryColIdxs_1 = [];
                        queryParams_1 = [];
                        idx_1 = 1;
                        newGroupRoles.forEach(function (val) {
                            queryColIdxs_1.push("($".concat(idx_1, ", $").concat(idx_1 + 1, ")"));
                            queryParams_1.push(val, groupID);
                            idx_1 += 2;
                        });
                        query = "\n                INSERT INTO grouproles \n                    (".concat(queryColumns.join(","), ") \n                VALUES ").concat(queryColIdxs_1.join(","), " \n                RETURNING id, name, group_id");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_1)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_2 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create roles for new group - ".concat(error_2), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.fetch_roles_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT id, \n                        name,\n                        group_id \n                  FROM grouproles\n                  WHERE group_id = $1", [groupID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_3 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to get roles for the target group - ".concat(error_3), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.fetch_permissions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT id, \n                        name\n                  FROM permissiontypes", [])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_4 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to get group permissions - ".concat(error_4), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.fetch_role_by_role_id = function (groupRoleID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT id, \n                        name,\n                        group_id\n                  FROM groupRoles\n                  WHERE id = $1", [groupRoleID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_5 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate group role - ".concat(error_5), 500);
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.fetch_roles_by_gid_role_name = function (groupID, roleNames) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_2, idxParams_1, query, queryParams_2, result, rval, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_2 = 2;
                        idxParams_1 = [];
                        query = void 0;
                        queryParams_2 = [groupID];
                        roleNames.forEach(function (val) {
                            if (val) {
                                queryParams_2.push(val);
                                idxParams_1.push("$".concat(idx_2));
                                idx_2++;
                            }
                            ;
                        });
                        query = "\n                SELECT\n                    id, \n                    name\n                FROM grouproles\n                WHERE group_id = $1 AND name IN (".concat(idxParams_1.join(', '), ")\n            ");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_2)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_6 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate group role - ".concat(error_6), 500);
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.update_role_by_role_id = function (groupRoleID, groupRoleData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, values, result, rval, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = (0, createUpdateQueryPGSQL_1["default"])("grouproles", groupRoleData, "id", groupRoleID), query = _a.query, values = _a.values;
                        return [4 /*yield*/, pgdb_1["default"].query(query, values)];
                    case 1:
                        result = _b.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_7 = _b.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to update group role - ".concat(error_7), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.delete_role_by_role_id = function (groupRoleID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM grouproles\n                WHERE id = $1\n                RETURNING id", [groupRoleID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_8 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete group role - ".concat(error_8), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.delete_role_permissions_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_3, idxParams_2, query, queryParams_3, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_3 = 1;
                        idxParams_2 = [];
                        query = void 0;
                        queryParams_3 = [];
                        groupID.forEach(function (val) {
                            if (val.id) {
                                queryParams_3.push(val.id);
                                idxParams_2.push("$".concat(idx_3));
                                idx_3++;
                            }
                            ;
                        });
                        query = "\n                DELETE FROM grouproles_permissiontypes\n                WHERE grouproles_permissiontypes.grouprole_id IN (\n                    SELECT grouproles.id FROM grouproles\n                    WHERE grouproles.group_id IN (".concat(idxParams_2.join(', '), ")\n                )");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_3)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_9 = _a.sent();
                        throw new expresError_1["default"]("Server Error - delete_role_permissions_by_group_id - ".concat(error_9), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.delete_roles_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_4, idxParams_3, query, queryParams_4, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_4 = 1;
                        idxParams_3 = [];
                        query = void 0;
                        queryParams_4 = [];
                        groupID.forEach(function (val) {
                            if (val.id) {
                                queryParams_4.push(val.id);
                                idxParams_3.push("$".concat(idx_4));
                                idx_4++;
                            }
                            ;
                        });
                        query = "\n                DELETE FROM grouproles\n                WHERE grouproles.group_id IN (".concat(idxParams_3.join(', '), ")");
                        console.log(query);
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_4)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_10 = _a.sent();
                        throw new expresError_1["default"]("Server Error - delete_roles_by_group_id - ".concat(error_10), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    // PERMISSIONS Management
    GroupPermissionsRepo.create_permission = function (groupPermData) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("INSERT INTO permissiontypes\n                    (name) \n                VALUES ($1) \n                RETURNING id, name", [
                                groupPermData.name,
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_11 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create new group permission - ".concat(error_11), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.fetch_permission_by_permission_id = function (groupPermID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT id, \n                        name\n                FROM permissiontypes\n                WHERE id = $1", [groupPermID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_12 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate group permission - ".concat(error_12), 500);
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.update_permission_by_permission_id = function (groupPermID, groupPermData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, values, result, rval, error_13;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = (0, createUpdateQueryPGSQL_1["default"])("permissiontypes", groupPermData, "id", groupPermID), query = _a.query, values = _a.values;
                        return [4 /*yield*/, pgdb_1["default"].query(query, values)];
                    case 1:
                        result = _b.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_13 = _b.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to update group permission - ".concat(error_13), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.delete_permission_by_permission_id = function (groupPermID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM permissiontypes\n                WHERE id = $1\n                RETURNING id", [groupPermID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_14 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete group permission - ".concat(error_14), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    // ROLE PERMISSIONS ASSOCIATIONS Management
    GroupPermissionsRepo.create_role_permissions = function (permissionList) {
        return __awaiter(this, void 0, void 0, function () {
            var valueExpressions, queryValues, _i, permissionList_1, permission, valueExpressionRows, result, rval, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        valueExpressions = [];
                        queryValues = [permissionList[0].grouprole_id];
                        for (_i = 0, permissionList_1 = permissionList; _i < permissionList_1.length; _i++) {
                            permission = permissionList_1[_i];
                            if (permission.grouppermission_id) {
                                queryValues.push(permission.grouppermission_id);
                                valueExpressions.push("($1, $".concat(queryValues.length, ")"));
                            }
                        }
                        valueExpressionRows = valueExpressions.join(",");
                        console.log(valueExpressionRows);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, pgdb_1["default"].query("\n                INSERT INTO grouproles_permissiontypes\n                    (grouprole_id, permission_id)\n                VALUES\n                    ".concat(valueExpressionRows, "\n                RETURNING grouprole_id, permission_id"), queryValues)];
                    case 2:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 3:
                        error_15 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create new group role permission(s) - ".concat(error_15), 500);
                    case 4:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.create_role_permissions_for_new_group = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var newGroupPermissions, queryColumns, queryColIdxs_2, queryParams_5, idx_5, _loop_1, key, query, result, rval, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        newGroupPermissions = {
                            owner: [
                                'group_read_group', 'group_update_group', 'group_delete_group',
                                'group_create_role', 'group_read_role', 'group_update_role', 'group_delete_role',
                                'group_read_group_permissions',
                                'group_create_role_permissions', 'group_read_role_permissions', 'group_delete_role_permissions',
                                'group_create_user_role', 'group_read_user_role', 'group_delete_user_role',
                                'group_create_group_user', 'group_read_group_user', 'group_delete_group_user',
                                'group_create_equip', 'group_read_equip', 'group_update_equip', 'group_delete_equip',
                                'group_create_room', 'group_read_room', 'group_update_room', 'group_delete_room'
                            ],
                            admin: [
                                'group_read_role',
                                'group_create_user_role', 'group_read_user_role', 'group_delete_user_role',
                                'group_create_group_user', 'group_read_group_user', 'group_delete_group_user',
                                'group_create_equip', 'group_read_equip', 'group_update_equip', 'group_delete_equip',
                                'group_create_room', 'group_read_room', 'group_update_room', 'group_delete_room'
                            ],
                            manage_room: [
                                'group_create_room', 'group_read_room', 'group_update_room', 'group_delete_room'
                            ],
                            manage_equip: [
                                'group_create_equip', 'group_read_equip', 'group_update_equip', 'group_delete_equip'
                            ],
                            user: [
                                'group_read_group', 'group_read_group_user', 'group_read_equip', 'group_read_room'
                            ]
                        };
                        queryColumns = ["grouprole_id", "permission_id"];
                        queryColIdxs_2 = [];
                        queryParams_5 = [];
                        idx_5 = 1;
                        _loop_1 = function (key) {
                            newGroupPermissions[key].forEach(function (element) {
                                queryColIdxs_2.push("\n                    ( (SELECT get_group_role_uuid($".concat(idx_5, ", $").concat(idx_5 + 1, ")), (SELECT get_permission_uuid($").concat(idx_5 + 2, ")) )"));
                                queryParams_5.push(key, groupID, element);
                                idx_5 += 3;
                            });
                        };
                        // If this works its super inefficient and should be replaced at some point
                        for (key in newGroupPermissions) {
                            _loop_1(key);
                        }
                        ;
                        query = "\n                INSERT INTO grouproles_permissiontypes\n                    (".concat(queryColumns.join(","), ") \n                VALUES ").concat(queryColIdxs_2.join(","), " \n                RETURNING grouprole_id, permission_id");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_5)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_16 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create role permissions for new group - ".concat(error_16), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.fetch_role_permissions_by_role_id = function (groupID, roleID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT grouproles.id AS role_id,\n                        grouproles.name AS role_name,\n                        permissiontypes.id AS permission_id,\n                        permissiontypes.name AS permission_name\n                FROM grouproles\n                LEFT JOIN grouproles_permissiontypes\n                ON grouproles.id = grouproles_permissiontypes.grouprole_id\n                LEFT JOIN permissiontypes\n                ON grouproles_permissiontypes.permission_id = permissiontypes.id\n                WHERE grouproles.group_id = $1 AND grouprole_id = $2", [groupID, roleID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_17 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate group role permissions - ".concat(error_17), 500);
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.delete_role_permission_by_role_permission_id = function (groupRoleID, groupPermID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM grouproles_permissiontypes\n                WHERE grouprole_id = $1 AND grouppermission_id = $2\n                RETURNING grouprole_id", [groupRoleID, groupPermID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_18 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete group role permission - ".concat(error_18), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.delete_role_permissions_by_role_id = function (groupRoleID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM grouproles_permissiontypes\n                WHERE grouprole_id = $1\n                RETURNING grouprole_id", [groupRoleID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_19 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete group role permission - ".concat(error_19), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    // static async delete_role_permissions_by_group_id(groupID: string) {
    //     try {
    //         const result = await pgdb.query(
    //             `DELETE FROM grouproles_grouppermissions
    //             WHERE grouprole_id IN 
    //             (
    //                 SELECT grouproles.id FROM grouproles
    //                 WHERE grouproles.group_id = $1
    //             )
    //             RETURNING grouprole_id`,
    //             [groupID]
    //         ); 
    //         const rval: GroupRolePermsProps | undefined = result.rows[0];
    //         return rval;    
    //     } catch (error) {
    //         throw new ExpressError(`An Error Occured: Unable to delete group role permission - ${error.message}`, 500);
    //     }   
    // };
    // User Role Management
    GroupPermissionsRepo.create_user_group_role_by_role_id = function (userIDs, roleIDs) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_6, idxParams_4, query, queryParams_6, result, rVal, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_6 = 1;
                        idxParams_4 = [];
                        query = void 0;
                        queryParams_6 = [];
                        userIDs.forEach(function (userID) {
                            if (userID) {
                                roleIDs.forEach(function (roleID) {
                                    if (roleID.id) {
                                        queryParams_6.push(userID, roleID.id);
                                        idxParams_4.push("($".concat(idx_6, ", $").concat(idx_6 + 1, ")"));
                                        idx_6 += 2;
                                    }
                                });
                            }
                            ;
                        });
                        query = "\n                INSERT INTO user_grouproles \n                    (user_id, grouprole_id) \n                VALUES ".concat(idxParams_4.join(', '), "\n                RETURNING user_id, grouprole_id");
                        console.log(query);
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_6)];
                    case 1:
                        result = _a.sent();
                        rVal = result.rows;
                        return [2 /*return*/, rVal];
                    case 2:
                        error_20 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to assign user group role - ".concat(error_20), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.delete_user_group_roles_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM user_grouproles\n                WHERE grouprole_id IN (\n                    SELECT id FROM grouproles WHERE group_id = $1\n                )", [groupID])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_21 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete user group roles - ".concat(error_21), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.delete_user_group_roles_by_user_id = function (userIDs) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_7, idxParams_5, query, queryParams_7, result, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_7 = 1;
                        idxParams_5 = [];
                        query = void 0;
                        queryParams_7 = [];
                        userIDs.forEach(function (val) {
                            if (val) {
                                queryParams_7.push(val);
                                idxParams_5.push("$".concat(idx_7));
                                idx_7++;
                            }
                            ;
                        });
                        query = "\n                DELETE FROM user_grouproles\n                WHERE user_id IN (".concat(idxParams_5.join(', '), ")\n            ");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_7)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_22 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete user group roles - ".concat(error_22), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.delete_user_group_role_by_role_id = function (userIDs, roleIDs) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_8, idxParams_6, query, queryParams_8, result, rVal, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_8 = 1;
                        idxParams_6 = [];
                        query = void 0;
                        queryParams_8 = [];
                        userIDs.forEach(function (userID) {
                            if (userID) {
                                roleIDs.forEach(function (roleID) {
                                    if (roleID.id) {
                                        queryParams_8.push(userID, roleID.id);
                                        idxParams_6.push("(user_id = $".concat(idx_8, " AND grouprole_id = $").concat(idx_8 + 1, ")"));
                                        idx_8 += 2;
                                    }
                                });
                            }
                            ;
                        });
                        query = "\n                DELETE FROM user_grouproles\n                WHERE ".concat(idxParams_6.join(' OR '), "\n                RETURNING user_id, grouprole_id");
                        console.log(query);
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_8)];
                    case 1:
                        result = _a.sent();
                        rVal = result.rows;
                        return [2 /*return*/, rVal];
                    case 2:
                        error_23 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete user group role - ".concat(error_23), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.delete_user_group_roles_by_role_id = function (roleID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM user_grouproles\n                WHERE grouprole_id = $1\n                RETURNING user_id, grouprole_id", [roleID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_24 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete user role associations - ".concat(error_24), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.fetch_user_group_roles_by_user_id = function (userID, groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT userprofile.user_id AS user_id,\n                        userprofile.username AS username,\n                        grouproles.id AS role_id, \n                        grouproles.name AS role_name\n                    FROM userprofile\n                    LEFT JOIN user_grouproles \n                        ON userprofile.user_id = user_grouproles.user_id\n                    LEFT JOIN groupRoles\n                        ON user_grouproles.grouprole_id = grouproles.id\n                    WHERE userprofile.user_id = $1 AND grouproles.group_id = $2", [userID, groupID])];
                    case 1:
                        result = _a.sent();
                        // const rval: Array<siteRoleProps> | undefined = result.rows;
                        return [2 /*return*/, result.rows];
                    case 2:
                        error_25 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to get site group for the target user - ".concat(error_25), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupPermissionsRepo.fetch_user_group_permissions_by_user_id = function (userID, groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT DISTINCT\n                        permissiontypes.id AS permission_id,\n                        permissiontypes.name AS permission_name\n                    FROM permissiontypes\n                    LEFT JOIN grouproles_permissiontypes\n                        ON grouproles_permissiontypes.permission_id = permissiontypes.id\n                    LEFT JOIN grouproles\n                        ON grouproles.id = grouproles_permissiontypes.grouprole_id\n                    LEFT JOIN user_grouproles\n                        ON user_grouproles.grouprole_id = grouproles_permissiontypes.grouprole_id\n                    WHERE user_grouproles.user_id = $1 AND grouproles.group_id = $2", [userID, groupID])];
                    case 1:
                        result = _a.sent();
                        // const rval: Array<siteRoleProps> | undefined = result.rows;
                        return [2 /*return*/, result.rows];
                    case 2:
                        error_26 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to get site roles for the target user - ".concat(error_26), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    return GroupPermissionsRepo;
}());
exports["default"] = GroupPermissionsRepo;
//# sourceMappingURL=groupPermissions.repository.js.map