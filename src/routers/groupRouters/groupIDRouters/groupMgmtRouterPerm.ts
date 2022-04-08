import * as express from "express";

// Utility Functions Import
import ExpressError from "../../../utils/expresError";

// Schema Imports
import validateCreateGroupRolePermissionSchema, { GroupRolePermissionCreateProps } from "../../../schemas/group/groupRolePermissionCreateSchema";

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
            if (!req.user?.id || !req.body.permissions || req.body.permissions.length === 0 || !req.groupID || !req.roleID) {
                throw new ExpressError(`Must be logged in to create group role || missing permissions to add || target group missing || target role missing`, 400);
            };

            const reqValues: Array<GroupRolePermissionCreateProps> = [];
            req.body.permissions.forEach(permission => {
                const permissionEntry: GroupRolePermissionCreateProps = {
                    grouprole_id: req.roleID ? req.roleID : "",
                    grouppermission_id: permission
                };
                if(!validateCreateGroupRolePermissionSchema(permissionEntry)) {
                    throw new ExpressError(`Unable to Create Group Role Permission: ${validateCreateGroupRolePermissionSchema.errors}`, 400);
                }

                reqValues.push(permissionEntry);
            });

            // Process
            const queryData = await GroupModel.create_role_permissions(reqValues);
            if (!queryData) {
                throw new ExpressError("Create Group Role Permission Failed", 400);
            }
            
            return res.json({GroupRolePermissions: [queryData]})
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
            
            return res.json({GroupUser: [queryData]});
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
            if (!req.user?.id || !req.roleID || !req.groupID || !req.body.permissionID) {
                throw new ExpressError(`Must be logged in to delete permissions || target role missing || target group missing || target permission missing`, 400);
            }

            // Process
            const queryData = await GroupModel.delete_role_pemission(req.roleID, req.body.permissionID);
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