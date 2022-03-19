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
var EquipmentRepo = /** @class */ (function () {
    function EquipmentRepo() {
    }
    EquipmentRepo.create_new_equip = function (equipData) {
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
                        for (key in equipData) {
                            if (equipData[key] !== undefined) {
                                queryColumns.push(key);
                                queryColIdxs.push("$".concat(idx));
                                queryParams.push(equipData[key]);
                                idx++;
                            }
                        }
                        ;
                        query = "\n                INSERT INTO equipment \n                    (".concat(queryColumns.join(","), ") \n                VALUES (").concat(queryColIdxs.join(","), ") \n                RETURNING id, name, category_id, headline, description, public, configuration");
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_1 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create new equipment - ".concat(error_1), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.fetch_equip_by_equip_id = function (equipID, equipPublic) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rval, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        queryParams = [];
                        if (equipPublic !== undefined) {
                            query = "\n                    SELECT id, name, category_id, headline, description, public, configuration\n                    FROM equipment\n                    WHERE id = $1 AND public = $2";
                            queryParams.push(equipID, equipPublic);
                        }
                        else {
                            query = "\n                    SELECT id, name, category_id, headline, description, public, configuration\n                    FROM equipment\n                    WHERE id = $1";
                            queryParams.push(equipID);
                        }
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_2 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate equipment by equipment id - ".concat(error_2), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.fetch_equip_list_paginated = function (limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("\n                SELECT id, name, category_id, headline\n                FROM equipment\n                WHERE equipment.public = TRUE\n                LIMIT $1\n                OFFSET $2", [limit, offset])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_3 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate equipment - ".concat(error_3), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.update_equip_by_equip_id = function (equipID, equipData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, query, values, result, rval, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = (0, createUpdateQueryPGSQL_1["default"])("equipment", equipData, "id", equipID), query = _a.query, values = _a.values;
                        return [4 /*yield*/, pgdb_1["default"].query(query, values)];
                    case 1:
                        result = _b.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_4 = _b.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to update equipment - ".concat(error_4), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.delete_equip_by_equip_id = function (equipID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM equipment \n                WHERE id = $1\n                RETURNING id", [equipID])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_5 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete equipment - ".concat(error_5), 500);
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
    EquipmentRepo.associate_user_to_equip = function (userID, equipID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("INSERT INTO user_equipment \n                    (user_id, equip_id) \n                VALUES ($1, $2) \n                RETURNING user_id, equip_id", [
                                userID,
                                equipID
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_6 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create equipment association user -> equipment - ".concat(error_6), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.disassociate_user_from_equip = function (userID, equipID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM user_equipment\n                WHERE user_id = $1 AND equip_id = $2\n                RETURNING user_id, equip_id", [
                                userID,
                                equipID
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_7 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete equipment association user -> equipment - ".concat(error_7), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.fetch_equip_by_user_id = function (userID, equipPublic) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rval, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        queryParams = [];
                        if (equipPublic !== undefined) {
                            query = "\n                    SELECT id, name, category_id, headline\n                    FROM equipment\n                    RIGHT JOIN user_equipment\n                    ON equipment.id = user_equipment.equip_id\n                    WHERE user_equipment.user_id = $1 AND equipment.public = $2";
                            queryParams.push(userID, equipPublic);
                        }
                        else {
                            query = "\n                    SELECT id, name, category_id, headline, public\n                    FROM equipment\n                    RIGHT JOIN user_equipment\n                    ON equipment.id = user_equipment.equip_id\n                    WHERE user_equipment.user_id = $1";
                            queryParams.push(userID);
                        }
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_8 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate equipment by user id - ".concat(error_8), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.fetch_public_equip_list_by_user_id = function (userID, limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("\n                SELECT\n                    equipment.id AS id,\n                    equipment.name AS name,\n                    equipment.headline AS headline,\n                    equipment.description AS description,\n                    equipment.image_url AS image_url,\n                    equipment.category_id AS category_id\n                FROM equipment\n                LEFT JOIN user_equipment ON equipment.id = user_equipment.equip_id\n                WHERE user_equipment.user_id = $1 AND equipment.public = TRUE\n                LIMIT $2\n                OFFSET $3", [userID, limit, offset])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_9 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate equip - ".concat(error_9), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.fetch_unrestricted_equip_list_by_user_id = function (userID, limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("\n                SELECT\n                    equipment.id AS id,\n                    equipment.name AS name,\n                    equipment.headline AS headline,\n                    equipment.description AS description,\n                    equipment.image_url AS image_url,\n                    equipment.category_id AS category_id\n                FROM equipment\n                LEFT JOIN user_equipment ON equipment.id = user_equipment.equip_id\n                WHERE user_equipment.user_id = $1\n                LIMIT $2\n                OFFSET $3", [userID, limit, offset])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_10 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate equip - ".concat(error_10), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.delete_equip_by_user_id = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_1, idxParams_1, query, queryParams_1, error_11;
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
                        query = "\n                DELETE FROM equipment\n                WHERE equipment.id IN (\n                    SELECT equipment.id FROM equipment\n                    LEFT JOIN user_equipment ON user_equipment.equip_id = equipment.id\n                    WHERE user_equipment.user_id IN  (".concat(idxParams_1.join(', '), ")\n                )");
                        // console.log("Delete Equip by UserID Called");
                        // console.log(query);
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_1)];
                    case 1:
                        // console.log("Delete Equip by UserID Called");
                        // console.log(query);
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_11 = _a.sent();
                        throw new expresError_1["default"]("Server Error - ".concat(this.caller, " - ").concat(error_11), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.delete_user_equip_by_user_id = function (userID) {
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
                        userID.forEach(function (val) {
                            if (val.id) {
                                queryParams_2.push(val.id);
                                idxParams_2.push("$".concat(idx_2));
                                idx_2++;
                            }
                            ;
                        });
                        query = "\n                DELETE FROM user_equipment\n                WHERE user_equipment.user_id IN (".concat(idxParams_2.join(', '), ")");
                        // console.log("Delete User Equip by UserID Called");
                        // console.log(query);
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_2)];
                    case 1:
                        // console.log("Delete User Equip by UserID Called");
                        // console.log(query);
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
    //      ____ ____   ___  _   _ ____  
    //     / ___|  _ \ / _ \| | | |  _ \ 
    //    | |  _| |_) | | | | | | | |_) |
    //    | |_| |  _ <| |_| | |_| |  __/ 
    //     \____|_| \_\\___/ \___/|_|    
    EquipmentRepo.associate_group_to_equip = function (groupID, equipID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("INSERT INTO group_equipment \n                    (group_id, equip_id) \n                VALUES ($1, $2) \n                RETURNING group_id, equip_id", [
                                groupID,
                                equipID
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_13 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create equipment association group -> equipment - ".concat(error_13), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.disassociate_group_from_equip = function (groupID, equipID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM group_equipment\n                WHERE group_id = $1 AND equip_id = $2\n                RETURNING group_id, equip_id", [
                                groupID,
                                equipID
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_14 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete equipment association group -> equipment - ".concat(error_14), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.fetch_equip_by_group_id = function (groupID, equipPublic) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rval, error_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        queryParams = [];
                        if (equipPublic !== undefined) {
                            query = "\n                    SELECT id, name, category_id, headline\n                    FROM equipment\n                    RIGHT JOIN group_equipment\n                    ON equipment.id = group_equipment.equip_id\n                    WHERE group_equipment.group_id = $1 AND equipment.public = $2";
                            queryParams.push(groupID, equipPublic);
                        }
                        else {
                            query = "\n                    SELECT id, name, category_id, headline, public\n                    FROM equipment\n                    RIGHT JOIN group_equipment\n                    ON equipment.id = group_equipment.equip_id\n                    WHERE group_equipment.group_id = $1";
                            queryParams.push(groupID);
                        }
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_15 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate equipment by group id - ".concat(error_15), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.delete_equip_by_group_id = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var idx_3, idxParams_3, query, queryParams_3, error_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        idx_3 = 1;
                        idxParams_3 = [];
                        query = void 0;
                        queryParams_3 = [];
                        groupID.forEach(function (val) {
                            if (val.id) {
                                queryParams_3.push(val.id);
                                idxParams_3.push("$".concat(idx_3));
                                idx_3++;
                            }
                            ;
                        });
                        query = "\n                DELETE FROM equipment\n                WHERE equipment.id IN (\n                    SELECT equipment.id FROM equipment\n                    LEFT JOIN group_equipment ON group_equipment.equipment_id = equipment.id\n                    WHERE group_equipment.group_id IN (".concat(idxParams_3.join(', '), ");\n                );\n                \n                DELETE FROM group_equipment\n                WHERE group_equipment.group_id IN (").concat(idxParams_3.join(', '), ");");
                        console.log(query);
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams_3)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        error_16 = _a.sent();
                        throw new expresError_1["default"]("Server Error - ".concat(this.caller, " - ").concat(error_16), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    //  ____   ___   ___  __  __ 
    // |  _ \ / _ \ / _ \|  \/  |
    // | |_) | | | | | | | |\/| |
    // |  _ <| |_| | |_| | |  | |
    // |_| \_\\___/ \___/|_|  |_|
    EquipmentRepo.associate_room_to_equip = function (roomID, equipID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_17;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("INSERT INTO room_equipment \n                    (room_id, equip_id) \n                VALUES ($1, $2) \n                RETURNING room_id, equip_id", [
                                roomID,
                                equipID
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_17 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to create equipment association room -> equipment - ".concat(error_17), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.disassociate_room_from_equip_by_room_equip_id = function (roomID, equipID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_18;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM room_equipment\n                WHERE room_id = $1 AND equip_id = $2\n                RETURNING room_id, equip_id", [
                                roomID,
                                equipID
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_18 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete equipment association room -> equipment - ".concat(error_18), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.disassociate_room_from_equip_by_room_id = function (roomID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_19;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM room_equipment\n                WHERE room_id = $1\n                RETURNING room_id", [
                                roomID
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_19 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete equipment associations room -> equipment, all room instances - ".concat(error_19), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.disassociate_room_from_equip_by_equip_id = function (equipID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, rval, error_20;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, pgdb_1["default"].query("DELETE FROM room_equipment\n                WHERE equip_id = $1\n                RETURNING room_id, equip_id", [
                                equipID
                            ])];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_20 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to delete equipment associations room -> equipment, all equipment instances - ".concat(error_20), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.fetch_equip_by_room_id = function (roomID, roomPublic) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rval, error_21;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        queryParams = [];
                        if (roomPublic !== undefined) {
                            query = "\n                    SELECT id, name, category_id, headline\n                    FROM equipment\n                    RIGHT JOIN room_equipment\n                    ON equipment.id = room_equipment.equip_id\n                    WHERE room_equipment.room_id = $1 AND equipment.public = $2";
                            queryParams.push(roomID, roomPublic);
                        }
                        else {
                            query = "\n                    SELECT id, name, category_id, headline\n                    FROM equipment\n                    RIGHT JOIN room_equipment\n                    ON equipment.id = room_equipment.equip_id\n                    WHERE room_equipment.room_id = $1";
                            queryParams.push(roomID);
                        }
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_21 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate equipment by room id - ".concat(error_21), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.fetch_equip_rooms_by_equip_id = function (equipID) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rval, error_22;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                    SELECT id, name\n                    FROM rooms\n                    RIGHT JOIN room_equipment\n                    ON rooms.id = room_equipment.room_id\n                    WHERE room_equipment.equip_id = $1";
                        queryParams = [equipID];
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows;
                        return [2 /*return*/, rval];
                    case 2:
                        error_22 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate equipment rooms by equip id - ".concat(error_22), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.fetch_equip_by_group_and_equip_id = function (groupID, equipID) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rval, error_23;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                SELECT id, name\n                FROM equipment\n                RIGHT JOIN group_equipment\n                ON equipment.id = group_equipment.equip_id\n                WHERE group_equipment.group_id = $1 AND group_equipment.equip_id = $2";
                        queryParams = [groupID, equipID];
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_23 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate equipment with target group & equip id combination - ".concat(error_23), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    EquipmentRepo.fetch_equip_by_user_and_equip_id = function (userID, equipID) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryParams, result, rval, error_24;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "\n                SELECT id, name\n                FROM equipment\n                RIGHT JOIN user_equipment\n                ON equipment.id = user_equipment.equip_id\n                WHERE user_equipment.user_id = $1 AND user_equipment.equip_id = $2";
                        queryParams = [userID, equipID];
                        return [4 /*yield*/, pgdb_1["default"].query(query, queryParams)];
                    case 1:
                        result = _a.sent();
                        rval = result.rows[0];
                        return [2 /*return*/, rval];
                    case 2:
                        error_24 = _a.sent();
                        throw new expresError_1["default"]("An Error Occured: Unable to locate equipment with target user & equip id combination - ".concat(error_24), 500);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    return EquipmentRepo;
}());
exports["default"] = EquipmentRepo;
//# sourceMappingURL=equipment.repository.js.map