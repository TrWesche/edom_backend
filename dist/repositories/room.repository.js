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
var RoomRepo = /** @class */ (function () {
    function RoomRepo() {
    }
    RoomRepo.create_new_room = function (roomData) {
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
                        for (key in roomData) {
                            if (roomData[key] !== undefined) {
                                queryColumns.push(key);
                                queryColIdxs.push("$".concat(idx));
                                queryParams.push(roomData[key]);
                                idx++;
                            }
                        }
                        ;
                        query = "\n                INSERT INTO rooms \n                    (".concat(queryColumns.join(","), ") \n                VALUES (").concat(queryColIdxs.join(","), ") \n                RETURNING id, name, category_id, headline, description, public");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_1 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create new room - ".concat(error_1), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    RoomRepo.fetch_room_by_room_id = function (roomID, roomPublic) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rval, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        queryParams = [];
                        if (roomPublic !== undefined) {
                            query = "\n                    SELECT id, name, category_id, headline, description, public\n                    FROM rooms\n                    WHERE id = $1 AND public = $2";
                            queryParams.push(roomID, roomPublic);
                        }
                        else {
                            query = "\n                    SELECT id, name, category_id, headline, description, public\n                    FROM rooms\n                    WHERE id = $1";
                            queryParams.push(roomID);
                        }
                        ;
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_2 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate room - ".concat(error_2), 500);
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    RoomRepo.fetch_room_list_paginated = function (limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("\n                SELECT id, name, category_id, headline\n                FROM rooms\n                WHERE rooms.public = TRUE\n                LIMIT $1\n                OFFSET $2", [limit, offset])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_3 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate rooms - ".concat(error_3), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    RoomRepo.update_room_by_room_id = function (roomID, roomData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, values, result, rval, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = (0, createUpdateQueryPGSQL_1["default"])("rooms", roomData, "id", roomID), query = _a.query, values = _a.values;
                        return [4 /*yield*/, pgdb_1["default"].query(query, values)];
                    case 1:
                        result = _b.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_4 = _b.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to update room - ".concat(error_4), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    RoomRepo.delete_room_by_room_id = function (roomID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM rooms \n                WHERE id = $1\n                RETURNING id", [roomID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_5 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete room - ".concat(error_5), 500);
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
    RoomRepo.associate_user_to_room = function (userID, roomID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("INSERT INTO user_rooms \n                    (user_id, room_id) \n                VALUES ($1, $2) \n                RETURNING user_id, room_id", [
                                userID,
                                roomID
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        // console.log("Return Value", rval);
                        return [2 /*return*/, rval];
                    case 2:
                        error_6 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create room association user -> room - ".concat(error_6), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    RoomRepo.disassociate_user_from_room = function (userID, roomID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM user_rooms\n                WHERE user_id = $1 AND room_id = $2\n                RETURNING user_id, room_id", [
                                userID,
                                roomID
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_7 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete room association user -> room - ".concat(error_7), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    RoomRepo.fetch_rooms_by_user_id = function (userID, roomPublic) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rval, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        queryParams = [];
                        if (roomPublic !== undefined) {
                            query = "\n                    SELECT id, name, category_id, headline\n                    FROM rooms\n                    RIGHT JOIN user_rooms\n                    ON rooms.id = user_rooms.room_id\n                    WHERE user_rooms.user_id = $1 AND rooms.public = $2";
                            queryParams.push(userID, roomPublic);
                        }
                        else {
                            query = "\n                    SELECT id, name, category_id, headline\n                    FROM rooms\n                    RIGHT JOIN user_rooms\n                    ON rooms.id = user_rooms.room_id\n                    WHERE user_rooms.user_id = $1";
                            queryParams.push(userID);
                        }
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_8 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate rooms by user id - ".concat(error_8), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    RoomRepo.delete_room_by_user_id = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_1, idxParams_1, query, queryParams_1, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_1 = 1;
                        idxParams_1 = [];
                        query = void 0;
                        queryParams_1 = [];
                        userID.forEach(function (val) {
                            if (val.id) {
                                queryParams_1.push(val.id);
                                idxParams_1.push("$".concat(idx_1));
                                idx_1++;
                            }
                            ;
                        });
                        query = "\n                DELETE FROM rooms\n                WHERE rooms.id IN (\n                    SELECT rooms.id FROM rooms\n                    LEFT JOIN user_rooms ON user_rooms.room_id = rooms.id\n                    WHERE user_rooms.user_id IN (".concat(idxParams_1.join(', '), ")\n                );\n\n                DELETE FROM user_rooms\n                WHERE user_rooms.user_id IN (").concat(idxParams_1.join(', '), ");");
                        console.log(query);
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_1)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_9 = _a.sent();
                        throw new expresError_1["default"]("Server Error - ".concat(this.caller, " - ").concat(error_9), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    //      ____ ____   ___  _   _ ____  
    //     / ___|  _ \ / _ \| | | |  _ \ 
    //    | |  _| |_) | | | | | | | |_) |
    //    | |_| |  _ <| |_| | |_| |  __/ 
    //     \____|_| \_\\___/ \___/|_|    
    RoomRepo.associate_group_to_room = function (groupID, roomID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("INSERT INTO group_rooms \n                    (group_id, room_id) \n                VALUES ($1, $2) \n                RETURNING group_id, room_id", [
                                groupID,
                                roomID
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_10 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create room association group -> room - ".concat(error_10), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    RoomRepo.disassociate_group_from_room = function (groupId, roomID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM group_rooms\n                WHERE group_id = $1 AND room_id = $2\n                RETURNING group_id, room_id", [
                                groupId,
                                roomID
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_11 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete room association group -> room - ".concat(error_11), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    RoomRepo.delete_room_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_2, idxParams_2, query, queryParams_2, error_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_2 = 1;
                        idxParams_2 = [];
                        query = void 0;
                        queryParams_2 = [];
                        groupID.forEach(function (val) {
                            if (val.id) {
                                queryParams_2.push(val.id);
                                idxParams_2.push("$".concat(idx_2));
                                idx_2++;
                            }
                            ;
                        });
                        query = "\n                DELETE FROM rooms\n                WHERE rooms.id IN (\n                    SELECT rooms.id FROM rooms\n                    LEFT JOIN group_rooms ON group_rooms.room_id = rooms.id\n                    WHERE group_rooms.group_id IN (".concat(idxParams_2.join(', '), ");\n                );\n                \n                DELETE FROM group_rooms\n                WHERE group_rooms.group_id IN (").concat(idxParams_2.join(', '), ");");
                        console.log(query);
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_2)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_12 = _a.sent();
                        throw new expresError_1["default"]("Server Error - ".concat(this.caller, " - ").concat(error_12), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    RoomRepo.fetch_rooms_by_group_id = function (groupID, roomPublic) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rval, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        queryParams = [];
                        if (roomPublic !== undefined) {
                            query = "\n                    SELECT id, name, category_id, headline\n                    FROM rooms\n                    RIGHT JOIN group_rooms\n                    ON rooms.id = group_rooms.room_id\n                    WHERE group_rooms.group_id = $1 AND rooms.public = $2";
                            queryParams.push(groupID, roomPublic);
                        }
                        else {
                            query = "\n                    SELECT id, name, category_id, headline\n                    FROM rooms\n                    RIGHT JOIN group_rooms\n                    ON rooms.id = group_rooms.room_id\n                    WHERE group_rooms.group_id = $1";
                            queryParams.push(groupID);
                        }
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_13 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate rooms by group id - ".concat(error_13), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    return RoomRepo;
}());
exports["default"] = RoomRepo;
//# sourceMappingURL=room.repository.js.map