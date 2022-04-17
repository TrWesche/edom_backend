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
var bcrypt = require("bcrypt");
var config_1 = require("../config/config");
// Helper Function Imports
var expresError_1 = require("../utils/expresError");
// SQL Repository Imports
var user_repository_1 = require("../repositories/user.repository");
var transactionRepository_1 = require("../repositories/transactionRepository");
var group_repository_1 = require("../repositories/group.repository");
var equipment_repository_1 = require("../repositories/equipment.repository");
var room_repository_1 = require("../repositories/room.repository");
var groupPermissions_repository_1 = require("../repositories/groupPermissions.repository");
/** Standard User Creation & Authentication */
var UserModel = /** @class */ (function () {
    function UserModel() {
    }
    /** Authenticate user with email & password. Returns user or throws error. */
    // Manual Test Success 2022/03/13
    UserModel.authenticate = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isValid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!data.username) {
                            throw new expresError_1["default"]("Invalid Authentication Call", 400);
                        }
                        ;
                        return [4 /*yield*/, user_repository_1["default"].fetch_user_by_username(data.username, 'auth')];
                    case 1:
                        user = _a.sent();
                        if (!(user && user.password && data.password)) return [3 /*break*/, 3];
                        return [4 /*yield*/, bcrypt.compare(data.password, user.password)];
                    case 2:
                        isValid = _a.sent();
                        if (isValid) {
                            delete user.password;
                            return [2 /*return*/, user];
                        }
                        _a.label = 3;
                    case 3:
                        ;
                        throw new expresError_1["default"]("Invalid Credentials", 401);
                }
            });
        });
    };
    ;
    /** Register user with data. Returns new user data. */
    // Manual Test Success 2022/03/13
    UserModel.register = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var emailCheck, usernameCheck, hashedPassword, user, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!data.username || !data.email || !data.password) {
                            throw new expresError_1["default"]("Invalid Register Call", 400);
                        }
                        return [4 /*yield*/, user_repository_1["default"].fetch_user_by_user_email(data.email, 'unique')];
                    case 1:
                        emailCheck = _a.sent();
                        if (emailCheck) {
                            throw new expresError_1["default"]("An account is already registered with that email", 400);
                        }
                        ;
                        return [4 /*yield*/, user_repository_1["default"].fetch_user_by_username(data.username, 'unique')];
                    case 2:
                        usernameCheck = _a.sent();
                        if (usernameCheck) {
                            throw new expresError_1["default"]("That username has already been taken", 400);
                        }
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, bcrypt.hash(data.password, config_1.bcrypt_work_factor)];
                    case 4:
                        hashedPassword = _a.sent();
                        data.password = hashedPassword;
                        return [4 /*yield*/, user_repository_1["default"].create_new_user(data)];
                    case 5:
                        user = _a.sent();
                        return [2 /*return*/, user];
                    case 6:
                        error_1 = _a.sent();
                        throw new expresError_1["default"](error_1.message, 400);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ;
    /** Get user list */
    // Manual Test Success 2022/03/13
    UserModel.retrieve_user_list_paginated = function (limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_repository_1["default"].fetch_user_list_paginated(limit, offset)];
                    case 1:
                        users = _a.sent();
                        return [2 /*return*/, users];
                }
            });
        });
    };
    ;
    /** Get user data by id */
    // Manual Test Success 2022/03/13
    UserModel.retrieve_user_by_user_id = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!id) {
                            throw new expresError_1["default"]("Error: User ID not provided", 400);
                        }
                        return [4 /*yield*/, user_repository_1["default"].fetch_user_by_user_id(id, 'account')];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new expresError_1["default"]("Unable to locate target user", 404);
                        }
                        return [2 /*return*/, user];
                }
            });
        });
    };
    ;
    // Tested - 04/01/2022
    UserModel.retrieve_group_requests_by_user_id = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var groupInvites;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_repository_1["default"].fetch_group_requests_by_user_id(id)];
                    case 1:
                        groupInvites = _a.sent();
                        return [2 /*return*/, groupInvites];
                }
            });
        });
    };
    ;
    // Tested - 04/01/2022
    UserModel.retrieve_group_request_by_uid_gid = function (userID, groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var groupInvite;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_repository_1["default"].fetch_group_request_by_uid_gid(userID, groupID)];
                    case 1:
                        groupInvite = _a.sent();
                        return [2 /*return*/, groupInvite];
                }
            });
        });
    };
    ;
    // Tested - 04/01/2022
    UserModel.retrieve_group_membership_by_uid_gid = function (userID, groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var membership;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_repository_1["default"].fetch_group_membership_by_uid_gid(userID, groupID)];
                    case 1:
                        membership = _a.sent();
                        return [2 /*return*/, membership];
                }
            });
        });
    };
    ;
    /** Get user data by username */
    // Manual Test Success 2022/03/13
    UserModel.retrieve_user_by_username = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!username) {
                            throw new expresError_1["default"]("Error: Username not provided", 400);
                        }
                        return [4 /*yield*/, user_repository_1["default"].fetch_user_by_username(username, 'profile')];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new expresError_1["default"]("Unable to locate target user", 404);
                        }
                        // Not a great way to handle this, need to think of a better way.
                        delete user.password;
                        delete user.email;
                        return [2 /*return*/, user];
                }
            });
        });
    };
    ;
    /** Update user data with `data` */
    // Manual Test Success 2022/03/13
    UserModel.modify_user = function (id, data) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var _f, duplicateCheck, duplicateCheck, updateSuccess, user;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (!id) {
                            throw new expresError_1["default"]("Error: User ID not provided", 400);
                        }
                        if (!((_a = data.user_account) === null || _a === void 0 ? void 0 : _a.password)) return [3 /*break*/, 2];
                        _f = data.user_account;
                        return [4 /*yield*/, bcrypt.hash(data.user_account.password, config_1.bcrypt_work_factor)];
                    case 1:
                        _f.password = _g.sent();
                        _g.label = 2;
                    case 2:
                        if (!((_b = data.user_data) === null || _b === void 0 ? void 0 : _b.email_clean)) return [3 /*break*/, 4];
                        return [4 /*yield*/, user_repository_1["default"].fetch_user_by_user_email((_c = data.user_data) === null || _c === void 0 ? void 0 : _c.email_clean)];
                    case 3:
                        duplicateCheck = _g.sent();
                        if (duplicateCheck && duplicateCheck.id !== id) {
                            throw new expresError_1["default"]("A user already exists with that email", 400);
                        }
                        ;
                        _g.label = 4;
                    case 4:
                        if (!((_d = data.user_profile) === null || _d === void 0 ? void 0 : _d.username_clean)) return [3 /*break*/, 6];
                        return [4 /*yield*/, user_repository_1["default"].fetch_user_by_username((_e = data.user_profile) === null || _e === void 0 ? void 0 : _e.username_clean)];
                    case 5:
                        duplicateCheck = _g.sent();
                        if (duplicateCheck && duplicateCheck.id !== id) {
                            throw new expresError_1["default"]("A user already exists with that username", 400);
                        }
                        ;
                        _g.label = 6;
                    case 6: return [4 /*yield*/, user_repository_1["default"].update_user_by_user_id(id, data)];
                    case 7:
                        updateSuccess = _g.sent();
                        if (!updateSuccess) {
                            throw new expresError_1["default"]("Unable to update target user", 400);
                        }
                        ;
                        return [4 /*yield*/, user_repository_1["default"].fetch_user_by_user_id(id, 'account')];
                    case 8:
                        user = _g.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    ;
    /** Delete target user from database; returns undefined. */
    // Manual Test - 2022/03/13 (Only delete_user_by_user_id() verified to work)
    UserModel.delete_user = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var userList, ownedGroups, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 21, , 23]);
                        userList = [{ id: id }];
                        return [4 /*yield*/, transactionRepository_1["default"].begin_transaction()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, group_repository_1["default"].fetch_group_ids_by_user_id(id, 'owner')];
                    case 2:
                        ownedGroups = _a.sent();
                        if (!(ownedGroups.length > 0)) return [3 /*break*/, 12];
                        console.log("User owns groups");
                        return [4 /*yield*/, equipment_repository_1["default"].delete_equip_by_group_id(ownedGroups)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, equipment_repository_1["default"].delete_group_equip_by_group_id(ownedGroups)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, room_repository_1["default"].delete_room_by_group_id(ownedGroups)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, room_repository_1["default"].delete_group_room_by_group_id(ownedGroups)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, group_repository_1["default"].delete_group_user_roles_by_group_id(ownedGroups)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, group_repository_1["default"].delete_group_users_by_group_id(ownedGroups)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, groupPermissions_repository_1["default"].delete_role_permissions_by_group_id(ownedGroups)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, groupPermissions_repository_1["default"].delete_roles_by_group_id(ownedGroups)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, group_repository_1["default"].delete_groups_by_group_id(ownedGroups)];
                    case 11:
                        _a.sent();
                        _a.label = 12;
                    case 12:
                        ;
                        // Cleanup User Group & GroupRoles
                        return [4 /*yield*/, group_repository_1["default"].delete_user_grouproles_by_user_id(userList)];
                    case 13:
                        // Cleanup User Group & GroupRoles
                        _a.sent();
                        return [4 /*yield*/, group_repository_1["default"].delete_user_groups_by_user_id(userList)];
                    case 14:
                        _a.sent();
                        // Cleanup User Equipment
                        return [4 /*yield*/, equipment_repository_1["default"].delete_equip_by_user_id(userList)];
                    case 15:
                        // Cleanup User Equipment
                        _a.sent();
                        return [4 /*yield*/, equipment_repository_1["default"].delete_user_equip_by_user_id(userList)];
                    case 16:
                        _a.sent();
                        // Cleanup User Rooms
                        return [4 /*yield*/, room_repository_1["default"].delete_room_by_user_id(userList)];
                    case 17:
                        // Cleanup User Rooms
                        _a.sent();
                        return [4 /*yield*/, room_repository_1["default"].delete_user_room_by_user_id(userList)];
                    case 18:
                        _a.sent();
                        // Clean Up User Tables & Site Roles:
                        return [4 /*yield*/, user_repository_1["default"].delete_user_by_user_id(id)];
                    case 19:
                        // Clean Up User Tables & Site Roles:
                        _a.sent();
                        return [4 /*yield*/, transactionRepository_1["default"].commit_transaction()];
                    case 20:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 21:
                        error_2 = _a.sent();
                        return [4 /*yield*/, transactionRepository_1["default"].rollback_transaction()];
                    case 22:
                        _a.sent();
                        throw new expresError_1["default"]("Delete Failed", 500);
                    case 23: return [2 /*return*/];
                }
            });
        });
    };
    ;
    return UserModel;
}());
exports["default"] = UserModel;
//# sourceMappingURL=userModel.js.map