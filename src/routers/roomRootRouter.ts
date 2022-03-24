// Library Imports
import * as express from "express";

// Utility Functions Import
import ExpressError from "../utils/expresError";

// Model Imports
import RoomModel from "../models/roomModel";

// Middleware Imports
import authMW from "../middleware/authorizationMW";

// Schema Imports
import validateRoomCreateSchema, { RoomCreateProps } from "../schemas/room/roomCreateSchema";
import validtteRoomUpdateSchema, { RoomUpdateProps } from "../schemas/room/roomUpdateSchema";


const roomRootRouter = express.Router();




/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 01/13/2022
roomRootRouter.post("/create", 
    authMW.addContextToRequest,
    authMW.defineRoutePermissions({
        user: ["site_create_room_self"],
        group: ["group_create_room"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            if (!req.user?.id) {throw new ExpressError(`Must be logged in to create room`, 401);};

            const reqValues: RoomCreateProps = {
                context: req.body.context ? req.body.context : "user",
                ownerid: req.body.ownerid ? req.body.ownerid : req.user.id,
                name: req.body.name,
                category_id: req.body.category_id,
                headline: req.body.headline,
                description: req.body.description,
                image_url: req.body.image_url,
                public: req.body.public
            };

            if(!validateRoomCreateSchema(reqValues)) {
                throw new ExpressError(`Unable to Create Room - Schema Validation Error: ${validateRoomCreateSchema.errors}`, 400);
            };

            // Processing
            let queryData;
            let permCheck;
            switch (reqValues.context) {
                case "user": 
                    permCheck = req.resolvedPerms?.reduce((acc: any, val: any) => {
                        return acc = acc || (val.permissions_name === "site_create_room_self")
                    }, false);

                    if (permCheck) {
                        queryData = await RoomModel.create_user_room(reqValues);
                    } else {
                        throw new ExpressError("Unauthorized", 401);
                    };
                    break;
                case "group":
                    permCheck = req.resolvedPerms?.reduce((acc: any, val: any) => {
                        return acc = acc || (val.permissions_name === "group_create_room")
                    }, false);

                    if (permCheck) {
                        queryData = await RoomModel.create_group_room(reqValues);
                    } else {
                        throw new ExpressError("Unauthorized", 401);
                    };
                    break;
                default:
            };

            if (!queryData) {
                throw new ExpressError("Create Room Failed", 500);
            };

            return res.json({rooms: [queryData]});
        } catch (error) {
            next(error);
        };
    }
);


/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/
// Manual Test - Basic Functionality: 01/19/2022
roomRootRouter.get("/list", 
    authMW.defineSitePermissions(["view_room_public"]), authMW.validatePermissions, 
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
            const queryData = await RoomModel.retrieve_room_list_paginated(limit, offset);
            if (!queryData) {
                throw new ExpressError("Rooms Not Found.", 404);
            }
            
            return res.json({rooms: queryData});
        } catch (error) {
            next(error)
        }
    }
);

// Manual Test - Basic Functionality: 01/22/2022
roomRootRouter.get("/users/:userID", authMW.defineSitePermissions(["view_room_public"]), authMW.validatePermissions, async (req, res, next) => {
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

// Manual Test - Basic Functionality: 01/19/2022
roomRootRouter.get("/groups/:groupID", authMW.defineSitePermissions(["view_room_public"]), authMW.validatePermissions, async (req, res, next) => {
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


roomRootRouter.get("/:roomID", 
    authMW.defineRoutePermissions({
        user: ["read_room_self"],
        group: ["read_room"],
        public: ["view_room_public"]
    }),
    authMW.validateRoutePermissions, 
    async (req, res, next) => {
    try {
        const queryData = await RoomModel.retrieve_room_by_room_id(req.params.roomID);
        if (!queryData) {
            throw new ExpressError("Room Not Found.", 404);
        }
        
        return res.json({room: queryData});
    } catch (error) {
        next(error)
    }
});

export default roomRootRouter;