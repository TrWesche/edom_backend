import * as ws from "ws";
import * as https from "https";
import { wsEnable } from "../config/config";
import * as msgTypes from "./_wrtcSigChMsgTypes.json";

// TODO: When Redis is up and running replace this in memory store
const tempRoomStore = {};

const wssHandler = (server: https.Server) => {
    if ( wsEnable ) {
        console.log("Web Socket Enabled, setting up websocket server");
        const wss = new ws.Server({ server });
        wss.on("connection", (ws) => {
            ws.on("message", (msg: string) => {
                msgTypeRouter(msg, ws);
            })

            ws.send(JSON.stringify({type: msgTypes.outgoing.s2cSignalConnEstablished}));
        })
    } else {
        console.log("Web Socket Disabled")
    }
};

const msgTypeRouter = (msg: string, socket: ws.WebSocket) => {
    const message = JSON.parse(msg);
    console.log("Received Message");
    console.log(message);
    switch(message.type) {
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

const broadcastChannelEntry = (roomID: string, srcUID: string, socket: ws.WebSocket) => {
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
        }
    }

    tempRoomStore[roomID].members[srcUID].ws = socket;

    const payload = JSON.stringify(
        {
            type: msgTypes.outgoing.s2cChannelEnter,
            srcUID: srcUID
        }
    );

    broadcastToChannel(roomID, srcUID, payload);
};

const broadcastChannelExit = (roomID: string, srcUID: string) => {
    if (tempRoomStore[roomID].members[srcUID]) {
        delete tempRoomStore[roomID].members[srcUID];
        
        if (Object.keys(tempRoomStore[roomID].members).length === 0) {
            delete tempRoomStore[roomID]
        } else {
            const payload = JSON.stringify(
                {
                    type: msgTypes.outgoing.s2cChannelExit,
                    srcUID: srcUID
                }
            );

            broadcastToChannel(roomID, srcUID, payload)
        }
    } else {
        console.log("Error: Unable to find target participant");
    }
};

const forwardOfferToTarget = (roomID: string, srcUID: string, trgtUID: string, offer: RTCSdpType) => {
    // console.log(`Forwarding to ${trgtUID}: rid-${roomID}, originUID-${srcUID}, ${offer.type}`);
    const payload = JSON.stringify(
        {
            type: msgTypes.outgoing.s2cSDPOffer,
            trgtUID: trgtUID,
            roomID: roomID,
            srcUID: srcUID,
            offer: offer
        }
    );

    forwardToTarget(roomID, trgtUID, payload);
};

const forwardAnswerToTarget = (roomID: string, srcUID: string, trgtUID: string, answer: RTCSdpType) => {
    const payload = JSON.stringify(
        {
            type: msgTypes.outgoing.s2cSDPAnswer,
            trgtUID: trgtUID,
            roomID: roomID,
            srcUID: srcUID,
            answer: answer
        }
    );

    forwardToTarget(roomID, trgtUID, payload);
};

const broadcastChannelICECandidate = (roomID: string, srcUID: string, ice: RTCIceCandidateType) => {
    if (tempRoomStore[roomID].members[srcUID]) {
        const payload = JSON.stringify(
            {
                type: msgTypes.outgoing.s2cICECandidate,
                srcUID: srcUID,
                roomID: roomID,
                ice: ice
            }
        );

        broadcastToChannel(roomID, srcUID, payload)
    } else {
        console.log("Error: Unable to find target participant");
    }
};

const broadcastToChannel = (roomID: string, srcUID: string, payload: string) => {
    console.log(`Broadcasting payload from ${srcUID} to channel ${roomID}`);
    console.log(payload);
    // If the session store is not empty build the payload to send out to other channel members
    if (Object.keys(tempRoomStore[roomID].members).length > 0) {
        // Build the list of websockets to broadcast the payload on, excluding record to the sending member
        const targetMembersWS = [];
        Object.keys(tempRoomStore[roomID].members).forEach((member) => {
            if (member !== srcUID) {
                targetMembersWS.push(tempRoomStore[roomID].members[member].ws);
            }
        });

        // Send message to each channel member
        targetMembersWS.forEach((targetMemberWS) => {
            targetMemberWS.send(payload);
        });
        
    } else {
        console.log("Error: Unable to find members of the target room");
    }
};

const forwardToTarget = (roomID: string, trgtUID: string, payload: string) => {
    console.log(`Forwarding payload to ${trgtUID} in room ${roomID}`);
    console.log(payload);
    // If the session store is not empty build the payload to send out to other channel members
    if (tempRoomStore[roomID].members[trgtUID] !== undefined) {
        // Build the list of websockets to broadcast the payload on, excluding record to the sending member
        const targetMemberWS = tempRoomStore[roomID].members[trgtUID].ws;
        targetMemberWS.send(payload);
    } else {
        console.log("Error: Encountered an error sending the payload to the target user");
    }
};


export default wssHandler;
