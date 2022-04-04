import * as express from "express";

// Utility Functions Import
import ExpressError from "../utils/expresError";

// Schema Imports
import validateCreateGroupSchema, { GroupCreateProps } from "../schemas/group/groupCreateSchema";

// Model Imports
import GroupModel from "../models/groupModel";

// Middleware Imports
import authMW from "../middleware/authorizationMW";

// Sub Routers
import groupIDRouter from "./groupRouters/groupIDRouter";


const groupRootRouter = express.Router();

/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Manually Tested 2022-03-22
groupRootRouter.post("/create", 
        authMW.defineRoutePermissions({
            user: ["site_create_group_self"],
            group: [],
            public: []
        }),
        authMW.validateRoutePermissions,
    async (req, res, next) => {
    try {
        // Preflight
        if (!req.user?.id) {throw new ExpressError(`Must be logged in to create group`, 401);};

        const reqValues: GroupCreateProps = {
            context: req.body.context ? req.body.context : "user",
            ownerid: req.user.id,
            name: req.body.name,
            headline: req.body.headline,
            description: req.body.description,
            image_url: req.body.image_url,
            location: req.body.location,
            public: req.body.public
        };

        if(!validateCreateGroupSchema(reqValues)) {
            throw new ExpressError(`Unable to Create Group - Schema Validation Error: ${validateCreateGroupSchema.errors}`, 400);
        };

        // Processing
        let queryData;
        switch (reqValues.context) {
            case "user": 
            queryData = await GroupModel.create_group(reqValues);
                break;
            default:
        };

        
        // const queryData = await GroupModel.create_group(req.user.id, reqValues);
        if (!queryData) {
            throw new ExpressError("Create Group Failed", 500);
        };
        
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
// Manually Tested 2022-03-22
groupRootRouter.get("/list",
    authMW.defineRoutePermissions({
        user: [],
        group: [],
        public: ["site_read_group_public"]
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
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

groupRootRouter.use("/:groupID", authMW.addGroupIDToRequest, authMW.loadGroupPermissions, groupIDRouter);


export default groupRootRouter;