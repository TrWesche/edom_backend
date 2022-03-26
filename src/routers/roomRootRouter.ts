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
import EquipModel from "../models/equipModel";


const roomRootRouter = express.Router();


/* ____ ____  _____    _  _____ _____ 
  / ___|  _ \| ____|  / \|_   _| ____|
 | |   | |_) |  _|   / _ \ | | |  _|  
 | |___|  _ <| |___ / ___ \| | | |___ 
  \____|_| \_\_____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 03/24/2022
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

roomRootRouter.post("/:roomID/equip",
    authMW.defineRoutePermissions({
        user: ["site_update_equip_self", "site_update_room_self"],
        group: ["group_update_equip", "group_update_room"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            if (!req.user?.id) {throw new ExpressError(`Must be logged in to create room`, 401);};

            let queryData;

            const reqValues = {
                action: req.body.action,
                context: req.body.context ? req.body.context : "user",
                ownerid: req.body.ownerid ? req.body.ownerid : req.user.id,
                equipid: req.body.equipID
            };

            // Validate Permissions
            let permitted = 0;
            req.resolvedPerms?.forEach((val: any) => {
                if (reqValues.context === "user" && (val.permissions_name === "site_update_equip_self" || val.permissions_name === "site_update_room_self") ) {
                    permitted++;
                };

                if (reqValues.context === "group" && (val.permissions_name === "group_update_equip" || val.permissions_name === "group_update_room") ) {
                    permitted++;
                };
            });
            if (permitted !== 2) {throw new ExpressError("Unauthorized", 401);};


            if (reqValues.context === "user") {
                const equipData = await EquipModel.retrieve_equip_by_user_and_equip_id(reqValues.ownerid, reqValues.equipid);
                if (!equipData.id) {throw new ExpressError("Unauthorized", 401);};
            } else 
            if (reqValues.context === "group") {
                const equipData = await EquipModel.retrieve_equip_by_group_and_equip_id(reqValues.ownerid, reqValues.equipid);
                if (!equipData.id) {throw new ExpressError("Unauthorized", 401);};
            };


            // Verify equip not already assigned to a room
            const equipRoom = await EquipModel.retrieve_equip_rooms_by_equip_id(reqValues.equipid, "full");
            if (equipRoom.length !== 0) {throw new ExpressError("This equip is already assigned to a room.", 400);};


            // Assign equip to the target room
            queryData = await RoomModel.create_equip_room_assignment(reqValues.equipid, req.params.roomID);

            
            if (!queryData) {throw new ExpressError("Assoicate Equipment to Room Failed", 500);};
            
            return res.json({equip_add: queryData});
        } catch (error) {
            next(error)
        }
    }
);
/* ____  _____    _    ____  
  |  _ \| ____|  / \  |  _ \ 
  | |_) |  _|   / _ \ | | | |
  |  _ <| |___ / ___ \| |_| |
  |_| \_\_____/_/   \_\____/ 
*/
// Manual Test - Basic Functionality: 03/24/2022
roomRootRouter.get("/list", 
    authMW.defineRoutePermissions({
        user: [],
        group: [],
        public: ["site_read_equip_public"]
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

// Manual Test - Basic Functionality: 03/24/2022
roomRootRouter.get("/:roomID/equip",
    authMW.defineRoutePermissions({
        user: ["site_read_equip_self", "site_read_room_self"],
        group: ["group_read_equip", "group_read_room"],
        public: ["site_read_equip_public", "site_read_room_public"]
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
    try {
        if (!req.user?.id) {throw new ExpressError("User ID Not Defined", 401)};

        let queryData;

        let roomPermissions = 0; // 1 = Public, 2 = Private
        let equipPermissions = 0; // 1 = Public, 2 = Private

        req.resolvedPerms?.forEach((val: any) => {
            // Set Read Pemission Level - Equip
            if ( ((val.permissions_name === "site_read_equip_self") || (val.permissions_name === "group_read_equip"))) {
                equipPermissions = 2;
            };

            if ( val.permissions_name === "site_read_equip_public" && equipPermissions !== 2) {
                equipPermissions = 1;
            };

            // Set Read Pemission Level - Room
            if ( ((val.permissions_name === "site_read_room_self") || (val.permissions_name === "group_read_room"))) {
                roomPermissions = 2;
            };

            if ( val.permissions_name === "site_read_room_public" && equipPermissions !== 2) {
                roomPermissions = 1;
            };
        })

        if (roomPermissions === 2 && equipPermissions === 2) {
            queryData = await RoomModel.retrieve_room_equip_by_room_id(req.params.roomID, "full");
        } else 
        if (roomPermissions === 1 && equipPermissions === 2) {
            queryData = await RoomModel.retrieve_room_equip_by_room_id(req.params.roomID, "elevatedEquip");
        } else 
        if (roomPermissions === 2 && equipPermissions === 1) {
            queryData = await RoomModel.retrieve_room_equip_by_room_id(req.params.roomID, "elevatedRoom");
        } else 
        if (roomPermissions === 1 && equipPermissions === 1) {
            queryData = await RoomModel.retrieve_room_equip_by_room_id(req.params.roomID, "public");
        };
        
        if (!queryData) {
            throw new ExpressError("Equip not found.", 404);
        }
        
        return res.json({equip: queryData});
    } catch (error) {
        next(error)
    }
});

// Manual Test - Basic Functionality: 03/24/2022
roomRootRouter.get("/:roomID", 
    authMW.defineRoutePermissions({
        user: ["site_read_room_self", "site_update_room_self", "site_delete_room_self"],
        group: ["group_read_room", "group_update_room", "group_delete_room"],
        public: ["site_read_room_public"]
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
    try {
        if (!req.user?.id) {throw new ExpressError("User ID Not Defined", 401)};

        let queryData;

        let readPermitted = 0; // 1 = Public View, 2 = Private View
        let updatePermitted = 0; // 1 = Permitted
        let deletePermitted = 0; // 1 = Permitted

        req.resolvedPerms?.forEach((val: any) => {
            // Set Read Pemission Level
            if ( ((val.permissions_name === "site_read_room_self") || (val.permissions_name === "group_read_room"))) {
                readPermitted = 2;
            };

            if ( val.permissions_name === "site_read_room_public" && readPermitted !== 2) {
                readPermitted = 1;
            };

            // Set Update Permission Level
            if ( ((val.permissions_name === "site_update_room_self") || (val.permissions_name === "group_update_room"))) {
                updatePermitted = 1;
            };

            // Set Delete Permission Level
            if ( ((val.permissions_name === "site_delete_room_self") || (val.permissions_name === "group_delete_room"))) {
                deletePermitted = 1;
            };
        })

        if (readPermitted === 2) {
            queryData = await RoomModel.retrieve_room_by_room_id(req.params.roomID, "elevated");
        } else 
        if (readPermitted === 1) {
            queryData = await RoomModel.retrieve_room_by_room_id(req.params.roomID, "public");
        };
        
        if (!queryData) {
            throw new ExpressError("Room not found.", 404);
        }

        const output = {...queryData, canUpdate: updatePermitted, canDelete: deletePermitted};

        return res.json({equip: output});
    } catch (error) {
        next(error)
    }
});


/* _   _ ____  ____    _  _____ _____ 
  | | | |  _ \|  _ \  / \|_   _| ____|
  | | | | |_) | | | |/ _ \ | | |  _|  
  | |_| |  __/| |_| / ___ \| | | |___ 
   \___/|_|   |____/_/   \_\_| |_____|
*/
// Manual Test - Basic Functionality: 03/24/2022
roomRootRouter.patch("/:roomID",
    authMW.defineRoutePermissions({
        user: ["site_update_room_self"],
        group: ["group_update_room"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
        try {
            // Preflight
            const prevValues = await RoomModel.retrieve_room_by_room_id(req.params.roomID, "elevated");
            if (!prevValues) {
                throw new ExpressError(`Update Failed: Room Not Found`, 404);
            };

            const updateValues: RoomUpdateProps = {
                name: req.body.name,
                category_id: req.body.category_id,
                headline: req.body.headline,
                description: req.body.description,
                image_url: req.body.image_url,
                public: req.body.public
            };

            if(!validtteRoomUpdateSchema(updateValues)) {
                throw new ExpressError(`Update Error: ${validtteRoomUpdateSchema.errors}`, 400);
            };

            // Build update list for patch query 
            const itemsList = {};
            const newKeys = Object.keys(req.body);
            newKeys.map(key => {
                if(updateValues[key] !== undefined && (updateValues[key] != prevValues[key]) ) {
                    itemsList[key] = req.body[key];
                }
            })

            // If no changes return original data
            if(Object.keys(itemsList).length === 0) {
                return res.json({equip: [prevValues]});
            }

            // Update the user data with the itemsList information
            const newData = await RoomModel.modify_room(req.params.roomID, itemsList);
            return res.json({room: newData})
        } catch (error) {
            next(error)
        };
    }
);


/* ____  _____ _     _____ _____ _____ 
  |  _ \| ____| |   | ____|_   _| ____|
  | | | |  _| | |   |  _|   | | |  _|  
  | |_| | |___| |___| |___  | | | |___ 
  |____/|_____|_____|_____| |_| |_____|
*/
// Manual Test - Basic Functionality: 03/24/2022
roomRootRouter.delete("/:roomID", 
    authMW.defineRoutePermissions({
        user: ["site_delete_room_self"],
        group: ["group_delete_room"],
        public: []
    }),
    authMW.validateRoutePermissions,
    async (req, res, next) => {
    try {
        if (!req.user?.id) {throw new ExpressError(`Must be logged in to delete room`, 400);};

        let queryData;

        let groupDeletePermitted = 0;
        let siteDeletePermitted = 0;

        req.resolvedPerms?.forEach((val: any) => {
            // Set Delete Permission Level
            if (val.permissions_name === "site_delete_room_self") {
                siteDeletePermitted = 1;
            };

            if (val.permissions_name === "group_delete_room") {
                groupDeletePermitted = 1;
            };
        })

        if (siteDeletePermitted) {
            queryData = await RoomModel.delete_user_room(req.user.id, req.params.roomID);
        } else if (groupDeletePermitted) {
            const groupData = await RoomModel.retrieve_room_group_by_room_id(req.params.roomID);
            if (groupData?.id) {
                queryData = await RoomModel.delete_group_room(groupData.id, req.params.roomID);
            };
        };
        
        if(!queryData) {
            throw new ExpressError("Unable to delete target room", 404);
        }


        return res.json({message: "Room deleted."});
    } catch (error) {
        return next(error);
    }
});

export default roomRootRouter;