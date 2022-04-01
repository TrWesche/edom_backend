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
import groupUserRoleRouter from "./groupUserRoleRouter";

const groupUserRouter = express.Router();

groupUserRouter.use("/:username", groupUserRoleRouter);

/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/

// TODO: This needs to be adjusted to a new procedure.  If User has requested access, check group_invite table and then create the connection.
// If user has not requested access create an entry in the group_invite table.  The complementary User routes will need to be created.
// Add User
groupUserRouter.post("/",
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_create_group_user"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id || !req.body.userID || !req.groupID) {
                throw new ExpressError(`Must be logged in to add group user || target users missing || target group missing`, 400);
            };

            const reqValues: GroupUserCreateProps = {
                usernames: req.body.usernames,
                groupID: req.groupID
            };

            if(!validateCreateGroupUserSchema(reqValues)) {
                throw new ExpressError(`Unable to create group user, schema check failure: ${validateCreateGroupUserSchema.errors}`, 400);
            };
            
            const uidgidpairs = await GroupModel.retrieve_group_membership_requests(reqValues.groupID, reqValues.usernames);

            const addUserList: Array<string> = [];
            const addReqList: Array<string> = [];

            if (uidgidpairs.length > 0) {
                uidgidpairs.forEach((val) => {
                    if (val.user_request) {
                        addUserList.push(val.user_id);
                    } else if (val.group_request) {
                        // If group request is already set to true an invite has already been sent, do nothing.
                    } else {
                        addReqList.push(val.user_id);
                    };
                });
            };
            
            let addUserQueryData;
            let addReqQueryData;

            if (addUserList.length > 0) {
                addUserQueryData = await GroupModel.create_group_user(reqValues.groupID, addUserList);
                if (!addUserQueryData) {throw new ExpressError("Create Group User Failed", 400);};
            };


            if (addReqList.length > 0) {
                addReqQueryData = await GroupModel.create_request_group_to_user(reqValues.groupID, addReqList);
                if (!addUserQueryData) {throw new ExpressError("Create Invite Group to User Failed", 400);};
            };
            
            return res.json({GroupUsersAdded: addUserQueryData, GroupInvitesSent: addReqQueryData});
        } catch (error) {
            next(error)
        };
    }
);


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
        group: ["group_read_room"],
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
                if (val.permissions_name === "group_read_room") {
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


/* ____  _____ _     _____ _____ _____ 
  |  _ \| ____| |   | ____|_   _| ____|
  | | | |  _| | |   |  _|   | | |  _|  
  | |_| | |___| |___| |___  | | | |___ 
  |____/|_____|_____|_____| |_| |_____|
*/

// Remove user
groupUserRouter.delete("/:username", 
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_delete_group_user"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id || !req.params.username || !req.groupID) {
                throw new ExpressError(`Must be logged in to delete group user || target user missing || target group missing`, 400);
            }

            // Process
            const queryData = await GroupModel.delete_group_user(req.groupID, req.params.username);
            if (!queryData) {
                throw new ExpressError("Delete Group User Failed", 400);
            };
            
            return res.json({GroupUser: [queryData]});
        } catch (error) {
            next(error)
        };
    }
);

export default groupUserRouter;