import * as express from "express";
import { v4 as uuidv4 } from "uuid";

const roomRouter = express.Router();

roomRouter.get("/new", (req, res, next) => {
    const roomID = uuidv4();
    const userID = uuidv4();
    res.json({roomID, userID})
})

roomRouter.get("/:roomId/newUser", (req, res, next) => {
    try {
        const userID = uuidv4();
        // console.log(`MSG rtcRouter.js: Adding Participant: ${userId}`);
        res.json({userID})
    } catch (error) {
        console.log(`${error}`)
    }
})

export default roomRouter;