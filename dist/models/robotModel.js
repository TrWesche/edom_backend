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
var robot_repository_1 = require("../repositories/robot.repository");
var expresError_1 = require("../utils/expresError");
var RobotModel = /** @class */ (function () {
    function RobotModel() {
    }
    /*    ____ ____  _____    _  _____ _____
         / ___|  _ \| ____|  / \|_   _| ____|
        | |   | |_) |  _|   / _ \ | | |  _|
        | |___|  _ <| |___ / ___ \| | | |___
         \____|_| \_\_____/_/   \_\_| |_____|
    */
    RobotModel.create_user_robot = function (userID, robotData) {
        return __awaiter(this, void 0, void 0, function () {
            var robot;
            return __generator(this, function (_a) {
                robot = robot_repository_1["default"].create_new_robot(robotData);
                // TODO: Associate robot with user
                return [2 /*return*/, robot];
            });
        });
    };
    ;
    RobotModel.create_group_robot = function (userID, groupID, robotData) {
        return __awaiter(this, void 0, void 0, function () {
            var robot;
            return __generator(this, function (_a) {
                robot = robot_repository_1["default"].create_new_robot(robotData);
                // TODO Associate robot with group
                return [2 /*return*/, robot];
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
    RobotModel.retrieve_robot_by_robot_id = function (robotID) {
        return __awaiter(this, void 0, void 0, function () {
            var robot;
            return __generator(this, function (_a) {
                robot = robot_repository_1["default"].fetch_robot_by_robot_id(robotID);
                return [2 /*return*/, robot];
            });
        });
    };
    ;
    RobotModel.retrieve_robot_user_by_robot_id = function (robotID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    ;
    RobotModel.retrieve_robot_group_by_robot_id = function (robotID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    ;
    RobotModel.retrieve_robot_room_by_robot_id = function (robotID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
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
    RobotModel.modify_robot = function (robotID, robotData) {
        return __awaiter(this, void 0, void 0, function () {
            var robot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, robot_repository_1["default"].update_robot_by_robot_id(robotID, robotData)];
                    case 1:
                        robot = _a.sent();
                        if (!robot) {
                            throw new expresError_1["default"]("Unable to update target robot", 400);
                        }
                        return [2 /*return*/, robot];
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
    RobotModel.delete_user_robot = function (userID, robotID) {
        return __awaiter(this, void 0, void 0, function () {
            var robot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, robot_repository_1["default"].delete_robot_by_robot_id(robotID)];
                    case 1:
                        robot = _a.sent();
                        if (!robot) {
                            throw new expresError_1["default"]("Unable to delete target robot", 400);
                        }
                        return [2 /*return*/, robot];
                }
            });
        });
    };
    ;
    RobotModel.delete_group_robot = function (userID, groupID, robotID) {
        return __awaiter(this, void 0, void 0, function () {
            var robot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, robot_repository_1["default"].delete_robot_by_robot_id(robotID)];
                    case 1:
                        robot = _a.sent();
                        if (!robot) {
                            throw new expresError_1["default"]("Unable to delete target robot", 400);
                        }
                        return [2 /*return*/, robot];
                }
            });
        });
    };
    ;
    RobotModel.remove_robot_from_room = function (robotID, roomID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    ;
    return RobotModel;
}());
exports["default"] = RobotModel;
//# sourceMappingURL=robotModel.js.map