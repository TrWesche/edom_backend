import * as express from "express";

// Utility Functions Import
import ExpressError from "../../../utils/expresError";

// Schema Imports
import validateCreateGroupUserSchema, { GroupUserCreateProps } from "../../../schemas/group/groupUserCreateSchema";

// Model Imports
import GroupModel from "../../../models/groupModel";

// Middleware Imports
import authMW from "../../../middleware/authorizationMW";


const groupMgmtRouterRequest = express.Router({mergeParams: true});


/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/

// Manually Tested - 2022-04-04
// Send Request, Remove Reqeust, Accept Request, Filter Existing Users, Filter Existing Requests
// Add User / Request User Membership
groupMgmtRouterRequest.post("/",
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_create_group_user"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id || !req.groupID) {throw new ExpressError("Unauthorized", 401);};
            if (!req.body.context || !req.body.action) {throw new ExpressError("Invalid Request", 400);};

            let queryData;

            switch (req.body.context) {
                case "user":
                    const reqValues: GroupUserCreateProps = {
                        usernames: req.body.users,
                        groupID: req.groupID
                    };

                    if(!validateCreateGroupUserSchema(reqValues)) {
                        throw new ExpressError(`Unable to create group user, schema check failure: ${validateCreateGroupUserSchema.errors}`, 400);
                    };

                    let userIDs;

                    switch (req.body.action) {
                        case "accept_request":
                            userIDs = await GroupModel.retrieve_user_id_by_username(reqValues.usernames, reqValues.groupID, "user_request_active");
                            if (userIDs.length < 1) {throw new ExpressError("Unable to add users.", 400);};
                            queryData = await GroupModel.create_group_user(reqValues.groupID, userIDs);
                            return res.json({reqAccept: queryData});
                        case "send_request":
                            userIDs = await GroupModel.retrieve_user_id_by_username(reqValues.usernames, reqValues.groupID, "group_request_permitted");
                            if (userIDs.length < 1) {throw new ExpressError("Unable to invite user to join group.", 400);};
                            queryData = await GroupModel.create_request_group_to_user(reqValues.groupID, userIDs);
                            return res.json({reqSent: queryData});
                        case "remove_request":
                            userIDs = await GroupModel.retrieve_user_id_by_username(reqValues.usernames, reqValues.groupID);
                            if (userIDs.length < 1) {throw new ExpressError("Unable to remove invite request.", 400);};
                            queryData = await GroupModel.delete_request_user_group(userIDs, reqValues.groupID);
                            return res.json({reqRemove: queryData})
                        default:
                            throw new ExpressError("Configuration Error - Invalid Action", 400);
                    };

                default:
                    throw new ExpressError("Configuration Error - Invalid Context", 400);
            };
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
// Manually Tested 2022-04-04
// Get Active Requests
groupMgmtRouterRequest.get("/", 
    authMW.defineRoutePermissions({
        user: [],
        group: ["group_create_group_user"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id || !req.groupID) {throw new ExpressError("Unauthorized", 401);};

            let queryData;
            queryData = await GroupModel.retrieve_group_membership_requests(req.groupID);

            // Processing
            if (!queryData) {throw new ExpressError("Users Not Found: Get Group Users - All", 404);};
            
            return res.json({users: queryData});
        } catch (error) {
            next(error)
        }
    }
);


export default groupMgmtRouterRequest;