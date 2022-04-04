import * as express from "express";

// Utility Functions Import
import ExpressError from "../../../utils/expresError";

// Schema Imports
import validateCreateGroupUserRoleSchema, { GroupUserRoleCreateProps } from "../../../schemas/group/groupUserRoleCreateSchema";

// Model Imports
import GroupModel from "../../../models/groupModel";

// Middleware Imports
import authMW from "../../../middleware/authorizationMW";


const groupUserRoleRouter = express.Router();

/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/

// Add User Role
groupUserRoleRouter.post("/roles", 
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_create_user_role"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id || !req.targetUID || !req.groupID || !req.body.roleID ) {
                throw new ExpressError(`Must be logged in to assign roles || target user missing || target group missing || target role missing`, 400);
            }

            const reqValues: GroupUserRoleCreateProps = {
                user_id: req.targetUID,
                grouprole_id: req.body.roleID
            };
            
            if(!validateCreateGroupUserRoleSchema(reqValues)) {
                throw new ExpressError(`Unable to Create Group User: ${validateCreateGroupUserRoleSchema.errors}`, 400);
            }

            // Process
            const queryData = await GroupModel.create_group_user_role(reqValues.grouprole_id, [reqValues.user_id]);
            if (!queryData) {
                throw new ExpressError("Create Group User Role Failed", 400);
            }
            
            return res.json({GroupUserRoles: [queryData]})
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

// Get User Roles
groupUserRoleRouter.get("/roles", 
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


/* ____  _____ _     _____ _____ _____ 
  |  _ \| ____| |   | ____|_   _| ____|
  | | | |  _| | |   |  _|   | | |  _|  
  | |_| | |___| |___| |___  | | | |___ 
  |____/|_____|_____|_____| |_| |_____|
*/

// Remove User Role
groupUserRoleRouter.delete("/roles", 
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_delete_user_role"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id || !req.targetUID || !req.groupID || !req.body.roleID) {
                throw new ExpressError(`Must be logged in to create group || target user missing || target group missing || target role missing`, 400);
            }

            // Process
            const queryData = await GroupModel.delete_group_user_role(req.body.roleID, req.targetUID);
            if (!queryData) {
                throw new ExpressError("Delete Group User Role Failed", 400);
            }
            
            return res.json({GroupUserRoles: [queryData]})
        } catch (error) {
            next(error)
        }
    }
);

export default groupUserRoleRouter;