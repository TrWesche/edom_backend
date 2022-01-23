import * as express from "express";

// Utility Functions Import
import ExpressError from "../../../utils/expresError";

// Schema Imports
import validateCreateGroupUserSchema, { GroupUserCreateProps } from "../../../schemas/group/groupUserCreateSchema";
import validateCreateGroupUserRoleSchema, { GroupUserRoleCreateProps } from "../../../schemas/group/groupUserRoleCreateSchema";
import validateCreateGroupRoleSchema, { GroupRoleCreateProps } from "../../../schemas/group/groupRoleCreateSchema";
import validateCreateGroupRolePermissionSchema, { GroupRolePermissionCreateProps } from "../../../schemas/group/groupRolePermissionCreateSchema";

// Model Imports
import GroupModel from "../../../models/groupModel";

// Middleware Imports
import authMW from "../../../middleware/authorizationMW";


const groupMgmtRouter = express.Router();
// User Roles
// Manual Test - Basic Functionality: 01/22/2022
// Get User Roles
groupMgmtRouter.get("/users/:userID/roles", authMW.defineGroupPermissions(["read_user_role"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.groupID) {
            throw new ExpressError(`Must be logged in to view group user roles || target group missing`, 400);
        }
        
        // Process
        const queryData = await GroupModel.retrieve_user_roles_by_user_id(req.params.userID, req.groupID);
        if (!queryData) {
            throw new ExpressError("Retrieving Group User Roles Failed", 400);
        }
        
        return res.json({GroupUserRoles: [queryData]})
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 01/22/2022
// Add User Role
groupMgmtRouter.post("/users/:userID/roles", authMW.defineGroupPermissions(["read_user_role", "create_user_role"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.params.userID || !req.groupID || !req.body.roleID) {
            throw new ExpressError(`Must be logged in to assign roles || target user missing || target group missing || target role missing`, 400);
        }

        const reqValues: GroupUserRoleCreateProps = {
            user_id: req.params.userID,
            grouprole_id: req.body.roleID
        };
        
        if(!validateCreateGroupUserRoleSchema(reqValues)) {
            throw new ExpressError(`Unable to Create Group User: ${validateCreateGroupUserRoleSchema.errors}`, 400);
        }

        // Process
        const queryData = await GroupModel.create_group_user_role(reqValues.grouprole_id, reqValues.user_id);
        if (!queryData) {
            throw new ExpressError("Create Group User Role Failed", 400);
        }
        
        return res.json({GroupUserRoles: [queryData]})
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 01/22/2022
// Remove User Role
groupMgmtRouter.delete("/users/:userID/roles", authMW.defineGroupPermissions(["read_user_role", "delete_user_role"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.params.userID || !req.groupID || !req.body.roleID) {
            throw new ExpressError(`Must be logged in to create group || target user missing || target group missing || target role missing`, 400);
        }

        // Process
        const queryData = await GroupModel.delete_group_user_role(req.body.roleID, req.params.userID);
        if (!queryData) {
            throw new ExpressError("Delete Group User Role Failed", 400);
        }
        
        return res.json({GroupUserRoles: [queryData]})
    } catch (error) {
        next(error)
    }
});


// Users
// Manual Test - Basic Functionality: 01/22/2022
// Get Users
groupMgmtRouter.get("/users", authMW.defineGroupPermissions(["read_group_user"]), authMW.validatePermissions, async (req, res, next) => {
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
        
        return res.json({GroupUser: [queryData]})
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 01/20/2022
// Add User
groupMgmtRouter.post("/users", authMW.defineGroupPermissions(["read_group_user", "create_group_user"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.body.userID || !req.groupID) {
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
        
        return res.json({GroupUser: [queryData]})
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 01/20/2022
// Remove user
groupMgmtRouter.delete("/users/:userID", authMW.defineGroupPermissions(["read_group_user", "delete_group_user"]), authMW.validatePermissions, async (req, res, next) => {
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
        
        return res.json({GroupUser: [queryData]})
    } catch (error) {
        next(error)
    }
});


// Group Permissions
// Manual Test - Basic Functionality: 01/20/2022
// TODO: It may make sense to create a separate set of permissions for each group with the same names so the permission ids are not duplicated for each group.
// Get Group Permissions
groupMgmtRouter.get("/permissions", authMW.defineGroupPermissions(["read_group_permissions"]), authMW.validatePermissions, async (req, res, next) => {
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
        
        return res.json({GroupUser: [queryData]})
    } catch (error) {
        next(error)
    }
});



// Role Permissions
// Manual Test - Basic Functionality: 01/20/2022
// Get Role Permissions
groupMgmtRouter.get("/roles/:roleID/permissions", authMW.defineGroupPermissions(["read_role_permissions"]), authMW.validatePermissions, async (req, res, next) => {
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

// Add Role Permissions
// Manual Test - Basic Functionality: 01/20/2022
groupMgmtRouter.post("/roles/:roleID/permissions", authMW.defineGroupPermissions(["read_role_permissions", "create_role_permissions"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.body.permissions || req.body.permissions.length === 0 || !req.groupID || !req.params.roleID) {
            throw new ExpressError(`Must be logged in to create group role || missing permissions to add || target group missing || target role missing`, 400);
        }

        const reqValues: Array<GroupRolePermissionCreateProps> = [];
        req.body.permissions.forEach(permission => {
            const permissionEntry: GroupRolePermissionCreateProps = {
                grouprole_id: req.params.roleID,
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
});

// Remove Role Permissions
// Manual Test - Basic Functionality: 01/20/2022
groupMgmtRouter.delete("/roles/:roleID/permissions", authMW.defineGroupPermissions(["read_role_permissions", "delete_role_permissions"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.params.roleID || !req.groupID || !req.body.permissionID) {
            throw new ExpressError(`Must be logged in to delete permissions || target role missing || target group missing || target permission missing`, 400);
        }

        // Process
        const queryData = await GroupModel.delete_role_pemission(req.params.roleID, req.body.permissionID);
        if (!queryData) {
            throw new ExpressError("Delete Group Role Permission Failed", 400);
        }
        
        return res.json({GroupRolePermissions: [queryData]})
    } catch (error) {
        next(error)
    }
});



// Roles
// Manual Test - Basic Functionality: 01/20/2022
// Get Roles
groupMgmtRouter.get("/roles", authMW.defineGroupPermissions(["read_role"]), authMW.validatePermissions, async (req, res, next) => {
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

// Manual Test - Basic Functionality: 01/20/2022
// Add Role
groupMgmtRouter.post("/roles", authMW.defineGroupPermissions(["read_role", "create_role"]), authMW.validatePermissions, async (req, res, next) => {
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

// Manual Test - Basic Functionality: 01/20/2022
// Remove Role
groupMgmtRouter.delete("/roles", authMW.defineGroupPermissions(["read_role", "delete_role"]), authMW.validatePermissions, async (req, res, next) => {
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






export default groupMgmtRouter;