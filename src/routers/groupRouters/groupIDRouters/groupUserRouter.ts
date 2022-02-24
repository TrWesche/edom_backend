// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../../../utils/expresError";

// Schema Imports

// Model Imports
import GroupModel from "../../../models/groupModel";

// Middleware Imports
import authMW from "../../../middleware/authorizationMW";



const groupUserRouter = express.Router();


/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/


// Manual Test - Basic Functionality: 01/19/2022
// TODO: This will need to filter who shows in the group based on the viewing user's permissions (i.e. hide users who do not have public profiles)
// Get Room List
groupUserRouter.get("/", authMW.defineGroupPermissions(["read_room"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id || !req.groupID) {
            throw new ExpressError("Invalid Call: Get Group Users - All", 401);
        };

        // Processing
        const queryData = await GroupModel.retrieve_users_by_group_id(req.groupID);
        if (!queryData) {
            throw new ExpressError("Users Not Found: Get Group Users - All", 404);
        };
        
        return res.json({users: queryData});
    } catch (error) {
        next(error)
    }
});



export default groupUserRouter;