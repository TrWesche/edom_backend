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
var groupMgmtSchemaRole_1 = require("../../../schemas/group/groupMgmtSchemaRole");
// Model Imports
var groupModel_1 = require("../../../models/groupModel");
// Middleware Imports
var authorizationMW_1 = require("../../../middleware/authorizationMW");
// Router Imports
var groupMgmtRouterRole = express.Router();
/* ____ ____  _____    _  _____ _____
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|
 | |___|  _ <| |___ / ___ \| | | |___
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Add Role
groupMgmtRouterRole.post("/", authorizationMW_1["default"].defineRoutePermissions({
    user: [],
    group: ["group_create_role", "group_delete_role"],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var reqValues, queryData, _a, _b, error_1;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 10, , 11]);
                // Preflight
                if (!((_c = req.user) === null || _c === void 0 ? void 0 : _c.id) || !req.groupID) {
                    throw new expresError_1["default"]("Must be logged in to create group role || target group missing", 400);
                }
                reqValues = {
                    groupID: req.groupID,
                    context: req.body.context,
                    action: req.body.action,
                    role: req.body.role
                };
                if (!(0, groupMgmtSchemaRole_1["default"])(reqValues)) {
                    throw new expresError_1["default"]("Unable to Create Group Role: ".concat(groupMgmtSchemaRole_1["default"].errors), 400);
                }
                ;
                queryData = void 0;
                _a = reqValues.context;
                switch (_a) {
                    case "role": return [3 /*break*/, 1];
                }
                return [3 /*break*/, 8];
            case 1:
                _b = reqValues.action;
                switch (_b) {
                    case "create_role": return [3 /*break*/, 2];
                    case "delete_role": return [3 /*break*/, 4];
                }
                return [3 /*break*/, 6];
            case 2: return [4 /*yield*/, groupModel_1["default"].create_role(reqValues.groupID, reqValues.role)];
            case 3:
                queryData = _d.sent();
                return [2 /*return*/, res.json({ GroupRoles: [queryData] })];
            case 4:
                if (reqValues.role === "owner" || reqValues.role === "user") {
                    throw new expresError_1["default"]("Owner and User are default roles which cannot be deleted", 400);
                }
                ;
                return [4 /*yield*/, groupModel_1["default"].delete_role(reqValues.groupID, reqValues.role)];
            case 5:
                queryData = _d.sent();
                return [2 /*return*/, res.json({ GroupRoles: [queryData] })];
            case 6: throw new expresError_1["default"]("Configuration Error - Invalid Action", 400);
            case 7:
                ;
                _d.label = 8;
            case 8: throw new expresError_1["default"]("Configuration Error - Invalid Context", 400);
            case 9:
                ;
                return [3 /*break*/, 11];
            case 10:
                error_1 = _d.sent();
                next(error_1);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
/* ____  _____    _    ____
  |  _ \| ____|  / \  |  _ \
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/
*/
// Get Role List
// Manually Tested - 2022-04-08
groupMgmtRouterRole.get("/", authorizationMW_1["default"].defineRoutePermissions({
    user: [],
    group: ["group_read_role"],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_2;
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
                error_2 = _b.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get Role Detail View
// Manually Tested - 2022-04-08
groupMgmtRouterRole.get("/:rolename", authorizationMW_1["default"].defineRoutePermissions({
    user: [],
    group: ["group_read_role_permissions"],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID || !req.params.rolename) {
                    throw new expresError_1["default"]("Must be logged in to view group roles || target group missing || target role missing", 400);
                }
                return [4 /*yield*/, groupModel_1["default"].retrieve_role_permissions_by_role_id(req.groupID, req.params.rolename)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Retrieving Group Role Permissions Failed", 400);
                }
                return [2 /*return*/, res.json({ GroupRolePermissions: [queryData] })];
            case 2:
                error_3 = _b.sent();
                next(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/* ____  _____ _     _____ _____ _____
  |  _ \| ____| |   | ____|_   _| ____|
  | | | |  _| | |   |  _|   | | |  _|
  | |_| | |___| |___| |___  | | | |___
  |____/|_____|_____|_____| |_| |_____|
*/
// TODO: Need to make sure the default role and owner role cannot be deleted
// Remove Role
// groupMgmtRouterRole.delete("/:roleID", 
//     authMW.defineRoutePermissions({
//         user: [],
//         group: ["group_delete_role"],
//         public: []
//     }),
//     authMW.validateRoutePermissions,
//     async (req, res, next) => {
//         try {
//             // Preflight
//             if (!req.user?.id || !req.body.roleID || !req.groupID) {
//                 throw new ExpressError(`Must be logged in to delete roles || target role missing || target group missing`, 400);
//             }
//             // Process
//             const queryData = await GroupModel.delete_role(req.body.roleID);
//             if (!queryData) {
//                 throw new ExpressError("Delete Group Role Failed", 400);
//             }
//             return res.json({GroupRoles: [queryData]})
//         } catch (error) {
//             next(error)
//         }
//     }
// );
exports["default"] = groupMgmtRouterRole;
//# sourceMappingURL=groupMgmtRouterRole.js.map