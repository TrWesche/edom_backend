import * as express from "express";

// Utility Functions Import
import ExpressError from "../utils/expresError";

// Schema Imports
import validateCreateGroupSchema, { GroupCreateProps } from "../schemas/group/groupCreateSchema";
import validateUpdateGroupSchema, { GroupUpdateProps } from "../schemas/group/groupUpdateSchema";
import validateCreateGroupUserSchema, { GroupUserCreateProps } from "../schemas/group/groupUserCreateSchema";

// Model Imports
import GroupModel from "../models/groupModel";

// Middleware Imports
import authMW from "../middleware/authorizationMW";
import siteMW from "../middleware/siteMW";
import groupMW from "../middleware/groupMW";



const groupMgmtRouter = express.Router();
// Users

// Get Users
groupMgmtRouter.get("/users/list", async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.groupID) {
            throw new ExpressError(`Must be logged in to view group users || target group missing`, 400);
        }
        
        // Process
        const queryData = await GroupModel.retrieve_users_by_group_id(req.groupID);
        if (!queryData) {
            throw new ExpressError("Retrieving Group Users Failed", 400);
        }
        
        return res.json({groupUser: [queryData]})
    } catch (error) {
        next(error)
    }
});

// Get User - Might be necessary, tbd
// groupMgmtRouter.get("/users/:userID", async (req, res, next) => {
//     try {
//         // Preflight
//         if (!req.user?.id || !req.params.userID || !req.groupID) {
//             throw new ExpressError(`Must be logged in to create group || target user missing || target group missing`, 400);
//         }

//         // Process
//         const queryData = await GroupModel.retr(req.groupID, req.params.userID);
//         if (!queryData) {
//             throw new ExpressError("Delete Group User Failed", 400);
//         }
        
//         return res.json({groupUser: [queryData]})
//     } catch (error) {
//         next(error)
//     }
// });

// Add User
groupMgmtRouter.post("/users/create", async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.body.user_id || !req.groupID) {
            throw new ExpressError(`Must be logged in to create group || target user missing || target group missing`, 400);
        }

        const reqValues: GroupUserCreateProps = {
            userID: req.body.userID,
            groupID: req.groupID
        };
        

        if(!validateCreateGroupUserSchema(reqValues)) {
            throw new ExpressError(`Unable to Create Group User: ${validateCreateGroupUserSchema.errors}`, 400);
        }

        // Process
        const queryData = await GroupModel.create_group_user(reqValues.groupID, reqValues.userID);
        if (!queryData) {
            throw new ExpressError("Create Group User Failed", 400);
        }
        
        return res.json({groupUser: [queryData]})
    } catch (error) {
        next(error)
    }
});

// Remove user
groupMgmtRouter.delete("/users/:userID", async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.params.userID || !req.groupID) {
            throw new ExpressError(`Must be logged in to create group || target user missing || target group missing`, 400);
        }

        // Process
        const queryData = await GroupModel.delete_group_user(req.groupID, req.params.userID);
        if (!queryData) {
            throw new ExpressError("Delete Group User Failed", 400);
        }
        
        return res.json({groupUser: [queryData]})
    } catch (error) {
        next(error)
    }
});


// User Roles

// Get User Roles
// Add User Role
// Remove User Role


// Roles

// Add Role
// Remove Role


// Role Permissions

// Add Role Permissions
// Remove Role Permissions


