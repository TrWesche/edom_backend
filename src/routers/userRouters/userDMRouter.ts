// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../../utils/expresError";

// Schema Imports
import validateUserEquipCreateSchema, { UserEquipCreateProps } from "../../schemas/equipment/userEquipCreateSchema";
import validateUserEquipUpdateSchema, { UserEquipUpdateProps } from "../../schemas/equipment/userEquipUpdateSchema";

// Model Imports
import EquipModel from "../../models/equipModel";
import UserModel from "../../models/userModel";
import GroupModel from "../../models/groupModel";
import RoomModel from "../../models/roomModel";

// Middleware Imports
import authMW from "../../middleware/authorizationMW";


const userDeviceMasterRouter = express.Router();


/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/

// Manual Test Success - 2022/03/12
/** Get User Profile Route - Based on Username */
userDeviceMasterRouter.get("/:username", 
    authMW.defineRoutePermissions({
        user: ["read_user_self"],
        group: [],
        public: ["view_user_public"]
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
    try {
        let queryData;

        const userSelf = req.resolvedPerms?.reduce((acc: any, val: any) => {
            return acc = acc || (val.permissions_name === "read_user_self")
        }, false);
        

        if (userSelf) {
            queryData = await UserModel.retrieve_user_by_user_id(req.user?.id)
        } else {
            queryData = await UserModel.retrieve_user_by_username(req.params.username);
        };
        
        if (!queryData) {
            throw new ExpressError("Unable to find a user with provided username.", 404);
        }
        
        return res.json({user: queryData});
    } catch (error) {
        next(error)
    }
});

/** Get User Groups Route - Based on Username */
userDeviceMasterRouter.get("/:username/group", 
    authMW.defineRoutePermissions({
        user: ["read_group_self"],
        group: [],
        public: ["view_group_public"]
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
    try {
        if (!req.user?.id) {throw new ExpressError("User ID Not Defined", 401)};

        let queryData;

        const userSelf = req.resolvedPerms?.reduce((acc: any, val: any) => {
            return acc = acc || (val.permissions_name === "read_group_self")
        }, false);
        

        if (userSelf) {
            queryData = await GroupModel.retrieve_user_groups_list_by_user_id(req.user?.id, "user", 10, 0)
        } else 
        if (req.targetUID) {
            queryData = await GroupModel.retrieve_user_groups_list_by_user_id(req.targetUID, "public", 10, 0)
        };
        
        if (!queryData) {
            throw new ExpressError("Groups not found.", 404);
        }
        
        return res.json({group: queryData});
    } catch (error) {
        next(error)
    }
});

/** Get User Rooms Route - Based on Username */
userDeviceMasterRouter.get("/:username/room", 
    authMW.defineRoutePermissions({
        user: ["read_room_self"],
        group: [],
        public: ["view_room_public"]
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
    try {
        if (!req.user?.id) {throw new ExpressError("User ID Not Defined", 401)};

        let queryData;

        const userSelf = req.resolvedPerms?.reduce((acc: any, val: any) => {
            return acc = acc || (val.permissions_name === "read_group_self")
        }, false);
        

        if (userSelf) {
            queryData = await RoomModel.retrieve_user_rooms_list_by_user_id(req.user?.id, "user", 10, 0)
        } else 
        if (req.targetUID) {
            queryData = await GroupModel.retrieve_user_groups_list_by_user_id(req.targetUID, "public", 10, 0)
        };
        
        if (!queryData) {
            throw new ExpressError("Rooms not found.", 404);
        }
        
        return res.json({room: queryData});

        // Preflight
        // if (!req.user?.id) {
        //     throw new ExpressError("Invalid Call: Get User Rooms - All", 401);
        // };

        // // Processing
        // const queryData = await RoomModel.retrieve_user_rooms_by_user_id_all(req.user?.id);
        // if (!queryData) {
        //     throw new ExpressError("Rooms Not Found: Get User Rooms - All", 404);
        // };
        
        // return res.json({equip: queryData});
    } catch (error) {
        next(error)
    }
});

/** Get User Equip Route */
userDeviceMasterRouter.get("/:username/equip", 
    authMW.defineRoutePermissions({
        user: ["read_equip_self"],
        group: [],
        public: []
    }),
    authMW.validateRoutePermissions,    
    async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id) {
            throw new ExpressError("Invalid Call: Get User Equip - All", 401);
        };

        // Processing
        const queryData = await EquipModel.retrieve_user_equip_by_user_id(req.user?.id);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found: Get User Equipment - All", 404);
        };
        
        return res.json({equip: queryData});
    } catch (error) {
        next(error)
    }
});

export default userDeviceMasterRouter;