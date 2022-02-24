import * as express from "express";

// Utility Functions Import
import ExpressError from "../../utils/expresError";

// Schema Imports
// import validateCreateGroupSchema, { GroupCreateProps } from "../../schemas/group/groupCreateSchema";
import validateUpdateGroupSchema, { GroupUpdateProps } from "../../schemas/group/groupUpdateSchema";

// Model Imports
import GroupModel from "../../models/groupModel";

// Middleware Imports
import authMW from "../../middleware/authorizationMW";


import groupMgmtRouter from "./groupIDRouters/groupMgmtRouter";
import groupRoomRouter from "./groupIDRouters/groupRoomRouter";
import groupEquipRouter from "./groupIDRouters/groupEquipRouter";
import groupUserRouter from "./groupIDRouters/groupUserRouter";


const groupIDRouter = express.Router();


groupIDRouter.use("/mgmt", authMW.defineSitePermissions(["site_access"]), groupMgmtRouter);
groupIDRouter.use("/rooms", authMW.defineSitePermissions(["site_access"]),  groupRoomRouter);
groupIDRouter.use("/equips", authMW.defineSitePermissions(["site_access"]),  groupEquipRouter);
groupIDRouter.use("/users", authMW.defineSitePermissions(["site_access"]), groupUserRouter);

/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/
// Manual Test - Basic Functionality: 01/17/2022
groupIDRouter.get("/", authMW.defineSitePermissions(["view_group_public"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.groupID) {
            throw new ExpressError(`Must be logged in to view groups || group not found`, 400);
        }

        // TODO: User needs a public / private selection & additional details
        const queryData = await GroupModel.retrieve_group_by_group_id(req.groupID);
        if (!queryData) {
            throw new ExpressError("Unable to find group.", 404);
        };
        
        if (queryData.public !== true) {
            console.log("Group Not Public, Forward to Group MW Check");
            // req.fwdData = queryData;
            return next();
        };

        return res.json({group: queryData});
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 01/17/2022
groupIDRouter.get("/", authMW.defineGroupPermissions(["read_group"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.groupID) {
            throw new ExpressError(`Must be logged in to view groups || group not found`, 400);
        }

        // TODO: User needs a public / private selection & additional details
        const queryData = await GroupModel.retrieve_group_by_group_id(req.groupID);
        if (!queryData) {
            throw new ExpressError("Unable to find group.", 404);
        };
        

        return res.json({group: queryData});
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
// Manual Test - Basic Functionality: 01/16/2022
groupIDRouter.patch("/",  authMW.defineSitePermissions(["update_group_self"]), authMW.defineGroupPermissions(["read_group", "update_group"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.groupID) {
            throw new ExpressError(`Must be logged in to update group || group not found`, 400);
        }

        const prevValues = await GroupModel.retrieve_group_by_group_id(req.groupID);
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
            if(updateValues[key] !== undefined && (updateValues[key] != prevValues[key]) ) {
                itemsList[key] = req.body[key];
            }
        })


        // If no changes return original data
        if(Object.keys(itemsList).length === 0) {
            return res.json({group: [prevValues]});
        }

        // Update the user data with the itemsList information
        const newData = await GroupModel.modify_group(req.groupID, itemsList);
        return res.json({group: [newData]})
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
// Manual Test - Basic Functionality: 01/17/2022
groupIDRouter.delete("/", authMW.defineSitePermissions(["delete_group_self"]), authMW.defineGroupPermissions(["read_group", "delete_group"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        if (!req.user?.id || !req.groupID) {
            throw new ExpressError(`Must be logged in to delete groups || target group not specified`, 400);
        }

        const queryData = await GroupModel.delete_group(req.groupID);
        if(!queryData) {
            throw new ExpressError("Unable to delete target group", 404);
        }

        return res.json({message: "Group deleted."});
    } catch (error) {
        return next(error);
    }
});

export default groupIDRouter;