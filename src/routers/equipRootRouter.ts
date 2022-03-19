// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../utils/expresError";

// Model Imports
import EquipModel from "../models/equipModel";

// Middleware Imports
import authMW from "../middleware/authorizationMW";
import validateEquipCreateSchema, { EquipCreateProps } from "../schemas/equipment/equipCreateSchema";
import UserModel from "../models/userModel";
import GroupModel from "../models/groupModel";


const equipRootRouter = express.Router();




/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 03/19/2022
equipRootRouter.post(
    "/create", 
    authMW.defineRoutePermissions({
        user: ["create_equip_self"],
        group: ["create_equip"],
        public: []
    }),
    authMW.validateRoutePermissions,
async (req, res, next) => {
try {
    // Preflight
    if (!req.user?.id) {throw new ExpressError(`Must be logged in to create equip`, 401);};

    const reqValues: EquipCreateProps = {
        context: req.body.context ? req.body.context : "user",
        ownerid: req.body.ownerid ? req.body.ownerid : req.user.id,
        name: req.body.name,
        category_id: req.body.category_id,
        headline: req.body.headline,
        description: req.body.description,
        image_url: req.body.image_url,
        public: req.body.public,
        configuration: req.body.configuration
    };

    if(!validateEquipCreateSchema(reqValues)) {
        throw new ExpressError(`Unable to Create Equip - Schema Validation Error: ${validateEquipCreateSchema.errors}`, 400);
    };

    // Processing
    let queryData;
    let idcheck;
    switch (reqValues.context) {
        case "user": 
            idcheck = await UserModel.retrieve_user_by_user_id(reqValues.ownerid);
            if (!idcheck)  {throw new ExpressError(`Value is not a valid userid`, 401);};
            queryData = await EquipModel.create_user_equip(reqValues);
            break;
        case "group":
            idcheck = await GroupModel.retrieve_group_by_group_id(reqValues.ownerid, "elevated");
            if (!idcheck)  {throw new ExpressError(`Value is not a valid groupid`, 401);};
            queryData = await EquipModel.create_group_equip(reqValues);
            break;
        default:
    };

    
    // const queryData = await GroupModel.create_group(req.user.id, reqValues);
    if (!queryData) {
        throw new ExpressError("Create Group Failed", 500);
    };
    
    return res.json({equip: queryData})
} catch (error) {
    next(error)
}
});

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


// Check for elevated permissions through user id
equipRootRouter.get(
    "/:equipID", 
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
            return res.json({equip: [queryData]});
        } catch (error) {
            next(error)
        }
    }
);


export default equipRootRouter;