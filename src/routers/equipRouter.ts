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

equipRouter.get("/list", siteMW.defineActionPermissions(["view_equip_public"]), authMW.validatePermissions, async (req, res, next) => {
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
        const queryData = await EquipModel.retrieve_equip_list_paginated(limit, offset);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found.", 404);
        }
        
        return res.json({equip: [queryData]});
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