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
var GroupRepo = /** @class */ (function () {
    function GroupRepo() {
    }
    GroupRepo.create_new_group = function (groupData) {
        return __awaiter(this, void 0, void 0, function () {
            var queryColumns, queryColIdxs, queryParams, idx, key, query, result, rval, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        queryColumns = [];
                        queryColIdxs = [];
                        queryParams = [];
                        idx = 1;
                        for (key in groupData) {
                            if (groupData[key] !== undefined) {
                                queryColumns.push(key);
                                queryColIdxs.push("$".concat(idx));
                                queryParams.push(groupData[key]);
                                idx++;
                            }
                        }
                        ;
                        query = "\n                INSERT INTO groups \n                    (".concat(queryColumns.join(","), ") \n                VALUES (").concat(queryColIdxs.join(","), ") \n                RETURNING id, name, headline, description, public");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_1 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create new group - ".concat(error_1), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.fetch_group_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT id, name, headline, description, public\n                  FROM groups\n                  WHERE id = $1", [groupID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_2 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate group - ".concat(error_2), 500);
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.fetch_group_list_paginated = function (limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("\n                SELECT id, name, headline\n                FROM groups\n                WHERE groups.public = true\n                LIMIT $1\n                OFFSET $2", [limit, offset])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_3 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate groups - ".concat(error_3), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.fetch_group_list_by_user_id = function (userID, limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("\n                SELECT\n                    groups.id AS id,\n                    groups.name AS name,\n                    groups.headline AS headline,\n                    groups.description AS description\n                FROM groups\n                LEFT JOIN user_groups ON groups.id = user_groups.group_id\n                WHERE user_groups.user_id = $1\n                LIMIT $2\n                OFFSET $3", [userID, limit, offset])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_4 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate groups - ".concat(error_4), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.update_group_by_group_id = function (groupID, groupData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, values, result, rval, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = (0, createUpdateQueryPGSQL_1["default"])("groups", groupData, "id", groupID), query = _a.query, values = _a.values;
                        return [4 /*yield*/, pgdb_1["default"].query(query, values)];
                    case 1:
                        result = _b.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_5 = _b.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to update group - ".concat(error_5), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.delete_group_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM groups\n                WHERE id = $1\n                RETURNING id", [groupID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_6 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete group - ".concat(error_6), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    //  _   _ ____  _____ ____  
    // | | | / ___|| ____|  _ \ 
    // | | | \___ \|  _| | |_) |
    // | |_| |___) | |___|  _ < 
    //  \___/|____/|_____|_| \_\
    GroupRepo.associate_user_to_group = function (userID, groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("INSERT INTO user_groups \n                    (user_id, group_id) \n                VALUES ($1, $2) \n                RETURNING user_id, group_id", [
                                userID,
                                groupID
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_7 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create group association group -> user - ".concat(error_7), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.disassociate_user_from_group = function (userID, groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM user_groups\n                WHERE user_id = $1 AND group_id = $2\n                RETURNING user_id, group_id", [
                                userID,
                                groupID
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_8 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete group association group -> user - ".concat(error_8), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.disassociate_users_from_group_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM user_groups\n                WHERE group_id = $1\n                RETURNING user_id, group_id", [
                                groupID
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_9 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete group association group -> users - ".concat(error_9), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.fetch_groups_by_user_id = function (userID, groupPublic) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rval, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        queryParams = [];
                        if (groupPublic !== undefined) {
                            query = "\n                    SELECT id, name, headline\n                    FROM groups\n                    RIGHT JOIN user_groups\n                    ON groups.id = user_groups.group_id\n                    WHERE user_groups.user_id = $1 AND groups.public = $2";
                            queryParams.push(userID, groupPublic);
                        }
                        else {
                            query = "\n                    SELECT id, name, headline\n                    FROM groups\n                    RIGHT JOIN user_groups\n                    ON groups.id = user_groups.equip_id\n                    WHERE groups.user_id = $1";
                            queryParams.push(userID);
                        }
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_10 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate user groups by user id - ".concat(error_10), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.fetch_group_users_by_group_id = function (groupID, userPublic) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rval, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        queryParams = [];
                        if (userPublic !== undefined) {
                            query = "\n                    SELECT id, username\n                    FROM users\n                    RIGHT JOIN user_groups\n                    ON users.id = user_groups.user_id\n                    WHERE user_groups.group_id = $1 AND users.public = $2";
                            queryParams.push(groupID, userPublic);
                        }
                        else {
                            query = "\n                    SELECT id, username\n                    FROM users\n                    RIGHT JOIN user_groups\n                    ON users.id = user_groups.user_id\n                    WHERE user_groups.group_id = $1";
                            queryParams.push(groupID);
                        }
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_11 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate group users by group id - ".concat(error_11), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    return GroupRepo;
}());
exports["default"] = GroupRepo;
//# sourceMappingURL=group.repository.js.map