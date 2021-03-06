// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../../utils/expresError";

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

// Manually Tested 2022-03-22
/** Get User Profile Route - Based on Username */
userDeviceMasterRouter.get("/:username", 
    authMW.defineRoutePermissions({
        user: ["site_read_user_self"],
        group: [],
        public: ["site_read_user_public"]
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
    try {
        let queryData;
        
        const userSelf = req.resolvedPerms?.reduce((acc: any, val: any) => {
            return acc = acc || (val.permissions_name === "site_read_user_self")
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

// Manually Tested 2022-03-22
/** Get User Groups Route - Based on Username */
userDeviceMasterRouter.get("/:username/group", 
    authMW.defineRoutePermissions({
        user: ["site_read_group_self"],
        group: [],
        public: ["site_read_group_public"]
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
    try {
        if (!req.user?.id) {throw new ExpressError("User ID Not Defined", 401)};

        let queryData;

        // Read in Query Params
        const limit = typeof(req.query.limit) === "string" ? Number(req.query.limit) : 4;
        const offset = typeof(req.query.offset) === "string" ? Number(req.query.offset) : 0;
        // const catid = typeof(req.query.catid) === "string" ? req.query.catid : null;
        const search = typeof(req.query.s) === "string" ? req.query.s : null;
        // TODO: Will need to add functionality for featured items, ordering, favorites
        // const featured = typeof(req.query.feat) === "string" ? req.query.feat : null; // true, false text
        // const favorites = typeof(req.query.fav) === "string" ? req.query.fav : null; // true, false text
        // const orderby = typeof(req.query.orderby) === "string" ? req.query.orderby : null; //vlohi, vhilo, dtlohi, dthilo


        const userSelf = req.resolvedPerms?.reduce((acc: any, val: any) => {
            return acc = acc || (val.permissions_name === "site_read_group_self")
        }, false);
        

        if (userSelf) {
            queryData = await GroupModel.retrieve_user_groups_list_by_user_id(req.user?.id, "elevated", limit, offset, search)
        } else 
        if (req.targetUID) {
            queryData = await GroupModel.retrieve_user_groups_list_by_user_id(req.targetUID, "public", limit, offset, search)
        };
        
        if (!queryData) {
            throw new ExpressError("Groups not found.", 404);
        }
        
        return res.json({group: queryData});
    } catch (error) {
        next(error)
    }
});

// Manually Tested 2022-03-22
/** Get User Rooms Route - Based on Username */
userDeviceMasterRouter.get("/:username/room", 
    authMW.defineRoutePermissions({
        user: ["site_read_room_self"],
        group: [],
        public: ["site_read_room_public"]
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
    try {
        if (!req.user?.id) {throw new ExpressError("User ID Not Defined", 401)};

        let queryData;

        // Read in Query Params
        const limit = typeof(req.query.limit) === "string" ? Number(req.query.limit) : 4;
        const offset = typeof(req.query.offset) === "string" ? Number(req.query.offset) : 0;
        const catid = typeof(req.query.catid) === "string" ? req.query.catid : null;
        const search = typeof(req.query.s) === "string" ? req.query.s : null;
        // TODO: Will need to add functionality for featured items, ordering, favorites
        // const featured = typeof(req.query.feat) === "string" ? req.query.feat : null; // true, false text
        // const favorites = typeof(req.query.fav) === "string" ? req.query.fav : null; // true, false text
        // const orderby = typeof(req.query.orderby) === "string" ? req.query.orderby : null; //vlohi, vhilo, dtlohi, dthilo

        const userSelf = req.resolvedPerms?.reduce((acc: any, val: any) => {
            return acc = acc || (val.permissions_name === "site_read_room_self")
        }, false);
        

        if (userSelf) {
            queryData = await RoomModel.retrieve_user_rooms_list_by_user_id(req.user?.id, "user", limit, offset, catid, search)
        } else 
        if (req.targetUID) {
            queryData = await RoomModel.retrieve_user_rooms_list_by_user_id(req.targetUID, "public", limit, offset, catid, search)
        };
        
        if (!queryData) {
            throw new ExpressError("Rooms not found.", 404);
        }
        
        return res.json({rooms: queryData});
    } catch (error) {
        next(error)
    }
});

// Manually Tested 2022-03-22
/** Get User Equip Route */
userDeviceMasterRouter.get("/:username/equip", 
    authMW.defineRoutePermissions({
        user: ["site_read_equip_self"],
        group: [],
        public: ["site_read_equip_public"]
    }),
    authMW.validateRoutePermissions,    
    async (req, res, next) => {
    try {
        if (!req.user?.id) {throw new ExpressError("User ID Not Defined", 401)};

        let queryData;

        // Read in Query Params
        const limit = typeof(req.query.limit) === "string" ? Number(req.query.limit) : 4;
        const offset = typeof(req.query.offset) === "string" ? Number(req.query.offset) : 0;
        const catid = typeof(req.query.catid) === "string" ? req.query.catid : null;
        const search = typeof(req.query.s) === "string" ? req.query.s : null;
        // TODO: Will need to add functionality for featured items, ordering, favorites
        // const featured = typeof(req.query.feat) === "string" ? req.query.feat : null; // true, false text
        // const favorites = typeof(req.query.fav) === "string" ? req.query.fav : null; // true, false text
        // const orderby = typeof(req.query.orderby) === "string" ? req.query.orderby : null; //vlohi, vhilo, dtlohi, dthilo

        // Determine Permission Level
        const userSelf = req.resolvedPerms?.reduce((acc: any, val: any) => {
            return acc = acc || (val.permissions_name === "site_read_equip_self")
        }, false);
    

        if (userSelf) {
            queryData = await EquipModel.retrieve_user_equip_list_by_user_id(req.user?.id, "user", limit, offset, catid, search)
        } else 
        if (req.targetUID) {
            queryData = await EquipModel.retrieve_user_equip_list_by_user_id(req.targetUID, "public", limit, offset, catid, search)
        };
        
        if (!queryData) {
            throw new ExpressError("Equip not found.", 404);
        }
        
        return res.json({equip: queryData});
    } catch (error) {
        next(error)
    }
});

export default userDeviceMasterRouter;