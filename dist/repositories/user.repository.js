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
;
;
;
;
;
var UserRepo = /** @class */ (function () {
    function UserRepo() {
    }
    // Tested - 03/12/2022
    UserRepo.create_new_user = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var query, insertValues, result, rval, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                SELECT * FROM create_user_account($1, $2, $3, $4, $5)\n            ";
                        insertValues = [
                            userData.username,
                            userData.password,
                            userData.email,
                            userData.first_name ? userData.first_name : "",
                            userData.last_name ? userData.last_name : ""
                        ];
                        return [4 /*yield*/, pgdb_1["default"].query(query, insertValues)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_1 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create new user - ".concat(error_1), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    UserRepo.create_request_user_to_group = function (userID, groupIDs) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rVal, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        queryParams = [userID, groupIDs];
                        query = "\n                INSERT INTO group_membership_requests \n                    (user_id, group_id, group_request, user_request, message) \n                VALUES ($1, $2, FALSE, TRUE, 'A user would like to join this group!')\n                RETURNING user_id, group_id";
                        console.log(query);
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rVal = result.rows;
                        return [2 /*return*/, rVal];
                    case 2:
                        error_2 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to request group membership - ".concat(error_2), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    // Tested - 03/12/2022
    UserRepo.fetch_user_by_user_email = function (userEmail, fetchType) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, rval, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        switch (fetchType) {
                            case 'unique':
                                query = "\n                        SELECT email\n                        FROM userdata\n                        WHERE email ILIKE $1";
                                break;
                            case 'auth':
                                query = "SELECT\n                        userdata.user_id AS id,\n                        userdata.email AS email,\n                        useraccount.password AS password\n                    FROM userdata\n                    LEFT JOIN useraccount ON useraccount.id = userdata.user_id\n                    WHERE email ILIKE $1";
                                break;
                            case 'profile':
                                query = "SELECT\n                        useraccount.id AS id,\n                        userprofile.username AS username,\n                        userprofile.headline AS headline,\n                        userprofile.about AS about,\n                        userprofile.image_url AS image_url,\n                        userprofile.public AS public_profile,\n                        userdata.email AS email,\n                        userdata.public_email AS public_email,\n                        userdata.first_name AS first_name,\n                        userdata.public_first_name AS public_first_name,\n                        userdata.last_name AS last_name,\n                        userdata.public_last_name AS public_last_name,\n                        userdata.location AS location,\n                        userdata.public_location AS public_location\n                    FROM useraccount\n                    LEFT JOIN userprofile ON userprofile.user_id = useraccount.id\n                    LEFT JOIN userdata ON userdata.user_id = useraccount.id\n                    WHERE email ILIKE $1";
                            case 'account':
                                query = "SELECT\n                        useraccount.id AS id,\n                        userprofile.username AS username,\n                        userprofile.headline AS headline,\n                        userprofile.about AS about,\n                        userprofile.image_url AS image_url,\n                        userprofile.public AS public_profile,\n                        userdata.email AS email,\n                        userdata.public_email AS public_email,\n                        userdata.first_name AS first_name,\n                        userdata.public_first_name AS public_first_name,\n                        userdata.last_name AS last_name,\n                        userdata.public_last_name AS public_last_name,\n                        userdata.location AS location,\n                        userdata.public_location AS public_location\n                    FROM useraccount\n                    LEFT JOIN userprofile ON userprofile.user_id = useraccount.id\n                    LEFT JOIN userdata ON userdata.user_id = useraccount.id\n                    WHERE email ILIKE $1";
                                break;
                            default:
                                query = "\n                        SELECT email\n                        FROM userdata\n                        WHERE email ILIKE $1";
                                break;
                        }
                        ;
                        return [4 /*yield*/, pgdb_1["default"].query(query, [userEmail])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_3 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured During Query Execution - ".concat(error_3), 500);
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    // Tested - 03/12/2022
    UserRepo.fetch_user_by_username = function (username, fetchType) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, rval, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        switch (fetchType) {
                            case 'unique':
                                query = "\n                        SELECT username\n                        FROM userprofile\n                        WHERE username ILIKE $1";
                                break;
                            case 'auth':
                                query = "SELECT\n                        userprofile.user_id AS id,\n                        userprofile.username AS username,\n                        useraccount.password AS password\n                    FROM userprofile\n                    LEFT JOIN useraccount ON useraccount.id = userprofile.user_id\n                    WHERE username ILIKE $1";
                                break;
                            case 'profile':
                                query = "\n                        SELECT\n                            useraccount.id AS id,\n                            userprofile.username AS username,\n                            userprofile.headline AS headline,\n                            userprofile.about AS about,\n                            userprofile.image_url AS image_url,\n                            (SELECT userdata.email AS email FROM userdata WHERE userdata.public_email = TRUE),\n                            (SELECT userdata.first_name AS first_name FROM userdata WHERE userdata.public_first_name = TRUE),\n                            (SELECT userdata.last_name AS last_name FROM userdata WHERE userdata.public_last_name = TRUE),\n                            (SELECT userdata.location AS location FROM userdata WHERE userdata.public_location = TRUE)\n                        FROM useraccount\n                        LEFT JOIN userprofile ON userprofile.user_id = useraccount.id\n                        LEFT JOIN userdata ON userdata.user_id = useraccount.id\n                        WHERE EXISTS (SELECT user_id FROM userprofile WHERE userprofile.username ILIKE $1 AND userprofile.public = TRUE)";
                                break;
                            case 'account':
                                query = "SELECT\n                        useraccount.id AS id,\n                        userprofile.username AS username,\n                        userprofile.headline AS headline,\n                        userprofile.about AS about,\n                        userprofile.image_url AS image_url,\n                        userprofile.public AS public_profile,\n                        userdata.email AS email,\n                        userdata.public_email AS public_email,\n                        userdata.first_name AS first_name,\n                        userdata.public_first_name AS public_first_name,\n                        userdata.last_name AS last_name,\n                        userdata.public_last_name AS public_last_name,\n                        userdata.location AS location,\n                        userdata.public_location AS public_location\n                    FROM useraccount\n                    LEFT JOIN userprofile ON userprofile.user_id = useraccount.id\n                    LEFT JOIN userdata ON userdata.user_id = useraccount.id\n                    WHERE username ILIKE $1";
                                break;
                            default:
                                query = "\n                        SELECT username\n                        FROM userprofile\n                        WHERE username ILIKE $1";
                                break;
                        }
                        ;
                        return [4 /*yield*/, pgdb_1["default"].query(query, [username])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_4 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured During Query Execution - ".concat(error_4), 500);
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    // Tested - 03/12/2022
    UserRepo.fetch_user_by_user_id = function (userID, fetchType) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, rval, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        switch (fetchType) {
                            case 'unique':
                                query = "\n                        SELECT id\n                        FROM useraccount\n                        WHERE id = $1";
                                break;
                            case 'auth':
                                query = "SELECT\n                        useraccount.id AS id,\n                        userprofile.username AS username,\n                        useraccount.password AS password\n                    FROM useraccount\n                    LEFT JOIN userprofile ON userprofile.user_id = useraccount.id\n                    WHERE id = $1";
                                break;
                            case 'profile':
                                query = "SELECT\n                        useraccount.id AS id,\n                        userprofile.username AS username,\n                        userprofile.headline AS headline,\n                        userprofile.about AS about,\n                        userprofile.image_url AS image_url,\n                        userprofile.public AS public_profile,\n                        userdata.email AS email,\n                        userdata.public_email AS public_email,\n                        userdata.first_name AS first_name,\n                        userdata.public_first_name AS public_first_name,\n                        userdata.last_name AS last_name,\n                        userdata.public_last_name AS public_last_name,\n                        userdata.location AS location,\n                        userdata.public_location AS public_location\n                    FROM useraccount\n                    LEFT JOIN userprofile ON userprofile.user_id = useraccount.id\n                    LEFT JOIN userdata ON userdata.user_id = useraccount.id\n                    WHERE id = $1";
                            case 'account':
                                query = "SELECT\n                        useraccount.id AS id,\n                        userprofile.username AS username,\n                        userprofile.headline AS headline,\n                        userprofile.about AS about,\n                        userprofile.image_url AS image_url,\n                        userprofile.public AS public_profile,\n                        userdata.email AS email,\n                        userdata.public_email AS public_email,\n                        userdata.first_name AS first_name,\n                        userdata.public_first_name AS public_first_name,\n                        userdata.last_name AS last_name,\n                        userdata.public_last_name AS public_last_name,\n                        userdata.location AS location,\n                        userdata.public_location AS public_location\n                    FROM useraccount\n                    LEFT JOIN userprofile ON userprofile.user_id = useraccount.id\n                    LEFT JOIN userdata ON userdata.user_id = useraccount.id\n                    WHERE id = $1";
                                break;
                            default:
                                query = "\n                        SELECT id\n                        FROM useraccount\n                        WHERE id = $1";
                                break;
                        }
                        ;
                        return [4 /*yield*/, pgdb_1["default"].query(query, [userID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_5 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured During Query Execution - ".concat(error_5), 500);
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    UserRepo.fetch_group_invites_by_user_id = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, rval;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            SELECT\n                group_membership_requests.group_id AS group_id,\n                group_membership_requests.user_id AS user_id,\n                sitegroups.name AS group_name,\n                sitegroups.image_url AS image_url\n            FROM group_membership_requests\n            LEFT JOIN sitegroups ON sitegroups.id = group_membership_requests.group_id\n            WHERE group_membership_requests.user_id = $1";
                        return [4 /*yield*/, pgdb_1["default"].query(query, [userID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                }
            });
        });
    };
    ;
    // Tested - 03/13/2022
    UserRepo.fetch_user_list_paginated = function (limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("\n                SELECT username, headline, image_url\n                FROM userprofile\n                WHERE userprofile.public = TRUE\n                LIMIT $1\n                OFFSET $2", [limit, offset])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_6 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate users - ".concat(error_6), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    // Tested - 03/12/2022
    UserRepo.update_user_by_user_id = function (userID, userData) {
        return __awaiter(this, void 0, void 0, function () {
            var updateSuccess, _a, query, values, result, _b, query, values, result, _c, query, values, result, error_7;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 9, , 11]);
                        updateSuccess = true;
                        return [4 /*yield*/, pgdb_1["default"].query("BEGIN")];
                    case 1:
                        _d.sent();
                        if (!userData.user_account) return [3 /*break*/, 3];
                        _a = (0, createUpdateQueryPGSQL_1["default"])("useraccount", userData.user_account, "id", userID), query = _a.query, values = _a.values;
                        return [4 /*yield*/, pgdb_1["default"].query(query, values)];
                    case 2:
                        result = _d.sent();
                        updateSuccess = updateSuccess && (result.rowCount != 0);
                        _d.label = 3;
                    case 3:
                        ;
                        if (!userData.user_data) return [3 /*break*/, 5];
                        _b = (0, createUpdateQueryPGSQL_1["default"])("userdata", userData.user_data, "user_id", userID), query = _b.query, values = _b.values;
                        return [4 /*yield*/, pgdb_1["default"].query(query, values)];
                    case 4:
                        result = _d.sent();
                        updateSuccess = updateSuccess && (result.rowCount != 0);
                        _d.label = 5;
                    case 5:
                        ;
                        if (!userData.user_profile) return [3 /*break*/, 7];
                        _c = (0, createUpdateQueryPGSQL_1["default"])("userprofile", userData.user_profile, "user_id", userID), query = _c.query, values = _c.values;
                        return [4 /*yield*/, pgdb_1["default"].query(query, values)];
                    case 6:
                        result = _d.sent();
                        updateSuccess = updateSuccess && (result.rowCount != 0);
                        _d.label = 7;
                    case 7:
                        ;
                        return [4 /*yield*/, pgdb_1["default"].query("COMMIT")];
                    case 8:
                        _d.sent();
                        return [2 /*return*/, updateSuccess];
                    case 9:
                        error_7 = _d.sent();
                        return [4 /*yield*/, pgdb_1["default"].query("ROLLBACK")];
                    case 10:
                        _d.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to update user - ".concat(error_7), 500);
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    ;
    // Tested - 03/13/2022
    UserRepo.delete_user_by_user_id = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("Called Delete User by User ID");
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT delete_user_account($1)", [userID])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_8 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete user - ".concat(error_8), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    return UserRepo;
}());
exports["default"] = UserRepo;
//# sourceMappingURL=user.repository.js.map