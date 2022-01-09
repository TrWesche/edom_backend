import * as express from "express";
import { v4 as uuidv4 } from "uuid";

// Utility Functions Import
import ExpressError from "../utils/expresError";

// Schema Imports

// Repo Imports



const groupRouter = express.Router();

groupRouter.post("/create", (req, res, next) => {
    const roomID = uuidv4();
    const userID = uuidv4();
    res.json({roomID, userID})
})

groupRouter.get("/gp/:groupID", (req, res, next) => {
    try {
        const userID = uuidv4();
        // console.log(`MSG rtcRouter.js: Adding Participant: ${userId}`);
        res.json({userID})
    } catch (error) {
        console.log(`${error}`)
    }
})

export default groupRouter;