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
// Repositories
var room_repository_1 = require("../repositories/room.repository");
var transactionRepository_1 = require("../repositories/transactionRepository");
// Utility Functions
var expresError_1 = require("../utils/expresError");
var equipment_repository_1 = require("../repositories/equipment.repository");
var RoomModel = /** @class */ (function () {
    function RoomModel() {
    }
    /*    ____ ____  _____    _  _____ _____
         / ___|  _ \| ____|  / \|_   _| ____|
        | |   | |_) |  _|   / _ \ | | |  _|
        | |___|  _ <| |___ / ___ \| | | |___
         \____|_| \_\_____/_/   \_\_| |_____|
    */
    RoomModel.create_user_room = function (userID, data) {
        return __awaiter(this, void 0, void 0, function () {
            var room, roomAssoc, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Preflight
                        if (!data.name || !data.category_id) {
                            throw new expresError_1["default"]("Invalid Create Room Call", 400);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 8]);
                        return [4 /*yield*/, transactionRepository_1["default"].begin_transaction()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, room_repository_1["default"].create_new_room(data)];
                    case 3:
                        room = _a.sent();
                        if (!(room === null || room === void 0 ? void 0 : room.id)) {
                            throw new expresError_1["default"]("Error while creating new room entry", 500);
                        }
                        return [4 /*yield*/, room_repository_1["default"].associate_user_to_room(userID, room.id)];
                    case 4:
                        roomAssoc = _a.sent();
                        if (!(roomAssoc === null || roomAssoc === void 0 ? void 0 : roomAssoc.user_id)) {
                            throw new expresError_1["default"]("Error while associating user to room entry", 500);
                        }
                        // Commit to Database
                        return [4 /*yield*/, transactionRepository_1["default"].commit_transaction()];
                    case 5:
                        // Commit to Database
                        _a.sent();
                        return [2 /*return*/, room];
                    case 6:
                        error_1 = _a.sent();
                        return [4 /*yield*/, transactionRepository_1["default"].rollback_transaction()];
                    case 7:
                        _a.sent();
                        throw new expresError_1["default"](error_1.message, error_1.status);
                    case 8:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    RoomModel.create_group_room = function (groupID, data) {
        return __awaiter(this, void 0, void 0, function () {
            var room, roomAssoc, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Preflight
                        if (!data.name || !data.category_id) {
                            throw new expresError_1["default"]("Invalid Create Room Call", 400);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 8]);
                        return [4 /*yield*/, transactionRepository_1["default"].begin_transaction()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, room_repository_1["default"].create_new_room(data)];
                    case 3:
                        room = _a.sent();
                        if (!(room === null || room === void 0 ? void 0 : room.id)) {
                            throw new expresError_1["default"]("Error while creating new room entry", 500);
                        }
                        return [4 /*yield*/, room_repository_1["default"].associate_group_to_room(groupID, room.id)];
                    case 4:
                        roomAssoc = _a.sent();
                        if (!(roomAssoc === null || roomAssoc === void 0 ? void 0 : roomAssoc.room_id)) {
                            throw new expresError_1["default"]("Error while associating group to room entry", 500);
                        }
                        // Commit to Database
                        return [4 /*yield*/, transactionRepository_1["default"].commit_transaction()];
                    case 5:
                        // Commit to Database
                        _a.sent();
                        return [2 /*return*/, room];
                    case 6:
                        error_2 = _a.sent();
                        return [4 /*yield*/, transactionRepository_1["default"].rollback_transaction()];
                    case 7:
                        _a.sent();
                        throw new expresError_1["default"](error_2.message, error_2.status);
                    case 8:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    /*   ____  _____    _    ____
        |  _ \| ____|  / \  |  _ \
        | |_) |  _|   / _ \ | | | |
        |  _ <| |___ / ___ \| |_| |
        |_| \_\_____/_/   \_\____/
    */
    RoomModel.retrieve_room_by_room_id = function (roomID, roomPublic) {
        return __awaiter(this, void 0, void 0, function () {
            var room;
            return __generator(this, function (_a) {
                room = room_repository_1["default"].fetch_room_by_room_id(roomID, roomPublic);
                return [2 /*return*/, room];
            });
        });
    };
    ;
    RoomModel.retrieve_room_list_paginated = function (limit, offset) {
        return __awaiter(this, void 0, void 0, function () {
            var rooms;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, room_repository_1["default"].fetch_room_list_paginated(limit, offset)];
                    case 1:
                        rooms = _a.sent();
                        return [2 /*return*/, rooms];
                }
            });
        });
    };
    ;
    RoomModel.retrieve_user_rooms_by_user_id_public = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var rooms;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, room_repository_1["default"].fetch_rooms_by_user_id(userID, true)];
                    case 1:
                        rooms = _a.sent();
                        return [2 /*return*/, rooms];
                }
            });
        });
    };
    ;
    RoomModel.retrieve_user_rooms_by_user_id_all = function (userID) {
        return __awaiter(this, void 0, void 0, function () {
            var rooms;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, room_repository_1["default"].fetch_rooms_by_user_id(userID)];
                    case 1:
                        rooms = _a.sent();
                        return [2 /*return*/, rooms];
                }
            });
        });
    };
    ;
    RoomModel.retrieve_group_rooms_by_group_id_public = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var rooms;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, room_repository_1["default"].fetch_rooms_by_group_id(groupID, true)];
                    case 1:
                        rooms = _a.sent();
                        return [2 /*return*/, rooms];
                }
            });
        });
    };
    ;
    RoomModel.retrieve_group_rooms_by_group_id_all = function (groupID) {
        return __awaiter(this, void 0, void 0, function () {
            var rooms;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, room_repository_1["default"].fetch_rooms_by_group_id(groupID)];
                    case 1:
                        rooms = _a.sent();
                        return [2 /*return*/, rooms];
                }
            });
        });
    };
    ;
    /*   _   _ ____  ____    _  _____ _____
        | | | |  _ \|  _ \  / \|_   _| ____|
        | | | | |_) | | | |/ _ \ | | |  _|
        | |_| |  __/| |_| / ___ \| | | |___
         \___/|_|   |____/_/   \_\_| |_____|
    */
    RoomModel.modify_user_room = function (roomID, data) {
        return __awaiter(this, void 0, void 0, function () {
            var room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, room_repository_1["default"].update_room_by_room_id(roomID, data)];
                    case 1:
                        room = _a.sent();
                        if (!room) {
                            throw new expresError_1["default"]("Unable to update target user room", 400);
                        }
                        ;
                        return [2 /*return*/, room];
                }
            });
        });
    };
    ;
    RoomModel.modify_group_room = function (roomID, data) {
        return __awaiter(this, void 0, void 0, function () {
            var room;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, room_repository_1["default"].update_room_by_room_id(roomID, data)];
                    case 1:
                        room = _a.sent();
                        if (!room) {
                            throw new expresError_1["default"]("Unable to update target group room", 400);
                        }
                        ;
                        return [2 /*return*/, room];
                }
            });
        });
    };
    ;
    /*   ____  _____ _     _____ _____ _____
        |  _ \| ____| |   | ____|_   _| ____|
        | | | |  _| | |   |  _|   | | |  _|
        | |_| | |___| |___| |___  | | | |___
        |____/|_____|_____|_____| |_| |_____|
    */
    RoomModel.delete_user_room = function (userID, roomID) {
        return __awaiter(this, void 0, void 0, function () {
            var roomAssoc, equipAssoc, room, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 8]);
                        return [4 /*yield*/, transactionRepository_1["default"].begin_transaction()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, room_repository_1["default"].disassociate_user_from_room(userID, roomID)];
                    case 2:
                        roomAssoc = _a.sent();
                        if (!(roomAssoc === null || roomAssoc === void 0 ? void 0 : roomAssoc.room_id)) {
                            throw new expresError_1["default"]("Error while disassociating user from room entry", 500);
                        }
                        ;
                        return [4 /*yield*/, equipment_repository_1["default"].disassociate_room_from_equip_by_room_id(roomID)];
                    case 3:
                        equipAssoc = _a.sent();
                        if (!equipAssoc) {
                            throw new expresError_1["default"]("Error while disassociating equipment from room entry", 500);
                        }
                        ;
                        return [4 /*yield*/, room_repository_1["default"].delete_room_by_room_id(roomAssoc.room_id)];
                    case 4:
                        room = _a.sent();
                        if (!(room === null || room === void 0 ? void 0 : room.id)) {
                            throw new expresError_1["default"]("Error while deleting room entry", 500);
                        }
                        ;
                        // Commit to Database
                        return [4 /*yield*/, transactionRepository_1["default"].commit_transaction()];
                    case 5:
                        // Commit to Database
                        _a.sent();
                        return [2 /*return*/, room];
                    case 6:
                        error_3 = _a.sent();
                        return [4 /*yield*/, transactionRepository_1["default"].rollback_transaction()];
                    case 7:
                        _a.sent();
                        throw new expresError_1["default"](error_3.message, error_3.status);
                    case 8:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    RoomModel.delete_group_room = function (groupID, roomID) {
        return __awaiter(this, void 0, void 0, function () {
            var roomAssoc, room, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 7]);
                        return [4 /*yield*/, transactionRepository_1["default"].begin_transaction()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, room_repository_1["default"].disassociate_group_from_room(groupID, roomID)];
                    case 2:
                        roomAssoc = _a.sent();
                        if (!(roomAssoc === null || roomAssoc === void 0 ? void 0 : roomAssoc.room_id)) {
                            throw new expresError_1["default"]("Error while disassociating group from room entry", 500);
                        }
                        ;
                        return [4 /*yield*/, room_repository_1["default"].delete_room_by_room_id(roomAssoc.room_id)];
                    case 3:
                        room = _a.sent();
                        if (!(room === null || room === void 0 ? void 0 : room.id)) {
                            throw new expresError_1["default"]("Error while deleting room entry", 500);
                        }
                        ;
                        // Commit to Database
                        return [4 /*yield*/, transactionRepository_1["default"].commit_transaction()];
                    case 4:
                        // Commit to Database
                        _a.sent();
                        return [2 /*return*/, room];
                    case 5:
                        error_4 = _a.sent();
                        return [4 /*yield*/, transactionRepository_1["default"].rollback_transaction()];
                    case 6:
                        _a.sent();
                        throw new expresError_1["default"](error_4.message, error_4.status);
                    case 7:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    return RoomModel;
}());
exports["default"] = RoomModel;
//# sourceMappingURL=roomModel.js.map