"use strict";
exports.__esModule = true;
var ws = require("ws");
var config_1 = require("../config/config");
var msgTypes = require("./_wrtcSigChMsgTypes.json");
// TODO: When Redis is up and running replace this in memory store
var tempRoomStore = {};
var wssHandler = function (server) {
    if (config_1.wsEnable) {
        console.log("Web Socket Enabled, setting up websocket server");
        var wss = new ws.Server({ server: server });
        wss.on("connection", function (ws) {
            ws.on("message", function (msg) {
                msgTypeRouter(msg, ws);
            });
            ws.send(JSON.stringify({ type: msgTypes.outgoing.s2cSignalConnEstablished }));
        });
    }
    else {
        console.log("Web Socket Disabled");
    }
};
var msgTypeRouter = function (msg, socket) {
    var message = JSON.parse(msg);
    console.log("Received Message");
    console.log(message);
    switch (message.type) {
        case msgTypes.incoming.c2sChannelEnter:
            broadcastChannelEntry(message.roomID, message.srcUID, socket);
            break;
        case msgTypes.incoming.c2sChannelExit:
            broadcastChannelExit(message.roomID, message.srcUID);
            break;
        case msgTypes.incoming.c2sSDPOffer:
            forwardOfferToTarget(message.roomID, message.srcUID, message.trgtUID, message.offer);
            break;
        case msgTypes.incoming.c2sSDPAnswer:
            forwardAnswerToTarget(message.roomID, message.srcUID, message.trgtUID, message.answer);
            break;
        case msgTypes.incoming.c2sICECandidate:
            broadcastChannelICECandidate(message.roomID, message.srcUID, message.ice);
            break;
        default:
            console.log(message);
            console.log("Message Type Not Found");
    }
};
var broadcastChannelEntry = function (roomID, srcUID, socket) {
    if (!tempRoomStore[roomID]) {
        tempRoomStore[roomID] = {
            members: {}
        };
    }
    if (!tempRoomStore[roomID].members[srcUID]) {
        tempRoomStore[roomID].members[srcUID] = {
            ws: {},
            sdp: {},
            ice: {}
        };
    }
    tempRoomStore[roomID].members[srcUID].ws = socket;
    var payload = JSON.stringify({
        type: msgTypes.outgoing.s2cChannelEnter,
        srcUID: srcUID
    });
    broadcastToChannel(roomID, srcUID, payload);
};
var broadcastChannelExit = function (roomID, srcUID) {
    if (tempRoomStore[roomID].members[srcUID]) {
        delete tempRoomStore[roomID].members[srcUID];
        if (Object.keys(tempRoomStore[roomID].members).length === 0) {
            delete tempRoomStore[roomID];
        }
        else {
            var payload = JSON.stringify({
                type: msgTypes.outgoing.s2cChannelExit,
                srcUID: srcUID
            });
            broadcastToChannel(roomID, srcUID, payload);
        }
    }
    else {
        console.log("Error: Unable to find target participant");
    }
};
var forwardOfferToTarget = function (roomID, srcUID, trgtUID, offer) {
    // console.log(`Forwarding to ${trgtUID}: rid-${roomID}, originUID-${srcUID}, ${offer.type}`);
    var payload = JSON.stringify({
        type: msgTypes.outgoing.s2cSDPOffer,
        trgtUID: trgtUID,
        roomID: roomID,
        srcUID: srcUID,
        offer: offer
    });
    forwardToTarget(roomID, trgtUID, payload);
};
var forwardAnswerToTarget = function (roomID, srcUID, trgtUID, answer) {
    var payload = JSON.stringify({
        type: msgTypes.outgoing.s2cSDPAnswer,
        trgtUID: trgtUID,
        roomID: roomID,
        srcUID: srcUID,
        answer: answer
    });
    forwardToTarget(roomID, trgtUID, payload);
};
var broadcastChannelICECandidate = function (roomID, srcUID, ice) {
    if (tempRoomStore[roomID].members[srcUID]) {
        var payload = JSON.stringify({
            type: msgTypes.outgoing.s2cICECandidate,
            srcUID: srcUID,
            roomID: roomID,
            ice: ice
        });
        broadcastToChannel(roomID, srcUID, payload);
    }
    else {
        console.log("Error: Unable to find target participant");
    }
};
var broadcastToChannel = function (roomID, srcUID, payload) {
    console.log("Broadcasting payload from ".concat(srcUID, " to channel ").concat(roomID));
    console.log(payload);
    // console.log("Broadcast to Channel Temp Room Store");
    // console.log(tempRoomStore);
    // If the session store is not empty build the payload to send out to other channel members
    if (Object.keys(tempRoomStore[roomID].members).length > 0) {
        // Build the list of websockets to broadcast the payload on, excluding record to the sending member
        var targetMembersWS_1 = [];
        Object.keys(tempRoomStore[roomID].members).forEach(function (member) {
            if (member !== srcUID) {
                targetMembersWS_1.push(tempRoomStore[roomID].members[member].ws);
            }
        });
        // Send message to each channel member
        targetMembersWS_1.forEach(function (targetMemberWS) {
            // console.log("Broadcast to channel");
            // console.log(typeof targetMemberWS);
            // console.log(targetMemberWS);
            targetMemberWS.send(payload);
        });
    }
    else {
        console.log("Error: Unable to find members of the target room");
    }
};
var forwardToTarget = function (roomID, trgtUID, payload) {
    console.log("Forwarding payload to ".concat(trgtUID, " in room ").concat(roomID));
    console.log(payload);
    // console.log("Forward to Target Temp Room Store");
    // console.log(tempRoomStore);
    // If the session store is not empty build the payload to send out to other channel members
    if (tempRoomStore[roomID].members[trgtUID] !== undefined) {
        // Build the list of websockets to broadcast the payload on, excluding record to the sending member
        var targetMemberWS = tempRoomStore[roomID].members[trgtUID].ws;
        targetMemberWS.send(payload);
    }
    else {
        console.log("Error: Encountered an error sending the payload to the target user");
    }
};
exports["default"] = wssHandler;
//# sourceMappingURL=websocket.js.map