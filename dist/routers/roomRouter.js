"use strict";
exports.__esModule = true;
var express = require("express");
var uuid_1 = require("uuid");
var roomRouter = express.Router();
roomRouter.get("/new", function (req, res, next) {
    var roomID = (0, uuid_1.v4)();
    var userID = (0, uuid_1.v4)();
    res.json({ roomID: roomID, userID: userID });
});
roomRouter.get("/:roomId/newUser", function (req, res, next) {
    try {
        var userID = (0, uuid_1.v4)();
        // console.log(`MSG rtcRouter.js: Adding Participant: ${userId}`);
        res.json({ userID: userID });
    }
    catch (error) {
        console.log("".concat(error));
    }
});
exports["default"] = roomRouter;
//# sourceMappingURL=roomRouter.js.map