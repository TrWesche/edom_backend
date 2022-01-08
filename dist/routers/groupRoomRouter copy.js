"use strict";
exports.__esModule = true;
var express = require("express");
var uuid_1 = require("uuid");
// Schema Imports
// Repo Imports
var groupRoomRouter = express.Router();
groupRoomRouter.post("/create", function (req, res, next) {
    var roomID = (0, uuid_1.v4)();
    var userID = (0, uuid_1.v4)();
    res.json({ roomID: roomID, userID: userID });
});
groupRoomRouter.get("/:roomId/newUser", function (req, res, next) {
    try {
        var userID = (0, uuid_1.v4)();
        // console.log(`MSG rtcRouter.js: Adding Participant: ${userId}`);
        res.json({ userID: userID });
    }
    catch (error) {
        console.log("".concat(error));
    }
});
exports["default"] = groupRoomRouter;
//# sourceMappingURL=groupRoomRouter%20copy.js.map