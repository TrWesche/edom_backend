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
                        query = "\n                INSERT INTO sitegroups \n                    (".concat(queryColumns.join(","), ") \n                VALUES (").concat(queryColIdxs.join(","), ") \n                RETURNING id, name, headline, description, public");
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
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT id, name, headline, description, image_url, location\n                  FROM sitegroups\n                  WHERE id = $1", [groupID])];
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
    GroupRepo.fetch_public_group_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT id, name, headline, description, image_url, location, public\n                  FROM sitegroups\n                  WHERE id = $1 AND sitegroups.public = TRUE", [groupID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_3 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate group - ".concat(error_3), 500);
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.fetch_unrestricted_group_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("SELECT id, name, headline, description, image_url, location, public\n                  FROM sitegroups\n                  WHERE id = $1", [groupID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_4 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate group - ".concat(error_4), 500);
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
            var result, rval, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("\n                SELECT id, name, headline, image_url, location\n                FROM sitegroups\n                WHERE sitegroups.public = true\n                LIMIT $1\n                OFFSET $2", [limit, offset])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_5 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate groups - ".concat(error_5), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.fetch_public_group_list_by_user_id = function (userID, limit, offset, search) {
        return __awaiter(this, void 0, void 0, function () {
            var idx, filterParams, queryParams, query, result, rval, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx = 4;
                        filterParams = ['sitegroups.public = TRUE', 'user_groups.user_id = $1'];
                        queryParams = [userID, limit, offset];
                        if (search) {
                            filterParams.push("(sitegroups.name ILIKE $".concat(idx, " OR\n                        sitegroups.headline ILIKE $").concat(idx, " OR\n                        sitegroups.description ILIKE $").concat(idx, ")"));
                            queryParams.push("%".concat(search, "%"));
                            idx++;
                        }
                        ;
                        query = "\n                SELECT\n                    sitegroups.id AS id,\n                    sitegroups.name AS name,\n                    sitegroups.headline AS headline,\n                    sitegroups.description AS description,\n                    sitegroups.image_url AS image_url,\n                    sitegroups.location AS location\n                FROM sitegroups\n                LEFT JOIN user_groups ON sitegroups.id = user_groups.group_id\n                WHERE ".concat(filterParams.join(" AND "), "\n                LIMIT $2\n                OFFSET $3\n            ");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_6 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate groups - ".concat(error_6), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.fetch_member_requests_by_gid_usernames = function (groupID, usernames) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_1, idxParams_1, query, queryParams_1, result, rVal, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_1 = 2;
                        idxParams_1 = [];
                        query = void 0;
                        queryParams_1 = [groupID];
                        usernames.forEach(function (val) {
                            if (val) {
                                queryParams_1.push(val);
                                idxParams_1.push("$".concat(idx_1));
                                idx_1++;
                            }
                            ;
                        });
                        query = "\n                SELECT\n                    group_membership_requests.group_id AS group_id,\n                    sitegroups.name AS group_name,\n                    userprofile.user_id AS user_id,\n                    userprofile.username AS username,\n                    group_membership_requests.group_request AS group_request,\n                    group_membership_requests.user_request AS user_request\n                FROM userprofiles\n                LEFT OUTER JOIN group_membership_requests ON group_membership_requests.user_id = user_profile.user_id\n                LEFT JOIN userprofile ON userprofile.user_id = group_membership_requests.user_id\n                LEFT JOIN sitegroups ON sitegroups.id = group_membership_requests.group_id\n                WHERE group_membership_requests.group_id = $1 AND (userprofile.username ILIKE ".concat(idxParams_1.join('OR userprofile.username ILIKE'), ")");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_1)];
                    case 1:
                        result = _a.sent();
                        rVal = result.rows;
                        return [2 /*return*/, rVal];
                    case 2:
                        error_7 = _a.sent();
                        throw new expresError_1["default"]("Server Error - ".concat(this.caller, " - ").concat(error_7), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.fetch_member_requests_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, rval;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "\n            SELECT\n                group_membership_requests.group_id AS group_id,\n                sitegroups.name AS group_name,\n                group_membership_requests.user_id AS user_id,\n                userprofile.username AS username,\n                group_membership_requests.group_request AS group_request,\n                group_membership_requests.user_request AS user_request,\n                sitegroups.image_url AS image_url\n            FROM group_membership_requests\n            LEFT JOIN sitegroups ON sitegroups.id = group_membership_requests.group_id\n            LEFT JOIN userprofile ON userprofile.user_id = group_membership_requests.user_id\n            WHERE group_membership_requests.group_ID = $1";
                        return [4 /*yield*/, pgdb_1["default"].query(query, [groupID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                }
            });
        });
    };
    ;
    GroupRepo.fetch_unrestricted_group_list_by_user_id = function (userID, limit, offset, search) {
        return __awaiter(this, void 0, void 0, function () {
            var idx, filterParams, queryParams, query, result, rval, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx = 4;
                        filterParams = ['user_groups.user_id = $1'];
                        queryParams = [userID, limit, offset];
                        if (search) {
                            filterParams.push("(sitegroups.name ILIKE $".concat(idx, " OR\n                        sitegroups.headline ILIKE $").concat(idx, " OR\n                        sitegroups.description ILIKE $").concat(idx, ")"));
                            queryParams.push("%".concat(search, "%"));
                            idx++;
                        }
                        ;
                        query = "\n                SELECT\n                    sitegroups.id AS id,\n                    sitegroups.name AS name,\n                    sitegroups.headline AS headline,\n                    sitegroups.description AS description,\n                    sitegroups.image_url AS image_url,\n                    sitegroups.location AS location\n                FROM sitegroups\n                LEFT JOIN user_groups ON sitegroups.id = user_groups.group_id\n                WHERE ".concat(filterParams.join(" AND "), "\n                LIMIT $2\n                OFFSET $3\n            ");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_8 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate groups - ".concat(error_8), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    // https://dba.stackexchange.com/questions/267410/show-values-from-list-that-are-not-returned-by-query
    // https://stackoverflow.com/questions/19363481/select-rows-which-are-not-present-in-other-table/19364694#19364694
    GroupRepo.fetch_active_member_requests_by_uid_gid = function (userID, groupID, userToGroup, groupToUser) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_2, idxParams_2, query, queryParams_2, result, rVal, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_2 = 4;
                        idxParams_2 = [];
                        query = void 0;
                        queryParams_2 = [groupID, userToGroup, groupToUser];
                        userID.forEach(function (val) {
                            if (val) {
                                queryParams_2.push(val);
                                idxParams_2.push("$".concat(idx_2));
                                idx_2++;
                            }
                            ;
                        });
                        query = "\n                SELECT ARRAY (\n                    SELECT uid AS user_id\n                    FROM unnest(ARRAY[".concat(idxParams_2.join(', '), "]::uuid[]) v(uid)\n                    LEFT JOIN group_membership_requests gmr ON gmr.user_id = uid\n                    WHERE  gmr.user_id IS NOT NULL AND gmr.group_id = $1 AND gmr.user_request = $2 and gmr.group_request = $3\n                )\n            ");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_2)];
                    case 1:
                        result = _a.sent();
                        rVal = result.rows[0].array;
                        return [2 /*return*/, rVal];
                    case 2:
                        error_9 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to query active user requests to join group - ".concat(error_9), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.fetch_request_permitted_by_uid_gid = function (userID, groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_3, idxParams_3, query, queryParams_3, result, rVal, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_3 = 3;
                        idxParams_3 = [];
                        query = void 0;
                        queryParams_3 = [groupID, groupID];
                        userID.forEach(function (val) {
                            if (val) {
                                queryParams_3.push(val);
                                idxParams_3.push("$".concat(idx_3));
                                idx_3++;
                            }
                            ;
                        });
                        query = "\n                SELECT ARRAY (\n                    SELECT uid AS user_id\n                    FROM unnest(ARRAY[".concat(idxParams_3.join(', '), "]::uuid[]) v(uid)\n                    WHERE (\n                        NOT EXISTS (SELECT FROM group_membership_requests gmr WHERE gmr.user_id = uid AND gmr.group_id = $1) AND\n                        NOT EXISTS (SELECT FROM user_groups ug WHERE ug.user_id = uid AND ug.group_id = $2)\n                    )\n                )\n            ");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_3)];
                    case 1:
                        result = _a.sent();
                        rVal = result.rows[0].array;
                        return [2 /*return*/, rVal];
                    case 2:
                        error_10 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to query active user requests to join group - ".concat(error_10), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.fetch_group_members_of_group_by_uid_gid = function (userID, groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_4, idxParams_4, query, queryParams_4, result, rVal, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_4 = 2;
                        idxParams_4 = [];
                        query = void 0;
                        queryParams_4 = [groupID];
                        userID.forEach(function (val) {
                            if (val) {
                                queryParams_4.push(val);
                                idxParams_4.push("$".concat(idx_4));
                                idx_4++;
                            }
                            ;
                        });
                        query = "\n                SELECT ARRAY (\n                    SELECT \n                        user_groups.user_id AS user_id\n                    FROM user_groups\n                    WHERE user_groups.group_id = $1 AND user_groups.user_id IN (".concat(idxParams_4.join(', '), ")\n                )\n            ");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_4)];
                    case 1:
                        result = _a.sent();
                        rVal = result.rows[0].array;
                        return [2 /*return*/, rVal];
                    case 2:
                        error_11 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to query user ids for user in target group - ".concat(error_11), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.update_group_by_group_id = function (groupID, groupData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, values, result, rval, error_12;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = (0, createUpdateQueryPGSQL_1["default"])("sitegroups", groupData, "id", groupID), query = _a.query, values = _a.values;
                        return [4 /*yield*/, pgdb_1["default"].query(query, values)];
                    case 1:
                        result = _b.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_12 = _b.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to update group - ".concat(error_12), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.delete_groups_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_5, idxParams_5, query, queryParams_5, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_5 = 1;
                        idxParams_5 = [];
                        query = void 0;
                        queryParams_5 = [];
                        groupID.forEach(function (val) {
                            if (val.id) {
                                queryParams_5.push(val.id);
                                idxParams_5.push("$".concat(idx_5));
                                idx_5++;
                            }
                            ;
                        });
                        query = "\n                DELETE FROM sitegroups\n                WHERE sitegroups.id IN (".concat(idxParams_5.join(', '), ");");
                        // console.log(query);
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_5)];
                    case 1:
                        // console.log(query);
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_13 = _a.sent();
                        throw new expresError_1["default"]("Server Error - delete_groups_by_group_id - ".concat(error_13), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.delete_group_user_roles_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_6, idxParams_6, query, queryParams_6, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_6 = 1;
                        idxParams_6 = [];
                        query = void 0;
                        queryParams_6 = [];
                        groupID.forEach(function (val) {
                            if (val.id) {
                                queryParams_6.push(val.id);
                                idxParams_6.push("$".concat(idx_6));
                                idx_6++;
                            }
                            ;
                        });
                        query = "\n                DELETE FROM user_grouproles\n                WHERE user_grouproles.grouprole_id IN (\n                    SELECT grouproles.id FROM grouproles\n                    WHERE grouproles.group_id IN (".concat(idxParams_6.join(', '), ")\n                )");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_6)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_14 = _a.sent();
                        throw new expresError_1["default"]("Server Error - delete_group_user_roles_by_group_id - ".concat(error_14), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.delete_group_users_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_7, idxParams_7, query, queryParams_7, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_7 = 1;
                        idxParams_7 = [];
                        query = void 0;
                        queryParams_7 = [];
                        groupID.forEach(function (val) {
                            if (val.id) {
                                queryParams_7.push(val.id);
                                idxParams_7.push("$".concat(idx_7));
                                idx_7++;
                            }
                            ;
                        });
                        query = "\n                DELETE FROM user_groups\n                WHERE user_groups.group_id IN (".concat(idxParams_7.join(', '), ")");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_7)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_15 = _a.sent();
                        throw new expresError_1["default"]("Server Error - delete_group_users_by_group_id - ".concat(error_15), 500);
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
    GroupRepo.create_request_group_to_user = function (userIDs, groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_8, idxParams_8, query, queryParams_8, result, rVal, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_8 = 1;
                        idxParams_8 = [];
                        query = void 0;
                        queryParams_8 = [];
                        userIDs.forEach(function (val) {
                            if (val) {
                                queryParams_8.push(val, groupID);
                                idxParams_8.push("($".concat(idx_8, ", $").concat(idx_8 + 1, ", TRUE, FALSE, 'You have been invited to join this group!')"));
                                idx_8 += 2;
                            }
                            ;
                        });
                        query = "\n                INSERT INTO group_membership_requests \n                    (user_id, group_id, group_request, user_request, message) \n                VALUES ".concat(idxParams_8.join(', '), "\n                RETURNING user_id, group_id");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_8)];
                    case 1:
                        result = _a.sent();
                        rVal = result.rows;
                        return [2 /*return*/, rVal];
                    case 2:
                        error_16 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to invite user to group - ".concat(error_16), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.create_request_user_to_group = function (userID, groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rVal, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        queryParams = [userID, groupID];
                        query = "\n                INSERT INTO group_membership_requests \n                    (user_id, group_id, group_request, user_request, message) \n                VALUES ($1, $2, FALSE, TRUE, 'A user has requested to join your group!')\n                RETURNING user_id, group_id";
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rVal = result.rows;
                        return [2 /*return*/, rVal];
                    case 2:
                        error_17 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to invite user to group - ".concat(error_17), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.associate_user_to_group = function (userIDs, groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_9, idxParams_9, query, queryParams_9, result, rVal, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_9 = 1;
                        idxParams_9 = [];
                        query = void 0;
                        queryParams_9 = [];
                        userIDs.forEach(function (val) {
                            if (val) {
                                queryParams_9.push(val, groupID);
                                idxParams_9.push("($".concat(idx_9, ", $").concat(idx_9 + 1, ")"));
                                idx_9 += 2;
                            }
                            ;
                        });
                        query = "\n                INSERT INTO user_groups \n                    (user_id, group_id) \n                VALUES ".concat(idxParams_9.join(', '), "\n                RETURNING user_id, group_id");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_9)];
                    case 1:
                        result = _a.sent();
                        rVal = result.rows;
                        return [2 /*return*/, rVal];
                    case 2:
                        error_18 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create group association group -> user - ".concat(error_18), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.disassociate_user_from_group = function (userIDs, groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_10, idxParams_10, query, queryParams_10, result, rVal, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_10 = 2;
                        idxParams_10 = [];
                        query = void 0;
                        queryParams_10 = [groupID];
                        userIDs.forEach(function (val) {
                            if (val) {
                                queryParams_10.push(val);
                                idxParams_10.push("$".concat(idx_10));
                                idx_10++;
                            }
                            ;
                        });
                        query = "\n                DELETE FROM user_groups \n                WHERE group_id = $1 AND user_id IN (".concat(idxParams_10.join(', '), ")\n                RETURNING user_id, group_id");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_10)];
                    case 1:
                        result = _a.sent();
                        rVal = result.rows;
                        return [2 /*return*/, rVal];
                    case 2:
                        error_19 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete group association group -> user - ".concat(error_19), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.delete_request_user_group = function (userIDs, groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_11, idxParams_11, query, queryParams_11, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_11 = 2;
                        idxParams_11 = [];
                        query = void 0;
                        queryParams_11 = [groupID];
                        userIDs.forEach(function (val) {
                            if (val) {
                                queryParams_11.push(val);
                                idxParams_11.push("$".concat(idx_11));
                                idx_11++;
                            }
                            ;
                        });
                        query = "\n                DELETE FROM group_membership_requests\n                WHERE group_membership_requests.group_id = $1 AND group_membership_requests.user_id IN (".concat(idxParams_11.join(', '), ")");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_11)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_20 = _a.sent();
                        throw new expresError_1["default"]("Server Error - Unable to delete user group membership request - ".concat(error_20), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.delete_user_grouproles_by_user_id = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_12, idxParams_12, query, queryParams_12, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_12 = 1;
                        idxParams_12 = [];
                        query = void 0;
                        queryParams_12 = [];
                        userID.forEach(function (val) {
                            if (val.id) {
                                queryParams_12.push(val.id);
                                idxParams_12.push("$".concat(idx_12));
                                idx_12++;
                            }
                            ;
                        });
                        query = "\n                DELETE FROM user_grouproles\n                WHERE user_grouproles.user_id IN (".concat(idxParams_12.join(', '), ")");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_12)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_21 = _a.sent();
                        throw new expresError_1["default"]("Server Error - ".concat(this.caller, " - ").concat(error_21), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.delete_user_groups_by_user_id = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_13, idxParams_13, query, queryParams_13, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_13 = 1;
                        idxParams_13 = [];
                        query = void 0;
                        queryParams_13 = [];
                        userID.forEach(function (val) {
                            if (val.id) {
                                queryParams_13.push(val.id);
                                idxParams_13.push("$".concat(idx_13));
                                idx_13++;
                            }
                            ;
                        });
                        query = "\n                DELETE FROM user_groups\n                WHERE user_groups.user_id IN (".concat(idxParams_13.join(', '), ")");
                        // console.log(query);
                        // console.log(queryParams);
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_13)];
                    case 1:
                        // console.log(query);
                        // console.log(queryParams);
                        _a.sent();
                        // console.log("Delete User Groups Success");
                        return [2 /*return*/, true];
                    case 2:
                        error_22 = _a.sent();
                        throw new expresError_1["default"]("Server Error - ".concat(this.caller, " - ").concat(error_22), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.disassociate_users_from_group_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM user_grouproles\n                WHERE user_grouproles IN (\n                    SELECT grouproles.id FROM grouproles\n                    WHERE grouproles.group_id = $1;\n                );\n                \n                DELETE FROM user_groups\n                WHERE user_groups.group_id = $1;", [
                                groupID
                            ])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_23 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete group association group -> users - ".concat(error_23), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.fetch_groups_by_user_id = function (userID, groupPublic) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rval, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        queryParams = [];
                        if (groupPublic !== undefined) {
                            query = "\n                    SELECT id, name, headline\n                    FROM sitegroups\n                    RIGHT JOIN user_groups\n                    ON sitegroups.id = user_groups.group_id\n                    WHERE user_groups.user_id = $1 AND sitegroups.public = $2";
                            queryParams.push(userID, groupPublic);
                        }
                        else {
                            query = "\n                    SELECT id, name, headline\n                    FROM sitegroups\n                    RIGHT JOIN user_groups\n                    ON sitegroups.id = user_groups.equip_id\n                    WHERE sitegroups.user_id = $1";
                            queryParams.push(userID);
                        }
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_24 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate user groups by user id - ".concat(error_24), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.fetch_group_users_by_group_id = function (groupID, userPublic) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rval, error_25;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        queryParams = [];
                        if (userPublic) {
                            query = "\n                    SELECT \n                        userprofile.user_id AS id, \n                        userprofile.username AS username\n                    FROM userprofile\n                    RIGHT JOIN user_groups\n                    ON userprofile.user_id = user_groups.user_id\n                    WHERE user_groups.group_id = $1 AND userprofile.public = $2";
                            queryParams.push(groupID, userPublic);
                        }
                        else {
                            query = "\n                    SELECT \n                        userprofile.user_id AS id, \n                        userprofile.username AS username\n                    FROM userprofile\n                    RIGHT JOIN user_groups\n                    ON userprofile.user_id = user_groups.user_id\n                    WHERE user_groups.group_id = $1";
                            queryParams.push(groupID);
                        }
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_25 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate group users by group id - ".concat(error_25), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.fetch_group_ids_by_user_id = function (userID, userRole) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rval, error_26;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        queryParams = [];
                        if (userRole !== undefined) {
                            query = "\n                SELECT\n                    sitegroups.id AS id\n                FROM sitegroups\n                LEFT JOIN user_groups ON user_groups.group_id = sitegroups.id\n                LEFT JOIN user_grouproles ON user_grouproles.user_id = user_groups.user_id\n                LEFT JOIN grouproles ON grouproles.id = user_grouproles.grouprole_id\n                WHERE user_groups.user_id = $1 AND grouproles.name = $2";
                            queryParams.push(userID, userRole);
                        }
                        else {
                            query = "\n                    SELECT\n                        sitegroups.id AS id\n                    FROM sitegroups\n                    LEFT JOIN user_groups ON user_groups.group_id = sitegroups.id\n                    WHERE user_groups.user_id = $1";
                            queryParams.push(userID);
                        }
                        ;
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_26 = _a.sent();
                        throw new expresError_1["default"]("Server Error - ".concat(this.caller, " - ").concat(error_26), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    GroupRepo.fetch_user_groups_by_user_id = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rval, error_27;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        queryParams = [];
                        query = "\n                SELECT \n                    user_groups.group_id AS id, \n                    userprofile.username\n                FROM userprofile\n                RIGHT JOIN user_groups\n                ON userprofile.account_id = user_groups.user_id\n                WHERE userprofile.account_id = $1";
                        queryParams.push(userID);
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_27 = _a.sent();
                        throw new expresError_1["default"]("Server Error - ".concat(this.caller, " - ").concat(error_27), 500);
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