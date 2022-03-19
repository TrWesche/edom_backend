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
var equipment_repository_1 = require("../repositories/equipment.repository");
var room_repository_1 = require("../repositories/room.repository");
// TODO:  Alot of the queries in here would be better off to be written in stored procedures to minimize the amount of back and forth between
// the database server and the front end.
var GroupModel = /** @class */ (function () {
    function GroupModel() {
    }
    /*    ____ ____  _____    _  _____ _____
         / ___|  _ \| ____|  / \|_   _| ____|
        | |   | |_) |  _|   / _ \ | | |  _|
        | |___|  _ <| |___ / ___ \| | | |___
         \____|_| \_\_____/_/   \_\_| |_____|
    */
    GroupModel.create_group = function (data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var dbEntryProps, groupEntry, groupRoles, groupPermissions, ownerPermission, userGroup, userAssoc, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Preflight
                        if (!data.name) {
                            throw new expresError_1["default"]("Invalid Create Equipment Call", 400);
                        }
                        ;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 10, , 12]);
                        return [4 /*yield*/, transactionRepository_1["default"].begin_transaction()];
                    case 2:
                        _c.sent();
                        dbEntryProps = {
                            name: data.name,
                            headline: data.headline,
                            description: data.description,
                            image_url: data.image_url,
                            location: data.location,
                            public: data.public
                        };
                        return [4 /*yield*/, group_repository_1["default"].create_new_group(dbEntryProps)];
                    case 3:
                        groupEntry = _c.sent();
                        if (!(groupEntry === null || groupEntry === void 0 ? void 0 : groupEntry.id)) {
                            throw new expresError_1["default"]("Error while creating new group entry", 500);
                        }
                        ;
                        return [4 /*yield*/, groupPermissions_repository_1["default"].create_roles_init_new_group(groupEntry.id)];
                    case 4:
                        groupRoles = _c.sent();
                        if (!((_a = groupRoles[0]) === null || _a === void 0 ? void 0 : _a.id)) {
                            throw new expresError_1["default"]("Error while creating group role entries for new group", 500);
                        }
                        ;
                        return [4 /*yield*/, groupPermissions_repository_1["default"].create_role_permissions_for_new_group(groupEntry.id)];
                    case 5:
                        groupPermissions = _c.sent();
                        if (!((_b = groupPermissions[0]) === null || _b === void 0 ? void 0 : _b.grouprole_id)) {
                            throw new expresError_1["default"]("Error while creating group role permission entries for new group", 500);
                        }
                        ;
                        return [4 /*yield*/, groupPermissions_repository_1["default"].fetch_role_by_role_name("owner", groupEntry.id)];
                    case 6:
                        ownerPermission = _c.sent();
                        if (!(ownerPermission === null || ownerPermission === void 0 ? void 0 : ownerPermission.id)) {
                            throw new expresError_1["default"]("Error while fetching group owner permission entry for new group", 500);
                        }
                        ;
                        return [4 /*yield*/, group_repository_1["default"].associate_user_to_group(data.ownerid, groupEntry.id)];
                    case 7:
                        userGroup = _c.sent();
                        if (!userGroup) {
                            throw new expresError_1["default"]("Error while associating user to group", 500);
                        }
                        ;
                        return [4 /*yield*/, groupPermissions_repository_1["default"].create_user_group_role_by_role_id(data.ownerid, ownerPermission.id)];
                    case 8:
                        userAssoc = _c.sent();
                        if (!(userAssoc === null || userAssoc === void 0 ? void 0 : userAssoc.grouprole_id)) {
                            throw new expresError_1["default"]("Error assigning user role to user", 500);
                        }
                        ;
                        // Commit to Database
                        return [4 /*yield*/, transactionRepository_1["default"].commit_transaction()];
                    case 9:
                        // Commit to Database
                        _c.sent();
                        return [2 /*return*/, groupEntry];
                    case 10:
                        error_1 = _c.sent();
                        return [4 /*yield*/, transactionRepository_1["default"].rollback_transaction()];
                    case 11:
                        _c.sent();
                        throw new expresError_1["default"](error_1.message, error_1.status);
                    case 12:
                        ;
                        return [2 /*return*/];
                }
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
                role = groupPermissions_repository_1["default"].create_role(roleData);
                return [2 /*return*/, role];
            });
        });
    };
    ;
    GroupModel.create_role_permissions = function (permissionList) {
        return __awaiter(this, void 0, void 0, function () {
            var rolePermissions, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 9]);
                        return [4 /*yield*/, transactionRepository_1["default"].begin_transaction()];
                    case 1:
                        _a.sent();
                        rolePermissions = void 0;
                        if (!(permissionList.length > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, groupPermissions_repository_1["default"].create_role_permissions(permissionList)];
                    case 2:
                        rolePermissions = _a.sent();
                        return [3 /*break*/, 4];
                    case 3: throw new expresError_1["default"]("Error encountered when creating new role permissions", 400);
                    case 4:
                        if (!(rolePermissions && rolePermissions.length > 0 && rolePermissions[0].grouppermission_id)) return [3 /*break*/, 6];
                        return [4 /*yield*/, transactionRepository_1["default"].commit_transaction()];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [2 /*return*/, rolePermissions];
                    case 7:
                        error_2 = _a.sent();
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
    GroupModel.create_group_user = function (groupID, userID) {
        return __awaiter(this, void 0, void 0, function () {
            var userGroup, defaultRole, userRole, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 8]);
                        return [4 /*yield*/, transactionRepository_1["default"].begin_transaction()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, group_repository_1["default"].associate_user_to_group(userID, groupID)];
                    case 2:
                        userGroup = _a.sent();
                        if (!userGroup) {
                            throw new expresError_1["default"]("Error while associating user to group", 500);
                        }
                        ;
                        return [4 /*yield*/, groupPermissions_repository_1["default"].fetch_role_by_role_name("user", groupID)];
                    case 3:
                        defaultRole = _a.sent();
                        if (!(defaultRole === null || defaultRole === void 0 ? void 0 : defaultRole.id)) {
                            throw new expresError_1["default"]("Error while fetching default role for target group", 500);
                        }
                        ;
                        return [4 /*yield*/, groupPermissions_repository_1["default"].create_user_group_role_by_role_id(userID, defaultRole.id)];
                    case 4:
                        userRole = _a.sent();
                        if (!userRole) {
                            throw new expresError_1["default"]("Error while assinging default role to target user", 500);
                        }
                        ;
                        return [4 /*yield*/, transactionRepository_1["default"].commit_transaction()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, userRole];
                    case 6:
                        error_3 = _a.sent();
                        return [4 /*yield*/, transactionRepository_1["default"].rollback_transaction()];
                    case 7:
                        _a.sent();
                        throw new expresError_1["default"](error_3.message, error_3.status);
                    case 8:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupModel.create_group_user_role = function (roleID, userID) {
        return __awaiter(this, void 0, void 0, function () {
            var userRole;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, groupPermissions_repository_1["default"].create_user_group_role_by_role_id(userID, roleID)];
                    case 1:
                        userRole = _a.sent();
                        if (!userRole) {
                            throw new expresError_1["default"]("Error while assinging default role to target user", 500);
                        }
                        ;
                        return [2 /*return*/, userRole];
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
    GroupModel.retrieve_group_by_group_id = function (groupID, accessType) {
        return __awaiter(this, void 0, void 0, function () {
            var group, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = accessType;
                        switch (_a) {
                            case "public": return [3 /*break*/, 1];
                            case "elevated": return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, group_repository_1["default"].fetch_public_group_by_group_id(groupID)];
                    case 2:
                        group = _b.sent();
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, group_repository_1["default"].fetch_unrestricted_group_by_group_id(groupID)];
                    case 4:
                        group = _b.sent();
                        return [3 /*break*/, 6];
                    case 5: throw new expresError_1["default"]("Server Configuration Error", 500);
                    case 6: return [2 /*return*/, group];
                }
            });
        });
    };
    ;
    GroupModel.retrieve_group_list_paginated = function (limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            var groups;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, group_repository_1["default"].fetch_group_list_paginated(limit, offset)];
                    case 1:
                        groups = _a.sent();
                        return [2 /*return*/, groups];
                }
            });
        });
    };
    ;
    GroupModel.retrieve_user_groups_list_by_user_id = function (userID, accessType, limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            var groups, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = accessType;
                        switch (_a) {
                            case "public": return [3 /*break*/, 1];
                            case "user": return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, group_repository_1["default"].fetch_public_group_list_by_user_id(userID, limit, offset)];
                    case 2:
                        groups = _b.sent();
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, group_repository_1["default"].fetch_unrestricted_group_list_by_user_id(userID, limit, offset)];
                    case 4:
                        groups = _b.sent();
                        return [3 /*break*/, 6];
                    case 5: throw new expresError_1["default"]("Server Configuration Error", 500);
                    case 6: return [2 /*return*/, groups];
                }
            });
        });
    };
    ;
    GroupModel.retrieve_roles_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var roles;
            return __generator(this, function (_a) {
                roles = groupPermissions_repository_1["default"].fetch_roles_by_group_id(groupID);
                return [2 /*return*/, roles];
            });
        });
    };
    ;
    GroupModel.retrieve_permissions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var permissions;
            return __generator(this, function (_a) {
                permissions = groupPermissions_repository_1["default"].fetch_permissions();
                return [2 /*return*/, permissions];
            });
        });
    };
    ;
    GroupModel.retrieve_users_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                users = group_repository_1["default"].fetch_group_users_by_group_id(groupID);
                return [2 /*return*/, users];
            });
        });
    };
    ;
    GroupModel.retrieve_role_permissions_by_role_id = function (groupID, roleID) {
        return __awaiter(this, void 0, void 0, function () {
            var permissions;
            return __generator(this, function (_a) {
                permissions = groupPermissions_repository_1["default"].fetch_role_permissions_by_role_id(groupID, roleID);
                return [2 /*return*/, permissions];
            });
        });
    };
    ;
    GroupModel.retrieve_user_roles_by_user_id = function (userID, groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var roles;
            return __generator(this, function (_a) {
                roles = groupPermissions_repository_1["default"].fetch_user_group_roles_by_user_id(userID, groupID);
                return [2 /*return*/, roles];
            });
        });
    };
    ;
    // static async retrieve_user_permissions_by_user_id(userID: string) {
    //     const permissions = GroupPermissionsRepo.fetch_user_group_permissions_by_user_id(userID);
    //     return permissions;
    // };
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
            var groupList, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 10]);
                        return [4 /*yield*/, transactionRepository_1["default"].begin_transaction()];
                    case 1:
                        _a.sent();
                        groupList = [{ id: groupID }];
                        return [4 /*yield*/, equipment_repository_1["default"].delete_equip_by_group_id(groupList)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, room_repository_1["default"].delete_room_by_group_id(groupList)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, group_repository_1["default"].delete_group_users_by_group_id(groupList)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, groupPermissions_repository_1["default"].delete_roles_by_group_id(groupList)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, group_repository_1["default"].delete_groups_by_group_id(groupList)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, transactionRepository_1["default"].commit_transaction()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, groupList];
                    case 8:
                        error_4 = _a.sent();
                        return [4 /*yield*/, transactionRepository_1["default"].rollback_transaction()];
                    case 9:
                        _a.sent();
                        throw new expresError_1["default"](error_4.message, error_4.status);
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupModel.delete_role = function (roleID) {
        return __awaiter(this, void 0, void 0, function () {
            var role, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 8]);
                        return [4 /*yield*/, transactionRepository_1["default"].begin_transaction()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, groupPermissions_repository_1["default"].delete_role_permissions_by_role_id(roleID)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, groupPermissions_repository_1["default"].delete_user_group_roles_by_role_id(roleID)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, groupPermissions_repository_1["default"].delete_role_by_role_id(roleID)];
                    case 4:
                        role = _a.sent();
                        if (!role) {
                            throw new expresError_1["default"]("Failed to Delete Target Role", 500);
                        }
                        ;
                        return [4 /*yield*/, transactionRepository_1["default"].commit_transaction()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, role];
                    case 6:
                        error_5 = _a.sent();
                        return [4 /*yield*/, transactionRepository_1["default"].rollback_transaction()];
                    case 7:
                        _a.sent();
                        throw new expresError_1["default"](error_5.message, error_5.status);
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    ;
    // static async delete_permission(permID: string) {
    //     const permission = await GroupPermissionsRepo.delete_permission_by_permission_id(permID);
    //     if (!permission) {
    //         throw new ExpressError("Unable to delete target permission", 400);
    //     };
    //     return permission;
    // };
    GroupModel.delete_role_pemission = function (roleID, permID) {
        return __awaiter(this, void 0, void 0, function () {
            var permission;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, groupPermissions_repository_1["default"].delete_role_permission_by_role_permission_id(roleID, permID)];
                    case 1:
                        permission = _a.sent();
                        if (!permission) {
                            throw new expresError_1["default"]("Unable to delete target role permission", 500);
                        }
                        ;
                        return [2 /*return*/, permission];
                }
            });
        });
    };
    ;
    GroupModel.delete_group_user = function (groupID, userID) {
        return __awaiter(this, void 0, void 0, function () {
            var roles, groupUser, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 7]);
                        return [4 /*yield*/, transactionRepository_1["default"].begin_transaction()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, groupPermissions_repository_1["default"].delete_user_group_roles_by_user_id(userID)];
                    case 2:
                        roles = _a.sent();
                        if (!roles) {
                            throw new expresError_1["default"]("Failed to Delete Roles Associated with Target User", 500);
                        }
                        ;
                        return [4 /*yield*/, group_repository_1["default"].disassociate_user_from_group(userID, groupID)];
                    case 3:
                        groupUser = _a.sent();
                        if (!groupUser) {
                            throw new expresError_1["default"]("Failed to Disassociate User From Target Group", 500);
                        }
                        ;
                        return [4 /*yield*/, transactionRepository_1["default"].commit_transaction()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, groupUser];
                    case 5:
                        error_6 = _a.sent();
                        return [4 /*yield*/, transactionRepository_1["default"].rollback_transaction()];
                    case 6:
                        _a.sent();
                        throw new expresError_1["default"](error_6.message, error_6.status);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupModel.delete_group_user_role = function (roleID, userID) {
        return __awaiter(this, void 0, void 0, function () {
            var roles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, groupPermissions_repository_1["default"].delete_user_group_role_by_user_and_role_id(userID, roleID)];
                    case 1:
                        roles = _a.sent();
                        if (!roles) {
                            throw new expresError_1["default"]("Failed to Delete User Role Associated with Target User", 500);
                        }
                        ;
                        return [2 /*return*/, roles];
                }
            });
        });
    };
    ;
    return GroupModel;
}());
exports["default"] = GroupModel;
//# sourceMappingURL=groupModel.js.map