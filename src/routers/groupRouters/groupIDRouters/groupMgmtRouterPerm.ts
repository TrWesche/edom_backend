import * as express from "express";

// Utility Functions Import
import ExpressError from "../../../utils/expresError";

// Schema Imports
import validateGroupMgmtSchemaPerm, { GroupMgmtSchemaPerm } from "../../../schemas/group/groupMgmtSchemaPerm";

// Model Imports
import GroupModel from "../../../models/groupModel";

// Middleware Imports
import authMW from "../../../middleware/authorizationMW";



const groupMgmtRouterPerm = express.Router();


/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/

// Add Role Permissions
groupMgmtRouterPerm.post("/", 
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_create_role_permissions"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id || !req.groupID) {
                throw new ExpressError(`Must be logged in to create group role || target group missing`, 400);
            };

            const reqValues: GroupMgmtSchemaPerm = {
                groupID: req.groupID,
                context: req.body.context,
                action: req.body.action,
                role: req.body.role,
                permission: req.body.permission
            };

            if (!validateGroupMgmtSchemaPerm(reqValues)) {
                throw new ExpressError(`Unable to Update Group Role Permission: ${JSON.stringify(validateGroupMgmtSchemaPerm.errors)}`, 400);
            };


            // Process
            let queryData;

            switch (reqValues.context) {
                case "role":
                    switch (reqValues.action) {
                        case "create_permission":
                            queryData = await GroupModel.create_role_permissions(reqValues.groupID, reqValues.role, reqValues.permission);
                            return res.json({GroupPermissions: [queryData]})
                        case "delete_permission":
                            if (reqValues.role === "owner") {
                                throw new ExpressError("Owner permissions cannot be modified.", 400);
                            };
                            queryData = await GroupModel.delete_role_permissions(reqValues.groupID, reqValues.role, reqValues.permission);
                            return res.json({GroupPermissions: [queryData]});

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
// Get Group Permission Definitions
// Manually Tested 2022-04-08
groupMgmtRouterPerm.get("/", 
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
            
            return res.json({GroupPermissions: [queryData]});
        } catch (error) {
            next(error);
        };
    }
);



/* ____  _____ _     _____ _____ _____ 
  |  _ \| ____| |   | ____|_   _| ____|
  | | | |  _| | |   |  _|   | | |  _|  
  | |_| | |___| |___| |___  | | | |___ 
  |____/|_____|_____|_____| |_| |_____|
*/

// Remove Role Permissions
groupMgmtRouterPerm.delete("/", 
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_delete_role_permissions"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id || !req.groupID) {
                throw new ExpressError(`Must be logged in to delete permissions || target group missing`, 400);
            }

            // Process
            const queryData = await GroupModel.delete_role_permissions(req.groupID, req.params.roleName, [req.params.permName]);
            if (!queryData) {
                throw new ExpressError("Delete Group Role Permission Failed", 400);
            }
            
            return res.json({GroupRolePermissions: [queryData]})
        } catch (error) {
            next(error)
        }
    }
);

export default groupMgmtRouterPerm;