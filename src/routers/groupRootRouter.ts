import * as express from "express";

// Utility Functions Import
import ExpressError from "../utils/expresError";

// Schema Imports
import validateCreateGroupSchema, { GroupCreateProps } from "../schemas/group/groupCreateSchema";
// import validateUpdateGroupSchema, { GroupUpdateProps } from "../schemas/group/groupUpdateSchema";

// Model Imports
import GroupModel from "../models/groupModel";

// Middleware Imports
import authMW from "../middleware/authorizationMW";
import siteMW from "../middleware/siteMW";
import groupMW from "../middleware/groupMW";

// Sub Routers
import groupIDRouter from "./groupRouters/groupIDRouter";
// import groupMgmtRouter from "./groupRouters/groupMgmtRouter";
// import groupRoomRouter from "./groupRouters/groupRoomRouter";
// import groupEquipRouter from "./groupRouters/groupEquipRouter";


const groupRootRouter = express.Router();



/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 01/17/2022 - Retest w/ user_groups connection update
groupRootRouter.post("/create", siteMW.defineActionPermissions(["create_group_self"]), async (req, res, next) => {
    try {
        // Preflight
        const reqValues: GroupCreateProps = {
            name: req.body.name,
            headline: req.body.headline,
            description: req.body.description,
            public: req.body.public
        };
        
        
        if (!req.user?.id) {
            throw new ExpressError(`Must be logged in to create group`, 400);
        }

        if(!validateCreateGroupSchema(reqValues)) {
            throw new ExpressError(`Unable to Create Group: ${validateCreateGroupSchema.errors}`, 400);
        }

        // Process
        const queryData = await GroupModel.create_group(req.user.id, reqValues);
        if (!queryData) {
            throw new ExpressError("Create Group Failed", 400);
        }
        
        return res.json({group: [queryData]})
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
// Manual Test - Basic Functionality: 01/16/2022
groupRootRouter.get("/list", siteMW.defineActionPermissions(["view_group_public"]), authMW.validatePermissions, async (req, res, next) => {
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
        const queryData = await GroupModel.retrieve_group_list_paginated(limit, offset);
        if (!queryData) {
            throw new ExpressError("Groups Not Found.", 404);
        }
        
        return res.json({group: queryData});
    } catch (error) {
        next(error)
    }
});

groupRootRouter.use("/:groupID", groupMW.addGroupIDToRequest, authMW.loadGroupPermissions, groupIDRouter);


export default groupRootRouter;