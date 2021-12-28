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
var bcrypt = require("bcrypt");
var config_1 = require("../config/config");
var expresError_1 = require("../utils/expresError");
var user_repository_1 = require("../repositories/user.repository");
/** Standard User Creation & Authentication */
var UserModel = /** @class */ (function () {
    function UserModel() {
    }
    /** Authenticate user with email & password. Returns user or throws error. */
    UserModel.authenticate = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isValid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!data.username) {
                            throw new expresError_1["default"]("Invalid Authentication Call", 400);
                        }
                        return [4 /*yield*/, user_repository_1["default"].fetch_user_by_username(data.username)];
                    case 1:
                        user = _a.sent();
                        if (!(user && user.password && data.password)) return [3 /*break*/, 3];
                        return [4 /*yield*/, bcrypt.compare(data.password, user.password)];
                    case 2:
                        isValid = _a.sent();
                        if (isValid) {
                            delete user.password;
                            delete user.email;
                            // TODO: User Roles & Permissions Will Need to be added
                            user.permissions = {
                                role: "user"
                            };
                            return [2 /*return*/, user];
                        }
                        _a.label = 3;
                    case 3: throw new expresError_1["default"]("Invalid Credentials", 401);
                }
            });
        });
    };
    /** Register user with data. Returns new user data. */
    UserModel.register = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var emailCheck, usernameCheck, hashedPassword, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!data.username || !data.email || !data.password) {
                            throw new expresError_1["default"]("Invalid Register Call", 400);
                        }
                        return [4 /*yield*/, user_repository_1["default"].fetch_user_by_user_email(data.email)];
                    case 1:
                        emailCheck = _a.sent();
                        if (emailCheck) {
                            throw new expresError_1["default"]("An account is already registered with that email", 400);
                        }
                        ;
                        return [4 /*yield*/, user_repository_1["default"].fetch_user_by_username(data.username)];
                    case 2:
                        usernameCheck = _a.sent();
                        if (usernameCheck) {
                            throw new expresError_1["default"]("That username has already been taken", 400);
                        }
                        return [4 /*yield*/, bcrypt.hash(data.password, config_1.bcrypt_work_factor)];
                    case 3:
                        hashedPassword = _a.sent();
                        return [4 /*yield*/, user_repository_1["default"].create_new_user(data, hashedPassword)];
                    case 4:
                        user = _a.sent();
                        // TODO: User Roles & Permissions Will Need to be added
                        if (user) {
                            user.permissions = {
                                role: "user"
                            };
                        }
                        return [2 /*return*/, user];
                }
            });
        });
    };
    /** Get user data by id */
    UserModel.retrieve_user_by_user_id = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!id) {
                            throw new expresError_1["default"]("Error: User ID not provided", 400);
                        }
                        return [4 /*yield*/, user_repository_1["default"].fetch_user_by_user_id(id)];
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
    UserModel.retrieve_user_by_username = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!username) {
                            throw new expresError_1["default"]("Error: Username not provided", 400);
                        }
                        return [4 /*yield*/, user_repository_1["default"].fetch_user_by_username(username)];
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
    /** Update user data with `data` */
    UserModel.modify_user = function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, duplicateCheck, duplicateCheck, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!id) {
                            throw new expresError_1["default"]("Error: User ID not provided", 400);
                        }
                        if (!data.password) return [3 /*break*/, 2];
                        _a = data;
                        return [4 /*yield*/, bcrypt.hash(data.password, config_1.bcrypt_work_factor)];
                    case 1:
                        _a.password = _b.sent();
                        _b.label = 2;
                    case 2:
                        if (!data.email) return [3 /*break*/, 4];
                        return [4 /*yield*/, user_repository_1["default"].fetch_user_by_user_email(data.email)];
                    case 3:
                        duplicateCheck = _b.sent();
                        if (duplicateCheck && duplicateCheck.id !== id) {
                            throw new expresError_1["default"]("A user already exists with that email", 400);
                        }
                        ;
                        _b.label = 4;
                    case 4:
                        if (!data.username) return [3 /*break*/, 6];
                        return [4 /*yield*/, user_repository_1["default"].fetch_user_by_username(data.username)];
                    case 5:
                        duplicateCheck = _b.sent();
                        if (duplicateCheck && duplicateCheck.id !== id) {
                            throw new expresError_1["default"]("A user already exists with that username", 400);
                        }
                        ;
                        _b.label = 6;
                    case 6: return [4 /*yield*/, user_repository_1["default"].update_user_by_user_id(id, data)];
                    case 7:
                        user = _b.sent();
                        if (!user) {
                            throw new expresError_1["default"]("Unable to update target user", 400);
                        }
                        // Cleanse Return Data
                        delete user.password;
                        return [2 /*return*/, user];
                }
            });
        });
    };
    /** Delete target user from database; returns undefined. */
    UserModel.delete_user = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, user_repository_1["default"].delete_user_by_user_id(id)];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            throw new expresError_1["default"]("Delete failed, unable to locate target user", 400);
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return UserModel;
}());
exports["default"] = UserModel;
//# sourceMappingURL=userModel.js.map