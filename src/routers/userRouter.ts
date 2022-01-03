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
import authMW from "../middleware/authorizationMW";

// Middleware Imports



const userRouter = express.Router();


/*    _   _   _ _____ _   _ 
     / \ | | | |_   _| | | |
    / _ \| | | | | | | |_| |
   / ___ \ |_| | | | |  _  |
  /_/   \_\___/  |_| |_| |_|
*/

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
});


/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/

userRouter.post("/register", async (req, res, next) => {
    try {
        const regValues: UserRegisterProps = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }

        if(!validateUserRegisterSchema(regValues)) {
            console.log(validateUserRegisterSchema.errors);
            // TODO: Create Error Message Based on Schema Output
            // [
            //     [1]   {
            //     [1]     instancePath: '',
            //     [1]     schemaPath: '#/required',
            //     [1]     keyword: 'required',
            //     [1]     params: { missingProperty: 'username' },
            //     [1]     message: "must have required property 'username'"
            //     [1]   }
            //     [1] ]
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
});

/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/

userRouter.get("/", authMW.validatePermissions, async (req, res, next) => {
    try {
        const queryData = await UserModel.retrieve_user_by_user_id(req.user?.id)
        if (!queryData) {
            throw new ExpressError("Unable to find user account.", 404);
        }
        
        return res.json({user: queryData});
    } catch (error) {
        next(error);
    }
})

userRouter.get("/:username", async (req, res, next) => {
    try {
        // TODO: User needs a public / private selection & additional details
        const queryData = await UserModel.retrieve_user_by_username(req.params.username);
        if (!queryData) {
            throw new ExpressError("Unable to find a user with provided username.", 404);
        }
        
        return res.json({user: queryData});
    } catch (error) {
        next(error)
    }
});


/* _   _ ____  ____    _  _____ _____ 
  | | | |  _ \|  _ \  / \|_   _| ____|
  | | | | |_) | | | |/ _ \ | | |  _|  
  | |_| |  __/| |_| / ___ \| | | |___ 
   \___/|_|   |____/_/   \_\_| |_____|
*/

userRouter.patch("/update", authMW.validatePermissions, async (req, res, next) => {
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
});



/* _     ___   ____  ___  _   _ _____ 
  | |   / _ \ / ___|/ _ \| | | |_   _|
  | |  | | | | |  _| | | | | | | | |  
  | |__| |_| | |_| | |_| | |_| | | |  
  |_____\___/ \____|\___/ \___/  |_|  
*/

userRouter.get("/logout", async (req, res, next) => {
    try {
        res.setHeader("Authorization", "");
        
        return res.json({"message": "Logout successful."})
    } catch (error) {
        next(error)
    }
});

/* ___  _____ _     _____ _____ _____ 
  |  _ \| ____| |   | ____|_   _| ____|
  | | | |  _| | |   |  _|   | | |  _|  
  | |_| | |___| |___| |___  | | | |___ 
  |____/|_____|_____|_____| |_| |_____|
*/

userRouter.delete("/delete", authMW.validatePermissions, async (req, res, next) => {
    try {
        if (!req.user?.id) {
            throw new ExpressError("Delete user failed, userid not provided.", 400);
        }

        const queryData = UserModel.delete_user(req.user?.id);
        if(!queryData) {
            throw new ExpressError("Unable to delete target user account", 404);
        }

        res.setHeader("Authorization", "");
        return res.json({message: "Your account has been deleted."});
    } catch (error) {
        return next(error);
    }
})

export default userRouter;