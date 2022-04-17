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
import GroupModel from "../models/groupModel";

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

// Manual Tests - Already Invited, Send Request, Remove Request, Already Member, Accept Invite 2022-04-04
userRootRouter.post("/request", 
    authMW.defineRoutePermissions({
        user: ["site_update_user_self"],
        group: [],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            if (!req.user?.id) {throw new ExpressError("Unauthorized", 401);};
            if (!req.body.groupID || !req.body.context || !req.body.action) {throw new ExpressError("Invalid Request", 400);};

            let queryData;

            switch (req.body.context) {
                case "group":
                    let userIDs;

                        switch (req.body.action) {
                            case "accept_request":
                                userIDs = await GroupModel.retrieve_filtered_user_ids([req.user.id], req.body.groupID, "group_request_active");
                                if (userIDs.length < 1) {throw new ExpressError("Unable to join group.", 400);};
                                queryData = await GroupModel.create_group_user(req.body.groupID, userIDs);
                                return res.json({reqAccept: queryData});
                            case "send_request":
                                userIDs = await GroupModel.retrieve_filtered_user_ids([req.user.id], req.body.groupID, "user_request_permitted");
                                if (userIDs.length < 1) {throw new ExpressError("Unable to request to join this group.", 400);};
                                queryData = await GroupModel.create_request_user_to_group(req.body.groupID, req.user.id);
                                return res.json({reqSent: queryData});
                            case "remove_request":
                                userIDs = await GroupModel.retrieve_filtered_user_ids([req.user.id], req.body.groupID);
                                if (userIDs.length < 1) {throw new ExpressError("Unable to remove invite request.", 400);};
                                queryData = await GroupModel.delete_request_user_group(userIDs, req.body.groupID);
                                return res.json({reqRemove: queryData});
                            default:
                                throw new ExpressError("Configuration Error - Invalid Action", 400);
                        };

                default:
                    throw new ExpressError("Configuration Error - Invalid Context", 400);
            };
        } catch (error) {
            next(error);
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

// Manually Tested 2022-04-04
userRootRouter.get("/request", 
    authMW.defineRoutePermissions({
        user: ["site_read_user_self"],
        group: [],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            if (!req.user?.id) {throw new ExpressError("Unauthorized", 401);};
            const queryData = await UserModel.retrieve_group_requests_by_user_id(req.user?.id)

            return res.json({requests: queryData});
        } catch (error) {
            next(error);
        }
    }
);


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


        const processedValues: any = {};

        const incValues = req.body;
        for (const pKey in prevValues) {
            if (incValues[pKey] && incValues[pKey] !== prevValues[pKey]) {
                // Special Cases - Username Change, Email Change
                if (pKey === "username" || pKey === "email") {
                    const cv1 = prevValues[pKey] || "";
                    if (incValues[pKey].toLowerCase() !== cv1.toLowerCase()) {
                        processedValues[pKey] = incValues[pKey];
                        processedValues[`${pKey}_clean`] = incValues[pKey].toLowerCase();
                    };
                } else {
                    processedValues[pKey] = incValues[pKey];
                };
            }
        };


        const updateValues: UserUpdateProps = {
            user_account: {
                password: processedValues.password
            },
            user_profile: {
                username: processedValues.username,
                username_clean: processedValues.username_clean,
                headline: processedValues.headline,
                about: processedValues.about,
                image_url: processedValues.image_url,
                public: processedValues.public
            },
            user_data: {
                email: processedValues.email,
                email_clean: processedValues.email_clean,
                public_email: processedValues.public_email,
                first_name: processedValues.first_name,
                public_first_name: processedValues.public_first_name,
                last_name: processedValues.last_name,
                public_last_name: processedValues.public_last_name,
                location: processedValues.location,
                public_location: processedValues.public_location
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