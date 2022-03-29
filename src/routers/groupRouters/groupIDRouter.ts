import * as express from "express";

// Utility Functions Import
import ExpressError from "../../utils/expresError";

// Schema Imports
import validateUpdateGroupSchema, { GroupUpdateProps } from "../../schemas/group/groupUpdateSchema";

// Model Imports
import GroupModel from "../../models/groupModel";

// Middleware Imports
import authMW from "../../middleware/authorizationMW";

// Router Imports
import groupUserRouter from "./groupIDRouters/groupUserRouter";
import groupRoleMgmtRouter from "./groupIDRouters/groupRoleMgmtRouter";


const groupIDRouter = express.Router();

groupIDRouter.use("/role", groupRoleMgmtRouter);
groupIDRouter.use("/user", groupUserRouter);

/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/
// Manually Tested 2022-03-22
groupIDRouter.get("/",
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_read_group"],
        public: ["site_read_group_public"]
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id) {throw new ExpressError(`Must be logged in to update group.`, 400);}
            if (!req.groupID) {throw new ExpressError(`Group ID must be provided.`, 400);}

            let queryData;

            const elevatedAccess = req.resolvedPerms?.reduce((acc: any, val: any) => {
                return acc = acc || (val.permissions_name === "group_read_group")
            }, false);
    
            if (elevatedAccess) {
                queryData = await GroupModel.retrieve_group_by_group_id(req.groupID, "elevated");
            } else {
                queryData = await GroupModel.retrieve_group_by_group_id(req.groupID, "public");
            };
            
            if (!queryData) {
                throw new ExpressError("Unable to find group.", 404);
            };

            return res.json({group: queryData});
        } catch (error) {
            next(error)
        }
    }
);


// Get Group Permissions
// Manually Tested 2022-03-28
groupIDRouter.get("/permissions", 
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_read_group_permissions"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id || !req.groupID) {
                throw new ExpressError(`Must be logged in to view group permissions || target group missing`, 400);
            }
            
            // Process
            const queryData = await GroupModel.retrieve_permissions();
            if (!queryData) {
                throw new ExpressError("Retrieving Group Permissions Failed", 400);
            }
            
            return res.json({GroupUser: [queryData]});
        } catch (error) {
            next(error);
        };
    }
);

/* _   _ ____  ____    _  _____ _____ 
  | | | |  _ \|  _ \  / \|_   _| ____|
  | | | | |_) | | | |/ _ \ | | |  _|  
  | |_| |  __/| |_| / ___ \| | | |___ 
   \___/|_|   |____/_/   \_\_| |_____|
*/
// Manually Tested 2022-03-22
groupIDRouter.patch("/",
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_read_group", "group_update_group"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id) {throw new ExpressError(`Must be logged in to update group.`, 400);}
        if (!req.groupID) {throw new ExpressError(`Group ID must be provided.`, 400);}

        const prevValues = await GroupModel.retrieve_group_by_group_id(req.groupID, "elevated");
        if (!prevValues) {throw new ExpressError(`Update Failed: Group Not Found`, 404);};

        const updateValues: GroupUpdateProps = {
            name: req.body.name,
            headline: req.body.headline,
            description: req.body.description,
            image_url: req.body.image_url,
            location: req.body.location,
            public: req.body.public
        };

        if(!validateUpdateGroupSchema(updateValues)) {
            throw new ExpressError(`Schema Validation Failed - Update Group: ${validateUpdateGroupSchema.errors}`, 400);
        };

        // Build update list for patch query 
        const itemsList = {};
        const newKeys = Object.keys(updateValues);
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
// Manually Tested 2022-03-22
groupIDRouter.delete("/", 
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_read_group", "group_delete_group"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id) {throw new ExpressError(`Must be logged in to update group.`, 400);}
            if (!req.groupID) {throw new ExpressError(`Group ID must be provided.`, 400);}

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