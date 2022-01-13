// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../utils/expresError";

// Model Imports
import RoomModel from "../models/roomModel";

// Middleware Imports
import authMW from "../middleware/authorizationMW";
import siteMW from "../middleware/siteMW";


// interface equipRouterQuery {
//     limit: number
//     offset: number
//     orderby: string
//     ftsearch: string
// }


const roomRouter = express.Router();


/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/

roomRouter.get("/list", siteMW.defineActionPermissions(["view_room_public"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // TODO: Add free text search, category type filters, user filters, group filters
        
        // const {limit, offset} = req.query as unknown as equipRouterQuery;
        // Preflight
        const limit = req.query.limit;
        const offset = req.query.offset;
        // const ftserach = req.query.ftsearch;
        // const catid = req.query.catid;
        // const uid = req.query.uid;
        // const gid = req.query.gid;

        if (typeof limit !== "number" || typeof offset !== "number") {
            throw new ExpressError("One or more query parameters is of an invalid type", 404);
        };


        // Processing
        const queryData = await RoomModel.retrieve_room_list_paginated(limit, offset);
        if (!queryData) {
            throw new ExpressError("Rooms Not Found.", 404);
        }
        
        return res.json({rooms: queryData});
    } catch (error) {
        next(error)
    }
});


roomRouter.get("/users/:userID", siteMW.defineActionPermissions(["view_room_public"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Processing
        const queryData = await RoomModel.retrieve_user_rooms_by_user_id_public(req.params.userID);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found: Get User Rooms - Public", 404);
        };
        
        return res.json({rooms: queryData});
    } catch (error) {
        next(error)
    }
});


roomRouter.get("/groups/:groupID", siteMW.defineActionPermissions(["view_room_public"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Processing
        const queryData = await RoomModel.retrieve_group_rooms_by_group_id_public(req.params.groupID);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found: Get Group Rooms - Public", 404);
        };
        
        return res.json({rooms: queryData});
    } catch (error) {
        next(error)
    }
});


roomRouter.get("/:roomID", siteMW.defineActionPermissions(["view_equip_public"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        const queryData = await RoomModel.retrieve_room_by_room_id(req.params.roomID, true);
        if (!queryData) {
            throw new ExpressError("Room Not Found.", 404);
        }
        
        return res.json({rooms: [queryData]});
    } catch (error) {
        next(error)
    }
});


export default roomRouter;