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
// Repositories
var group_repository_1 = require("../repositories/group.repository");
var groupPermissions_repository_1 = require("../repositories/groupPermissions.repository");
// Utils
var expresError_1 = require("../utils/expresError");
var transactionRepository_1 = require("../repositories/transactionRepository");
var GroupModel = /** @class */ (function () {
    function GroupModel() {
    }
    /*    ____ ____  _____    _  _____ _____
         / ___|  _ \| ____|  / \|_   _| ____|
        | |   | |_) |  _|   / _ \ | | |  _|
        | |___|  _ <| |___ / ___ \| | | |___
         \____|_| \_\_____/_/   \_\_| |_____|
    */
    GroupModel.create_group = function (groupData) {
        return __awaiter(this, void 0, void 0, function () {
            var group;
            return __generator(this, function (_a) {
                group = group_repository_1["default"].create_new_group(groupData);
                // TODO: When creating a new group it should be immediately populated with default roles & permissions
                //       This may be a good place to use something like a stored procedure?
                return [2 /*return*/, group];
            });
        });
    };
    ;
    GroupModel.create_role = function (groupID, name) {
        return __awaiter(this, void 0, void 0, function () {
            var roleData, role;
            return __generator(this, function (_a) {
                roleData = {
                    group_id: groupID,
                    name: name
                };
                role = groupPermissions_repository_1["default"].create_new_role(roleData);
                return [2 /*return*/, role];
            });
        });
    };
    ;
    GroupModel.create_permission = function (groupID, name) {
        return __awaiter(this, void 0, void 0, function () {
            var permissionData, permission;
            return __generator(this, function (_a) {
                permissionData = {
                    id: groupID,
                    name: name
                };
                permission = groupPermissions_repository_1["default"].create_new_permission(permissionData);
                return [2 /*return*/, permission];
            });
        });
    };
    ;
    GroupModel.create_role_permissions = function (roleID, permissionIDs) {
        return __awaiter(this, void 0, void 0, function () {
            var rolePermissions, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 9]);
                        return [4 /*yield*/, transactionRepository_1["default"].begin_transaction()];
                    case 1:
                        _a.sent();
                        rolePermissions = void 0;
                        if (!(permissionIDs.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, groupPermissions_repository_1["default"].create_role_permissions(roleID, permissionIDs)];
                    case 2:
                        rolePermissions = _a.sent();
                        return [3 /*break*/, 4];
                    case 3: throw new expresError_1["default"]("Error encountered when creating new role permissions", 400);
                    case 4:
                        if (!(rolePermissions && rolePermissions.length > 0 && rolePermissions[0].permission_id)) return [3 /*break*/, 6];
                        return [4 /*yield*/, transactionRepository_1["default"].commit_transaction()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, rolePermissions];
                    case 7:
                        error_1 = _a.sent();
                        return [4 /*yield*/, transactionRepository_1["default"].rollback_transaction()];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    ;
    /*   ____  _____    _    ____
        |  _ \| ____|  / \  |  _ \
        | |_) |  _|   / _ \ | | | |
        |  _ <| |___ / ___ \| |_| |
        |_| \_\_____/_/   \_\____/
    */
    GroupModel.retrieve_group_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var group;
            return __generator(this, function (_a) {
                group = group_repository_1["default"].fetch_group_by_group_id(groupID);
                return [2 /*return*/, group];
            });
        });
    };
    ;
    GroupModel.retrieve_roles_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var roles;
            return __generator(this, function (_a) {
                roles = groupPermissions_repository_1["default"].fetch_role_by_role_id(groupID);
                return [2 /*return*/, roles];
            });
        });
    };
    ;
    GroupModel.retrieve_role_permissions_by_role_id = function (roleID) {
        return __awaiter(this, void 0, void 0, function () {
            var permissions;
            return __generator(this, function (_a) {
                permissions = groupPermissions_repository_1["default"].fetch_role_permissions_by_role_id(roleID);
                return [2 /*return*/, permissions];
            });
        });
    };
    ;
    GroupModel.retrieve_user_permissions_by_user_id = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var permissions;
            return __generator(this, function (_a) {
                permissions = groupPermissions_repository_1["default"].fetch_permissions_by_user_id(userID);
                return [2 /*return*/, permissions];
            });
        });
    };
    ;
    /*   _   _ ____  ____    _  _____ _____
        | | | |  _ \|  _ \  / \|_   _| ____|
        | | | | |_) | | | |/ _ \ | | |  _|
        | |_| |  __/| |_| / ___ \| | | |___
         \___/|_|   |____/_/   \_\_| |_____|
    */
    GroupModel.modify_group = function (groupID, groupData) {
        return __awaiter(this, void 0, void 0, function () {
            var group;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, group_repository_1["default"].update_group_by_group_id(groupID, groupData)];
                    case 1:
                        group = _a.sent();
                        if (!group) {
                            throw new expresError_1["default"]("Unable to update target group", 400);
                        }
                        ;
                        return [2 /*return*/, group];
                }
            });
        });
    };
    ;
    /*   ____  _____ _     _____ _____ _____
        |  _ \| ____| |   | ____|_   _| ____|
        | | | |  _| | |   |  _|   | | |  _|
        | |_| | |___| |___| |___  | | | |___
        |____/|_____|_____|_____| |_| |_____|
    */
    GroupModel.delete_group = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var group;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, group_repository_1["default"].delete_group_by_group_id(groupID)];
                    case 1:
                        group = _a.sent();
                        if (!group) {
                            throw new expresError_1["default"]("Unable to delete target group", 400);
                        }
                        ;
                        return [2 /*return*/, group];
                }
            });
        });
    };
    ;
    GroupModel.delete_role = function (roleID) {
        return __awaiter(this, void 0, void 0, function () {
            var role;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, groupPermissions_repository_1["default"].delete_role_by_role_id(roleID)];
                    case 1:
                        role = _a.sent();
                        if (!role) {
                            throw new expresError_1["default"]("Unable to delete target role", 400);
                        }
                        ;
                        return [2 /*return*/, role];
                }
            });
        });
    };
    ;
    GroupModel.delete_permission = function (permID) {
        return __awaiter(this, void 0, void 0, function () {
            var permission;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, groupPermissions_repository_1["default"].delete_permission_by_permission_id(permID)];
                    case 1:
                        permission = _a.sent();
                        if (!permission) {
                            throw new expresError_1["default"]("Unable to delete target permission", 400);
                        }
                        ;
                        return [2 /*return*/, permission];
                }
            });
        });
    };
    ;
    GroupModel.delete_role_pemission = function (roleID, permID) {
        return __awaiter(this, void 0, void 0, function () {
            var permission;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, groupPermissions_repository_1["default"].delete_role_permissions_by_role_permission_ids(roleID, permID)];
                    case 1:
                        permission = _a.sent();
                        if (!permission) {
                            throw new expresError_1["default"]("Unable to delete target role permission", 400);
                        }
                        ;
                        return [2 /*return*/, permission];
                }
            });
        });
    };
    ;
    return GroupModel;
}());
exports["default"] = GroupModel;
//# sourceMappingURL=groupModel.js.map