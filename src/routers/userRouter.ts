import * as express from "express";

// Utility Functions Import
import ExpressError from "../utils/expresError";
import AuthHandling from "../utils/authHandling";

// Schema Imports
import validateUserAuthSchema, { UserAuthProps } from "../schemas/user/userAuthSchema";
import validateUserRegisterSchema, { UserRegisterProps } from "../schemas/user/userRegisterSchema";
import validateUserUpdateSchema, { UserUpdateProps } from "../schemas/user/userUpdateSchema";

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
        const authValues: UserAuthProps = {
            username: req.body.username,
            password: req.body.password
        }

        if(!validateUserAuthSchema(authValues)) {
            throw new ExpressError(`Username & Password Required: ${validateUserAuthSchema.errors}`, 400);
        }

        // Validate username & password combination
        const queryData = await UserModel.authenticate(authValues);
        if (!queryData) {
            throw new ExpressError("Invalid Email/Password", 400);
        }
        
        AuthHandling.generateToken(res, queryData);
        return res.json({ "message": "Login successful." })
    } catch (error) {
        next(error)
    }
})


userRouter.post("/register", async (req, res, next) => {
    try {
        const regValues: UserRegisterProps = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }

        if(!validateUserRegisterSchema(regValues)) {
            throw new ExpressError(`Username & Password Required: ${validateUserRegisterSchema.errors}`, 400);
        }

        // Validate username & password combination
        const queryData = await UserModel.register(regValues);
        if (!queryData) {
            throw new ExpressError("Registration Failed", 400);
        }
        
        AuthHandling.generateToken(res, queryData);
        return res.json({ "message": "Registration Success!" })
    } catch (error) {
        next(error)
    }
})


userRouter.patch("/update", async (req, res, next) => {
    try {
        const prevValues = await UserModel.retrieve_user_by_user_id(req.user?.id);
        if (!prevValues) {
            throw new ExpressError(`Update Failed: User Not Found`, 404);
        };


        const updateValues: UserUpdateProps = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };

        if(!validateUserUpdateSchema(updateValues)) {
            throw new ExpressError(`Update Error: ${validateUserUpdateSchema.errors}`, 400);
        };


        // Build update list for patch query 
        const itemsList = {};
        const newKeys = Object.keys(req.body);
        newKeys.map(key => {
            if(updateValues[key] && (updateValues[key] != prevValues[key]) ) {
                itemsList[key] = req.body[key];
            }
        })

        // If body has password this is a special case and should be added to the itemsList separately
        // if (updateValues.password) {
        //     itemsList["password"] = req.body.password;
        // }

        // If no changes return original data
        if(Object.keys(itemsList).length === 0) {
            return res.json({user: prevValues});
        }

        // Update the user data with the itemsList information
        const newData = await UserModel.modify_user(req.user?.id, itemsList);
        return res.json({user: newData})
    } catch (error) {
        next(error)
    }
})

export default userRouter;