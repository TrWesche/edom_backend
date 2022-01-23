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
var express = require("express");
// Utility Functions Import
var expresError_1 = require("../../../utils/expresError");
// Schema Imports
var groupUserCreateSchema_1 = require("../../../schemas/group/groupUserCreateSchema");
var groupUserRoleCreateSchema_1 = require("../../../schemas/group/groupUserRoleCreateSchema");
var groupRoleCreateSchema_1 = require("../../../schemas/group/groupRoleCreateSchema");
var groupRolePermissionCreateSchema_1 = require("../../../schemas/group/groupRolePermissionCreateSchema");
// Model Imports
var groupModel_1 = require("../../../models/groupModel");
// Middleware Imports
var authorizationMW_1 = require("../../../middleware/authorizationMW");
var groupMgmtRouter = express.Router();
// User Roles
// Manual Test - Basic Functionality: 01/22/2022
// Get User Roles
groupMgmtRouter.get("/users/:userID/roles", authorizationMW_1["default"].defineGroupPermissions(["read_user_role"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID) {
                    throw new expresError_1["default"]("Must be logged in to view group user roles || target group missing", 400);
                }
                return [4 /*yield*/, groupModel_1["default"].retrieve_user_roles_by_user_id(req.params.userID, req.groupID)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Retrieving Group User Roles Failed", 400);
                }
                return [2 /*return*/, res.json({ GroupUserRoles: [queryData] })];
            case 2:
                error_1 = _b.sent();
                next(error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Manual Test - Basic Functionality: 01/22/2022
// Add User Role
groupMgmtRouter.post("/users/:userID/roles", authorizationMW_1["default"].defineGroupPermissions(["read_user_role", "create_user_role"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var reqValues, queryData, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.params.userID || !req.groupID || !req.body.roleID) {
                    throw new expresError_1["default"]("Must be logged in to assign roles || target user missing || target group missing || target role missing", 400);
                }
                reqValues = {
                    user_id: req.params.userID,
                    grouprole_id: req.body.roleID
                };
                if (!(0, groupUserRoleCreateSchema_1["default"])(reqValues)) {
                    throw new expresError_1["default"]("Unable to Create Group User: ".concat(groupUserRoleCreateSchema_1["default"].errors), 400);
                }
                return [4 /*yield*/, groupModel_1["default"].create_group_user_role(reqValues.grouprole_id, reqValues.user_id)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Create Group User Role Failed", 400);
                }
                return [2 /*return*/, res.json({ GroupUserRoles: [queryData] })];
            case 2:
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Manual Test - Basic Functionality: 01/22/2022
// Remove User Role
groupMgmtRouter["delete"]("/users/:userID/roles", authorizationMW_1["default"].defineGroupPermissions(["read_user_role", "delete_user_role"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.params.userID || !req.groupID || !req.body.roleID) {
                    throw new expresError_1["default"]("Must be logged in to create group || target user missing || target group missing || target role missing", 400);
                }
                return [4 /*yield*/, groupModel_1["default"].delete_group_user_role(req.body.roleID, req.params.userID)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Delete Group User Role Failed", 400);
                }
                return [2 /*return*/, res.json({ GroupUserRoles: [queryData] })];
            case 2:
                error_3 = _b.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Users
// Manual Test - Basic Functionality: 01/22/2022
// Get Users
groupMgmtRouter.get("/users", authorizationMW_1["default"].defineGroupPermissions(["read_group_user"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID) {
                    throw new expresError_1["default"]("Must be logged in to view group users || target group missing", 400);
                }
                return [4 /*yield*/, groupModel_1["default"].retrieve_users_by_group_id(req.groupID)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Retrieving Group Users Failed", 400);
                }
                return [2 /*return*/, res.json({ GroupUser: [queryData] })];
            case 2:
                error_4 = _b.sent();
                next(error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Manual Test - Basic Functionality: 01/20/2022
// Add User
groupMgmtRouter.post("/users", authorizationMW_1["default"].defineGroupPermissions(["read_group_user", "create_group_user"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var reqValues, queryData, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.body.userID || !req.groupID) {
                    throw new expresError_1["default"]("Must be logged in to create group || target user missing || target group missing", 400);
                }
                reqValues = {
                    userID: req.body.userID,
                    groupID: req.groupID
                };
                if (!(0, groupUserCreateSchema_1["default"])(reqValues)) {
                    throw new expresError_1["default"]("Unable to Create Group User: ".concat(groupUserCreateSchema_1["default"].errors), 400);
                }
                return [4 /*yield*/, groupModel_1["default"].create_group_user(reqValues.groupID, reqValues.userID)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Create Group User Failed", 400);
                }
                return [2 /*return*/, res.json({ GroupUser: [queryData] })];
            case 2:
                error_5 = _b.sent();
                next(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Manual Test - Basic Functionality: 01/20/2022
// Remove user
groupMgmtRouter["delete"]("/users/:userID", authorizationMW_1["default"].defineGroupPermissions(["read_group_user", "delete_group_user"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_6;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.params.userID || !req.groupID) {
                    throw new expresError_1["default"]("Must be logged in to create group || target user missing || target group missing", 400);
                }
                return [4 /*yield*/, groupModel_1["default"].delete_group_user(req.groupID, req.params.userID)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Delete Group User Failed", 400);
                }
                return [2 /*return*/, res.json({ GroupUser: [queryData] })];
            case 2:
                error_6 = _b.sent();
                next(error_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Group Permissions
// Manual Test - Basic Functionality: 01/20/2022
// TODO: It may make sense to create a separate set of permissions for each group with the same names so the permission ids are not duplicated for each group.
// Get Group Permissions
groupMgmtRouter.get("/permissions", authorizationMW_1["default"].defineGroupPermissions(["read_group_permissions"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_7;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID) {
                    throw new expresError_1["default"]("Must be logged in to view group permissions || target group missing", 400);
                }
                return [4 /*yield*/, groupModel_1["default"].retrieve_permissions()];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Retrieving Group Permissions Failed", 400);
                }
                return [2 /*return*/, res.json({ GroupUser: [queryData] })];
            case 2:
                error_7 = _b.sent();
                next(error_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Role Permissions
// Manual Test - Basic Functionality: 01/20/2022
// Get Role Permissions
groupMgmtRouter.get("/roles/:roleID/permissions", authorizationMW_1["default"].defineGroupPermissions(["read_role_permissions"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_8;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID || !req.params.roleID) {
                    throw new expresError_1["default"]("Must be logged in to view group roles || target group missing || target role missing", 400);
                }
                return [4 /*yield*/, groupModel_1["default"].retrieve_role_permissions_by_role_id(req.groupID, req.params.roleID)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Retrieving Group Role Permissions Failed", 400);
                }
                return [2 /*return*/, res.json({ GroupRolePermissions: [queryData] })];
            case 2:
                error_8 = _b.sent();
                next(error_8);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Add Role Permissions
// Manual Test - Basic Functionality: 01/20/2022
groupMgmtRouter.post("/roles/:roleID/permissions", authorizationMW_1["default"].defineGroupPermissions(["read_role_permissions", "create_role_permissions"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var reqValues_1, queryData, error_9;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.body.permissions || req.body.permissions.length === 0 || !req.groupID || !req.params.roleID) {
                    throw new expresError_1["default"]("Must be logged in to create group role || missing permissions to add || target group missing || target role missing", 400);
                }
                reqValues_1 = [];
                req.body.permissions.forEach(function (permission) {
                    var permissionEntry = {
                        grouprole_id: req.params.roleID,
                        grouppermission_id: permission
                    };
                    if (!(0, groupRolePermissionCreateSchema_1["default"])(permissionEntry)) {
                        throw new expresError_1["default"]("Unable to Create Group Role Permission: ".concat(groupRolePermissionCreateSchema_1["default"].errors), 400);
                    }
                    reqValues_1.push(permissionEntry);
                });
                return [4 /*yield*/, groupModel_1["default"].create_role_permissions(reqValues_1)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Create Group Role Permission Failed", 400);
                }
                return [2 /*return*/, res.json({ GroupRolePermissions: [queryData] })];
            case 2:
                error_9 = _b.sent();
                next(error_9);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Remove Role Permissions
// Manual Test - Basic Functionality: 01/20/2022
groupMgmtRouter["delete"]("/roles/:roleID/permissions", authorizationMW_1["default"].defineGroupPermissions(["read_role_permissions", "delete_role_permissions"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_10;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.params.roleID || !req.groupID || !req.body.permissionID) {
                    throw new expresError_1["default"]("Must be logged in to delete permissions || target role missing || target group missing || target permission missing", 400);
                }
                return [4 /*yield*/, groupModel_1["default"].delete_role_pemission(req.params.roleID, req.body.permissionID)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Delete Group Role Permission Failed", 400);
                }
                return [2 /*return*/, res.json({ GroupRolePermissions: [queryData] })];
            case 2:
                error_10 = _b.sent();
                next(error_10);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Roles
// Manual Test - Basic Functionality: 01/20/2022
// Get Roles
groupMgmtRouter.get("/roles", authorizationMW_1["default"].defineGroupPermissions(["read_role"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_11;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID) {
                    throw new expresError_1["default"]("Must be logged in to view group roles || target group missing", 400);
                }
                return [4 /*yield*/, groupModel_1["default"].retrieve_roles_by_group_id(req.groupID)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Retrieving Group Roles Failed", 400);
                }
                return [2 /*return*/, res.json({ GroupRoles: [queryData] })];
            case 2:
                error_11 = _b.sent();
                next(error_11);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Manual Test - Basic Functionality: 01/20/2022
// Add Role
groupMgmtRouter.post("/roles", authorizationMW_1["default"].defineGroupPermissions(["read_role", "create_role"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var reqValues, queryData, error_12;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.body.name || !req.groupID) {
                    throw new expresError_1["default"]("Must be logged in to create group role || role name missing || target group missing", 400);
                }
                reqValues = {
                    name: req.body.name,
                    group_id: req.groupID
                };
                if (!(0, groupRoleCreateSchema_1["default"])(reqValues)) {
                    throw new expresError_1["default"]("Unable to Create Group Role: ".concat(groupRoleCreateSchema_1["default"].errors), 400);
                }
                return [4 /*yield*/, groupModel_1["default"].create_role(reqValues.group_id, reqValues.name)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Create Group Role Failed", 400);
                }
                return [2 /*return*/, res.json({ GroupRoles: [queryData] })];
            case 2:
                error_12 = _b.sent();
                next(error_12);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Manual Test - Basic Functionality: 01/20/2022
// Remove Role
groupMgmtRouter["delete"]("/roles", authorizationMW_1["default"].defineGroupPermissions(["read_role", "delete_role"]), authorizationMW_1["default"].validatePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_13;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.body.roleID || !req.groupID) {
                    throw new expresError_1["default"]("Must be logged in to delete roles || target role missing || target group missing", 400);
                }
                return [4 /*yield*/, groupModel_1["default"].delete_role(req.body.roleID)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Delete Group Role Failed", 400);
                }
                return [2 /*return*/, res.json({ GroupRoles: [queryData] })];
            case 2:
                error_13 = _b.sent();
                next(error_13);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports["default"] = groupMgmtRouter;
//# sourceMappingURL=groupMgmtRouter.js.map