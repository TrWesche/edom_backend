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
var groupUserRoleCreateSchema_1 = require("../../../schemas/group/groupUserRoleCreateSchema");
// Model Imports
var groupModel_1 = require("../../../models/groupModel");
// Middleware Imports
var authorizationMW_1 = require("../../../middleware/authorizationMW");
var groupUserMgmtRouter = express.Router({ mergeParams: true });
/* ____ ____  _____    _  _____ _____
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|
 | |___|  _ <| |___ / ___ \| | | |___
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Add User Role
groupUserMgmtRouter.post("/mgmt", authorizationMW_1["default"].defineRoutePermissions({
    user: [],
    group: ["group_create_user_role"],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var reqValues, queryData, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.targetUID || !req.groupID || !req.body.roleID) {
                    throw new expresError_1["default"]("Must be logged in to assign roles || target user missing || target group missing || target role missing", 400);
                }
                reqValues = {
                    user_id: req.targetUID,
                    grouprole_id: req.body.roleID
                };
                if (!(0, groupUserRoleCreateSchema_1["default"])(reqValues)) {
                    throw new expresError_1["default"]("Unable to Create Group User: ".concat(groupUserRoleCreateSchema_1["default"].errors), 400);
                }
                return [4 /*yield*/, groupModel_1["default"].create_group_user_role(reqValues.grouprole_id, [reqValues.user_id])];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Create Group User Role Failed", 400);
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
/* ____  _____    _    ____
  |  _ \| ____|  / \  |  _ \
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/
*/
// Get User Group Data
groupUserMgmtRouter.get("/", authorizationMW_1["default"].defineRoutePermissions({
    user: [],
    group: ["group_read_user_role"],
    public: []
}), authorizationMW_1["default"].validateRoutePermissions, function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                // Preflight
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || !req.groupID || !req.targetUID) {
                    throw new expresError_1["default"]("Must be logged in to view group user roles || target group missing", 400);
                }
                return [4 /*yield*/, groupModel_1["default"].retrieve_user_roles_by_user_id(req.targetUID, req.groupID)];
            case 1:
                queryData = _b.sent();
                if (!queryData) {
                    throw new expresError_1["default"]("Retrieving Group User Roles Failed", 400);
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
/* ____  _____ _     _____ _____ _____
  |  _ \| ____| |   | ____|_   _| ____|
  | | | |  _| | |   |  _|   | | |  _|
  | |_| | |___| |___| |___  | | | |___
  |____/|_____|_____|_____| |_| |_____|
*/
// Remove User Role
// groupUserMgmtRouter.delete("/roles", 
//     authMW.defineRoutePermissions({
//         user: [],
//         group: ["group_delete_user_role"],
//         public: []
//     }),
//     authMW.validateRoutePermissions,
//     async (req, res, next) => {
//         try {
//             // Preflight
//             if (!req.user?.id || !req.targetUID || !req.groupID || !req.body.roleID) {
//                 throw new ExpressError(`Must be logged in to create group || target user missing || target group missing || target role missing`, 400);
//             }
//             // Process
//             const queryData = await GroupModel.delete_group_user_role(req.body.roleID, req.targetUID);
//             if (!queryData) {
//                 throw new ExpressError("Delete Group User Role Failed", 400);
//             }
//             return res.json({GroupUserRoles: [queryData]})
//         } catch (error) {
//             next(error)
//         }
//     }
// );
exports["default"] = groupUserMgmtRouter;
//# sourceMappingURL=groupUserMgmtRouter.js.map