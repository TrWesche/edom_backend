import * as express from "express";

// Utility Functions Import
import ExpressError from "../../../utils/expresError";

// Schema Imports
import validateGroupMgmtSchemaUser, { GroupMgmtSchemaUser } from "../../../schemas/group/groupMgmtSchemaUser";

// Model Imports
import GroupModel from "../../../models/groupModel";

// Middleware Imports
import authMW from "../../../middleware/authorizationMW";



const groupMgmtRouterUser = express.Router({mergeParams: true});

/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/

// Manually Tested - 2022-04-08
groupMgmtRouterUser.post("/", 
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_create_user_role"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id || !req.groupID) {throw new ExpressError("Unauthorized", 401);};

            const reqValues: GroupMgmtSchemaUser = {
                usernames: req.body.users,
                groupID: req.groupID,
                context: req.body.context,
                action: req.body.action,
                roles: req.body.roles ? req.body.roles : undefined
            };

            if(!validateGroupMgmtSchemaUser(reqValues)) {
                throw new ExpressError(`Unable to run Management Procedure, schema check failure: ${validateGroupMgmtSchemaUser.errors}`, 400);
            };

            let queryData;

            switch (reqValues.context) {
                case "user":
                    const userIDs = await GroupModel.retrieve_user_id_by_username(reqValues.usernames, reqValues.groupID, "are_group_members");
                    if (userIDs.length < 1) {throw new ExpressError("No valid users found.", 400);};

                    switch (reqValues.action) {
                        case "remove_from_group":
                            queryData = await GroupModel.delete_group_user(reqValues.groupID, userIDs);
                            return res.json({message: "Users Removed"});
                        case "add_roles":
                            queryData = await GroupModel.create_group_user_role(reqValues.groupID, reqValues.roles, userIDs);
                            return res.json({reqSent: queryData});
                        case "delete_roles":
                            queryData = await GroupModel.delete_group_user_role(reqValues.groupID, reqValues.roles, userIDs);
                            return res.json({reqRemove: queryData})
                        default:
                            throw new ExpressError("Configuration Error - Invalid Action", 400);
                    };

                default:
                    throw new ExpressError("Configuration Error - Invalid Context", 400);
            };


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
// Get User Group Data
// Manually Tested - 2022-04-08
groupMgmtRouterUser.get("/:username", 
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_read_user_role"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id || !req.groupID || !req.targetUID) {
                throw new ExpressError(`Must be logged in to view group user roles || target group missing`, 400);
            }
            
            // Process
            const queryData = await GroupModel.retrieve_user_roles_by_user_id(req.targetUID, req.groupID);
            if (!queryData) {
                throw new ExpressError("Retrieving Group User Roles Failed", 400);
            }
            
            return res.json({GroupUserRoles: [queryData]})
        } catch (error) {
            next(error)
        }
    }
);

// Manually Tested - 2022-04-08
groupMgmtRouterUser.get("/", 
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_read_group_user"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id || !req.groupID) {throw new ExpressError("Unauthorized", 401);};

            const queryData = await GroupModel.retrieve_users_by_group_id(req.groupID, "full");
            // Processing
            if (!queryData) {throw new ExpressError("Users Not Found: Get Group Users - All", 404);};
            
            return res.json({users: queryData});
        } catch (error) {
            next(error)
        }
    }
);

export default groupMgmtRouterUser;