// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../../../utils/expresError";

// Schema Imports
import validateCreateGroupUserSchema, { GroupUserCreateProps } from "../../../schemas/group/groupUserCreateSchema";

// Model Imports
import GroupModel from "../../../models/groupModel";

// Middleware Imports
import authMW from "../../../middleware/authorizationMW";

// Router Imports


const groupUserRouter = express.Router();


/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/

// Manual Test - Basic Functionality: 03/25/2022
// Get User List
groupUserRouter.get("/", 
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_read_group"],
        public: ["site_read_group_public"]
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id || !req.groupID) {throw new ExpressError("Unauthorized", 401);};

            let queryData;
    
            let groupReadPermitted = 0;
    
            req.resolvedPerms?.forEach((val: any) => {
                // Set Delete Permission Level
                if (val.permissions_name === "group_read_group") {
                    groupReadPermitted = 1;
                };
            });
    
            if (groupReadPermitted === 1) {
                queryData = await GroupModel.retrieve_users_by_group_id(req.groupID, "full");
            } else {
                queryData = await GroupModel.retrieve_users_by_group_id(req.groupID, "public");
            };

            // Processing
            if (!queryData) {throw new ExpressError("Users Not Found: Get Group Users - All", 404);};
            
            return res.json({users: queryData});
        } catch (error) {
            next(error)
        }
    }
);


export default groupUserRouter;