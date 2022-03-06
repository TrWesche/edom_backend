// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../utils/expresError";

// Model Imports
import EquipModel from "../models/equipModel";

// Middleware Imports
import authMW from "../middleware/authorizationMW";


const equipRootRouter = express.Router();


/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/
// Manual Test - Basic Functionality: 01/15/2022
equipRootRouter.get("/list", authMW.defineSitePermissions(["view_equip_public"]), authMW.validatePermissions, async (req, res, next) => {
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
equipRootRouter.get("/users/:userID", authMW.defineSitePermissions(["view_equip_public"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Processing
        const queryData = await EquipModel.retrieve_user_equip_by_user_id(req.params.userID, true);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found: Get User Equipment - Public", 404);
        };
        
        return res.json({equip: queryData});
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 01/18/2022
equipRootRouter.get("/groups/:groupID", authMW.defineSitePermissions(["view_equip_public"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Processing
        const queryData = await EquipModel.retrieve_group_equip_by_group_id(req.params.groupID, true);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found: Get Group Equipment - Public", 404);
        };
        
        return res.json({equip: queryData});
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 01/15/2022
equipRootRouter.get("/rooms/:roomID", authMW.defineSitePermissions(["view_equip_public"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        // Processing
        const queryData = await EquipModel.retrieve_room_equip_by_room_id(req.params.roomID, true);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found: Get Group Equipment - Public", 404);
        };
        
        return res.json({equip: queryData});
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 01/15/2022
equipRootRouter.get("/:equipID", authMW.defineSitePermissions(["view_equip_public"]), authMW.validatePermissions, async (req, res, next) => {
    try {
        const queryData = await EquipModel.retrieve_equip_by_equip_id(req.params.equipID, true);
        if (!queryData) {
            throw new ExpressError("Equipment Not Found.", 404);
        }
        
        return res.json({equip: queryData});
    } catch (error) {
        next(error)
    }
});


// Check for elevated permissions through user id
equipRootRouter.get(
    "/test/:equipID", 
    authMW.defineRoutePermissions({
        user: ["read_equip_self"],
        group: ["read_equip"],
        public: ["view_equip_public"]
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            const queryData = await EquipModel.retrieve_equip_by_equip_id(req.params.equipID);
            if (!queryData) {
                throw new ExpressError("Equipment Not Found.", 404);
            }
            console.log("Resolved with User Equip Elevated Privilidges.");
            return res.json({equip: [queryData]});
        } catch (error) {
            next(error)
        }
    }
);

// Check for elevated permissions through group id
// equipRootRouter.get(
//     "/test/:equipID", 
//     authMW.defineGroupPermissions(["read_equip"]), 
//     authMW.validatePermissionsGroup, 
//     async (req, res, next) => {
//         try {
//             const queryData = await EquipModel.retrieve_equip_by_equip_id(req.params.equipID);
//             if (!queryData) {
//                 throw new ExpressError("Equipment Not Found.", 404);
//             }
//             console.log("Resolved with Group Equip Elevated Privilidges.");
//             return res.json({equip: [queryData]});
//         } catch (error) {
//             next(error)
//         }
//     }
// );

// Default to public view
// equipRootRouter.get(
//     "/test/:equipID", 
//     authMW.defineSitePermissions(["view_equip_public"]), 
//     authMW.validatePermissionsSite, 
//     async (req, res, next) => {
//         try {
//             const queryData = await EquipModel.retrieve_equip_by_equip_id(req.params.equipID, true);
//             if (!queryData) {
//                 throw new ExpressError("Equipment Not Found.", 404);
//             }
//             console.log("Resolved with Public Privilidges.");
//             return res.json({equip: queryData});
//         } catch (error) {
//             next(error)
//         }
//     }
// );



export default equipRootRouter;