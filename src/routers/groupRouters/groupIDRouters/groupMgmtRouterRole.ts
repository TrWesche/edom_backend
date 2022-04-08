import * as express from "express";

// Utility Functions Import
import ExpressError from "../../../utils/expresError";

// Schema Imports
import validateGroupMgmtSchemaRole, { GroupMgmtSchemaRole } from "../../../schemas/group/groupMgmtSchemaRole";

// Model Imports
import GroupModel from "../../../models/groupModel";

// Middleware Imports
import authMW from "../../../middleware/authorizationMW";


// Router Imports


const groupMgmtRouterRole = express.Router();

/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/

// Add Role
groupMgmtRouterRole.post("/", 
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_create_role", "group_delete_role"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id || !req.groupID) {
                throw new ExpressError(`Must be logged in to create group role || target group missing`, 400);
            }

            // Future: Add ability to add permissions to role at time of creation
            const reqValues: GroupMgmtSchemaRole = {
                groupID: req.groupID,
                context: req.body.context,
                action: req.body.action,
                role: req.body.role
            };
            

            if(!validateGroupMgmtSchemaRole(reqValues)) {
                throw new ExpressError(`Unable to Create Group Role: ${validateGroupMgmtSchemaRole.errors}`, 400);
            };


            // Process
            // TODO: Add permission check logic
            let queryData;

            switch (reqValues.context) {
                case "role":
                    switch (reqValues.action) {
                        case "create_role":
                            queryData = await GroupModel.create_role(reqValues.groupID, reqValues.role);
                            return res.json({GroupRoles: [queryData]})
                        case "delete_role":
                            if (reqValues.role === "owner" || reqValues.role === "user") {
                                throw new ExpressError("Owner and User are default roles which cannot be deleted", 400);
                            };
                            queryData = await GroupModel.delete_role(reqValues.groupID, reqValues.role);
                            return res.json({GroupRoles: [queryData]});

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

// Get Role List
// Manually Tested - 2022-04-08
groupMgmtRouterRole.get("/",
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_read_role"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id || !req.groupID) {
                throw new ExpressError(`Must be logged in to view group roles || target group missing`, 400);
            }
            
            // Process
            const queryData = await GroupModel.retrieve_roles_by_group_id(req.groupID);
            if (!queryData) {
                throw new ExpressError("Retrieving Group Roles Failed", 400);
            }
            
            return res.json({GroupRoles: [queryData]})
        } catch (error) {
            next(error)
        }
    }
);

// Get Role Detail View
// Manually Tested - 2022-04-08
groupMgmtRouterRole.get("/:rolename", 
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_read_role_permissions"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id || !req.groupID || !req.params.rolename) {
                throw new ExpressError(`Must be logged in to view group roles || target group missing || target role missing`, 400);
            }
            
            // Process
            const queryData = await GroupModel.retrieve_role_permissions_by_role_id(req.groupID, req.params.rolename);
            if (!queryData) {
                throw new ExpressError("Retrieving Group Role Permissions Failed", 400);
            }
            
            return res.json({GroupRolePermissions: [queryData]})
        } catch (error) {
            next(error)
        }
    }
);


/* ____  _____ _     _____ _____ _____ 
  |  _ \| ____| |   | ____|_   _| ____|
  | | | |  _| | |   |  _|   | | |  _|  
  | |_| | |___| |___| |___  | | | |___ 
  |____/|_____|_____|_____| |_| |_____|
*/

// TODO: Need to make sure the default role and owner role cannot be deleted
// Remove Role
// groupMgmtRouterRole.delete("/:roleID", 
//     authMW.defineRoutePermissions({
//         user: [],
//         group: ["group_delete_role"],
//         public: []
//     }),
//     authMW.validateRoutePermissions,
//     async (req, res, next) => {
//         try {
//             // Preflight
//             if (!req.user?.id || !req.body.roleID || !req.groupID) {
//                 throw new ExpressError(`Must be logged in to delete roles || target role missing || target group missing`, 400);
//             }

//             // Process
//             const queryData = await GroupModel.delete_role(req.body.roleID);
//             if (!queryData) {
//                 throw new ExpressError("Delete Group Role Failed", 400);
//             }
            
//             return res.json({GroupRoles: [queryData]})
//         } catch (error) {
//             next(error)
//         }
//     }
// );


export default groupMgmtRouterRole;