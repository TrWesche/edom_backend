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

// Middleware Imports
import authMW from "../middleware/authorizationMW";
import userDeviceMasterRouter from "./userRouters/userDMRouter";


const userRootRouter = express.Router();

userRootRouter.use("/dm", userDeviceMasterRouter);

/*    _   _   _ _____ _   _ 
     / \ | | | |_   _| | | |
    / _ \| | | | | | | |_| |
   / ___ \ |_| | | | |  _  |
  /_/   \_\___/  |_| |_| |_|
*/

// Manually Tested 2022-03-22
userRootRouter.post("/auth", 
    async (req, res, next) => {
        try {
            // console.log("Start Authentication");
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
            
            // AuthHandling.generateToken(res, queryData);
            AuthHandling.generateSessionCookies(res, queryData);
            return res.json({ "message": "Login successful." })
        } catch (error) {
            next(error)
        }
    }
);


/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/

// Manually Tested 2022-03-22
userRootRouter.post("/register", 
    async (req, res, next) => {
        try {
            const regValues: UserRegisterProps = {
                password: req.body.password,
                username: req.body.username,
                email: req.body.email,
                first_name: req.body.first_name,
                last_name: req.body.last_name
            };

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
            };

            // Validate username & password combination
            const queryData = await UserModel.register(regValues);
            if (!queryData) {
                throw new ExpressError("Registration Failed", 400);
            };
            
            // AuthHandling.generateToken(res, queryData);
            AuthHandling.generateSessionCookies(res, queryData);
            return res.json({ "message": "Registration Success!" })
        } catch (error) {
            next(error)
        }
    }
);

/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/

// Manually Tested 2022-03-22
userRootRouter.get("/profile", 
    authMW.defineRoutePermissions({
        user: ["site_read_user_self"],
        group: [],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            const queryData = await UserModel.retrieve_user_by_user_id(req.user?.id)
            if (!queryData) {
                throw new ExpressError("Unable to find user account.", 404);
            }
            
            return res.json({user: queryData});
        } catch (error) {
            next(error);
        }
});

// Manually Tested 2022-03-22
userRootRouter.get("/list", 
    authMW.defineRoutePermissions({
        user: [],
        group: [],
        public: ["site_read_user_public"]
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
    try {
        // TODO: Need a user retrieval route
        const queryData = await UserModel.retrieve_user_list_paginated(10, 0);
        if (!queryData) {
            throw new ExpressError("Unable to retrieve user list.", 404);
        }
        
        return res.json({user: queryData});
    } catch (error) {
        next(error);
    }
});


/* _   _ ____  ____    _  _____ _____ 
  | | | |  _ \|  _ \  / \|_   _| ____|
  | | | | |_) | | | |/ _ \ | | |  _|  
  | |_| |  __/| |_| / ___ \| | | |___ 
   \___/|_|   |____/_/   \_\_| |_____|
*/
// Manually Tested 2022-03-22
userRootRouter.patch("/update", 
    authMW.defineRoutePermissions({
        user: ["site_update_user_self"],
        group: [],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
    try {
        const prevValues = await UserModel.retrieve_user_by_user_id(req.user?.id);
        if (!prevValues) {
            throw new ExpressError(`Update Failed: User Not Found`, 404);
        };


        const updateValues: UserUpdateProps = {
            user_account: {
                password: req.body.password
            },
            user_profile: {
                username: req.body.username,
                headline: req.body.headline,
                about: req.body.about,
                image_url: req.body.image_url,
                public: req.body.public
            },
            user_data: {
                email: req.body.email,
                public_email: req.body.public_email,
                first_name: req.body.first_name,
                public_first_name: req.body.public_first_name,
                last_name: req.body.last_name,
                public_last_name: req.body.public_last_name,
                location: req.body.location,
                public_location: req.body.public_location
            }
        };

        if(!validateUserUpdateSchema(updateValues)) {
            throw new ExpressError(`Update Error: ${validateUserUpdateSchema.errors}`, 400);
        };


        let group: any;
        let item: any;
        // Clean-Up Update List
        for(group in updateValues) {
            for (item in updateValues[group]) {
                if (!updateValues[group][item]) {
                    delete updateValues[group][item];
                }
            };
            if (Object.keys(updateValues[group]).length === 0) {
                delete updateValues[group];
            };
        }

        // If no changes return original data
        if (Object.keys(updateValues).length === 0 ) {
            return res.json({user: prevValues});
        };

        // Update the user data with the itemsList information
        const newData = await UserModel.modify_user(req.user?.id, updateValues);
        return res.json({user: newData});
    } catch (error) {
        next(error);
    }
});



/* _     ___   ____  ___  _   _ _____ 
  | |   / _ \ / ___|/ _ \| | | |_   _|
  | |  | | | | |  _| | | | | | | | |  
  | |__| |_| | |_| | |_| | |_| | | |  
  |_____\___/ \____|\___/ \___/  |_|  
*/
// Manually Tested 2022-03-22
userRootRouter.post("/logout", 
    async (req, res, next) => {
        try {
            res.header("auth-token", "");
            
            return res.json({"message": "Logout successful."})
        } catch (error) {
            next(error)
        }
    }
);

/* ___  _____ _     _____ _____ _____ 
  |  _ \| ____| |   | ____|_   _| ____|
  | | | |  _| | |   |  _|   | | |  _|  
  | |_| | |___| |___| |___  | | | |___ 
  |____/|_____|_____|_____| |_| |_____|
*/
// Manually Tested 2022-03-22
userRootRouter.delete("/delete", 
    authMW.defineRoutePermissions({
        user: ["site_delete_user_self"],
        group: [],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
    try {
        if (!req.user?.id) {
            throw new ExpressError("Delete user failed, userid not provided.", 400);
        }

        const queryData = await UserModel.delete_user(req.user?.id);
        if(!queryData) {
            throw new ExpressError("Unable to delete target user account", 404);
        }

        res.setHeader("Authorization", "");
        return res.json({message: "Your account has been deleted."});
    } catch (error) {
        return next(error);
    }
})

export default userRootRouter;