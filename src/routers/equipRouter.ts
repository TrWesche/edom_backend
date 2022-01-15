// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../utils/expresError";

// Model Imports
import EquipModel from "../models/equipModel";

// Middleware Imports
import authMW from "../middleware/authorizationMW";
import siteMW from "../middleware/siteMW";


// interface equipRouterQuery {
//     limit: number
//     offset: number
//     orderby: string
//     ftsearch: string
// }


const equipRouter = express.Router();


/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/
// Manual Test - Basic Functionality: 01/15/2022
equipRouter.get("/list", siteMW.defineActionPermissions(["view_equip_public"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // TODO: Add free text search, category type filters, user filters, group filters
        
        // const {limit, offset} = req.query as unknown as equipRouterQuery;
        // Preflight
        const limit = req.query.limit ? req.query.limit : 25;
        const offset = req.query.offset ? req.query.offset : 0;
        // const ftserach = req.query.ftsearch;
        // const catid = req.query.catid;
        // const uid = req.query.uid;
        // const gid = req.query.gid;

        if (typeof limit !== "number" || typeof offset !== "number") {
            throw new ExpressError("One or more query parameters is of an invalid type", 404);
        };


        // Processing
        const queryData = await EquipModel.retrieve_equip_list_paginated(limit, offset);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found.", 404);
        }
        
        return res.json({equip: queryData});
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 01/15/2022
equipRouter.get("/users/:userID", siteMW.defineActionPermissions(["view_equip_public"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Processing
        const queryData = await EquipModel.retrieve_user_equip_by_user_id_public(req.params.userID);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found: Get User Equipment - Public", 404);
        };
        
        return res.json({equip: queryData});
    } catch (error) {
        next(error)
    }
});

equipRouter.get("/groups/:groupID", siteMW.defineActionPermissions(["view_equip_public"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Processing
        const queryData = await EquipModel.retrieve_group_equip_by_group_id_public(req.params.groupID);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found: Get Group Equipment - Public", 404);
        };
        
        return res.json({equip: queryData});
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 01/15/2022
equipRouter.get("/rooms/:roomID", siteMW.defineActionPermissions(["view_equip_public"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Processing
        const queryData = await EquipModel.retrieve_room_equip_by_room_id_public(req.params.roomID);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found: Get Group Equipment - Public", 404);
        };
        
        return res.json({equip: queryData});
    } catch (error) {
        next(error)
    }
});

equipRouter.get("/:equipID", siteMW.defineActionPermissions(["view_equip_public"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        const queryData = await EquipModel.retrieve_equip_by_equip_id(req.params.equipID, true);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found.", 404);
        }
        
        return res.json({equip: [queryData]});
    } catch (error) {
        next(error)
    }
});


export default equipRouter;