/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/
groupMgmtRouter.post("/create", async (req, res, next) => {
    try {
        // Preflight
        const reqValues: GroupCreateProps = {
            name: req.body.name,
            headline: req.body.headline,
            description: req.body.description,
            public: req.body.public
        }

        if (!req.user?.id) {
            throw new ExpressError(`Must be logged in to create group`, 400);
        }

        if(!validateCreateGroupSchema(reqValues)) {
            throw new ExpressError(`Unable to Create Group: ${validateCreateGroupSchema.errors}`, 400);
        }

        // Process
        const queryData = await GroupModel.create_group(req.user.id, reqValues);
        if (!queryData) {
            throw new ExpressError("Create Group Failed", 400);
        }
        
        return res.json({group: [queryData]})
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

groupMgmtRouter.get("/list", siteMW.defineActionPermissions(["view_group_public"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // TODO: Add free text search, category type filters, user filters, group filters
        
        // const {limit, offset} = req.query as unknown as equipRouterQuery;
        // Preflight
        const limit = req.query.limit;
        const offset = req.query.offset;
        // const ftserach = req.query.ftsearch;
        // const catid = req.query.catid;
        // const uid = req.query.uid;
        // const gid = req.query.gid;

        if (typeof limit !== "number" || typeof offset !== "number") {
            throw new ExpressError("One or more query parameters is of an invalid type", 404);
        };


        // Processing
        const queryData = await GroupModel.retrieve_group_list_paginated(limit, offset);
        if (!queryData) {
            throw new ExpressError("Groups Not Found.", 404);
        }
        
        return res.json({group: queryData});
    } catch (error) {
        next(error)
    }
});

groupMgmtRouter.get("/:groupID", siteMW.defineActionPermissions(["view_group_public"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // TODO: User needs a public / private selection & additional details
        const queryData = await GroupModel.retrieve_group_by_group_id(req.params.groupID);
        if (!queryData) {
            throw new ExpressError("Unable to find a user with provided username.", 404);
        }
        
        return res.json({group: queryData});
    } catch (error) {
        next(error)
    }
})

/* _   _ ____  ____    _  _____ _____ 
  | | | |  _ \|  _ \  / \|_   _| ____|
  | | | | |_) | | | |/ _ \ | | |  _|  
  | |_| |  __/| |_| / ___ \| | | |___ 
   \___/|_|   |____/_/   \_\_| |_____|
*/

groupMgmtRouter.patch("/:groupID", groupMW.defineActionPermissions(["read_group", "update_group"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.groupID) {
            throw new ExpressError(`Must be logged in to update group || group not found`, 400);
        }

        const prevValues = await GroupModel.retrieve_group_by_group_id(req.params.groupID);
        if (!prevValues) {
            throw new ExpressError(`Update Failed: Group Not Found`, 404);
        };

        const updateValues: GroupUpdateProps = {
            name: req.body.name,
            headline: req.body.headline,
            description: req.body.description,
            public: req.body.public
        };

        if(!validateUpdateGroupSchema(updateValues)) {
            throw new ExpressError(`Update Error: ${validateUpdateGroupSchema.errors}`, 400);
        };

        // Build update list for patch query 
        const itemsList = {};
        const newKeys = Object.keys(req.body);
        newKeys.map(key => {
            if(updateValues[key] && (updateValues[key] != prevValues[key]) ) {
                itemsList[key] = req.body[key];
            }
        })


        // If no changes return original data
        if(Object.keys(itemsList).length === 0) {
            return res.json({equip: [prevValues]});
        }

        // Update the user data with the itemsList information
        const newData = await GroupModel.modify_group(req.params.groupID, itemsList);
        return res.json({equip: [newData]})
    } catch (error) {
        next(error)
    }
});


/* ____  _____ _     _____ _____ _____ 
  |  _ \| ____| |   | ____|_   _| ____|
  | | | |  _| | |   |  _|   | | |  _|  
  | |_| | |___| |___| |___  | | | |___ 
  |____/|_____|_____|_____| |_| |_____|
*/

groupMgmtRouter.delete("/:groupID", groupMW.defineActionPermissions(["view", "delete"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        if (!req.user?.id || !req.groupID) {
            throw new ExpressError(`Must be logged in to delete groups || target group not specified`, 400);
        }

        const queryData = GroupModel.delete_group(req.groupID);
        if(!queryData) {
            throw new ExpressError("Unable to delete target group", 404);
        }

        return res.json({message: "Group deleted."});
    } catch (error) {
        return next(error);
    }
});


export default groupMgmtRouter;