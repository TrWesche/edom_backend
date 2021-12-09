import * as express from "express";

// Utility Functions Import
import ExpressError from "../utils/expresError";
import AuthHandling from "../utils/authHandling";

// Schema Imports
import validateUserAuthSchema from "../schemas/user/userAuthSchema";

// Model Imports
import UserModel from "../models/userModel";

const userRouter = express.Router();


//      _   _   _ _____ _   _ 
//     / \ | | | |_   _| | | |
//    / _ \| | | | | | | |_| |
//   / ___ \ |_| | | | |  _  |
//  /_/   \_\___/  |_| |_| |_|


userRouter.post("/auth", async (req, res, next) => {
    try {
        if(!validateUserAuthSchema(req.body)) {
            throw new ExpressError(`Email & Password Required: ${validateUserAuthSchema.errors}`, 400);
        }

        // Validate username & password combination
        const {email, password} = req.body;
        const queryData = await UserModel.authenticate({email, password});
        if (!queryData) {
            throw new ExpressError("Invalid Email/Password", 400);
        }
        
        AuthHandling.generateCookies(res, queryData);
        return res.json({ "message": "Login successful." })
    } catch (error) {
        next(error)
    }
})