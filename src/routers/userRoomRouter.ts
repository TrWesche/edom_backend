import * as express from "express";
import { v4 as uuidv4 } from "uuid";

// Utility Functions Import
import ExpressError from "../utils/expresError";

// Schema Imports
import validateUserRoomCreateSchema, { UserRoomCreateProps } from "../schemas/room/userRoomCreateSchema";
import validateUserRoomUpdateSchema, { UserRoomUpdateProps } from "../schemas/room/userRoomUpdateSchema";

// Repo Imports



const userRoomRouter = express.Router();

userRoomRouter.post("/create", (req, res, next) => {
    const roomID = uuidv4();
    const userID = uuidv4();
    res.json({roomID, userID})
})

userRoomRouter.get("/:roomId/newUser", (req, res, next) => {
    try {
        const userID = uuidv4();
        // console.log(`MSG rtcRouter.js: Adding Participant: ${userId}`);
        res.json({userID})
    } catch (error) {
        console.log(`${error}`)
    }
})

export default userRoomRouter;