import * as express from "express";

// Utility Functions Import
import ExpressError from "../../../utils/expresError";

// Schema Imports
import validateCreateGroupRoleSchema, { GroupRoleCreateProps } from "../../../schemas/group/groupRoleCreateSchema";

// Model Imports
import GroupModel from "../../../models/groupModel";

// Middleware Imports
import authMW from "../../../middleware/authorizationMW";

// Router Imports
import groupRolePermMgmtRouter from "./groupRolePermMgmtRouter";


const groupRoleMgmtRouter = express.Router();

groupRoleMgmtRouter.use("/:roleID", authMW.addRoleIDToRequest, groupRolePermMgmtRouter)

/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/

// Add Role
groupRoleMgmtRouter.post("/", authMW.defineGroupPermissions(["read_role", "create_role"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.body.name || !req.groupID) {
            throw new ExpressError(`Must be logged in to create group role || role name missing || target group missing`, 400);
        }

        const reqValues: GroupRoleCreateProps = {
            name: req.body.name,
            group_id: req.groupID
        };
        

        if(!validateCreateGroupRoleSchema(reqValues)) {
            throw new ExpressError(`Unable to Create Group Role: ${validateCreateGroupRoleSchema.errors}`, 400);
        }

        // Process
        const queryData = await GroupModel.create_role(reqValues.group_id, reqValues.name);
        if (!queryData) {
            throw new ExpressError("Create Group Role Failed", 400);
        }
        
        return res.json({GroupRoles: [queryData]})
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

// Get Role List
groupRoleMgmtRouter.get("/", authMW.defineGroupPermissions(["read_role"]), authMW.validatePermissions, async (req, res, next) => {
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
});

// Get Role Detail View
groupRoleMgmtRouter.get("/roles/:roleID/permissions", authMW.defineGroupPermissions(["read_role_permissions"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.groupID || !req.params.roleID) {
            throw new ExpressError(`Must be logged in to view group roles || target group missing || target role missing`, 400);
        }
        
        // Process
        const queryData = await GroupModel.retrieve_role_permissions_by_role_id(req.groupID, req.params.roleID);
        if (!queryData) {
            throw new ExpressError("Retrieving Group Role Permissions Failed", 400);
        }
        
        return res.json({GroupRolePermissions: [queryData]})
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

// TODO: Need to make sure the default role and owner role cannot be deleted
// Remove Role
groupRoleMgmtRouter.delete("/:roleID", authMW.defineGroupPermissions(["read_role", "delete_role"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.body.roleID || !req.groupID) {
            throw new ExpressError(`Must be logged in to delete roles || target role missing || target group missing`, 400);
        }

        // Process
        const queryData = await GroupModel.delete_role(req.body.roleID);
        if (!queryData) {
            throw new ExpressError("Delete Group Role Failed", 400);
        }
        
        return res.json({GroupRoles: [queryData]})
    } catch (error) {
        next(error)
    }
});


export default groupRoleMgmtRouter;